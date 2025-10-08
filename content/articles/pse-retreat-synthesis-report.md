---
authors: ["PSE Team", "Zoey"]
title: "PSE Retreat Synthesis Report"
image: "/articles/pse-retreat-synthesis-report/cover.webp"
tldr: "This report consolidates the findings of the June 2025 PSE retreat, where contributors across research, engineering, and product came together to identify, articulate, and structure the major open problems in privacy on Ethereum's application-layer."
date: "2025-10-08"
canonical: "https://hackmd.io/@xzoey/HyR3Oi2Bxl"
tags: ["retreat", "privacy", "ethereum"]
projects: []
---

# 1. Executive Summary

## 1.1 Overview

This report consolidates the findings of the June 2025 PSE retreat, where contributors across research, engineering, and product came together to identify, articulate, and structure the major open problems in privacy on Ethereum's application-layer. It is not a exaustive list of what we have decided to work on (or not)- simply a synthesis of discussion and observations. We hope this will assist us with prioritising PSE's roadmap moving forward.

## 1.2 Key Outcomes

- Eight core [problem clusters](https://www.notion.so/217d57e8dd7e80a5a37df44841717453?pvs=21) were articulated and explored through deep dives
- A problem [taxonomy](https://docs.google.com/spreadsheets/d/1fvfft-zaSiswxA6PRmw7dfZ4zalhmqdDxfFUyt_nGR0/edit?gid=1257235120#gid=1257235120) structured by 10 sectors and 29 categories
- 240+ [user stories](https://docs.google.com/spreadsheets/d/1fvfft-zaSiswxA6PRmw7dfZ4zalhmqdDxfFUyt_nGR0/edit?gid=714505087#gid=714505087) gathered and synthesized into actionable development themes
- The emergence of shared challenges across sectors, such as Trust UX, Key management, and Identity
- Validation for existing research initiatives
- Preliminary prioritization and alignment with EF-wide initiatives

---

# 2. Framing the Problem Space: Scope, Limits, and Approach

## 2.1 Problem Scope

Ethereum privacy is a vast and multifaceted domain, arguably as expansive as the Ethereum ecosystem itself. Our initial [ecosystem research](https://www.notion.so/Overview-of-Privacy-on-Ethereum-Ecosystem-21ad57e8dd7e80ec9475f76d17d55b61?pvs=21) revealed the need to strategically narrow our scope and apply a problem-first methodology tailored to the Foundation’s remit. To maintain focus, certain areas, such as Ecosystem coordination and governance, were deliberately excluded during the retreat and retroactively added.

Ongoing PSE research initiatives like Client Side Proving (CSP), Private Information Retrieval (PIR), Verifiable Oblivious Pseudorandom Functions (vORPF), Verifiable Fully Homomorphic Encryption (vFHE), and Indistinguishable Obfuscation (IO) were not explored in the problem scoping phase, but [apply](https://hackmd.io/@clientsideproving/PSE-Retreat-06-25) to multiple problem sectors. The evolution of this research informs how we design privacy protocols, anticipate privacy scaling challenges, and understand cryptographic primitives that may eventually underpin the next generation of private applications.

## 2.2 Selective Depth

In domains like identity and private RPCs, existing research and prior team experience enabled precise problem definitions and well-articulated user stories. In contrast, broader areas such as private transactions and private DeFi proved more challenging, both in defining the problem space and in identifying actionable user stories. These domains revealed gaps in collective knowledge and highlighted the need for continued research.

## 2.3 Problem Articulation

To ensure alignment between real-world needs and technical development, we grounded each problem sector with concrete user stories. The stories were derived from retreat discussions, prior research, in-retreat user testing, and domain experience. Over the next few weeks, we will be refining and prioritizing this list. See our evolving model of [problem-driven resource allocation](https://www.notion.so/Explore-models-for-PSE-Subtractive-R-D-lab-20dd57e8dd7e8004ae32ffc36b70fe16?pvs=21) and the full list of user stories [here](https://docs.google.com/spreadsheets/d/1fvfft-zaSiswxA6PRmw7dfZ4zalhmqdDxfFUyt_nGR0/edit?gid=714505087#gid=714505087).

---

# 3. Problem Taxonomy: Sector and Category Overview

This next section elaborates on the description of each problem area. Where appropriate, needs, requirements, and potential solutions are explored.

![image](/articles/pse-retreat-synthesis-report/taxonomy.webp)

---

## 3.1 Ecosystem Coordination

### 3.1.1 Stewardship

Stewardship refers to the cultural responsibility to embed privacy as a core Ethereum value. While technical tools exist, many projects underinvest in user-facing privacy features due to a lack of incentives, guidance, or community norms. Active stewardship means promoting best practices, actively reviewing EIPs, sharing privacy metrics, and aligning developer and user mindsets around end-to-end privacy as a default expectation.

### 3.1.2 Specifications

Specifications define the shared expectations for how core privacy and identity systems should behave. The Ethereum ecosystem lacks specifications for critical privacy flows in identity, wallet UX, and transactions, which leads to inconsistent tooling and fragmented user experiences. Clearer, [cross-domain specifications](https://github.com/zkspecs/zkspecs) can help ensure composability and accelerate standard adoption.

### 3.1.3 Standards

Standards serve as formalized protocols; examples include ERCs, credential formats, W3C, and [IETF drafts](https://datatracker.ietf.org/doc/draft-zkproof-polycommit/). They are essential for enabling secure engineering practices, compliance requirements, and institutional adoption across the privacy ecosystem. A concerted effort is needed to coordinate the ecosystem to rally behind unified standards to drive them through standardization bodies.

---

## 3.2 Education

### 3.2.1 Resource & Curation

Refers to publicly [accessible tools](https://github.com/web3privacy/web3privacy), explainers, [dashboards](https://ethereumdashboards.com/), and [learning materials](https://ethereum.org/en/) that help developers and can help users make informed choices. Currently, there is a noticeable gap in materials that clearly explain cryptographic primitives, their practical applications, and associated privacy tradeoffs. For governments and institutions, there is a particular need for well-structured, non-technical documentation tailored to policymakers, covering legal frameworks, regulatory implications, and deployment strategies.

Developers and institutions often face decision paralysis when evaluating tools or selecting privacy-preserving design patterns, exacerbated by limited awareness of available options. Thoughtful curation can accelerate adoption by increasing visibility and signaling which tools align with Ethereum's privacy values.

---

## 3.3 Governance

### 3.3.1 Private Voting

Private voting refers to the ability of participants to cast votes without revealing their choices or identities, assuring that their votes are untraceable and protected from coercion, retaliation, or bribery. This requires protocols that support anonymity, auditability, revocable votes, and compatibility with anonymous credentials, without compromising usability or scalability.

### 3.3.2 Private Delegation

Delegation workflows are frequently exposed onchain, and stakeholders expressed a desire for mechanisms that allow voting power to be delegated without revealing links between delegators and delegates. Systems must enable revocable, unlinkable, and flexible delegation patterns that work within current DAO frameworks and trust models, such as the upgrade of token standards like [ERC20Votes](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Votes.sol).

### 3.3.3 DAO Administration

DAOs increasingly manage sensitive operations such as contributor permissions, proposal lifecycles, and internal decision-making. Current tooling leaves these workflows fully transparent, which can jeopardize security. User stories highlighted the need for private multisig execution, modular privacy, and anonymized administrative tasks to bring privacy into core governance operations.

---

## 3.4 [Identity](https://www.notion.so/Private-Identity-211d57e8dd7e80d3ad6ae06a25307b2e?pvs=21) and [Credentials](https://www.notion.so/zkID-open-problems-1f3d57e8dd7e80668e81e4588cb0964c?pvs=21)

This sector refers to the infrastructure and cryptographic mechanisms that allow users to privately issue, verify, and manage their identity. While digital identity systems have matured with zk wrappers and global nullifiers, ensuring end-to-end and everlasting privacy across all phases of the credential lifecycle remains [unsolved](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts4-zkp.md) at scale. A truly pluralistic approach to identity has yet to emerge, one that accommodates diverse use cases, multiple dimensions, governance models, and degrees of decentralization. Key management problems, particularly recovery and delegation, differential privacy analysis, and threat modeling, are closely intertwined with identity.

### 3.4.1 Issuance

This category covers verifiable credential formats, [VCDMs](https://www.w3.org/TR/vc-data-model-2.0/), [documents](https://pse.dev/blog/zkpdf-unlocking-verifiable-data), and attestations that represent identity claims. A core challenge is that most current issuance formats and processes lack unlinkability, exposing users to correlation risk. To address this, trust assumptions, particularly around hardware enclaves (TEEs), issuers, and [Levels of Assurance](https://ec.europa.eu/digital-building-blocks/sites/display/DIGITAL/eIDAS+Levels+of+Assurance), must be clearly articulated. Key areas for exploration include blind issuance, blind signatures, standardizing zkTLS proofs, and pushing for the adoption of digital signatures.

### 3.4.2 Presentation

Presenting credentials securely involves more than just the use of zkps for selective disclosure. Plausible deniability for both issuance and presentation allows a user to convincingly deny having received or presented a particular credential. This requires that presentations cannot be cryptographically tied back to a specific issuer or presentation event.

In practice, users often need to combine attributes from multiple credentials into a single proof or session-specific claim. Techniques such as recursion, ephemeral bindings, and the use of nullifiers are essential for enabling unlinkable, composable presentations with efficient on-chain verification.

### 3.4.3 Verification

Trust minimised verification concerns how users prove claims to relying parties while preserving privacy and maintaining usability. These processes must strike a balance between user anonymity and legal auditability, ensuring data minimization without mass surveillance. Approaches such as MPC or key-share decryption offer potential for conditional transparency, but they require new infrastructure and governance models. Formal verification can also play a critical role in ensuring that verification protocols meet both cryptographic and regulatory requirements.

### 3.4.4 Revocation

Privacy-preserving [revocation](https://hackmd.io/q-Gvdr1oSEuR9MXodDfVYA?view) is needed for expired, mis-issued, and compromised credentials. Existing solutions include [proof of non-inclusion](https://docs.iden3.io/protocol/spec/#revocation-tree), short expiry dates, public revocation lists, [CRset](https://arxiv.org/pdf/2501.17089), [Bitstring status list](https://www.w3.org/TR/vc-bitstring-status-list/), but many of these solutions fail to scale for national deployments and meet [compliance requirements](https://eu-digital-identity-wallet.github.io/eudi-doc-architecture-and-reference-framework/1.4.0/annexes/annex-2/annex-2-high-level-requirements/#a2338-topic-38-wallet-instance-revocation). There is a [need](https://github.com/decentralized-identity/labs/blob/main/proposals/beta-cohort-2-2025/pp-revocation-mechanism/001_proposal.md) for a solution that requires minimal changes to the issuer, low-bandwidth-low-compute for the holder, and offline requirements for the verifier.

### 3.4.5 Trust Registries

Trust registries form the backbone of SSI. Current legal frameworks favor permissioned or consortium chains, like EBSI, inappropriate and limit the adoption of open decentralised networks. The fragmentation of trust registries will only be worsened by the rise of identity-specific L2s. We anticipate this will hinder interoperability, similar to general-purpose Ethereum L2s, having multiple identity L2s creates friction across trust domains. The Ethereum Foundation should play a key role in shifting policy to recognize public blockchains, as well as develop the trust services and frameworks surrounding them.

---

## [3.5 Key Management](https://www.notion.so/Key-Management-final-writeup-21ed57e8dd7e80bda81de09d2ba41b97?pvs=21)

Key management encompasses how users securely control cryptographic keys linked to wallets and credentials. Emerging needs include Public Key Infrastructure (PKI) to support privacy-preserving guardianship or delegation solutions, deterministic key derivation tied to pseudonymous identifiers, and decentralized private key stores that don’t rely on trusted custodians. FHE key management in large distributed networks (e.g., rotating secret shares among thousands of nodes) is also an area for exploration.

### 3.5.1 Recovery

Recovery involves regaining access to a wallet or credentials when a device is lost or compromised. Current approaches, like seed phrases or social recovery, have poor usability and introduce new privacy and trust risks.

### 3.5.2 Rotation

Rotation refers to updating cryptographic keys over time to maintain forward secrecy and security. Key rotation with the use of stealth addresses is underexplored, and few applications provide end-to-end privacy-preserving key rotation without requiring the re-issuance of credentials. Delegated control (e.g., parent/child relationships or legal/medical proxies) is similarly underserved. Protocols need to support private key updates that preserve continuity for users, including support for verifiable delegation and role-based control.

### 3.5.3 Account Abstraction

Smart accounts offer programmable control over assets and permissions, but this flexibility can come at a privacy cost. Mechanisms like delegated signing and paymasters may expose sensitive user behaviour to third parties, even though users retain self-custody. Future account abstraction frameworks must incorporate privacy-aware abstractions. Private account abstraction remains an unsolved challenge.

---

## 3.6 [Asset Management](https://www.notion.so/Private-Transaction-Notes-21cd57e8dd7e801bac1bc067ef601a31?pvs=21)

Ethereum needs cash-like transfers that are practical in cost and resistant to censorship at the L1 level. The term "transaction" on Ethereum spans a wide range, including money transfers (ETH, ERC-20, ERC-721/1155), voting, identity interactions, and more. Within this broad category, it’s important to distinguish between two core privacy needs:

- **Private transfer of data**: Hiding the _origin, destination, asset, and amount_ involved in a transaction.
- **Private history**: Obscuring a user’s _transaction history, actions,_ and _asset correlations_ over time.

Current tools addressing these needs are often siloed, expensive, or poorly integrated with wallets. There is also significant overlap with general key and asset management challenges. Techniques like MPC-based key control and standardized deterministic key derivation deserve further exploration to address these gaps.

### 3.6.1 Swap

Swap refers to exchanging one asset for another without leaking trading intent or value. Privacy-preserving swaps are currently highly siloed. Most swaps today are vulnerable to MEV extraction and surveillance by third parties.

### 3.6.2 Transfer

Private transfers using stealth addresses, one-time keys, and batching are still too UX complex and comparatively expensive for everyday use.

---

## 3.7 [Hardened Security](https://www.notion.so/Hardened-Security-Notes-21bd57e8dd7e808d9cbcec8f6265e947?pvs=21)

Security is not a standalone feature; it must be woven into the mindset, practices, and culture of every privacy-preserving system. At PSE, we view security as foundational to every project, from protocol design to DevOps and deployment. This includes understanding application specific [privacy invariants](https://www.youtube.com/watch?v=_EmGKQR9oJg), non-negotiable guarantees about what data must always remain private, and exploring techniques like _differential privacy_. Strengthening threat modeling, formalizing these invariants, and adopting verifiable privacy guarantees will raise the bar for secure and trustworthy systems across the ecosystem.

### 3.7.1 Secure Engineering

Secure engineering refers to rigorous development practices, including audits and transparent documentation, for both theoretical and implemented guarantees. Standard procedures to compile and compare files, process automation, and verified trusted setup contributions will contribute to the reproducibility of protocols.

### 3.7.2 Threat Modeling

Effective privacy design depends on understanding the threat landscape. Many privacy projects fail to clearly articulate their [threat model](https://www.youtube.com/watch?v=_EmGKQR9oJg), which leads to mismatched user expectations and unexamined attack surfaces. Threat modeling should be embedded early in design processes and shared transparently with users, auditors, and integrators, helping teams align security guarantees with real-world risk

### 3.7.3 Post-Quantum Readiness

Institutions, governments, and ecosystem partners are increasingly demanding post-quantum (PQ) security. Clear distinctions are needed between fully PQ-secure systems and those merely using PQ-safe cryptographic primitives, as well as between use cases like PII protection and authentication. Ethereum and many ZK protocols still lack defined upgrade paths for PQ readiness. Even if PSE does not invest resources here directly, maintaining awareness of emerging PQ-compatible primitives, such as STARKs and lattice-based schemes, will be critical for long-term resilience.

### 3.7.4 Formal Verification

Formal verification involves mathematically proving that software behaves according to its specifications. While significant progress is being made at the L1, through projects like the [formal verification of zkEVM](https://verified-zkevm.org/), there remains a notable gap in applying these techniques to proof systems, circuits, smart contracts, client side proving, and application-layer protocols. Expanding formal methods across the stack is essential to ensure security, and compliance of privacy-preserving technologies built on Ethereum.

---

## 3.8 [VM Interaction](https://hackmd.io/@brech1/epor)

Ethereum users are forced to choose between privacy (running their own node) and practicality (using RPC providers). Reconstruction of [subject identity](https://www.sciencedirect.com/topics/computer-science/subject-identity) (physical or onchain) from Ethereum state requests through queries, behavioral patterns, network metadata, and identity correlation remains a key fundamental privacy vulnerability.

### 3.8.1 Sequencing

Sequencing defines the order in which transactions are included in blocks. It introduces privacy risks through MEV and front-running, as user intent becomes visible before execution

### 3.8.2 State Queries (Indexed)

Indexed state queries include logs, event data, and token balances. Privacy-preserving access patterns fall into three general approaches:

- **Visible Query – Obfuscated Identity**: Use network-level privacy tools (e.g., Tor, VPN) to hide identity while revealing the query.
- **Obfuscated Query – Visible Identity**: Techniques like Private Information Retrieval (PIR) or TEEs with ORAM hide the query content from the provider.
- **Rotating RPCs**: Distribute queries across multiple providers so no single party has complete visibility into user activity.

### 3.8.3 State Retrieval

State retrieval refers to accessing the raw Ethereum state. Significant efforts from EF protocol teams are working on light clients, partial state nodes, [Portal network](https://ethereum.org/en/developers/docs/networking-layer/portal-network/)(retired), and [Statelessness](https://stateless.fyi/) contribute to lowering node requirements, providing a longer-term solution to private reads.

---

## 3.9 UX

### 3.9.1 [Trust Experience](https://stark.mirror.xyz/rkLEVz9p4r3ouusD-WCkWP_iVZYkZ0K7TFkzeRfiXCU)

Trust UX refers to how users perceive the safety, credibility, and transparency of privacy tools across different technical and privacy-awareness levels. Users struggle to assess whether a tool is legitimate, safe to use, or respects their data, this is due to unclear permissions, inconsistent terminology, and a lack of discoverability. This erodes confidence across all user types, from general users to privacy-focused developers.

### 3.9.2 Proof Performance

Proof performance refers to how efficiently zero-knowledge proofs can be generated client-side. Current constraints around memory, CPU, zkp-specific GPU acceleration, and bandwidth make client-side proving difficult to scale for real-world applications. Digital identity, private transactions, key management, zkTLS, DeFi, and even governance [all depend on this.](https://hackmd.io/@clientsideproving/PSE-Retreat-06-25) Application developers need standardized benchmarks and mobile-optimized libraries. Improving mobile proving performance is key to mainstreaming private Dapps on Ethereum.

---

## 3.10 DX

### 3.10.1 Developer Tooling

Developer experience (DX) remains a major bottleneck for building privacy-preserving applications. Core gaps include reproducible builds, mobile-friendly libraries, test environments, and lifecycle tools to safely manage keys, attestations, and compliance logic.

---

# 4. Ecosystem Research Gaps

## 4.1 [Client-Side Proving](https://hackmd.io/@clientsideproving/PSE-Retreat-06-25)

Without performant client-side proving (CSP) or private delegate proving, sensitive data must be offloaded to remote servers, undermining privacy and introducing centralized trust dependencies. Enabling users to generate zero-knowledge proofs locally (on phones, browsers, or low-power devices) is critical for preserving end-to-end privacy and verifiability across identity, asset, and messaging. This demands research into fast, memory-efficient proving schemes, recursion, and benchmarks for post-quantum primitives. CSP research also informs critical system design choices across PSE, including proof system selection and development strategies in downstream initiatives.

## 4.2 [Practical IO](https://machina-io.com/posts/hello_world_first.html)

Indistinguishability obfuscation (iO) is a cryptographic primitive that allows any program to be “opaque” so that it reveals nothing beyond its input-output behavior. Unlike [MPC or FHE](https://mirror.xyz/privacy-scaling-explorations.eth/nXUhkZ84ckZi_5mYRFCCKgkLVFAmM2ECdEFCQul2jPs), which face [privacy scalability issues](https://mirror.xyz/privacy-scaling-explorations.eth/nXUhkZ84ckZi_5mYRFCCKgkLVFAmM2ECdEFCQul2jPs), iO offers a non-interactive, trustless way to delegate secure computation, what Nick Szabo famously called a ["God protocol."](https://nakamotoinstitute.org/library/the-god-protocols/)

Recent breakthroughs show iO is theoretically constructible from standard cryptographic assumptions. However, [current implementations](https://eprint.iacr.org/2020/1003.pdf) remain impractical due to the recursive use of functional encryption (FE). Despite this, iO represents a long-term research moonshot for Ethereum privacy: it promises future-proof, universal private computation with minimal trust assumptions, eliminating the need for centralized or persistent committees.

For PSE, supporting early iO [research](https://eprint.iacr.org/2025/236) keeps us on the frontier of [what’s possible](https://machina-io.com/posts/hello_world_first.html), even if deployment is far off.

## 4.3 [Plasma Fold](https://hackmd.io/js8xrWW7Qr6aWeBUh0RXWA?view)

Plasma Fold is a PSE research prototype that revives Plasma with folding-based incremental proofs. Each user locally generates a compact accumulator proof of their own balance—small enough to compute even on a mobile device. Onchain, only block roots, nullifiers, and a signer bitmap are published; no information about sender, receiver, or transfer amount is ever leaked.

Because the system uses a UTXO format, which is inherently unlinkable, adding support for stealth outputs or encrypted notes is straightforward, offering a credible path toward fully private payments. This approach enables private transfers and stealth approvals with practical gas costs. Preliminary benchmarks suggest Plasma Fold can achieve up to 90,000 transactions per second with folding proofs.

---

# 5. Next Steps

Following the rounds of feedback we recieve from leadership and advisors, the next phase of work will focus on translating user stories into actionable development, coordination, and research effort.

1. **Publish and Invite Feedback**  
   Release the v1 problem map to the ecosystem and solicit public input to refine priorities.

2. **Form Working Groups & Assign Ownership**  
   Create focused working groups for high-priority areas, especially those tagged as "EF should support/coordinate" or "Ecosystem should own." Assign owners and begin drafting RFPs or collaboration scopes.

3. **Deep Scope Q3/Q4 Priorities**  
   Roll up 240+ stories into epics for development effort. Begin in-depth scoping of PSE's Q3/Q4 roadmap.

4. **Coordinate with EF-Wide Initiatives**  
   Align with broader Ethereum Foundation efforts, such as Trillion Dollar Security, formal verification, account abstraction, grant efforts, ecodev, and protocol privacy to avoid duplication.