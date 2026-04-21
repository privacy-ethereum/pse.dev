---
id: "zkevm-community"
name: "zkEVM Community Edition"
image: "zkevm.webp"
section: "pse"
projectStatus: "inactive"
category: "devtools"
tldr: "A zero-knowledge proof mechanism for Ethereum block verification."
tags:
  keywords: ["Scaling"]
  themes: ["build"]
  types: ["Infrastructure/protocol", "Lego sets/toolkits"]
  builtWith: ["halo2", "rust", "geth"]
links:
  github: "https://github.com/privacy-scaling-explorations/zkevm-circuits"
---

The zkEVM Community Edition was an early attempt to show that Ethereum’s execution layer could be verified using zero-knowledge proofs. The ambitious pursuit of a [“Type 1” or  "fully and uncompromisingly Ethereum-equivalent"](https://vitalik.eth.limo/general/2022/08/04/zkevm.html) zkEVM helped set off a race among peers and collaborators in the ecosystem, to snarkify Ethereum.

The project began as a collaboration between PSE, Scroll, and Taiko around 2021, a time when large scale ZK applications were not possible and ZK developers had very limited options. Groth16 was the only production-ready zkSNARK proof system but required per-circuit trusted setups, and the rigidity of R1CS meant constraint blowup. However, a viable path toward full validation of Ethereum blocks seemed to open up with the Zcash instantiation of PLONK called Halo2. With Halo2, universal trusted setups, more flexible constraint systems, and reduced constraint counts became feasible, providing a leap in tooling for general compute in ZK.

But prover speeds were not as we know them today, so hand-optimizing circuits for performance – while still maintaining full Ethereum compatibility – was the driving factor of the project. Custom circuits for each component of the Ethereum execution layer were built to squeeze out every optimization possible to make proving accessible to light clients. The goal was to build highly-optimized circuits for EVM opcodes and other components such as state-tree updates, hashing, and signature verification.

The zkEVM Community Edition did not complete a working Type 1 zkEVM, but based on our shared work, Scroll did complete a working Type 2 zkEVM that went live on Mainnet. Our efforts helped lay a path to accessible proving and verification of Ethereum blocks — without additional trust assumptions on light clients. As a result, the entire community moved closer to the ultimate endgame of a maximally decentralized, scalable, and secure Ethereum.
