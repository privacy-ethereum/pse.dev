---
authors: ["Brechy"]
title: "Ethereum Privacy: Private Information Retrieval"
image: "/articles/ethereum-privacy-pir/cover.webp"
tldr: "Private Information Retrieval can enhance Ethereum privacy."
date: "2025-06-18"
tags: ["ethereum", "privacy", "pir"]
projects: ["semaphore", "scaling-semaphore-pir"]
---

_Thanks to [Cperezz](https://github.com/cperezz), [Vivian](https://github.com/vplasencia) and [Oskar](https://github.com/oskarth) for feedback and review._

Ethereum presents several [privacy challenges](https://hackmd.io/@pcaversaccio/ethereum-privacy-the-road-to-self-sovereignty#Status-Quo). One of them is that read operations can expose user data and behavior patterns, potentially leading to [deanonymization](https://en.wikipedia.org/wiki/Data_re-identification). In this scenario, users are safe only if they run their own node or host the data locally. Otherwise, all requests go through third parties, such as relayers, providers, and [wallets that process IP addresses](https://consensys.io/privacy-notice).

[Private Information Retrieval](https://crypto.stanford.edu/pir-library/) provides a solution, enabling users to request information from a server using an **obfuscated query**, ensuring the server doesn't know which item was retrieved.

Recent progress makes PIR an option for practical deployment in some scenarios. Query privacy can be achieved with bandwidth costs on the order of kilobytes and server throughput capable of handling medium-sized databases.

## Introduction

Information in Ethereum and privacy solutions such as Semaphore use [Merkle Trees](https://blog.ethereum.org/2015/11/15/merkling-in-ethereum) to store its data, since this allows efficient verification with Merkle proofs. Read operations, like checking an account balance or getting sibling nodes to prove group membership, require specifying a target like an [account address](https://github.com/ethereum/execution-apis/blob/884fb32bfefe232fe5ab30a7fc370b6cf83f3afa/src/eth/state.yaml#L17) or a [specific identity](https://github.com/privacy-scaling-explorations/zk-kit.circom/blob/db25c40b6678e15977c5343fc0dfb0857766a1d6/packages/binary-merkle-root/src/binary-merkle-root.circom#L19). This exposes the user's intents to the node or the server hosting the data and any other network observer.

Merkle trees can become [prohibitively large](https://docs.google.com/spreadsheets/d/17gvQMLuZ6jXnWRCFNOQCVl-ZJr18FoTHZVX1cGrf-po/edit?gid=0) for local storage, particularly on resource-constrained devices like smartphones. A tree with $2^{20}$ (~1 million) 32-byte leaves is 32 MB, and scales to 1 GB for $2^{25}$ (~33 million) leaves. Having the user download 1 GB every time they need to create a proof (and the tree is updated) is not practical. Being synced with the server for every update would be a high network cost, and not possible in many scenarios.

## Private Information Retrieval

Private Information Retrieval is a cryptographic technique that enables a client to fetch a specific item from a server-held database without revealing which item was accessed. The client sends an encrypted or masked query to the server, which processes it, and the response can only be interpreted by the client.

### Main Categories

#### Single Server

Single server PIR schemes rely on computational hardness assumptions, often related to [homomorphic encryption primitives](https://medium.com/thecapital/cryptography-101-ring-learning-with-errors-ff2708a8a530). An example is [Spiral](https://eprint.iacr.org/2022/368).

The client communicates with only one server, and this performs the computations directly on the encrypted data. This creates an imbalance in computational burden, making most of it fall on the server side.

#### Multi Server

In this setting, a user downloads a single message out of a set of messages stored in multiple non-colluding and replicated databases. This can be achieved by sending randomized queries to each server and combining the responses to get the desired message. This mechanism is better described in this [paper](https://arxiv.org/pdf/2304.14397).

It is less computationally demanding but introduces non-collusion assumptions and has higher communication overhead.

> ℹ️ For the rest of the post, we will focus on Single Server PIR.

### Query Format

For single server PIR, we can categorize schemes based on their query format.

#### Key based

The PIR query is formulated using a unique identifier for the desired data item. The server treats its data store as a key-value database.

This offers the advantage that users do not need to know a numerical index corresponding to their target item, as the scheme handles the key-value mapping directly. However, this approach comes with extra costs for database encoding and the mapping process itself.

An example is [Chalamet PIR](https://eprint.iacr.org/2024/092.pdf), which has a [Rust implementation](https://github.com/claucece/chalamet)!

#### Index based

This approach involves preprocessing the database by enumerating all items into an ordered structure, like a flat array. To formulate the query, the client needs to specify the numerical index of the element they want.

Index-based PIR schemes are more efficient, but require maintaining and updating the item-to-index mapping whenever the underlying database changes.

For frequently changing databases, keeping this map updated can be a challenge, but using an append-only mapping strategy can simplify it.

## Application 1: Private Merkle Proof Generation

Merkle proofs enable verification of existence within a Merkle tree. When combined with zero-knowledge circuits, they allow you to prove that something belongs to a tree without revealing what it is.

As an example, if the tree is a group of people, you can prove you're a member without disclosing your identity.

[Semaphore](https://docs.semaphore.pse.dev/) leverages this, enabling you to cast a **signal**, which can be a vote or a message, as a provable group member while preserving your anonymity. [World ID](https://world.org/world-id) uses Semaphore to allow you to anonymously and securely verify that you are a [real and unique human](https://world.org/blog/developers/the-worldcoin-protocol).

Group members are stored in a [Lean Incremental Merkle Tree](https://github.com/privacy-scaling-explorations/zk-kit/tree/main/papers/leanimt) (LeanIMT). It's a Poseidon-based append-only binary tree, with 32-byte nodes and leaves.

World ID has [~13 million members](https://world.org/blog/world/world-id-faqs), and the tree is too large for users to store and update locally. They currently rely on an [indexing service](https://whitepaper.world.org/#verification-process) that retrieves the inclusion proof on behalf of the user.

> 🚨 But this allows the indexer to associate the requester's IP address to their public key

So, in order to [scale Semaphore](https://hackmd.io/@brech1/scale-semaphore) while keeping its privacy guarantees, we should find a way around it.

### Proposed Solution

Users can fetch the tree `root` and `size` without disclosing any information. The LeanIMT has a deterministic structure based on its `size`, so we can compute the indices involved in the Merkle proof for a given leaf (see the [implementation](https://github.com/privacy-scaling-explorations/zk-kit.rust/blob/main/crates/lean-imt/src/stateless.rs)).

With the calculated indices, users can then use PIR to fetch them and generate the Merkle proofs locally.

This solution is feasible only if the tree nodes and leaves needed for the Merkle proof can be determined without accessing the full tree data.

Otherwise, a solution such as implementing a [Multi-Party Computation](https://mirror.xyz/privacy-scaling-explorations.eth/v_KNOV_NwQwKV0tb81uBS4m-rbs-qJGvCx7WvwP4sDg) with the server to execute a `get_merkle_path_indices(i)` function, without the server learning the leaf index, would need to be developed. This path would be **highly impractical**, as it is neither straightforward nor efficient.

## Application 2: Private Ethereum State Reads

Ethereum's [World State](https://epf.wiki/#/wiki/EL/data-structures?id=world-state-trie), stored in Merkle-Patricia Tries, maps addresses to Externally Owned Accounts and contracts state. Standard RPC calls (`eth_getBalance`, `eth_call`, `eth_getStorageAt`) for tasks like balance checks expose:

- Queried addresses or contract slots.
- Query timing and frequency.
- User's IP and device fingerprint.

This metadata allows the RPC endpoint to profile and potentially deanonymize users. With around [320 million active EOAs](https://etherscan.io/chart/address) as of June 2025, local trie storage is impractical for standard consumer hardware. This becomes even worse after [EIP-7702](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7702.md) since EOAs now also store code.

### Proposed Solution

PIR can enable private state reads for balance lookups and contract state reads. For instance, wallets could fetch Ether or token balances and NFTs anonymously. A great working example of this is [sprl.it](https://sprl.it/) for ENS resolution.

> ⚠️ Keep in mind that contract state reads wouldn't be possible in many cases where the contracts are already too big (jump to the benchmarks for specifics), or if we don't want to disclose which contracts we're interested in.

Unlike Semaphore's LeanIMT, Merkle-Patricia Tries lack a deterministic structure based on known parameters, complicating data index computation. There are at least two ways around this:

- **Key-Based PIR**: Schemes like [Chalamet PIR](https://eprint.iacr.org/2024/092.pdf) query by address, treating the trie as a key-value database, which is also [Ethereum's case](https://geth.ethereum.org/docs/fundamentals/databases), avoiding index computation but increasing encoding and usage costs.

- **Index-Based PIR with MPC**: A server-side `address -> index` map is maintained and queried via 2-Party Computation, followed by index-based PIR.

#### What about logs?

[Logs](https://info.etherscan.com/what-is-event-logs/) could be a way around the huge state if we limit the scope in time and operations we're interested in (+1 for [EIP-7708](https://ethereum-magicians.org/t/eip-7708-eth-transfers-emit-a-log/20034)). Even though indexing problems don't get easier, building something like a private [EthReceipts](https://github.com/daimo-eth/ethreceipts) can be practical due to the small size of the base data, providing a solution for one of the most common use cases for block explorers. [QuietRPC](https://github.com/oskarth/quietrpc/tree/main) is exploring a private RPC solution based on logs and two-hop PIR.

### Data Verification

PIR guarantees private retrieval but not data correctness, and standard RPC assumes provider honesty. The `eth_getProof` RPC method could be used to verify data, like [light clients do](https://github.com/a16z/helios?tab=readme-ov-file#ethereum), but it would expose the accessed information.

State verification with PIR is currently not practical. Privately fetching and calculating the indices needed for a Merkle proof is too complex for Ethereum's MPT.

This shouldn't discourage us from implementing PIR-based solutions, since privacy is guaranteed, but it's an open question how to offset the server trust.

## Respire

[Respire](https://eprint.iacr.org/2024/1165) is a single-server PIR scheme tailored for databases of small records (~256 bytes). This can be a common scenario in blockchain applications that rely on Merkle trees to store their data, since nodes tend to be short hashes.

Its security relies on the computational hardness of lattice problems, specifically Ring-LWE. A [deep dive session](https://www.youtube.com/watch?v=Nf4IZ2kTPN4) on Respire is available, presented by professor David J. Wu.

### Efficiency for Small Records

Respire is optimized for retrieving small records. Retrieving a single 256-byte record from a database of over a million entries requires only about 6 KB of total data exchange, so the communication overhead is minimized, enabling high rates (record size/response size).

### Batch Query Support

Respire has support for batch queries, using cuckoo hashing, allowing a client to request multiple items simultaneously. For Merkle proofs, this means a client can fetch all sibling hashes along a path (e.g., 20 hashes) in one go.

Retrieving 10–20 records might cost only about 1.5x the bandwidth of a single record query. However, the computational costs for the database encryption and server answer increase significantly with the batch size.

### No Offline Setup/Hint

Unlike some PIR schemes that require a large "hint" to be pre-downloaded by the client or an expensive one-time offline setup by the server for each client, Respire operates without such a client-side pre-download.

### Implementation

Respire has a [Rust implementation](https://github.com/AMACB/respire) available.

### Mechanics

These are the steps involved in a Respire private information retrieval:

1. **Server Preprocessing**: The server preprocesses the database into a structure ready to perform homomorphic operations. If the database data wants to be updated, this process should run again.

2. **Client Public Parameters Generation**: The client generates reusable public parameters (similar to a public key) that the server uses to process the query. They only have to be generated and transmitted once, at the beginning of the client-server connection.

3. **Client Query Generation**: The client constructs an encrypted query vector. Conceptually, this vector has a 1 at the index of the desired item and 0s elsewhere, but the entire vector is encrypted, so the server can't see the position of the 1.

4. **Server Answer Computation**: The server homomorphically applies this encrypted query to the encrypted database and returns the encrypted answer.

5. **Client Decryption**: The client decrypts to obtain the plaintext answer.

## Performance Evaluation

A [benchmarking codebase](https://github.com/brech1/tree-pir) was created for the performance evaluation, with the main goal being to test Respire with LeanIMTs.

The trees are generated with the `semaphore-rs` group module, and then flattened. Results of $2^n$ member groups (or leaves) mean dealing with a $2^{n+1} - 1$ element database.

[Criterion](https://github.com/bheisler/criterion.rs) was used as benchmarking crate, the settings for each benchmark can be explored in the repository. All elements (leaves and nodes) are 32-byte long.

They were executed on a AWS EC2 [r7i.8xlarge](https://aws.amazon.com/ec2/instance-types/#Memory_Optimized) instance:

- **Processor**: 4th Generation Intel Xeon
- **vCPUs**: 32
- **Memory**: 256 GB DDR5
- **Cost**: ~2 USD/hr

All measurements are on a single thread. A much cheaper instance type could be used, but for benchmarking a DB of size $2^{25}$ elements, the DB encoding is quite memory-intensive. Raw results are published [here](https://docs.google.com/spreadsheets/d/1aWtgHQB3GE7rmz0DwWZLO2zrvnvD1WuNbzSyhygye_M/edit?usp=sharing).

Each section has the result for both single and multiple element (or batch) benchmarks:

- **Single Element Request**: Executes a request for a single 32-byte record.
- **Batch Request**: Executes a request of $n-1$ elements for a database of size $2^n$. This is tied to LeanIMTs being binary trees, so we could need up to $n$ siblings and the root to construct the merkle proofs.

**Database Size** is expressed in amount of elements. To keep in mind:

- **$2^{13}$** = 8,192 elements (0.25 MB)
- **$2^{17}$** = 131,072 elements (4 MB)
- **$2^{21}$** = 2,097,152 elements (64 MB)
- **$2^{25}$** = 33,554,432 elements (1 GB)

### Computational

This table displays the execution times of each step of the PIR request.

| Database Size | Setup (ms) | Encode DB (s) | Query (ms) | Answer (s) | Extract (µs) |
| :------------ | :--------- | :------------ | :--------- | :--------- | :----------- |
| **Single**    |            |               |            |            |              |
| $2^{13}$      | 47.185     | 0.038145      | 0.425      | 0.16466    | 24.132       |
| $2^{17}$      | 47.559     | 0.76478       | 0.424      | 0.30939    | 27.503       |
| $2^{21}$      | 47.498     | 15.105        | 0.426      | 1.1226     | 24.803       |
| $2^{25}$      | 47.018     | 278.51        | 0.429      | 9.567      | 29.909       |
| **Batch**     |            |               |            |            |              |
| $2^{13}$      | 49.96      | 2.0136        | 10.299     | 4.8099     | 148.41       |
| $2^{17}$      | 56.888     | 4.822         | 12.179     | 6.0517     | 256.96       |
| $2^{21}$      | 57.191     | 52.777        | 17.339     | 12.544     | 252.55       |
| $2^{25}$      | 56.39      | 1220.73       | 68.88      | 85.54787   | 259          |

**Client Side**

Client side operations (`setup`, `query_generation`, `answer_extraction`) are quite performant on both single and batch requests. Extraction times are sub-ms, the setup is relatively constant with the worst case being 57 ms, and the query can get up to 68 ms on batch requests but is constant on .42 ms for single element ones.

**Server Side**

The server side operations take the heavy burden. Database encoding times grow significantly with the database size, becoming a real issue for frequently updated databases if we're dealing with large batches on big databases.

For single-requests, it could take up to 4.5 minutes to encode a database of 33M elements. For batch requests, 20 minutes, but keep in mind that it is heavily impacted by the large batch of 20 elements, since Respire uses [Cuckoo Hashing](https://cs.stanford.edu/~rishig/courses/ref/l13a.pdf) to allow batch requests, larger batches require more redundancies, so more processing. Smaller batches could have much better results.

Generating the encrypted answer is relatively acceptable, being the worst cases 9.5 s for single requests and 85 s for batch requests.

### Communication

This table displays the sizes of the transmitted elements between client and server.

| Database Size | Public-Params Size (MB) | Query Size (KB) | Answer Size (KB) |
| :------------ | :---------------------- | :-------------- | :--------------- |
| **Single**    |                         |                 |                  |
| $2^{13}$      | 11.17                   | 0.91            | 3.02             |
| $2^{17}$      | 11.17                   | 1.89            | 3.01             |
| $2^{21}$      | 11.17                   | 5.41            | 3.03             |
| $2^{25}$      | 11.17                   | 19.05           | 3.02             |
| **Batch**     |                         |                 |                  |
| $2^{13}$      | 11.33                   | 23.49           | 12.95            |
| $2^{17}$      | 12.19                   | 35.27           | 12.94            |
| $2^{21}$      | 12.19                   | 96.63           | 12.97            |
| $2^{25}$      | 12.19                   | 753.59          | 14.94            |

**Public Parameters**: ~12 MB but just have to be transmitted once.

**Query**: Low for single queries, 0.75 MB for batch of 24 elements.

**Answer**: Constant 3 KB for single queries and max of 15 KB for batch queries.

### Roundtrip

Below is a table displaying the total roundtrip times with and without the client public parameters generation and the database encoding, which can be skipped if the database hasn't been updated.

| Database Size | Roundtrip (s) | Roundtrip + Setup + Encode (s) |
| :------------ | ------------: | -----------------------------: |
| **Single**    |               |                                |
| $2^{13}$      |        0.1651 |                         0.2504 |
| $2^{17}$      |        0.3098 |                         1.1222 |
| $2^{21}$      |        1.1230 |                        16.2755 |
| $2^{25}$      |        9.5674 |                       288.1244 |
| **Batch**     |               |                                |
| $2^{13}$      |        4.8202 |                         6.8838 |
| $2^{17}$      |        6.0639 |                        10.9428 |
| $2^{21}$      |       12.5613 |                        65.3955 |
| $2^{25}$      |       85.6168 |                      1306.4031 |

This table can give us a clear view of the overhead of implementing PIR on top of current data retrieval operations.

## Challenges

### Dynamic State

Benchmark results show that database encoding takes significant time and grows rapidly for large datasets. For dynamic data, whether growing Semaphore groups or Ethereum's state, continuously re-encoding a multi-gigabyte database for PIR is impractical.

#### Possible Solution: Periodic Snapshots

In this approach, the server captures the database state at defined intervals. The interval length will depend on the amount of resources willing to be spent on computation and the speed at which the database is updated, and the data retrieved will always be at least as old as the `db_encoding` time.

The snapshot's root hash can be attested on-chain so clients can verify integrity.

For periodic balance checks or group membership proofs a delay of a few minutes won't interfere. For voting applications, one could just limit the registrations to vote up to a time and this wouldn't be an issue at all.

But this solution does not contemplate real-time private queries for frequently changing datasets. A possible fallback for this can be replacing PIR with a TEE-based relayer.

### Scalability

Merkle trees with more than $2^{20}$ elements become difficult to manage. Applying PIR to the entire dataset is not possible, so combining this with merkle-forests or focusing on high-value subsets (e.g., EOA balances, contract storages) is necessary.

> ℹ️ There are proposals that already suggest Ethereum nodes will move towards this [partial statelessness](https://ethresear.ch/t/a-local-node-favoring-delta-to-the-scaling-roadmap/22368) paradigm.

### Server-Side Computational Load

PIR servers require significant computational resources, which will add costs to the implementors. Incentives might need to be set in place.

### Integrations

End-user applications have to integrate PIR. This comes with an extra cost since there are not a lot of implementations out there and none with JavaScript/TypeScript or WASM binding libs.

## Alternative Solutions

### Trusted Execution Environments

A Trusted Execution Environment is a secure and isolated environment that runs alongside the main operating system on a machine. TEEs are currently being explored for [Private Proof Delegation](https://pse.dev/en/blog/tee-based-ppd). I highly recommend reading the PPD report, since it details the trust assumptions involved in dealing with them.

TEEs can be used as secure enclaves. A secure enclave processes user queries, forwards them to backend nodes, and returns responses without exposing the query content to the relay operator.

### Privacy Preserving Routing

Network-level privacy is also available through Tor and [mixing networks](https://en.wikipedia.org/wiki/Mix_network).

- [Tor](https://spec.torproject.org/intro/index.html) is a distributed overlay network designed to anonymize **low-latency** TCP-based applications such as web browsing, secure shell, and instant messaging.

- Mixing Networks are routing protocols that create hard-to-trace communications using a chain of proxy servers. [Nym](https://nym.com/docs/network), for instance, packetises and mixes together IP traffic from many users inside the Mixnet.

Note that this only protects against IP-based tracking but does not hide the query content itself.

### RPC Rotation

Wallets could rotate queries across multiple RPC providers, ensuring no single provider sees the user's full query history. This distributes the data and makes it harder for any one entity to profile the user.

Each provider would still learn about the specific queries sent to them, and if providers collude, they could reconstruct the user's activity. Adding to this collution risk, there aren't that many reliable RPC providers out there, less of them that don't share your data.

This is one of the easiest solutions to implement, but it does not hide the query content and the user's IP, just makes it a bit harder to deanonymize.

The equivalent solution to the private Merkle proof generation is to store the tree in multiple servers, making it possible to retrieve different IDs from different servers.

### Light Clients and Portal Network

This is only a path for Ethereum State Reads.

Light clients like [Helios](https://github.com/a16z/helios) and decentralized data networks like the [Portal Network](https://ethportal.net/overview) aim to reduce reliance on centralized RPC providers.

- **Light clients** should be able to request specific state proofs from peers, but implementing peer-to-peer networking for light clients can be a difficult task, and they currently rely on centralized RPC providers.
- **Portal network** distributes data queries across multiple nodes, but comes with high latency costs.

This will decentralize data access and reduce the risk of centralized logging, but individual peers still learn about the queries they serve.

## Ethereum Privacy Roadmap

There have been some roadmap proposals around improving Ethereum L1 privacy:

- [pcaversaccio's Roadmap](https://hackmd.io/@pcaversaccio/ethereum-privacy-the-road-to-self-sovereignty)
- [Vitalik's Roadmap](https://ethereum-magicians.org/t/a-maximally-simple-l1-privacy-roadmap/23459)

Enhancing privacy is a critical priority for Ethereum's ecosystem. The solutions outlined in this writeup can reduce metadata leakage and provide network-level protections, giving users control over their data.

One of the most immediate reasons for taking this direction is security, [data leaks](https://www.coinbase.com/blog/protecting-our-customers-standing-up-to-extortionists) and bad practices have already proven to be [dangerous](https://www.france24.com/en/live-news/20250527-france-foils-new-crypto-kidnapping-plot-arrests-over-20-source). In the mid term, proofs of inclusions could be necessary to [vote in an election](https://docs.semaphore.pse.dev/V2/use-cases/private-voting), and you would disclose your identity when generating them. As adoption increases, the right to privacy should be prioritized.

## Conclusion

Privacy is essential for Ethereum and PIR offers a path for private reads in and around it, hiding not just who you are but what you look up. But still, practical deployments face some frictions.

Re-encoding large trees for every change is too expensive, so the data may be stale, depending on the cadence of periodic snapshots. Deterministic trees such as LeanIMT let clients compute indices on their own, but arbitrary tries still need either key-based PIR or a simple 2PC for index lookup, both of which add overhead.

The computation burden is concentrated on the servers, so RPC providers or dedicated operators must be incentivized through fees or other rewards. Wallets and dApps need accessible WASM libraries to integrate PIR. Until that is available, users can use alternatives such as rotating RPC endpoints, using mixnets, or TEE-based relayers.

If we're going towards a fully private Ethereum, a possible roadmap for data access privacy could be:

- **Near term**: Only focus on network level anonymity with Tor, mixnets and rotating RPCs.
- **Mid term**: Implement and use TEE-based relayers. If light-clients are also used, it would enable confidential verifications and eliminate provider trust.
- **Long term**: With PIR advancements, work on making it easily adoptable by wallets and DApps.

## Resources

- [A Maximally Simple L1 Privacy Roadmap](https://ethereum-magicians.org/t/a-maximally-simple-l1-privacy-roadmap/23459)
- [Call Me By My Name: Simple, Practical Private Information Retrieval for Keyword Queries](https://eprint.iacr.org/2024/092)
- [Ethereum Privacy: The Road to Self-Sovereignty](https://hackmd.io/@pcaversaccio/ethereum-privacy-the-road-to-self-sovereignty)
- [How to Raise the Gas Limit, Part 1: State Growth](https://www.paradigm.xyz/2024/03/how-to-raise-the-gas-limit-1)
- [Private Information Retrieval and Its Applications: An Introduction, Open Problems, Future Directions](https://arxiv.org/abs/2304.14397)
- [Respire: Single-Server Private Information Retrieval with Sublinear Online Time](https://eprint.iacr.org/2024/1165)
- [Scaling Semaphore](https://hackmd.io/@brech1/scale-semaphore)
- [Semaphore Documentation](https://docs.semaphore.pse.dev/)
- [TEE based private proof delegation](https://pse.dev/en/blog/tee-based-ppd)
- [TreePIR: Sublinear-Time and Polylog-Bandwidth Private Information Retrieval from DDH](https://eprint.iacr.org/2023/204)
- [(WIP) A validation on Valid-Only Partial Statelessness](https://hackmd.io/_wVNey49QTmbd0Nm9lrU8A)
- [Worldcoin - A New Identity and Financial Network](https://whitepaper.world.org/)
