---
authors: ["PSE Team"]
title: "Semaphore v3 Announcement"
image: "/articles/semaphore-v3-announcement/cover.webp"
tldr: ""
date: "2023-02-09"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/Yi4muh-vzDZmIqJIcM9Mawu2e7jw8MRnwxvhFcyfns8"
tags:
  [
    "semaphore",
    "privacy",
    "zero-knowledge proofs",
    "anonymity/privacy",
    "identity",
    "voting/governance",
    "ethereum",
    "security",
    "toolkits",
    "infrastructure/protocol",
  ]
---

Semaphore V3 is live!

We are happy to announce the release of Semaphore [v3.0.0](https://github.com/semaphore-protocol/semaphore/releases) with lots of improvements to the protocol and developer tooling.

## Background

Semaphore is a zero-knowledge protocol that lets Ethereum users prove their membership of a group and send signals such as votes or endorsements without revealing their original identity. The ability to do these two simple things anonymously opens up a world of possibilities — some of which are already being worked on, some we can’t wait to see explored and hopefully some we haven’t even thought of yet :D.

Semaphore is not a user-facing application. The protocol is designed to allow Ethereum developers to build dapps with privacy as a foundation.

## Highlights

### New features

- **[Semaphore CLI](https://github.com/semaphore-protocol/semaphore/tree/main/packages/cli):** Your Semaphore project can now be created with a simple command-line tool.
- **[Semaphore Hardhat plugin](https://github.com/semaphore-protocol/semaphore/tree/main/packages/hardhat):** The Hardhat plugin for Semaphore can be used to deploy the `Semaphore.sol`  contract with a Hardhat task.
- **[Boilerplate](https://github.com/semaphore-protocol/boilerplate):** Try Semaphore with our new boilerplate demo and learn more about how it works by exploring the code. The boilerplate is also a GitHub template you can use for your project.

Read the whole list of features in the [ChangeLog](https://github.com/semaphore-protocol/semaphore/releases) and learn how to upgrade in the Migration section.

### Refactoring

- One Verifier to rule them all: 17 verifier contracts were consolidated to a single one, keeping the same capabilities but reducing 3800 lines of code - thus making Semaphore deployments much cheaper.
- New Poseidon library: @semaphore-protocol/identity now uses poseidon-lite, a stripped down Poseidon implementation pulled from circomlibjs v0.0.8. This made it possible to drastically reduce previously unused code imported from the circomlibjs library.

### Bug fixes

- Editor’s entity may be overwritten (V-SEM-VUL-003)
- merkleRootDuration cannot be changed (V-SEM-VUL-007)
- Infinite loop if input array is too large (V-SEM-VUL-006)
- Different checks used to determine if group exists (V-SEM-VUL-010)
- No zero value validation (V-SEM-VUL-001)

  See the audit report for some of the major bugs we addressed.

### Audit

Semaphore v3 was formally audited and verified by our friends at [Veridise](https://twitter.com/VeridiseInc). You can read the full report here: [Veridise Auditing Report - Semaphore version 3.0](https://github.com/semaphore-protocol/semaphore/files/10492413/VAR_Semaphore.pdf) and their blogpost [Breaking the Tree: Violating Invariants in Semaphore](https://medium.com/veridise/breaking-the-tree-violating-invariants-in-semaphore-4be73be3858d)

We believe that building on secure foundations increases trust for all layers, a trust that is essential to propelling our industry forward. We´re very happy to have worked with Veridise and look forward to continuing our collaboration in the future.

### Documentation

- [Documentation V3](https://semaphore.appliedzkp.org/docs/introduction) is released
- [i18n Support](https://lingoport.com/what-is-i18n/): our website now supports local languages and cultural settings. We are [happy to welcome](https://github.com/semaphore-protocol#ways-to-contribute) anyone who would like to help us translate the Semaphore website and documentation into other languages.
- Search bar: we’re incorporating a search bar to our documentation.

### Translations

We completed our first efforts for the website documentation translation:

🇪🇸 [#67](https://github.com/semaphore-protocol/website/pull/67): completes Spanish translations

A blogpost sharing the translation decisions and rationale will be shared soon, as well as future approaches to make the translation process scalable to other languages.

## Semaphore in Action

There are many dapps already using Semaphore in categories spanning voting, social media, gaming, IoT and education. These dapps are in different stages of maturity, from POC and demos to live products. Below is a subset that shows a range of what’s possible, which we hope will inspire future projects:

**Governance**

- [Coeo](https://showcase.ethglobal.com/hackfs/coeo) is a decentralized collaboration platform that prioritizes privacy and enables organizations to collaborate through a network-wide discussion forum and social network.
- [Ethereum Social Contract](https://ethglobal.com/showcase/ethereum-social-contract-gwt57) proposes a decentralized and compliant justice system for web3. Semaphore provides the zkSNARK underpinning for our private transaction dApp.
- [Emergence](https://ethglobal.com/showcase/emergence-o3tns) is an on-chain video platform that distribute tokens during calls, generates a script for DAO documentation and increases DAO health and onboarding quality.
- [heyanon](https://www.heyanon.xyz/) is a way for people who are in cool groups or did cool stuff on Ethereum to broadcast messages anonymously on Twitter.
- [Heyanoun](https://www.heyanoun.xyz/) allow Nouners to express what they believe while maintaining anonymity. Nouners can post credible pseudonymous messages at heyanoun.xyz.
- [Om](https://om-rose.vercel.app/) is a DAO platform that has a decentralized and private data storage layer. In this type of access, specific users will have access to properties of the data and not the full data.
- [Sacred](https://www.thatsacred.place/) is an anonymous forum to foster horizontal, inclusive and effective communities.
- [Zero Voting](https://zkvote.vercel.app/) allows you to vote quadratically among the choices you get without revealing your address.
- [zkPoH](https://github.com/elmol/zk-proof-of-humanity) brings privacy to Proof of Humanity (PoH). By using Semaphore, a registered PoH user can prove their humanity without doxing themselves.
- [zkVoice](https://ethglobal.com/showcase/zkvoice-fighting-plutocrat-dao-communities-ptrzp) is a coordination tool that allows community members with less voting power to secretly signal their disapproval and come together to beat the Plutocrat Moloch.

**IoT Gating**

- [zMorpheus](https://github.com/a42io/ETHBogota) delivers a pseudonymous, seamless zk-based token-gating solution for real-world use cases of proving ownership of NFTs with privacy on IoT Devices.

**Education / Professional**

- [Block Qualified](https://github.com/0xdeenz/bq-core) aims to become an open education platform where anyone can create their own learning experience, gain credentials and attest qualifications while preserving their privacy.
- [Continuum](https://continuum.tomoima525.com/home) proves your web2 work experience on-chain without revealing your identity.

**Proof of Personhood / Anti Sybil**

- [Interep](https://interep.link/) uses zero knowledge proofs to verify reputation from an existing account such as Github or Twitter without retaining any identifying information.
- [Menshen](https://ethglobal.com/showcase/menshen-i2kq1) provides sybil resistant proof-of-personhood NFTs, and is built for everyone. It does this by allowing anyone with a smartphone camera or webcam to mint a Menshen ID.
- [Worldcoin](https://worldcoin.org/blog/developer/the-worldcoin-protocol) is a Privacy-Preserving Proof-of-Personhood Protocol (PPPoPP). Biometric data is hashed to create a Semaphore identity which is added to a group for future UBI.

**NFT Identity**

- [Arbor](https://arbor.audio/) is a Schelling game where the objective is to publicly co-create songs worthy of purchase by NFT collectors using Semaphore as anonymous voting on stems.
- [ClubSpace](https://www.joinclubspace.xyz/) is a virtual party platform that enables creators to import music playlists, promote NFTs, and provide free NFTs to attendees who can prove their attendance via ZKPs.
- [ZKTokenProof](https://polygon.zktokenproof.xyz/) token-gating solution for ticketing features with privacy. Anyone can manage events with NFT gating where participants don’t need to reveal their wallet addresses.

**Social Media**

- [Unirep](https://github.com/Unirep/Unirep) is a social media platform that uses anonymous reputation, allowing people to provide relational context without revealing specifics of their history.
- [Truth](https://ethglobal.com/showcase/truth-2wbd7) is a photo based social media network where pictures need to be taken in real-time inside the app.
- [Zkitter](https://mirror.xyz/privacy-scaling-explorations.eth/P4jDH1gLrVQ-DP5VyIKQrlPAJUTDhtXZkFl2vp8ewSg) is an anon-friendly social network that provides familiar social media functions such as posting, chatting, following, and liking, but with a private identity layer under the hood.
- [ZK3](https://github.com/monemetrics/lensbot-docs/blob/master/docs/zk3.md) is a Lens Protocol + Semaphore Integration that allows users of the Lens protocol to govern post interactions (who can comment, mirror, etc) through ZKPs and group membership.

**Gaming / DeFi**

- [Chain Statements](https://ethglobal.com/showcase/chain-statements-kdurw) is a way to generate statements for your crypto funds using ZKPs privately and permissionlessly.
- [zkIdentity](https://github.com/sigridjineth/zkIdentity) is a private identity claim system with zero-knowledge for DarkForest.eth. It allows a previous winner claim prizes without revealing the recipient's Ethereum address.

**Interoperability**

- [Anchor](https://github.com/webb-tools/semaphore-anchor) is an interoperable privacy gadget for creating anonymous proof of membership on blockchains. In other words, modifying Semaphore to be used multichain.
- [World ID @ Mina](https://ethglobal.com/showcase/world-id-mina-embt9) aims to integrate the World ID proof of personhood (PoP) system into snarkyjs, to make PoP available on Mina smart contracts and other applications.
- [zkVote](https://github.com/KimiWu123/zkvote) is a method for an approved user to broadcast an arbitrary string without exposing their identity. It uses Semaphore as a base to achieve private voting.
- [Zerokit](https://github.com/vacp2p/zerokit) Rust support library for using Semaphore. Rust rewrite of zk-kit, but just focuses on Semaphore (for now).

**Ecosystem & Environment**

- [PreciDatos](https://github.com/datadrivenenvirolab/PreciDatos) is a blockchain-based system for incentivizing actors to disclose accurate climate data.
- [Terrarium](https://ethglobal.com/showcase/terrarium-ztoes) enables proving membership of Terrarium Conservation Group, sending signals (votes, endorsements) on species protection using ZK and enabling secured conversations.

**Experience**

- [TAZ](https://taz.appliedzkp.org/) was a Devcon 6 experience that allowed participants to experience anonymous protocols. Participants joined with a QR code and could anonymously co-create art, engage in Q&A and use heyAnon and Zkitter.

_Disclaimer: the Semaphore/ PSE team has not verified the security or reliability of these projects. Do your own research before using or integrating with a live product._

## GitPOAPs

If you contributed to Semaphore´s codebase, then you´re eligible to claim a special POAP!

🥳 Check if you´re eligible and get yours here: [https://www.gitpoap.io/eligibility](https://www.gitpoap.io/eligibility)

🏗 Nothing to claim yet? Well no worries! There are many issues in the codebase that you can help us with. You can contribute to Semaphore today to get the 2023 POAP. [https://github.com/semaphore-protocol/#ways-to-contribute](https://github.com/semaphore-protocol/#ways-to-contribute)

## What's coming in the future?

- [Semaphore v4](https://github.com/orgs/semaphore-protocol/projects/10/views/3) [research](https://github.com/privacy-scaling-explorations/researches/issues/2) is underway. We're researching new ways to generate memberships proof and anonymous signaling, adding composability and recursiveness.
- We'll continue to explore new approaches for translations and bring Semaphore to more communities.
- Semaphore website v3 will come later this year after usability and user research.
- Lastly, we will continue to explore ways to improve the DevEx (Developer Experience) whenever possible in the 3.X.X versions of Semaphore.

Thanks to all contributors and Semaphore supporters! In particular @cedoor, @vplasencia, @rachelaux, @aguzmant103, @0xyNaMu, @recmo , @0xorbus, @uniyj, @vojtechsimetka, @marciob, @omahs, @namrapatel
