---
authors: ["Bandada Team"]
title: "Bandada is live!"
image: "/articles/bandada-is-live/bandada-is-live-cover.webp"
tldr: "This post was written by the Bandada team. /n/n We are happy to announce the public release of Bandada V1! Try our [app](https://bandada.pse.dev/) out or run it yourself locally [v1.0.0-alpha](https://github.com/privacy-scaling-explorations/bandada/releases/tag/v1.0.0-alpha)"
date: "2023-08-23"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/p3Mtft28FG1ctgeUARVEKLTK_KexnWC6T4CUHaQark4"
tags:
  [
    "bandada",
    "semaphore",
    "privacy",
    "zero-knowledge proofs",
    "identity",
    "credentials",
    "security",
    "infrastructure/protocol",
  ]
projects: ["bandada", "semaphore"]
---

## **Background**

Bandada is a public infrastructure project that allows you to easily create and manage privacy-preserving groups of anonymous individuals. It is a plug-and-play, free [SaaS](https://en.wikipedia.org/wiki/Software_as_a_service) or self-hosted solution, for developers, DAOs, governments, and individuals that care about privacy.

## Anonymous Groups and Credentials

Groups are an important concept when we speak about privacy and zero knowledge technologies, they can be thought of as anonymity sets. Credentials are a way to establish necessary trust between a set of participants while letting users keep control over how their identities are stored and used.

Bandada allows you to create groups and establish trust within the participants by ensuring that everyone who joined the group needed to meet the credential requirements.

## Why _Bandada_?

In Spanish, "Bandada" means "flock" or "group" of birds or animals moving together in a coordinated manner.

1.  **Representation of Anonymous Groups:** Just like a flock of birds or animals moving together, Bandada aims to create privacy-preserving groups where individuals can act collectively without revealing their identities.
2.  **Coordinated and Secure Interaction:** Birds in a flock exhibit coordinated movements for navigation, safety, or foraging. Similarly, Bandada enables coordinated and secure interactions among the members of anonymous groups. The infrastructure provided allows for seamless communication and collaboration within these groups without compromising individual identities.

## **Highlights**

### F**eatures**

- Easily create onchain or offchain anonymous groups with a few clicks using our **Bandada Admin Dashboard**
- Decide **how members will join,** with a unique invitation URL or by proving credentials
- Select **which credentials** they will need to prove to join the group (GitHub, Twitter, etc.)
- **Build your application** on top of Bandada, leveraging completely anonymous signals (like votes, endorsements, claims, messages, etc.)

### Use Cases

- Group with members who have contributed to a specific GitHub repository

  - "Whitelist" a group of GitHub devs who have contributed to top DAOs repositories.

- Group of people with more than X followers on Twitter

  - Custom anti-sybil mechanism

- Group of people in an organization like DAO, company, etc.

  - Unlocking private interactions like anonymous feedback, whistleblowing, chat, and voting.

- (future) Groups of wallets holding a specific NFT

  - Token-gated access to content

### Documentation:

- **Bandada API Docs** [https://api.bandada.pse.dev](https://api.bandada.appliedzkp.org/)
- **Bandada API SDK** [https://github.com/privacy-scaling-explorations/bandada/tree/main/libs/api-sdk#readme](https://github.com/privacy-scaling-explorations/bandada/tree/main/libs/api-sdk#readme)
- **Bandada credentials library** [https://github.com/privacy-scaling-explorations/bandada/tree/main/libs/credentials](https://github.com/privacy-scaling-explorations/bandada/tree/main/libs/credentials)
- **Install it locally** [https://github.com/privacy-scaling-explorations/bandada#-install](https://github.com/privacy-scaling-explorations/bandada#-install)
- **Run it with Docke**r [https://github.com/privacy-scaling-explorations/bandada#running-in-docker](https://github.com/privacy-scaling-explorations/bandada#running-in-docker)

## How does it work?

Bandada consists of a back-end to store the groups and provide the **[API](https://github.com/privacy-scaling-explorations/bandada/blob/docs/readme-files/apps/api)**, two front-ends: the **[dashboard](https://github.com/privacy-scaling-explorations/bandada/blob/docs/readme-files/apps/dashboard)** to manage groups and members and a **[demo](https://github.com/privacy-scaling-explorations/bandada/blob/docs/readme-files/apps/client)** application to allow end-users to join the groups, and the **[contracts](https://github.com/privacy-scaling-explorations/bandada/blob/docs/readme-files/apps/contracts).** Additionally, it also provides a set of JavaScript libraries to support developers.

![](/articles/bandada-is-live/YLKtfrsyR1gTNXMjHh8ec.webp)

The groups are currently binary Merkle trees compatible with the [Semaphore protocol,](https://semaphore.appliedzkp.org/) but additional data structures will be integrated in the future.

Two types of groups can be created from the dashboard: manual or credential groups. In the former, you can add members by entering IDs directly or by creating invite links, while in the latter you can define credentials that members must prove they have in order to access the group.

Once you create your manual group in the dashboard you can either create an API key to add or remove members or use the invite codes to add members with the `@bandada/api-sdk` library.

Credential groups can instead be accessed by redirecting users to an appropriate page in the dashboard. Bandada will ask users permissions to fetch their credentials and check if they are eligible.

Bandada also provides a preset of credential validators that can be extended with the `@bandada/credentials` library.

## Learning Resources & Project Ideas

Check [here](https://www.notion.so/Bandada-Learning-Resources-Project-Ideas-68803d6da8374a4399824e9a93995ff3?pvs=21) for new and upcoming learning resources like tutorials, videos, and additional documentation and growing project ideas to do with Bandada.

Lastly, keep exploring our [Bandada Notion](https://www.notion.so/Bandada-82d0d9d3c6b64b7bb2a09d4c7647c083?pvs=21) where we'll keep it updated with the latest news.

## Bandada Moonrise

Shortly after this announcement, we´re starting Bandada Moonrise, a focused effort, and campaign to showcase Bandada and gather as much feedback as possible from the community to tailor the future roadmap.

If you're part of a DAO, Web3, or ZK Dev community and want us to give a presentation, please reach us out!

## **What's coming in the future?**

- Onchain invitation groups
- Onchain credential groups (like POAPs, NFTs, and tokens balance)
- Easier deployments using Docker containers
- Combining credential providers
- Supporting different identity protocols
- And much more!

Check our [Bandada - **Features** Roadmap](https://www.notion.so/Bandada-Features-Roadmap-8f9b1cf68e2b4a48a03ce898521370c5?pvs=21) to explore more

Want to share ideas? Want to help us build Bandada? Reach us by tagging us with @Bandada in [PSE Discord](https://discord.com/invite/sF5CT5rzrR) or by discussing issues in our [GitHub project board](https://github.com/orgs/privacy-scaling-explorations/projects/18/views/1).

Also if you contribute to Bandada´s codebase, then you´re eligible to claim a special POAP!

🥳 Check if you´re eligible and get yours here: [https://www.gitpoap.io/eligibility](https://www.gitpoap.io/eligibility)

Thanks to all contributors and Bandada supporters! In particular @cedoor, @vplasencia, @saleel, @aguzmant103, @rachelaux, @beyondr, @wanseob, @mari, @kat
