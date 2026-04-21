---
authors: ["Alex Kuzmin", "Guorong Du"]
title: "Efficient Client-Side Proving for zkID"
image: "/articles/efficient-client-side-proving-for-zkid/cover.webp" # Image used as cover,  Keep in mind the image size, where possible use .webp format, possibly images less then 200/300kb
tldr: "Binius and Ligero emerge as the top candidates for mobile SHA-256 ZK-proving under transparent, post-quantum constraints." #Short summary
date: "2025-06-11" # Publication date in ISO format
tags: [
    "client-side proving",
    "zkp",
    "zero-knowledge proofs",
    "zkid",
    "post-quantum",
    "benchmarks",
  ] # (Optional) Add relevant tags as an array of strings to categorize the article
projects: ["client-side-proving", "zk-id"]
---

**TL;DR: Binius and Ligero emerge as the top candidates for mobile SHA-256 ZK-proving under transparent, post-quantum constraints.**
This work is helpful for wallet developers, standards authors, and ZK library maintainers in the digital ID space who require a post-quantum-secure proof scheme with a transparent setup that fits within tight mobile CPU, RAM, and bandwidth budgets. We compare seven schemes on a SHA-256 circuit with 2 kB input, measuring prover time, RAM usage, proof size, and preprocessing overhead. Our results show that:

- **Binius** offers ≈5 s proving, sub-50 MB RAM, and small proofs.
- **Ligero** is a runner-up with ≈30-95 s proving and a modest RAM/VRAM footprint.

No single scheme is perfect: Binius excels at bitwise operations, while Ligero achieves performance by utilizing WebGPU. Developers should choose based on their specific mobile-context trade-offs. Our future work will build upon these benchmarks, so feel free to reach out to the Client-Side Proving team if you have a particular use case or would like to collaborate.

## Introduction

As European authorities draft the European Digital Identity Wallet (EUDI) standard[^1], our colleagues at the [zkID team](https://pse.dev/en/projects/zk-id) recognized the opportunity to introduce a competing solution that utilizes zero-knowledge proofs (ZKP) to achieve full privacy, selective disclosure, and potentially enable composability. The emerging standard dictates the use of Selective Disclosure JWTs (SD-JWT) hashed with SHA-256 and signed with ECDSA[^2]. These primitives provide strong cryptographic guarantees but are unfriendly toward ZKP. SHA-256 hashing is notoriously inefficient for ZKP implementations and can become the prover's bottleneck. In this use case, the prover is running on a mobile device that has constrained compute, RAM, and bandwidth. Therefore, our Client-Side Proving team embarked on a benchmarking mission to identify the most performant, RAM-efficient, and bandwidth-conserving ZKP schemes for proving the SHA-256 hashing.

## High-Level Requirements

Given mobile constraints, we limited our evaluation to transparent proof systems that avoid both circuit-specific trusted setups and large universal setups since each would introduce unacceptable overhead in terms of storage and distribution. The wallet user would have to download the setup keys that could be of the size of multiple hundred megabytes, which is unacceptable on mobile data. On the other hand, for ZKP schemes with a transparent setup, even if the prover can independently generate the preprocessing parameters, they must store them on the device. Therefore, we should be conscious of the storage space that the preprocessing occupies.
In addition to these constraints, we required the proof scheme to be post-quantum secure, with the aim of future-proofing the system and avoiding costly migrations or re-evaluations of trust later.
The summary of our requirements is given in the table below.

| Requirement                                         | Rationale                                                  |
| --------------------------------------------------- | ---------------------------------------------------------- |
| No trusted setup / long structured reference string | Fewer security assumptions and less mobile bandwidth usage |
| Small proof size                                    | Mobile device limitations                                  |
| Fast proving                                        | Mobile device limitations                                  |
| Post-quantum soundness                              | Future-proofing                                            |

## Baseline Mobile Hardware

Before choosing a proof scheme, it is essential to understand the limitations of the devices that would run it. For this reason, we started with a hardware survey to identify the most common and representative mobile devices used globally. These synthetic baseline devices served as the reference point for all our benchmarks.

Comprehensive market reports from research firms such as IDC and Counterpoint are prohibitively expensive (e.g., [$7500](https://my.idc.com/getdoc.jsp?containerId=US52082024)), making them inaccessible for this analysis. Therefore, we analyzed the data published by various mobile SDK developers in different industries (analytics, gaming, ads). Our findings were the following:

- Android is dominating the market, while the iPhone's share is around 27%;
- An average iPhone has 6-core CPU @ 3.33 GHz and 5.7 GB RAM;
- An average Android phone has 7-core CPU @ 2.16 GHz and 3.82 GB RAM.

You can find the data and learn more about our methodology here: https://hackmd.io/@clientsideproving/AvgMobileHardware.

An interesting observation arising from our results is that, in case the developer needs to compile the prover to WebAssembly (WASM), WASM's 4 GB RAM limit does not impose a significant additional constraint. Given that an average Android device has approximately 3.82 GB of total RAM, fully utilizing the 4 GB limit is hard in practice anyway.

## Candidate ZKP Schemes

The zero-knowledge proof schemes listed in the table below meet all the requirements we described earlier, including performance, setup, and post-quantum security.

| ZKP Scheme                                                                                          | Prover Complexity | Implementation                                                                                                                             | Existing Benchmarks                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [TurboPLONK + FRI](https://github.com/0xPolygonZero/plonky2/blob/main/plonky2/plonky2.pdf)          | $O(n \log n)$     | [Plonky2](https://github.com/0xPolygonZero/plonky2/tree/main)                                                                              | [PSE CSP (mobile-ready)](https://hackmd.io/@clientsideproving/Plonky2MobileBench), [Celer (2023)](https://blog.celer.network/2023/08/04/the-pantheon-of-zero-knowledge-proof-development-frameworks/) |
| TurboPLONK + FRI                                                                                    | $O(n \log n)$     | [Plonky3](https://github.com/Plonky3/Plonky3/tree/main)                                                                                    | [In powdr](https://github.com/babybear-labs/benchmark/tree/main/reports/powdr)                                                                                                                        |
| [CSTARK](https://eprint.iacr.org/2024/278)                                                          | $O(n \log n)$     | [STWO](https://github.com/starkware-libs/stwo)                                                                                             | Claimed to be ["1.1M CairoCPU cycles, provable with STWO in 6.5s"](https://x.com/bartolomeo_diaz/status/1888240222724354106)                                                                          |
| [Libra](https://eprint.iacr.org/2019/317) (with [Orion](https://eprint.iacr.org/2022/1010.pdf) PCS) | $O(n)$            | [Polyhedra Expander](https://github.com/PolyhedraZK/Expander)                                                                              | [In Rust](https://proofarena.org/problems/3)                                                                                                                                                          |
| [Binius](https://eprint.iacr.org/2023/1784.pdf)                                                     | $O(n)$            | [Binius](https://github.com/IrreducibleOSS/binius/tree/main)                                                                               | [Official benchmark](https://www.binius.xyz/benchmarks/)                                                                                                                                              |
| [Ligero](https://eprint.iacr.org/2022/1608)                                                         | $O(n \log n)$     | Ligetron (closed-source), [libiop](https://github.com/scipr-lab/libiop), [Arkworks (as a PCS)](https://github.com/arkworks-rs/poly-commit) | [In the paper](https://eprint.iacr.org/2022/1608.pdf), closed-source                                                                                                                                  |

## Target Circuit

In our setting, the issuer signs a SHA-256 hash of an SD-JWT containing the credential attributes. A typical SD-JWT in this application is about 2 kB in size, so we benchmarked SHA-256 circuits that hash 2 kB of input data.

## Benchmark Results

We initially ran benchmarks on an Apple M2 Air laptop (8-core M2 CPU, 24 GB RAM). However, since the target deployment is on mobile devices, we subsequently performed direct benchmarks on representative mobile hardware for those proof schemes that demonstrated reasonable RAM usage on laptop. Below are the results for both environments.

Note that not all available implementations we tested include the zero-knowledge property by default. Adding the zero-knowledge may result in additional prover overhead, but it is generally lightweight, so the benchmarks remain representative.

### Laptop Benchmarks

We ran the benchmarks on an Apple M2 Air laptop (8-core M2 CPU, 24 GB RAM). The Binius circuit performs 33 SHA-256 compressions instead of full hashing; therefore, an actual full implementation would incur additional overhead. We benchmarked the Polyhedra Expander circuit with a 1 kB input due to a prover bug that prevented it from running with a 2 kB input.

| Circuit (GitHub link)                                                                                                                       | Proving Time | Verification Time    | Proof Size | Preprocessing Size                                 | Preprocessing RAM | Prover RAM                | Is ZK? |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------------------- | ---------- | -------------------------------------------------- | ----------------- | ------------------------- | --- |
| [Binius (no-lookup)](https://github.com/privacy-scaling-explorations/csp-benchmarks/tree/zkid-benchmarks/binius)                                  | 1.8545 s     | 244.48 ms            | 475.6 KB   | 321.8 KB                                           | ~10.44 MB         | ~26.94 MB                 | No    |
| [Binius (lookup)](https://github.com/privacy-scaling-explorations/csp-benchmarks/tree/zkid-benchmarks/binius)                                     | 11.025 s     | 572.73 ms            | 1.8 MB     | 716.86 KB                                          | ~5.02 MB          | ~66.14 MB                 | No   |
| [Plonky2 (no-lookup)](https://github.com/privacy-scaling-explorations/csp-benchmarks/tree/zkid-benchmarks/plonky2)                                    | 20.138 s     | 5.3135 ms            | 175.6 KB   | 2.28 GB (prover-only data) + 1.06 KB (common data) | ~2.74 GB          | ~2.40 GB                  | Yes   |
| [Plonky3 (SP1 w/precompile)](https://github.com/privacy-scaling-explorations/csp-benchmarks/tree/zkid-benchmarks/plonky3-sp1)                         | 12.596 s     | 184.11 ms            | 1.72 MB    | 156.34 MB (proving key) + 90.76 KB (ELF)           | ~1 GB             | ~5 GB                     | No   |
| [Plonky3 (powdr, no precompile)](https://github.com/privacy-scaling-explorations/csp-benchmarks/tree/zkid-benchmarks/plonky3-powdr)                   | 20.741 s     | 256.11 ms            | 1.93 MB    | 3.1 GB (proving key) + 321 MB (constants)          | ~3.87 GB          | ~0.32 GB                  | No   |
| [STWO (Cairo)](https://github.com/privacy-scaling-explorations/csp-benchmarks/tree/zkid-benchmarks/stwo)                                              | 21.1 s       | N/A (verifier error) | 39.5 MB    | 12.6 MB (trace) + 3.4 Mb (memory)                  | ~600 MB           | ~10GB                     | No  |
| [Ligero (Ligetron, _uses WebGPU_)](https://platform.ligetron.com/marketplace/project?id=78180426-2a09-4c36-ac68-52f1ab4ffbe6&version=1.0)   | 12.06 s      | 9.16 s               | 10.29 MB   | 33KB (prover data)                                 | N/A               | ~500 MB VRAM + ~30 MB RAM | Yes   |
| [Polyhedra Expander (Orion + GF2), 1kB input](https://github.com/privacy-scaling-explorations/csp-benchmarks/tree/zkid-benchmarks/polyhedra-expander) | 70 s         | 26 s                 | 30.75 MB   | 6 GB (circuit)                                     | N/A               | 15.55 GB                  | No  |

### Mobile Benchmarks

We used the following devices for mobile benchmarks:

- iPhone 13 Pro: Hexa-core CPU (2x3.23 GHz Avalanche + 4x1.82 GHz Blizzard), 5-core GPU, 6 GB RAM
- Pixel 6: Octa-core CPU (2x2.80 GHz Cortex-X1 & 2x2.25 GHz Cortex-A76 & 4x1.80 GHz Cortex-A55), Mali-G78 MP20 GPU, 8 GB RAM.

The results are in the table below.
| Circuit | Platform | Proving Time | Peak RAM |
| ------- | ------------- | ----------------------- | -------- |
| [Binius (no-lookup)](https://github.com/privacy-scaling-explorations/csp-benchmarks/tree/zkid-benchmarks/mobile/binius/android) | Pixel 6 | 5.1023 s | 45 MB |
| [Binius (no-lookup)](https://github.com/privacy-scaling-explorations/csp-benchmarks/tree/zkid-benchmarks/mobile/binius/ios) | iPhone 13 Pro | 5.0124 s | 22 MB |
| [Ligero](https://platform.ligetron.com/marketplace/project?id=78180426-2a09-4c36-ac68-52f1ab4ffbe6&version=1.0) | Pixel 6 | 93.59 s | N/A |
| [Ligero](https://platform.ligetron.com/marketplace/project?id=78180426-2a09-4c36-ac68-52f1ab4ffbe6&version=1.0) | iPhone 13 Pro | 29.77 s | N/A |
| [Plonky2](https://github.com/privacy-scaling-explorations/csp-benchmarks/tree/zkid-benchmarks/mobile/plonky2/android) | Pixel 6 | Crashed (out of memory) | - |
| [Plonky2](https://github.com/privacy-scaling-explorations/csp-benchmarks/tree/zkid-benchmarks/mobile/plonky2/ios) | iPhone 13 Pro | Crashed (out of memory) | - |

## Conclusion

Our results reveal that no single scheme perfectly balances mobile resource constraints and proof efficiency. Here is the summary of our findings:

- Binius stands out for SHA-256 circuits thanks to its use of towers of binary fields. Other schemes struggle with bitwise operations, such as XOR and shifts, when working over larger fields.
- Binius no-lookup circuit outperforms its lookup variant because the underlying proof scheme is already optimized for binary operations; adding lookups only incurs extra overhead.
- Ligero exhibits significantly slower proving times on mobile, particularly on Android, despite leveraging WebGPU acceleration and demonstrating good performance on laptops.
- Plonky2 experienced out-of-memory failures, making it unsuitable for the SD-JWT hash signature proving scenario on mobile devices.
- STARK-based solutions (Plonky2, SP1 and powdr) demonstrate expected behavior by demanding multi-gigabyte memory, which places them out of reach for most phones.
- Polyhedra Expander circuit underperforms because it doesn't leverage the layered GKR approach; its long proving time and massive RAM usage reflect a missed optimization opportunity.

Overall, the strongest candidates for SHA-256 proving on mobile are Binius and Ligero, yet neither is universally optimal. Developers should select the scheme that best matches their constraints by weighing all the trade-offs.

[^1]: https://github.com/eu-digital-identity-wallet

[^2]: https://www.ietf.org/archive/id/draft-ietf-oauth-selective-disclosure-jwt-19.html#section-4.1.1
