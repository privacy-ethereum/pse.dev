---
authors: ["sinu"]
title: "Introducing SpeakUp"
image: "/articles/introducing-speakup/speakup-logo.svg"
tldr: "An early look at SpeakUp, a zkVM we're prototyping at PSE for client-side, privacy-first proving of WebAssembly programs. The draft design is public and we're looking for feedback."
date: "2026-05-08"
tags: ["zkVM"]
projects: []
---

# Introducing SpeakUp

We're excited to share an early look at **SpeakUp**, a zero-knowledge virtual machine we're prototyping at PSE. SpeakUp lets you produce zero-knowledge proofs of arbitrary WebAssembly programs, with a focus on **privacy** and **client-side proving** on resource-constrained devices like phones and browsers.

## Why another zkVM?

Most existing zkVMs pursue succinctness and public verifiability to support blockchain scaling. SpeakUp is designed specifically for private applications which require neither, such as web proofs in conjunction with tools like [TLSNotary](/projects/tlsn), or identity applications which use selective disclosure of credentials. When a prover and verifier can interact directly over an internet connection, SpeakUp can provide dramatically faster end-to-end proving performance.

SpeakUp uses **VOLE-based cryptography**, which trades larger proofs for lower prover overhead and provides post-quantum security as a bonus.

<figure style="display: table; margin: 0 auto;">
  <img src="/articles/introducing-speakup/prover-proof.svg" alt="Prover Cost vs. Proof Size" />
  <figcaption style="display: table-caption; caption-side: bottom; text-align: center;">Rough illustration of where VOLE-based zero knowledge sits in relation to other classes of proving systems. Inspired by <a href="https://www.youtube.com/watch?v=5VjvkVPYdEg">presentation</a> by C. Baum.</figcaption>
</figure>

Beyond proving cost, SpeakUp is built on [WebAssembly](https://webassembly.org/). Wasm provides a formally specified ISA with structured control flow, and a well-defined embedding interface which naturally supports advanced guest program features such as invoking precompiles.

## This is a draft

SpeakUp is a **design draft**, not a finished system. We're publishing our current thinking (proof system, architecture, cost analysis) so the community can poke at it.

Read the draft design here: **[SpeakUp Documentation](https://privacy-ethereum.github.io/speakup/)**

## We want to hear from you

If any of the following sounds like you, please get in touch:

- You're building something that needs client-side ZK proofs and you're hitting walls with what's available today.
- You have a use case where privacy and prover performance are the constraints that matter.
- You've worked with VOLE-based proofs or zkVM design and have feedback on the approach.
- You spotted something that looks wrong, underspecified, or worth challenging in the draft.

The earlier we hear from you, the more your input can shape the direction: [Open an issue](https://github.com/privacy-ethereum/speakup) in the repo.
