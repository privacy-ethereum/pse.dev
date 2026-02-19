---
id: "private-proof-delegation"
name: "Private proof delegation"
image: ""
section: "pse"
projectStatus: "maintained"
category: "research"
tldr: "Private Delegated Proving aims to unlock efficient zero-knowledge proof (ZKP) generation for resource-constrained clients such as mobile phones, without compromising privacy."
tags:
  keywords: ["fhe", "zkp", "tee"]
  themes: ["research"]
links:
  github: "https://github.com/privacy-scaling-explorations/private-proof-delegation-docs"
---

# Private Delegated Proving

## Project Overview

Private Delegated Proving aims to unlock efficient zero-knowledge proof (ZKP) generation for resource-constrained clients such as mobile phones, without compromising privacy. The project explores how clients can securely delegate proof generation to external servers—be they trusted hardware, distributed MPC setups, or FHE —while keeping sensitive data protected.

By focusing on delegation frameworks that avoid trust assumptions or excessive overhead, the project paves the way for scalable, privacy-preserving applications that are accessible to everyday users.

## Objective

The goal is to explore the space and potentially develop a practical, trust-minimized framework that allows clients with limited computational and network resources to outsource ZKP generation. This includes:

- Benchmarking feasible approaches including Trusted Execution Environment (TEE)-based delegation, collaborative zkSNARKs, client-side proving.
- Investigating Fully Homomorphic Encryption (FHE) as a foundation for verifiable delegation.
- Exploring new polynomial commitment schemes (PCS) that are FHE-compatible.
- Reducing client-side costs via packing, modulus switching, and interaction design.

Ultimately, the project seeks to identify viable building blocks for a future where client-side privacy doesn't require massive compute or trusted intermediaries.

## Project Status

- **Stage:** MVP Development
- **Status:** Active
- **Team Lead:** Takamichi Tsutsumi
- **Team Members:** Shouki Tsuda
- **Collaborators:** Keewoo

## Technical Approach

Private Delegated Proving is built around deep evaluation and experimentation with three major tracks:

- **TEE-based delegation**: Establishing a baseline implementation using VM-based TEEs (e.g. Intel TDX), benchmarking large ZKP circuits like ZK Email under realistic conditions.
- **FHE-based delegation**: Designing and testing FHE-friendly proving flows, including witness expansion, encrypted proof generation, and optimized PCS like Greyhound.
- **Hybrid & future schemes**: Studying advanced techniques such as folding-based verification and R1CS-structured delegation under FHE.

The team maintains a strong focus on publishing intermediate findings to guide the broader ZK and cryptography community.

## Milestones

- **Milestone 1:** TEE-based proving benchmark & write-up ([completed](https://pse.dev/en/blog/tee-based-ppd))
- **Milestone 2:** Literature review and design space mapping for FHE-based delegated proving
- **Milestone 3 (planned):** Experimental implementation of FHE-friendly proving system (Q3–Q4 2025)

## Applications

Private Delegated Proving has potential to reshape the user experience and architecture of ZK-enabled systems:

- **Client-side ZKP support on mobile devices** for privacy-preserving identity, messaging, and transactions.
- **Decentralized proof services** that enable scalable ZK protocols without exposing sensitive inputs.
- **Privacy-first interactions** for systems like ZK Email, anonymous voting, and attestations.

## Publications

- TEE-based proving benchmark & write-up ([completed](https://pse.dev/en/blog/tee-based-ppd))

## Resources

- **GitHub Repository:** [Private Proof Delegation Docs](https://github.com/privacy-scaling-explorations/private-proof-delegation-docs)
- **Project Plan:** [HackMD Plan](https://hackmd.io/qdYZCxweQmix8ezdh7l-Aw?view)

## Contact

- **Takamichi Tsutsumi:** [tkmct@pse.dev](mailto:tkmct@pse.dev)
- **Wanseob Lim:** [wanseob@pse.dev](mailto:wanseob@pse.dev)
- **Join the conversation:** on [PSE Discord](https://discord.com/invite/sF5CT5rzrR)
