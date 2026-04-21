---
id: "vOPRF"
name: "Web2-ID Nullifiers using vOPRF"
image: ""
section: "pse"
projectStatus: "maintained"
category: "research"
tldr: "Enabling pseudonymous systems for Web2 identities using verifiable Oblivious PseudoRandom Functions (vOPRFs)."
tags:
  keywords: ["vOPRF", "nullifiers", "Web2", "privacy", "ZK proofs", "MPC"]
  themes: ["privacy", "identity", "zero-knowledge proofs"]
  types: ["research", "development"]
links:
  github: "https://github.com/privacy-scaling-explorations/vOPRF-ID/"
team:
  - name: "Magamedrasul Ibragimov"
    email: "curryrasul@pse.dev"
---

# Web2-ID Nullifiers using vOPRF

## Project Overview

Web2-ID Nullifiers is a cryptographic infrastructure project that enables pseudonymous systems for Web2 identities (like email or social accounts) using **verifiable Oblivious PseudoRandom Functions (vOPRFs)**. The project addresses the absence of native nullifiers in Web2 IDs—essential for enabling anonymous voting, forum participation, and other on-chain, privacy-preserving applications—by enabling secure, private nullifier generation tied to Web2 identity proofs (e.g., from zkEmail or TLSNotary).

## Objective

The goal is to create a secure, scalable protocol and supporting infrastructure that allows Web2 identities to be used pseudonymously across decentralized applications. This includes building a global registry akin to a "Web2 Semaphore," allowing users to reuse nullifiers without revealing their identity and without requiring trusted parties.

## Project Status

- **Stage:** MVP Development
- **Status:** Active
- **Team Lead:** Rasul Ibragimov
- **Team Members:** Aditya Bisht (joining full-time in May)

## Technical Approach

The vOPRF protocol enables deterministic yet private randomness generation. Nullifiers are computed via MPC-based OPRF, using ZK proofs to tie identity commitments (from protocols like zkEmail) to blinded requests. The design protects user identity while ensuring nullifier uniqueness and verifiability.

Key elements include:

- **ZK proofs** for identity commitment verification without revealing the underlying identity
- **MPC-based OPRF networks** to prevent single points of trust
- **Global Registry Contract** for reusability across applications

## Milestones

- **February 2025:** Full protocol spec and ethresearch post published
  - See [ethresearch pos](https://ethresear.ch/t/web2-nullifiers-using-voprf/21762)t and full description of protocol [on Github](https://github.com/privacy-scaling-explorations/vOPRF-ID) and [this presentation](https://x.com/PrivacyEthereum/status/1903084082529010174)
- **March 2025:** Initial implementation (vOPRF + zk circuits) completed see https://github.com/privacy-scaling-explorations/vOPRF-ID
- **May 2025:** Launch of PoC—fork of Stealthnote enabling pseudonymous posting via Web2-derived nullifiers
- **July 2025 (planned):** Production-ready OPRF server with key rotation and node monitoring
- **Q3 2025 (planned):** Global Registry MVP for Web2-IDs

## Applications

The protocol enables a broad range of applications requiring privacy and pseudonymity:

- **Anonymous voting** using Google or email accounts, without sign-ups or wallets
- **Pseudonymous forums** tied to organizational emails (e.g., @ethereum.org)
- **Anonymous airdrops** for GitHub users, Reddit accounts, etc.
- **Web2-on-chain identity bridging** across zkEmail, TLSNotary, Anon Aadhaar, and more

## Publications

- [Part I: Web2 Nullifiers using vOPRF](https://curryrasul.com/blog/web2-nullifiers/)
- [Part II: Web2 Nullifiers pt. II](https://hackmd.io/Mp4MQT41RGCyLvnuQtgbnw)
- [Research post on Ethereum Research](https://ethresear.ch/t/web2-nullifiers-using-voprf/21762)

## Resources

- **GitHub Repository:** [vOPRF-ID](https://github.com/privacy-scaling-explorations/vOPRF-ID)
- **Project Plan:** [HackMD](https://hackmd.io/v1W_X9FcSNi1978i_Rv2Tw)

## Contact

- **Magamedrasul Ibragimov:** [curryrasul@pse.dev](mailto:curryrasul@pse.dev) | [@curryrasul](https://twitter.com/curryrasul)
- **Join** the PSE Discord](https://discord.com/invite/sF5CT5rzrR)
