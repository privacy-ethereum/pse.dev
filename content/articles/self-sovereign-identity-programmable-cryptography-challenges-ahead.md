---
authors: ["0xZoey"]
title: "Self-Sovereign Identity & Programmable Cryptography: Challenges Ahead"
image: "/articles/self-sovereign-identity-programmable-cryptography-challenges-ahead/self-sovereign-identity-programmable-cryptography-challenges-ahead-cover.webp"
tldr: "This post was written by [0xZoey](https://twitter.com/0xZoey), with contributions from Chance."
date: "2025-01-23"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/zRM7qQSt_igfoSxdSa0Pts9MFdAoD96DD3m43bPQJT8"
tags:
  [
    "self-sovereign identity",
    "ssi",
    "privacy",
    "cryptography",
    "zero-knowledge proofs",
    "verifiable credentials",
    "digital identity",
    "identity",
    "standards",
    "ethereum",
  ]
projects: ["zk-id"]
---

## Introduction

Self-Sovereign Identity (SSI) and its implementation through decentralized ledgers represents one of blockchain technology's most promising applications, particularly within the Ethereum ecosystem. While SSI adoption faces both technical and social challenges, this article focuses specifically on the advancement of privacy-preserving cryptographic primitives essential to its implementation.

Similar to decentralization, the fulfillment of fundamental “SSI” properties by current stacks currently exists on a wide spectrum. It is not uncommon for identity stacks to be agnostic to the choice of a digital wallet or verifiable data registry (distributed ledger), however, the interactions between information query, storage, and retrieval are often opaque. The flexibility and lack of oversight on how each stack is used in production and real-world applications means that some of these properties are lost in implementation, making understanding the technical nuance of SSI all the more critical.

![](/articles/self-sovereign-identity-programmable-cryptography-challenges-ahead/gtJT_j23v1kndU--QGd5t.webp)

Through extensive ecosystem consultation and research conducted by the zkID team at PSE over the past year, this article aims to contribute to the broader dialogue on SSI development. Enhanced industry collaboration can accelerate progress toward a unified vision of decentralized digital identity.

## What is Self-Sovereign Identity (SSI)?

Self-sovereign Identity is more than a technological concept - it's a philosophical reimagining of personal digital autonomy. Unlike traditional identity systems where third parties control and validate your personal information, the idea empowers individuals through:

- **Protection**: Utilizing advanced cryptographic techniques to protect personal information from unauthorized access or manipulation
- **Selective Disclosure**: The ability to selectively disclose or choose exactly what data to share in any given interaction
- **Portability**: The ability to move identity credentials across different platforms without losing reputation or data, avoiding vendor lock-in
- **Interoperability**: Create and adhere to a unified identity standard that works seamlessly across various systems and jurisdictions

We highlight only a few [fundamental properties of SSI](https://ieeexplore.ieee.org/document/8776589) here most relevant to cryptography, but there are many more, each falling into foundational, security, controllability, flexibility, and sustainability categories and further subdivided into defined criteria. In our initial research, we attempted to evaluate stacks based on a standard [framework](https://www.notion.so/Evaluation-Framework-for-SSI-Solutions-8eceb793a5b442cb8da65acc3c337d5c?pvs=21), using these fundamental properties, in addition to [Digital Public Good Alliance’s Criteria](https://www.digitalpublicgoods.net/submission-guide), [Decentralized Identity Foundation’s](https://identity.foundation/) standards, [OpenSource Observer](https://www.opensource.observer/) Github Metrics, and an internal assessment of the cryptographic primitives used. The framework and the result of our research can be found [here](https://www.notion.so/pse-team/2e1e89e5192e409cacbfe3ea115baff4?v=92680356554a42cb981f41edd4a71820).

![](/articles/self-sovereign-identity-programmable-cryptography-challenges-ahead/3wiWgZTDjpVYH-NcanezK.webp)

![](/articles/self-sovereign-identity-programmable-cryptography-challenges-ahead/kDZIiTNGTNAL-uH8qaOF5.webp)

The use of digital signatures is prevalent across digital identities, but the use of [programmable cryptography](https://0xparc.org/blog/programmable-cryptography-1) is severely underutilized. Several standard bodies are exploring Zero-Knowledge Proofs (ZKPs) through various working groups including:

- [NIST](https://csrc.nist.gov/projects/pec/zkproof)
- [W3C](https://www.w3.org/TR/vc-imp-guide/#zero-knowledge-proofs)
- [Decentralized Identity Foundation (DIF)](https://identity.foundation/)
- [Crypto Forum Research Group (CFRG) of the IETF](https://datatracker.ietf.org/rg/cfrg/documents/)
- [zkProof.org](http://zkproof.org/)

It is worth mentioning that Verifiable Credential and Verifiable Presentation are [agnostic to proof types](https://www.w3.org/TR/vc-data-model-2.0/#proofs-signatures) and can be secured using both digital signatures and zero-knowledge proofs

![Verifiable Credential Proof Example](/articles/self-sovereign-identity-programmable-cryptography-challenges-ahead/KeEf5rlvIwkRNSMphJKoD.webp)

Verifiable Credential Proof Example

Most of the work around ZKPs by standard groups is largely academic, but there are several cryptographic mechanisms [currently used](https://arxiv.org/pdf/2401.08196) for selective disclosure of verifiable credentials. We mention the three main ones here. They fall into two general categories, hashed values or selective disclosure signatures.

- [BBS+ Signature Scheme](https://identity.foundation/bbs-signature/draft-irtf-cfrg-bbs-signatures.html) (Used by MATTR)

  - Enables selective disclosure of subsets of signed messages
  - Not currently compatible with mobile
  - Does not provide onchain verifiability
  - [Diffie-Hellman assumption](https://www.youtube.com/watch?v=QISNNmS8tMU)

- [CL signatures](https://github.com/hyperledger/anoncreds-clsignatures-rs) (Used by AnonCreds/Hyperledger)

  - Predates-circom and the use of circuits
  - Only allows predicated proofs i.e. Proof you are above 18, AND have a driver's license.
  - Restricted by custom proofs
  - Requires interaction with identity holder
  - Computationally intensive
  - Does not provide onchain verifiability
  - Relies on RSA

- [Merkle Trees](https://docs.iden3.io/) (Used by PrivadoID/Iden3)

  - Allows onchain verifiability
  - Capable of client-side proofs
  - Supports ZK Circuits
  - SNARK-based -currently not post-quantum

The availability of these schemes allows selective disclosure of data within verifiable credentials but as demonstrated, each comes with [unique drawbacks, and attributes](https://arxiv.org/pdf/2401.08196). In addition to the traditional “web2” identity there are also multiple projects working on onchain ZKP-enabled attestations, which can potentially provide unlinkable data structures onchain. The recent advancements in programmable cryptography particularly with ZKPs and MPC, provide potential alternative solutions for more robust SSI infrastructure throughout the entire stack from identifiers, secure communication, credentials, and frameworks. We discuss some of the key challenges to overcome for these technologies to be fully utilized.

## Overview: Key Challenges

At Devcon, PSE members convened with identity project leaders and standards organizations to identify critical barriers to SSI adoption. The following section examines each major challenge category, exploring its significance and proposed solutions. We analyze each challenge's fundamental nature, importance to the ecosystem, and the specific technical developments required to address it.

1.  Client-side proving & Performance.
2.  Recursion and composability
3.  Proof of Personhood
4.  Post Quantum
5.  Unlinkability
6.  Usability & UX
7.  Governments and Regulation
8.  Standards and Interoperability

## Client Side Proving & Performance

Client-side proving enables users to generate cryptographic proofs directly on their devices, such as smartphones. It is crucial for digital identity systems because it ensures that sensitive personal information remains completely local, never leaving the device or being exposed to external servers or third-party provers.

The table below demonstrates the state of client-side proving with benchmarks provided by [mopro](https://github.com/zkmopro/mopro/blob/main/README.md#performance).

![](/articles/self-sovereign-identity-programmable-cryptography-challenges-ahead/6XqnETQESzvlG0ZRaMrZm.webp)

For widespread adoption, the performance of client-side proof generation must become efficient enough to run smoothly on the most common mobile hardware used by the target population, for practicality and accessibility. The development of client-side proving technologies faces these current bottlenecks:

- Performance on low-end mobile devices
- Reducing computational complexity
- Minimizing memory consumption
- Lack of published benchmarks and comparisons of proving schemes

Offline, client-side verification will be equally important. The ability for mobile device verification in remote areas with a lack of connectivity is a minimum requirement for state or national-level implementation.

## Post Quantum

Current identity systems are vulnerable to a Post Quantum (PQ) future for several reasons. Many elliptical curve-based digital signature schemes currently in use, like ECDSA, are not PQ proof. With NIST moving the PQ timeline up to 2030, there is an urgent need to develop quantum-resistant cryptographic primitives. It is widely speculated that entities and organizations are already collecting encrypted data for PQ decryption in the future. With that in mind identity data onchain is not practical until we solve [PQ Ethereum](https://ethresear.ch/t/so-you-wanna-post-quantum-ethereum-transaction-signature/21291).  With quantum computing on the horizon, more research must be done on PQ primitives, signature aggregation techniques, and benchmarking.

## Unlinkability

The potential for privacy leaks exist during information query, and retrieval, and by observing public data structures (i.e. DIDs or schemas) on verifiable data registries. Unless all information is stored locally, during an information query you reveal to the server what information was fetched. Malicious parties can also analyze data access patterns to derive information about a user and their data.

To fully represent human identity in all its dimensions, there is a fundamental need for the ability to aggregate identity data across different platforms and accumulate it into a body of reputation. Data provenance must be maintained through aggregation and transfer between accounts, whilst preserving unlinkability properties to protect privacy. An example of this is porting all your data between Twitter to Farcaster without losing social reputation.

Solutions for data provenance of web data with protocols such as [TLSNotary](https://tlsnotary.org/) are close to production, the next steps are to make these protocols compatible with Verifiable Credentials and [integrated with web browsers](https://brave.com/blog/distefano/).

Some other possible explorations include:

- [Oblivious RAM](https://www.youtube.com/watch?v=iGfgngtVLr4) (ORAM)
- [Private Information Retrieval](https://blintzbase.com/posts/pir-and-fhe-from-scratch/) (PIR)
- [Web2 Nullifiers using Verifiable Oblivious Pseudorandom Functions](https://curryrasul.com/blog/web2-nullifiers/) (vOPRF)
- Private onchain [trust registries](http://drive.google.com/drive/home)
- Research on different types of data structures
- Atomic checks of DID-linked resources

## Liveness and Proof of Personhood

In an era of increasing digital impersonation, deepfakes, and sophisticated bot networks, proving that an online identity represents a real, unique human becomes critical. Proof of Personhood (PoP) tackles the challenge of gatekeeping anonymous actions such as voting via [MACI.](https://maci.pse.dev/) Biometric authentication whether it be facial recognition, fingerprints, or iris scanning is increasingly becoming more popular. The shift in trust assumptions to hardware components poses a centralization risk.

A [study](https://ia601600.us.archive.org/35/items/elopio-papers/2024-compressed_to_0-annotated.pdf) between 2019-2022 showed current methods are susceptible to programmatic gaming. It was found that “bots” can be substituted with human puppeteers. [The](https://ia601600.us.archive.org/35/items/elopio-papers/2024-compressed_to_0-annotated.pdf) research [has shown that individuals can be incentivized to surrender their identity for as little as two dollars, highlighting the urgent need for more robust incentive mechanism](https://ia601600.us.archive.org/35/items/elopio-papers/2024-compressed_to_0-annotated.pdf)ms on a social level. The prevention of manipulation of web of trust systems is required not just for Sybil resistance but also for collusion resistance, particularly when it exists off-chain. Some projects have adopted a tiered approach where points are assigned to different levels of authentication.

The use of state-issued RFID-equipped documentation as Proof of Personhood by teams like [Anon Aadhaar](https://github.com/anon-aadhaar/anon-aadhaar), [Openpassport](https://www.openpassport.app/), and [zkPassport](https://zkpassport.id/) are working on client-side verification and supporting signature algorithms used by different states.  Although this is one viable method for PoP, it fails to serve individuals not recognized by any government or state. Another downside of web-of-trust systems is reliance on unique identifiers (nullifiers) to prevent double-spending, there is a non-zero chance that this can be [gamed or manipulated](https://www.youtube.com/watch?v=-mwUQp2qwjk).

## Recursion and Composability

[Recursion](https://www.youtube.com/watch?v=VmYpbFxBdtM) is the ability to prove a proof inside a proof. For example: If Bob can prove he knows Vitalik, Alice can prove she knows Bob, and if Joe knows Alice, Joe can prove he is 2 degrees of separation from Vitalik without revealing the intermediary, Bob. Existing frameworks like Circom and Groth16 currently suffer from recursion challenges.

Efficient recursion will unlock the ability to not only derive data from proofs but the ability to perform computation over the derived knowledge without exposing it to the proof-generating party.  Creating a composable system that is capable of ingesting different data formats whilst allowing recursion will be a massive unlock for how verifiers and holders interact with credentials.

General purpose circuits that can be re-used to prove different types of data means that developers will not have to write custom circuits for each specific piece of identity data.

### **Progcrypto DX**

Developer experience is at the intersection of many key challenges. There are two groups of people, researchers writing proving systems, and engineers building with proving systems.

Researchers tend to implement program constraints directly in Rust. This allows them to write highly optimized code close to their prover implementations. Examples of this include Halo2 and Stwo. Unfortunately such systems are inaccessible to people unfamiliar with the codebase, and encourage poor design principles.

Engineers tend to use abstractions in the form of domain specific languages. By far the most popular language is circom: a 5 year old language with a limited standard library. Other attempts have been made to design languages, but they optimize toward features/abstraction and away from simplicity/runtime agnosticism. This makes them harder to reason about in the context of proofs, harder to adapt to new proving systems, and harder to write alternative compiler implementations.

There is significant room for innovation in the expression of cryptographic programs.

## Standards and Interoperability

![https://xkcd.com/927/](/articles/self-sovereign-identity-programmable-cryptography-challenges-ahead/rsacxwKWrnEcRNoLsgDGZ.webp)

https://xkcd.com/927/

The current digital identity landscape is largely fragmented: there are over 100 DID methods. Interoperability is not just a technical challenge but a fundamental requirement for creating a truly global, inclusive digital identity ecosystem. Some of these issues include:

- **Standardization Gaps**

  - Lack of technical specifications particularly for ZKP-related schemes
  - Inconsistent standards between W3C and OpenID
  - Fragmented Decentralized Identifier (DID) approaches
  - Lack of Cross-Platform Verification solutions

- **Credential Formats**

  - Existence of many incompatible data formats
  - Absence of a universal trust registry
  - Lack of a “unified” identity layer capable of ingesting credential formats for proof generation

Although it may be too early to define standards around programmable cryptography, writing initial technical specifications describing protocols, security assumptions, requirements, and verification procedures can serve as a reference and communication tool for all stakeholders. For those interested in contributing, specifications can be added in [this repo](https://github.com/zkspecs/zkspecs?tab=readme-ov-file); see an example specification [here](https://github.com/zkspecs/zkspecs/blob/specs/anon-aadhaar/specs/anon-aadhaar/specs.md).

## Usability and UX

User experience in SSI is about more than smooth interfaces – it's about creating systems that feel intuitive and respectful of individual agency by effectively managing consent. Vitalik elaborates on desired wallet functions such as Private Key Management for revocation, recovery and guardianship in this [post.](https://vitalik.eth.limo/general/2024/12/03/wallets.html) The issues of recovery and guardianship are non-trivial when it comes to key rotation. There are solutions currently in development with the use of account abstraction and protocols such as [ZK Email](https://prove.email/) are promising.

## Governments and Regulation

Traditional trust systems often rely on centralized government issuers and institutions. The challenge is creating identity systems that are not just technologically robust, but also legally compliant. In complying with [GPDR policies](https://gdpr-info.eu/art-17-gdpr/), in particular the [right to erasure](https://gdpr-info.eu/art-17-gdpr/) we are seeing projects tackle this through less secure, more centralized methods like the use of [validiums](https://ethereum.org/en/developers/docs/scaling/validium/) over other cryptographic primitives available. In particular with the EUID ARF framework, the ambiguity left in the choice of wallet and [Verifiable Data Registry](https://identity.foundation/faq/#what-is-a-verifiable-data-registry) means individual states are at risk of selecting less decentralized options.

When it comes to state-wide adoption, the ease of integration with government services and third-party vendors like banks and healthcare providers becomes an important consideration. Recent [studies](https://www.biometricupdate.com/202402/digital-id-can-boost-gdp-of-implementing-countries-up-to-13-uneca#:~:text=%E2%80%9CAnalysis%20of%20digital%20ID%20Systems,under%20the%20theme%20%E2%80%9CBuilding%20Inclusive) indicated that _“individual countries could unlock economic value equivalent to between 3 and 13 percent of GDP in 2030 from implementing digital ID programs”._ Aligning economic incentives and establishing appropriate legal frameworks to enable regulated entities will accelerate adoption.

The top-down approach of state-driven SSI adoption may seem like a quick path to adoption, but does pose a centralization risk with credential issuance. Some possible paths of exploration include the use of [MPC](https://mirror.xyz/privacy-scaling-explorations.eth/v_KNOV_NwQwKV0tb81uBS4m-rbs-qJGvCx7WvwP4sDg) for decentralized DID controllers and decentralized issuers.

## Possible Futures

The evolution of self-sovereign identity (SSI) could follow several distinct paths, each shaped by different technological and social forces.

### Government-Led SSI

Governments, particularly smaller nations, become primary advocates for SSI systems in this scenario. This shift would be driven by:

- Recognition of digital identity as critical national infrastructure
- A desire to protect citizens from external existential threats
- A willingness for sovereign control over identity systems driven by democratic or civic movements
- Cross-border identity verification requirements set by international standard bodies like ICAO or EU leading member states change.

On a smaller scale, using SSI for micro-economies can serve as a good testing ground for this potential future, like a university campus or local community.

### Absence of Government-Led SSI

Governments and established issuers have little incentive to push for SSI infrastructure because they are already the source of trusted issuance. In this scenario, a path towards [self-attestation](https://hackmd.io/@wFJY6cGcRfmvPHiQ5VYP6w/BJjh3X2JJl) seems most probable, where users create their own proofs and self-issue credentials before presenting them to the verifier. The assumption here is that these self-attestations become an acceptable format for verification by third parties without communication with issuers.

### Technology Monopolies Dominate

Without proper technological safeguards, major technology companies could consolidate their control over digital identity through:

- Extensive data collection and correlation
- Widespread third-party integration networks
- Single sign-on authentication mechanisms.

This is a very present future as it is already evident that technology companies are creating inescapable dependencies.

A more distributed approach could emerge through social graph-based identity systems, characterized by:

- Localized trust networks
- Reputation scoring
- Community-based attestation mechanisms

While this approach offers enhanced privacy, its effectiveness may be limited to smaller communities, and corrupt actors could compromise trust networks. This is one less probable future as social graphs are localized and fragmented. Protocols like [Openrank](https://docs.openrank.com/) could serve as a peer-to-peer reputation system using [EigenTrust](https://nlp.stanford.edu/pubs/eigentrust.pdf) if capable of being private; the difficulty in implementation will then lie with the nuance in the context of trust between parties.  One high potential use case for social graphs is bootstrapping decentralized issuance, where credentials are issued based on verified reputation using MPC.

### Global Registry

There is a need for a global identity registry to provide the largest anonymity set possible. Currently, there is a lack of a credibly neutral onchain registry capable of ensuring authentication across multiple chains. ENS’s future Namechain is a possible solution for a public version of this, with blockspace reserved for identity-specific use cases, and the ability to attach and detach from parent domains and subdomains. This loosely replicates the revocation and persistence characteristics needed for onchain identity attestation. PSE is currently [exploring](https://curryrasul.com/blog/web2-nullifiers/) possible solutions using vORPF to generate nullifiers for Web2 identities to serve as a global registry. Rarimo is also currently working on a [zk registry.](https://docs.rarimo.com/zk-registry/)

As of now, only DID and schemas are posted onchain. Identity data onchain is not a practical path forward until we shift to the use of post-quantum primitives.  Identity data is not currently safe onchain as entities may already collect encrypted data for decryption in a PQ future.  Supposing we solve PQ and unlinkable data structures, there lies a possible future for identity data to exist on a data availability layer, enabling the properties of persistence and access.

## Conclusion

Human identity is multifaceted and composed of many dimensions in real life. Replicating similar data structures in digital form is equally, if not more complex. The way we preserve privacy for human identity can essentially be deconstructed to how we interact with data itself, a matter prevalent beyond digital identity.

Some tangible actions the applied cryptography community can do are:

1.  Write technical specifications
2.  Publish Performance benchmarks
3.  Research private data structures for trust registries
4.  Optimize existing tools for client-side proving and improve performance and memory usage
5.  Educate Governments and institutions on the availability of cryptography primitives to support their goals
6.  Establish cross-industry working groups for standardization and greater collaboration

We hope participants found the workshop and roundtable as insightful and engaging as we did! If you’re interested in joining future events or exploring opportunities to collaborate, we’d love to hear from you—feel free to [reach out!](https://discord.com/channels/943612659163602974/955585525081837628)
