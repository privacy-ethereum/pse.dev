---
authors: ["Brechy, Alex Kuzmin"]
title: "Client-side Proving Benchmarks"
image: "/articles/client-side-proving-benchmarks/cover.webp"
tldr: "Client-side proving benchmarks results overview."
date: "2026-03-06"
canonical: "https://hackmd.io/@clientsideproving/report-q1"
tags: [
    "client-side proving",
    "benchmarks",
    "zero-knowledge",
    "post-quantum",
    "zkvm"
]
projects: ["client-side-proving", "mopro"]
---

Zero-knowledge systems were always optimized for efficient verification, not proving. This becomes an issue when the user doesn't have a sufficiently powerful device to generate these proofs and the proof requires private data.

Many ZK applications today delegate proof generation to a server to deal with this. The user sends their private inputs, the server computes the proof, and the proof comes back. This works, but it means the system requires trusting whoever creates this proof with the exact data that should remain private.

For identity credentials, voting, or financial attestations, that trust dependency defeats the purpose.

Client-side proving generates the proof on the user's own device. The witness (the private data the proof is about) stays local, only the proof leaves. No delegation, no trust assumptions on external infrastructure.

At the client-side proving team, we have been working on a set of benchmarks for proving systems and zkVMs on consumer hardware, and thanks to the ethproofs team, making the [results](https://ethproofs.org/csp-benchmarks) available on their website. The framework is open, reproducible, and designed to be owned by the community. We want teams to add their systems and help it grow.

In this post we'll cover the results from our latest run, what patterns we see in the data, and how to contribute.

## The benchmarking framework

The performance numbers that teams publish for their own systems are not very useful for our purposes. They usually benchmark on high-end cloud instances or custom builds with H100 GPUs, report only the metrics where they look good, and compare against outdated versions of other implementations. Proving time gets all the attention. Memory consumption, proof size or the preprocessing data requirements can be dismissed or not reported at all.

If you're a privacy mobile app developer and your target user owns a regular 4 GB of RAM smartphone, none of that helps you pick a system. We couldn't just analyze the available information, we had to generate our own.

Our benchmarks run on an [AWS mac2.metal](https://aws.amazon.com/ec2/instance-types/mac/) (Apple M1, 8 cores, 16 GB RAM), a fixed CPU hardware close to a real consumer device. We measure proving time, verification time, maximum memory utilized for the proof generation, generated proof size, and preprocessing data required by the system to generate the proof.

Everything runs on an [open repository](https://github.com/privacy-ethereum/csp-benchmarks) with reproducible workflows. If you maintain a proving system or zkVM and want to add it, the [contribution guidelines](https://github.com/privacy-ethereum/csp-benchmarks/blob/main/CONTRIBUTING.md) walks you through the process.

Our goal is to provide a neutral baseline that helps teams compare tradeoffs under the same conditions.

## Results Overview

We benchmarked 15 systems that fall into two main categories:

- **Proving systems**: To use them you must express your computation as a circuit, either using a circuit assembly language or through a DSL. These are Binius, Barretenberg, Circom(Groth16), Expander, Plonky2, ProveKit, Rookie Numbers and Spartan2.
- **zkVMs**: You can write programs in general purpose languages and the VM handles the circuit representation internally. They're are easier to work with but carry overhead from the VM abstraction, which shows up in both proving time and memory requirements. These are Cairo-M, Jolt, Ligetron, Miden, Nexus, RISC Zero and stark-v.

### Proving Speed

Proving times per system depend a lot on circuit type.

For a 2048-byte input, [Binius](https://github.com/IrreducibleOSS/binius64) proves a SHA-256 hash in 103 ms and Keccak in 40.6 ms. Binius operates over binary fields, where bitwise operations (which SHA2 and Keccak rely on heavily) map directly without the cost of representing them in prime field arithmetic. [Spartan2](https://github.com/microsoft/Spartan2) (523 ms) and [Expander](https://github.com/PolyhedraZK/Expander) (543 ms) also prove SHA-256 in under one second.

> 🚨 When we [tested on actual phones](https://pse.dev/en/blog/efficient-client-side-proving-for-zkid) Binius proved SHA-256 in ~5 seconds using between 22 and 45 MB of RAM.

For a single ECDSA signature, [Miden](https://github.com/0xPolygonMiden/miden-vm) zkVM proves signatures in 346 ms. Miden has an elliptic curve precompile in its instruction set, which offsets the VM overhead for this workload.

Barretenberg (1.14 s) and [ProveKit](https://github.com/worldfnd/ProveKit) (2.35 s) also prove ECDSA faster than most zkVMs on this circuit. zkVM overhead depends on the workload: Ligetron on SHA-256 is ~50x slower than Binius at this input size, but nearly matches Barretenberg on Poseidon2.

For [Poseidon](https://www.poseidon-hash.info/), Expander proves a 16 field elements hash in 3.9 ms and [Plonky2](https://github.com/0xPolygonZero/plonky2) in 15.2 ms.  Proving Poseidon is already fast across most systems we tested.

We also began benchmarking [Poseidon2](https://eprint.iacr.org/2023/323). Barretenberg proves Poseidon2 in 385 ms (compared to 504 ms for Poseidon), and Ligetron comes in at 403 ms.

### Verification Time

Verification time matters for any protocol where a verifier checks proofs in real time. Note that on-chain verification cost is a different thing: gas depends on proof size (calldata) and verifier contract complexity, not on native CPU verification speed.

The fastest verifiers across our benchmarks are Miden on ECDSA (0.92 ms) and SHA-256 (1.5 ms), Plonky2 on Poseidon (1.5 ms), and [stark-v](https://github.com/AntoineFONDEUR/stark-v) on Keccak (5.6 ms) and SHA-256 (5.6 ms). Barretenberg verifies consistently around 33 ms regardless of circuit, a side effect of its fixed proof structure. [RISC Zero](https://github.com/risc0/risc0) also stays consistent at roughly 12.5 ms across ECDSA, Keccak, and SHA-256. [Jolt](https://github.com/a16z/jolt) verifies in ~260 ms across circuits.

Verification rankings don't follow proving rankings. On SHA-256, Miden verifies fastest at 1.5 ms but takes 35.6 s to prove. Binius proves fastest at 103 ms but verifies at 28.7 ms. Verification times on ECDSA range from Miden at 0.92 ms to Ligetron at 6.59 s. A fast prover doesn't give you a fast verifier.

### Proof size and preprocessing footprint

Every proof the device generates has to be transmitted (possibly over a mobile network) and verified on-chain. Proof size directly affects gas costs since every byte of calldata costs gas, and for many verifiers calldata dominates the total verification cost ([example with WHIR](https://ethresear.ch/t/on-the-gas-efficiency-of-the-whir-polynomial-commitment-scheme/21301)).

Beyond gas, Ethereum clients enforce a [128 KB maximum transaction size](https://github.com/ethereum/go-ethereum/blob/master/core/txpool/legacypool/legacypool.go) at the mempool level, so proofs larger than that can't be submitted in a single transaction without workarounds.

[Circom(Groth16)](https://github.com/iden3/circom) produces the smallest proofs across every circuit we tested it on: about 1 KB for SHA-256, Keccak, and Poseidon. [Barretenberg](https://github.com/AztecProtocol/barretenberg) stays at 15.8 KB regardless of circuit. These two systems use structured reference strings and pairing-based verification (not post-quantum secure) that compress proofs down to a few group elements.

Ligetron produces the largest proofs in our set: 12.2 MB for ECDSA, 7.19 MB for SHA-256, 3.07 MB for Poseidon2. ProveKit lands around 388-614 KB depending on circuit. RISC Zero stays at 218 KB across circuits. Miden ranges from 63.5 KB for ECDSA to 130 KB for SHA-256. Spartan2 (47-77 KB), stark-v (72-75 KB), and Jolt (83-87 KB) produce the most compact proofs among the non-pairing systems.

Every system also needs preprocessing parameters downloaded and stored **before the prover can run at all**. The tradeoff between proof size and preprocessing shows up clearly. Circom's proofs are tiny, but its preprocessing is heavy: 1.25 GB for Keccak, 592 MB for SHA-256, 21.3 MB even for Poseidon. Plonky2 follows a similar pattern with 2.33 GB for Keccak and 2.28 GB for SHA-256, but smaller proofs (~175 KB).

Transparent systems keep preprocessing minimal, [Cairo-M](https://github.com/kkrt-labs/cairo-m) needs 492 bytes for SHA-256, Ligetron 3.4 KB, stark-v 25.5 KB, but they do produce larger proofs.

Barretenberg sits in the middle: 16.5 MB preprocessing for SHA-256 and 32.3 MB for Keccak, generating ~16 KB proofs. For Poseidon2 specifically, Ligetron's preprocessing is just 31.6 KB compared to Barretenberg's 773 KB, but Ligetron's proof is 3 MB.

Preprocessing is a deployment cost that doesn't show up in proving time. The difference between Circom's 1.25 GB and Cairo-M's 492 bytes is huge. Whether you optimize for download size or proof size really depends on your application needs.

### Memory usage

Many systems need 2-10 GB of RAM for proving, which exceeds what a mobile app can use. Our [Baseline Mobile Benchmarking Hardware Report](https://hackmd.io/@clientsideproving/ByqafXAv1e) found that the baseline Android phone has 3.82 GB of RAM and the baseline iPhone 5.7 GB.

It gets worse since an application only gets a fraction of that, both [Android](https://developer.android.com/topic/performance/memory) and [iOS](https://developer.apple.com/documentation/xcode/identifying-high-memory-use-with-jetsam-event-reports) enforce app memory limits and kill processes that exceed them.

For SHA-256 in our benchmarks, only three systems stay under 600 MB: Ligetron (140 MB), Binius (160 MB), and Barretenberg (584 MB). Expander proves SHA-256 in 543 ms but uses 7 GB. Miden fits for ECDSA (35.6 MB) but uses 11.1 GB for SHA-256. On Poseidon, memory is less of a concern: Plonky2 uses 4.7 MB, Circom 23.5 MB, Expander 36.3 MB.

It's also not safe to assume a fast prover is memory efficient. Spartan2 proves SHA-256 in 523 ms but needs 1.91 GB. Plonky2 uses 9.42 GB for SHA-256 but three orders of magnitude less for Poseidon. Jolt uses a consistent ~3.3 GB regardless of circuit.

### Post-quantum security and GPU acceleration

11 of the 15 systems in our benchmarks are post-quantum secure: they use hash-based polynomial commitments (FRI, Ligero, Orion, WHIR, Binius64) rather than elliptic curve assumptions. Barretenberg (KZG), Circom(Groth16), Jolt (Dory), and Spartan2 (Hyrax) rely on elliptic curve hardness.

Several of the PQ systems also operate over small fields (M31, binary), which use simpler arithmetic that's cheaper per operation and more parallelizable. This is what makes mobile GPUs actually useful for ZK proving. The [Mopro](https://zkmopro.org/) team's [GPU benchmarks](https://pse.dev/en/blog/client-side-gpu-everyday-ef-privacy) show over 100x difference in throughput between M31 and BN254 on Apple Metal.

Binius (binary), stark-v, Cairo-M, Expander, [Nexus](https://github.com/nexus-xyz/nexus-zkvm), and [Rookie Numbers](https://github.com/clementwalter/rookie-numbers) operate over M31 or binary fields. RISC Zero (BabyBear) and Miden and Plonky2 (Goldilocks) also use small fields, though 64-bit Goldilocks is less GPU-efficient than 31-bit fields. [Ligetron](https://github.com/ligeroinc/ligero-prover) is post-quantum secure (Ligero PCS is hash-based) but operates over Bn254, so it wouldn't benefit from small-field GPU acceleration.

GPU-accelerated mobile proving is still early ([Metal MSM v2](https://pse.dev/en/blog/mopro-metal-msm-v2), [ICICLE-Metal](https://github.com/ingonyama-zk/icicle)), but small-field PQ systems are the ones that will benefit from it.

## Open gaps

Across these results, no single system dominates every metric. The fastest provers tend to be memory-heavy, the smallest proofs come from systems that aren't post-quantum secure, and low-memory systems often have larger proofs or slower verification. The right system depends on which constraints your application hits first.

7 of the 15 systems don't provide zero-knowledge. prove correctness but don't hide the witness. 6 systems operate at 96-100 bits of security rather than the safe 128. For applications where the witness must stay private and 128-bit security is required, the available options narrows fast.

The smallest proofs come from pairing-based systems (Circom(Groth16) and Barretenberg), which aren't post-quantum secure. Post-quantum secure systems produce larger proofs, which means higher gas costs for on-chain verification. Only two systems in our benchmarks combine zero-knowledge, post-quantum security, and 128-bit security: ProveKit and Ligetron. Compact post-quantum proofs for on-chain verification remain an open problem.

Our benchmarks test circuits individually, but real applications rarely need just one. It's common to see a combination of Merkle inclusion proofs (based on Poseidon if you're lucky) and a signature (ECDSA) for ownership. Composing multiple circuits in a single proof increases memory pressure and proving time in ways that individual benchmarks don't capture.

## Please Contribute!

We built this framework to be community owned, we really encourage contributions.

There's two main contribution types:

- **Add a circuit**: some supported systems lack  certain circuits implementations.
- **Add a system**: you can add support for a new system on our already benchmarked circuits.

The [contribution guidelines](https://github.com/privacy-ethereum/csp-benchmarks/blob/main/CONTRIBUTING.md) should walk you through both, but if you find any difficulties you can always open an issue or a draft pull request for some feedback.

If you're working on a proving system or a zkVM and want to see it featured on the benchmarks, you can go ahead and open a PR. If you're an application developer and the primitive you need is not being benchmarked, open an issue, or just go ahead and implement it!

## Resources

- [Benchmarks Results](https://ethproofs.org/csp-benchmarks)
- [Repository](https://github.com/privacy-ethereum/csp-benchmarks)
- [Efficient Client-Side Proving for zkID](https://pse.dev/en/blog/efficient-client-side-proving-for-zkid)
- [Baseline Mobile Benchmarking Hardware](https://hackmd.io/@clientsideproving/ByqafXAv1e)
- [Zero-Knowledge Proving Systems for Mobile: Survey](https://hackmd.io/@clientsideproving/HyKBkz7jye)
- [Benchmarks For Digital ID Wallet](https://hackmd.io/@clientsideproving/zkIDBenchmarks)
- [Mopro: Mobile Proving Toolkit](https://zkmopro.org/)
