---
id: "circom-mpc"
name: "Circom-MPC"
image: ""
section: "pse"
projectStatus: "inactive"
category: "research"
tldr: "PSE Research project that enables the use of the Circom language to develop MPC applications."
tags:
  keywords: ["mpc", "circom", "mp-spdz"]
  themes: ["research"]
links:
  github: "https://github.com/namnc/circom-2-arithc"
---

Circom-MPC is a set of projects designed to compile and run arithmetic and boolean MPC circuits written in Circom.
In this project, we envisioned MPC as a broader paradigm, where MPC serves as an umbrella for generic techniques such as Zero-Knowledge Proof, Garbled Circuit, Secret-Sharing, or Fully Homomorphic Encryption.

Throughout this research the team produced some valuable resources and insights, including:

- Implementation of [circom-2-arithc](https://github.com/namnc/circom-2-arithc), a fork of the Circom compiler that targets arithmetic circuits, which can be fed into any MPC backend
- Example integration of circom-2-arithc with the popular Secret-Sharing based backend MP-SPDZ in [circom-MP-SPDZ](https://github.com/namnc/circom-mp-spdz).
- Proof of concept application using [MPC-ML](https://hackmd.io/YsWhryEtQ0WwKyerSL8oCw#Circomlib-ML-Patches-and-Benchmarks) with [keras-2-circom-MP-SPDZ](https://github.com/namnc/circom-mp-spdz/blob/main/ML-TESTS.md) which extends keras-2-circom-ZK to [keras-2-circom-MPC](https://github.com/namnc/keras2circom).
- [Modular Layer benchmarks](https://github.com/namnc/circom-mp-spdz/blob/main/BENCHMARK.md) for the keras model.

We decided to sunset the project for a few reasons:

- The overwhelming amount of effort to fully implement it.
- The low current traction of users (could be due to Circom). Hence an [MPC-Framework](https://pse.dev/en/projects/mpc-framework) variant may be of more public interest.
- The existence of competitors such as [Sharemind MPC into Carbyne Stack](https://cyber.ee/uploads/Sharemind_MPC_CS_integration_a01ca476a7.pdf).

Therefore, we will leave it as a paradigm, and hope that any interested party will pick it up and continue its development.
