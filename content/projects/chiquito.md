---
id: "chiquito"
name: "chiquito"
image: ""
section: "pse"
projectStatus: "inactive"
category: "devtools"
tldr: "A modern ZKP language and compiler for plonkish and AIR arithmetizations"
tags:
  themes: ["build"]
  types:
    [
      "Legos/dev tools",
      "Lego sets/toolkits",
      "Proof of concept",
      "language",
      "dsl",
    ]
  keywords: ["DSL", "language", "rust", "python", "halo2"]
  builtWith: ["halo2", "rust"]
links:
  github: "https://github.com/privacy-scaling-explorations/chiquito"
  website: "https://docs.pecadorplonkish.xyz/"
  twitter: ""
---

Chiquito is a high-level structured language for implementing zero knowledge proof circuits, currently being implemented in the DSL Working Group of PSE. It is a state machine zk-language that provides better syntax and abstraction. It can automatically compiler arbitrary boolean expressions for state machine transitions. It can optimise the resulting arithmetization. Chiquito has a Halo2 backend, which is a low level zkDSL that writes circuits using the PLONKish arithmetization and is working on supporting additional backends. Chiquito circuits can be written using both Python and Rust.
