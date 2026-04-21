---
authors: ["PSE Comms Team"]
title: "PSE May 2025 newsletter" 
image: "/articles/pse-may-2025/cover.webp" 
tldr: "Check out what PSE teams have been focused on in May 2025!" 
date: "2025-05-30"
tags: ["newsletter",
    "post quantum cryptography",
    "private proof delegation",
    "client side proving",
    "machina io",
    "voprf",
    "tlsnotary",
    "maci",
    "zk-kit",
    "mpc framework",
    "mopro",
    "semaphore",
  ]
projects: [
"post-quantum-cryptography", 
"private-proof-delegation", 
"client-side-proving", 
"machina-io", 
"voprf", 
"tlsn", 
"maci", 
"zk-kit", 
"mpc-framework", 
"mopro", 
"semaphore",]
---

At PSE, we work on long-term exploration of cryptographic primitives, applied protocol design, and practical implementation. Here's what our teams have been focused on in May 2025:

## [Post-Quantum Cryptography](https://pse.dev/en/projects/post-quantum-cryptography)

Quantum-resistant cryptography remains a long-term bet for Ethereum. We're currently finalizing a report on aggregating Falcon signatures with LaBRADOR for better efficiency. Early results suggest this may be viable for Ethereum-scale use cases. We're also initiating a collaboration with OpenFHE to explore privacy-friendly AI — a promising direction that brings together verifiable FHE and ML.

## [Private Proof Delegation](https://pse.dev/en/projects/private-proof-delegation)

To reduce prover requirements for end-users, the Delegated Proving team is finalizing work on a TEE-based privacy-preserving delegation (PPD) system. The next phase will experiment with fully homomorphic encryption (FHE)-based proof-carrying data schemes. Collaboration with COSIC and OpenFHE maintainers is helping us push this forward.

## [Client-Side Proving](https://pse.dev/en/projects/client-side-proving)

We're benchmarking post-quantum proof systems with an eye toward practical deployments in identity. Our recent [zkID benchmarks](https://hackmd.io/@clientsideproving/zkIDBenchmarks) compare multiple options, with future work exploring rerandomization techniques and the Ligerito PCS. This research is feeding directly into the zkID wallet effort.

## [Indistinguishability Obfuscation (iO)](https://pse.dev/en/projects/machina-io)

The iO team has reached a critical milestone: a full end-to-end implementation using real security parameters. This makes our approach to iO more concrete than ever. You can read the first writeup on [Machina iO](https://machina-io.com/posts/hello_world_first.html). Next up: formalizing the Diamond iO paper and exploring noise-refreshing optimizations.

## [Verifiable OPRF (vOPRF)](https://pse.dev/en/projects/voprf)

We've released an MVP implementation of our collusion-resistant vOPRF system with full documentation and deployment guides. The next step is integrating it into Stealthnote, a secure messaging and note-sharing platform. This will also be the basis for secure authentication in the upcoming PSE Forum.

## [TLSNotary](https://pse.dev/en/projects/tlsn)

TLSNotary has released [alpha.10](https://github.com/tlsnotary/tlsn/releases/tag/v0.1.0-alpha.10), introducing identity-bound attestations and improving the plugin flow for browsers. A team meetup is planned for deeper work on plugin infrastructure and roadmap planning. Expect new updates around zkTLS at DevConnect.

## [MACI](https://pse.dev/en/projects/maci)

We've deepened MACI's integration with on-chain governance tooling. Recent updates include new gatekeepers, an Aragon plugin, and governance-specific UX flows. We've also sunset the MACI Platform in favor of a modular v3 Starter Kit. MACI is now being integrated into upcoming governance experiments like PriVote and Gitcoin.

## [zk-kit](https://pse.dev/en/projects/zk-kit)

Both the Rust and Noir stacks have seen key improvements. We've introduced new Merkle root utilities, library versioning via tags, and improved integration support at events like NoirHack. A community exit plan is also in the works to steward zk-kit long-term.

## [MPC Framework](https://pse.dev/en/projects/mpc-framework)

The team shipped the Trinity release and launched the Summon API, including support for Deno and early integrations. A strong design and documentation effort is helping push adoption. Work continues on performance, boolean IO support, and integrations with the Ethereum Tour.

## [Mopro](https://pse.dev/en/projects/mopro)

Mopro continues to be the connective tissue for zkID and identity work across platforms. The team rolled out cross-platform SDKs, integrated ZKEmail Noir circuits, and supported design for architecture diagrams and events. Collaborations are deepening with the EZKL and Anon Aadhaar teams.

## [Semaphore](https://pse.dev/en/projects/semaphore)

Semaphore now runs in native Rust, enabling better mobile and embedded support. We're also exploring scaling Semaphore to millions of users via private information retrieval (PIR). RLN v3 is out with support for EdDSA and LeanIMT. [Live benchmarks](https://rln-benchmarks.vercel.app/) show significant performance gains — see our comparative analysis [here](https://www.notion.so/1ced57e8dd7e809fae70dce3a4061118?pvs=21).
