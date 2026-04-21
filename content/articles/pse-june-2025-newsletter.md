---
authors: ["PSE Comms Team"]
title: "PSE June 2025 newsletter"
image: "/articles/pse-june-2025/cover.webp"
tldr: "Check out what PSE teams have been focused on in June 2025!"
date: "2025-07-08"
tags:
  [
    "newsletter",
    "post quantum cryptography",
    "private proof delegation",
    "client side proving",
    "machina io",
    "voprf",
    "tlsnotary",
    "maci",
    "zk-kit",
    "mpc framework",
    "mopro",
    "semaphore",
  ]
projects:
  [
    "post-quantum-cryptography",
    "private-proof-delegation",
    "client-side-proving",
    "machina-io",
    "voprf",
    "tlsn",
    "maci",
    "zk-kit",
    "mpc-framework",
    "mopro",
    "semaphore",
  ]
---

Here’s a round-up of what PSE teams have been up to in June!

## 🧪 Research Highlights

### [Client-Side Proving](https://pse.dev/en/projects/client-side-proving)

The Client-Side Proving team [published benchmarks](https://pse.dev/blog/efficient-client-side-proving-for-zkid) for post-quantum zk-SHA256 circuits, helping assess feasibility for mobile and other tighter bandwidth setups. In the next phase, we will extend our benchmarks beyond zkID and explore client-side proving for Ethereum.

### [Verifiable OPRF (vOPRF)](https://pse.dev/en/projects/voprf)

A [new fork](https://github.com/privacy-scaling-explorations/stealthnote) is underway to bring vOPRF to [Stealthnote](https://stealthnote.xyz/) is underway to integrate [vOPRF](https://pse.dev/en/projects/voprf), enhancing anonymous message broadcasts with improved privacy.

### [Post-Quantum Cryptography](https://pse.dev/en/projects/post-quantum-cryptography)

We’re currently exploring use cases for verifiable fully homomorphic encryption (vFHE) in collaboration with OpenFHE, and trying some initial tests using LaBRADOR/Lazer and Lattirust/LaBRADOR libraries. Up next is writing some simple proof gadgets (like base decomposition) using lattice-based proof system, studying bootstrapping constraints, and aiming towards a concrete Devconnect demo.

### [Private Proof Delegation](https://pse.dev/en/projects/private-proof-delegation)

Our recent blog post explores tradeoffs in a [TEE-based proving prototype](https://pse.dev/en/blog/tee-based-ppd). With that work complete, we’re now prototyping an FHE-SNARK-based proof of concept using OpenFHE. The goal is privacy-preserving delegation with minimal trust in hardware.

### [PlasmaFold](https://pse.dev/projects/plasma-fold)

We’re close to completing an initial implementation of PlasmaFold, a folding-based protocol for scalable commitments. Early results are promising for rollup-friendly verification. Next steps include benchmarking and finalizing the paper.

### [Indistinguishability Obfuscation (iO)](https://pse.dev/en/projects/machina-io)

The iO team has simplified the **Diamond iO** construction and improved performance benchmarks. We’ve published updated analysis of its security assumptions, including all-product and evasive LWE, in [our new paper](https://eprint.iacr.org/2025/236.pdf). We also found a specific construction of pseudorandom function (PRF) adopted only in the implementation might have a security vulnerability. Although this does not affect the security of our theoretical construction because it assumes the black-box use of PRF, we are researching an alternative PRF construction that is secure and practical enough. Next month we will be trying new theoretical techniques to support non-linear operations on BGG+ encodings and GPU implementation for lattice trapdoor operations.

## ⚙️ Development Highlights

### [TLSNotary](https://pse.dev/en/projects/tlsn)

The [alpha.11 release](https://tlsnotary.org/) added SHA-256 hash commitments, simplified notary setup, and significantly reduced prover upload sizes — especially helpful on mobile and poor connections. The team held a retreat in Belgium to roadmap next steps, including deeper integration into plugin systems and broader TEE/zkTLS exploration. They also launched a [**new Docusaurus-based website**](https://tlsnotary.org) which combines the landing page and documentation.

### [MACI](https://pse.dev/en/projects/maci)

MACI is being battle-tested across governance integrations. Recent milestones include an Aragon plugin built on OSx, voting mode updates for v3, and deployment across several zkEVMs. We're benchmarking costs across L2s and preparing for cross-chain governance experiments. Collaborations are underway with Gitcoin, Agora, SIV, and Shutter Network, with a demo of MACI on Aragon scheduled for June.

### [zk-kit](https://pse.dev/en/projects/zk-kit)

This month has been focused on opening zk-kit into being a more community-owned project, new website and contribution guide coming soon! We invite peer projects in our ecosystem to lift modular components that can be useful to others, and contribute to ZK-Kit.

### [MPC Framework](https://pse.dev/en/projects/mpc-framework)

We released a [cross-browser 5PC demo](https://youtu.be/3fwUf1wn_3o?si=NsKh_HAul7VggKF-) and a [major update to Summon](https://pse.dev/en/blog/summon-major-update). Our current work includes SHA256 support, performance tuning, and integrating with MPZ and Polytune. The team is also bringing the framework to new audiences via talks at Rust Sydney, ZuBerlin, EthCC, and SydJS.

### [Mopro](https://pse.dev/en/projects/mopro)

Mopro continues to power zkID integrations across platforms. We released a [mobile version of Stealthnote](https://github.com/vivianjeng/stealthnote-mobile) with 10x performance gains, added new FFI and simulator tools, released [extensive performance benchmarks,](https://zkmopro.org/docs/performance/#halo2) and [published a blog post](https://zkmopro.org/blog/noir-integraion/) detailing how Noir has been integrated into the Mopro project. GPU acceleration efforts are progressing, with upcoming work targeting Android and web environments.

### [Semaphore](https://pse.dev/en/projects/semaphore)

Semaphore is expanding into mobile and scaling up. We’ve added Ethereum mainnet support, supported research on PIR, and started a grant to bring Semaphore to Noir. At ETHDam, we spoke on scaling public goods and [shared slides](https://www.canva.com/design/DAGmbisSaxA/QHrzV9kVOgfRMDrZUEKqvQ/edit). Upcoming events include ZuBerlin and NoirHack. We're collaborating with the Mopro team to bring Semaphore-rs to more mobile-compatible environments, with a goal of demonstrating Semaphore V4 on phones. We're also in ongoing discussions with Worldcoin, particularly around shared research directions in PIR.
