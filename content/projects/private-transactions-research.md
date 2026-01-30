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
  - name: "Mohammad"
---

# Private Transactions Research (Jan–Jun 2026)

The Private Transactions Research Team works on privacy-preserving transaction protocols and supporting tooling for Ethereum. This page summarizes our planned work for January–June 2026.

## What we're working on

### Sonobe hardening
We are bringing `sonobe` to a production-ready state. The focus is to reduce the audit surface area, land security hardening changes, and ship a versioned release with clear constraints.

Planned outputs:
- A `dev` → `main` merge and documented, versioned release (changelog + migration notes)
- A clear audit scope and supported targets
- Audit findings addressed (or explicitly documented) and fixes merged
- Operator/developer documentation and reproducible build/CI checks
- Selected upgrades (lookup support, performance work on key hot paths, and developer experience improvements)

### PlasmaBlind (paper + potential adoption support)
We are finishing the PlasmaBlind paper and preparing a conference submission package, including reproducible benchmarks. If teams adopt the scheme, we may provide bounded integration support.

Planned outputs:
- Submission-ready paper and supplementary material
- Reproducible benchmarking notes (scripts/code pointers)
- Minimal integration notes and reference implementation pointers (as needed)

### Wormholes (redesign)
We are treating wormholes as a redesign effort and are re-deriving security goals, evaluating design avenues (including beacon chain deposit–based approaches), gathering feedback, and building a prototype. By the end of May 2026, we plan to decide whether to pursue an EIP track, continue research only, or shelve.

Planned outputs:
- Security goals and threat model document
- Design document and ethResearch post(s) for feedback
- Research-grade prototype exploring feasibility constraints
- If pursued: an initial EIP draft skeleton

### One-time programs & stealth mixers (exploratory)
We are researching one-time / pay-per-use programs using garbled circuits and extractable witness encryption, and exploring how these constructions could enable non-custodial, plausibly deniable mixers. The goal is to understand practicality constraints and publish findings and open questions.

Planned outputs:
- Literature review note (covering relevant OTP / witness encryption work)
- Mixer design write-up (protocol sketch + security goals)
- Toy prototype demonstrating the core flow and limitations
- ethResearch post summarizing results and open questions

### Misc (capped)
We keep a small buffer (capped at ~10% of team time) for targeted contributions and ecosystem support. Current areas include mapping the security boundaries of TEE-assisted privacy designs and making select upstream contributions to cryptographic tooling.

Examples of work in scope:
- A TEE literature summary and "what we will / won't rely on" stance (publication TBD)
- Contributions around primitives and tooling (e.g., proxy re-encryption, `spongefish` R1CS support, early proof aggregation notes/benchmarks)

## Team
- Chengru
- Pierre
- Mohammad