---
authors: ["PSE Team"]
title: "zkEVM Community Edition Part 1: Introduction"
image: "/articles/zkevm-community-edition-part-1-introduction/zkevm-community-edition-part-1-introduction-cover-1.webp"
tldr: ""
date: "2023-05-23"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/I5BzurX-T6slFaPbA4i3hVrO7U2VkBR45eO-N3CSnSg"
tags:
  [
    "zkevm",
    "zero-knowledge proofs",
    "ethereum",
    "scaling",
    "l2",
    "rollup",
    "infrastructure/protocol",
    "proof systems",
    "virtual machine",
    "computational integrity",
  ]
projects: ["zkevm-community"]
---

The task of making Ethereum faster, cheaper, and easier to verify is a globally distributed effort with many moving parts. Developing zkEVMs is one piece of the effort with the majority of zkEVM projects being built as Layer 2 scaling solutions. A zkEVM capable of validating L1 blocks is on a long – and often changing – roadmap for scaling Ethereum that has been referenced as part of [“The Splurge”](https://twitter.com/VitalikButerin/status/1466411377107558402), [“ZK-SNARKing everything” on the rollup centric roadmap,](https://www.reddit.com/r/ethereum/comments/j3px5s/a_rollupcentric_ethereum_roadmap_vitalik/) [“enshrined rollups”](https://www.reddit.com/r/ethereum/comments/vrx9xe/comment/if7auu7/), and most recently [“The Verge”](https://twitter.com/VitalikButerin/status/1588669782471368704).

The [zkEVM Community Edition](https://github.com/privacy-scaling-explorations/zkevm-specs) is working toward the end goal of leveraging zero-knowledge proofs to verify every L1 block: a concept known as proof of validity.

There are many ways to design and build a zkEVM. The Community Edition is a collective exploration into one possible set of solutions, but [many other solutions](https://vitalik.ca/general/2022/08/04/zkevm.html) are being worked on.

_This series intends to provide an overview of the zkEVM Community Edition in a way that is broadly accessible. Part 1 is an introduction to zkEVMs._

_[Part 2: Components](https://mirror.xyz/privacy-scaling-explorations.eth/AW854RXMqS3SU8WCA7Yz-LVnTXCOjpwhmwUq30UNi1Q)_

_[Part 3: Logic and Structure](https://mirror.xyz/privacy-scaling-explorations.eth/shl8eMBiObd6_AUBikXZrjKD4fibI6xUZd7d9Yv5ezE)_

## World computer

A virtual machine is a simulated computer running as software on a physical computer. In the early days, Ethereum was described as a “[world computer](https://www.youtube.com/watch?v=j23HnORQXvs)” to convey the concept of a shared virtual machine run on a distributed network. Ethereum's innovation was a virtual machine on top of a blockchain. The virtual machine created an environment for software execution, storage, and state. The blockchain allowed each node or physical computer to reach consensus or agreement on the state of the "world computer." The result was a common, persistent software environment across a distributed network called the [Ethereum Virtual Machine (EVM)](https://ethereum.org/en/developers/docs/evm/).

To guarantee the same results are achieved across the network, full nodes must receive and re-execute every transaction since the first Ethereum block, which requires substantial computing resources.

The zkEVM takes the EVM and adds [zero-knowledge (ZK) proofs](https://ethereum.org/en/zero-knowledge-proofs/#zk-snarks). ZK proofs can mathematically guarantee [Layer 1 (L1)](https://ethereum.org/en/layer-2/#what-is-layer-1) Ethereum transactions were run correctly. On the standard EVM, nodes run on general-purpose computers, which makes running a node accessible to everyone and allowing the network to have hundreds of thousands of participants. However, proof generation is expensive and resource-intensive. Instead of running this process on all nodes, it must be outsourced to a single specialized node: a powerful computer with specific features that make it suitable for proof generation, such as GPU acceleration or FPGA acceleration. The rest of the nodes – using general purpose computers – need only verify one proof per block.

## Levels of zkEVMs

The EVM has been described as a ["beast of complexity"](https://youtu.be/W2f_GLEtobo?t=448). Many approaches exist for applying ZK proofs to the EVM – all with their own tradeoffs. As a result, building zkEVMs is an ecosystem-wide, multi-polar research and engineering effort with a variety of teams collaborating and competing to scale Ethereum at different levels.

A key difference between these approaches is the level of compatibility with the EVM. Different levels of compatibility come with different tradeoffs, from complexity, decentralization and speed of implementation to the familiarity of the user experience and how much of the existing code, infrastructure and tooling can be retained. The range of zkEVMs can be separated into language-level, bytecode level, and consensus-level compatibility.

- Language-level compatibility will require developers to use new code and infrastructure, but is also the fastest zkEVM to become production ready.
- Bytecode compatibility requires minimal code and tooling modifications from developers.
- Consensus-level compatibility happens on L1 and is the hardest to achieve, but has the benefit of scaling everything built on Ethereum by default.

So far, the majority of zkEVM projects have focused on building bytecode and language compatible ZK rollups on L2.

Vitalik Buterin categorized zkEVMs into different "types", each with different pros and cons. "Type 1" zkEVMs aim to deliver an experience closest to Ethereum as it is today but face challenges regarding proving time and centralization risk, while "Type 4" have the lowest cost and centralization risks but are less compatible with existing infrastructure.

![https://vitalik.ca/general/2022/08/04/zkevm.html](/articles/zkevm-community-edition-part-1-introduction/03QchdJlYoLxWmEbflSoo.webp)

https://vitalik.ca/general/2022/08/04/zkevm.html

## Consensus-level compatibility

The [zkEVM Community Edition](https://github.com/privacy-scaling-explorations/zkevm-circuits) is a collaborative effort focused on creating a zkEVM capable of verifying Ethereum's current execution layer. The goal is to be ["fully and uncompromisingly Ethereum-equivalent."](https://vitalik.ca/general/2022/08/04/zkevm.html) The project is being stewarded by [Privacy Stewards of Ethereum (PSE)](https://appliedzkp.org/), a team within the [Ethereum Foundation](https://ethereum.foundation/) specializing in applied zero-knowledge cryptography.

The work toward completing the zkEVM Community Edition will result in two scalability solutions:

1.  A 100% EVM-compatible zero-knowledge rollup on L2
2.  A proof of validity for every L1 block

An EVM-compatible ZK rollup will be achieved first as a byproduct of the more difficult and long-term challenge of creating a proof of validity for every L1 block. If a proof of validity is achieved, it would be possible to embed the solution inside of an L1 smart contract and use the smart contract to validate the L1 itself.

The PSE team does not exist in a vacuum and welcomes contributions from anyone working towards Ethereum scalability and ZK research. Some zkEVM projects and individuals have already made valuable research and development contributions as well as incorporated Community Edition code into their own ZK rollup solutions.

The more collaboration and communication there is between different zkEVM projects with their own long-term and short-term objectives and strategies, the more the Ethereum community will benefit.

---

The zkEVM Community Edition is possible thanks to the contribution of many teams including the [PSE](https://appliedzkp.org/), [Scroll Tech](https://scroll.io/), and [Taiko](https://taiko.xyz/) along with many individual contributors. Teams such as [Zcash](https://electriccoin.co/) have also researched and developed proving systems and libraries that have greatly benefited zkEVM efforts.

The zkEVM Community Edition is an open-source project and can be accessed in the [main repo](https://github.com/privacy-scaling-explorations/zkevm-specs). If you're interested in helping, you can learn more by visiting the [contribution guidelines](https://github.com/privacy-scaling-explorations/zkevm-circuits/blob/main/CONTRIBUTING.md). The Community Edition is being built in public and its current status can be viewed on the [project board](https://github.com/orgs/privacy-scaling-explorations/projects/3/views/1).

For any general questions, feel free to ask in the [PSE Discord](https://discord.com/invite/sF5CT5rzrR).

---

_This series intends to provide an overview of the zkEVM Community Edition in a way that is broadly accessible. Part 1 is an introduction to zkEVMs._

_[Part 2: Components](https://mirror.xyz/privacy-scaling-explorations.eth/AW854RXMqS3SU8WCA7Yz-LVnTXCOjpwhmwUq30UNi1Q)_

_[Part 3: Logic and Structure](https://mirror.xyz/privacy-scaling-explorations.eth/shl8eMBiObd6_AUBikXZrjKD4fibI6xUZd7d9Yv5ezE)_
