---
id: "client-side-proving"
name: "Client-Side Proving"
image: ""
section: "pse"
projectStatus: "active"
category: "research"
tldr: "Mapping out the ZK-SNARKs ecosystem, evaluating ZKP solutions using standardized and reproducible benchmarks, and advancing the most promising ZKP stacks with developer-friendly tooling to lower adoption barriers, enabling efficient client-side ZKP applications."
license: "MIT"
tags:
  keywords: ["Zero Knowledge", "Mobile", "Privacy", "Digital Identity"]
  themes: ["build", "research"]
  types: ["Legos/dev tools", "Benchmarking", "Proof systems"]
team:
  - name: "Alex Kuzmin"
    email: "alex.kuzmin@ethereum.org"
  - name: "Brechy"
    email: "brechy@ethereum.org"
---

### Project Overview

The Client-Side Proving project aims to develop practical and efficient implementations and tooling for zero-knowledge (ZK) proving systems tailored specifically for mobile devices. By exploring various proving systems we provide benchmarks, insights, and optimized implementations that enable performant client-side applications.

### Objective

We publish the [CSP Quarterly Report](https://ethproofs.org/csp-benchmarks), which benchmarks zkVMs and ZKP systems for client-side feasibility. In parallel, we research promising ZKP stacks, prioritizing transparent (no-setup), post-quantum–sound ZKP systems with direct on-chain verification. All evaluations respect realistic mobile RAM budgets - under 4 GB on Android and 6 GB on iPhone.

### Project Status

- **Stage:** MVP Development
- **Status:** Active
- **Team Lead:** Alex Kuzmin
- **Team Members:** Brechy

### Technical Approach

- We are developing a standardized cloud-first benchmarking pipeline that uses fixed hardware profiles, supports straightforward circuit and stack extensions, and runs qualifying targets on real mobile devices.
- We aim to publish the benchmarking results in a comparison-friendly format that offers filtering and sorting.
- For ZKP stack R&D, we are currently exploring multilinear sumcheck-based ZKP schemes (Spartan, Hyperplonk, SuperSpartan) in combination with the latest transparent and post-quantum polynomial commitment scheme (WHIR).

### Milestones

- **April 2025**: Established baseline benchmarks for common mobile hardware.
- **June 2025**: Published the first benchmark results, [Efficient Client-Side Proving for zkID](https://pse.dev/blog/efficient-client-side-proving-for-zkid).
- **November 2025**: Publishing the benchmark results of demanding ZKP circuits (SHA-256, ECDSA) in latest and popular ZKP systems and zkVMs that claim to be client-side oriented: https://ethproofs.org/csp-benchmarks.
- **Q2 2026 (planned)**: Publishing the additional extended benchmarks (Keccak, Poseidon) and expanding the proving system and zkVM coverage 
- **Q2 2026 (planned)**: [Researching](https://hackmd.io/@clientsideproving/whir-based) the most efficient post-quantum sumcheck-based ZKP system with WHIR PCS, on-chain verifier, and a frontend DSL

### Applications

Client-Side Proving enables numerous privacy-focused mobile applications, including:

- Mobile Digital ID wallets ensuring user privacy.
- Anonymous online communication and collaboration tools.

### How to get in touch

- Reach out via email Alex: alex.kuzmin@ethereum.org, Brechy: brechy@ethereum.org

### Publications

- [The Definitive CSP: Towards a Post-Quantum, On-Chain-Verifiable, Client-Side Proving System for ZK Applications](https://hackmd.io/@clientsideproving/whir-based)
- [Benchmarks for Digital ID Wallet](https://hackmd.io/@clientsideproving/S1wiUc0n1e)
- [Mobile Hardware Survey](https://hackmd.io/@clientsideproving/ByqafXAv1e)
- [Plonky2 Sha256 Benchmarks](https://hackmd.io/@clientsideproving/B1xLCuJL5yg)
- [Proof Systems Survey](https://hackmd.io/@clientsideproving/HyKBkz7jye)

Benchmark findings and technical write-ups will be released regularly, highlighting the project's research outcomes and performance evaluations.
