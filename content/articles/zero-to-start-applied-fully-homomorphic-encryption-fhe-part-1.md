---
authors: ["0xZoey"]
title: "Zero to Start: Applied Fully Homomorphic Encryption (FHE) Part 1"
image: "/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1-cover.webp"
tldr: "This post was written by [0xZoey](https://twitter.com/0xZoey). Special thanks to [Janmajaya](https://twitter.com/Janmajaya_mall), [Enrico](https://twitter.com/backaes?lang=en), and [Owen](https://twitter.com/omurovec) who generously gave their time and expertise to review this piece. Your valuable contributions and feedback have greatly enhanced the quality and depth of this work. /n/n Find [Part 2: Fundamental Concepts, FHE Development, Applied FHE, Challenges and Open Problems](https://mirror.xyz/privacy-scaling-explorations.eth/wQZqa9acMdGS7LTXmKX-fR05VHfkgFf9Wrjso7XxDzs) here…"
date: "2023-12-21"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/D8UHFW1t48x2liWb5wuP6LDdCRbgUH_8vOFvA0tNDJA"
tags:
  [
    "fhe",
    "cryptography",
    "privacy",
    "security",
    "ethereum",
    "education",
    "post-quantum cryptography",
    "zero-knowledge proofs",
  ]
projects: ["mpc-framework", "pse-security"]
---

## **What is FHE?**

Present privacy technology ensures secure communication and storage, encrypting our emails during transit and safeguarding databases in storage. However, accessing data for **processing** requires the data to be first decrypted. What if secure processing could occur without compromising data privacy?

![FHE allows computation over encrypted data](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1/PK_2cdH2q63Dovvnlh777.webp)

FHE allows computation over encrypted data

**Fully Homomorphic Encryption (FHE) is a technology that allows computation over encrypted data, where only the owner of the key can decrypt the result of the computation.**

This article focuses on the current state of FHE, fundamental concepts, applied FHE, and design challenges ahead. It is meant to help users understand the thought framework around applied FHE without requiring the reader to understand complex math or cryptography.

The idea for FHE was initially proposed in 1978 by Rivest, Adleman, and Dertouzous (the "R" and "A" of [RSA](<https://en.wikipedia.org/wiki/RSA_(cryptosystem)>)). FHE is an extension of public key cryptography; the encryption is "homomorphic" because it works on the principle that for every function performed on unencrypted text (Plaintext), there is an equivalent function for encrypted text (Ciphertext).

![Homomorphic Encryption](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1/PoAkyRxFZ5v2OieE-iRPS.webp)

Homomorphic Encryption

FHE shares fundamental components with traditional cryptography like encryption, decryption, and key generation. In addition to this, it uniquely enables arithmetic operations such as addition and multiplication on ciphertexts.

There are generally four categories of homomorphic encryption:

1.  **Partially homomorphic**: enables only one type of operation (addition or multiplication). RSA is an example of partially homomorphic encryption only using multiplication and not addition.
2.  **Somewhat homomorphic**: limited for one operation but unlimited for the other. For example, limited multiplications but unlimited additions.
3.  **Leveled homomorphic**: limited operations for both addition and multiplication
4.  **Fully homomorphic**: unlimited operations for both addition and multiplication (and others).

![](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1/QkcoPW4EGRdD9wBEpqHb4.webp)

In the past, the difficulty in achieving FHE was due to the "noise" that accumulated with every subsequent operation. The excess overflow in noise eventually makes decryption impossible. Craig Gentry proposed the first FHE scheme in 2009, where he solved this problem with a method called bootstrapping. Bootstrapping is used to recursively evaluate the decryption circuit to reduce and manage noise accumulation.

## **Why is FHE important?**

Fully Homomorphic Encryption (FHE) signifies a groundbreaking shift in privacy, enabling data-centric systems to preserve privacy with minimal data exposure inherently. FHE, built using lattice-based cryptography, also offers the notable advantage of being post-quantum resistant, ensuring robust security against future potential threats from quantum computing.

Some [general](https://homomorphicencryption.org/wp-content/uploads/2018/10/CCS-HE-Tutorial-Slides.pdf?ref=blog.sunscreen.tech) FHE use cases include:

- Private inference & training: FHE could be used to protect the privacy of both the model and data (likely 3-5 years away).
- Encrypted searches: query an encrypted file and only see the result of your specific query without the entire contents of the database revealed, also known as Private Information Retrieval (PIR).
- Policy Compliance & Identity Management: Secure identity management by enabling the processing of identity-related data without exposure, allowing organizations to comply with regulators' KYC policies.

![General FHE Use Cases](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1/qZBR43OiJJQubIwL1iIc2.webp)

General FHE Use Cases

Fully Homomorphic Encryption (FHE) holds immense significance in blockchain technology because it can perform encrypted data computations within a trustless environment. We won't dive into the importance of privacy on the blockchain and how off-chain ZKPs are not the complete solution, but Wei Dai's article [Navigating Privacy on Public Blockchains](https://wdai.us/posts/navigating-privacy/) is a great primer.

Here are some theoretical blockchain use cases that FHE could facilitate:

- [Private Transactions](https://eprint.iacr.org/2022/1119.pdf): the processing of confidential transactions by smart contracts, allowing private transactions in dark pools, AMMs, blind auctions, and voting.
- [MEV](https://collective.flashbots.net/t/frp-10-distributed-blockbuilding-networks-via-secure-knapsack-auctions/1955) (Maximal Extractable Value) Mitigation: FHE could potentially allow proposing blocks and ordering transactions while ensuring Pre-execution, failed execution, and post-execution privacy, offering a potential solution to prevent front-running.
- Scaling: [Leveraging](https://www.fhenix.io/fhe-rollups-scaling-confidential-smart-contracts-on-ethereum-and-beyond-whitepaper/) [FHE Rollups](https://www.fhenix.io/wp-content/uploads/2023/11/FHE_Rollups_Whitepaper.pdf) presents a scalable approach to execute private smart contracts utilizing the security derived from Ethereum for state transitions
- [Private Blockchains](https://eprint.iacr.org/2022/1119.pdf): encrypted chain states that are programmatically decrypted via consensus using Threshold FHE.

![FHE: Blockchain Use Cases](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1/duTnCuiIvMfqdk3ZERSe2.webp)

FHE: Blockchain Use Cases

The applied use cases for FHE are far-reaching, there are non-trivial technical challenges to overcome, and many are still being explored today. At its core, FHE ensures secure **data processing**, which, combined with other cryptographic primitives, can be incredibly powerful. In our exploration of Applied FHE, we dive deeper into real-world applications and use cases.

## **ZKP, MPC, & FHE**

The terms ZKPs, MPC, and FHE have often been misused and interchanged and have been the source of much confusion. The post, [Beyond Zero-Knowledge: What's Next in Programmable Cryptography?](https://mirror.xyz/privacy-scaling-explorations.eth/xXcRj5QfvA_qhkiZCVg46Gn9uX8P_Ld-DXlqY51roPY) provides a succinct overview and comparisons of Zero-Knowledge Proofs (ZKPs), Multi-Party Computation (MPC), Fully Homomorphic Encryption (FHE) and Indistinguishability Obfuscation (iO). All fall under the broader umbrella of programmable cryptography.

To briefly summarize how the three concepts are connected:

**[Multi-Party Computation (MPC)](https://www.youtube.com/watch?v=aDL_KScy6hA&t=571s)**: MPC, when described as a **_general function_**, is any setup where mutually distrustful parties can individually provide inputs (private to others) to collaboratively compute a public outcome. MPC can be used as the term used to describe the **_technology_** itself, where randomized data shares from each individual are delegated for compute across servers.

![MPC](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1/poh6Brvlh1qyBiYpgPxyP.webp)

MPC

To add to the confusion, it is also often used to describe MPC **_use cases_**, most notably in the context of [Distributed Key Generation](https://en.wikipedia.org/wiki/Distributed_key_generation) (DKG) and [Threshold Signature Schemes](https://link.springer.com/referenceworkentry/10.1007/0-387-23483-7_429#:~:text=Threshold%20signatures%20are%20digital%20signatures,structure%20of%20a%20threshold%20scheme.) (TSS).

Three leading technologies form the [building blocks](https://open.spotify.com/episode/4zfrPFbPWZvn6fXwrrEa5f?si=9ab56d47510f4da0) of MPC **_applications_**: [Garbled Circuits (GC)](https://www.youtube.com/watch?v=La6LkUZ4P_s), Linear Secret Sharing Schemes (LSSS), and Fully Homomorphic Encryption (FHE). These can be used both conjunctively or exclusively.

![MPC & ZKPs](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1/XiqL4MvjssDILJ59mDR5_.webp)

MPC & ZKPs

**Zero-Knowledge Proofs (ZKPs):** A method that allows a single party (prover) to prove to another party (verifier) knowledge about a piece of data without revealing the data itself. Using both public and private inputs, ZKPs enable the prover to present a true or false output to the verifier.

![ZKPs](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1/8YgbCNa_VDgqwUo3y5qaG.webp)

ZKPs

In Web 3 applications, the integration of ZKPs alongside FHE becomes crucial for constructing private and secure systems. ZKPs are vital because they can be used to generate proofs of correctly constructed FHE ciphertexts. Otherwise, users can encrypt any unverified gibberish. Hence corrupting the entire FHE circuit evaluation.

Note the difference in ZKPs, FHE, and MPCs, where the input element of each primitive is distinct when evaluating the exposure of private data.

- In ZKPs, private data contained in the input is only _visible to the prover_
- In MPC, private data contained in each input is only _visible to the owner_
- In FHE, private data contained in the input is encrypted and is **_never revealed_**

While MPC is network bound, FHE and ZKPs are compute bound. The three primitives also differ regarding relative computation costs and interactiveness required between parties.

![ZKPs, MPC, FHE, computation costs and interactiveness](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1/fkjwJBfIJ2VkIGLKsqK1D.webp)

ZKPs, MPC, FHE, computation costs and interactiveness

In summary,

- ZKPs focus on proving the truth of a statement without revealing the underlying data; it is useful for preserving private states for the prover.
- MPC enables joint computation; it is useful when users want to keep their state private from others.
- FHE allows computations on encrypted data without decryption; it is non-interactive and useful for preserving privacy throughout the entire computation process.

FHE is an extension of public key cryptography, not a replacement for ZKPs or MPC. Each can act as an individual building block and serve a distinct cryptographic purpose. An assessment needs to be made on where and which primitive should be applied within different applications.

## **The State of FHE Today**

Early concepts of FHE developed in the 1970s-90s laid the theoretical groundwork for homomorphic encryption. However, the real breakthrough came with Gentry's solution for FHE in 2009. The initial construction needed to be faster to be practically applied. Performance at the time was close to 30mins per bit operation and only applicable in a single key setting. Much of the research published following Gentry's paper has been focused on performance improvements that address these issues through:

- [refining schemes](https://eprint.iacr.org/2021/315.pdf)
- [reducing computation complexity](https://eprint.iacr.org/2023/1788)
- [faster bootstrapping](https://eprint.iacr.org/2023/759), and
- [hardware acceleration](https://eprint.iacr.org/2023/618)

FHE is not possible with Ethereum today due to the size of ciphertexts and the cost of computation on-chain. It is estimated with the current rate of hardware acceleration, we may see applications in production by 2025.

Zama's implementation of [fhEVM](https://docs.zama.ai/fhevm/) is a fork of Ethereum; they have several [tools](https://docs.zama.ai/homepage/) available:

- **[TFHE-rs](https://docs.zama.ai/tfhe-rs)**: Pure Rust implementation of TFHE for boolean and small integer arithmetics over encrypted data
- **[fhEVM](https://docs.zama.ai/fhevm)**: Private smart contracts on the EVM using homomorphic encryption

There are some challenges with ZAMA's fhEVM approach that are yet to be improved. Networks using ZAMA's fhEVM are limited to about 2 FHE transactions per second (tps). Compared to Ethereum's ~15 tps this is not far off; however, it will need to be greatly improved for many time-sensitive applications.

Additionally, operations on encrypted integers are much more difficult to perform than on plaintext integers. For example, on an Amazon m6i.metal machine (one of Amazon's top machines costing $2-4k per month to operate):

- adding or subtracting two **encrypted** uint8 values takes around 70ms
- adding **plaintext** uint8 values is essentially free and instant on any modern device

There are also limitations to the size of unsigned integers available in the fhEVM context. Encrypted uint32 values are the largest possible in the fhEVM, while uint256 are the largest in the standard EVM and are used frequently by many protocols on Ethereum. Due to the challenge of operating on encrypted values in the fhEVM it is currently unreasonable to run validators at home, which makes this more suitable for networks with a smaller, more trusted validator set.

[Sunscreen](https://docs.sunscreen.tech/) is another project actively working on FHE; they have a Rust-based FHE compiler using the BFV scheme with a [playground](https://playground.sunscreen.tech/). They've deployed a [blind auction](https://demo.sunscreen.tech/auctionwithweb3) proof of concept on SepoliaETH.

[Fhenix](https://docs.fhenix.io/), a team working on a modular "FHE blockchain extension", plans on launching their testnet in January 2024. They also recently released their [whitepaper on FHE-Rollups](https://www.fhenix.io/fhe-rollups-scaling-confidential-smart-contracts-on-ethereum-and-beyond-whitepaper/).

In the last five years, significant advancements have been made to make FHE more usable. Shruthi Gorantala's [framework](https://youtu.be/Q3glyMsaWIE?si=TbhlNxGsozbalIHU&t=1278) for thinking about FHE development as a hierarchy of needs is particularly helpful. The performance improvements listed above address deficiency needs and are contained in Layers 1-3 within the FHE tech stack. For FHE to realize its full potential, we also need to address the growth needs listed in Layers 4-5.

![FHE Hierarchy of Needs](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1/ZQ48QaY9vXvlwn-4Eh2B9.webp)

FHE Hierarchy of Needs

A critical aspect of systems integration is figuring out how to combine FHE technology with other privacy-enhancing primitives like ZKPs and MPC in a way that suits each unique trust model and protocol.

Continue to [Part 2: Fundamental Concepts, FHE Development, Applied FHE, Challenges and Open Problems](https://mirror.xyz/privacy-scaling-explorations.eth/wQZqa9acMdGS7LTXmKX-fR05VHfkgFf9Wrjso7XxDzs).
