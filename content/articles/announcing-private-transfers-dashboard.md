---
authors: ["John Guilding"] # Add your name or multiple authors in an array
title: "Announcing the Private Transfers Dashboard" # The title of your article
image: "/articles/private-transfers-dashboard-announcement/cover.webp" # Image used as cover,  Keep in mind the image size, where possible use .webp format, possibly images less then 200/300kb
tldr: "Compare private transfer protocols across a variety of different metrics" #Short summary
date: "2026-05-22" # Publication date in ISO format
tags: ["Private Transfers", "Benchmarks"] # (Optional) Add relevant tags as an array of strings to categorize the article
projects: ["Private Transfers Engineering"]
---

# Announcing the Private Transfers Dashboard

We've just published a public dashboard that puts private transfer protocols side by side and compares them across a list of properties. You can find it at **[private-transfers.pse.dev](https://private-transfers.pse.dev/)**.

Right now, if you want to understand how Railgun differs from Privacy Pools, or how Zcash compares to Monero, you have to piece the answer together from docs, blog posts, Twitter threads, and code. For example, what these protocols make private varies — some hide amounts only, some hide sender and receiver, some hide the asset itself, and some support all three. The dashboard puts the protocols side-by-side so the differences are easy to see, and claims are backed by a citation to docs or code.

We're also gathering some limited benchmarks for gas cost and anonymity set size. Many private transfer protocols implement some version of the same flow — **deposit** assets into private state, **transfer** them privately, then **withdraw** back to public state. These are the three operations we benchmark gas against. Some protocols will not mimic these operations exactly — for example, mixers do not have transfer functionality.

## The Protocols We've Got So Far

Listed alphabetically:

- **Curvy** — a protocol combining stealth addresses with zk-SNARKs.
- **Fluidkey** — a stealth-address protocol.
- **Hinkal** — a zk-SNARK shielded pool with stealth addresses.
- **Intmax** — a zkRollup optimised for private payments, pushing most data off-chain.
- **Monero** — a private-by-default L1 using ring signatures and stealth addresses.
- **Privacy Pools** — a mixer that extends the Tornado Cash design with association set providers for compliance.
- **Railgun** — a zk-SNARK shielded pool.
- **Redact** — confidential transfers using Fhenix's CoFHE coprocessor.
- **Tongo** — confidential transfers on Starknet using ElGamal homomorphic encryption.
- **Tornado Cash** — the original Ethereum mixer using zk-SNARKs over fixed denominations.
- **Zcash** — a privacy-focused L1 with public and shielded transactions powered by zk-SNARKs.

Every protocol has its own page listing each property, the value we gave it, our notes, and the sources we used.

## The Properties We Compare Against

Properties are grouped into eight high-level categories. Within each category we evaluate every protocol against specific properties:

### Privacy

- **Anonymity Set Size** — number of entities participating in the protocol.
- **Confidentiality** — whether balances and transfer amounts are private.
- **Anonymity** — whether sender and receiver are hidden, including unlinkability.
- **Asset Privacy** — whether the specific asset being transferred is hidden from observers.
- **Plausible Deniability** — whether interaction with the privacy protocol is detectable.

### Cost and Performance

- **On-Chain Gas Cost: Deposit** — gas consumed when entering the private state.
- **On-Chain Gas Cost: Transfer** — gas consumed for an in-protocol private transfer.
- **On-Chain Gas Cost: Withdraw** — gas consumed when exiting back to public state.
- **Time-to-Finality** — how long until a transaction is irreversible.

### UX

- **Number of Secrets** — how many secrets the user must store and manage.
- **Deposit Time** — any waiting period required before depositing.
- **Withdraw Time** — any waiting period required before withdrawing.

### Decentralization & Security

- **Censorship Resistance** — whether any entity can prevent valid transactions from being included.
- **External Network Dependence** — whether the protocol relies on an external network with extra crypto-economic assumptions.
- **Escape Hatch** — whether users can exit relying only on the underlying chain's consensus and cryptography.
- **Upgradeability** — how protocol upgrades are performed (admin, multi-sig, DAO, hard fork, immutable).
- **Client-Side Proving** — whether proofs are generated on the user's device or by an external service.
- **Third-Party Inspectability** — whether any third party can inspect users' private data.
- **Implementation Maturity** — how production-tested the protocol is, on a 1–5 scale.
- **Post-Quantum Secure** — whether the cryptography is resistant against quantum computers.

### Compliance

- **Layer of Enforcement** — where compliance is enforced: asset, app, protocol/chain, or none.
- **Enforcement Entities** — who enforces it: DAO, third party, admin, asset issuer, or none.
- **Type of Compliance** — POI/ASP, selective disclosure, KYC/KYB, programmatic policies, other, or none.
- **Point of Enforcement** — at which point compliance is checked: deposit, transfer, withdrawal, or none.
- **Selective Disclosure: Viewing Entity** — who can access private transaction data.
- **Selective Disclosure: Viewing Control** — whether viewing permissions are pre-defined or programmable.

### Verifiable

- **Cryptographic Verifiability** — whether transaction correctness is guaranteed by cryptography.
- **Open Source** — whether the core infrastructure is publicly available under an open-source license.

### State

- **Private State Scalability** — how protocol-specific private data grows over time.
- **Client-Side Indexing** — whether the user's device must scan the chain to track balances.
- **Private State Model** — UTXO-based or account-based.
- **Private Data Storage** — where private transaction data is stored. For example in smart contracts, events, or the protocol state itself in the case of L1s.

### Composability

- **Access to DeFi** — whether and how private assets can interact with DeFi.
- **Programmability / Generality** — the expressiveness of private logic, from simple payments to private smart contracts.

## How the Benchmarks Work

While most data on the dashboard is static, we're gathering some limited benchmark data for protocols: gas-cost and anonymity set sizes. These values come from on-chain data, indexed via [The Graph](https://thegraph.com/).

For each protocol we read the contracts to identify the events that correspond to a deposit, a private transfer, and a withdrawal (for example Tornado Cash's `Deposit` and `Withdrawal`, or Railgun's `Shield`, `Transact`, and `Unshield`). Then we write a small subgraph mapping that listens for those events and records the gas used, along with any additional data we need.

The subgraph keeps running totals and counts as it indexes, so the dashboard only has to fetch a handful of summary entities.

### Anonymity Set Benchmarks

The anonymity set size property is the other live benchmark figure we're wiring into the dashboard. The mechanic is the same idea as for gas cost benchmarks, but applied to different parts of state. For a shielded pool, the anonymity set is roughly the set of commitments a given transfer could be hiding amongt, so we just need to count commitment events and expose that. For Tornado Cash that's `Deposit` events per fixed-denomination instance. For Railgun it's the commitments emitted by `Shield` and `Transact` events. This feature isn't live yet, but we expect it to go live over the next few weeks.

## What's Coming Next

This is the initial version of the dashboard with a limited number of protocols. We will continue adding to the dashboard over the next few months.

In the near term, we're expanding coverage of protocols on **Ethereum**. After that we'll also add:

- More **L2s** with privacy-focused designs.
- **Alternative L1s** with native privacy.
- A small number of non-Ethereum privacy projects to gain an understanding of how other ecosystem projects match up.

## Contribute

If you can think of a privacy protocol that isn't yet covered and would like to see it, you can open an issue. Make sure to check if it already exists under an open issue. You can also contribute protocol details yourself and assign yourself to an issue. You can see our full contribution guidelines [here](https://github.com/privacy-ethereum/private-transfers-benchmarks/blob/main/CONTRIBUTING.md).
