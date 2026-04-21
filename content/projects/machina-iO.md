---
id: "machina-iO"
name: "MachinaIO"
image: ""
section: "pse"
projectStatus: "active"
category: "research"
tldr: "Building the first practical indistinguishability obfuscation (iO) system for trustless and scalable confidential smart contracts."
tags:
  keywords:
    [
      "indistinguishability obfuscation",
      "iO",
      "cryptography",
      "key-homomorphic encodings",
      "Ethereum",
      "FHE",
      "SNARKs",
    ]
  themes: ["cryptography", "privacy", "scalability"]
  types: ["research", "development"]
links:
  twitter: "https://x.com/machina__io"
  github: "https://github.com/MachinaIO/"
  website: "https://hackmd.io/@MachinaIO/rygxbLqZZe"
team:
  - name: "Sora Suegami"
    email: "sora.suegami@ethereum.org"
---


## Overview

Machina iO is a research project within Privacy & Scaling Explorations (PSE) focused on moving indistinguishability obfuscation (iO) from theory to practice. The project targets *practical iO* via formal cryptographic constructions paired with open-source implementations and benchmarking.

## Current focus (2026)

*Last updated: 2026-03-31*

In 2026, we are executing milestones on the critical path toward practical iO:

- **Q1 2026:** Implement **FHE multiplication over key-homomorphic encodings (BGG+ encodings)** by introducing new methods such as lookup table evaluation over encodings.
- **Q2 2026:** Implement **noise refreshing of GGH15 encodings**, initially using a **dummy blind PRF** (so it can be swapped out later).
- **Q2–Q3 2026:** Implement a **blind PRF over key-homomorphic encodings**, and plan the integration into the noise refreshing implementation.
- **Q3 2026:** Demonstrate **obfuscation with nontrivial input size** (target threshold: **≥ 64 input bits**) and produce reproducible benchmarks.
- **Q4 2026:** Kick off work on **SNARK verification over key-homomorphic encodings**.

For technical definitions and the full milestone breakdown, see the roadmap link below.

## Resources

- **Milestone roadmap (source of truth):** https://hackmd.io/@MachinaIO/rygxbLqZZe  
- **Project proposal / background note:** https://hackmd.io/@MachinaIO/H1w5iwmDke  
- **Code (GitHub org):** https://github.com/MachinaIO/  
- **Project site:** https://machina-io.com/  

## Publications

- **Diamond iO: A Straightforward Construction of Indistinguishability Obfuscation from Lattices** — Sora Suegami, Enrico Bottazzi, Gayeong Park  
  https://eprint.iacr.org/2025/236

- **Lookup-Table Evaluation over Key-Homomorphic Encodings and KP-ABE for Nonlinear Operations** - Sora Suegami, Enrico Bottazzi
  https://eprint.iacr.org/2025/1870

- **Scalable Private World Computer via Root iO: Application-Agnostic iO and Our Roadmap for Making It Practical** — Sora Suegami, Enrico Bottazzi  
  https://eprint.iacr.org/2025/2139


## Talks

- **Obfuscation workshop at the Simons Institute (Berkeley)**
  https://simons.berkeley.edu/talks/sora-suegami-ethereum-foundation-machina-io-2025-06-24

- **Devconnect 2025 (Buenos Aires) — Ethereum Privacy Stack (Machina iO segment)**  
  https://www.youtube.com/watch?v=C-kF0gplCto&t=3772s
