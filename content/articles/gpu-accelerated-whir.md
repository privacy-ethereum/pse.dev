---
authors: ["Miha Stopar"] # Add your name or multiple authors in an array
title: "GPU-Accelerated WHIR Proving on Apple Silicon" # The title of your article
image: null
tldr: "Apple Silicon GPU acceleration for WHIR proving reaches up to 2x speedups on M1 by fusing NTT, Poseidon2 Merkle hashing, and proof-of-work grinding in Metal."
date: "2026-05-13"
canonical: "https://ethresear.ch/t/gpu-accelerated-whir-proving-on-apple-silicon/24762"
tags: ["client-side proving", "gpu", "whir", "metal", "zkp", "post-quantum"]
projects: ["client-side-proving"]
---

# GPU-Accelerated WHIR Proving on Apple Silicon

This post was originally published on [Ethereum Research](https://ethresear.ch/t/gpu-accelerated-whir-proving-on-apple-silicon/24762).

## Acknowledgments

Thank you to Moven Tsai for the Apple M3 MacBook and iPhone benchmark results in Section 4, and to Alex Kuzmin for WHIR discussions.

---

## TL;DR

We accelerated the [WHIR](https://eprint.iacr.org/2024/1586) prover on Apple Silicon GPUs using Metal compute shaders, achieving **up to 2.03x speedup** over highly optimized CPU code (SIMD + LTO + `target-cpu=native`) on an M1 chip, **up to 2.58x** on a supplementary Apple M3 MacBook run, and **about 1.4-2.3x** on a sparse sample from the **WHIR Bench** iOS app (Metal **Apple A19** GPU; see Section 4). The GPU pipeline fuses NTT (Number Theoretic Transform), bit-reversal, Poseidon2 Merkle tree hashing, and proof-of-work grinding into single command buffer submissions, exploiting Apple Silicon's unified memory architecture. The implementation is open source and runs on any Mac with Apple Silicon, with that same app for on-device iPhone testing.

**Key findings:**

- GPU wins for all tested configurations at polynomial sizes >= 2^20 (1M+ coefficients)
- Fused DFT+Merkle pipeline avoids CPU round-trips and provides the biggest gains
- Apple Silicon's unified memory eliminates PCIe transfer costs, but introduces a subtler tradeoff: shared-mode buffers (CPU+GPU accessible) are slower for GPU compute than GPU-managed buffers due to cache coherence overhead. Our pipeline uses a hybrid approach.
- The Poseidon2 Merkle kernel is the dominant cost (~58% of GPU time). Xcode GPU profiler shows high ALU utilization and no obvious stalls, suggesting we are close to hardware limits for this workload, though Apple does not publish precise integer throughput specs to confirm.
- Compiler optimizations (LTO, `target-cpu=native`) improved the CPU baseline by ~25%, making the GPU harder to beat but improving absolute end-to-end performance

**Repository**: [github.com/privacy-ethereum/whir-p3-metal](https://github.com/privacy-ethereum/whir-p3-metal)

Our work builds on [tcoratger/whir-p3](https://github.com/tcoratger/whir-p3), a Rust implementation of the WHIR protocol using the [Plonky3](https://github.com/Plonky3/Plonky3) library. We added Metal GPU acceleration to this codebase. (Lineage: [WizardOfMenlo/whir](https://github.com/WizardOfMenlo/whir) → [whir-p3](https://github.com/tcoratger/whir-p3) → **whir-p3-metal**.)

**Disclosure.** The Metal GPU implementation (Rust and MSL), supporting tooling, and the prose in this article were produced with substantial assistance from [Claude](https://www.anthropic.com/claude) (Anthropic), an AI coding assistant, under human direction, review, and benchmarking. Cryptographic soundness follows the published WHIR / Plonky3 specifications and upstream code; any mistakes in integration, performance claims, or interpretation remain the responsibility of the project maintainers.

---

## 1. Motivation: Why Client-Side Proving Matters

Ethereum's transparency comes at a privacy cost: every transaction is permanently visible, and chain analysis tools can link pseudonymous addresses to real identities. Zero-knowledge proofs can restore privacy, but delegating proof generation to a server defeats the purpose -- the server sees your private inputs.

True privacy requires **client-side proving**: users generate proofs on their own devices. This matters for:

- **Private payments** -- hiding amounts, counterparties, and transaction patterns
- **Identity** -- proving facts about credentials (age, citizenship, membership) without revealing the credential itself ([ZK Email](https://prove.email/), [Anon Aadhaar](https://github.com/anon-aadhaar/anon-aadhaar))
- **Voting** -- anonymous participation in DAOs and governance ([Semaphore](https://semaphore.pse.dev/))

The barrier is performance. Proving on consumer hardware must be fast enough for interactive use. Server-side GPU provers (CUDA on datacenter GPUs) achieve dramatic speedups, but client devices have different constraints: thermal limits, shared memory bandwidth, smaller GPU core counts, and no discrete VRAM.

### The Client-Side GPU Opportunity

Modern phones and laptops contain increasingly capable GPUs. Apple Silicon's M-series and A-series chips share unified memory between CPU and GPU, eliminating the PCIe transfer bottleneck that dominates datacenter GPU proving. This architectural difference creates a unique opportunity for fine-grained CPU-GPU cooperation.

Several projects are exploring this space:

- **[Mopro](https://zkmopro.org/blog/client-side-gpu-everyday-ef-privacy/)** -- Metal MSM acceleration ([v2 write-up](https://zkmopro.org/blog/metal-msm-v2/)), WebGPU field ops benchmarks showing 100x+ throughput on small fields vs BN254
- **[ICICLE Metal](https://medium.com/@ingonyama/icicle-goes-metal-v3-6-163fa7bbfa44)** -- MSM and NTT primitives for Apple Metal, up to 5x acceleration (v3.6)
- **[zkSecurity / Stwo WebGPU](https://blog.zksecurity.xyz/posts/webgpu/)** -- 2x overall proving speedup for Circle STARKs in the browser via WebGPU compute shaders
- **[Ligetron](https://github.com/ligeroinc/ligero-prover)** -- WebGPU SHA-256 and NTT for cross-platform proving
- **[FibRace](https://arxiv.org/abs/2510.14693)** -- large-scale mobile benchmark (6,000+ participants, 2.1M proofs) showing most modern smartphones prove in <5 seconds

Our work focuses on a specific, practically relevant target: accelerating the **WHIR** polynomial commitment scheme, which is hash-based and post-quantum secure, using Apple's Metal API for native GPU compute.

---

## 2. WHIR: Background

[WHIR](https://eprint.iacr.org/2024/1586) (Gal Arnon, Weizmann Institute; Alessandro Chiesa, EPFL; Giacomo Fenzi, EPFL; Eylon Yogev, Bar-Ilan University; published at [EUROCRYPT 2025](https://iacr.org/cryptodb/data/paper.php?pubkey=35004)) is an Interactive Oracle Proof of proximity for Reed-Solomon codes. It serves as an efficient replacement for [FRI](https://eccc.weizmann.ac.il/report/2017/134/), [STIR](https://eprint.iacr.org/2024/390), and [BaseFold](https://eprint.iacr.org/2023/1705), with notably fast verification (hundreds of microseconds vs. milliseconds for alternatives).

For proving, the dominant costs are:

1. **NTT (Number Theoretic Transform)** -- polynomial evaluation over extension domains
2. **Merkle tree construction** -- Poseidon2 hashing for polynomial commitments
3. **Proof-of-work grinding** -- finding nonces satisfying hash difficulty targets (Fiat-Shamir security)

All three are massively parallel and map well to GPU compute. The prover executes multiple STIR rounds, each involving an NTT, a Merkle commitment, and a PoW grind. Between rounds, the CPU performs sumcheck operations that are sequential across rounds.

Our implementation builds on [tcoratger/whir-p3](https://github.com/tcoratger/whir-p3), which uses the [Plonky3](https://github.com/Plonky3/Plonky3) library's field arithmetic and WHIR protocol implementation over the BabyBear field (prime p = 2^31 - 2^27 + 1, in Montgomery form).

---

## 3. GPU Architecture and Implementation

### 3.1 Why Metal (not WebGPU or CUDA)

- **Unified memory**: Apple Silicon shares physical memory between CPU and GPU. This eliminates the PCIe transfer bottleneck reported by [WebGPU](https://blog.zksecurity.xyz/posts/webgpu/) and CUDA proving projects. However, as we discuss in Section 6, "unified" does not mean "free" -- there are important cache coherence tradeoffs.
- **Low dispatch overhead**: Metal command buffers can be built on CPU while previous work executes on GPU, enabling tight pipelining.
- **Native performance**: Metal Shading Language (MSL) compiles to AIR (Apple Intermediate Representation) at build time and to device-specific machine code at load time. No runtime shader compilation overhead.
- **iOS compatibility**: The same Metal code runs on iPhone and iPad, enabling mobile benchmarking.

The tradeoff is platform lock-in to Apple. For cross-platform deployment, WebGPU (via [wgpu](https://github.com/gfx-rs/wgpu)) would be the alternative, at some performance cost.

### 3.2 Pipeline Architecture

The GPU pipeline fuses multiple stages into a single Metal command buffer:

```
CPU input buffer (zero-copy shared memory)
    │
    ├── Radix-16/32 DIF-NTT stages (in-place on GPU-managed buffer)
    │       Uses R32, R16, R8, R4, R2 butterfly kernels
    │       Shared-memory kernels for final stages (up to 4096 elements/threadgroup)
    │
    ├── Bit-reversal permutation (fused with final NTT stage)
    │       Writes directly back to zero-copy buffer
    │
    ├── Poseidon2 leaf hashing (width-16, 8+13+4 rounds, x^7 S-box)
    │       4-leaf fused kernel: hashes 4 leaves + first Merkle compress in one dispatch
    │
    ├── Poseidon2 Merkle compression (all remaining tree levels)
    │       SIMD shuffle kernel for small levels (avoids threadgroup memory)
    │
    └── [Single GPU wait] → Results in CPU-accessible memory
```

This fusion eliminates 3-4 CPU-GPU synchronization points per STIR round compared to a naive implementation.

### 3.3 Key Optimizations (30 iterations)

We went through 30 optimization iterations. The most impactful ones:


| #     | Optimization                                | Impact                      |
| ----- | ------------------------------------------- | --------------------------- |
| 1-4   | Basic Metal NTT + Merkle kernels            | Baseline GPU path           |
| 5-8   | Radix-16 DIF, shared-memory butterflies     | 2-3x NTT speedup            |
| 9-12  | Fused DFT+Merkle pipeline, zero-copy I/O    | 1.5-2x end-to-end           |
| 13-16 | Poseidon2 4-leaf fused kernel, SIMD Merkle  | 1.3x Merkle speedup         |
| 17-20 | GPU PoW grinding, zero-copy EF conversions  | Helps PoW-dominated configs |
| 21-24 | Extension field zero-copy, per-round fusion | 1.2x for large n            |
| 25-28 | LTO, `target-cpu=native`, profiling-guided  | 10% absolute improvement    |
| 29-30 | R32 DIF kernel, packed transpose bypass     | 5-15ms/round savings        |


The most important lesson: **fusing operations to avoid CPU-GPU round-trips matters more than optimizing individual kernels**. The fused pipeline (single command buffer for DFT+Merkle) typically beats the non-fused path by 15-30%.

### 3.4 Montgomery Arithmetic in Metal

BabyBear field operations use [Montgomery form](https://en.wikipedia.org/wiki/Montgomery_modular_multiplication) throughout the GPU kernels. Montgomery multiplication replaces expensive division-based modular reduction with cheaper multiply-and-shift operations. The key insight is that for a 31-bit prime like BabyBear (p < 2^31), multiplying two elements produces a product that fits in 62 bits. The standard approach would require 64-bit arithmetic to hold this intermediate result. However, the Montgomery reduction algorithm can be implemented using only **32-bit multiplications** if you have access to the **high 32 bits** of a 32x32→64 multiply.

This is where Metal's `mulhi(a, b)` intrinsic is critical: it returns the upper 32 bits of the 64-bit product `a * b` in a single instruction. Without `mulhi`, you'd need to emulate 64-bit arithmetic using multiple 32-bit operations (4+ instructions), which is what happens on GPUs without native `mulhi` support.

```metal
inline uint bb_mont_mul(uint a, uint b) {
    uint lo = a * b;               // low 32 bits of a*b
    uint q  = lo * BB_MONT_NINV;   // Montgomery quotient: lo * (-p^{-1}) mod 2^32
    uint hi = mulhi(a, b);         // high 32 bits of a*b (the critical intrinsic)
    uint qn_hi = mulhi(q, BB_P);   // high 32 bits of q*p
    uint t = hi - qn_hi;           // result in [0, 2p)
    return (t >= BB_P) ? t - BB_P : t;
}
```

The entire Montgomery multiply uses just 2 `mul` + 2 `mulhi` + 1 subtract + 1 conditional subtract -- six 32-bit integer operations. Apple GPU cores have native 32-bit integer ALUs, so each of these maps to a single hardware instruction.

**Why this matters for performance**: BabyBear is a 31-bit prime, so all field elements fit in a single 32-bit GPU register. By contrast, elliptic curve fields like BN254 (254-bit) require **8 limbs** of 32-bit integers per element, and a single field multiply requires ~64 multiply-add operations with carry propagation. This is the fundamental reason why small-field proving systems (BabyBear, Mersenne-31) are dramatically faster on GPUs than large-field systems (BN254, BLS12-381).

[Mopro's field operation benchmarks](https://zkmopro.org/blog/client-side-gpu-everyday-ef-privacy/) quantify this: on an Apple M3 chip, BabyBear/M31 field multiplication achieves ~112 GOP/s (giga-operations per second) via Metal, while BN254 field multiplication achieves <1 GOP/s -- a **100x+ difference**. This gap exists because BN254 requires ~100x more 32-bit ALU operations per field multiply, and GPU cores are fundamentally 32-bit machines.

---

## 4. Benchmark Results

### Setup

- **Hardware**: Apple M1 (8 GPU cores, 16GB unified memory, 68.25 GB/s bandwidth)
- **Software**: Rust nightly 1.97.0, macOS 15.5, release build with LTO (thin) + `codegen-units=1` + `target-cpu=native`
- **Methodology**: 3 runs per configuration, **median** reported
- **Baseline**: Highly optimized CPU path using Plonky3's Radix2DFT with NEON SIMD, rayon parallelism, and the same LTO/native settings

### Parameters

- `n` = number of variables (polynomial has 2^n coefficients)
- `fold` = folding factor per STIR round
- `rate` = starting log inverse rate (RS code rate = 1/2^rate)

### Results

29 configurations tested. "Best GPU" = minimum of GPU, FUSED, and GRIND modes.

#### n=20 (1M coefficients)


| fold | rate | CPU (ms) | Best GPU (ms) | Speedup   |
| ---- | ---- | -------- | ------------- | --------- |
| 1    | 1    | 267      | 171           | **1.56x** |
| 1    | 2    | 453      | 290           | **1.56x** |
| 1    | 3    | 897      | 483           | **1.86x** |
| 2    | 1    | 127      | 75            | **1.70x** |
| 2    | 2    | 217      | 122           | **1.78x** |
| 2    | 3    | 414      | 210           | **1.98x** |
| 4    | 1    | 49       | 35            | **1.41x** |
| 4    | 2    | 89       | 53            | **1.70x** |
| 4    | 3    | 200      | 120           | **1.67x** |


#### n=22 (4M coefficients)


| fold | rate | CPU (ms) | Best GPU (ms) | Speedup   |
| ---- | ---- | -------- | ------------- | --------- |
| 1    | 1    | 1174     | 579           | **2.03x** |
| 1    | 2    | 1938     | 1092          | **1.77x** |
| 1    | 3    | 3459     | 1934          | **1.79x** |
| 2    | 1    | 441      | 287           | **1.54x** |
| 2    | 2    | 805      | 484           | **1.66x** |
| 2    | 3    | 1676     | 897           | **1.87x** |
| 3    | 1    | 206      | 138           | **1.49x** |
| 3    | 2    | 381      | 248           | **1.54x** |
| 3    | 3    | 897      | 611           | **1.47x** |
| 4    | 1    | 166      | 128           | **1.30x** |
| 4    | 2    | 322      | 215           | **1.50x** |
| 4    | 3    | 661      | 530           | **1.25x** |
| 6    | 1    | 141      | 98            | **1.44x** |
| 6    | 2    | 410      | 327           | **1.25x** |
| 6    | 3    | 1763     | 1320          | **1.34x** |


#### n=22, rate > 3 (extended)

For `rate > 3`, the evaluation domain and intermediate buffers grow quickly. The Metal dispatch path applies conservative **defaults** (see `gpu_dft.rs`): roughly **`log_n <= 24`** and **1 GiB** of GPU-eligible storage (`WHIR_GPU_MAX_LOG_N` / `WHIR_GPU_MAX_TOTAL_BYTES`). Without raising those, n=22 at higher rates usually **stays on CPU** or hits the same class of cap as in the n=24 note below.

The rows below use the **same hardware and methodology** as the main tables (3 runs per mode, **median** reported; **Best GPU** = minimum of the medians for `gpu`, `gpu_fused`, and `gpu_grind`). Before running, set:

```bash
export WHIR_GPU_MAX_LOG_N=28
export WHIR_GPU_MAX_TOTAL_BYTES=4294967296   # 4 GiB
./bench.sh 22 1 5   # example: single (n, fold, rate)
```

| fold | rate | CPU (ms) | Best GPU (ms) | Speedup   |
| ---- | ---- | -------- | ------------- | --------- |
| 1    | 5    | 15226    | 9300          | **1.64x** |
| 2    | 5    | 6327     | 3644          | **1.74x** |
| 3    | 5    | 8694     | 3779          | **2.30x** |
| 4    | 5    | 7546     | 4568          | **1.65x** |
| 2    | 6    | 17142    | 8408          | **2.04x** |

**Why some (n, fold, rate) pairs fail or are omitted.** This is not the same closed 29-config grid as above; GPU at `rate > 3` is **experimental**.

- **Domain and memory caps**: If buffers exceed the default `log_n` or byte budget, the code **refuses GPU** and uses CPU (by design). The env overrides above relax that for benchmarking only; you need enough **unified memory** headroom.
- **(n=22, fold=1, rate=6)**: In our runs, **every GPU mode exited without a usable timing** (no successful GPU proof timing), while CPU still completed. Likely interaction of **very large allocations** with the Metal pipeline or a bug in an edge-case layout—not investigated to root cause here.
- **(n=22, fold=6, rate=5)**: **CPU** completed in O(10²) seconds in probes, but **GPU runs did not finish** in practical wall time (hang or extreme PoW variance on the GPU path). High **fold** increases the number of rounds and **Fiat–Shamir grinding**; combined with a large domain, the accelerated path is much less predictable than at fold 1–4.
- **Driver and stability**: On aggressive settings, the GPU process can **abort** (e.g. signal exit) on some machines—another reason defaults stay conservative.

At these parameters, **GRIND** often supplies the best GPU median when PoW dominates; **FUSED** still wins on some rows (for example fold=1, rate=5 here).


#### n=24 (16M coefficients)


| fold | rate | CPU (ms) | Best GPU (ms) | Speedup   |
| ---- | ---- | -------- | ------------- | --------- |
| 1    | 1    | 4153     | 2463          | **1.69x** |
| 2    | 1    | 1814     | 1049          | **1.73x** |
| 3    | 1    | 890      | 531           | **1.68x** |
| 4    | 1    | 978      | 694           | **1.41x** |
| 6    | 1    | 588      | 405           | **1.45x** |


> n=24 rate>=2 exceeds the GPU domain cap (2^25 elements) and is not tested.

### Supplementary: Apple M3 MacBook

The tables below repeat the same parameter meanings as above on a different machine for readers on newer Apple Silicon. **Best GPU** is the minimum of the three GPU modes (`GPU`, `FUSED`, `GRIND`) per row, matching the M1 tables.

- **Hardware**: Apple M3 (MacBook, unified memory)
- **Software**: Rust 1.95.0 (2026-04-14), macOS 15.7.5 (arm64), release build with the same class of optimizations as the M1 run (LTO, native CPU codegen for the baseline)
- **Methodology**: 3 runs per configuration, **median** reported for each column; speedup = CPU median / Best GPU median
- **Date**: 2026-04-27

#### n=20 (1M coefficients)

| fold | rate | CPU (ms) | Best GPU (ms) | Speedup   |
| ---- | ---- | -------- | ------------- | --------- |
| 1    | 1    | 202.4    | 109.8         | **1.84x** |
| 1    | 2    | 349.3    | 174.7         | **2.00x** |
| 1    | 3    | 616.3    | 290.3         | **2.12x** |
| 2    | 1    | 83.4     | 51.9          | **1.61x** |
| 2    | 2    | 138.8    | 78.8          | **1.76x** |
| 2    | 3    | 262.2    | 136.9         | **1.92x** |
| 4    | 1    | 30.8     | 28.1          | **1.10x** |
| 4    | 2    | 55.2     | 39.2          | **1.41x** |
| 4    | 3    | 113.5    | 85.5          | **1.33x** |

#### n=22 (4M coefficients)

| fold | rate | CPU (ms) | Best GPU (ms) | Speedup   |
| ---- | ---- | -------- | ------------- | --------- |
| 1    | 1    | 744.0    | 394.3         | **1.89x** |
| 1    | 2    | 1557.9   | 617.9         | **2.52x** |
| 1    | 3    | 3006.7   | 1164.2        | **2.58x** |
| 2    | 1    | 704.9    | 173.4         | **4.07x** |
| 2    | 2    | 618.0    | 297.3         | **2.08x** |
| 2    | 3    | 1210.2   | 552.3         | **2.19x** |
| 3    | 1    | 172.7    | 97.3          | **1.77x** |
| 3    | 2    | 316.5    | 164.4         | **1.93x** |
| 3    | 3    | 617.3    | 385.6         | **1.60x** |
| 4    | 1    | 121.3    | 79.9          | **1.52x** |
| 4    | 2    | 226.1    | 141.0         | **1.60x** |
| 4    | 3    | 510.6    | 382.9         | **1.33x** |
| 6    | 1    | 108.8    | 72.4          | **1.50x** |
| 6    | 2    | 335.3    | 242.5         | **1.38x** |
| 6    | 3    | 1573.3   | 1064.1        | **1.48x** |

At **(n=22, fold=2, rate=1)** the M3 sheet shows a **4.07x** Best GPU speedup; that row is an outlier relative to the rest of the grid and to the M1 n=22 fold=2 rate=1 cell (**1.54x**). Treat it as worth re-running (PoW variance, thermal state, or an uncharacteristic CPU median) before drawing a strong conclusion.

#### n=24 (16M coefficients)

| fold | rate | CPU (ms) | Best GPU (ms) | Speedup   |
| ---- | ---- | -------- | ------------- | --------- |
| 1    | 1    | 3390.6   | 1432.3        | **2.37x** |
| 2    | 1    | 1538.3   | 688.7         | **2.23x** |
| 3    | 1    | 708.5    | 370.8         | **1.91x** |
| 4    | 1    | 809.7    | 549.3         | **1.47x** |
| 6    | 1    | 438.5    | 333.7         | **1.31x** |

### Supplementary: iPhone (WHIR Bench, Apple A19 GPU)

The iOS app reports wall times in milliseconds for a **single GPU mode** per tap (not the Mac `bench.sh` grid of FUSED/GRIND variants). The table below is a **sparse** set of configurations (not the full M1 29-cell grid). Speedup is CPU time divided by GPU time for each row.

- **App**: WHIR Bench (project `ios/` target)
- **GPU**: Metal reports **Apple A19 GPU**
- **Units**: milliseconds (on-device WHIR Bench run)

| n  | fold | rate | CPU (ms) | GPU (ms) | Speedup   |
| -- | ---- | ---- | -------- | -------- | --------- |
| 20 | 1    | 1    | 240      | 133      | **1.8x**  |
| 20 | 2    | 2    | 196      | 105      | **1.9x**  |
| 20 | 4    | 3    | 207      | 121      | **1.7x**  |
| 22 | 1    | 1    | 1068     | 486      | **2.2x**  |
| 22 | 1    | 2    | 1942     | 886      | **2.2x**  |
| 22 | 2    | 1    | 482      | 238      | **2.0x**  |
| 22 | 3    | 2    | 437      | 246      | **1.8x**  |
| 22 | 4    | 3    | 739      | 517      | **1.4x**  |
| 24 | 1    | 1    | 4618     | 2019     | **2.3x**  |
| 24 | 2    | 1    | 2017     | 976      | **2.1x**  |
| 24 | 3    | 1    | 1055     | 540      | **2.0x**  |
| 24 | 4    | 1    | 1197     | 845      | **1.4x**  |

### Key Observations

**GPU is faster than CPU for all 29 tested configurations at n >= 20** in the main M1 grid above. The speedup ranges from 1.25x to 2.03x, with the best results at low fold values and higher rates. On the **M3** supplementary grid (Section 4), every listed configuration also beats CPU on Best GPU, with most speedups between **1.10x** and **2.58x**, plus one **(n=22, fold=2, rate=1)** outlier at **4.07x** (see note there). The **iPhone (A19)** WHIR Bench sample in Section 4 also shows GPU faster than CPU on every listed row (**~1.4-2.3x**), with the same qualitative pattern that **fold=4** rows are the tightest. **n=22, rate > 3** is a smaller, separately documented set (see table): GPU still wins on the configurations we could measure medians for, but other high-rate pairs fail caps, time out, or crash as described there.

**Low fold values give the best speedups** (1.5-2.0x at fold=1-2) because the NTT and Merkle tree dominate the runtime -- exactly the operations we accelerated. Higher fold values (fold=4-6) reduce the number of NTT elements per round but increase the number of rounds and PoW grinding, shifting work toward sumcheck (where GPU parallelism is harder to exploit -- see discussion in Section 7).

**Rate increases the workload and generally increases speedup** because the domain expansion (2^rate more points) creates more NTT and Merkle work, amplifying the GPU advantage.

**The CPU baseline is very strong.** Plonky3's BabyBear implementation uses NEON SIMD intrinsics with 4-wide packed operations. Combined with LTO and `target-cpu=native`, the CPU path improved ~25% during our optimization work (from Rust compiler updates and build settings). This makes the GPU speedup harder to achieve but more meaningful -- we're beating a genuinely optimized baseline.

---

## 5. Where the Time Goes

Profiling breakdown for a representative configuration (n=24, fold=3, rate=1, total GPU time ~537ms):


| Component                  | Time    | %   | Notes                          |
| -------------------------- | ------- | --- | ------------------------------ |
| GPU Poseidon2 Merkle       | ~315 ms | 58% | Compute-bound (Montgomery mul) |
| GPU DFT (NTT)              | ~75 ms  | 14% | Memory-bandwidth-limited       |
| CPU sumcheck               | ~80 ms  | 15% | External crate, SIMD-optimized |
| CPU constraint combination | ~45 ms  | 8%  | Partially GPU-offloaded        |
| GPU readback + dispatch    | ~24 ms  | 4%  | Zero-copy already in use       |


**Poseidon2 Merkle dominates.** Each Poseidon2 permutation (width-16) requires 25 rounds of S-box + MDS matrix operations, where each S-box is `x^7 = x * x * x * x * x * x * x` (6 Montgomery multiplications). With millions of leaves to hash and a full binary tree to compress, this is ~58% of the GPU runtime.

*How saturated is the GPU?* Xcode's Metal GPU profiler shows high ALU utilization (>85% occupancy) and no significant memory stalls for the Poseidon2 kernel. The kernel is compute-bound, not memory-bound. However, Apple does not publish precise integer ALU throughput specifications for their GPU cores, so we cannot calculate a rigorous percentage of theoretical peak. What we can say is: the profiler shows no obvious optimization opportunities (no wasted cycles, no memory bottlenecks, full occupancy), and our attempts to further optimize the kernel (loop unrolling, register pressure reduction) yielded no measurable improvement. This strongly suggests we are near the hardware limit for this workload, but we cannot prove it with a precise FLOP/s calculation as you could on NVIDIA hardware with published specs.

**NTT is memory-bandwidth-limited** (not compute-limited) because butterfly operations are simple (1 multiply + 1 add per pair) but access non-sequential memory addresses at large strides. Our radix-16/32 kernels reduce the number of global memory passes (see Section 7).

**CPU sumcheck is the remaining bottleneck** -- it lives in Plonky3's `p3-whir` crate and uses SIMD-optimized polynomial arithmetic. The sumcheck protocol is sequential across rounds (each round requires the verifier's random challenge before the next can begin). Within each round, the computation is parallelizable. We did not attempt to GPU-accelerate the within-round computation; whether this would help depends on whether the data transfer overhead (moving the polynomial to GPU and back each round) would outweigh the compute speedup. For our problem sizes, the within-round computation takes ~5-15ms, and the GPU dispatch + readback overhead is ~1-2ms, so there may be modest room for improvement. This remains future work.

---

## 6. Unified Memory: The Full Picture

The most common bottleneck reported by GPU proving projects is **CPU-GPU data transfer**. On discrete GPUs, transferring a 64MB polynomial over PCIe takes ~4ms (16 GB/s) -- comparable to the NTT computation itself. On Apple Silicon, CPU and GPU access the same physical DRAM, so this PCIe cost is eliminated entirely.

However, unified memory is not free of tradeoffs. Metal offers two buffer storage modes, and the choice matters significantly:

### Shared mode (`MTLResourceStorageModeShared`)

Both CPU and GPU can read/write the buffer. The hardware must maintain **cache coherence** -- when the GPU reads data the CPU recently wrote, the CPU's caches must be flushed so the GPU sees the latest values, and vice versa. This coherence has a performance cost:

- GPU reads from shared buffers are slower than from GPU-managed buffers
- The memory controller must mediate between CPU and GPU caches
- For large buffers, the cache flush can add ~0.1-0.5ms

### Managed mode (`MTLResourceStorageModePrivate`)

Only the GPU can access the buffer. No cache coherence is needed, so the GPU gets full memory bandwidth without contention. This is faster for GPU-intensive computation.

### Our hybrid approach

We discovered through profiling that **GPU-managed buffers are significantly faster for compute-heavy kernels** (NTT, Merkle). Our pipeline uses:

1. **Input**: CPU data lives in a **shared** buffer (zero-copy -- the CPU just writes polynomial coefficients, the GPU reads them directly).
2. **Intermediate compute**: The NTT copies data from the shared input buffer to a **GPU-managed** buffer for all butterfly stages. This copy is a single GPU-side `blit` that runs at full memory bandwidth.
3. **Bit-reversal output**: The final permutation writes results back to the **shared** buffer so the CPU can read Merkle results without a copy.

This hybrid approach gives us the best of both worlds: zero-copy input/output for the CPU, and full GPU bandwidth for the compute-heavy middle stages. The initial copy to GPU-managed memory costs ~0.3ms for a 64MB buffer but saves ~2-3ms in faster NTT execution.

Additionally, CPU and GPU cannot safely access the same shared buffer region concurrently during GPU execution -- there is no hardware coherence *during* a command buffer's execution. The CPU must wait for the GPU to signal completion before reading results. This is why our fused pipeline submits everything in a single command buffer and waits once at the end, rather than trying to overlap CPU reads with ongoing GPU work (which we tried, and it was slower -- see Section 7).

---

## 7. Lessons Learned

### NTT algorithm choices: DIT, DIF, and Stockham

The Number Theoretic Transform (NTT) is the finite-field analog of the FFT. There are several algorithmic variants, each with different memory access patterns -- a critical consideration for GPU performance:

**Decimation-in-Time (DIT)** ([Cooley-Tukey, 1965](https://doi.org/10.1090/S0025-5718-1965-0178586-1)): The classic FFT algorithm. Input is in bit-reversed order, output in natural order. Each butterfly stage reads two elements, multiplies one by a twiddle factor, and writes two results. Memory access strides start small (adjacent elements) and grow to N/2 in the final stage. The large strides in later stages cause poor cache utilization on GPUs.

**Decimation-in-Frequency (DIF)**: The "reverse" of DIT. Input is in natural order, output in bit-reversed order. Memory strides start large (N/2) and shrink to 1. For GPU workloads, DIF is often preferable because the *first* stages (which process the most data through global memory) have the *largest* strides -- and large strides with radix-16 butterfly patterns happen to map well to GPU memory coalescing when multiple butterflies are dispatched in parallel.

**Stockham auto-sort** ([Stockham, 1966](https://doi.org/10.1145/1464291.1464352)): An out-of-place variant that avoids the separate bit-reversal permutation by alternating between two buffers. Each stage reads from one buffer and writes to the other in a different order, so the output of the final stage is already in the correct order. The downside is 2x memory usage.

We settled on **DIF** as the primary algorithm for several reasons:

1. DIF's output is bit-reversed, but we need bit-reversed order anyway for the Merkle tree (leaves must be in evaluation-domain order). We fuse the bit-reversal with the last NTT stage, eliminating a separate permutation pass.
2. DIF naturally pairs with radix-16/32 decomposition (see below).
3. DIF's stride pattern works well with Apple GPU's memory subsystem.

We also implemented Stockham for comparison. It was competitive for small NTTs (< 2^16) where the extra buffer fits in GPU cache, but DIF was consistently faster for our workload sizes (2^20 to 2^25) due to lower memory pressure.

### Radix selection: why radix-16 (and radix-32)

A radix-R butterfly processes R elements at once, performing R log_R(N)/log_2(N) operations per stage but requiring only log_R(N) global memory passes instead of log_2(N). The tradeoff:

```
Radix-2:  Each butterfly: 1 mul + 1 add.  Passes for 2^24: 24
Radix-4:  Each butterfly: 3 mul + 8 add.  Passes for 2^24: 12
Radix-8:  Each butterfly: ~17 mul + add.   Passes for 2^24:  8
Radix-16: Each butterfly: ~43 mul + add.   Passes for 2^24:  6
Radix-32: Each butterfly: ~100 mul + add.  Passes for 2^24:  ~5
```

Since our NTT is **memory-bandwidth-limited** (each pass reads and writes the entire array), halving the number of passes roughly halves the runtime. The cost is more ALU work per pass, but GPU ALUs are underutilized during bandwidth-limited NTT passes, so the trade is favorable.

We use **radix-16 as the workhorse** because:

- 16 elements per butterfly = 16 registers, which fits comfortably in Apple GPU's register file
- Each thread processes 16 elements with 4 "layers" of radix-2 butterflies internally (since 16 = 2^4)
- Radix-32 (5 internal layers, 32 registers) also works and saves one pass for 2^24, but provides diminishing returns for smaller NTTs

Visually, a single radix-16 butterfly processes a block of 16 elements through 4 stages internally:

```
Stage 0 (stride 8):  [0,8] [1,9] [2,10] [3,11] [4,12] [5,13] [6,14] [7,15]
Stage 1 (stride 4):  [0,4] [1,5] [2,6] [3,7]   [8,12] [9,13] [10,14] [11,15]
Stage 2 (stride 2):  [0,2] [1,3] [4,6] [5,7]   [8,10] [9,11] [12,14] [13,15]
Stage 3 (stride 1):  [0,1] [2,3] [4,5] [6,7]   [8,9] [10,11] [12,13] [14,15]
```

Each pair `[i,j]` is a radix-2 butterfly: `a' = a + tw*b`, `b' = a - tw*b`. All 4 stages happen in registers (no global memory access), then the 16 results are written back. This means each global memory pass does 4 butterfly stages worth of work.

### The four-step FFT: tried and abandoned

The [four-step FFT algorithm](https://doi.org/10.1109/29.1532) (Bailey, 1990) decomposes a large 1D NTT into smaller 2D sub-transforms:

1. Interpret the input as an N1 x N2 matrix (row-major)
2. Perform N2 independent NTTs of size N1 (row transforms)
3. Multiply by twiddle factors
4. Transpose the matrix
5. Perform N1 independent NTTs of size N2 (column transforms)

The appeal is that the row/column NTTs are small enough to fit entirely in threadgroup shared memory (32KB on Apple GPU), avoiding global memory access during the butterfly stages. Only the transpose requires a global memory pass.

In practice, this was **20% slower** than our flat DIF approach because:

- The matrix transpose is not free -- it requires a global memory pass with poor coalescing patterns
- Shared memory bank conflicts during the row/column NTTs (16 elements per row = stride-16 access = worst-case bank conflicts on Apple GPU's 32-bank shared memory)
- The extra twiddle multiply pass adds another global memory round-trip
- Apple GPU shared memory is only 32KB per threadgroup, limiting the sub-NTT size to 2^13 = 8192 elements

### What didn't work

1. **Overlapping DFT readback with Merkle GPU work.** We tried using Metal events to let the CPU read NTT results from the shared buffer while the GPU started Merkle hashing on a separate managed buffer. This was **slower** because the CPU reads competed with the GPU for unified memory bandwidth. On Apple Silicon, the memory bus is shared, so CPU reads during heavy GPU compute effectively steal bandwidth cycles.
2. **GPU sumcheck.** The [sumcheck protocol](https://doi.org/10.1145/146585.146605) (Lund, Fortnow, Karloff, Nisan, 1992) has a sequential round structure: each round, the prover computes a univariate polynomial over a hypercube, the verifier sends a random challenge, and the prover "folds" the hypercube for the next round. This round-to-round dependency is inherently serial.
  We did **not** implement or benchmark GPU sumcheck. The sequential structure makes it a poor fit for GPU parallelism in principle, but we have not empirically verified this for our specific workload sizes. The within-round computation (summing over 2^(n-i) elements in round i) is embarrassingly parallel and could potentially benefit from GPU acceleration for early rounds with large hypercubes. This remains an open question. The [Thaler 2022 survey](https://doi.org/10.1561/0400000066) provides a thorough treatment of the sumcheck protocol and its optimization.

### Practical challenges

- **Benchmark variance from PoW.** Proof-of-work grinding has exponentially distributed completion times (searching for a random nonce). Single-run benchmarks can vary by 50%+ for PoW-heavy configurations. Using the median of 3 runs significantly reduces this noise.
- **Compiler optimizations help the CPU more than the GPU.** LTO and `target-cpu=native` improved CPU performance by ~25% but had minimal effect on GPU kernel performance (Metal shaders are compiled separately from Rust code). This narrowed the GPU/CPU ratio despite improving absolute performance.
- **Thermal throttling on mobile.** Extended benchmark runs on laptops (and especially phones) can trigger thermal throttling, reducing GPU clock speeds. Our benchmarks use the median of 3 runs to mitigate this, but real-world sustained performance may be lower.

---

## 8. Comparison with Related Work


| Project                | Target         | Protocol       | Speedup             | Field             | API    | Source                                                                                                        |
| ---------------------- | -------------- | -------------- | ------------------- | ----------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| **This work**          | Apple M1 GPU   | WHIR/Poseidon2 | **1.3-2.0x** vs CPU | BabyBear (31-bit) | Metal  | [repo](https://github.com/privacy-ethereum/whir-p3-metal)                                                     |
| **This work** (M3 run) | Apple M3 GPU   | WHIR/Poseidon2 | **1.1-2.6x** vs CPU (see §4; one cell **~4.1x**) | BabyBear (31-bit) | Metal  | same                                                                                                  |
| **This work** (iPhone) | Apple A19 GPU  | WHIR/Poseidon2 | **~1.4-2.3x** vs CPU (sparse WHIR Bench sample, §4) | BabyBear (31-bit) | Metal  | same                                                                                              |
| Mopro Metal MSM v2     | Apple GPU      | MSM (BN254)    | 40-100x vs v1       | BN254 (254-bit)   | Metal  | [write-up](https://zkmopro.org/blog/metal-msm-v2/), [code](https://github.com/zkmopro/gpu-acceleration)       |
| ICICLE Metal v3.6      | Apple GPU      | MSM, NTT       | up to 5x            | Multiple          | Metal  | [blog](https://medium.com/@ingonyama/icicle-goes-metal-v3-6-163fa7bbfa44), [docs](https://dev.ingonyama.com/) |
| ICICLE-Stwo (CUDA)     | Datacenter GPU | Circle STARK   | 3.25-7x vs CPU SIMD | M31 (31-bit)      | CUDA   | [blog](https://medium.com/@ingonyama/introducing-icicle-stwo-a-gpu-accelerated-stwo-prover-550b413d4f88)      |
| zkSecurity Stwo WebGPU | Browser GPU    | Circle STARK   | 2x overall          | M31               | WebGPU | [write-up](https://blog.zksecurity.xyz/posts/webgpu/), [PR](https://github.com/zksecurity/stwo/pull/10)       |
| Ligetron               | Browser/native | SHA-256, NTT   | N/A (WIP)           | Multiple          | WebGPU | [code](https://github.com/ligeroinc/ligero-prover)                                                            |


Our speedup numbers (1.3-2.0x) are more modest than MSM-focused projects because:

1. **We benchmark end-to-end proving**, including CPU-bound sumcheck rounds. The GPU-only portions (NTT + Merkle) show 3-4x speedup over non-SIMD CPU code.
2. **Our CPU baseline is extremely strong** -- Plonky3's BabyBear uses NEON SIMD 4-wide packed arithmetic, plus LTO and native CPU codegen.
3. **WHIR's workload is hash-dominated** (Poseidon2 Merkle ~58% of runtime), which has high arithmetic intensity but limited parallelism reduction compared to MSM.

Note that the Mopro MSM v2 speedup (40-100x vs v1) compares against their own v1, not against an optimized CPU baseline. Against Arkworks CPU MSM, the speedup is more modest. Similarly, ICICLE-Stwo's 3.25-7x compares against Stwo's CPU SIMD backend.

---

## 9. Future Directions

### Higher-arity Merkle trees

The Poseidon2 Merkle kernel dominates runtime (58%). A 4-ary or 8-ary tree would reduce the number of hash invocations by 2-3x, proportionally speeding up the GPU pipeline. This requires protocol-level changes in the WHIR commitment scheme.

### Newer Apple Silicon

Our primary published numbers are on M1 (2020). An M3 MacBook run (Section 4) shows the same qualitative story with often higher speedups on large `n` (for example **2.37x** at n=24, fold=1, rate=1 vs **1.69x** on M1 for the same cell). WHIR Bench on iPhone (A19, Section 4) lands in a similar band for the sampled cells (**2.3x** at n=24, fold=1, rate=1). The M4 Max has 40 GPU cores (vs 8 on M1) and 273 GB/s memory bandwidth (vs 68 GB/s). We expect further gains from newer chips; the repository includes a `bench.sh` script and the iOS app to make cross-device benchmarking easy -- contributions welcome.

### WebGPU backend

For cross-platform reach, a WebGPU ([wgpu](https://github.com/gfx-rs/wgpu)) backend could reuse the same kernel algorithms in WGSL. The main costs would be losing the shared/managed memory distinction (WebGPU has a simpler memory model) and WGSL's lack of `mulhi` intrinsic (requiring emulation). Mopro's [field operation benchmarks](https://zkmopro.org/blog/client-side-gpu-everyday-ef-privacy/) suggest WebGPU achieves ~50-80% of Metal performance for field operations.

### GPU sumcheck

The sumcheck protocol is the main remaining CPU bottleneck (~15% of runtime). While the round-to-round dependency is inherently serial, the *within-round* computation (summing over a large hypercube) could benefit from GPU parallelism for very large instances. We have not benchmarked this and it remains an open question.
