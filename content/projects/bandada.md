---
id: "bandada"
name: "Bandada"
image: "bandada.webp"
section: "pse"
projectStatus: "inactive"
category: "application"
tldr: "An open-source tool for managing privacy-preserving groups of anonymous individuals."
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
    ]
  types:
    [
      "Legos/dev tools",
      "Lego sets/toolkits",
      "Prototype",
      "Proof of concept",
      "Infrastructure/protocol",
      "Plugin",
      "Application",
    ]
  builtWith: ["semaphore", "zk-kit"]
  themes: ["build", "play"]
links:
  github: "https://github.com/bandada-infra/bandada"
  website: "https://bandada.pse.dev"
  twitter: "https://twitter.com/BandadaDevs"
extraLinks:
  learn:
    - label: "Bandada Website"
      url: "https://bandada.pse.dev/"
    - label: "Bandada Documentation"
      url: "https://docs.bandada.pse.dev/"
---

### Overview

[Bandada](https://bandada.pse.dev/) is a project designed to simplify the management of privacy-preserving groups. It is aimed at developers who want to build privacy-based applications and integrate anonymity sets, as well as non-developers working in DAOs, governments, international institutions, non-profit organizations, and associations that want to create and manage anonymous groups.

Bandada offers a plug-and-play infrastructure, reducing the time and complexity required for managing anonymity sets. It enables anonymous signaling, such as voting, messaging, logging in, or endorsing, in various use cases like private organizations, GitHub repository contributors, and groups of wallets holding a specific NFT.

### Features

- Easily create onchain or offchain anonymous groups with a few clicks using the Bandada Admin Dashboard.

- Decide how members will join, with a unique invitation URL or by proving credentials.

- Select which credentials users will need to prove to join a group (GitHub, Twitter, [EAS](https://attest.org/), Blockchain information, etc.). Multiple credentials using logical operators and parentheses are supported.

- Build your application on top of Bandada, leveraging completely anonymous signals (like votes, endorsements, claims, messages, etc.)

### Background

In Spanish, "Bandada" means "flock" or "group" of birds or animals moving together in a coordinated manner. Groups are an important concept when we speak about privacy and zero-knowledge technologies, they can be thought of as anonymity sets. Credentials are a way to establish necessary trust between a set of participants while letting users keep control over how their identities are stored and used.

Bandada allows you to create groups and establish trust within the participants by ensuring that everyone who joins the group must meet the credential requirements.

### How Does It Work

Bandada consists of a back-end to store the groups and provide the API, two front-ends: the dashboard to manage groups and members and a demo application to allow end-users to join the groups, and the contracts. Additionally, it provides a set of JavaScript libraries to support developers.

The groups are currently binary Merkle trees compatible with the Semaphore protocol, but additional data structures will be integrated in the future. Two types of groups can be created from the dashboard: manual or credential groups. In the former, you can add members by entering IDs directly or by creating invite links, while in the latter you can define credentials that members must prove they have in order to access the group.

Once you create your manual group in the dashboard, you can either create an API key to add or remove members or use the invite codes to add members with the [@bandada/api-sdk](https://github.com/bandada-infra/bandada/tree/main/libs/api-sdk) library. Credential groups can instead be accessed by redirecting users to an appropriate page in the dashboard, Bandada will ask users for permission to fetch their credentials and check if they are eligible.

Bandada also provides a preset of credential validators that can be extended with the [@bandada/credentials](https://github.com/bandada-infra/bandada/tree/main/libs/credentials) library.

### Use Cases

- Group with members who have contributed to a specific GitHub repository.

- "Whitelist" a group of GitHub devs who have contributed to top DAOs' repositories.

- Group of people with more than X followers on Twitter.

- Custom anti-Sybil mechanism.

- Group of people in an organization like DAO, company, etc.

- Unlocking private interactions, such as anonymous feedback, whistleblowing, chat, and voting.

- Groups of wallets holding a specific NFT.

- Token-gated access to content.
