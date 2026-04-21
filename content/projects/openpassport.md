---
id: "openpassport"
name: "Self"
image: "openpassport.webp"
graduated: true
section: "grant"
projectStatus: "active"
category: "application"
tldr: "OpenPassport lets you check a passport is valid in zero-knowledge"
tags:
  keywords:
    ["Passports", "Identity", "Anonymity/privacy", "Signatures", "Social"]
  builtWith: ["circom", "snarkjs"]
links:
  github: "https://github.com/zk-passport/openpassport"
  website: "https://openpassport.app"
  twitter: "https://x.com/openpassportapp"
  telegram: "https://t.me/openpassport"
---

OpenPassport originally started at ETHGlobal Paris 2023 as a hackathon project, with the goal of verifying the validity of passports in zero knowledge.
The idea was simple: electronic passports are embedded with a chip that contains an attestation signed by the issuing country. It should be possible to read the chip's content using NFC and use it to generate zk proofs.

After the first prototype, OpenPassport developed the ability to do selective disclosure proofs for attributes such as nationality or age, without disclosing any other private information. Because countries use different signature algorithms, many circuits had to be developed to offer the widest support possible.

The motivation behind this work lies in the fact that it can help break the deadlock identity verification is currently stuck in. Traditional KYC requires sharing all private data with a centralized verifier, and it's becoming easily manipulable using deepfakes. It can also aid in Sybil resistance, in combination with other identity solutions for users who don't have a biometric passport.

After getting help from PSE for more than a year, OpenPassport graduated and grew to a team of five. In February 2025, OpenPassport joined Self Protocol to get the firepower to ship zk passport verification at a large scale. They launched in production with support for 130+ countries and are now working on adding support for other identity documents.
