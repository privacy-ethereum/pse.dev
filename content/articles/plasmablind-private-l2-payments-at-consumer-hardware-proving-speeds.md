---
authors: ["Pierre", "Chengru"]
title: "PlasmaBlind: Private L2 Payments at Consumer-Hardware Proving Speeds"
tldr: "PlasmaBlind is a new design for a private, scalable L2 on Ethereum. It uses a folding-scheme technique called BlindFold for sub-100 ms client-side proving and a linked dual-IVC architecture for ~270 to 360 ms aggregator cost per transaction."
date: "2026-05-18"
tags:
  [
    "privacy",
    "rollups",
    "folding schemes",
    "zero-knowledge proofs",
    "layer 2",
    "plasma",
    "sonobe",
  ]
projects: ["plasma-fold"]
---

# PlasmaBlind: Private L2 Payments at Consumer-Hardware Proving Speeds

Ethereum is open, credibly neutral, and fast enough for many use cases. The missing piece is privacy. Every transfer is permanently visible on a public ledger. A single linked address is enough for anyone with a block explorer to reconstruct most of a person's financial life.

[PlasmaBlind](https://eprint.iacr.org/2026/634) is one attempt to close that gap. It is an L2 design built on folding schemes and a folding-scheme technique called *BlindFold*. PlasmaBlind hides amounts and recipients. Users generate transaction proofs on a laptop in under 100 ms. A single aggregator processes each transaction in 270 to 360 ms. Everything settles to Ethereum L1.

The technical note by Pierre and Chengru continues the [PlasmaFold](https://eprint.iacr.org/2025/1300) line of work. This post is a tour of the cryptographic ideas, the protocol design, and the benchmarks.

## Why private L2s are hard

Scaling and privacy have largely been worked on independently.

On the scalability side, rollups, plasma, and validium move transaction processing off L1 onto an aggregator that batches transactions and posts compressed updates back on-chain, with a fraud proof window or a validity proof. In a "zk-rollup", the SNARK certifies *correctness* of state transitions. It does not hide the data.

On the privacy side, pioneers such as [Zerocash](https://ieeexplore.ieee.org/document/6956581) and its [Zcash](https://z.cash/) deployment showed how zkSNARKs can hide amounts and participants in payments. These systems are standalone L1s, so their throughput is bounded by what a base layer can do.

Several teams have combined zkSNARK-based private transactions with an L2: [Nightfall](https://github.com/EYBlockchain/nightfall_4_CE), [Aztec](https://aztec.network/), [Intmax2](https://eprint.iacr.org/2023/1082), and others. Each design makes its own choices: where the bulk of proving cost lives, how data availability is handled, what kind of privacy is offered, how users keep their state in sync. The space is large.

PlasmaBlind keeps proving cheap on both the user side and the aggregator side, which is achieved thanks to our extensive use of folding schemes.

## A short primer on folding schemes

A folding scheme is a cryptographic primitive. It lets a prover combine ("fold") two satisfying instance-witness pairs of the same circuit into a single satisfying pair, in time and space proportional to the *size of one* pair rather than the cost of a fresh proof. A representative construction was introduced in [Nova](https://eprint.iacr.org/2021/370), which was later extended by subsequent works such as [SuperNova](https://eprint.iacr.org/2022/1758) and [HyperNova](https://eprint.iacr.org/2023/573).

In a private L2, every user produces their own proof and the aggregator has to combine many of them into one block proof. The usual way to do that is to verify each proof inside another proof, which gets expensive fast. Folding lets you combine the underlying instances directly instead, much more cheaply.

We have been working on folding schemes at PSE for a while. Most of the implementation effort lives in [Sonobe](https://github.com/privacy-ethereum/sonobe), our open-source folding library, jointly maintained with 0xPARC. PlasmaBlind is built on Sonobe.

### The blinding observation, and BlindFold

PlasmaBlind is named after *BlindFold*, a technique observed in [HyperNova](https://eprint.iacr.org/2023/573). The core idea is that, to achieve zero-knowledge, a *blinding* folding scheme is sufficient, even without a full fledged zkSNARK. Some folding schemes, including Nova, enjoy this blinding property. If you fold a satisfying instance-witness pair $(𝕨, 𝕦)$ with a uniformly random satisfying pair $(\mathbb{W}^{\star}, \mathbb{U}^{\star})$, the resulting folded witness $𝕎$ reveals nothing about the original $𝕨$. Soundness still ties $𝕎$ to a satisfying instance.

In BlindFold, The prover only has to do the following steps:

1. Evaluate the circuit on its private input to produce one satisfying pair.
2. Run a single fold against a random satisfying pair.

The resulting "proof" is the rerandomized pair. Verification is one fold check. This is much cheaper than producing a Groth16 or PLONK proof of the same circuit, with the zero-knowledge guarantee under standard assumptions on the underlying commitment scheme.

But the proof is not yet succinct. The rerandomized witness has the size of the original witness. For a system that pipes those proofs into an aggregator that immediately folds them again, that is fine. The aggregator pays the succinctness cost once at the end of a block. Users do not pay it at all.

## What PlasmaBlind does

PlasmaBlind is a UTXO-model payment L2. A user holds UTXOs, sends *shielded* transactions that hide amounts and recipients (and consume input UTXOs as nullifiers), and receives new UTXOs back. The aggregator builds blocks from validated shielded transactions and posts a constant-size proof of block validity to a rollup contract on L1.

The design rests on three choices.

**Sender public keys are revealed; amounts and recipients are hidden.** PlasmaBlind hides the things most users mean by "private payment": how much, and to whom. It does not hide *that* a particular sender transacted in a particular block. The reason is data availability: the sender needs to verify that the transaction they endorsed (came back with a validity proof for) landed in the block they expected, which means the block has to reveal who endorsed it.

**Client-side proving uses BlindFold.** When a sender finalises a transaction, they evaluate the circuit for the transaction-validity relation on their secret data, derive a satisfying instance-witness pair, sample a random pair, and fold the two. The transaction proof shipped to the aggregator is the rerandomized pair. There is no general-purpose zkSNARK prover anywhere in the user flow.

**Balance proofs are kept up to date with folding-based IVC.** Each user maintains a local balance proof that incorporates only the blocks they actually transacted in, not every block. To exit, the user hands the balance proof to the rollup contract. No aggregator interaction required. This gives PlasmaBlind *instant exits*: even if the aggregator stops cooperating, any user with a current balance proof can withdraw on L1.


## The aggregator: linked dual IVC chains

The harder problem is on the aggregator side. The aggregator receives BlindFold transaction proofs from many users and produces one constant-size proof of block validity. Two things have to happen at once:

1. *Aggregate the user proofs.* Each user's rerandomized pair is folded into a running accumulator pair $(𝕎̃, 𝕌̃)$.
2. *Prove L2 state updates.* For each transaction, the aggregator runs a state-transition step circuit (insert into the public-key tree, insert nullifiers into an interval Merkle tree, update the committed-UTXO tree) and folds its execution trace into a separate accumulator $(𝕎^{blk}, 𝕌^{blk})$.

The two computations are on different circuits. The standard tool for handling that is non-uniform PCD: a more general version of IVC that lets a single proof span different circuit shapes and tree-shaped aggregation. PCD works, but it is expensive. Every step pays the cost of the larger circuit, plus extra overhead from the machinery that lets two different shapes coexist.

PlasmaBlind takes a different route. It runs two parallel IVC chains instead of one PCD chain, with each chain stuck to its own circuit. One chain just accumulates user proofs. The other runs the state-update circuit. They are tied together by a single check inside the state-update circuit: at every step, it verifies that the user proof being folded into the first chain belongs to the same transaction the second is processing. The link lives inside the circuit, so IVC soundness is enough to keep the two chains consistent. No separate proof-composition step needed.

The result: the aggregator gets the expressivity of non-uniform PCD without paying its overhead. At the end of a block, both chains are compressed by a *decider SNARK* (the final, succinct, on-chain-verifiable wrapper around an IVC proof) into a single constant-size, zero-knowledge block proof. The rollup contract verifies that proof.

Compared with SuperNova, the technique starts from a different premise: it focuses on *linking* multiple folding instances that have (partially) shared witnesses. SuperNova supports general non-uniform circuits by *selecting* among multiple folding instances at each step, with no guarantee that those instances share witnesses. SuperNova can be extended to manually link witnesses across steps, but PlasmaBlind handles the link in a single step with smaller recursion overhead.

## What it actually costs

Benchmarks are preliminary, on consumer hardware: an Apple M1 Max with 32 GB of RAM for the client side, an Intel i9-12900K with 64 GB of RAM for the aggregator. Transactions are 2-input-2-output and 4-input-4-output shielded transfers, hashed with either Poseidon or Griffin. (Griffin's security has been recently questioned; the numbers should be read as representative of similarly-shaped, safer alternatives.)

**Client-side proving** (circuit synthesis plus one BlindFold fold):

| Configuration       | Transaction validity | Balance update |
|---------------------|----------------------|----------------|
| Griffin, 2-in/2-out | 32.8 ms              | 43.1 ms        |
| Poseidon, 2-in/2-out| 51.8 ms              | 45.8 ms        |
| Griffin, 4-in/4-out | 60.4 ms              | 46.4 ms        |
| Poseidon, 4-in/4-out| 94.0 ms              | 48.3 ms        |

Sub-100 ms across configurations.

**Aggregator-side block building.** At 128 transactions per block, total time ranges from 34.0 s (Griffin, 2-in/2-out) to 45.5 s (Poseidon, 4-in/4-out): roughly 270 to 360 ms per transaction. Local instance folding dominates the breakdown (51 to 60% of total time), then user instance folding (19 to 21%), step circuit synthesis (11 to 22%), and validation (7 to 10%). All four phases scale linearly with the number of transactions.

**Throughput** depends on the deployment.

- *Centralized.* A single aggregator that does not post nullifiers gets ~36,604 TPS at a 12 s L1 block time, given Intmax2-style ~4.15-byte short user IDs and a 14-blob-per-block target.
- *Decentralized.* With multiple aggregators, the system has to broadcast nullifiers as part of block bodies, so per-transaction data grows to ~132 bytes. Throughput drops to ~1,149 TPS, or ~1,805 TPS if nullifiers are truncated to 20 bytes.

**Transaction proof sizes** scale with block-tree height (which controls the anonymity-set size). A 2-in/2-out Griffin proof at height 4 is 259 KB. A 4-in/4-out Poseidon proof at height 32 is 1,901 KB. Larger anonymity sets cost roughly 11 to 18 KB per height step.


## What's next, what's open, and how to get involved

The technical note includes a full construction, pseudocode for the circuits, and end-to-end benchmarks from a working implementation. However, one should treat it as a research prototype, since many components are still missing or need to be improved. No formalized security models and proofs are given. Benchmarks and comparison with related work are still preliminary. The construction and implementation are not yet peer-reviewed or audited. The decentralized-aggregator design is sketched but not fully specified: coordinating multiple aggregators around a shared nullifier tree is the next systems problem.

There are also deliberate privacy tradeoffs. Sender public keys leak per-block transaction frequency. Anonymity sets are bounded by epoch tree height, which is a knob users and operators tune. PlasmaBlind inherits Intmax2-style minimal on-chain data, which is part of why throughput is high, but is also what users are trusting when they assume they can always exit.

If you want to engage:

- The technical note: [eprint.iacr.org/2026/634](https://eprint.iacr.org/2026/634) (CC-BY 4.0).
- The implementation: [github.com/dmpierre/plasma-fold](https://github.com/dmpierre/plasma-fold), built on [Sonobe](https://github.com/privacy-ethereum/sonobe).
