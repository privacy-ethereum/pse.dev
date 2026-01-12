---
id: "semaphore"
name: "Semaphore"
image: "semaphore.webp"
section: "pse"
projectStatus: "active"
category: "devtools"
tldr: "A zero-knowledge protocol for anonymous interactions."
license: "MIT"
tags:
  keywords:
    [
      "Anonymity/privacy",
      "Social",
      "Identity",
      "Transaction privacy",
      "Voting/governance",
      "Reputation",
      "Education",
      "Scaling",
      "Key management",
      "Other (group membership)",
    ]
  themes: ["build"]
  types: ["Legos/dev tools", "Lego sets/toolkits", "Infrastructure/protocol"]
  builtWith: ["zk-kit", "circom", "snarkjs"]
links:
  github: "https://github.com/semaphore-protocol"
  website: "https://semaphore.pse.dev/"
  telegram: "https://semaphore.pse.dev/telegram"
  twitter: "https://semaphore.pse.dev/x"
extraLinks:
  play:
    - label: "Semaphore Demo"
      url: "https://demo.semaphore.pse.dev/"
  buildWith:
    - label: "Semaphore CLI (Getting Started)"
      url: "https://docs.semaphore.pse.dev/getting-started"
    - label: "Semaphore JS libraries"
      url: "https://docs.semaphore.pse.dev/guides/identities"
    - label: "Semaphore Boilerplate"
      url: "https://github.com/semaphore-protocol/boilerplate"
  learn:
    - label: "Semaphore Website"
      url: "https://semaphore.pse.dev"
    - label: "Semaphore Documentation"
      url: "https://docs.semaphore.pse.dev"
    - label: "Semaphore Board"
      url: "https://github.com/orgs/semaphore-protocol/projects/10/views/1"
---

### Overview

[Semaphore](https://semaphore.pse.dev/) is a generic privacy layer. Leveraging zero-knowledge technology, users can prove their membership in groups and send messages (extending from votes to endorsements)
off-chain or across EVM-compatible blockchains, all without revealing their personal identity. Use cases include private voting, whistleblowing, anonymous DAOs, and mixers.

Semaphore is designed to be a simple and generic privacy layer for decentralized applications (dApps). It encourages modular application design, allowing
dApp developers to choose and customize the on-chain and off-chain components they need.

The core of the protocol is the circuit logic. In addition to circuits, Semaphore provides [Solidity contracts](https://github.com/semaphore-protocol/semaphore/tree/main/packages/contracts) and
[JavaScript libraries](https://github.com/semaphore-protocol/semaphore/tree/main#-packages) that allow developers to generate zero-knowledge proofs and verify them with minimal effort.

### Features

With Semaphore, you can allow your users to do the following:

1. [Create a Semaphore identity](https://docs.semaphore.pse.dev/guides/identities)
2. [Add their Semaphore identity to a group (i.e. Merkle tree)](https://docs.semaphore.pse.dev/guides/groups)
3. [Send a verifiable, anonymous message (e.g. a vote or endorsement)](https://docs.semaphore.pse.dev/guides/proofs)

When a user broadcasts a message, Semaphore zero-knowledge proofs can ensure that the user has joined the group and hasn't already cast a message with a nullifier.

### Ways to contribute

- Submit your idea to PSE's [acceleration program](https://github.com/privacy-scaling-explorations/acceleration-program) (check out this [discussion](https://github.com/orgs/semaphore-protocol/discussions/463) for potential ideas).
- Work on [open issues](https://github.com/semaphore-protocol/semaphore/contribute)
- Suggest new terms for our [glossary](https://docs.semaphore.pse.dev/glossary) ([website-issue](https://github.com/semaphore-protocol/website/issues/new?assignees=&labels=documentation&template=---glossary-term.md&title=))
- Propose new networks for our [deployed contracts](https://semaphore.pse.dev/docs/deployed-contracts) ([semaphore-issue](https://github.com/semaphore-protocol/semaphore/issues/new?assignees=&labels=&template=----network.md&title=))
- Suggest new developer tools ([semaphore-issue](https://github.com/semaphore-protocol/semaphore/issues/new?assignees=&labels=feature+%3Arocket%3A&template=---package.md&title=))
- Share your Semaphore project with us ([semaphore-issue](https://github.com/semaphore-protocol/semaphore/issues/new?assignees=&labels=documentation++%F0%9F%93%96&template=----project.md&title=))
- Share ideas for new features ([semaphore-issue](https://github.com/semaphore-protocol/semaphore/issues/new?assignees=&labels=feature+%3Arocket%3A&template=---feature.md&title=))
- Create a report if you find any bugs in the code ([semaphore-issue](https://github.com/semaphore-protocol/semaphore/issues/new?assignees=&labels=bug+%F0%9F%90%9B&template=---bug.md&title=))

As a Semaphore contributor, you'll be able to claim a special GitPOAP per year 🏅
