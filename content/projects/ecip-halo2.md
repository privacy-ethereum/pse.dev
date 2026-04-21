---
id: "ecip-halo2"
name: "ECIP (Elliptic Curve Inner Products) Halo 2 Implementation"
image: ""
section: "pse"
projectStatus: "inactive"
category: "devtools"
tldr: "Integrating Nova into the EVM involves wrapping Liam Eagen's theoretical ECIP argument in Halo 2"
links:
  github: "https://github.com/levs57/sage-circuits/"
extraLinks:
  learn:
    - label: "Designing a plonk circuit for Liam Eagen's protocol"
      url: "https://hackmd.io/@levs57/r1n77YvP3"
    - label: "ZKPs of Elliptic Curve Inner Products from Principal Divisors and Weil Reciprocity"
      url: "https://eprint.iacr.org/2022/596"
---

Liam Eagen has developed a ZK proof for Elliptic Curve Inner Products (ECIPs) to overcome a significant bottle neck in recursive proof composition over elliptic curve cycles. The process of integrating Nova into the EVM requires an efficient method or "argument" for handling large elliptic Multi-Scalar Multiplications (MSMs). The final step in this integration process involves wrapping this argument Halo 2.
