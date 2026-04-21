---
authors: ["PSE Team"]
title: "The next chapter for zkEVM Community Edition"
image: "/articles/the-next-chapter-for-zkevm-community-edition/the-next-chapter-for-zkevm-community-edition-cover.webp"
tldr: ""
date: "2024-06-05"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/hqLMwLfKmQLj773QCRLTOT-Z8sSUaTEfQpBSdTbitbs"
tags:
  [
    "zkevm",
    "zero-knowledge proofs",
    "ethereum",
    "scaling",
    "cryptography",
    "rollups",
    "zkvm",
    "research",
    "infrastructure/protocol",
    "proof systems",
  ]
projects: ["zkevm-community"]
---

We are excited to share some updates on our road to building a zkEVM, as we generalize our exploration towards the design and implementation of a general-purpose zkVM.

Zero-knowledge research and development in the broader Ethereum ecosystem has been bearing wholesome fruits over the past three years. That came after years of vibrant ideation with an uncompromising approach to security, building on the shoulders of giants of the prover-verifier computational model in computer science and cryptography.

Progress has been accelerating in the theory, design, and engineering of general-compute ZK systems since 2021, when we started working on a zkEVM implementation alongside our collaborators. We replaced the backend of the Halo2 instantiation of PLONK with the KZG commitment scheme in order to facilitate verification on Ethereum, and with it we collectively built highly-optimized circuits of self-contained components of the Ethereum protocol. We extend our thanks and appreciation to the Scroll and Taiko teams, who developed the project with us from the early days, as well as the many amazing community contributors, for their great contributions to this effort.

We are lifting circuits of some [primitives](https://github.com/privacy-scaling-explorations/zkevm-circuits/blob/main/zkevm-circuits/src/keccak_circuit.rs) into their own libraries for the community to take advantage of, especially in the emerging paradigm of zkVMs with hand-optimized precompiles. Today, our fork of Halo2 has a [distinct architecture](https://github.com/privacy-scaling-explorations/halo2/pull/254), [expanded features](https://github.com/privacy-scaling-explorations/halo2curves), and an active community of contributors [pushing it forward](https://github.com/privacy-scaling-explorations/halo2/pull/277). We congratulate Scroll for bringing the fruits of our collaboration to a [successful zkRollup deployment](https://scroll.io/blog/founder-letter).

With our experience building a zkEVM, and with libraries, [designs](https://github.com/privacy-scaling-explorations/zkevm-circuits/pull/1785), and a state-of-the-art proof development kit under our belt, we now shift our focus to a new zkVM design that explores different ideas — [old](https://dl.acm.org/doi/abs/10.1145/2699436) and [new](https://eprint.iacr.org/2024/325) — and researches and fine-tunes new ones, particularly given the improvements in prover efficiency that weren't available 2 years ago. There is a lot that goes into proving the validity of an Ethereum block, and targeting a lower-level VM for arithmetization simplifies proving the parts for light clients, and reduces the complexity of proving the whole of Ethereum blocks.

The generality of zkVMs incurs overhead, but that is outweighed by gains in lower complexity, better auditability, and easier maintenance as the proof system of the execution environment gets abstracted away from changes to the base Ethereum protocol.

We remain focused on our long-term goal: accessible proving and verification of Ethereum blocks — and without additional trust assumptions on light clients. Combined with upcoming upgrades such as danksharding, the end-game of maximally decentralized, scalable, and secure Ethereum is firmly in-sight, and we are thrilled to continue playing a major role towards that wonderful destination.

We build in the open, and welcome collaboration with and contributions from builders in our ecosystem who share our values and commitment to advancing free, open, secure, and privacy-preserving software for our societies.
