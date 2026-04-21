---
authors: ["Takamichi Tsutsumi"] # Add your name or multiple authors in an array
title: "Constant-Depth NTT for FHE-Based Private Proof Delegation" # The title of your article
image: "/articles/const-depth-ntt-for-fhe-based-ppd/cover.webp" # Image used as cover,  Keep in mind the image size, where possible use .webp format, possibly images less then 200/300kb
tldr: "We took benchmarks for constant depth NTT over FHE ciphertexts to see the feasibility of the state of the art FHE-based private proof delegation protocols." #Short summary
date: "2025-09-25" # Publication date in ISO format
tags: ["FHE", "ZKP"] # (Optional) Add relevant tags as an array of strings to categorize the article
projects: ["private-proof-delegation"]
---

Huge thanks to Keewoo and Nam for their sharp feedback, steady guidance, and countless practical suggestions that made this work stronger.

# 1. Introduction

FHE-SNARK is a compelling approach to private proof delegation: outsource zkSNARK proof generation to an untrusted server that homomorphically evaluates the prover’s algorithm, with the witness kept encrypted. A [recent work](https://eprint.iacr.org/2025/302) presents a cryptographic framework but without implementation and report only estimates on performance. In practice, that omission makes it hard to reason about feasibility and bottlenecks across the pipeline such as data parellelization or RAM/disks I/Os.

This post fills one specific gap: a **constant‑depth NTT over FHE ciphertexts**. NTTs (finite‑field FFTs) underpin polynomial IOPs and commitments, and—mirroring how fast FFT/NTT‑style transforms dominate modern FHE bootstrapping pipelines—they are the main subroutine in [recent work](https://eprint.iacr.org/2025/302). Our contribution is to implement an FHE‑friendly instantiation, integrate it into an FHE flow, and benchmark it.

## What this post is (and isn’t)

* **Is**: a focused, empirical clarification of the constant-depth NTT building block in an FHE-SNARK context.
* **Isn’t**: an end-to-end benchmark of the full protocol, or a comparison of unrelated acceleration techniques. We are intentionally isolating one missing measurement.

## Why constant-depth?

Depth drives noise growth and bootstrapping frequency. A standard log-depth NTT stacks multiplicative layers; a **constant-depth NTT** reorganizes butterflies and twiddle application so multiplicative depth is bounded (independent of input size), shifting costs toward data movement and plaintext twiddle loads. In our layout, all index movement is realized by 2D packing and plaintext multiplications; no ciphertext rotations or keyswitches are performed in the measured kernel.

## Our contribution

* **Implementation:** Rust + OpenFHE with Intel HEXL acceleration for NTT primitives.
* **Measurement:** runtime and homomorphic op counts (ct–pt multiplies, ct–ct adds) across sizes from ~1k to ~2.25M and depths 1–5 (focus on 3–4).
* **Positioning:** results interpreted strictly through the lens of FHE-SNARK’s polynomial subroutines, to help researchers decide whether to invest effort upstream (witness layout/extension) or downstream (FHE-SNARK optimization).

## Scope & audience

* **Scope:** the NTT kernel over ciphertexts, its constant-depth layout, and empirical behavior on Xeon Ice Lake with AVX-512.
* **Audience:** practitioners building proof delegation systems who need concrete numbers to plan engineering work, and researchers prioritizing optimization targets.

Outline: §2 reviews the FHE‑SNARK context; §3 details parameters, packing, and instrumentation; §4 reports results; §5 interprets them.


# 2. Background: FHE-SNARK & the Constant-Depth NTT Gap

**What FHE-SNARK is about.** The FHE-SNARK paper ([ePrint 2025/302](https://eprint.iacr.org/2025/302)) is a state‑of‑the‑art conceptual treatment (no implementation reported): run the SNARK prover *homomorphically* so a single untrusted server can generate a proof while the witness remains encrypted. It formalizes the model and the pipeline for evaluating the prover under HE, and explains why this could be competitive with alternatives. It’s primarily foundational—defining the paradigm and spelling out what needs to be efficient for it to matter in practice.

For context, see [ePrint 2023/1609](https://eprint.iacr.org/2023/1609.pdf) and [2023/1949](https://eprint.iacr.org/2023/1949) on verifiable computation over HE and delegation, and [ePrint 2024/1684](https://eprint.iacr.org/2024/1684.pdf) on blind/oblivious SNARK variants. 

In the FHE‑SNARK paper’s Ligero instantiation, the prover’s homomorphic workload is dominated by Reed–Solomon encoding, which Ligero uses for its codeword commitments; this encoding reduces to large batched NTT‑based evaluation and interpolation over the RS evaluation domain, making the NTT kernel the principal driver of runtime and multiplicative depth over HE ciphertexts. The main levers that govern feasibility here are:

* **Multiplicative depth** (drives noise growth and whether extra maintenance is needed), and
* **Data movement** (rotations and packing/unpacking overheads; rotations are not used in our measured kernel).
* **Operation count** (dominant ct–pt multiplies / ct–ct adds; count any keyswitches/rotations under ops when present).

**What the paper clarifies—and what it doesn’t.** The paper clarifies *how* an FHE‑evaluated prover can be structured and *why* polynomial ops are central. But it doesn’t publish **micro‑benchmarks** for any one kernel. In particular, we lack numbers for a **constant‑depth NTT** over ciphertexts: runtime vs. size, depth usage, **operation counts (including any keyswitches/rotations)**, and the corresponding effect on the noise budget.

**Why constant-depth matters.** A standard log-depth NTT stacks multiplicative layers; under HE, that means stacked noise growth and more frequent maintenance. A **constant-depth NTT** reorganizes the butterflies and twiddle application so the multiplicative depth is **bounded (size-independent)**. As noted in §3.5, our layout handles index movement via 2D packing and plaintext matrix multiplications; rotations and keyswitches are not used by this kernel.

**What we measure (and why it complements the paper).**
To fill this specific gap, we isolate and benchmark **constant-depth NTT over ciphertexts** on **real-world–sized transforms**. Our stack is **Rust + OpenFHE with Intel HEXL** acceleration. We report:

* Runtime vs. size (from ~1k to ~2.25M entries),
* Multiplicative depth exercised (we sweep depths 1–5), and
* Homomorphic op counts (ct–pt multiplies, ct–ct additions).

This is **not** an end-to-end FHE-SNARK benchmark. It’s a focused, empirical clarification of a single kernel that the paper identifies as central but does not quantify. The result is a cleaner picture of where the true bottlenecks lie once NTT’s multiplicative depth is capped—so teams can prioritize the right optimizations in the rest of the pipeline.

We now specify parameters, packing, and how we instrument the kernel.


# 3. Methodology

This section fixes **what we built, measured** so others can reproduce or extend the results.

## 3.1 Target protocol & kernels

We benchmark the **constant‑depth NTT** that sits in the **Reed–Solomon (RS) layer** of the *Ligero* prover path used in the FHE‑SNARK paper. Under homomorphic evaluation, RS **encode/decode** (evaluation/interpolation) is implemented via forward/inverse NTTs; our measurements quantify that kernel in isolation.


## 3.2 Field and NTT domain

* **Prime field:** $p = 2^{32}-2^{20}+1 = \mathbf{4\,293\,918\,721}$ (32‑bit prime).
* **Implication:** we can run power‑of‑two NTTs directly over $\mathbb{F}_p$, and we can fully batch over $X^N+1$ with $N=2^{14}$ (since $2N=2^{15} \mid (p-1)$).

### Rationale: prime choice

- **NTT constraints.** We need power‑of‑two NTTs for (i) the per‑ciphertext sub‑transforms and (ii) the top‑level NTT over the ciphertext grid. With $p-1 = 2^{20} \cdot 4095$, a primitive $2^{k}$‑th root exists for all $k \le 20$; in particular, $2N=2^{15}$ divides $p-1$, so negacyclic NTTs at $N=2^{14}$ are supported.
- **FHE constraints (packing).** Using BFV with plaintext modulus $t=p$ enables native batching over $X^N+1$ and cheap ct–pt multiplies. A 32‑bit $t$ keeps plaintext ops and twiddle tables cache‑friendly and aligns well with Intel HEXL’s vectorized kernels, improving throughput without changing multiplicative depth.
- **Alignment with FHE‑SNARK.** The FHE‑SNARK paper sketches ~50‑bit fields in its end‑to‑end setting. Our kernel results use a 32‑bit NTT‑friendly prime for practicality and restriction from OpenFHE implementation; production deployments can switch to a 64‑bit NTT‑friendly prime (e.g., Goldilocks). Which preserve the constant‑depth layout; the trade‑offs are mostly constant‑factor timing and memory.


## 3.3 HE scheme & ring parameters

* **Library / bindings:** Rust 1.91.0-nightly + **OpenFHE** + OpenFHE-rs (thin FFI bindings).
* **Optimization:** **Intel HEXL** enabled (`WITH_INTEL_HEXL=ON`).
* **Scheme:** BFV with plaintext modulus $t=p$.
* **Ring Dimension:** $2^{14}=16384$
* **Batching:** native BFV batching; all slots active.


## 3.4 Circuits, witness generation, and field port

We used **circom** to compile circuits and generate witnesses, ported to the new prime $p$.

* **Circuits:**

  * **Semaphore v4** (membership + nullifier).
  * **zk‑Twitter** (handle proof; Poseidon/Merkle path).
* **Field port:** changed circom’s field modulus to $p=4\,293\,918\,721$ and **tweaked gadgets** to remove dependencies on BabyJubJub/BN254 arithmetic. Concretely, in **Semaphore v4** we **replaced BabyJubJub + Poseidon ID generation** with a lighter **Poseidon Hash2**–based ID derivation (and removed the related range checks).
* **Resulting sizes (for reference on constraint magnitude):**

  * Original **BN128** (semaphore‑v4): **15,917 wires**, witness ≈ **509 KB**.
  * Current **BN128** (semaphore‑np, optimized): **5,550 wires**, witness ≈ **178 KB**.
  * The drop is from removing BabyJubJub arithmetic + range checks and using a lighter Poseidon + Merkle path.
  * *Note:* the above counts are for BN128 baselines; our **field‑ported** versions keep the same logic after replacing field‑specific gadgets. We report these here to indicate the **real‑world scale** we target when sizing NTT batches.

> **Security note.** Using a smaller field (32‑bit) changes soundness margins for RS‑based protocols (code distance, rate, soundness error). Our focus here is *kernel* benchmarking; end‑to‑end security must be re‑established at the protocol layer (e.g., by adjusting evaluation domain sizes/rounds). We flag this so readers don’t conflate kernel timing with final system security.


## 3.5 Constant‑depth NTT layout

We implement the NTT in a constant-depth, 2D layout. The goal is to keep multiplicative depth fixed (2–3) regardless of input size; we do this with 2D blocking plus plaintext twiddles and depth‑1 sub‑transforms:

1. Sub-transforms: Split the input into smaller subsequences, run NTTs on each at depth-1 (all in parallel).
2. Twiddle & merge (fused): apply plaintext twiddles and run the small group NTTs in a single pass (1 multiplication layer).

This way, the whole transform fits within a single multiplication depth per predetermined depth (i.e., the depth of recursion) instead of $\log n$. All index movement is handled via 2D packing and plaintext matrix multiplications; our implementation performs no ciphertext rotations and no keyswitches (counts = 0),.

## 3.6 NTT Sizes and Batching

- Field: prime $p = 2^{32} - 2^{20} + 1 = 4,293,918,721$.
- Ring: dimension $2^{14}=16,384$ (BFV).
- Circuit source: witnesses from Circom (Semaphore-v4, zk-Twitter), ported to this field.
- Witness size: from ~1k values up to ~2 million (zk-Twitter).

We pack field elements into ciphertext slots. The packing size is chosen near $\sqrt{M}$ for witness length $M$, rounded to a power of two. Inputs are then padded so the ciphertext count is also a power of two. This keeps the matrix shape balanced for the 2D NTT.

For a witness of length $M$, we use $\text{lanes} \approx 2^{\lfloor \log_2 \sqrt{M} \rfloor}$ per ciphertext and #CT $= \lceil M/\text{lanes} \rceil$, pad #CT to a power of two, and run an NTT of length #CT. Cost model: this constant‑depth layout uses $O(d\cdot n^{1+1/d})$ ct–pt multiplies (e.g., $O(n^{1.5})$ at $d=2$), trading multiplies for reduced depth (vs. $O(n\log n)$ at $\log n$ depth).

## 3.7 Metrics & Instrumentation

- Reported metrics: wall‑clock runtime, ct–pt multiplies, ct–ct additions.
- Rotations/keyswitches: not used by this kernel (see §3.5), so we omit those columns.
- Noise budget: we did not report a before/after delta for this kernel; adding this is straightforward and left as future work.
- Sanity checks: each run decrypts and compares against a plaintext NTT to confirm correctness (excluded from timing).


## 3.8 Hardware & run controls

* **Machine:** Intel Xeon Platinum 8375C (Ice Lake, AVX‑512), 1 socket, 8 cores/16 threads (SMT=2), base 2.90 GHz; L3 54 MiB; 128 GiB RAM.

Appendix A (Reproducibility) lists full toolchain, parameters, and the exact cargo command used to run these benchmarks.

---

This setup lets us answer the narrow question the paper left open—in the exact field and ring parameters we now target: **what does a constant‑depth NTT actually cost** (depth, op counts, milliseconds) when you run it the way an FHE‑evaluated *Ligero* prover would.



# 4. Results
**Headline:** 1.94 s (5.6k @ depth=3), 4.50 s (22k @ depth=4), 121.1 s (2.25M @ depth=4). *Lower-bound kernel timings.* In an end-to-end FHE-SNARK, NTTs are evaluated at a higher ciphertext modulus (i.e., more levels), so wall-clock will be modestly higher.



Reading the tables: lower time is better; counts shown are ct–pt multiplies and ct–ct additions; rotations/keyswitches are zero in this kernel.

| Witness size | Best depth | Time (s) | Throughput |
| -----------: | ---------: | -------: | ---------: |
|        5,570 |          3 |     1.94 |  ~2.86k elems/s |
|       22,280 |          4 |     4.50 |  ~4.95k elems/s |
|    2,250,280 |          4 |   121.11 | ~18.6k elems/s |

We measure three witness scales—from **\~5.6k** up to **\~2.25M** entries—spanning the tweaked Semaphore v4, its original-sized variant, and a zk‑Twitter–scale input.


### 4.1 Semaphore v4 (tweaked to 32‑bit field)

Witness entries: **5,570**

| depth |   time (s) | ct–pt multiplies | ct–ct additions |
| ----: | ---------: | ---------: | --------: |
|     1 |    11.4158 |     16,384 |    16,256 |
|     2 |     2.6045 |      3,072 |     2,816 |
|     3 | **1.9449** |  **2,048** | **1,664** |
|     4 |     2.7946 |      2,816 |     2,304 |
|     5 |     2.5411 |      2,048 |     1,408 |

* **Best:** depth **3** → **1.94 s** (\~**2.86k elems/s**, \~**0.35 ms/elem**).
* **Speedup vs depth‑1:** \~**5.9×**.
* **Note:** past depth‑3, overhead outweighs the smaller op counts.

### 4.2 Semaphore v4 (original‑size, same field)

Witness entries: **22,280**

| depth |   time (s) | ct–pt multiplies | ct–ct additions |
| ----: | ---------: | ---------: | --------: |
|     1 |    45.4127 |     65,536 |    65,280 |
|     2 |     6.4632 |      8,192 |     7,680 |
|     3 |     5.3701 |      6,144 |     5,376 |
|     4 | **4.4982** |  **4,096** | **3,072** |
|     5 |     6.6192 |      6,144 |     4,864 |

* **Best:** depth **4** → **4.50 s** (\~**4.95k elems/s**, \~**0.20 ms/elem**).
* **Speedup vs depth‑1:** \~**10.1×**.
* **Observation:** as size grows, the sweet spot shifts from **3 → 4**.

### 4.3 zk‑Twitter–scale (similar witness size on 32‑bit field)

Witness entries: **2,250,280**

| depth |     time (s) |  ct–pt multiplies |   ct–ct additions |
| ----: | -----------: | ----------: | ----------: |
|     1 |  11,729.7076 |  16,777,216 |  16,773,120 |
|     2 |     387.0503 |     524,288 |     516,096 |
|     3 |     160.5035 |     196,608 |     184,320 |
|     4 | **121.1053** | **131,072** | **114,688** |
|     5 |     133.9219 |     131,072 |     110,592 |

* **Best:** depth **4** → **121.11 s** (\~**18.6k elems/s**, \~**53.8 µs/elem**).
* **Speedup vs depth‑1:** \~**97×**.
* **Note:** depth‑5 trims ops slightly but adds memory traffic and twiddle‑load overhead; beyond depth‑4 that overhead outweighs the saved multiplies, so **depth‑4** wins.

### 4.4 Takeaways

* **Constant‑depth works.** Depth‑1 (naïve matrix NTT) is impractical at scale; depth **3–4** is **5–97× faster** across our sizes.
* **Size decides the sweet spot.** Small (\~5.6k) prefers **3**; medium/large (22k–2.25M) prefers **4**.
* **Cost shifts to data movement.** After the sweet spot, runtime flattens even as op counts drop—overheads (layout, scheduling, memory, twiddle loads) dominate.
* **Feasible at real scale.** With **depth‑4**, a single Ice Lake socket processes **\~2.25M** field elements in **\~2 minutes**.

# 5. Discussion & Conclusion

**What we showed.** Constant‑depth NTT over ciphertexts is **practical** at real scales in the FHE‑SNARK (Ligero/RS) setting. On a single Intel Xeon Platinum 8375C (Ice Lake, AVX‑512) socket and a 32‑bit field:

* Depth‑1 (naïve matrix) is a non‑starter at scale.
* Depth **3–4** delivers **5×–97×** speedups and keeps depth bounded.
* The **sweet spot shifts with size**: \~5.6k entries → **depth‑3**; ≥22k up to \~2.25M → **depth‑4**.

**What this means for builders.**

* **NTT isn’t the blocker.** With a constant‑depth layout, the transform fits inside typical BFV depth budgets and runs in minutes even at \~2.25M elements.
* **Optimize for data movement.** Once depth is capped, runtime flattens as op counts fall—**memory traffic and scheduling** take over. Co‑design your **packing** (near‑square), **stride sets**, and **batch shape** with upstream/downstream steps.
* **Pick depth first, then tune.** Start at **depth‑3** (small/medium) or **depth‑4** (large), then adjust packing and ring parameters for your throughput/memory envelope.

**On the 32‑bit field.** We ported the circuits to $p=4{,}293{,}918{,}721$ to exercise the kernel. That choice is fine for NTT benchmarking, but **protocol soundness** in RS/Ligero must be re‑established for smaller moduli (e.g., domain size/rounds). See §3.2 “Rationale: prime choice” for how this prime satisfies NTT roots, aligns with OpenFHE packing, and how to lift to ~50‑bit effective modulus via CRT or use a 64‑bit NTT‑friendly prime. For production fields:

* Use **CRT** across several 32‑bit primes, or
* Switch to a **64‑bit prime** (e.g., Goldilocks) and expect roughly linear cost growth in ct–pt multiplies (constants depend on HEXL paths).

**Limits of this work.**

* **Kernel only.** We did not measure the full FHE‑SNARK pipeline.
* **Metrics coverage.** We reported time and ct–pt/ct–ct counts. Rotations/keyswitches are not used by this kernel (counts = 0), and we did not yet add a simple before/after noise‑budget delta.
* **One machine profile.** Results are single‑socket Ice Lake; microarchitecture changes will shift constants.

**Where to push next.**
* **R1CS modulus/porting:** R1CS circuits over a smaller prime field are non‑standard; existing BN254/BlS12‑based gadgets don’t carry over as‑is. Re‑audit soundness and constraints under the new modulus (e.g., range checks, hash/curve gadgets), and update any protocol‑level parameters accordingly.
* **Witness extension under HE:** End‑to‑end proving requires RS witness extension executed under HE; we did not explore this here. Tooling is currently sparse—build generators that perform extension, packing/padding, and correctness checks under HE to integrate with the NTT kernel.
* **Hardware:** explore GPU offload for rotations/KS; widen AVX‑512 utilization.
* **End‑to‑end:** plug this NTT into a E2E prover under FHE, re‑tune RS parameters for target soundness, and report wall‑clock/communication together.


**Bottom line.** The FHE‑SNARK paper left constant‑depth NTT unmeasured. We filled that gap with a concrete implementation and numbers across **\~1k → \~2.25M** elements. With **depth‑3–4**, NTT is **depth‑stable and fast enough**; the next wins will come from **layout and bandwidth** (rotations if introduced in future variants), not the butterfly.

---

# Appendix A. Reproducibility

- **Repo:** https://github.com/tkmct/fhe-snark
- **HE libs:** OpenFHE v1.2.4 (shared libs on system); Intel HEXL v1.2.5 enabled at OpenFHE build time. If relevant, also record exact commit hashes and build flags.
- **CPU:** Intel Xeon Platinum 8375C (Ice Lake), x86_64, 1 socket, 8 cores/16 threads (SMT=2), base 2.90 GHz; caches: L1d 384 KiB (8×), L1i 256 KiB (8×), L2 10 MiB (8×), L3 54 MiB (1×); NUMA nodes: 1; AVX‑512 supported; virtualization: KVM.
- **Memory:** 128GiB
