---
id: "machina-iO"
name: "MachinaIO"
image: ""
section: "pse"
projectStatus: "active"
category: "research"
tldr: "Building the first practical indistinguishability obfuscation (iO) system for secure and scalable cryptographic applications."
tags:
  keywords:
    [
      "indistinguishability obfuscation",
      "iO",
      "cryptography",
      "Ethereum",
      "FHE",
      "SNARKs",
    ]
  themes: ["cryptography", "privacy", "scalability"]
  types: ["research", "development"]
links:
  twitter: "https://x.com/machina__io"
  github: "https://github.com/MachinaIO/"
  website: "https://hackmd.io/@MachinaIO/H1w5iwmDke"
team:
  - name: "Sora Suegami"
    email: "sorasuegami@pse.dev"
---


## Overview

Machina iO is a research project within Privacy & Scaling Explorations (PSE) focused on moving indistinguishability obfuscation (iO) from theory to practice. The project targets *practical iO* via formal cryptographic constructions paired with open-source implementations and benchmarking.

## Current focus (2026)

*Last updated: 2026-01-07*

In 2026, we are executing milestones on the critical path toward practical iO:

- **Q1 2026:** Implement **noise refreshing of GGH15 encodings**, initially using a **dummy blind PRF** (so it can be swapped out later).
- **Q2–Q3 2026:** Implement a **blind PRF over key-homomorphic encodings**, and plan the integration into the noise refreshing implementation.
- **Q3 2026:** Demonstrate **obfuscation with nontrivial input size** (target threshold: **≥ 64 input bits**) and produce reproducible benchmarks.
- **Q4 2026:** Kick off work on **SNARK verification over key-homomorphic encodings** (scheme selection + early prototype).

For technical definitions and the full milestone breakdown, see the roadmap link below.

## Resources

- **Milestone roadmap (source of truth):** https://hackmd.io/@MachinaIO/rygxbLqZZe  
- **Project proposal / background note:** https://hackmd.io/@MachinaIO/H1w5iwmDke  
- **Code (GitHub org):** https://github.com/MachinaIO/  
- **Project site:** https://machina-io.com/  

## Publications

- **Scalable Private World Computer via Root iO: Application-Agnostic iO and Our Roadmap for Making It Practical** — Sora Suegami, Enrico Bottazzi  
  https://eprint.iacr.org/2025/2139

- **Diamond iO: A Straightforward Construction of Indistinguishability Obfuscation from Lattices** — Sora Suegami, Enrico Bottazzi, Gayeong Park  
  https://eprint.iacr.org/2025/236

## Talks

- **Devconnect 2025 (Buenos Aires) — Ethereum Privacy Stack (Machina iO segment)**  
  https://www.youtube.com/watch?v=C-kF0gplCto&t=3772s
