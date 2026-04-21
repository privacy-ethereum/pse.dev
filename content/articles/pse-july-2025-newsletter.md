---
authors: ["PSE Comms Team"]
title: "PSE July 2025 Newsletter"
image: "/articles/pse-july-2025/cover.webp"
tldr: "A roundup of research and development updates from PSE teams in July 2025, covering client-side proving, post-quantum cryptography, zkID, TLSNotary, MPC, MACI, and more."
date: "2025-07-16"
tags:
  ["zk", "cryptography", "ethereum", "privacy", "scaling", "folding", "voprf"]
projects:
  [
    "client-side-proving",
    "post-quantum-cryptography",
    "zk-id",
    "tlsn",
    "mopro",
    "maci",
    "mpc-framework",
    "semaphore",
    "zk-kit",
    "pod2",
    "voprf",
    "private-proof-delegation",
    "plasma-fold",
    "machina-io",
  ]
---

Here’s a round-up of what PSE teams have been up to this last month!

If you’re interested in the context of future direction of any of these projects, pop into [our Discord](https://pse.dev/discord) and chat with our teams.

## 🧪 Research Highlights

### [Client-Side Proving](https://pse.dev/en/projects/client-side-proving)

We completed benchmarking transparent post-quantum ZKP systems for zkID and published [the results here](https://www.notion.so/July-Newsletter-22ad57e8dd7e80f2a113ef0b51d0e63e?pvs=21). Next, we’re extending these benchmarks to circuits beyond zkID and other popular ZKP systems.

### [Post-Quantum Cryptography](https://pse.dev/en/projects/post-quantum-cryptography)

After reviewing existing FHE schemes, we decided to begin by addressing verifiable FHE (vFHE) in the context of FHEW-like schemes. The team is exploring these more with a focus on extending the Lazer/LaBRADOR API and addressing its current limitations, while also experimenting with Lattirust. Collaboration with OpenFHE and FairMath is ongoing.

We aim to isolate and analyze the bottleneck operations affecting verifiability to inform targeted modifications that would make FHE schemes more vFHE-compatible. In parallel, we plan to either complete the Lazer/LaBRADOR toolchain or pivot to Lattirust, contributing optimizations to enhance its runtime performance.

This investment help us prepare towards a future of performant post-quantum programmable cryptography protocols.

### [Delegated Proving](https://pse.dev/en/projects/private-proof-delegation)

We’re making progress on implementing our FHE-based privacy-preserving design (PPD). Right now, we’re focused on building a constant-depth Number Theoretic Transform (NTT) optimized for FHE ciphertexts, which is a crucial step toward efficient homomorphic operations. Next, we plan to implement a polynomial commitment scheme that works over mixed ciphertext and plaintext values using this constant-depth NTT, moving us closer to more secure and scalable cryptographic protocols.

### [PlasmaFold](https://pse.dev/projects/plasma-fold)

The team attended ETHCC, where they delivered their first PlasmaFold presentation, and also met with the Intmax team. Next steps include submitting the paper to ePrint, expanding communications around the paper and the project, and preparing a formal security proof with the possibility of submitting to a major crypto conference. The team is also beginning to evaluate how to add a privacy layer to the system. Additionally, they are open to collaborations focused on optimizing folding scheme implementations and developing wallets with efficient client-side proving capabilities.

### [Indistinguishability Obfuscation (iO)](https://pse.dev/en/projects/machina-io)

We presented our work at the [Obfuscation Workshop](https://simons.berkeley.edu/talks/sora-suegami-ethereum-foundation-machina-io-2025-06-24) hosted by the Simons Institute and ZuBerlin, and published a new educational [article](https://machina-io.com/posts/unboxing.html) about the iO construction. We also talked about the [importance of iO for Ethereum](https://x.com/backaes/status/1934888306564637003) applications, and started implementing a public lookup evaluation on BGG+ encodings. Next we are researching an efficient PRF evaluation and a private lookup evaluation over BGG+ encodings. We’d love to see applications currently relying on MPC or TEE explore how iO can remove threshold assumptions.

## 🔧 Development Highlights

### [TLSNotary](https://pse.dev/en/projects/tlsn)

This month, we continued our efforts to improve developer experience, enhance stability and performance, and expand market outreach. On the performance side, we built a new benchmarking harness, made various protocol improvements, and began working on a new commitment scheme. For developer experience, we prototyped a new plugin system using WASM to enable easier integration. In outreach, we maintained ongoing conversations with ecosystem players to understand their needs, and presented TLSNotary at Dappcon 2025. Moving forward, we’ll increase focus on the plugin system to simplify platform-independent TLSNotary integration and draft a roadmap for the TLSNotary 1.0 release.

### [MACI](https://pse.dev/en/projects/maci)

This month, we explored integration with Agora’s stack and presented at Aragon’s demo day, receiving positive feedback and clear priorities: improve UX, find ecosystem partners, and finalize coordinator decentralization for production. Research on coordinator decentralization continues, with progress on the MACI v4 proposal ([details](https://www.notion.so/218d57e8dd7e805aa5ddd1839045e238?pvs=21) - open for contribution!). We supported secure voting for SIV’s in-person vote cancellation, helped PriVote integrate MACI v3 under a grant, and completed benchmarking ([costs](https://maci.pse.dev/docs/supported-networks/costs), [networks](https://maci.pse.dev/docs/supported-networks/)). The Aragon integration blog post is finalized.

Next, we’ll improve the Aragon demo UX, finalize v4 research, continue supporting PriVote, scope Gitcoin GG24, automate poll tallying, and publish blog posts on Aragon integration and coordinator service.

### [zk-kit](https://pse.dev/en/projects/zk-kit)

The new ZK-Kit website is live at [zkkit.org](https://zkkit.org/), supporting our goal to make the project fully community-owned! We’ve cleaned up issues, pull requests, and contribution guidelines ([here](https://hackmd.io/@alizk/Skz3ugOT1l)), and completed a blog post on the community exit plan ([read here](https://hackmd.io/@alizk/SyWn4iYtkx)). Next, we’ll finalize the community exit plan with contributors and partners, transfer repos to ZK-Kit’s GitHub organization, publish the blog post, and announce on X. We’re seeking long-term core contributors and partners. If you want to contribute with production-grade libraries for the ZK ecosystem, we’re looking for you!

### [MPC Framework](https://pse.dev/en/projects/mpc-framework)

This month, the team focused on demonstrating the impact of MPC on Ethereum, sharing progress through multiple talks and new features. Presentations were given at [Rust Sydney](https://www.meetup.com/rust-sydney/) (slides [here](https://docs.google.com/presentation/d/1s8aFxecuk1fNDeN2_jIUFY5gpIPACIJto7G1BtTiL8o/edit?slide=id.p#slide=id.p) and rehearsal [here](https://drive.google.com/file/d/14p8ZGNeNbdgTZRMvw2w6al2i00VHNe4b/view?usp=sharing)), EthCC ([recording](https://www.youtube.com/live/uWdUgADLM7Q?t=9s)), and the PSE Retreat (slides [here](https://docs.google.com/presentation/d/1We1hpJMDthP-p6CZuvJD91TN0K-Kr1slm1Jc8HjHC6M/edit?usp=sharing)).

Support for sha256 and other external circuits was added, described in this [blog post](https://mpc.pse.dev/blog/sha256), alongside major performance improvements detailed [here](https://mpc.pse.dev/blog/performance-improvements). The [Ballpark](https://mpc.pse.dev/apps/ballpark) app was launched to showcase the framework’s capabilities. Next steps include another talk at SydJS, developing an MPC Auctions proof of concept with user research, and advancing on-chain MPC tooling and examples.

### [Mopro](https://pse.dev/en/projects/mopro)

ETHGlobal Cannes showcased strong projects built with Mopro, despite challenges around custom circuits and incomplete Noir templates. The top winners included [Mobiscale](https://ethglobal.com/showcase/mobiscale-n9vj6), integrating RISC0 and ML facial recognition on iOS; [Zkipper](https://ethglobal.com/showcase/zkipper-czc3z), combining gnark with Mopro on Android; and [Eyes Proov](https://ethglobal.com/showcase/eyes-proov-at10u), enhancing user experience with product potential. Many teams worked on proof of location, age verification, and wallet proofs, providing valuable feedback. We released a [Circom wallet connect template](https://github.com/moven0831/mopro-wallet-connet-circom), Semaphore packages for Swift, Kotlin, React Native, and Flutter (in progress), plus Metal MSM v2 for GPU acceleration ([details](https://github.com/zkmopro/gpu-acceleration/pull/92)). Next, we’ll fix hackathon issues by updating Noir, building on-chain verifier templates, enabling cross-platform support, integrating gnark, and benchmarking tools like zkVM mobile provers ([Imp1](https://github.com/ingonyama-zk/imp1), [Cairo-M](https://github.com/kkrt-labs/cairo-m)).

### [POD2](https://pse.dev/projects/pod2)

We’ve completed an initial, feature-complete implementation of POD2. This includes zero-knowledge proofs, efficient Schnorr signatures over an elliptic curve built on the quintic extension of Goldilocks for SignedPods, and recursion support for MainPod and generic Pods with serialization/deserialization. 0xPARC interns have begun building around POD2, creating an RSA introduction pod, a Mobile Driving License pod, and a server that issues SignedPods by validating users’ RSA pods linked to GitHub public keys. Next, we’ll fix bugs uncovered through diverse usage, improve ergonomics based on user feedback, and reflect at summer’s end on building POD2 applications and gadgets to guide our next steps.

### [zkID Standards](https://pse.dev/projects/zk-id)

On the ZKP standards front, we recently published the [[PCS IETF draft](https://datatracker.ietf.org/doc/draft-zkproof-polycommit/)](https://datatracker.ietf.org/doc/draft-zkproof-polycommit/) and began collecting feedback on the [[PIOP draft](https://hackmd.io/@janabel/SyAv8S9lgx)](https://hackmd.io/@janabel/SyAv8S9lgx). We’re also continuing our collaboration with the W3C Data Integrity Working Group.

In June, we shipped [[zkPDF](https://pse.dev/blog/zkpdf-unlocking-verifiable-data)](https://pse.dev/blog/zkpdf-unlocking-verifiable-data), enabling verifiable and selective disclosure on PDFs. We're also nearing completion of the second iteration of the zkID ZKP Wallet Unit, now using Spartan and Hyrax backends.

On the education and outreach side, we presented at GDC25, Dappcon, ZuBerlin, and zkSummit ([[watch the talk](https://www.youtube.com/watch?v=LyvqyeSAvL0)](https://www.youtube.com/watch?v=LyvqyeSAvL0)). We also published blog posts covering zkPDF and client-side zkID benchmark results.

Looking ahead, we’re focused on finalizing the ZKP Wallet Unit research paper, delivering the second iteration, and exploring post-quantum (PQ) schemes.

### [Semaphore](https://pse.dev/en/projects/semaphore)

We’ve been in maintenance mode, cleaning up the repo and reviewing PRs. We presented on Semaphore in Noir at NoirHack — watch the [recording](https://youtu.be/vfL7z74jGyU) and see the [slides](https://www.canva.com/design/DAGqgbmhIMw/iJz2c3NCMUko7iA6GfMxKw/edit?utm_content=DAGqgbmhIMw&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton). Next, we’ll focus on governance research exploring Semaphore’s applications in private delegation and multisig, and improve developer experience by refreshing documentation and adding more examples. We’re also exploring collaboration opportunities with Worldcoin around shared research topics like PIR.
