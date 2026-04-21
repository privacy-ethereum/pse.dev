---
id: "unirep-protocol"
name: "UniRep Protocol"
image: "unirep.svg"
section: "archived"
projectStatus: "inactive"
category: "application"
tldr: "A Zero-Knowledge Protocol built to handle anonymous user data."
license: "MIT"
previousBrandImage: "unirep-previousBrand.webp"
tags:
  keywords: ["Anonymity/privacy", "Social", "Identity", "Reputation"]
  themes: ["build", "play"]
  types: ["Legos/dev tools, Protocol"]
  builtWith: ["semaphore", "circom"]
links:
  github: "https://github.com/Unirep"
  website: "https://developer.unirep.io/docs/welcome"
  twitter: "https://twitter.com/UniRep_Protocol"
  discord: "https://discord.gg/VzMMDJmYc5"
extraLinks:
  buildWith:
    - label: "Getting Started with create-unirep-app"
      url: "https://developer.unirep.io/docs/next/getting-started/create-unirep-app"
  play:
    - label: "Try it out: UniRep.social (Staging)"
      url: "https://social-staging.unirep.workers.dev"
    - label: "Try it out: Trustlist (coming soon) "
      url: "https://trustlist.pse.dev"
---

### Overview

UniRep is a zero-knowledge protocol that securely manages user data through anonymous identifiers, enabling trustless interactions and enhanced user privacy in applications. UniRep expands the notion of reputation to include various user data aspects, such as preferences, activity, alignments, and ownership.

Using anonymous identifiers ([epoch keys](https://developer.unirep.io/docs/protocol/epoch-key)), the protocol allows for trustless engagement with applications while preserving user privacy. This approach promotes non-custodial applications that don't hold user data, reducing data breach risks and emphasizing security for both users and developers.

UniRep was originally proposed by BarryWhiteHat in this [ethresear.ch](https://ethresear.ch) post.

### Features

UniRep aims to be the ultimate foundation for constructing tailored, yet fully compatible, zero-knowledge (zk) applications. It functions as a powerful memory layer for zk, offering private, non-repudiable data storage and retrieval capabilities. With UniRep, users can effortlessly receive data, prove facts about their information, and store the results while enjoying robust privacy assurances. The protocol empowers developers to create bespoke zk applications without compromising on interoperability and efficiency.

Key UniRep features include:

- **Data Storage**: Unirep allows small amounts of data to be associated with anonymous users. Applications can conditionally associate data, like requiring a user to prove control of an Ethereum address before attesting to it.
- **Extensible Proofs**: The system is designed to be extended with custom application logic. For example, an application might require proof of [Ethereum address control to sign up](https://github.com/Unirep/zketh/blob/b7e0fdf3dcc1b3f97673da20837ed9c7d3e27c9f/packages/circuits/circuits/signupWithAddress.circom).
- **Trustless Interoperability**: Applications can interconnect by having users create proofs using publicly available state.
- **No Forced Data Sharing**: Unirep applications cannot see what data belongs to what user, unless the user reveals it. User data also cannot be changed unless the user provides the application with an [epoch key](https://developer.unirep.io/docs/protocol/epoch-key).

### Applications

- Anon Transfer - [Website](https://anon-transfer.online/) | [GitHub](https://github.com/vivianjeng/anon-transfer)
- Trustlist - [Website](https://trustlist.xyz/) | [GitHub](https://github.com/trustlist/trustlist)
- Unirep Social TW - [GitHub](https://github.com/social-tw/social-tw-website)
- Unirep Social - [Website](https://unirep.social/) | [GitHub](https://github.com/Unirep/Unirep-Social)
- Sacred Protocol - [Website](https://www.sacredprotocol.com/)
- My-Badge - [GitHub](https://github.com/kittybest/my-badge)
- Voteathon - [Website](https://voteathon.org/) | [GitHub](https://github.com/NicoSerranoP/voteathon)
