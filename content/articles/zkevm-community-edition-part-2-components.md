---
authors: ["PSE Team"]
title: "zkEVM Community Edition Part 2: Components"
image: "/articles/zkevm-community-edition-part-2-components/zkevm-community-edition-part-2-components-cover.webp"
tldr: "This series of articles intends to provide an overview of the zkEVM Community Edition in a way that is broadly accessible. Part 2 is a summary of the common components used in most zkEVMs."
date: "2023-05-23"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/AW854RXMqS3SU8WCA7Yz-LVnTXCOjpwhmwUq30UNi1Q"
tags:
  [
    "zkevm",
    "zero-knowledge proofs",
    "ethereum",
    "scaling",
    "snarks",
    "circuits",
    "computational integrity",
    "cryptography",
    "proof systems",
    "education",
  ]
projects: ["zkevm-community"]
---

_[Part 1: Introduction](/blog/zkevm-community-edition-part-1-introduction)_

_[Part 3: Logic and Structure](/blog/zkevm-community-edition-part-3-logic-and-structure)_

Before diving deeper into how the zkEVM Community Edition works, it is necessary to understand some basic concepts that are common among zkEVM projects. The following section is not technically complete and is written as a simplified introduction to zkSNARKs, opcodes, and arithmetic circuits.

At a high level, the EVM state transitions from one block to the next via instructions called opcodes. To prove the EVM transitioned correctly, a ZK proof must be generated for each block and constructing this ZK proof means representing each opcode or change in the EVM as a circuit. Building a zkEVM requires finding optimal ways to efficiently translate opcodes into circuit form. Let's break down what this all means.

## Zero-knowledge proofs

> "\[Zero knowledge proofs\] deliver _scalability_ by exponentially compressing the amount of computation needed to verify the integrity of a large batch of transactions."            [\- Eli Ben-Sasson](https://nakamoto.com/cambrian-explosion-of-crypto-proofs/)

A ZK proof involves two parties: the prover and the verifier. In a zkEVM, the prover generates the proof of validity. The verifier checks if the proof was done correctly.

An L1 proof of validity confirms every transaction on Mainnet Ethereum. For a [ZK-rollup](https://ethereum.org/en/developers/docs/scaling/zk-rollups/), the proof of validity confirms every L2 transaction on the rollup and is verified as a single L1 transaction.

Zero-knowledge proofs offer the same level of security as re-executing transactions to verify their correctness. However, they require less computation and resources during the verification process. This means that more people can participate in maintaining the network by running nodes and contributing to consensus.

Nodes using specialized hardware will be required to generate proofs of validity, but once the proof is posted on-chain, nearly any node will be able to verify the proof with a low-resource cryptographic operation.

A zkEVM makes it theoretically possible to run an Ethereum [node on your phone](https://youtu.be/hBupNf1igbY?t=590).

## SNARKs

The zkEVM uses [zkSNARKs](https://blog.ethereum.org/2016/12/05/zksnarks-in-a-nutshell): a type of ZK protocol that is general purpose and capable of turning nearly any computation into a ZK proof. Before zkSNARKs, building ZK proofs was a highly specialized math problem that required a skilled cryptographer to create a unique ZK protocol for every new function. The discovery of zkSNARKs turned the creation of ZK protocols from a specialized math problem to a [generalized programming task](https://archive.devcon.org/archive/watch/6/zkps-and-programmable-cryptography/?tab=YouTube).

[zkSNARKs stand for Zero-Knowledge Succinct Non-interactive ARguments of Knowledge](https://z.cash/technology/zksnarks/). Zero-knowledge refers to the protocol's capacity to prove a statement is true "without revealing any information beyond the validity of the statement itself." Though the ZK part tends to get the most attention, it is in fact optional and unnecessary for zkEVMs. The most relevant property is succinctness.

![https://www.youtube.com/watch?v=h-94UhJLeck](/articles/zkevm-community-edition-part-2-components/Sd2dQ6Q8Y2nPIgO0cqr9j.webp)

https://www.youtube.com/watch?v=h-94UhJLeck

Succinct proofs are short and fast to verify. It must take less time to verify a SNARK than to recompute the statements the SNARK is proving. Quickly verifying transactions via short proofs is how zkEVMs achieve scalability.

In a non-interactive proof, a single proof is submitted, and the verifier can either reject or accept the proof as valid. There is no need to go back and forth between the prover and verifier. The proof of validity is created once and stored on-chain where it can be verified by anyone at any time.

## Opcodes

Every time a user makes a transaction on Ethereum, they set off a chain of instructions to change the state of the [Ethereum Virtual Machine (EVM).](https://ethereum.org/en/developers/docs/evm/) These instructions are [opcodes](https://ethereum.org/en/developers/docs/evm/opcodes/). Opcodes are the language of the EVM and each opcode has a distinct function specified in the Ethereum [yellow paper](https://ethereum.org/en/developers/tutorials/yellow-paper-evm/). Opcodes can read values from the EVM, write values to the EVM, and compute values in the EVM. Popular programming languages such as [Solidity](https://soliditylang.org/) must be translated or compiled to opcodes that the EVM can understand and run.

Opcodes change the state of the EVM, whether that is the balance of ETH in an address or data stored in a smart contract. All the changes are distributed or updated to every node in the network. Each node takes the same inputs or transactions and should arrive at the same outputs or state transition as every other node in the network – a secure and decentralized, but slow and expensive way to reach consensus.

The zkEVM is attempting to prove the EVM transitioned from its current state to its new state correctly. To prove the entire state transitioned correctly, the zkEVM must prove each opcode was executed correctly. To create a proof, circuits must be built.

## Circuits

SNARKs are created using [arithmetic circuits](https://en.wikipedia.org/wiki/Arithmetic_circuit_complexity), a process also known as [arithmetization](https://medium.com/starkware/arithmetization-i-15c046390862). Circuits are a necessary intermediate step between EVM opcodes and the ZK proofs that validate them.

A circuit defines the relation between public (revealed) and private (hidden) inputs. A circuit is designed so that only a specific set of inputs can satisfy it. If a prover can satisfy the circuit, then it is enough to convince the verifier that they know the private inputs without having to reveal them. This is the zero-knowledge part of zkSNARKs. The inputs do not need to be made public to prove they are known.

![https://archive.devcon.org/archive/watch/6/eli5-zero-knowledge/?tab=YouTube](/articles/zkevm-community-edition-part-2-components/rvCrquqQ87uVWOD6dvtg_.webp)

https://archive.devcon.org/archive/watch/6/eli5-zero-knowledge/?tab=YouTube

To create a SNARK, you must first convert a function to circuit form. Writing a circuit breaks down the function into its simplest arithmetic logic of addition and multiplication. Because addition can express linear computations and multiplication can express exponential computations, these two simple operations become highly expressive when stacked together and applied to polynomials.

![Polynomials are math expressions with "many terms." ](/articles/zkevm-community-edition-part-2-components/gizYcrA2NKJ4Ow11FlxqJ.webp)

Polynomials are math expressions with "many terms."

In the context of this article, it is only necessary to know that polynomials have two useful properties: they are easy to work with and can efficiently encode a lot of information without needing to reveal all the information it represents. In other words, polynomials can be succinct: they can represent a complex computation yet remain short and fast to verify. For a complete explanation of how zkSNARKs work and why polynomials are used, [this paper](https://arxiv.org/pdf/1906.07221.pdf) is a good resource. For a practical explanation of how polynomial commitments schemes are applied in Ethereum scaling solutions, check out [this blog post](https://scroll.io/blog/kzg).

With the basic mathematical building blocks of polynomials, addition, and multiplication, circuits can turn nearly any statement into a ZK proof. In circuit form, statements become testable: verifiable and provable.

![Visualization of a simple arithmetic circuit https://node101.io/blog/a_non_mathematical_introduction_to_zero_knowledge_proofs](/articles/zkevm-community-edition-part-2-components/G1B3_UHeZ8CLMErT4K3pr.webp)

Visualization of a simple arithmetic circuit https://node101.io/blog/a\_non\_mathematical\_introduction\_to\_zero\_knowledge\_proofs

In a circuit, gates represent arithmetic operations (addition or multiplication). Gates are connected by wires and every wire has a value. In the image above:

- Left hand circuit represents the equation: _a + b = c_
- Right hand circuit represents the equation: _a x b = c_

The input wires are _a_ and _b_; and can be made public or kept private. The output wire is _c_. The circuit itself and output _c_ is public and known to both the prover and verifier.

![Example of a slightly more complex circuit https://nmohnblatt.github.io/zk-jargon-decoder/definitions/circuit.html](/articles/zkevm-community-edition-part-2-components/R9tDApVpc4eEEVAVoiFYo.webp)

Example of a slightly more complex circuit https://nmohnblatt.github.io/zk-jargon-decoder/definitions/circuit.html

In the image above, the circuit expects:

- Inputs are *x*₀, *x*₁, and *x*₂
- Output is *y = 5x*₀ *\+ 3(x*₁ *\+ x*₂)

For a prover to demonstrate they know the private inputs without revealing them to the verifier, they must be able to complete the circuit and reach the same output known to both parties. Circuits are designed so that only the correct inputs can go through all the gates and arrive at the same publicly known output. Each step is iterative and must be done in a predetermined order to satisfy the circuit logic. In a sufficiently designed circuit, there should be no feasible way a prover can make it through the circuit without knowing the correct inputs.

In the zkEVM Community Edition, circuits must prove that each transaction, all the opcodes used in the transaction, and the sequence of the operations are correct. As building circuits is a new and rapidly evolving field, there is still no "right way" to define the computation the circuit is trying to verify. To be practical, circuits must also be written efficiently in a way that minimizes the number of steps required while still being capable of satisfying the verifier. The difficulty of building a zkEVM is compounded by the fact that the skills required to build the necessary components are rare.

The Community Edition is an attempt to overcome both the technical and organizational challenges of building a consensus-level compatible zkEVM. The goal is to create a public good that serves as a common point of collaboration for the zkEVM community.

---

The zkEVM Community Edition is possible thanks to the contribution of many teams including the [PSE](https://appliedzkp.org/), [Scroll Tech](https://scroll.io/), and [Taiko](https://taiko.xyz/) along with many individual contributors. Teams such as [Zcash](https://electriccoin.co/) have also researched and developed proving systems and libraries that have greatly benefited zkEVM efforts.

The zkEVM Community Edition is an open-source project and can be accessed in the [main repo](https://github.com/privacy-scaling-explorations/zkevm-specs). If you're interested in helping, you can learn more by visiting the [contribution guidelines](https://github.com/privacy-scaling-explorations/zkevm-circuits/blob/main/CONTRIBUTING.md). The Community Edition is being built in public and its current status can be viewed on the [project board](https://github.com/orgs/privacy-scaling-explorations/projects/3/views/1).

For any general questions, feel free to ask in the [PSE Discord.](https://discord.com/invite/sF5CT5rzrR)

---

_This series of articles intends to provide an overview of the zkEVM Community Edition in a way that is broadly accessible. Part 2 is a summary of the common components used in most zkEVMs._

_[Part 1: Introduction](https://mirror.xyz/privacy-scaling-explorations.eth/I5BzurX-T6slFaPbA4i3hVrO7U2VkBR45eO-N3CSnSg)_

_[Part 3: Logic and Structure](https://mirror.xyz/privacy-scaling-explorations.eth/shl8eMBiObd6_AUBikXZrjKD4fibI6xUZd7d9Yv5ezE)_
