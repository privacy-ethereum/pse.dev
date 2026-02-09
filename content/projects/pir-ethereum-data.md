---
id: "pir-ethereum-data"
name: "Private Information Retrieval for Ethereum Data"
image: ""
section: "pse"
projectStatus: "active"
category: "research"
license: "Apache-2.0"
tldr: "Practical PIR infrastructure for Ethereum — researching, building, and sharing knowledge on PIR schemes that let users query Ethereum data without revealing their interests."
tags:
  keywords: ["RPC privacy", "Private Information Retrieval", "Private reads"]
  themes: ["build", "research"]
  builtWith: ["Python", "Rust"]
team:
  - name: "Ali"
    email: "ali.atiia@ethereum.org"
  - name: "Igor"
    email: "igor.barinov@ethereum.org"
  - name: "Keewoo"
    email: "keewoo.lee@ethereum.org"
  - name: "Nam"
    email: "nam.ngo@ethereum.org"
---

## Overview

Wallets currently route queries through RPC providers, exposing user interests — accounts, contracts, and transaction patterns. The solution is private reads: the ability to access on-chain data without revealing what you're looking for.

Private Information Retrieval (PIR) makes this possible — servers process encrypted requests and return encrypted responses that only the client can decrypt. This project develops practical PIR infrastructure for Ethereum — researching, building, and sharing knowledge on PIR schemes that let users query on-chain data without revealing their interests.

## Research

Many PIR schemes exist with different tradeoffs across trust model, bandwidth, server computation, and update efficiency. Ethereum itself has diverse data types (state, logs, transactions, historical archives, blobs) with different access patterns and requirements. The team works to evaluate these tradeoffs, identify application requirements, and match schemes to use cases.

Beyond individual schemes, the research also examines system architecture questions — how PIR integrates into the Ethereum stack, what the server deployment model looks like, and how to handle database updates and client state in practice.

The team is analyzing [RPC call distributions](https://github.com/0xalizk/eth-rpc-triggers-contexts) to understand real-world Ethereum data access patterns, and producing a [systematization of knowledge (SoK)](https://hackmd.io/@keewoolee/SJyGoXCzZe) that categorizes PIR schemes and their applicability to Ethereum.

## Development

Schemes of interest include [RMS24](https://eprint.iacr.org/2023/1072), [Plinko](https://eprint.iacr.org/2024/318), [InsPIRe](https://eprint.iacr.org/2025/1352), and [DPF-PIR](https://doi.org/10.1007/978-3-642-55220-5_35). The team is exploring the use of AI agents to reduce implementation effort while maintaining security. Implementing cryptographic schemes correctly is challenging for AI agents, so detailed specifications serve as ground truth anchors for correctness — enabling reliable AI-assisted porting to other languages and optimization of production implementations.

- [Runnable specifications](https://github.com/keewoolee/rms24-plinko-spec) — RMS24, Plinko, and Keyword PIR conversion in Python
- [rms24-rs](https://github.com/igor53627/rms24-rs) — RMS24 in Rust with optional CUDA acceleration
- [plinko-rs](https://github.com/igor53627/plinko-rs) — Plinko in Rust
- [inspire-rs](https://github.com/igor53627/inspire-rs) — InsPIRe in Rust
- [inspire-exex](https://github.com/igor53627/inspire-exex) — InsPIRe applied to private Ethereum state queries
- [morphogenesis](https://github.com/igor53627/morphogenesis) — GPU-accelerated 2-server DPF-PIR for Ethereum state

## Dissemination

Findings will be shared through publications and open-source specifications to advance the broader ecosystem's understanding of practical PIR.

## Further Reading

- [Vitalik's tutorial on Plinko](https://vitalik.eth.limo/general/2025/11/25/plinko.html)
