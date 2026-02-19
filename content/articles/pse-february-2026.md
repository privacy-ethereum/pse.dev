---
authors: ["PSE Team"]
title: "PSE February 2026 Newsletter"
image: "/articles/pse-february-2026/cover.webp"
tldr: "Updates from Private Writes, Private Proving, and Private Reads teams covering research progress, new releases, and ecosystem collaborations."
date: "2026-02-19"
tags: ["newsletter"]
---

Welcome to the February edition of the PSE newsletter! Here's what our teams have been working on.

---

## 🏗️ Private Writes

### Private Transactions Research

We published an ethresearch post summarizing our findings when trying to find an alternative wormhole construction. We will also dedicate this month to hardening sonobe, in order to let protocols using our library able to deploy to production.

### Private Transfer Engineering

We spent December and early January conducting user research and an initial exploration into zkWormholes. The wormholes exploration was dropped due to implementation tractability, but the research team is continuing to explore ideas for an updated proposal. We spoke with 35 teams in space and uncovered the technical problems they were facing. We built these findings into our 6 month roadmap which has now been published:

Part 1 of the roadmap is to publish a state of private transfers report, which analyses and benchmarks different private transfer protocols. We'll also publish our benchmarks in a live dashboard.

Part 2 of the roadmap focusses on exploring L2 changes: 1) Prototyping & benchmarking new precompiles that enable application builders on L2s. 2) Speccing a native feature such as a shielded pool, in order to explore native asset privacy, and also shared features that could be used by many dapps.

We have now started executing on gathering benchmarks for the state of private transfers report, and prototyping L2 precompiles for cheaper private transfer protocols.

### IPTF (Institutional Privacy Task Force)

December focused on Q1 planning and preparation, with the team taking time off for holidays. January shifted to execution: we delivered a hands-on workshop for a major bank in Singapore, gave talks in Hong Kong, and advanced conversations with several institutions on tokenization and stablecoins. We shipped our first Private Bonds PoC with an accompanying [write-up](https://iptf.ethereum.org/building-private-bonds-on-ethereum/). The [iptf-map](https://github.com/ethereum/iptf-map) received 8 new patterns, 12 use case stubs, and infra improvements. Published three articles on [iptf.ethereum.org](https://iptf.ethereum.org/).

---

## 🪢 Private Proving

### iO

- We have developed GPU implementations of polynomial arithmetic and polynomial matrix operations that are useful for lattice-based cryptography. The code is available in our mxx repository. In particular, multiplying polynomial matrices on a GPU is about 10× faster than on a CPU.
- We succeeded in reducing the circuit depth of modulo-q multiplication over BGG+ encodings from more than 150 to as low as 5 per multiplication. However, this low-depth implementation requires a large number of lookup tables, so we still cannot practically evaluate such circuits over real BGG+ encodings. We are currently working on improving both circuit efficiency and lookup table evaluation techniques for BGG+ encodings.
- We have begun exploring more active collaborations with academic researchers. If you are a researcher in lattice-based cryptography and are interested in our work, please let us know.

### Mopro

We've upgraded Mopro to improve the developer experience. This includes merging `wasm-bindgen` into `mopro-ffi` and creating Noir provers for Swift, Kotlin, React Native, and Flutter. For Circom, we've built provers using `circom-witnesscalc` and `arkworks`, which supports collaborations on projects focused on private proving. Additionally, we've added mobile SDK documentation for Semaphore to boost its adoption in the mobile space.

Moreover, we finalized a write-up exploring the potential of client-side GPUs and how it aligns with Ethereum Foundation's long-term quantum strategy. To coordinate these efforts, we've introduced a PSE roadmap for GPU acceleration, aimed at gathering the community to build a strong foundation for defending people's privacy in everyday life.

### TLSNotary

We released TLSNotary Alpha.14, delivering a cleaner, faster, and more reliable experience. This update improves communication between the Prover and Verifier, enhances error reporting, and introduces new cryptographic features. We also launched a simplified browser extension that is more efficient and easier to use, with over half the codebase removed and a smoother user experience. You can try it out at [https://demo.tlsnotary.org](https://demo.tlsnotary.org/).

Beyond technical improvements, we've expanded our outreach with new blog posts at https://tlsnotary.org/blog. We invite you to join our next Office Hour to ask any TLSNotary questions and connect with the team: [Office Hours Calendar](https://calendar.google.com/calendar/u/0/embed?src=c_6fe3f25063cc550e019090bb40d3d60ad5f81b3570c5a2d62c2cda96e09ff24d@group.calendar.google.com).

### zkID

We made solid progress across OpenAC and revocation efforts within zkID. We created the 2026 roadmap and evaluated rewriting OpenAC circuits using Bellpepper and Arkworks. Based on this analysis, we decided to continue using Circom and focus on optimizing the existing circuits.

The current Circom implementation was improved, feedback on the OpenAC paper was addressed, and research on the generalized predicates feature was initiated. We also continued work on OpenAC integrations. On the revocation side, we published the blog post ["Revocation in zkID: Merkle Tree-based Approaches"](https://pse.dev/blog/revocation-in-zkid-merkle-tree-based-approaches).

Next, we will focus on implementing generalized predicates, continuing integrations, and publishing a revised version of the OpenAC paper.

### Client-Side Proving

The work on the CSP benchmarks repo focused on expanding coverage of popular hashing circuits, ensuring measurement correctness, and improving the contributor experience. The benchmark suite gained new Keccak-256 benchmarks across multiple stacks (including Binius64, Barretenberg, Circom, RISC Zero, and ProveKit), as well as Poseidon benchmarks for Circom, Plonky2, Barretenberg, Expander, and ProveKit. Several improvements to measurement reliability and reporting were implemented as well. Finally, we have added agent contribution instructions to streamline the automated contributions - feel free to vibe-code additional benchmarks and submit a PR!

On the multilinear post-quantum systems research front, we updated the HyperPlonk-WHIR and Whirlaway codebases to track the latest versions of WHIR to incorporate all the latest performance improvements. After the updates, we [reran our benchmarks](https://hackmd.io/@clientsideproving/whir-based) against the existing baseline. Both systems demonstrated excellent prover performance against the baseline. The next steps are to align them with the 128-bit security level and research ways to reduce the proof sizes before prototyping the EVM verifier.

---

## 🧪 Private Reads

### PIR

We implemented and tested the Plinko scheme on ≥100GB dataset revealing the hint generation phase is intractable (hours, days due to iPRF), but hint generation is paralleizable on GPU, with preliminary benchs indicating 8 minutes hint generation time with 50 GPUs costing <$50 total. Delegating hint generation server-side would necessitate running it inside a TEE to preserve privacy.

We [specc'd and reference-implemented](https://github.com/keewoolee/rms24) the related RMS and Plinko scheme, and [started](https://github.com/igor53627/rms24-rs/tree/main) production-grade implementation of RMS based on this spec.

We established a spec-driven approach to our approach to PIR schemes. Specs and reference implementations prioritize correctness and clean abstractions. Production-grade implementations are then anchored on such specs.

After RMS, we also specc'd and reference-implemented Plinko following the same methodology. Despite the performance issues of Plinko, we still see it viable for large-but-immutable datasets such as Ethereum archival data.

We engaged a grantee to boost our specc'ing spree and take on an additional PIR scheme. FHE-native schemes in particular are of interest.

We sketched an overall multi-engine multi-dataset system design that could potentially give us the flexibility of pairing schemes with different slices of Ethereum data such that the overall performance is UX friendly all while preserving the same privacy had there been only 1 engine serving the entire Ethereum data.

### UBT

We continue the implementation of the end-to-end UBT pipeline in Geth by adding the path that converts MPT state into UBT, then running witness generation and verification using keeper on top of the converted state. We have also started testing UBT conversion on mainnet to serve some usecases such as PIR server.

### Arti

We [kicked off](https://gitlab.torproject.org/tpo/core/arti/-/merge_requests/3600) collaboration with Tor Project with the aim to get Arti Tor client embeddable in browser context. Significant [progress](https://github.com/voltrevo/arti/tree/wasm-arti-client) features a [working prototype](https://github.com/voltrevo/arti/blob/wasm-arti-client/examples/tor-fetch.js), and we're now smoothing the rough edges.

We submitted [PR to integrate Tor-js into ethersjs](https://github.com/ethers-io/ethers.js/pull/5083) so wallets integrating Ethersjs can route RPC calls through Tor with minimal effort. Tor-js was intended as a temporary unblocker for Tor in browser until Arti is ready for browser embedding.
