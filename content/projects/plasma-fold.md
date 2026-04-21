---
id: "plasma-fold"
name: "Plasma Fold"
image: ""
section: "pse"
projectStatus: "active"
category: "research"
tldr: "Integrating folding schemes into plasma-based L2 solutions for efficient and scalable Ethereum transactions."
tags:
  keywords:
    [
      "plasma",
      "folding schemes",
      "Ethereum",
      "scalability",
      "L2",
      "zero-knowledge proofs",
    ]
  themes: ["scalability", "L2 solutions", "zk proofs"]
  types: ["research", "development"]
---

## Plasma Fold

**Reimagining Plasma with Folding Schemes**

Plasma Fold is an experimental Layer 2 (L2) design that combines the original Plasma architecture with modern zero-knowledge folding schemes to dramatically scale Ethereum transaction throughput. By leveraging recent advances in Incremental Verifiable Computation (IVC) and folding-based proof systems, Plasma Fold achieves high-speed client-side proving while keeping on-chain data to a minimum.

Unlike traditional rollups that post extensive transaction data to L1, Plasma Fold operates using a _minimal data availability_ model inspired by Intmax, where only essential metadata—like tree roots and signer indices—are recorded onchain. Validity is ensured through user-generated proofs, making this model far more efficient for resource-constrained environments.

## Why Plasma Fold?

Most L2s today struggle to scale without relying on increasingly expensive data availability solutions (e.g., blobs). Plasma Fold offers a low-cost, RAM and proving-speed efficient, high-throughput alternative. Inspired by Vitalik Buterin's vision of a Plasma-EVM hybrid, Plasma Fold explores the use of folding schemes to support lightweight client-side proving—ideal for mobile or browser-based clients. In theory, this architecture could enable transaction rates in the range of 90k–260k TPS, matching or exceeding centralized systems like VISA.

## Key Innovations

- **Client-Side Proving with Folding Schemes:** Users generate IVC proofs on their devices to attest to their own balances and transactions, minimizing trust and computation on the L1.
- **UTXO-Based Design with IVC:** Transactions are modeled as UTXO trees, allowing users to maintain and prove their own balances incrementally across time.
- **Minimal Onchain Footprint:** Only block roots, nullifier indices, and signer bitmaps are posted on L1—greatly reducing gas costs and data needs, using Intmax low onchain data model.
- **Instant Exits & Offline-Friendliness:** Users can exit the system at any time using a locally stored proof. They do not need to stay online between blocks unless actively transacting.
- **Composable and Future-Proof:** Designed to eventually support multiple assets, order books, and potentially even programmable features.

## Status

- **Stage:** Research and Prototyping
- **Target Output:** A technical paper and reference implementation
- **Team Lead:** Pierre Daix-Moreux
- **Collaborators:** Chengru

## Learn More
- [PlasmaFold eprint](https://eprint.iacr.org/2025/1300)
- [PlasmaFold implementation](https://github.com/dmpierre/plasma-fold)
- [Technical Write-Up on Intmax2](https://www.pierredm.xyz/posts/intmax)
- [GitHub – Sonobe](https://github.com/privacy-scaling-explorations/sonobe)

## Get Involved

Join the conversation on [PSE Discord](https://discord.com/invite/sF5CT5rzrR)
