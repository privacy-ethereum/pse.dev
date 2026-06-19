---
authors: ["N"]
title: "Post-Quantum Threats to Ethereum Privacy"
tldr: "Privacy migration to post-quantum cryptography is more time-sensitive than authentication migration — harvest-now-decrypt-later turns every encrypted on-chain ciphertext into a permanent exposure. Ethereum inherits PQ transport from Go's TLS, but stealth addresses, zkID, zkTLS, and confidential transfers all need Ethereum-specific work."
canonical: "https://ethresear.ch/t/post-quantum-threats-to-ethereum-privacy/24450"
date: "2026-05-13"
tags: ["post-quantum", "privacy", "stealth-addresses", "zkid", "zktls", "confidentiality", "client-side-proving"]
---

*Thanks to Alex, Andy, Keewoo, Miha, Moven, Nico, Oskar, Sora, Thore, Vitalik, Yanis, and Zoey for feedback on earlier drafts. This post was researched and written with AI assistance.*

## TL;DR

For long-lived confidentiality surfaces exposed to harvest-now-decrypt-later, privacy migration is more time-sensitive than authentication migration — nothing can prevent an adversary from decrypting harvested ciphertexts using quantum computers in the future, while signature forgery is at least partially remediable through hard forks and key migration (though with significant ambiguity, attribution, and rollback costs). Industry broadly shipped PQ key exchange first (Chrome, iMessage, AWS, Cloudflare); PQ authentication is still early, especially in default public-web PKI. Ethereum inherits PQ transport encryption for some surfaces (HTTPS/JSON-RPC over TLS via Go 1.24), but application-layer privacy — cryptographic protocols built on top of the EVM rather than natively supported by opcodes or precompiles, such as stealth addresses, zkID, and confidential transactions — requires Ethereum-specific work.

| # | Problem | Status |
|---|---------|--------|
| 1 | PQ Stealth Address scalability | Active research; calldata bloat and OMR memory costs remain |
| 2 | ML-KEM inside MPC/2PC for zkTLS | No protocol within practical timeouts |
| 3 | NIST PQ signature arithmetization for zkID import | 131x gap vs. pre-quantum SNARKs |
| 4 | PQ credential verification cost for zkID import | 131x SNARK gap; [EIP-8051](https://eips.ethereum.org/EIPS/eip-8051)/[8052](https://eips.ethereum.org/EIPS/eip-8052) (draft) proposed as enabling infrastructure |
| 5 | PQ proven-correct encryption to designated auditor | Detect-and-flag may suffice; protocol-enforced model unsolved |

---

## Introduction

The post-quantum threat to blockchain has been broadly recognized and can be categorized into two classes: **authenticity** and **privacy**. Authenticity refers to forgery of digital signatures and their broader form — zero-knowledge proofs. Privacy refers to the confidentiality of on-chain and off-chain data, as well as the anonymity and unlinkability of users and their actions.

Significant effort has been spent mitigating authenticity threats. In August 2024, NIST finalized its first three [PQC standards](https://csrc.nist.gov/projects/post-quantum-cryptography) — ML-KEM (FIPS 203), ML-DSA (FIPS 204), and SLH-DSA (FIPS 205). By early 2026, the Ethereum Foundation had [elevated PQ security in the protocol roadmap](https://x.com/ethereum/status/2014802532103815230) and begun organizing dedicated public PQ workstreams.

By comparison, privacy threats are uniquely urgent because of harvest-now-decrypt-later (HNDL) — the strategy of capturing encrypted data today and stockpiling it until a sufficiently powerful quantum computer can break the encryption. On a conventional network an adversary must actively wiretap traffic to harvest ciphertexts, but blockchains are public, append-only ledgers: application-layer encrypted data — on-chain ciphertexts, stealth address announcements, encrypted notes, viewing keys — is already permanently visible to everyone. There is no interception step; the chain itself is the archive. Any privacy-relevant ciphertext posted today is harvestable by default and will remain exposed for the lifetime of the ledger. Unlike authenticity failures, which are at least partially remediable through emergency coordination (though with [significant ambiguity and rollback costs](https://ethresear.ch/t/how-to-hard-fork-to-save-most-users-funds-in-a-quantum-emergency/18901)), privacy breaches are irreversible — once a ciphertext is decrypted by a future quantum adversary, no protocol upgrade can re-encrypt it. Industry recognizes this asymmetry: Chrome, Apple iMessage (PQ3), AWS, and Cloudflare already ship PQ key exchange, while PQ authentication in the default public-web PKI remains largely undeployed — because key exchange protects against HNDL but authentication only needs to resist real-time forgery ([ethresear.ch PQ tasklist](https://ethresear.ch/t/tasklist-for-post-quantum-eth/21296), [F5 Labs](https://www.f5.com/labs/articles/the-state-of-pqc-on-the-web)).

## What Ethereum Gets for Free — and What It Doesn't

Not all PQ privacy migration requires Ethereum-specific research. The broader industry's encryption migration already covers some transport surfaces: Geth is written in Go, and Go 1.24 ships hybrid PQ TLS (X25519MLKEM768) by default — [Kubernetes v1.33](https://kubernetes.io/blog/2025/07/18/pqc-in-k8s/) got PQ key exchange automatically just by upgrading Go. HTTPS JSON-RPC endpoints, browser-to-dApp connections, and any libp2p deployments using TLS 1.3 through Go's TLS stack inherit PQ-encrypted transport with no Ethereum protocol changes. (Ethereum's native DevP2P/RLPx stack runs over TCP, not TLS, so it does not automatically benefit; and libp2p also supports Noise as a secure channel option, which would need its own PQ upgrade.)

What Ethereum *cannot* inherit is **application-layer** privacy — cryptographic protocols built on top of the EVM rather than natively supported by opcodes or precompiles. On-chain ciphertexts, ECDH-based key derivation for note discovery (viewing keys), ECDH-based stealth address generation, ZK-proven encryption (proving inside a ZK circuit that a ciphertext was correctly formed under a given public key, as used in compliant shielded transfers), and access pattern hiding (preventing observers from learning which on-chain records a user reads or writes, e.g., which notes they scan or spend) are all blockchain-specific problems with no industry equivalent. The remainder of this post focuses on these gaps.

## Anonymity and Unlinkability

Technologies like Stealth Addresses, zkID, and zkTLS offer good UX for anonymity and unlinkability, sufficient for most use cases today. The question is whether this holds post-quantum.

### Stealth Addresses

Stealth Addresses rely on Elliptic Curve Diffie-Hellman Key Exchange (ECDHKE), which is broken by quantum computers. ECDHKE can be replaced with ML-KEM off-chain, but ML-KEM-768 ciphertexts are 1,088 bytes — 33x larger than compressed ECDH points. EIP-4844 blobs are pruned after ~18 days, so using them for stealth address ciphertexts would require recipients to retrieve ciphertexts within that window — adding a liveness requirement that current stealth address designs do not have.

A potential solution without burdening calldata is Oblivious Message Retrieval (OMR) as an off-chain sidecar. This introduces a data availability trust assumption that on-chain stealth addresses do not have: recipients depend on the sidecar operator to store and serve ciphertexts. If the operator goes offline or withholds data, recipients cannot scan for their notes. ML-KEM is structurally more compatible with OMR than ECDH. [a stealth address protocol based on Module-LWE](https://eprint.iacr.org/2025/112) outperforms classical ECPDKSAP by ~66.8% in scan time, and the hybrid ["Efficient Curvy" protocol](https://arxiv.org/abs/2504.06744) achieves ~3x faster scanning. OMR itself has improved from the [original construction](https://eprint.iacr.org/2021/1256) to [PerfOMR](https://eprint.iacr.org/2024/204) (~40 ms/message, 235x smaller keys) and [HomeRun](https://eprint.iacr.org/2024/188) (3,830x faster runtime). However, OMR memory costs (~20 GB+) remain impractical for lightweight infrastructure.

### zkTLS

As TLS servers migrate to hybrid PQ key exchange (X25519MLKEM768), zkTLS must follow: the MPC/2PC between user and Notary must jointly perform both the X25519 and ML-KEM-768 portions of the handshake without revealing the session key to either party. Current zkTLS protocols like TLSNotary operate over TLS 1.2; TLS 1.3 support (which is where X25519MLKEM768 negotiation occurs) is on their roadmap but not yet shipped. Even for the classical X25519 key exchange inside TLS 1.3 MPC/2PC, no production zkTLS implementation exists — adding ML-KEM-768, whose NTT polynomial arithmetic is expensive in generic MPC frameworks, compounds the challenge further. A concrete demonstration may require co-designing MPC with ML-KEM's algebraic structure rather than using generic frameworks.

### zkID

zkID requires the user to prove *inside a ZK circuit on their device* that they correctly verified a signature, then submit only the proof — not the credential — to a verifier. Full PQ zkID requires two layers of post-quantum security: (1) the *signature scheme* itself must be PQ-secure (so a quantum adversary cannot forge credentials), and (2) the *proving system* that generates the ZK proof must also be PQ-secure (so a quantum adversary cannot forge proofs). The core question for practical deployment is how cheaply PQ signature verification can be arithmetized inside a PQ proving system.

Hash-based schemes (XMSS, Winternitz, SPHINCS+) are built entirely from hash evaluations. Replace the internal hash (SHA-256: ~25,000+ R1CS constraints) with a ZK-native alternative like Poseidon (~240 constraints — see [ZKPlus benchmarks](https://zk-plus.github.io/tutorials/basics/hashing-algorithms-benchmarks), [Guo et al.](https://arxiv.org/abs/2409.01976)), and the verification circuit shrinks by ~100x. This works because hash-based signatures are *generic* over the hash function — they need only collision and preimage resistance, not specific algebra. The signature stays PQ-secure and becomes cheap to prove in ZK. Lattice-based signatures (ML-DSA, FN-DSA) lack this property: their NTT polynomial arithmetic is expensive to arithmetize, making them better suited for direct on-chain verification via precompiles ([EIP-8051](https://eips.ethereum.org/EIPS/eip-8051), [EIP-8052](https://eips.ethereum.org/EIPS/eip-8052)) rather than being proven correct inside a ZK circuit (i.e., the user proves "I verified this signature" in zero knowledge, without revealing the credential).

#### Exporting Ethereum ID 
This is tractable: the ecosystem can design *Ethereum-native* hash-based PQ signatures with Poseidon internals, and users prove verification inside a STARK on their device. An important caveat: this is a custom, Ethereum-specific design — not standardized SLH-DSA (FIPS 205 specifies SHAKE/SHA2-based parameter sets only). It would not interoperate with external PKI or satisfy compliance frameworks that mandate NIST-approved algorithms. The approach is compelling precisely because the ecosystem controls both the signer and the verifier, but it should be understood as a native design choice, not a standards-compliant one. **

#### Importing real-world ID
This is hard: issuers will use standardized ML-DSA or SLH-DSA with SHA-256/SHAKE, not Poseidon. The full verification — including SHA-256/SHAKE and (for ML-DSA) lattice NTT — must be arithmetized as-is. There is a deeper mismatch: real-world signature schemes are typically optimized for fast signing (a server signs many credentials) at the expense of verification cost (a single client verifies), which is the opposite of the blockchain setting where verification happens on-chain or inside a ZK circuit and must be cheap. This design asymmetry is a structural reason why importing real-world credentials is inherently expensive. The [lattice-based designated-verifier zkSNARK by Wu et al.](https://www.cs.utexas.edu/~dwu4/papers/LatticeDVSNARKs.pdf) achieves ~16 KB proofs (10.3x smaller than Aurora) but remains 131x larger than Groth16; note that the designated-verifier setting means the proof can only be checked by a specific verifier who holds a secret key, not publicly verified on-chain — an additional limitation for blockchain use cases. STARKs are the most practical PQ path (they rely only on collision-resistant hashes, no lattice or pairing assumptions) but produce significantly larger proofs than pre-quantum SNARKs like Groth16. Remaining gaps: closing the 131x PQ/pre-quantum SNARK gap; efficient arithmetization of NIST PQ signature verification; a production-ready PQ SNARK for credential verification.

## Confidentiality

Confidentiality — hiding transaction amounts, balances, and contract state — is the regime of privacy-focused Ethereum L2 infrastructure like [Aztec](https://aztec.network) (Ignition Chain launched November 2025, though mainnet phase 1 is not yet executing user transactions) and application-layer tools like Railgun and Privacy Pools. State commitments (Merkle trees, note hashes) can use PQ-safe hashes like Poseidon — the vulnerability lies in the *encryption* layer. Two distinct subproblems arise:

- **Note discovery and key exchange**: viewing keys in systems like Aztec rely on EC-based key derivation — the sender encrypts to the recipient's public key so the recipient can identify notes intended for them. ML-KEM can replace ECDHKE here (same 33x ciphertext bloat as stealth addresses, same OMR-based mitigation path), but this key exchange happens *outside* the ZK circuit and does not require in-circuit proving.
- **Proven-correct encryption to a designated auditor / compliance recipient**: for selective disclosure in compliant shielded transfers, the sender encrypts directly to the designated recipient's known public key and proves correctness inside a ZK circuit. The recipient could be a regulatory body, an institutional compliance desk, a DAO treasury auditor, or any party the protocol designates. Pre-quantum, ElGamal did this cheaply (one EC scalar mul, trivially ZK-friendly). Post-quantum, the sender would use lattice-based PKE (e.g., Kyber.CPAPKE or plain-LWE Regev encryption). For most practical designs, the sender can perform lattice PKE *outside* the circuit, derive a symmetric key, and prove correct symmetric encryption *inside* the circuit using Poseidon in sponge mode (~240 constraints per permutation, PQ-safe, already used by Aztec for note encryption). If the sender cheats (encrypts to a dummy key), the auditor gets garbage and flags the transaction — a detect-and-flag model. A stronger model — where the protocol *guarantees* the designated recipient can decrypt — would require proving lattice PKE correct inside a ZK circuit, which remains expensive due to the field mismatch (lattice arithmetic over q = 3,329 vs. proof system fields like BN254), though simpler than full ML-KEM. Whether the weaker detect-and-flag model suffices is an open policy question as much as a cryptographic one.

## Client-Side Proving as a Dependency

Both zkID and confidentiality require the user to generate ZK proofs *on their own device* — delegating to a server leaks the very private inputs the proof is meant to protect. While GPU acceleration benefits all proving backends, PQ proving systems stand to gain disproportionately for two reasons: (1) current CPU performance makes PQ proof generation infeasible for client-side use, creating a harder dependency on GPU acceleration than pre-quantum systems have, and (2) PQ primitives — NTT-based polynomial arithmetic over small fields — are more naturally aligned with GPU architecture than group-based elliptic curve operations, which face a [theoretical acceleration upper bound](https://pse.dev/blog/mopro-metal-msm-v2#understanding-the-theoretical-acceleration-upper-bound) due to their sequential carry-chain dependencies. NTT is the *shared primitive* across STARK proving and lattice operations, and small-field PQ schemes (M31, q = 3,329) achieve [100+ Gops/s on mobile GPUs vs. < 1 Gops/s for BN254](https://pse.dev/blog/client-side-gpu-everyday-ef-privacy) — so the raw throughput is there.

GPU acceleration applies to both the Ethereum-native ID path (Poseidon-internal hash-based signatures proven in STARKs) and the real-world ID import path (NIST PQ signature verification in SNARKs). But the Ethereum-native path offers a significantly easier route to client-side privacy: by controlling the signature scheme, the ecosystem can choose primitives that are both PQ-safe and GPU-friendly from the start, rather than arithmetizing externally imposed algorithms. Prioritizing the Ethereum ID design space is therefore also a pragmatic client-side proving strategy.

Client-side GPU proving is a broader Ethereum infrastructure challenge (benefiting censorship resistance, validity proofs, and more), not specific to post-quantum privacy. We note it here as a dependency: PQ privacy cannot ship without it, but the [GPU ZK ecosystem](https://github.com/zkmopro/awesome-client-side-gpu) and its [PQ roadmap](https://pse.dev/blog/client-side-gpu-everyday-ef-privacy) are best addressed as a general proving infrastructure effort.

## Near-Term Roadmap Recommendations

The problems above sit at different levels of maturity. Some have known PQ replacements and can move to implementation; others remain open research. A useful roadmap separates what can ship from what needs breakthroughs — and avoids accumulating new exposure while waiting.

> **Design principle: no new classical privacy debt.** Confidentiality debt is irreversible — unlike authenticity debt, which can be partially remediated through key rotation or emergency forks. Every new privacy protocol that stores long-lived ECDH-derived ciphertext extends the HNDL exposure window permanently. New designs should default to PQ key exchange for any confidentiality surface that persists beyond a single session, with explicit, documented exceptions where PQ alternatives are not yet practical.

1. **Quantify the privacy honeypot.** A *quantum honeypot* is the total extractable value a sufficiently powerful quantum computer unlocks on arrival. The authenticity honeypot — aggregate value in accounts with quantum-vulnerable keys — is large but bounded: the community can coordinate an [emergency hard fork](https://ethresear.ch/t/how-to-hard-fork-to-save-most-users-funds-in-a-quantum-emergency/18901) to freeze exposed accounts and migrate to PQ signatures.

   The *privacy* honeypot is structurally different and is the focus of this article. It is the cumulative encrypted data on-chain since genesis, growing with every block. No fork can re-encrypt past ciphertexts. Each category of exposure compounds independently:
   - **Shielded transactions and encrypted notes:** a quantum adversary retroactively decrypts every balance, transfer amount, and contract state ever committed to a shielded pool — full financial histories for every participant.
   - **Stealth address linkages:** ECDH-derived stealth addresses become traceable back to recipients, collapsing the unlinkability that stealth schemes are designed to provide.
   - **Selectively disclosed credentials:** compliance-protected disclosures intended for a designated auditor become readable by anyone with a quantum computer — exposing KYC data, institutional positions, and identity linkages to unintended parties.
   - **Viewing keys and note discovery:** EC-based key derivation for note scanning reveals which notes belong to which recipients, deanonymizing the entire transaction graph even where amounts remain hidden behind symmetric encryption.

   The social implications are distinct from theft: retroactive deanonymization of political donors, dissolution of financial privacy for individuals and institutions, exposure of compliance relationships. The authenticity honeypot can be drained and then stopped. The privacy honeypot can only be prevented from growing further — every block adds irreversible exposure.

   *Deliverable:* a quantified, regularly updated estimate of the privacy honeypot — data categories at risk, growth rate per category, and remediation timelines — giving governance a concrete basis for migration urgency. An analogous estimate for the authenticity honeypot (value at risk, fork readiness) is useful context but is already better understood.

2. **Build a confidentiality surface registry.** Enumerate every privacy surface where ciphertext or key material outlives a single session: stealth announcements, viewing keys, encrypted notes, application-layer ciphertext, credential imports, selective-disclosure flows. Tag each with storage lifetime, cryptographic assumptions, and PQ replacement availability. The output is a structured registry teams can query to prioritize migration — not a narrative threat model.

   To keep the registry current, new EIPs and protocol specs that introduce or depend on confidentiality surfaces should include a **PQ threat model section** — analogous to the existing Security Considerations requirement — identifying quantum-vulnerable assumptions, HNDL-exposed data, and migration paths. This turns PQ readiness from a retroactive audit into a standing design constraint.

3. **Ship reference libraries and benchmarks for tractable surfaces.** Two surfaces have known PQ primitives and can move to implementation now:
   - *ML-KEM note discovery:* ciphertext generation and scanning, wallet/indexer interfaces, OMR retrieval sidecars.
   - *Ethereum-native zkID:* Poseidon-internal hash-based PQ signatures with STARK verification circuits, benchmarked for client-side proving time and proof size.

   The goal is common baselines, not production readiness — ideally validated end-to-end against at least one privacy-oriented L2 or application stack to surface integration issues that benchmarks alone miss.

4. **Scope open problems as non-blocking research tracks.** Three areas are important but unsolved: PQ-compatible zkTLS (MPC/2PC over ML-KEM handshakes), real-world zkID import (arithmetization of NIST PQ signature verification), and protocol-enforced proven-correct encryption to designated auditors. No concrete protocol exists for any of them within practical constraints. Fund and track these, but do not block progress on the registry, reference libraries, or the design principle above.

---

*Feedback welcome — particularly on the privacy honeypot framing, the tractability assessments, and any PQ privacy surfaces we may have missed.*
