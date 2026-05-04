---
id: "private-transactions-research"
name: "Private Transactions Research"
image: ""
section: "pse"
projectStatus: "active"
category: "research"
tldr: "The Private Transactions Research Team works on privacy-preserving transaction protocols and supporting tooling for Ethereum."
tags:
  keywords: ["private transactions", "privacy", "Ethereum", "PlasmaBlind", "sonobe", "folding", "wormholes", "beacon chain deposits", "garbled circuits", "extractable witness encryption", "TEEs", "proof aggregation"]
  themes: ["privacy", "research"]
  types: ["research"]
team:
  - name: "Chengru"
  - name: "Pierre"
---

# Private Transactions Research (Q2/Q3 2026)

The Private Transactions Research Team works on privacy-preserving transaction protocols and supporting tooling for Ethereum. This page summarizes our planned work for Q2/Q3 2026.

## What we're working on

### Sonobe
We are bringing `sonobe` to a production-ready state — closing out the audit cycle, supporting downstream consumers on the audited version, and shipping the zero-knowledge layer that privacy-protocol consumers depend on. In Q3 we begin the post-quantum folding line.

Planned outputs:
- A `dev` → `main` merge and documented, versioned release (changelog + migration notes)
- AI vs human audit publication on ethResearch + a recommended audit workflow for ZK projects
- Downstream migration support for consumers moving onto the audited version
- Zero-knowledge layer for folding shipped to `main` by end of June with documentation
- (Q3) Post-quantum folding design + initial implementation
- (Q3) PQ signature aggregation circuits and benchmarks

### PlasmaBlind (paper)
We are merging Plasma Fold and PlasmaBlind into a single paper and preparing it for reviewer feedback. The combined work delivers sub-100 ms client-side proving with ~36k TPS centralised (~1,150–1,800 TPS decentralised). See [eprint 2026/634](https://eprint.iacr.org/2026/634.pdf).

Planned outputs:
- Merged Plasma Fold + PlasmaBlind paper, submitted for reviewer feedback
- Reproducible benchmarking notes (scripts/code pointers)

### Lean Staking
Lean Staking turns the staking contract into a shielding mechanism for ETH — to our knowledge the first L1-native construction providing two-sided plausible deniability for ETH transfers, with both sender and recipient performing actions indistinguishable from routine staking. No consensus-layer changes required. This picks up the prior wormholes research line and matures it into a concrete EIP. See [EIP-8222](https://ethereum-magicians.org/t/eip-8222-lean-staking/28196).

Planned outputs:
- Updated EIP draft addressing open issues (network-level anonymity, gas-subsidised propagation for fresh-address private transactions, non-custodial validation)
- ACDE discussion + a written summary of community feedback
- `0x03` withdrawal credential extension to preserve two-sided plausible deniability
- Devcon presentation package + project website

### L1 privacy
We are writing on how to build an L1-native, post-quantum-secure private ETH transfer protocol — organised around the three classic questions for any private transfer protocol (solvency, spending authority, transaction detection), each evaluated under both PQ-soundness and PQ-privacy. The cycle deliverable is a single end-of-June writeup pulling the sub-track findings together; implementation continues toward Devcon Mumbai under a follow-on plan.

Planned outputs:
- End-of-June writeup integrating all sub-track findings
- OMR (oblivious message retrieval): literature review, toy implementations, and a go / no-go memo by end of May
- PIR (private information retrieval): primitive evaluation and integration sketch
- PQ signature verification ZK circuits + cross-ZKVM benchmarks (shared with Sonobe Q3)
- Hardware-wallet integration scoping + initial signer prototype
- Smart account / new wallet design scoping doc

## Team
- Chengru
- Pierre
