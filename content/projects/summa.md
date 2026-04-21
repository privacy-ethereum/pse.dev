---
id: "summa"
name: "Summa"
image: "summa.svg"
section: "pse"
projectStatus: "inactive"
category: "devtools"
tldr: "Protocol enabling centralized exchanges to prove solvency without compromising private information."
tags:
  keywords: ["Anonymity/privacy", "Computational Integrity"]
  themes: ["build", "play"]
  types: ["Infrastructure/protocol", "Application"]
  builtWith: ["halo2"]
links:
  github: "https://github.com/summa-dev"
extraLinks:
  learn:
    - label: "Documentation"
      url: "https://summa.gitbook.io/summa"
---

Summa allows centralized exchanges to demonstrate that their assets exceed their liabilities without revealing critical business information such as individual user balances, total number of users, and total liabilities or assets. It uses zero-knowledge proofs to ensure that exchanges can demonstrate they have sufficient assets to cover all user balances. The protocol involves building a Merkle Sum Tree of user balances, generating proofs for each user, and allowing users to verify these proofs.
