---
id: "post-quantum-cryptography"
name: "Post-Quantum Cryptography and Ethereum"
image: ""
section: "pse"
projectStatus: "maintained"
category: "research"
tldr: "Ensuring Ethereum's cryptographic security against future quantum threats."
tags:
  keywords:
    ["post-quantum cryptography", "Ethereum", "security", "cryptography"]
  themes: ["cryptography", "security"]
  types: ["research", "development"]
  builtWith: ["ECC", "PQC", "zero-knowledge proofs"]
---

Post-quantum cryptography (PQC) is crucial for securing digital communication against future quantum computers, which threaten to break widely used cryptographic schemes such as RSA, ECC, and DSA. A smooth transition to PQC requires careful consideration of performance trade-offs, compatibility with existing protocols, and resilience against potential future attacks.

### The Importance of PQC for Ethereum

PQC is especially important for Ethereum, which relies on cryptographic security for transactions, smart contracts, and consensus mechanisms. Ethereum primarily uses elliptic curve cryptography (ECC) for digital signatures (via ECDSA and BLS), which quantum computers could break using Shor's algorithm. If large-scale quantum computers become practical, attackers could:

- Forge signatures
- Steal funds
- Undermine the integrity of the network

Additionally, many Ethereum accounts use externally owned addresses (EOAs) derived from public keys, making them particularly vulnerable to quantum attacks once those public keys are revealed on-chain. This highlights the urgency of transitioning Ethereum's cryptographic foundations to quantum-resistant alternatives.

Moreover, smart contract platforms need to support post-quantum-friendly cryptographic primitives for zero-knowledge proofs and rollups, which are essential for Ethereum scaling.

### Transitioning from ECC to PQC

Traditional cryptography relied on ECC, which enables various cryptographic primitives while also offering efficiency. In contrast, post-quantum cryptography is more diverse, and no single approach serves as a universal solution for all use cases. The development of PQC involves designing and standardizing cryptographic schemes based on problems believed to be hard even for quantum computers, such as:

- Lattice-based cryptography
- Code-based cryptography
- Multivariate cryptography
- Isogeny-based cryptography

### Publications

- Post Quantum signature aggregation with Falcon and LaBRADOR ([ethresear.ch post](https://pse.dev/en/blog/post-quantum-signature-aggregation-with-falcon-and-LaBRADOR))
- Are elliptic curves going to survive the quantum apocalypse? ([blogpost](https://pse.dev/en/blog/are-elliptic-curves-going-to-survive-the-quantum-apocalypse))
- Post quantum TXs in The Verge ([ethresear.ch post](https://ethresear.ch/t/post-quantum-txs-in-the-verge/21763))

### Our Commitment to PQC at PSE

At PSE, we are committed to staying at the forefront of the rapidly evolving field of PQC by continuously following, testing, and optimizing the latest advancements. Our goal is to ensure that the Ethereum ecosystem is well-prepared for the challenges and opportunities that come with the transition to quantum-safe systems.
