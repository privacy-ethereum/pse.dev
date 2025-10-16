---
authors: ["Pierre"]
title: "A trustless and simple 14k+ TPS payment L2 from Plasma and client-side proving"
image: "/articles/a-trustless-and-simple-14k-tps-payment-l2-from-plasma-and-client-side-proving/cover.webp"
tldr: ""
date: "2025-07-18"
tags:
  [
    "intmax",
    "plasma",
    "l2",
    "scaling",
    "zero-knowledge proofs",
    "validity proofs",
    "data availability",
  ]
projects: ["plasma-fold"]
---

# A trustless and simple 14k+ TPS payment L2 from Plasma and client-side proving

We are excited to present our latest work: PlasmaFold ([repo](https://github.com/dmpierre/plasma-fold), [eprint](https://eprint.iacr.org/2025/1300)), an incrementally verifiable, simple and efficient payment L2 reaching 14k+ TPS. PlasmaFold operates under a "verifiable plasma" regime. On one hand, it uses plasma-like data availability requirements, restricting the amount of data posted by an aggregator to minimal amounts. On the other, it requires the plasma aggregator to verifiably build blocks and users to run a (lightweight) client-side prover.

This combination removes from the aggregator most of its cheating avenues while allowing users to exit the chain non-interactively at any point in time, without any particular assumptions regarding their liveness.

Our prototype implementation demonstrates a PlasmaFold aggregator running on low-end hardware and a WebAssembly (WASM) client-side prover efficiently running within a chrome browser. 

## Protocol description

We succinctly describe here the PlasmaFold L2 protocol, where further details can be found in the [eprint](https://eprint.iacr.org/2025/1300). PlasmaFold runs on two kind of proofs: (1) a block proof $\Pi^{\mathsf{block}}_{t}$ produced by the aggregator and (2) a balance proof $\Pi^{\mathsf{balance}}_{id}$ managed by each user. 

First, the aggregator builds a transaction tree $\mathcal{T}^{\mathsf{tx}}_t$, composed of leaves consisting in transaction hashes. Before running the IVC prover, the aggregator proposes to each transaction sender with id $id$ the root $r^{\mathsf{tx}}_{t}$ along a merkle inclusion proof $\pi^{\mathsf{tx}}_{t}[id]$ for their corresponding $id$ and transaction within $\mathcal{T}^{\mathsf{tx}}_t$. Transaction senders acknowledge receiving and checking the proposal by sending back their signature over their transaction and the aggregator's transaction tree root $\mathtt{sign(} \mathsf{tx} \vert \vert r^{\mathsf{tx}}_{t}\mathtt{)}$.

When done, the aggregator runs his IVC prover. At each step, it ensures that each sender signature is correct, accumulates the transaction signer's public key into an accumulator $\mathtt{acc}^{\mathsf{signer}}_{t}$  and updates a global UTXO tree $\mathcal{T}^{\mathsf{utxo}}_t$, according to each transaction's input/outputs. 

When done, the aggregator posts $\mathcal{L}^{\mathsf{signer}}_{t}$ along with the block IVC proof $\Pi^{\mathsf{block}}_{t}$ containing the updated global UTXO tree root $r^{\mathsf{utxo}}_t$, the transaction tree root $r^{\mathsf{tx}}_{t}$ and the signer accumulator value $\mathtt{acc}^{\mathsf{signer}}_{t}$. The rollup contract checks the value of $\mathtt{acc}^{\mathsf{signer}}_{t}$ from the posted $\mathcal{L}^{\mathsf{signer}}_{t}$, correspondingly increments nonces of transaction senders and computes the block hash value $h^{\mathcal{blk}}_{t} = H(t, r^{\mathsf{tx}}_{t}, \mathtt{acc}^{\mathsf{signer}}_{t})$, where $t$ is the current block height.

![plasmafold-txflow](https://hackmd.io/_uploads/r1JrVSRTeg.png)
*Generating and verifying an IVC block proof in PlasmaFold*

Upon sending or receiving a transaction, users run their client-side IVC prover. At each step, the user's IVC recomputes $h{\mathcal{blk}}_{t}$, ensures that the claimed transaction is in the claimed transaction tree root $r^{\mathsf{tx}}_{t}$, updates the user's balance while preventing block or transaction replays using the block height $t$ and the transaction's index within $\mathcal{T}^{\mathsf{tx}}_t$.

We handle deposits and withdrawals as special kinds of transactions, where the former has a special, pre-determined, address as sender while the latter as a special, pre-determined, address as recipient. Thus, users can bridge back to the L1 using a regular transaction by sending to the special, agreed-upon, address. In the case of an emergency exit, users can simply send their PlasmaFold IVC balance proof $\Pi^{\mathsf{balance}}_{id}$ to the rollup contract to non-interactively withdraw their funds. 

## Throughput

We consider the case where a block is only composed of transactions (no deposits or withdrawals) and all senders have signed $r^{\mathsf{tx}}_{t}$.

Here, $t$ is obtained on the rollup contract and 
$r^{\mathsf{utxo}}_t$, $r^{\mathsf{tx}}_{t}$ and $\mathtt{acc}^{\mathsf{signer}}_{t}$ are each 32 bytes values. The aggregator posts the content of $\mathcal{L}^{\mathsf{signer}}_{t}$ for the contract to compute $\mathtt{acc}^{\mathsf{signer}}_{t}$.
Each element is, say, $\sim 4.15$-byte integer representing the user $id$. In that setting the L2 can accommodate for more than the current earth population and a value similar to [Intmax2](https://eprint.iacr.org/2023/1082).
Assuming that we use [MicroNova](https://eprint.iacr.org/2024/2099) for the decider SNARK, the compressed proof size hovers at 12 KB given the aggregator circuit size.
To compute the throughput of our L2, we divide the amount of data which can be inserted into an L1 block by the number of seconds occurring between two blocks[^scaling].
In the case of Ethereum, within a blob of size 0.375MB and a block time of 12s, we have:

$$ \frac{0.375 \text{ MB} - 12000 \text{ MB} - 96 \text{ B}}{{4.15 \text{ B}}\times {12 \text{ s}}} \approx 7300 \text{ TPS}$$

Moreover, Ethereum's recent Pectra upgrade, which includes EIP-7691, doubled the average amount of available data, placing PlasmaFold at $\approx 14000 \text{ TPS}$.

## Benchmarks

To demonstrate the performance of PlasmaFold and study how transaction batch size impacts efficiency, we evaluate the aggregator and user IVC by measuring the circuit size, prover time, RAM usage and SRS size. We leverage a folding-schemes based IVC, namely [Nova](https://eprint.iacr.org/2021/370) and prototype both our aggregator and client-side prover using [Sonobe](https://github.com/privacy-ethereum/sonobe), a modular folding-schemes library, built on top of arkworks. 

First, since most blockchain wallets run within browsers, we compile to WebAssembly our client-side prover and run our benchmarks within a chrome browser with an apple m2 pro and 16GB of RAM.

| $\textbf{Batch size}$  | $\vert\mathcal{F}_{\mathsf{user}}\vert$ | $\vert\mathcal{F}^{\mathsf{aug}}_{\mathsf{user}}\vert$  | $\mathsf{IVC}.\mathcal{P}$ (s) | $\textbf{RAM usage}$ (MB) | $\vert \mathsf{srs} \vert$ (MB)|
|---|---|---|---|---|---|
| 1  | 19k (< recursive cost) | 76k | 2.8  | 291 | 73 |
| 2  | 36k (< recursive cost) | 92k | 3.5  | 343 | 90 |
| 5  | 87k | 143k | 5.3 | 579 | 149 |
| 8  | 138k | 193k | 7.3  | 737 | 200 |
| 10 |  171k | 227k | 8.1  | 845  | 233 |

Then, we run the aggregator benchmarks on a Linux PC with an Intel Core i9-12900K CPU and 64GB of RAM (transfer only mode):
  
| $\textbf{Batch size}$  | $\vert\mathcal{F}_{\mathsf{user}}\vert$ | $\vert\mathcal{F}^{\mathsf{aug}}_{\mathsf{user}}\vert$  | $\mathsf{IVC}.\mathcal{P}$ (s) | $\textbf{RAM usage}$ (MB) | $\vert \mathsf{srs} \vert$ (MB)|
|---|---|---|---|---|---|
| 1  | 257k | 321k | 0.9  | 2533 | 313 |
| 2  | 520k | 585k | 1.5  | 4108 | 579 |
| 4  | 1045k | 1113k | 2.8 | 7841 | 1111 |
| 8  | 2096k | 2169k | 5.8  | 15215 | 2175 |
| 16 |  4198k | 4282k | 13.1  | 30520  | 4304 |

Our results show that both our aggregator and client provers are highly practical, able to run on commodity hardware. This illustrates that running a scalable payment L2 does not require a particular high-end hardware setup, both from the operator and user perspective. 

## Upcoming work

The current PlasmaFold implementation is a prototype. We expect that optimizing cryptographic routines and circuits will cut current proving performances, both in terms of RAM and proving-time. We are also looking forward to prototyping a privacy-preserving version for PlasmaFold. Since zk IVC proofs only consists into re-randomizing the IVC witness, we expect the zk overhead to be minimal for the client-side IVC prover. 

[^scaling]: [see](https://arxiv.org/abs/2107.10881)
