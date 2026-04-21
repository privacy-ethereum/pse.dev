---
authors: ["PSE Team"]
title: "zkEVM Community Edition Part 3: Logic and Structure"
image: "/articles/zkevm-community-edition-part-3-logic-and-structure/zkevm-community-edition-part-3-logic-and-structure-cover.webp"
tldr: "This series intends to provide an overview of the zkEVM Community Edition in a way that is broadly accessible. Part 3 reviews the general logic and structure of the zkEVM Community Edition."
date: "2023-05-23"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/shl8eMBiObd6_AUBikXZrjKD4fibI6xUZd7d9Yv5ezE"
tags:
  [
    "zkevm",
    "zero-knowledge proofs",
    "ethereum",
    "scaling",
    "circuits",
    "cryptography",
    "computational integrity",
    "halo2",
    "lookup tables",
    "proof systems",
  ]
projects: ["zkevm-community"]
---

_[Part 1: Introduction](/blog/zkevm-community-edition-part-1-introduction)_

_[Part 2: Components](/blog/zkevm-community-edition-part-2-components)_

The zkEVM Community Edition has the challenge of creating proofs to validate EVM execution as it is today. To make this feasible, a system of interconnected circuits has been designed to prove the correctness of EVM opcodes while dealing with the inefficiencies of converting EVM opcodes to ZK proofs.

There are many ways to design and build a zkEVM. This post explains one possible architecture. Other valid solutions exist and are being worked on throughout the ecosystem.

## An unfriendly virtual machine

Creating a 100% EVM compatible zkEVM means not having the luxury of changing anything about the current EVM. No modifications. No shortcuts. Unfortunately for zkEVM developers, many EVM operations such as random read-write data access and traditional hash functions like Keccak256 are not friendly to SNARKs. To make things even more difficult, building efficient circuits is still a highly manual process requiring a high level of both mathematical ability and programming skills.

A good proof of validity should minimize proving time (how long it takes to generate a ZK proof) and proof size (how much data the proof takes up) while still being able to satisfy the verifier and be secure. If both are too high, the zkEVM becomes too costly to be practical. Generating and storing proofs of validity would be prohibitively expensive and only those with powerful computers could participate.

EVM opcodes are unfriendly to SNARKs for two main reasons:

1.  256-bit operations vs prime field operations

    The EVM uses different sets of numbers and mathematical operations compared to SNARKs. SNARKs are cheap because they use addition and multiplication over a finite set of numbers called a prime field. In contrast, the EVM uses many arithmetic operations in 256-bit words. Emulating the EVM's 256-bit operations with the prime field operations used by SNARKs is expensive and requires clever circuit design to be practical.

2.  Variable paths vs fixed paths

    The other unfriendly aspect of the EVM is it uses a common CPU architecture where execution can take conditional or variable paths. The state of the EVM changes frequently within a single block, but in SNARKs, conditional execution is expensive. In general, the cost adds up with every variable path. If there are 100 paths that could be taken, all of them must be paid for even if only one is taken.

    To deal with variable paths, the zkEVM dynamically transfers data between circuits using [lookup tables](https://eprint.iacr.org/2020/315): arrays of data that match inputs to outputs. With lookup tables, an expensive (and recurrent) variable path can be outsourced to another circuit that has a repeating pattern. For example, if an operation has 100 steps that may take the expensive variable path, the circuit can limit the number of times the variable path is taken. Instead of paying the cost of the path 100 times, the cost is limited to a smaller number of times in the outsourcing circuit. The cost is still more than simply paying for the minimum necessary steps required, but it is less than the cost if lookup tables were not used at all. Variable paths are a big challenge in regards to programming circuits and lookup tables are a practical (but not completely efficient) solution.

Though creating an efficient system of circuits is a substantial technical challenge, overcoming this challenge will result in scalability benefits shared by the entire Ethereum ecosystem. Developers automatically get SNARK-enabled scalability without needing to write their own circuits.

## Aggregated proofs

The zkEVM is designed to create a proof of validity for each L1 block. Under the hood, a proof of validity is an aggregate proof made of smaller, interdependent proofs and circuits. The proof of validity is a proof of other proofs.

To create an aggregate proof system, the zkEVM uses a custom [fork of HALO2](https://github.com/privacy-scaling-explorations/halo2/), which is a zkSNARK system allowing for [recursive proof composition](https://www.michaelstraka.com/posts/recursivesnarks/), in which a single aggregate proof can be used to verify a practically unlimited number of other proofs.

In the current implementation, the system generates two proofs. The first proof is created from a comprehensive circuit that encompasses all subcomponents necessary to verify an Ethereum block. The second proof verifies the first proof and produces a smaller, more manageable proof that is suitable for on-chain storage and verification.

![https://privacy-scaling-explorations.github.io/zkevm-docs/design/recursion.html](/articles/zkevm-community-edition-part-3-logic-and-structure/34TA7Yi1E9BNf7gvImSy7.webp)

https://privacy-scaling-explorations.github.io/zkevm-docs/design/recursion.html

All the operations in a transaction are validated by circuits. Proofs are derived from circuits. An aggregation circuit could take the EVM and State proofs as inputs, then the aggregation proof – derived from the aggregation circuit – becomes our proof of validity: the single ZK proof that verifies all the transactions in a block.

The zkEVM Community Edition is rapidly evolving and designs may change, but the general logic of the system is to split the EVM into modular pieces with different circuits representing various sets of similar opcodes. Breakthroughs in cryptography may also change how the zkEVM is designed. For example, the recursive proof composition technique used in [HALO2](https://electriccoin.co/blog/explaining-halo-2/) was only [discovered in 2019](https://eprint.iacr.org/2019/1021.pdf).

## Modular circuits

The zkEVM architecture is designed so each circuit validates a set of operations and different circuits talk to each other. Each circuit has their own custom constraints and no one circuit does all the work. The architecture is modular. Different circuits have different roles, and some circuits can absorb the workload from other circuits through the use of [lookup tables](https://privacy-scaling-explorations.github.io/zkevm-docs/architecture.html#circuit-as-a-lookup-table).

Lookup tables allow specialized circuits to communicate with each other. For example, in the EVM Circuit, the SHA3 opcode requires computation of the Keccak hash function, but computing Keccak is a complicated circuit to implement. Instead of implementing the Keccak circuit inside the EVM circuit, we create a lookup table of Keccak inputs to outputs. A specialized Keccak circuit was built to ensure the input-to-output values in the lookup table are correctly computed. The EVM circuit can then safely consume the values in the lookup table because the values were validated by the Keccak circuit.

A circuit does two things, verify the operation or computation it was designed to verify and generate lookup tables that can be used by other circuits. The data generated by the lookup table is also verified by the circuit. For example, once the State Circuit is verified to satisfy its own relation, its columns are synthesized to be a lookup table for the EVM Circuit to do random access.

The EVM relies on random access memory to store and retrieve data during execution. Each step in the execution verifies an opcode, and these opcodes often involve reading or writing memory at arbitrary locations. To ensure correctness, it is crucial to prove that each step accesses the correct memory value.

The Community Edition adopts a dual table approach – an idea invented by the broader zkVM community – in order to handle random access memory.

1.  The Execution Trace contains all the instruction steps of a trace with their associated memory accesses, which can be reads or writes. These steps are sorted chronologically, the same way they happened originally in the execution of the program. Here we associate a timestamp on each memory access, which is proved to increase sequentially.
2.  Read/Write Trace keeps track of all the memory accesses (the same ones that appear in the execution trace), but they are sorted by memory location first, and timestamp second. This spatial sorting verifies that each successive memory access at the same location contains the correct value.
3.  Finally a permutation check is performed on the memory accesses from both sides to guarantee that the same entries appear on both sides. All this guarantees that every time a memory location is read in the execution trace, it will contain the same value that was previously written at that location, no matter how many steps ago that happened.

![](/articles/zkevm-community-edition-part-3-logic-and-structure/JaNR4LpLmaFxdzyfJ8Ea7.webp)

The zkEVM Community Edition is a rapidly evolving design. Each circuit iterates over and validates different parts of the computation required to process an Ethereum block, and they are all coordinated from the EVM Circuit which processes the steps (opcodes) of each transaction.

![](/articles/zkevm-community-edition-part-3-logic-and-structure/WHGAPSvjJMhCp45mrzwwa.webp)

The [EVM Circuit](https://github.com/privacy-scaling-explorations/zkevm-specs/blob/83ad4ed571e3ada7c18a411075574110dfc5ae5a/specs/evm-proof.md) is only concerned with execution. Specifically, the EVM Circuit validates [geth execution traces](https://geth.ethereum.org/docs/dapp/tracing) and verifies the transactions in the block have the correct execution results. This is usually done one opcode at a time to check each individual step in the transaction and to confirm the correct opcode was called at the correct time. The EVM Circuit is the final check to confirm the transaction and the State Circuit are valid.

[State Circuit](https://privacy-scaling-explorations.github.io/zkevm-docs/architecture/state-circuit.html):

- Verifies that each piece of data is consistent between different reads and writes (i.e. the data was changed correctly). It also serves as the lookup table for the EVM circuit to do random read-write access (i.e. access EVM data).

[Tx Circuit](https://privacy-scaling-explorations.github.io/zkevm-docs/architecture/tx-circuit.html#tx-circuit):

- Verifies each transaction has a valid signature. It also serves as a lookup table for the EVM circuit to access data in the transaction.

[Bytecode Circuit](https://privacy-scaling-explorations.github.io/zkevm-docs/architecture/bytecode-circuit.html#bytecode-circuit):

- Verifies each bytecode has a valid hash. It also serves as a lookup table for the EVM circuit to access data of any "index of bytecode."

[ECDSA Cicruit](https://privacy-scaling-explorations.github.io/zkevm-docs/architecture/ecdsa-circuit.html#ecdsa-cicruit):

- Verifies the public key from the signature is valid. It also serves as a lookup table for EVM and Tx circuit to do public key recovery.

[Keccak Circuit](https://privacy-scaling-explorations.github.io/zkevm-docs/architecture/keccak-circuit.html#keccak-circuit):

- Verifies each hash is valid. It also serves as a lookup table for the EVM, Bytecode, Tx, and MPT circuit to calculate hash functions.

[Merkle Patricia Trie (MPT) Circuit](https://privacy-scaling-explorations.github.io/zkevm-docs/architecture/mpt-circuit.html#merkle-patricia-trie-circuit):

- Verifies each update is valid. It also serves as a lookup table for the State and Tx circuit to update the Merkle Patricia Trie.

**Copy Circuit:**

- Verifies copies of chunks of bytes. For example, from Memory to Bytecode when deploying a contract, or from Tx to Memory when reading a tx calldata. Used by the EVM Circuit as a lookup table to verify byte array copies

**Block Circuit:**

- Verifies the block Hash. Used by the EVM Circuit to lookup block fields.

**Public Input Circuit:**

- Serves as the interface between the public information that the verifier sees and the circuits.

**RLP Circuit**

- Verifies the RLP serialization into bytes of Ethereum objects like transactions and blocks.

Writing optimal circuits means creating a system of polynomial equations with the minimum number of sufficient constraints. Though crucial infrastructure and tooling for writing circuits have been developed in recent years, circuit programming languages are still relatively unknown and low-level. Until [simpler languages](https://zkresear.ch/t/lookup-singularity/65) or more automated systems are developed, writing circuits optimally will remain a challenging problem to solve, even for experienced developers. The ability to audit circuits is also a valuable skill in this field.

![](/articles/zkevm-community-edition-part-3-logic-and-structure/olZ-qNCw3tmZH5otPdKF_.webp)

However, the zkEVM community aims to be inclusive and supportive of individuals who are interested in learning and contributing. If you have a background in Rust or experience with other zkSNARK tooling like circom, you already have a good foundation for understanding the concepts behind the zkEVM. With a dedicated learning phase of 1-2 months, you should be well-equipped to make valuable contributions.

A consensus level zkEVM that proves the validity of Layer 1 must be a community effort. Not enough skills or resources currently exist for one team to do it alone – and reasonably well. There are many approaches to explore and many gaps in a single team's capabilities.

Contributing to zkEVMs means entering a world where the tools are limited, the language is nascent, and the skills required are rare, but overcoming the challenge may create the widest practical application of zero-knowledge cryptography to date. If proofs of validity are used to verify every Ethereum block, then every Ethereum user will benefit from zero-knowledge proofs – a benefit that seems worth the effort.

---

For those who have found the design of the zkEVM Community Edition interesting or want to contribute to this project and would like to dive deeper, the following video provides a detailed explanation for how the code is structured:

<iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" frameborder="0" loading="lazy" src="https://www.youtube-nocookie.com/embed/01U8O2I3quI"></iframe>

The zkEVM Community Edition is possible thanks to the contribution of many teams including the [PSE](https://appliedzkp.org/), [Scroll Tech](https://scroll.io/), and [Taiko](https://taiko.xyz/) along with many individual contributors. Teams such as [Zcash](https://electriccoin.co/) have also researched and developed proving systems and libraries that have greatly benefited zkEVM efforts.

The zkEVM Community Edition is an open-source project and can be accessed in the [main repo](https://github.com/privacy-scaling-explorations/zkevm-specs). If you're interested in helping, you can learn more by visiting the [contribution guidelines](https://github.com/privacy-scaling-explorations/zkevm-circuits/blob/main/CONTRIBUTING.md). The Community Edition is being built in public and its current status can be viewed on the [project board](https://github.com/orgs/privacy-scaling-explorations/projects/3/views/1).

For any general questions, feel free to ask in the [PSE Discord.](https://discord.com/invite/sF5CT5rzrR)

---

_This series intends to provide an overview of the zkEVM Community Edition in a way that is broadly accessible. Part 3 reviews the general logic and structure of the zkEVM Community Edition._

_[Part 1: Introduction](https://mirror.xyz/privacy-scaling-explorations.eth/I5BzurX-T6slFaPbA4i3hVrO7U2VkBR45eO-N3CSnSg)_

_[Part 2: Components](https://mirror.xyz/privacy-scaling-explorations.eth/AW854RXMqS3SU8WCA7Yz-LVnTXCOjpwhmwUq30UNi1Q)_
