---
authors: ["Vivian Plasencia"] # Add your name or multiple authors in an array
title: "Revocation in zkID: Merkle Tree-based Approaches" # The title of your article
image: "/articles/revocation-in-zkid-merkle-tree-based-approaches/cover.webp" # Image used as cover,  Keep in mind the image size, where possible use .webp format, possibly images less then 200/300kb
tldr: "Merkle tree-based approaches enable efficient and privacy-preserving revocation checks for verifiable credentials using either membership proofs over valid credentials or non-membership proofs over revoked credentials. Membership proofs are faster to compute, while non-membership proofs scale better in practice since updates occur only when credentials are revoked." #Short summary
date: "2026-02-03" # Publication date in ISO format
tags: ["zero-knowledge", "zkID", "ZK-Kit"] # (Optional) Add relevant tags as an array of strings to categorize the article
projects: ["zk-id", "zk-kit"]
---

**Summary**: Merkle trees are widely used in revocation systems for verifiable credentials, particularly in blockchain and smart contract contexts. They enable efficient and privacy-preserving revocation through two main approaches: membership proofs in a list of valid credentials and non-membership proofs in a list of revoked credentials. Benchmarks indicate that while membership proofs are faster to compute, non-membership proofs tend to be more efficient overall, as they require updates only when credentials are revoked, making them more scalable and cost-effective for real-world use.

## Revocation

Revocation is the process that allows an issuer to invalidate a previously issued verifiable credential so that verifiers can detect it is no longer valid.

Ongoing work on privacy-preserving revocation mechanisms is being developed by Kai and Ken[^4].

## Merkle Tree-based Revocation Approaches

Merkle tree based revocation systems generally follow one of two models. Either they maintain a list of valid credentials and require users to prove inclusion in that list, or they maintain a list of revoked credentials and require users to prove exclusion from it. Both models rely on Merkle proofs, but they differ significantly in update frequency and scalability. In both cases, each credential, or a commitment derived from it, corresponds to a single leaf in the Merkle tree.

### Membership Proof in a List of Valid Credentials

In this approach, users prove that their credential is included in a list of valid credentials. If the credential is present in the tree, it is considered not revoked.

The Incremental Merkle Tree (IMT) is a data structure commonly used for membership proofs.

LeanIMT[^2] (optimized IMT) is a binary Merkle tree that updates efficiently by appending new entries on the right side only. 

### Non-Membership Proof in a List of Revoked Credentials

In this approach, users prove that their credential is not included in a list of revoked credentials. If the credential does not appear in the revocation tree, it is considered valid.

The Sparse Merkle Tree (SMT)[^1] is a binary Merkle powered trie where most branches are empty and each element inserted has a fixed position. It's used for membership and non-membership proofs.

## System Behavior for each Approach

### Number of actions per approach

Using membership proofs over a list of valid credentials means updating the tree every time a new credential is issued. In contrast, with non-membership proofs over a list of revoked credentials, updates are needed only when a credential is revoked. Since revoked credentials are usually far fewer than valid ones, the non-membership approach is much more efficient.

### Scalability of the approaches

When trees become very large (e.g., millions of credentials), generating a client-side Merkle proof is no longer feasible. It's necessary to have a server to do it. 

This is both time and data consuming and can also allow the server to de-anonymize the proofs.

Some possible solutions: 
- Merkle forest - more complex data structure
- Private Information Retrieval (PIR) - too slow for production-scale use today[^3]
- TEE/MPC + ORAM - best current solution

## Membership and Non-Membership Proofs Tech Stack

- Both approaches are usually implemented with Circom + SnarkJS, using Groth16 as the proving system, which ensures fast client-side generation and low-cost smart contract verification. 
- Since Groth16 is commonly used, these methods require a trusted setup per circuit. Membership and non-membership proofs are also compatible with other proving systems such as Plonk, Fflonk, and UltraHonk.

## Complexity Analysis

### Time Complexity


| Operation             | LeanIMT                                                                | SMT                                      |
| --------------------- | ---------------------------------------------------------------------- | ---------------------------------------- |
| Notation              | n = number of leaves                                                   | n = maximum supported leaves             |
| Insert                | $O(\log n)$                                                            | $O(\log n)$                              |
| Generate Merkle Proof | $O(\log n)$                                                            | $O(\log n)$                              |
| Verify Merkle Proof   | $O(\log n)$                                                            | $O(\log n)$                              |
| Search                | $O(n)$ - requires scanning all leaves <br> $O(1)$ - if index is cached | $O(\log n)$ - guided traversal using key |

### LeanIMT

$n$: Number of leaves in the tree.

- The time complexity of Insert, Generate Merkle Proof and Verify Merkle Proof is $O(\log n)$.
- Search operation has time complexity $O(n)$, since it requires traversing all the leaves to find the desired one, as the structure does not support direct leaf access.
- If the index of the leaf is saved (cached), since its position does not change when new values are added, the search cost improves from $O(n)$ to $O(1)$.

### SMT

$n$: Maximum supported leaves in the tree.

- The time complexity of Insert, Generate Merkle Proof and Verify Merkle Proof is $O(\log n)$.
- The search operation remains $O(\log n)$, as the key guides direct traversal from the root to the corresponding leaf.

### Space Complexity

| Structure | Complexity | Notation                         |
| --------- | ---------- | -------------------------------- |
| LeanIMT   | $O(n)$     | $n$ = number of leaves           |
| SMT       | $O(n)$     | $n$ = number of non-empty leaves |

### LeanIMT
$n$: Number of leaves in the tree.

The space complexity of the LeanIMT is $O(n)$.

### SMT

$n$: Number of non-empty leaves in the tree.

The space complexity of the SMT is $O(n)$.

### Practical Depth Ranges

- LeanIMT: In practice, LeanIMTs are used with relatively small tree depths, typically between 10 and 32 levels, since they grow dynamically with the number of inserted elements. This corresponds to handling between roughly $2^{10}$ (≈ 1k) and $2^{32}$ (≈ 4B) leaves, which is sufficient for most incremental use cases.
- SMT: SMTs usually have fixed depths between 64 and 256, depending on the key space size. This depth is constant regardless of how many keys are actually used. 
A tree with depth $d$ can theoretically address up to $2^{d}$ unique keys (leaves). In practice, only a very small subset of this key space is populated, and the SMT efficiently stores only non-default nodes.

### Complexity Analysis Insights

LeanIMTs scale with the amount of actual data, while SMTs scale with the size of the key space.
SMTs efficiently store key/value maps using direct access paths and sparse storage, whereas LeanIMTs rely on linear search when the index of an element is not cached.

## Benchmarks

LeanIMT and SMT implementations were benchmarked across Circom circuits, browser environments, Node.js environments, and Solidity smart contracts to evaluate their overall efficiency and practicality.

These benchmarks are designed to reflect how each data structure would typically be used in real world revocation systems.

The benchmarks shown here focus on the most representative measurements for each environment:
- Circuits: non-linear constraints and Zero-Knowledge (ZK) artifact sizes.
- Browser: tree recreation, Merkle proof generation, and ZK proof generation.
- Node.js: tree insertions and ZK proof verification.
- Smart contracts: tree insertions, ZK proof verification, and deployment costs.

Many additional benchmarks are available and can be generated using the repository. 

### Running the benchmarks

To run the benchmarks, follow the instructions in the repository README files. The repository provides scripts and commands for running circuit, browser, Node.js, and smart contract benchmarks.

- GitHub repository: https://github.com/vplasencia/vc-revocation-benchmarks
- Browser App: https://vc-revocation-benchmarks.vercel.app

### System Specifications and Software environment

All the benchmarks were run in an environment with these properties:

**System Specifications**

Computer: MacBook Pro

Chip: Apple M2 Pro

Memory (RAM): 16 GB

Operating System: macOS Sequoia version 15.6.1

**Software environment**

Node.js version: 23.10.0

Circom compiler version: 2.2.2

Snarkjs version: 0.7.5

### Circuit Benchmarks

The circuits are written using the Circom DSL.

### Number of Non-linear Constraints

Fewer constraints indicate a more efficient circuit.

![LeanIMT vs SMT: Number of Constraints Across Tree Depth](/articles/revocation-in-zkid-merkle-tree-based-approaches/constraints-absolute.webp)

![Relative Efficiency: Ratio of Constraints](/articles/revocation-in-zkid-merkle-tree-based-approaches/constraints-ratio.webp)

### Proof Size

Groth16 Proof Size is always fixed, independent of circuit size: ~ 805 bytes (in JSON format).

### ZK Artifact Size

#### WASM File Size
- SMT ≈ 2.2-2.3 MB
- LeanIMT ≈ 1.8 MB

#### ZKEY File Size
From tree depth 2 to 32:
 
- SMT: grows from 1.4 MB to 5.9 MB.
- LeanIMT: grows from 280 kB to 4.4 MB.

#### Verification Key JSON File Size
Constant at ~2.9 kB for both.

### Circuit Insights

- At every tree depth, SMT has between ~1560 and ~1710 more constraints than LeanIMT.
- While the absolute difference grows slowly with depth, the relative ratio decreases: for small depths, SMT can have over 4x more constraints, but by depth 32 it is only about 1.22x more.
- This shows that LeanIMT provides a large relative improvement for small trees, while still maintaining an absolute advantage for larger trees.
- The WASM artifacts remain almost constant in size for both (1.8 MB vs 2.3 MB).
- LeanIMT produces smaller proving keys across all depths. Both exhibit near-linear ZKEY growth as tree depth increases, but LeanIMT remains consistently lighter, up to 25-30% smaller than SMT.
- LeanIMT is more efficient overall since both its WASM and ZKEY files are lighter.

### Browser Benchmarks

### Recreate Tree

| Members | SMT Time | LeanIMT Time |
| ------- | -------- | ------------ |
| 128     | 232.3 ms | 17.6 ms      |
| 512     | 1 s      | 78.7 ms      |
| 1024    | 2.1 s    | 139.2 ms     |
| 2048    | 4.6 s    | 273.0 ms     |

### LeanIMT Performance

| Members   | Recreate Tree Time |
| --------- | ------------------ |
| 10 000    | 1.2 s              |
| 100 000   | 11.9 s             |
| 1 000 000 | 1 m 59.9 s         |

![LeanIMT vs SMT: Recreate Tree Browser](/articles/revocation-in-zkid-merkle-tree-based-approaches/recreate-tree-browser.webp)

### 128 - 2048 credentials

- Generate Merkle Proof (both): ~5 ms
- Non-Membership ZK Proofs (SMT): 446-590 ms
- Membership ZK Proofs (LeanIMT): 337-433 ms

### LeanIMT 10K - 1M credentials

- Generate Merkle Proof: ~5 ms
- Membership ZK Proofs: 382-477 ms

### Browser Insights

- LeanIMT remains faster across all operations in the browser.
- Since the LeanIMT typically handles around 100,000 credentials or more, while the SMT manages only hundreds or thousands, the SMT can appear faster when recreating the tree due to its smaller size.
- Both SMT and LeanIMT are practical for browser-based applications.
- LeanIMT is ideal for systems that need frequent updates and fast client-side proof generation, while SMT is better when non-membership proofs are required.


### Node.js Benchmarks

![LeanIMT vs SMT: Insert Function Node.js](/articles/revocation-in-zkid-merkle-tree-based-approaches/insert-node.webp)

- ZK Proof verification is constant at roughly 9 ms across all depths.

### Node.js Insights

- LeanIMT insertions are significantly faster than SMT insertions at the same number of leaves. However, since a LeanIMT in a real world system can handle 1 million or more credentials, while an SMT typically manages only hundreds or thousands of revoked credentials, SMT insertions can appear faster in practice due to the smaller tree size.
- ZK proof verification times are similar, since they depend primarily on the proof system rather than the data structure.


### Smart Contract Benchmarks

- Insert 100 leaves into the tree.
- Verify one ZK proof with a tree of 10 leaves.

### Function Gas Costs

| Operation       | LeanIMT (gas) | SMT (gas) |
| --------------- | ------------- | --------- |
| Insert          | 181,006       | 1,006,644 |
| Verify ZK Proof | 224,832       | 224,944   |


### Deployment Costs

| Contract       | LeanIMT (avg gas)        | SMT (avg gas)        |
| -------------- | ------------------------ | -------------------- |
| Bench Contract | 461,276                  | 436,824              |
| Verifier       | 350,296                  | 349,864              |
| Library        | 3,695,103 _(PoseidonT3)_ | 1,698,525 _(SmtLib)_ |

### Smart Contract Insights

- LeanIMT is significantly cheaper for insert operations, reducing gas consumption by around 82% compared to SMT.
- Verification costs are identical between both, as they share the same Groth16 verifier logic.
- Both implementations remain practical for mainnet deployment.
- LeanIMT costs a bit more to deploy due to the Poseidon library.

## Takeaways

- Membership proofs are faster to compute than non-membership proofs.
- Overall, LeanIMT offers better performance for membership proofs and client-side use cases, while SMT remains the preferred option when non-membership proofs are required.
- Since revoked credentials are usually far fewer than valid ones, non-membership proofs over a list of revoked credentials are often more efficient in practice.

## Future Directions

This work highlights the following directions that could be explored to further improve privacy-preserving revocation systems with Merkle tree-based solutions:

- Further optimization of SMT implementations across different programming languages.
- The design of a new data structure to support more efficient non-membership proofs.

## Acknowledgement

I would like to thank Ying Tong, Zoey, Privado ID/Billions (Oleksandr and Dmytro), Kai Otsuki, and the PSE members for all the feedback, insights, ideas, and direction they shared along the way. Their support and thoughtful conversations were incredibly helpful in shaping this work.

[^1]: Sparse Merkle Tree (SMT) paper: https://docs.iden3.io/publications/pdfs/Merkle-Tree.pdf
[^2]: LeanIMT paper: https://zkkit.org/leanimt-paper.pdf
[^3]: Ethereum Privacy: Private Information Retrieval - https://pse.dev/blog/ethereum-privacy-pir
[^4]: Revocation report: https://github.com/decentralized-identity/labs-privacy-preserving-revocation-mechanisms/blob/main/docs/report.md