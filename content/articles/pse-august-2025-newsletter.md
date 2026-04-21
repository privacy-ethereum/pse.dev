---
authors: ["PSE Comms Team"]
title: "PSE August 2025 newsletter"
image: "/articles/pse-aug-2025/cover.webp"
tldr: "Check out what PSE teams have been focused last month, July 2025!"
date: "2025-08-08"
tags:
  [
    "zero-knowledge",
    "cryptography",
    "client-side-proving",
    "fully-homomorphic-encryption",
    "decentralized-identity",
    "zk-governance",
    "privacy",
    "TLSNotary",
    "MACI",
    "Semaphore",
    "ZK-Kit",
    "zkid",
    "PlasmaFold",
    "vOPRF",
    "mpc",
    "pod2",
    "mopro",
    "research",
    "development",
  ]
projects:
  [
    "client-side-proving",
    "post-quantum-cryptography",
    "private-proof-delegation",
    "plasmafold",
    "io",
    "voprf",
    "tlsn",
    "maci",
    "zk-kit",
    "mpc-framework",
    "mopro",
    "pod2",
    "zkid",
    "semaphore",
  ]
---

Welcome to the August edition of the PSE newsletter! Last month we saw steady progress across research, development, and bridging efforts, with new protocols, performance optimizations, and ecosystem collaborations taking shape. Here’s a look at what each team has been up to.

## 🧪 Research Highlights

### [Client-Side Proving](https://pse.dev/en/projects/client-side-proving)

In July, we continued steady progress on our client-side proving benchmarks according to our roadmap. We integrated benchmark code for SHA-256 circuits in RIS0 and Jolt zkVMs, as well as World’s ProveKit , building upon previous work initiated for zkID. Additionally, we developed a CI workflow to run these benchmarks in parallel, improving our benchmarking efficiency. As the Ceno zkVM (GKR+WHIR) lacked a complete SHA-256 circuit, we developed one, which will be included in benchmarks once integrated into the Ceno repository. These efforts are crucial preparations for our upcoming Client-Side Proving Quarterly Report, aimed at providing comprehensive benchmark data to inform the broader community.

We have also begun evaluating promising client-side proving systems such as HyperPlonk-WHIR and SuperSpartan-WHIR. Our initial assessments will help determine which of these proving systems offer superior performance for mobile applications, advancing our objective of optimizing client-side proving.

### [Post-Quantum Cryptography](https://pse.dev/en/projects/post-quantum-cryptography)

We have been collaborating with FairMath and OpenFHE to refine and define the application and use case we are focusing on. Our main goal is to address the problem of privacy in decentralized finance (DeFi) by enabling composable private states without relying on a central trust anchor. A key aspect of this is ensuring that contract state remains encrypted while still supporting native computation over that state, which is made possible through fully homomorphic encryption (FHE). This sets the research agenda for building a truly private, verifiable, and scalable FHE-enabled virtual machine (FHEVM), while delivering immediate, application-specific privacy layers in the near term. By eliminating the risks associated with a single point of data and avoiding the use of a global key, we ensure that privacy is maintained across different DeFi protocols.

### [PlasmaFold](https://pse.dev/projects/plasma-fold)

We released our paper in mid-July [PlasmaFold: An Efficient and Scalable Layer 2 with Client-Side Proving](https://eprint.iacr.org/2025/1300). We were thrilled by the reception it got and received some great feedbacks from different teams and people in the space. PlasmaFold demonstrated how folding schemes helps to run complex proving jobs with a realistic proving speed and within resource-constrained environments.

### [Indistinguishability Obfuscation (iO)](https://pse.dev/en/projects/machina-io)

We built and implemented a public lookup evaluation technique on BGG+ encodings. This enables more efficient arithmetic and non-linear computation using the encodings of public data. We will publish a paper about the technique and its benchmark results!

## ⚙️ Development Highlights

### [Verifiable OPRF (vOPRF)](https://pse.dev/en/projects/voprf)

We built the circuits necessary for the client-side proving part, and created the initial skeleton for client-server workflow. This demonstrates the concepts and gives us benchmarks of the performance. Next we will harden the protocol to [optionally] handle multiple servers that together compute the nullifier, and apply the protocol to specific use cases.

### [TLSNotary](https://pse.dev/en/projects/tlsn)

TLSNotary is marching steadily toward a production-ready 1.0 release, entering a new phase focused on modularity and ease of integration. A lean, plugin-based SDK is in development to reduce maintenance overhead while supporting a wide range of use cases. In parallel, a minimal rewrite of the browser extension is underway, prioritizing user privacy, application-specific plugins, and a lightweight UI designed as a reusable component.

Recent engineering work includes refactoring core components to support more efficient authentication modes and to make the proof/verify logic reusable across contexts. WASM performance is being benchmarked and optimized, and a direct browser-to-verifier demo is now functional—eliminating the need for a notary server and paving the way for more trust-minimized deployments.

### [MACI](https://pse.dev/en/projects/maci)

MACI is focussing around two key goals over the next month: 1) mapping the private governance space and solidifying a renewed strategy, 2) continuing MACI V4 research, with a core goal of decentralising the coordinator. At the same time, an important priority will be maintaining and support existing integrations. We have also started benchmarking our existing circom circuits against the same circuits written in Noir to assess whether V4 should be written in Noir.

### [zk-kit](https://pse.dev/en/projects/zk-kit)

We fixed a bug in the BinaryMerkleRoot circom circuit and publish a blogpost explaining the issue. We also released a new Community Guide, migrated all repositories to the new ZK-Kit GitHub org, and began a website redesign. Next, we are focused on finding more contributors and maintainers to make ZK-Kit fully community-owned.

### [MPC Framework](https://pse.dev/en/projects/mpc-framework)

We’re been working on speaking and producing public material. We released a sassy YouTube video about Ballpark, and Andrew had multiple speaking engagements. Meanwhile, we’ve also begun work on private auctions.

### [Mopro](https://pse.dev/en/projects/mopro)

Over the past month, we worked on building and releasing Semaphore mobile packages for Swift, Kotlin, React Native, and Flutter. This now enables developers to build Semaphore-based apps not only for the web, but also seamlessly on iOS and Android. It’s exciting to see the ecosystem becoming truly cross-platform!

We also contributed to publishing two blog posts—one summarizing our latest findings from GPU prover research, and another recapping our experience at ETHGlobal Cannes. You can read both at [zkmopro.org/blog](https://zkmopro.org/blog).

### [POD2](https://pse.dev/en/projects/pod2)

We have been building two applications on top of pod2: a document publishing system with comments and upvotes and a frog game 🐸

We have worked on optimizing the circuits and improving the developer experience based on the feedback from the app builders.

We have introduced a new operation to derive public keys from private keys that can be used to build nullifiers.

We have started working on the on-chain verification of pods.

### [zkID](https://pse.dev/en/projects/zk-id)

We continue the work on the zkp Wallet Unit. We completed the circuits over the P256 base field, including the first right-field circom implementation of ECDSA verification over P256. We are making progress towards compiling this for a Spartan + Hyrax backend over the T256 curve tower, and modifying the proof system to use re-randomisable commitments. This will yield a largely preprocessed and efficient prover.

Other significant strides across several key initiatives include:

- Completing the 1st draft of the zkID roadmap, outlining our upcoming milestones and long-term vision
- Completing research into OFAC compliance considerations for zk-KYC
- Launched early outreach for zkID Day at Devconnect - [express interest here](https://docs.google.com/forms/d/1fQyL-2PaXx0d5-ieiJkwI5Ypl1p5VAbBA2i0AIrSlH8/edit)
- Collected valuable community feedback on zkPDF to guide future improvements
- Integrating the Spartan Hydrax Backend

### [Semaphore](https://pse.dev/en/projects/semaphore)

We updated the Semaphore circuit, proof library and smart contracts after fixing a critical bug in the ZK-Kit BinaryMerkleRoot Circom circuit. Following this, we ran an internal Trusted Setup Ceremony and released a new beta version with the fix included. The public Semaphore Trusted Setup Ceremony is now live, and you're inviting contributions here: [https://ceremony.pse.dev/projects/Semaphore Binary Merkle Root Fix](https://ceremony.pse.dev/projects/Semaphore%20Binary%20Merkle%20Root%20Fix)

Next, you plan to release a new Semaphore version once the public ceremony concludes. We are also preparing an EthResearch post on LeanIMT and beginning research into how Semaphore can be used to address challenges in the Private Governance space.
