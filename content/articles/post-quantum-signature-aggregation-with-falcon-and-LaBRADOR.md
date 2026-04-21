---
title: "Post-Quantum Signature Aggregation with Falcon + LaBRADOR"
date: 2025-05-19
author: PSE Research
image: "/articles/post-quantum-signature-aggregation-with-falcon-and-LaBRADOR/cover.webp"
tagline: "Compact lattice-based proofs for Ethereum"
description: "Introducing our work on aggregating Falcon signatures using LaBRADOR, a lattice-based proof system optimized for Ethereum."
canonical: "https://ethresear.ch/t/lattice-based-signature-aggregation/22282"
---

We demonstrate efficient aggregation of Falcon signatures using LaBRADOR, achieving compact, quantum-resistant proofs. Read the full technical breakdown on [ethresear.ch](https://ethresear.ch/t/lattice-based-signature-aggregation/22282).

---

Ethereum currently uses BLS signatures, but these are vulnerable to future quantum attacks. Our recent research explores lattice-based signature aggregation using Falcon signatures and the LaBRADOR proof system.

Key highlights:

- **Compact proofs:** Aggregate 10,000 Falcon-512 signatures into a 74 KB proof.
- **Efficient generation:** Proofs generated in \~6 seconds on commodity hardware.
- **Verification optimization:** Current verification time (\~2.6 seconds) identified as a primary bottleneck, with active work to reduce it further.

This work is part of our broader post-quantum initiative at PSE, focusing on securing Ethereum's core infrastructure.

---

🔗 **Full technical details and discussions:** [Lattice-based signature aggregation on ethresear.ch](https://ethresear.ch/t/lattice-based-signature-aggregation/22282)
