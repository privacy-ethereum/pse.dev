---
authors: ["Adria Bienvenido, Guorong Du"]
title: "Towards a Quantum-Safe P2P for Ethereum"
image: "/articles/towards_a_quantum-safe_p2p_for_ethereum/towards_a_quantum-safe_p2p_for_ethereum-cover.webp"
tldr: "Integrating post‑quantum cryptography into Ethereum's P2P stack is currently impractical—PQ keys and signatures are too large for UDP‑based discovery and transport—though future research on QUIC migration, composite keys, and protocol redesign may offer viable paths forward."
date: "2025-04-22"
tags:
  [
    "quantum computing",
    "p2p",
    "ethereum",
    "cryptography",
    "networking",
    "post-quantum",
    "security",
    "infrastructure/protocol",
  ]
projects: ["post-quantum-cryptography"]
---

## Motivation

As quantum computing continues to evolve, there is increasing interest in understanding how Ethereum's existing peer-to-peer (P2P) networking stack might adapt to emerging post-quantum (PQ) cryptographic standards. PSE members Adria and Guorong undertook a brief exploratory project to assess what adopting PQ algorithms in Ethereum's P2P layer would entail. This exploration aimed primarily at gaining clarity around potential challenges and identifying realistic directions for future PQ-focused efforts. Ultimately, the project highlighted significant practical limitations, providing valuable insights that we hope will help inform further PQ initiatives.

## The Current Stack

P2P networking handles node discovery and data transport between nodes. Nodes are identified by an [Ethereum Node Record (ENR)](https://github.com/ethereum/devp2p/blob/master/enr.md), a self-signed dictionary containing the node ID, public key(s), and network location.

Node discovery is achieved via [Discv5](https://github.com/ethereum/devp2p/blob/master/discv5/discv5.md), which uses UDP (with a maximum packet size of 1280 bytes). UDP avoids maintaining persistent connections, aids NAT traversal, and complicates packet linking in traffic analysis (packets are randomized and encrypted). After an initial handshake, nodes communicate using session keys—nodes send a `FINDNODE` request and receive ENRs in `NODES` responses.

Following discovery, the execution layer uses the [RLPx](https://github.com/ethereum/devp2p/blob/master/rlpx.md) protocol, while the consensus layer uses libp2p. RLPx provides ciphered and authenticated transport with its own handshake and supports subprotocols—primarily [EthWire](https://github.com/ethereum/devp2p/blob/master/caps/eth.md) for transporting blocks, transactions, and receipts. The consensus layer communicates via libp2p over TCP or [QUIC](https://en.wikipedia.org/wiki/QUIC), using encrypted sessions established with the well-known [Noise Protocol handshake](https://github.com/libp2p/specs/tree/master/noise#xx).

## Post-Quantum State of the Art

Currently, several widely used algorithms are not considered PQ safe:

| Algorithm | Status     | Most Common Constructions                                                                                                                                                                 |
| --------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RSA       | Broken     | Encryption, Authentication, Key Exchange                                                                                                                                                  |
| EC        | Broken     | ECIES encryption, ECDH authenticated key exchange, pairings, BLS signature aggregation, KZG, Groth16 (though Groth16's perfect zero-knowledge provides forward secrecy on private inputs) |
| Hash      | Diminished | Hash sizes must be doubled (per Grover's algorithm); however, Poseidon is PQ safe                                                                                                         |

New PQ primitives exist, but they are not "drop-in" replacements. Their differing properties require careful integration. For instance, FN-DSA includes an internal hasher, so signing the entire message is preferable over signing a digest. Most of these algorithms have undergone lengthy NIST reviews, with more expected in the future. Remember that we are already using non-standardized algorithms such as secp256k1, Keccak, Groth16, and STARKs. Sometimes "only using approved" is not a [good](https://harvardnsj.org/2022/06/07/dueling-over-dual_ec_drgb-the-consequences-of-corrupting-a-cryptographic-standardization-process/) [idea](https://crypto.stackexchange.com/questions/108017/who-originally-generated-the-elliptic-curve-now-known-as-p256-secp256r1).

| Algorithm                                                                | Status   | Type                                                       |
| ------------------------------------------------------------------------ | -------- | ---------------------------------------------------------- |
| [ML-KEM (CRYSTALS-Kyber)](https://csrc.nist.gov/pubs/fips/203/final)     | Standard | Lattice KEM                                                |
| [ML-DSA (CRYSTALS-Dilithium)](https://csrc.nist.gov/pubs/fips/204/final) | Standard | Lattice Signatures                                         |
| [SLH-DSA (SPHINCS+)](https://csrc.nist.gov/pubs/fips/205/final)          | Standard | Hash Signatures (alternative to Dilithium if compromised)  |
| [FN-DSA (Falcon)](https://falcon-sign.info/)                             | Pending  | Lattice Signature                                          |
| [Falcon/Labrador](https://eprint.iacr.org/2024/311)                      | Research | Aggregated Falcon Signatures                               |
| [CSIDH](https://csidh.isogeny.org/)                                      | Research | Non-interactive key exchange (a good replacement for ECDH) |

Note that PQ public keys and signatures are significantly larger than current ECDSA sizes (33 bytes for public keys, 65 bytes for signatures). For example, Falcon requires a padded signature size of 666 bytes and a public key of 897 bytes (which can be combined into 1328 bytes for transport). Check this nice [Cloudflare table](https://blog.cloudflare.com/fr-fr/another-look-at-pq-signatures/).

## A New PQ P2P Crypto Stack?

The following table summarizes the cryptographic substitutions proposed for each transport layer:

| Transport | Feature                                  | Possible Substitution                                          | Notes                                                                     |
| --------- | ---------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ENR       | secp256k1 pk+sig                         | Falcon pk+sig                                                  | ~1.4 KB; may exceed UDP frame limits                                      |
| Discv5    | ECDH handshake                           | FN-DSA + ML-KEM                                                | 1.5 roundtrips (2.3 KB + 3.2 KB + 1.5 KB); may exceed UDP frame limits    |
| Discv5    | `NODES` response                         | –                                                              | Contains ENRs; could overflow UDP frames                                  |
| RLPx      | ECDH/ECIES handshake                     | 2 × FN-DSA + ML-KEM + 2 × ML-KEM                               | ~20 KB additional overhead                                                |
| EthWire   | Transaction signatures                   | Falcon                                                         | 1265 bytes per signature (applies to transaction signatures and calldata) |
| Libp2p    | Noise `XX`-type handshake with secp256k1 | [Post-Quantum Noise](https://eprint.iacr.org/2022/539.pdf) (?) | –                                                                         |

The replacement for ECDH is essentially as described in the [NIST Workshop on Guidance for KEMs](https://csrc.nist.gov/csrc/media/Events/2025/workshop-on-guidance-for-kems/documents/papers/pqc-based-bidirectional.pdf); a test implementation can be found at https://github.com/adria0/pq-aka. As you can see, this construction is not a NIKE, so it requires roundtrips.

Let's do a quick check if we are targeting the PQ threats here:

**Forward Secrecy:**  
Critical to prevent "harvest-then-decrypt" attacks. Although urgent in post-quantum scenarios, it does not seem to be a problem at the P2P layer.

**Ownership:**  
Cryptographically secured assets (protected by EthWire transaction signatures) must remain secure. Account abstraction could improve protection by, for example, requiring an additional Falcon signature in the calldata. (Note: This is not strictly a P2P transport problem.)

**Availability:**  
Systems must maintain performance despite increased data sizes. The expansion from 65 to 1328 bytes for signatures can stress the network. Techniques such as storing public keys in indexed registry smart contracts and transmitting only the signature may mitigate this. It is not clear how much this increase could congest the network, enlarge block sizes, or lengthen block times. To avoid moving from UDP to TCP, perhaps QUIC could help.

**Security:**  
While we are now using safe algorithms, PQ algorithms are still under scrutiny and may be vulnerable. A recommended strategy is to use composite keys—combining traditional and post-quantum keys—to hedge against potential weaknesses, albeit with additional performance overhead. This is a strong recommendation from the [IETF pquip](https://github.com/ietf-wg-pquip/state-of-protocols-and-pqc) team.

**Dependency:**  
Compromises in dependent systems (DNSSEC, TLS) could undermine network security, providing alternate attack vectors. Fortunately, P2P primarily uses IP/IPv6 addresses, so it seems unaffected.

## Note on libp2p Exploration

[libp2p](https://libp2p.io/) is the P2P [networking](https://ethereum.org/en/developers/docs/networking-layer/#libp2p) stack, mainly used for the consensus layer in the Ethereum blockchain. One of our explorations includes migrating libp2p networking to a PQ-safe implementation. The current libp2p implementations depend on ECC (secp256k1, etc.) for communication (key exchange) and authentication (generation and validation of node IDs).

Here, the specific target is QUIC—a transport protocol built on UDP. At the moment, the adoption of QUIC is quite [high](https://ethresear.ch/t/quic-support-among-ethereum-consensus-layer-clients/21102/1) among CL clients, and it is expected to grow in the future.

We have explored migrating the key exchange part of [rust-libp2p](https://github.com/libp2p/rust-libp2p) to a PQ-safe implementation (e.g., using Kyber KEM) in [this fork](https://github.com/guorong009/rust-libp2p/tree/prefer-post-quantum). Additionally, there is an [example](https://github.com/guorong009/p2p-chat-clone). Our conclusions are as follows:

- Using a KEM algorithm for key exchange does not significantly degrade communication, as the main process relies on symmetric cryptography which is less affected by quantum computing.
- Other aspects (authentication, node ID generation, etc.) require further in-depth research but are not immediately urgent.

Additionally, we have learned:

- Major tech firms (Cloudflare, IBM, Google) are conducting experiments on PQ migration of networking protocols:
  - [Cloudflare's Post-Quantum for All](https://blog.cloudflare.com/post-quantum-for-all/)
  - [Microsoft's Post-Quantum TLS](https://www.microsoft.com/en-us/research/project/post-quantum-tls/)
- These companies, especially Cloudflare, have detailed benchmarks on their experiments.
- From their perspective, migrating communication cryptography is more urgent than authentication, as the communication component is vulnerable to [Harvest Now, Decrypt Later attacks](https://en.wikipedia.org/wiki/Harvest_now,_decrypt_later).
- Their client-server experiments might be applicable to P2P networking with less effort, given that P2P combines client and server functionalities.

## A Call for Action

While the proposed changes are not entirely appealing as drop-in replacements, they represent initial attempts to integrate PQ cryptographic methods within the existing framework. However, these efforts highlight significant limitations and underscore the need for innovation in this area.

We must reconsider transport protocols:

- **Discv5 over UDP** appears impractical due to oversized ENRs and fragmented handshakes.
- A redesign of secure discovery protocols using current PQ algorithms is necessary, supported by robust network simulations and advanced P2P engineering.
- Transitioning to QUIC combined with a PQ-Noise approach for P2P communication appears promising as a replacement for RLPx.

Techniques such as [aggregated gossip signatures](https://ethresear.ch/t/signature-merging-for-large-scale-consensus/17386) could help mitigate increased network traffic. Research into [compressing signatures and transient information after finalization](https://ethresear.ch/t/post-quantum-txs-in-the-verge/21763) is also encouraged.

Despite criticisms regarding its [internal complexity](https://x.com/Narodism/status/1882362499686645938) and [limited PQ adaptation](https://discuss.libp2p.io/t/any-information-about-post-quantum-cryptography-in-libp2p/2189), libp2p—especially its Kademlia DHT—remains a candidate for evolving to meet future PQ challenges.
