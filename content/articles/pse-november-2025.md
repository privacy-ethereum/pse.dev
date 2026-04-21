---
authors: ["PSE Team"]
title: "PSE November 2025 Newsletter"
image: "/articles/pse-november-2025/cover.webp"
tldr: "A roundup of what PSE teams have been up to and looking ahead to Devconnect"
date: "2025-12-11"
tags: ["newsletter"]
---

Welcome to the November edition of the PSE newsletter! Here’s what our teams have been up to:

---

## 🏗️ Private Writes

### Plasma{Fold/Blind}

We have been working on the construction and implementation of PlasmaBlind, a scalable, cheap and private transaction L2 using client-side proving. Our design relies solely on folding based uniform IVC, which is cheaper than non-uniform PCD, thereby minimizing the cost of privacy.

Progress has also been made in the prototype implementation of WARP, a post-quantum folding scheme based on code theory. We finished the implementation of provers and verifiers and are now benchmarking and optimizing our code. This will enable efficient, private, and post-quantum aggregation on L2.

### IPTF (Institutional Privacy Task Force)

We anonymized our [privacy map](https://github.com/ethereum/iptf-map) in order to make it [open](https://x.com/oskarth/status/1976547751208067342) to the public. We also enhanced it significantly from the original MVP; we now have documented approaches that targets specific use cases, written for different personas (business, technical, legal). This includes things like private broadcasting, private bonds, payments, trade settlement, and more. We welcome contributions from external parties, and have received 5+ PRs from external people already.

In October we also prepared a brief and and held a well-received workshop for a major financial institution to convince them to build on Ethereum. We'll keep doing these deep dives with select institutions, with the goal of providing actionable insights for the ecosystem on blockers, as well as guide them on how to best achieve privacy on Ethereum. We have also talked to many institutions, vendors and ecosystem players.

### Private Governance

Lately, we have been working on a report for the State of Private Voting 2026. We are expecting to deliver this report before mid-November, and will also present the work at Devconnect. The report dives into the details of existing private voting protocols, and analyses them against a set of technical criteria.

At the same time, we have been supporting the Gitcoin Grants 24 round - helping run the voting process by managing tallying and coordinating the overall flow. The results are public now and the funds will be distributed shortly.

We’ve also been collaborating on a private voting delegation initiative alongside Modulo Labs. We plan on releasing a private delegation PoC by the end of the year.

---

## 🪢 Private Proving

### iO

Our paper that proposes lookup table evaluation over key-homomorphic encodings becomes available at https://eprint.iacr.org/2025/1870. However, the benchmarks show that further improvements are necessary to make iO practical. 

We are writing new papers about combination of iO and Ethereum along with remaining bottlenecks toward practical iO.

### Mopro 

We recently wrapped up the React Native bindings for mopro, which now make it possible to run zero-knowledge proof generation smoothly on both iOS and Android. Using the `uniffi-bindgen-react-native` tool, we were able to eliminate hundreds of lines of manual glue code—making the integration process much cleaner and more maintainable for developers working with Circom, Halo2, and Noir backends. In parallel, we’ve also completed cross-platform `Semaphore` bindings across Swift, Kotlin, Flutter, and React Native, enabling seamless interoperability for identity and privacy-preserving apps.

We've been exploring client-side GPU directions that could become the foundation for accelerating not just ZK, but any programmable cryptography - focusing on SIMT optimizations for core primitives and hybrid CPU+GPU strategies. Alongside this, we’ve continued integrating Noir into our stack, updating prebuilt binaries and working with collaborators to make Noir circuits more practical and performant on mobile devices.

### TLSNotary

We delivered our alpha.13 release this month, bringing a cleaner API, BLAKE3 commitments, and performance improvements across the board. We’re also focused on making TLSNotary easier to integrate, including a full sans-IO refactor to cleanly separate protocol logic from transport. In parallel, the WASM component–based SDK and browser extension continue to progress well.

We’re now gearing up for Devconnect, where we’ll be running zkTLS Day and showcasing a fully interactive zkTLS demo.

### zkID Standards

We wrapped up the revocation report with benchmarks and gathered feedback from several teams. On zkID, we improved the witness generator, cutting proving time by 30% and advancing the paper. For zkPDF, we folded SHA-256 circuits in NeutronNova and benchmarked R1CS Circuits size for 10kb sha circuits.

Next, we'll refine the revocation report and present it at zkID and Client-Side Proving Day, finalize the zkPDF write-up for Devconnect, and release the zkID paper, proof of concept, and mobile demo that we'll also present at zkID and Client-Side Proving Day.

### Client-Side Proving

In October, we expanded and standardized SHA‑256 benchmarking across proving systems and zkVMs. We introduced new suites for Circom, Noir, Nexus, and Cairo‑M. [All planned proving systems for the Q3 report](https://docs.google.com/spreadsheets/d/1LFG-icfQf4-3YoxoR4GPdkcbAmD01mLPhiM3x4ufmnU/edit?usp=sharing) now have SHA-256 coverage, and we are ready to add ECDSA benchmarks! We froze all dependencies as of the end of Q3 in preparation for the final benchmark runs.

We improved reliability by tightening CI to collect results only after workflows finish, fail fast on collection issues, and automatically publish comprehensive results on PR merge to EthProofs - be the first to see the deployment preview [here](https://deploy-preview-524--ethproofs.netlify.app/csp-benchmarks)! We now report execution cycles (for zkVMs), the number of circuit constraints, and various other proving system properties.

### Privacy Experience

Devconnect preparations in full swing with several initiatives and events that we're collaborating or supporting with, zkID & client-side proving, zkTLS, research days, Ethereum Privacy stack, a community hub and several others. We will also present the initial draft of our Privacy UX report there. Looking forward to see you all in Argentina!

---

## 🧪 Private Reads

- Started 30+ collaboration groups with various projects inside and outside the Ethereum ecosystem, with **activated** collabs including: **`Tor Project`**, **`Lunascape browser`**, **`dRPC`**, **`Hinkal wallet`**, **`Envio indexer`**, **`cp0x decentralized frontends`**, **`Metri wallet`**, **`EF Stateless`**, **`Blockscout explorer`**, **`Acurast TEE`**.
- [Driving adoption](https://igor53627.github.io/tor-ethereum-ecosystem) of onion routing in the Ethereum ecosystem through internal implementations and external collabs: RPC providers, client nodes, wallets, indexers, [decentralized] frontends, load balancers, and SDKs
- **dRPC collab**: [the first](https://drpc.org/docs/tor) infrastructure RPC provider to expose onion services into their [NodeCore load balancer](https://github.com/drpcorg/nodecore/blob/main/docs/nodecore/07-tor-setup.md) -**without API key, and with support for [uptream Tor services](https://github.com/drpcorg/nodecore/blob/main/docs/nodecore/05-upstream-config.md#tor-onion-upstreams)** such that .onion addresses are accessible from within their infra
- Collab agreement with Tor Project team: technical support for our [onionization efforts](https://hackmd.io/@alizk/H1ibTt70xx) in 4Q25 1Q26, embedded [Arti](https://tpo.pages.torproject.net/core/arti/) mid-term (1H26) in browser environment
- Hinkal collab: completed integration of Tor routing of transactions from Hinkal wallet to .onion RPC node
- Blockscout collab: the [explorer](https://eth.blockscout.com/) is now accessible via [.onion address](http://jcevta2iwkmce7dkytj2hbhr3qm7eidnbqkotpe2jfx7ldp45dyaehad.onion/)
- Design for proving UBT-based state of L1 and kicked off collaboration with Geth/Ziren on provable UBT<>MPT equivalence. Intended for indexers and light clients: smaller UBT roots are advantageous for db-size-sensitive PIR and bandwidth/overhead-sensitive light clients
- [Geth/Reth instances behind .onion service](https://github.com/CPerezz/torpc/pull/2#issuecomment-3491141977), handling `eth_sendRawTx` originating locally (forward to Tor network) or received from behind .onion service (forward to ethp2p), building to Torpc by Carlos
- Spun up and [Nodejs-tested](https://voltrevo.github.io/tor-hazae41/) Snowflake Tor proxy instance for websocket-based access to Tor from wallets/frontends
- Integrate Echalot Tor lib into Viem.js, with Metri wallet being the first willing adopter
- [Investi](https://hackmd.io/@alizk/BJwFha2agl)gated [PIR](https://hackmd.io/@keewoolee/Skvu0BDRle) (private information retrieval) schemes and began early experimentation
- Contributed to Kohaku on [Helios](https://github.com/ethereum/kohaku-commons/pull/19) and provided support and follow-up on [TEE-ORAM](https://hackmd.io/@tkmct/BywaGeY2le) integration