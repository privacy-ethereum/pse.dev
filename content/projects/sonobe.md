---
id: "sonobe"
name: "Sonobe Folding Library"
image: "sonobe.webp"
section: "pse"
projectStatus: "active"
category: "devtools"
tldr: "Modular folding library supporting multiple schemes and decider backends"
tags:
  keywords: ["Folding", "IVC"]
  themes: ["build"]
  types: ["Infrastructure/protocol", "Lego sets/toolkits"]
  builtWith: ["rust"]
links:
  github: "https://github.com/privacy-scaling-explorations/sonobe"
  website: "https://sonobe.pse.dev/"
---

In collaboration with [0xPARC](https://0xparc.org), [Sonobe](https://github.com/privacy-scaling-explorations/sonobe) is a modular library to fold arithmetic circuit instances in an Incremental Verifiable computation (IVC) style. It supports multiple frontends, multiple folding schemes, and multiple decider backends, allowing users to plug-and-play different components.

- **Frontends:**
  - Arkworks
  - Circom
  - Noir
  - Noname
- **Folding schemes:**
  - [Nova](https://eprint.iacr.org/2021/370), supporting also both the [Mova](https://eprint.iacr.org/2024/1220) & [Ova](https://hackmd.io/V4838nnlRKal9ZiTHiGYzw) variants.
  - [CycleFold](https://eprint.iacr.org/2023/1192)
  - [HyperNova](https://eprint.iacr.org/2023/573)
  - [ProtoGalaxy](https://eprint.iacr.org/2023/1106)
- **Decider backends:**

  - Groth16 and KZG commitment [proofs](https://sonobe.pse.dev/usage/decider.html#decider-prove) which are [verifiable on-chain](https://sonobe.pse.dev/usage/solidity-verifier.html).

- **Other features:**

  - [ZK Layer](https://sonobe.pse.dev/usage/nova-zk.html)
  - In-browser [WASM usage](https://sonobe.pse.dev/usage/wasm.html)

- **Example projects:**
  - [Bitcoin light client](https://github.com/dmpierre/sonobe-btc) leveraging Sonobe
  - [Hash chains](https://github.com/arnaucube/hash-chain-sonobe): proving chains of Sha256 and Keccak256 hashes
