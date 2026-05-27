---
authors: ["Sora Suegami", "Enrico Bottazzi", "Pia Park"]
title: "Circuit-specific decryption keys for FHE: a new four-part series from Machina iO"
image: "/articles/circuit-specific-decryption-keys-for-fhe/cover.webp"
tldr: "Machina iO publishes a four-part series on circuit-specific decryption keys for FHE: a primitive that lets a decryption committee publish a key for one specific computation and then step away, removing the need for an always-online committee."
date: "2026-05-22"
tags:
  [
    "fully homomorphic encryption",
    "indistinguishability obfuscation",
    "lattice",
    "cryptography",
    "Machina iO",
  ]
projects: ["machina-iO"]
---

# Circuit-specific decryption keys for FHE: a new four-part series from Machina iO

The Machina iO team has published a new four-part series on [machina-io.com](https://machina-io.com/). It's about how FHE-based applications could shed their reliance on an always-online decryption committee, and what it would take to build the cryptographic primitive that makes this possible. The team calls it a *circuit-specific decryption key*: a key that decrypts only the outputs of one specific computation. The first three posts cover the motivation and the construction; the fourth reports engineering progress on the implementation.

[Part 1](https://machina-io.com/posts/circuit-specific-decryption-keys-for-fhe-part-1.html) is the motivation. Recovering plaintext from an FHE computation today requires a trusted committee that holds the decryption key. If the committee is compromised it can decrypt anything; if it goes offline, nothing decrypts. A circuit-specific decryption key would change the trust model: the committee publishes the key in the preprocessing phase, then can step away. The article explains this mechanism through the concrete example of online voting.

[Part 2](https://machina-io.com/posts/circuit-specific-decryption-keys-for-fhe-part-2.html) and [Part 3](https://machina-io.com/posts/circuit-specific-decryption-keys-for-fhe-part-3.html) build the construction. Part 2 revisits existing work on [BGG+ encodings](https://eprint.iacr.org/2014/356.pdf), the first instantiation of key-homomorphic encodings, and a functional encryption scheme introduced in [[AKY24]](https://eprint.iacr.org/2024/1719.pdf), recasting these ideas in the context of circuit-specific decryption keys. In particular, it explains how FHE evaluation and decryption can be carried out inside BGG+ encodings. Part 3 completes the construction of circuit-specific decryption keys by extending BGG+ encodings with a technique introduced in [Diamond iO](https://eprint.iacr.org/2025/236.pdf), allowing the evaluator to insert its own inputs into the encodings it is given without learning the secret key.

[Part 4](https://machina-io.com/posts/circuit-specific-decryption-keys-for-fhe-part-4.html) reports efficiency improvements for BGG+ encodings implemented by the Machina iO team in the [`mxx`](https://github.com/MachinaIO/mxx) repository. Previously, BGG+ encodings could essentially handle only Boolean circuits. As a result, even evaluating a single modular multiplication over the encodings caused the circuit depth, and consequently the lattice parameters (lattice dimension and modulus size), to become too large for implementation on real hardware. Since constructing circuit-specific decryption keys and iO requires evaluating FHE homomorphic evaluation circuits over BGG+ encodings, this has been one of the main bottlenecks toward making these primitives practical.

The team addresses this bottleneck through both theoretical and engineering optimizations, including:
- native lookup-table evaluation over encodings;
- slotwise operations that reduce the size of preprocessing data; and
- GPU implementations of fundamental lattice operations, in particular polynomial and matrix arithmetic, digit decomposition, and lattice preimage sampling.

As a result, they succeeded in building the following implementations.

**Modular multiplication over BGG+ encodings with practical lattice parameters.**

For lattice dimension $n = 2^{14}$ and modulus size 264 bits, using eight RTX Pro 6000 GPUs, they completed preprocessing (corresponding to part of obfuscation in iO) in 1.5 hours, and online evaluation (corresponding to part of obfuscated-circuit evaluation in iO) in under one minute. Notably, they confirmed that the main preprocessing bottleneck, in particular preimage samplings, parallelizes well, so the preprocessing time can be reduced by scaling out the number of identical GPUs.

**Evaluation of a GSW-FHE multiplication circuit over BGG+ encodings with practical lattice parameters.**

For lattice dimension $n = 2^{16}$ and modulus size 1120 bits, the total computation is still too large to complete within a practical time frame on currently available hardware. However, they show that the computation is massively parallelizable, and that if a sufficiently large number of GPUs were available, the FHE multiplication could be evaluated with practical latency. Concretely:

- in preprocessing, the minimum latency is 10 minutes when more than $10^{12}$ H200 GPUs are available; and
- in online evaluation, the minimum latency is 51 minutes when more than $10^{18}$ H200 GPUs are available.
