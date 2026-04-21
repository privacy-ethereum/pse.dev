---
id: "pse-halo2"
name: "PSE-Halo2"
image: ""
section: "pse"
projectStatus: "maintained"
tldr: "PSE-Halo2 is a re-architected, KZG-backended fork of Zcash's Halo2, an instantiation of PLONK, with support for more curves and other features."
tags:
  keywords: ["Proof Systems", "PLONK", "KZG", "Halo2"]
  themes: ["build"]
  types: ["Infrastructure/protocol", "Lego sets/toolkits"]
  builtWith: ["halo2", "rust"]
links:
  github: "https://github.com/privacy-scaling-explorations/halo2"
  website: "https://privacy-scaling-explorations.github.io/halo2/"
extraLinks:
  learn:
    - label: "Documentation"
      url: "https://privacy-scaling-explorations.github.io/halo2/"
    - label: "PLONK"
      url: "https://www.youtube.com/watch?v=A0oZVEXav24"
    - label: "Origins of Halo2"
      url: "https://www.youtube.com/watch?v=KdkVTEHUxgo"
---

PSE-Halo2 modified, extended, and eventually [re-architected](https://github.com/privacy-scaling-explorations/halo2/pull/254) the [original Halo2 implementation by Zcash](https://github.com/zcash/halo2) - an instantiation of the PLONK proof system.

The original IPA backend was swapped with KZG for cost-effective L1 verifiability, and comes with a Solidity verifier. Support for many [additional curves](https://github.com/privacy-scaling-explorations/halo2curves) and other [experimental features](https://github.com/kilic/tetris) were added, and the system was eventually re-architected by [splitting the front- and backends](https://github.com/privacy-scaling-explorations/halo2/pull/254). PSE-Halo2 has significant contributions from the wider community.
