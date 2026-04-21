---
authors: ["Sora Suegami", "Enrico Bottazzi", "Pia Park"]
title: "Hello, World: the first signs of practical iO"
image: "/articles/hello-world-the-first-signs-of-practical-io/cover-practical-io.webp"
tldr: "Machina iO shares the first end-to-end implementation and benchmarks of Diamond iO, demonstrating that lattice-based indistinguishability obfuscation can be made concrete and efficient."
date: "2025-05-12"
canonical: "https://machina-io.com/posts/hello_world_first.html"
tags:
  ["indistinguishability obfuscation", "cryptography", "Diamond iO", "lattice"]
projects: ["machina-io"]
---

04.28.2025 | [Sora Suegami](https://x.com/SoraSue77), [Enrico Bottazzi](https://x.com/backaes), [Pia Park](https://x.com/0xpiapark)

Today, we’re excited to announce that **we have successfully implemented [Diamond iO](https://eprint.iacr.org/2025/236)**, a straightforward construction of indistinguishability obfuscation (iO) that we published in February, and **completed its end-to-end workflow**. You can explore the codebase [here](https://github.com/MachinaIO/diamond-io).

The current implementation includes minor differences from the theoretical construction and supports a limited range of circuit functionalities. Nonetheless, it demonstrates the concrete efficiency of the novel techniques introduced in Diamond iO, **opening a new path toward practical iO**.

## iO is powerful, but far from practical use

While technological acceleration is increasingly driven by data-centric algorithms operating on vast datasets controlled by centralized entities, there is an observable decline in individuals' control over personal data.

We believe that a **global private computation platform** represents the only viable bridge to reconcile and further boost tech acceleration and personal data sovereignty. As the value of private information delegated to such a platform grows, it becomes necessary to rely on a security foundation that can scale regardless of the stakes involved.

Unlike other technologies such as Multi-Party Computation (MPC) or Multi-Party Fully Homomorphic Encryption (MP-FHE), facing [privacy scalability issues](https://mirror.xyz/privacy-scaling-explorations.eth/nXUhkZ84ckZi_5mYRFCCKgkLVFAmM2ECdEFCQul2jPs), iO completely removes the perpetual reliance on committees after distributed trusted setup processes. In other words, iO unlocks a programmable protocol that acts as the **perfect trustless third party**, relying solely on cryptographic hardness assumptions to guarantee the security of any secrets—akin to Nick Szabo's definition of [God Protocol](https://nakamotoinstitute.org/library/the-god-protocols/).

Following a series of studies on iO, [a breakthrough work by Aayush Jain, Huijia Lin, and Amit Sahai in 2020](https://dl.acm.org/doi/pdf/10.1145/3406325.3451093) demonstrated that iO could be constructed solely from standard assumptions, firmly established through over a decade of research. However, iO has been seen as a theoretical cryptographic primitive because of the complexity of its constructions. In fact, [one of the most recent studies on the iO implementation](https://link.springer.com/chapter/10.1007/978-3-319-15618-7_12) reports a simulation result that obfuscating a 2-bit multiplication circuit requires around 10^27 years and 20 Zetta bytes of memory.

## Diamond iO: an implementable iO construction

Diamond iO overcame this obstacle by presenting a new lattice-based iO construction that is simple enough to be implemented. A common bottleneck in previous iO schemes is the reliance on costly (and recursive) operations from functional encryption (FE). This is solved in Diamond iO by relying on **simple matrix operations**.

We [implemented](https://github.com/MachinaIO/diamond-io) the construction defined in [Section 4 of our paper](https://eprint.iacr.org/2025/236.pdf#page=17.34). The implementation includes the following minor differences from the theoretical construction:

- **RLWE and LWE**. The paper describes the scheme in its learning with error (LWE) setting. In the implementation, we work in the ring LWE (RLWE) setting. More practically, finite field elements are replaced by polynomial rings, allowing us to pack more bits of information in each matrix into polynomials and compute multiplication efficiently with number theoretic transform.
- **Pseudorandom function (PRF) scheme.** While the theoretical construction homomorphically evaluates PRF using FHE, the implementation evaluates it without FHE by reusing the secret key depending on the evaluator's input bits as the PRF key. A detailed explanation will be provided in the upcoming updated version of our paper.
- **Circuit model.** The theoretical construction obfuscates an entire circuit. In the implemented version, the obfuscator sets a private key $k$ and a circuit $C$ to obtain an obfuscated program that only hides $k$ while $C$ remains public. The evaluator can then non-interactively execute the obfuscated program over their input $x$ to obtain $C(k, x)$ and nothing else. This is in line with practical [use cases](https://phantom.zone/posts/program-obfuscation) in which we need to hide some signing or decryption key, while the functionality must be transparent.
- **FHE scheme.** While the theoretical construction employs [GSW FHE](https://eprint.iacr.org/2013/340.pdf), the implementation adopts a simpler encryption method based on ring-LWE (RLWE) described in [[LPR10]](https://www.iacr.org/archive/eurocrypt2010/66320288/66320288.pdf). This scheme only supports linear homomorphic operations over ciphertexts encrypting binary vectors. On the other hand, when compared to GSW, it requires fewer bits to represent a ciphertext.
- **Lack of pseudorandom oracle.** [A pseudorandom oracle](https://eprint.iacr.org/2022/1204.pdf), which could be implemented by a hash function in practice, is necessary for security proofs to ensure that iO can support not only pseudorandom functionalities but also general ones as shown in Subsection 5.4 of [[BDJ+24]](https://eprint.iacr.org/2024/1742.pdf). However, this has not yet been implemented in the current implementation as the required hash functions are still too complex.

While all of these differences (except for the first one) are introduced to reduce the complexity of the functional encryption (FE) scheme of [[AKY24]](https://eprint.iacr.org/archive/2024/1719/1729569779.pdf), the key novelty of Diamond iO—namely the matrix-based process to insert the evaluator’s input bits into the FE ciphertext provided by the obfuscator—is implemented as defined in the theoretical construction (except for some trivial optimizations). Therefore, despite these disparities, the implementation still demonstrates the concrete efficiency of the novel techniques we proposed.

## Beyond theory: benchmark results

In our benchmarking scenario, the obfuscator sets a [public circuit](https://github.com/MachinaIO/diamond-io/blob/e7e87dd8422db0f8ccf634fdb3c658c2c1eef82e/dio/src/circuit.rs) $C$ with variable arithmetic depth (addition and multiplication layers) and variable input size. As part of the obfuscation algorithm, the obfuscator samples a binary vector hardcoded key $k$ and embeds it inside the obfuscated circuit. The obfuscated circuit is then published such that any evaluator can run it over their dynamically chosen input $x$ to obtain $C(k, x)$ without any interaction with the obfuscator and without learning $k$ (beyond what could be inferred from $C(k, x)$).

```js
// public circuit C
let mut public_circuit = PolyCircuit::new();

// inputs: BaseDecompose(ct), Evaluator's input
// outputs: BaseDecompose(ct) * acc
{
    let inputs = public_circuit.input((2 * log_base_q) + 1);
    let mut outputs = vec![];
    let eval_input = inputs[2 * log_base_q];

    // compute acc according to provided add_n and mul_n values
    let mut acc = if add_n == 0 {
        public_circuit.const_one_gate()
    } else {
        public_circuit.const_zero_gate()
    };
    for _ in 0..add_n {
        acc = public_circuit.add_gate(acc, eval_input);
    }
    for _ in 0..mul_n {
        acc = public_circuit.mul_gate(acc, eval_input);
    }

    // compute the output
    for ct_input in inputs[0..2 * log_base_q].iter() {
        let muled = public_circuit.mul_gate(*ct_input, acc);
        outputs.push(muled);
    }
    public_circuit.output(outputs);
}
```

In the following description, multiplicative depth represents the depth of multiplication gates in the public circuit, rather than one in the entire circuit.
Even when this depth is 0, the entire circuit being obfuscated and evaluated has at least one depth because the final FHE decryption step includes one inner product.

We confirmed the correctness of the implementation by setting the public circuit as the identity function and verifying that the output of the evaluation matches the hardcoded key sampled by the obfuscator.

One important point to highlight about performance is that obfuscation is a one-time operation (per application). Since we can assume that the obfuscator has access to powerful hardware, the primary focus for optimization should be evaluation, which is a recurring and more performance-critical process.

### Benchmark settings

We benchmarked the implementation using the [dio](https://github.com/MachinaIO/diamond-io/tree/e7e87dd8422db0f8ccf634fdb3c658c2c1eef82e/dio) CLI binary compiled without any feature flags, in the above scenario. For each experiment setting, we measured the execution time, memory consumption, and the size of the obfuscated circuit three times and adopted their averages, respectively. The number of addition and multiplication layers (depths) in the public circuit used for the benchmarks was adjusted according to the experiment settings.

We selected optimum parameters which, according to the [lattice-estimator](https://github.com/malb/lattice-estimator), should offer at least 80-bit security against the best-known attacks. This process is automated by [our simulator script](https://github.com/MachinaIO/diamond-io/blob/e7e87dd8422db0f8ccf634fdb3c658c2c1eef82e/simulator/main.py).

### Benchmark 1: circuit complexity (fixed input size)

In the first benchmark, we fixed the number of input size to one bit and scaled the circuit complexity by varying the depth of multiplication in the public circuit as shown in Table 1. Here, we ignore one multiplication depth for an inner product during FHE decryption because this is a common operation, independent of the public circuit definition.

**Table 1. Experimental settings for Benchmark 1.**
| Multiplicative depth |Parameters | Final Circuit Gates |
| --------- | ---------- | ------------------- |
| 0 | [ID 33](https://github.com/MachinaIO/diamond-io/blob/e7e87dd8422db0f8ccf634fdb3c658c2c1eef82e/e2e/dio-config.33.toml) | Input: 46, Const: 108, Add: 36, Mul: 180 |
| 5 | [ID 34](https://github.com/MachinaIO/diamond-io/blob/e7e87dd8422db0f8ccf634fdb3c658c2c1eef82e/e2e/dio-config.34.toml) | Input: 58, Const: 144, Add: 68, Sub: 4, Mul: 260 |
| 10 | [ID 35](https://github.com/MachinaIO/diamond-io/blob/e7e87dd8422db0f8ccf634fdb3c658c2c1eef82e/e2e/dio-config.35.toml) | Input: 76, Const: 198, Add: 106, Sub: 4, Mul: 370 |

These experiments were conducted in the below environment:

- Machine: AWS `i4i.8xlarge` instance (32 vCPUs, 256 GB RAM)
- Commit to the benchmarked code: [f3b2fdc](https://github.com/MachinaIO/diamond-io/tree/f3b2fdc121b22de69e9a801f1eee41620c565627)

**Results of Benchmark 1.** Table 2 summarizes the results of the execution time, peak memory usage, and the obfuscated circuit size for each multiplicative depth. The second, third, and fourth columns report, respectively, the time required to obfuscate the circuit and write it to disk, the time to load the obfuscated circuit from disk into RAM, and the time to evaluate it.

**Table 2. Results of Benchmark 1 at each multiplicative depth.**
| Multiplicative depth | Obfuscation Time /min | Loading Time (min) | Evaluation Time (min) | Peak Memory Usage (GB) | Obfuscated Circuit Size (GB) |
|:----------:|:----------------------:|:------------------:|:----------------------:|:----------------------:|:----------------------------:|
| 0 | 15.80 | 4.575 | 2.542 | 34.30 | 6.303 |
| 5 | 39.85 | 12.84 | 7.789 | 80.38 | 10.79 |
| 10 | 129.3 | 42.16 | 29.94 | 225.1 | 19.77 |

Figure 1 demonstrates that the execution time of each operation increases with depth faster than linearly. The peak memory usage and the obfuscated circuit size shown in Figure 2 follow the same trend.

This trend can be theoretically explained as follows. During evaluation, the upper bound of accumulated error grows exponentially with the circuit depth. To keep correctness, the modulus $q$ must therefore be chosen with a bit-length that scales proportionally to the depth. Among the matrices included in the obfuscated circuit, the largest ones—the preimage matrices—grow in size roughly with the bit-length of $q$ or with its square. Consequently, their bit-length increases at least quadratically in depth, causing the overall execution time to rise faster than linearly.

![chart](https://hackmd.io/_uploads/BkHKJNTyge.svg)
**Figure 1. Execution time at each multiplicative depth.**

![Chart from Google Docs (4)](https://hackmd.io/_uploads/HJ2qkETylg.svg)
**Figure 2. Peak memory usage and obfuscated circuit size at each multiplicative depth.**

### Benchmark 2: input size (fixed circuit complexity)

In the second benchmark, we kept the complexity of the public circuit identical to that of the depth 0 in Benchmark 1 and varied the number of input size as shown in Table 3.

**Table 3. Experimental settings for Benchmark 2.**
| Input Size (bits) | Parameters | Final Circuit Gates |
| ---------- | -------------------------------------------------------------------------- | ------------------------------------------- |
| 1 | [ID 33](https://github.com/MachinaIO/diamond-io/blob/e7e87dd8422db0f8ccf634fdb3c658c2c1eef82e/e2e/dio-config.33.toml) | Input: 46, Const: 108, Add: 36, Mul: 180 |
| 2 | [ID 36](https://github.com/MachinaIO/diamond-io/blob/e7e87dd8422db0f8ccf634fdb3c658c2c1eef82e/e2e/dio-config.36.toml) | Input: 58, Const: 144, Add: 48, Mul: 240 |
| 4 | [ID 39](https://github.com/MachinaIO/diamond-io/blob/e7e87dd8422db0f8ccf634fdb3c658c2c1eef82e/e2e/dio-config.39.toml) | Input: 82, Const: 216, Add: 72, Mul: 360 |

These experiments were conducted in the below environment:

- Machine: AWS `i4i.16xlarge` instance (64 vCPUs, 512 GB RAM)
- Commit to the benchmarked code: [a2fe732](https://github.com/MachinaIO/diamond-io/tree/a2fe732684530604b22051ebcee5b4aadba8d06b)

Unlike the implementation used in Benchmark 1, the Benchmark 2 implementation loads from disk only the parts of the obfuscated circuit needed at each evaluation step, preventing out-of-memory crashes even with large input sizes.

**Results of Benchmark 2.** Table 4 summarizes the results of the execution time, peak memory usage, and the obfuscated circuit size for each input size. The third column includes the time to load the obfuscated circuit from disk into RAM during evaluation.

**Table 4. Results of Benchmark 2 at each input size.**
| Input Size (bits) | Obfuscation Time (min) | Evaluation Time (min) | Peak Memory Usage (GB) | Obfuscated Program Size (GB) |
|:----------:|:----------------------:|:---------------------:|:----------------------:|:----------------------------:|
| 1 | 12.55 | 2.925 | 20.80 | 6.303 |
| 2 | 52.01 | 11.54 | 62.97 | 20.76 |
| 4 | 372.8 | 85.19 | 270.5 | 88.05 |

Figures 3 and 4 show that every metric in Benchmark 2 increases with input size more rapidly than the results observed in Benchmark 1. Theoretical analysis indicates that—just as with multiplicative depth—the bit-length of the modulus $q$ also grows in proportion to the input size. However, this increases not only the size of each matrix but also the number of preimage matrices linearly. These theoretical considerations therefore explain why execution time and data size grow with input size at a rate surpassing their growth measured in Benchmark 1.

![chart (1)](https://hackmd.io/_uploads/rJAoJV6Jgx.svg)
**Figure 3. Execution time at each input size.**

![Chart from Google Docs (5)](https://hackmd.io/_uploads/rJO2kV61le.svg)
**Figure 4. Peak memory usage and obfuscated circuit size at each input size.**

### Discussion: Toward Practical Feasibility

These benchmark results demonstrate that the obfuscation time, the evaluation time, and the obfuscated circuit size scale are nonlinear with both the multiplicative depth and the input size of the circuit. However, the growth of the evaluation time is slower than those of the others, which is an encouraging result as the evaluation is the most recurring process.

Although the implementation seems to be still far from practical circuit sizes, according to [[GGH+13](https://eprint.iacr.org/2013/451.pdf)] and [[BIS+17]](https://eprint.iacr.org/2017/240.pdf), we don't need to support obfuscation for any complex circuits. Instead, the supported circuit _only_ needs to contain the logic to verify the correct execution of FHE evaluation, via ZKP, and conditionally decrypt the given ciphertext with the embedded secret key. This would allow us to outsource the application logic to an FHE program and focus on efficiently obfuscating a circuit with constant multiplicative depth and input size.

## Future research

Our next step is to tackle the following security and efficiency challenges.

**Recent attacks on the evasive LWE assumption.** The four papers listed below—all published after the Diamond iO paper—introduce new attacks on the evasive LWE assumption. Although the security proof of Diamond iO relies heavily on this assumption, these attacks, as far as we know, succeed only for certain parameters and sampler sets that are not necessarily used in actual cryptographic schemes relying on the same assumption. We are now investigating whether any of them can be adapted to the concrete parameters and sampler employed in our construction.

- [Simple and General Counterexamples for Private-Coin Evasive LWE](https://eprint.iacr.org/2025/374.pdf)
- [Evasive LWE: Attacks, Variants & Obfustopia](https://eprint.iacr.org/2025/375.pdf)
- [Lattice-Based Post-Quantum iO from Circular Security with Random Opening Assumption](https://eprint.iacr.org/2025/390.pdf)
- [A Note on Obfuscation-based Attacks on Private-coin Evasive LWE](https://eprint.iacr.org/2025/421.pdf)

**Noise refreshing during evaluation.** As described above, we only need to support the obfuscation of a circuit that verifies a ZK proof and then decrypts the given FHE ciphertext. Nonetheless, the current implementation cannot support the obfuscation of such a circuit due to its limited input size. Specifically, since the modulus bits scale linearly due to the exponential growth of the accumulated error with respect to the input size, we are researching techniques to reduce the error during evaluation, such as one for BGG+ encodings introduced in [[HLL23]](https://eprint.iacr.org/2023/1716.pdf).

**Distributed obfuscation.** Careful reader might notice that iO is virtually worthless if the obfuscator still knows the secret inside the obfuscated program. A naive way to solve this issue is to perform the obfuscation process within an MPC but this is extremely impractical. We are excited to research more practical ways to run distributed trusted setups for obfuscation as this topic has been largely overlooked in existing literature.

## What's next?

Machina ("mah-kin-ah") iO, a project within [Privacy Stewards of Ethereums (PSE)](https://pse.dev), aims to move iO from theory to practice. Alongside our research and engineering efforts, we’ll be publishing a series of posts explaining the core ideas, the vision behind the technology, and the lessons we’ve learned through implementation. If you’re interested in following our journey, we invite you to [subscribe](https://machina-io.com/subscribe.html).

## Acknowledgments

_We would like to sincerely thank the developers of [OpenFHE](https://github.com/openfheorg/openfhe-development) and [openfhe-rs](https://github.com/fairmath/openfhe-rs), open-source lattice and FHE libraries, whose optimized implementations of trapdoor sampling, RLWE primitives, and Rust bindings played a crucial role in helping us implement Diamond iO. We are also grateful to Prof. Yuriy Polyakov for his valuable advice on preimage sampling and his insightful feedback on optimizing our implementation. Any remaining errors are entirely our own responsibility._
