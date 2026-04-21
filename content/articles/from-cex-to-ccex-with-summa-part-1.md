---
authors: ["Enrico Bottazzi"]
title: "From CEX to CCEX with Summa Part 1"
image: "/articles/from-cex-to-ccex-with-summa-part-1/from-cex-to-ccex-with-summa-part-1-cover.webp"
tldr: "This post was written by [Enrico Bottazzi](https://github.com/enricobottazzi) /n/n Special thanks to Yi-Hsiu Chen (Coinbase), Shashank Agrawal (Coinbase), Stenton Mayne (kn0x1y), Michelle Lai and Kostas Chalkias (Mysten Labs) for review and discussion. /n/n Part 1 introduces the main concepts behind the Summa protocol and can be skipped if already familiar to the reader. /n/n [Part 2](https://mirror.xyz/privacy-scaling-explorations.eth/f2ZfkPXZpvc6DUmG5-SyLjjYf78bcOcFeiJX2tb2hS0) dives into a full Proof of Solvency flow."
date: "2023-09-14"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/_1Y6ExFD_Rs3oDxwx5_kWAj_Tl_L9c0Hm7E6SVJei0A"
tags:
  [
    "summa",
    "proof of solvency",
    "zero-knowledge proofs",
    "merkle tree",
    "cryptography",
    "privacy",
    "security",
    "centralized exchange",
    "computational integrity",
    "infrastructure/protocol",
  ]
projects: ["summa"]
---

## Part 1 - Introduction

In 1494 [Luca Pacioli](https://en.wikipedia.org/wiki/Luca_Pacioli), a Franciscan Friar, published _Summa de arithmetica, geometria, Proportioni et proportionalita_. The book laid out for the first time in history the principles of double-entry bookkeeping and paved the way for the creation of the study field known as accounting.

![](/articles/from-cex-to-ccex-with-summa-part-1/FIFNNkC2YB8uvr3wjAV0E.webp)

More than 5 centuries later, book authentication still relies on the same principles. The financial integrity of the businesses is guaranteed by government licenses or manual background checks performed by some authorities or auditors.

In the context of cryptocurrencies, the fragility of such a financial paradigm becomes evident every time a major centralized exchange (CEX) blows up.

![](/articles/from-cex-to-ccex-with-summa-part-1/W2GtQw6kUenW4f7kCWd-Y.webp)

In November 2022, Vitalik shared a [blog post](https://vitalik.ca/general/2022/11/19/proof_of_solvency.html) where he envisioned a transition from the "don't be evil" aspiring-good-guy CEX to a more secure cryptographically constrained exchange (CCEX).

[Summa](https://github.com/summa-dev) was created in March 2023 within the [PSE Team](https://pse.dev/projects/summa) to build the tooling to power such a transition: **[summa-solvency](https://github.com/summa-dev/summa-solvency)** is a zero-knowledge proof of solvency solution.

This blog post provides a technical overview of such a solution.

The goal is to gather feedback from the community to establish an industry-wide standard for Proof of Solvency (also known as [Proof of Reserves](https://niccarter.info/proof-of-reserves/)). Exchanges and any custodial wallet solution should freely fork and adapt the repository to their needs, moving away from self-established practices. In the short term, the goal is to [collaborate with exchanges during a Beta program](https://docs.google.com/forms/d/e/1FAIpQLSctGXMIUSdUahQr5DvTuc2cpOj9XVYQGo8_A3WhPleCXEcdIw/viewform) to help them bring Summa to production, gain insight into their operations and requirements, and foster mutual learning.

Before diving into the specification of Summa, Part 1 of the blog post introduces the three main ideas underlying Summa, namely:

1.  Proof of Solvency
2.  Cryptographic Commitments
3.  Zero Knowledge Proof

Readers familiar with these concepts can skip them and jump to [Part 2: Summa Protocol.](https://mirror.xyz/privacy-scaling-explorations.eth/f2ZfkPXZpvc6DUmG5-SyLjjYf78bcOcFeiJX2tb2hS0)

## Part 1 - Introduction

### Proof of Solvency

The role of a Centralized Exchange (Exchange) is to collect deposits from users and custody cryptocurrencies on their behalf. Those **assets** are managed by the Exchange's private keys and live on the blockchain.

The deposit of a user into an Exchange is not necessarily recorded on the blockchain, usually only being recorded on the Exchange’s servers. While this allows saving blockchain transaction fees for the users, a malicious Exchange could unilaterally modify the record of a user balance without the user’s consent and without leaving any cryptographic trace of the manipulation. These deposits are defined as **liabilities** of the Exchange because they are owed by the Exchange to its customers.

![](/articles/from-cex-to-ccex-with-summa-part-1/INvah5glHUj9sWKgUpk_8.webp)

The relation between a user and an Exchange is based on a trust agreement that for every deposit, the Exchange will hold a corresponding amount of (the same!) cryptocurrency within their wallet. As long as the Exchange abides by this trust-based agreement, the Exchange is **solvent** and users are confident that they can safely withdraw at any time.

Whenever trust is involved, there are many ways it could go wrong. Two relevant examples are:

- The liabilities denominated in a cryptocurrency are backed by a different one (FTX, I’m looking at you!). Given the volatility of the relative value of these two currencies and the lack of liquidity in the market, the Exchange can not guarantee a safe withdrawal of ETH to all its users at any time.
- The liabilities denominated in a cryptocurrency (i.e. ETH) are not backed at all (or just a fraction of) and the Exchange is YOLO investing the deposits of the users. Again, the Exchange cannot guarantee a safe withdrawal to its users.

A Proof of Solvency protocol provides a solution for that. The cryptographic constraint that must be met by the Exchange is

![](/articles/from-cex-to-ccex-with-summa-part-1/zX6JjpoXE48utjJitckri.webp)

in which _n_ are all the addresses controlled by the Exchange holding a specific asset, and _m_ are all the users of the Exchange that have invested in that asset. Note that:

- This constraint should be satisfied **separately** for **every** asset supported by the Exchange.
- In the formula, _asset,_ and _liability_ refer to their state at a time _t_. Performing Proof of Solvency is not a one-time operation but should be performed many times (rounds). The more frequent these rounds are, the more reliable the Exchange is.

### Cryptographic Commitments

[Cryptographic Commitment Schemes](https://en.wikipedia.org/wiki/Commitment_scheme) are a fundamental component in cryptography, particularly in protocols that require a party to commit to a value without revealing it initially and then reveal the value (or just some property of the value) later.

The simplest and most popular cryptographic commitment scheme is hashing.

Let us consider a scenario in which Alice wants to publicly commit to a prediction about an upcoming event, say the first scorer in a football match, without revealing her prediction until the match has ended.

Alice can take her winner prediction "BenjaminPavard", run a hash function on top of this, and publish the resulting output (hash digest) on her Twitter profile. At this point, no one can learn Alice's prediction just from the hash digest.

![](/articles/from-cex-to-ccex-with-summa-part-1/_uLicpcXlCPnFB2Y40Jd5.webp)

In fact, to decrease the likelihood that someone unmasks Alice's hash and discovers her prediction, it would be safer to add some random large number (technically known as _salt_) together with the prediction as hash input, in order to avoid brute-force and [Rainbow Table attacks](https://en.wikipedia.org/wiki/Rainbow_table).

After the end of the event, she can reveal her prediction _"BenjaminPavard"_. Anyone can re-run the hash function on the prediction to check whether it matches the _hashDigest_ previously published on Twitter. If Alice reveals a different prediction, such as _"TheoHernandez"_, the result of hashing such a prediction will result in something different from the previously published _hashDigest_.

Cryptographic commitment schemes guarantee two very cool properties:

1.  **Hiding**: The commitment hides the value, and everyone who sees the commitment cannot determine the actual value until Alice decides to reveal it.
2.  **Binding**: Once Alice has made the commitment, she cannot change the value she committed to. In other words, when revealing, the committer cannot reveal different values as these wouldn’t match the original commitment. That’s because modern hash functions are computationally collision-free and we cannot find two inputs that result in the same hash digest

Another popular commitment scheme, useful when dealing with larger data structures, is a [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree). In a Merkle Tree, each data entry is hashed and inserted as a _leaf_ of the tree. Each leaf is hashed with the sibling one to produce a middle node. This process is repeated for each level of the tree until it gets to a single node at the top, called the _Merkle Root_, which acts as a commitment to the entire set of data.

Merkle Trees are especially useful when you want to prove the existence (typically known as "inclusion proofs") of a specific piece of entry data within a large set without revealing the entire set in a time-efficient manner.

Summa makes use of a modified version of a Merkle Tree as a cryptographic commitment scheme which is a **[Merkle Sum Tree](https://github.com/summa-dev/summa-solvency/blob/master/zk_prover/src/merkle_sum_tree/mst.rs)**. In the context of Summa, the data entries to the Merkle Sum Tree are the liabilities of the Exchange, while the _Merkle Root_ contains a commitment to the state of the Exchange's liabilities.

![](/articles/from-cex-to-ccex-with-summa-part-1/5LLmG0yppR3mjvIZFjf6U.webp)

The core properties of a Merkle Sum Tree are:

- Each entry of a Merkle Sum Tree is a pair of a username and the associated balance.
- Each Leaf Node contains a hash and a balance. The hash is equal to `H(username, balance)`. There is a 1-1 relationship between entries and leaf nodes. The balance of a leaf node is equal to the balance of the associated entry, and ditto for the username.
- Each Middle Node contains a hash and a balance. The hash is equal to `H(LeftChild.hash, LeftChild.balance, RightChild.hash, RightChild.balance).` The balance is equal to the sum of the balances of the two child nodes.

  - The Root Node contains a hash and a balance

    - Analogous to a traditional Merkle Tree, the Merkle Root contains a commitment to the state of the entries
    - In addition to a traditional Merkle Tree the Merkle Root makes it possible to easily fetch the sum of balances of entries of the tree.

While the example uses a balance in only a single cryptocurrency (ETH), in Summa balances in multiple currencies are supported in the same Merkle Sum Tree

Let's consider the case in which an Exchange wants to prove to user Carl that he has been accounted for correctly in their database at time _t_. Here are the steps:

1.  The Exchange locally builds a Merkle Sum Tree out of its database state at time _t_
2.  The Exchange publishes the Merkle Root of the tree, which represents a commitment to the state of the entire tree
3.  The Exchange generates a Merkle Proof of Inclusion for Carl. That is, all the nodes (in blue) that Carl needs to verify his inclusion in the tree
4.  Carl computes his corresponding leaf node starting from his data (username and ETH balance) at time _t_ and performs the subsequent hashing with the nodes provided in the Merkle Proof until he gets to the Merkle Root. If the resulting Merkle Root matches the one committed by the Exchange at step 2, Carl can be confident that his account has been accounted for correctly in the database at time _t_. The operation of verifying the correct inclusion in the tree is described in the following pseudo-algorithm.

![](/articles/from-cex-to-ccex-with-summa-part-1/XM9utrZ7Z-MtocwVU-Yux.webp)

```python
def verify_merkle_proof(leaf_data, merkle_proof, committed_root): current_node = compute_leaf_node(leaf_data) for proof_node in merkle_proof: # Decide which child (left or right) the current node is # This information can be part of the merkle_proof or determined otherwise if is_left_child(current_node, proof_node): current_node = compute_internal_node(current_node, proof_node) else: current_node = compute_internal_node(proof_node, current_node) return current_node == committed_root leaf_data_for_carl = ("Carl", 10) # This would be Carl's username and ETH balance at time t assert verify_merkle_proof(leaf_data_for_carl, merkle_proof, committed_root)
```

Let's take a step back and analyze what has been achieved in the protocol. The Exchange has proven the correct inclusion of some users' data within their database without having to reveal the whole database to the public (since Carl only needed the blue nodes). Furthermore, Carl only needed to perform 3 hashing operations to verify his correct inclusion. This number is always equal to _log₂n_ where _n_ in the number of entries in the tree. The verification of a correct inclusion in a Merkle Sum Tree with over 130M entries only requires 27 hashing operations!

While this is already a big achievement both in terms of efficiency and data protection, precious information is leaked in the process. The Merkle Proof reveals to Carl that an unknown user has a balance of 15 ETH. Furthermore, it also reveals the partial sums of the balances of _some_ users and the aggregated liabilities of the Exchange.

By tracking the progression of these data across time Carl gets to know the trades of its sibling leaf Daisy, and, more importantly, how the aggregated liabilities change through time, which represents the main insight into the performance of the Exchange as a business.

Furthermore, the users of the Exchange could come together and reconstruct the whole database of the Exchange by pooling together each of their individual Merkle Proofs.

The next section introduces the concept of Zero Knowledge Proof. Its properties combined with the Merkle Sum Tree commitment scheme would allow an Exchange to perform a fully cryptographically auditable Proof of Solvency while keeping all sensitive information private.

The reader may have noticed that this cryptographic commitment scheme only covers the liabilities while the assets have not been mentioned yet. The concept is introduced in a later section.

### Zero Knowledge Proof

A core concept that I often use to explain zero-knowledge proof, or, more specifically, [zkSNARKs](https://vitalik.ca/general/2021/01/26/snarks.html) is **Computational Integrity Guarantee**.

A computation is defined as any set of rules (or **constraints**) that can be encoded into a computer program.

A computation can be as simple as performing the sum of 2 numbers.

![](/articles/from-cex-to-ccex-with-summa-part-1/bNUf8fJ3hhNZUC0Fjo31z.webp)

A more complex computation is validating blockchain transactions and bundling them into a block.

![](/articles/from-cex-to-ccex-with-summa-part-1/nxXaAGAgoGQ3wUs1x_YxZ.webp)

You can see that a computation is made of a list of inputs, a program that sets the constraints of the computation, and a list of outputs (it can be more than one).

Most of the time, after an actor performs the computation, there are other people who need to verify that the computation was done correctly. This is especially relevant in the context of zero-trust such as block building (or mining).

More formally, given a computation with constraints known by everyone, a Prover wants to prove to a Verifier that the output is the result of running a computation on certain inputs.

The naive way to achieve such **Computational Integrity Guarantee** is for the Verifier to rerun the same computation with the same inputs and check that the output matches.

![](/articles/from-cex-to-ccex-with-summa-part-1/YyQ7OXyLwYeS9LoD0rjN9.webp)

Such an approach has two main issues:

- The verification time is exactly the same as the time it takes to perform the computation. In order to achieve consensus to a new block header, every node has to perform this computationally intensive operation, which is the main bottleneck to Blockchain scalability.
- To achieve computational integrity guarantee the list of inputs and outputs has to be public.

zkSNARKs elegantly solve these 2 issues by providing a new protocol to run any arbitrary computation that, together with the output, also returns a proof π. Such proof, despite being very tiny and faster to verify than running the original computation, carries enough information to provide the **Computational Integrity Guarantee**.

![](/articles/from-cex-to-ccex-with-summa-part-1/dNRWawjIRWEOoFXhV8uQK.webp)

The Verifier doesn't need to re-run the whole algorithm again but only needs to run a lightweight program using π as input. While the time required by the original computation grows proportionally to its complexity or the size of the inputs, the time to verify a zkSNARK proof grows logarithmically with the complexity/input size, or is even constant.

A further characteristic of such protocols is that the prover can selectively decide whether to keep an input of the computation private or public. The proof provides the verifier with **zero knowledge** of potentially any of the inputs of the computation.

Summa leverages the properties of zkSNARKs to allow an Exchange to generate a Proof of Solvency that:

- Provides a cryptographic-based guarantee that the statement is satisfied.
- Can be verified quickly on any consumer device
- Keeps the sensitive data of the Exchange (and its users) private

As anything in engineering, switching to a zkSNARK Protocol comes with trade-offs:

- **Trusted Setup**: each zkSNARK protocol relies on a [trusted setup](https://vitalik.ca/general/2022/03/14/trustedsetup.html). You can think of the setup as the parameters that guarantee the integrity of a protocol. These parameters are the result of a ceremony in which many parties contribute some random inputs. If these parties get together and recompose the whole input used to create the parameters, they can potentially attack a ZK protocol and generate valid proofs even without performing the computation that follows the pre-defined rules.
- **Prover Overhead**: the reduction of the verification time comes at the cost of proving time. In fact, running the same computation inside a ZK circuit takes, on average, > 100x times more than performing it without having to generate a ZK proof.

Summa uses [Halo2](https://github.com/privacy-scaling-explorations/halo2), a proving system that was originally built by [ZCash](https://github.com/zcash/halo2). Beyond high proving speed, Halo2 allows the reuse of existing and reputable trusted setups such as the [Hermez 1.0 Trusted Setup](https://docs.hermez.io/Hermez_1.0/about/security/#multi-party-computation-for-the-trusted-setup) for any application-specific circuit.

The reader is now fully equipped with the background to understand the functioning of any part of the Summa ZK Proof of Solvency Protocol.

## End Part 1

[Part 2](https://mirror.xyz/privacy-scaling-explorations.eth/f2ZfkPXZpvc6DUmG5-SyLjjYf78bcOcFeiJX2tb2hS0) dives into a full Proof of Solvency flow. At each step, a detailed explanation of the cryptographic tooling being used is provided.

The path toward establishing an industry-wide standard for proof of solvency requires the definition of a protocol that is agreed upon by Exchanges, Cryptographers, and Application Developers. The goal is to collaborate with Exchanges during a Beta program to bring Summa to production and, eventually, come up with a [EIP](https://github.com/summa-dev/eip-draft) to define a standard.

Complete this [Google Form](https://forms.gle/uYNnHq3vjNHi5iRh9) if your Exchange (or Custodial Wallet) is interested in joining the program.

Furthermore, if you are interested in sharing feedback or simply entering the community discussion, join the [Summa Solvency Telegram Chat](https://t.me/summazk).Summa is made possible because of contributions from [JinHwan](https://github.com/sifnoc), [Alex Kuzmin](https://github.com/alxkzmn), [Enrico Bottazzi](https://github.com/enricobottazzi).
