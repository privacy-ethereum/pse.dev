---
id: "anon-aadhaar"
name: "Anon Aadhaar"
image: "anon-aadhaar.svg"
section: "pse"
projectStatus: "active"
category: "application"
tldr: "Tools for building build privacy-preserving applications using government ID cards, specifically Aadhaar cards in India."
license: "MIT"
tags:
  keywords: ["Anonymity/privacy", "Social", "Identity", "Voting/governance"]
  themes: ["build", "play"]
  types: ["Legos/dev tools", "Lego sets/toolkits", "Proof of concept"]
  builtWith: ["circom", "rsa", "TypeScript", "Solidity"]
links:
  website: "https://anon-aadhaar.pse.dev/"
  github: "https://github.com/privacy-scaling-explorations/anon-aadhaar"
  telegram: "https://t.me/anon_aadhaar"
  twitter: "https://twitter.com/AnonAadhaar"
extraLinks:
  play:
    - label: "Try it out: On-Chain Voting App"
      url: "https://boilerplate.anon-aadhaar.pse.dev/"
---

### Overview

Anon Aadhaar is a project that allows Aadhaar ID holders to prove their Indian residency, optionally revealing some aspects of their identity while hiding the others. The project provides ZK Circuits, SDK for Javascript and Solidity, a demo application, and integrates with the PCD framework for a better developer experience.

### Features

Anon Aadhaar is a zero knowledge protocol that let Aadhaar owners prove their identity in a privacy preserving way.
Key features include:

- **Selective Disclosure**: If your app request to reveal one of the field from the identity the circuit will reveal it in its output. There only four fields that could be revealed (Age > 18, Gender, State, Pincode). Note that by default the Prover will reveal nothing from the ID.
- **Nullifier**: Nullifier is a unique identifiers derived from data fields, used to prevent double-spending or duplicate proofs without revealing the actual data.
- **Timestamp**: The timestamp of the signature associated with the data is converted into a UNIX UTC format, enabling Timebased One Time Password verification at the verifier level.

The protocol is served through an SDK containing:

- TypeScript Library: [@anon-aadhaar/core](https://www.npmjs.com/package/@anon-aadhaar/core)
- Solidity Library: [@anon-aadhaar/contracts](https://www.npmjs.com/package/@anon-aadhaar/contracts)
- React Library: [@anon-aadhaar/react](https://www.npmjs.com/package/@anon-aadhaar/react)

You can play with our **mobile prover**, which offer a faster proving time:

- [Anon Aadhaar React Native](https://github.com/anon-aadhaar/anon-aadhaar-react-native)

We developed a prover for [Digilocker](https://www.digilocker.gov.in/), that let you generate ZKPs from official documents stored in the Digolocker App, enabling use cases with proof of degrees, UPI, driver license and more.

### Applications:

- Quick Setup - [Website](https://anon-aadhaar-quick-setup.vercel.app/) | [GitHub](https://github.com/anon-aadhaar/quick-setup)
- Boilerplate On-Chain Voting App - [Website](https://boilerplate.anon-aadhaar.pse.dev/) | [GitHub](https://github.com/anon-aadhaar/boilerplate)
- Anon Digilocker - [Website](https://anon-digilocker.vercel.app/) | [GitHub](https://github.com/anon-aadhaar/anon-digilocker)
