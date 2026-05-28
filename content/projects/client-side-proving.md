---
id: "client-side-proving"
name: "Client-Side Proving"
image: ""
section: "pse"
projectStatus: "active"
category: "research"
tldr: "Benchmarking proof systems and zkVMs on consumer hardware, publishing reproducible results on EthProofs, and developing Spartan-WHIR as a transparent, post-quantum path for client-side proofs."
license: "MIT"
tags:
  keywords: ["Zero Knowledge", "Mobile", "Privacy", "Digital Identity"]
  themes: ["build", "research"]
  types: ["Legos/dev tools", "Benchmarking", "Proof systems"]
team:
  - name: "Alex Kuzmin"
    email: "alex.kuzmin@ethereum.org"
  - name: "Miha Stopar"
    email: "miha.stopar@ethereum.org"
---

### Project Overview

The Client-Side Proving project studies what it takes to generate zero-knowledge proofs on average user devices. The work has two tracks: public benchmarks for proving systems and zkVMs, and protocol engineering for a transparent, post-quantum ZKP stack that can support client-side applications.

### Objective

We maintain the [CSP benchmark suite](https://github.com/privacy-ethereum/csp-benchmarks) and publish the results at [ethproofs.org/csp-benchmarks](https://ethproofs.org/csp-benchmarks). The benchmarks compare popular ZKP systems on challenging and relevant client-relevant workloads such as SHA-256, Keccak, Poseidon/Poseidon2, and ECDSA.

The longer-term goal is a practical client-side SNARK with no trusted setup, plausible post-quantum security, and a route to direct on-chain verification. The first WHIR-on-EVM work showed that standalone WHIR verification is feasible but still expensive, so current R&D focuses on Spartan-WHIR prover performance and developer experience.

### Project Status

- **Stage:** Public benchmarks and protocol R&D
- **Status:** Active
- **Team Lead:** Alex Kuzmin
- **Team Members:** Miha Stopar

### Technical Approach

- We run a standardized benchmark harness with fixed input profiles and shared result formats, so new proving systems and zkVMs can be compared against the same workloads.
- We publish results on EthProofs in a comparison-friendly interface with filtering, sorting, and exported benchmark data.
- We track practical client-side metrics, including proving time, verification time, peak memory, proof size, preprocessing size, security assumptions, and system properties.
- For proof-system R&D, we are developing [Spartan-WHIR](https://github.com/privacy-ethereum/spartan-whir), a Spartan-style sumcheck system with WHIR as the polynomial commitment scheme. Early WIP benchmarks demonstrate good performance.
- On-chain verification remains a constraint. The 31-bit WHIR verifier report gives us a concrete EVM cost model and points toward extension-field precompiles such as `EXTFIELD_MAC`, but direct verification of the full client-side stack is still future work.

### Milestones

- **April 2025**: Established the initial hardware baseline and benchmark methodology.
- **June 2025**: Published the first benchmark results, [Efficient Client-Side Proving for zkID](https://pse.dev/blog/efficient-client-side-proving-for-zkid).
- **November 2025**: Published benchmark results for demanding circuits and client-side-oriented proving systems at [ethproofs.org/csp-benchmarks](https://ethproofs.org/csp-benchmarks).
- **Q1 2026**: Expanded benchmark coverage with Keccak, Poseidon/Poseidon2, and additional proving systems and zkVMs.
- **Q2 2026**: [Published](https://pse.dev/blog/evm-verification-of-whir-31bit) the research report on a small-field WHIR Solidity verifier.
- **Q3 2026 (WIP)**: Continue [Spartan-WHIR](https://github.com/privacy-ethereum/spartan-whir) development, frontend integration, and benchmark-driven comparison against ProveKit and other benchmarked candidates.

### Applications

Client-Side Proving enables numerous privacy-focused mobile applications:

- Identity and credential wallets
- Anonymous online communication and collaboration tools
- Other applications that need to prove local computation without sending raw private data to a server.

### How to get in touch

- Reach out via email: alex.kuzmin@ethereum.org

### Publications

- [Client-side proving benchmarks](https://ethproofs.org/csp-benchmarks)
- [EVM Verification of WHIR over a 31-bit Field](https://pse.dev/blog/evm-verification-of-whir-31bit)
- [The Definitive CSP: Towards a Post-Quantum, On-Chain-Verifiable, Client-Side Proving System for ZK Applications](https://hackmd.io/@clientsideproving/whir-based)
- [Efficient Client-Side Proving for zkID](https://pse.dev/blog/efficient-client-side-proving-for-zkid)
- [Mobile Hardware Survey](https://hackmd.io/@clientsideproving/ByqafXAv1e)
- [Plonky2 Sha256 Benchmarks](https://hackmd.io/@clientsideproving/B1xLCuJL5yg)
- [Proof Systems Survey](https://hackmd.io/@clientsideproving/HyKBkz7jye)

Benchmark results and technical write-ups are updated as the project moves from measurement to protocol implementation.
