---
authors: []
title: "Interep: An on-ramp for reputation"
image: null
tldr: ""
date: "2022-09-13"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/w7zCHj0xoxIfhoJIxI-ZeYIXwvNatP1t4w0TsqSIBe4"
tags:
  [
    "interep",
    "reputation",
    "privacy",
    "identity",
    "ethereum",
    "semaphore",
    "sybil resistance",
    "zero-knowledge proofs",
    "web3",
    "social networks",
  ]
projects: ["interep", "semaphore"]
---

Reputation is built one block at a time, on and off-chain.

[Interep](https://interep.link/) is a bridge for moving reputation from centralized into decentralized systems. Centralized social media and other web2 platforms have captured decades’ worth of social history, so that even people who would prefer to exit these systems are dependent on them as a source of reputation. Interep gives developers a headstart for building sybil-resistant decentralized identity on web3 by leveraging social history built on web2.

With Interep, users don’t need to build their on-chain identities from scratch. Reputation can be imported from existing platforms like Github, Reddit, and Twitter, then anonymized for use on decentralized platforms. Using [zero-knowledge proofs](https://ethereum.org/en/zero-knowledge-proofs/), only the minimum necessary information is revealed. The result is a modular system of provable, private, and portable reputation.

Interep is built on [Semaphore](https://semaphore.appliedzkp.org/), a zero knowledge protocol which allows Ethereum users to prove their membership of a group and send signals anonymously. Interep is currently on testnet. You can [join a group](https://kovan.interep.link/) using your Github, Reddit or Twitter account, or with a POAP held in a connected wallet. Developers can integrate Interep into their dapps using the Interep [APIs](https://docs.interep.link/api/) and [libraries](https://github.com/interep-project/interep.js).

## Anonymity and trust

Anonymity is important for both free expression and safety online – but trust is important too. In an online community, you want to know that the people you interact with are really people; you may also want to know whether they are members of a certain group or have some level of credibility.

Offline, it’s easy to tell whether someone is a real person: they’re standing in front of you. Online, it’s often much harder to know. Bots, spammers and [sybil attacks](https://en.wikipedia.org/wiki/Sybil_attack) (creating large numbers of anonymous or pseudonymous accounts) are rampant in anonymous environments where it’s trivial to create new accounts and difficult or impossible to distinguish legitimate accounts from fake or duplicate ones.

## Identity and reputation

Identity is multifaceted, and reputation is just one important aspect. Reputation is dynamic, spread across a complex web of relationships and past actions. Each person in your orbit holds a partial map of your character: personality traits like reliability, honesty or generosity, your skills, your work history, your associations with other people and organizations. Context is important, too – if you’re notoriously dishonest but very good at your job, you might be in high demand professionally but unwelcome at a poker night.

Similarly online, there is a wide range of contexts where varying levels of reputation and trust are needed. Online social, community and professional networks provide a relatively reliable source of reputation, but often at the cost of giving up control over how other aspects of identity are shared.

In any interaction, on or offline, some aspects of your identity are relevant and others are not. Sometimes, the fact that you are a person is the only relevant detail. In online settings where anonymity is desirable but some level of trust is required, we need a way of sharing what’s relevant and keeping the rest private.

## Reputation Legos

Determining whether someone on the internet is a “real” human, let alone a trustworthy one, is an ongoing challenge, but only minimal information is needed to make significant progress in preventing spam bots and [Sybil attacks](https://en.wikipedia.org/wiki/Sybil_attack). Having >10,000 karma and >5000 coins on Reddit is enough “proof of humanity” for most applications. Everything else on your Reddit profile is irrelevant to the question of whether you’re a real person.

Interep is designed to be a modular piece of a larger reputation system that developers can plug into their stack. Like the building blocks that make up [decentralized finance (DeFi](https://ethereum.org/en/defi/)), these pieces can be permissionless, composable, and interoperable – and may one day form a rich and complex system of identity on Ethereum.

It may not be possible to completely eliminate Sybil attackers and spam bots, but Interep is providing a powerful building block to bring pieces of reputation on to Ethereum. Over time, these reputational building blocks can construct more provably human identities.

## Interep in action

Reputation can be simply defined as recognition by other people of some characteristic or ability. In the Interep system, _providers_ act as the other people, _parameters_ represent characteristics or abilities, and _signals_ are proof of recognition.

Interep begins by defining a source of reputation, then calculating the parameters of reputation, before allowing users to privately signal that they meet a pre-defined reputation criteria.

### Providers

Reputation is only as good as its source. Interep itself does not provide a source of reputation but rather acts as a bridge to make reputation portable from different sources. The current Interep system includes Reddit, Twitter, Github, and [POAP NFTs](https://poap.xyz/) as sources of reputation, referred to as providers.

The Interep process of exporting reputation begins when users select a provider. A provider such as Reddit (via [OAuth](https://docs.interep.link/technical-reference/groups/oauth)) shares information about a user’s profile with Interep. Interep takes the authenticated information and calculates a reputation score. The type of provider is used to generate a new identity and the reputation score determines which group the user can join.

### Parameters

Reputational parameters determine a user’s reputation level as either gold, silver, or bronze. The more difficult-to-fake parameters a user has, the higher their reputation level, and the higher probability of them being an authentic or non-malicious user.

Reddit parameters are defined as the following:

- Premium subscription: true if the user has subscribed to a premium plan, false otherwise;
- Karma: amount of user's karma;
- Coins: amount of user's coins;
- Linked identities: number of identities linked to the account (Twitter, Google).

To be included in the Reddit gold reputation level, a user would need to have a premium subscription and a minimum of 10000 karma, 5000 coins, and 3 linked identities.

```json
[
  {
    "parameter": "premiumSubscription",
    "value": true
  },
  {
    "parameter": "karma",
    "value": {
      "min": 10000
    }
  },
  {
    "parameter": "coins",
    "value": {
      "min": 5000
    }
  },
  {
    "parameter": "linkedIdentities",
    "value": {
      "min": 3
    }
  }
]
```

https://docs.interep.link/technical-reference/reputation/reddit

Defining parameters and reputation levels is an ongoing and collaborative process – one that you can help with by [contributing your knowledge and opinions to the Interep survey.](https://docs.google.com/forms/d/e/1FAIpQLSdMKSIL-3RBriGqA_v-tJhNJOCciQEX7bwFvOW7ptWeDDhjpQ/viewform)

### Signals

If a user meets the criteria for the Reddit gold reputation level, they can now join the group with other users who have met the same criteria. Once you are a member of an Interep group, you can generate zero-knowledge proofs and signal to the world in a private, publicly verifiable way that you are very likely human.

If you’re interested in seeing Interep in action, the smart contracts have been [deployed to Goerli](https://goerli.etherscan.io/address/0x9f44be9F69aF1e049dCeCDb2d9296f36C49Ceafb) along with a [staging app for end users.](https://goerli.interep.link/)

## Preserving privacy with Semaphore

Interep integrates zero-knowledge proofs through [Semaphore](https://semaphore.appliedzkp.org/) so users only reveal the minimum amount of information necessary to join a group. Using Interep, Reddit users can keep everything about their profiles private including the exact number of karma or coins they possess. The only information revealed is that they meet the group’s requirements.

Semaphore is a privacy protocol with a few simple, but powerful, functions:

1.  Create a private identity
2.  Use private identities to join a group
3.  Send signals and prove you are a member of a group anonymously

A Semaphore group is simply a Merkle tree, with each leaf corresponding to a unique identity. Interep checks a user’s reputation and adds them to a group based on their reputation level. After joining a group, users can generate valid zero knowledge proofs that act as an anonymous proof-of-membership in a group and prove they meet a certain reputation criteria.

Platforms and dapps can verify if a user belongs to a group by verifying the users' zk-proofs and be confident that anyone in an Interep group has met the reputation requirements without having to identify individual users.

![https://github.com/interep-project/presentations/blob/main/DevConnect%20Amsterdam%20April%202022.pdf](/articles/interep-on-ramp-for-reputaion/3SOeA46pjr3NO8Q_ghtZg.webp)

https://github.com/interep-project/presentations/blob/main/DevConnect%20Amsterdam%20April%202022.pdf

To join an Interep group, you must first generate a Semaphore ID. Semaphore IDs are always created in the same way: they are derived from a message signed with an Ethereum account. On Interep, the Semaphore ID is generated using information from a provider such as Reddit, Github, Twitter, or POAP NFTs. These are called “deterministic identities” because the identity is generated using a specific message. A Reddit Semaphore ID and a Github Semaphore ID would be two different identities because they were generated using two different messages or inputs.

```js
const identity = new Identity("secret-message")
```

https://semaphore.appliedzkp.org/docs/guides/identities#create-deterministic-identities

Interep and Semaphore are interrelated. Semaphore acts as a privacy layer capable of generating and verifying zero-knowledge proofs. Interep bridges reputation from a variety of external sources while also managing user groups. Together, they create a system where off-chain reputation can be privately proven and verified on the blockchain.

You can generate a Semaphore identity using the [@interep/identity](https://github.com/interep-project/interep.js/tree/main/packages/identity) package.

Learn more about how Semaphore works in [this post](https://mirror.xyz/privacy-scaling-explorations.eth/ImQNsJsJuDf_VFDm9EUr4njAuf3unhAGiPu5MzpDIjI).

## Using reputation on-chain

Establishing reputation on-chain is an important step to unlocking new use cases or improving existing use cases, many of which have been difficult to develop due to concerns about sybil attacks, a desire to curate the user base, or resistance to rebuilding existing reputation in a new environment. Some possibilities include:

**Social Networks**

Social networks (even decentralized ones) are generally meant for humans. Requiring users to have multiple sources of reputation to engage on a platform provides a practical anti-Sybil solution for a social network, while reputation tiers give users who have worked to establish a reputation elsewhere a head start on credibility.

**Specialized DAOs**

DAOs or any digital organization can filter out or select for specific reputation parameters. For example, a protocol needing experienced developers would prize a higher Github reputation. A DAO focused on marketing may only accept members with a certain Twitter follower account. Organizations especially focused on community building may only want members who have proven reputations on Reddit.

**Voting**

Online voting has long been a promise of blockchain technology, but strong privacy and identity guarantees have been missing. Anonymous on-chain reputation helps us get closer to a world where eligible humans can privately vote using the blockchain. Voting goes beyond traditional elections and can be used for [on-chain governance](https://vitalik.ca/general/2021/08/16/voting3.html) and [quadratic funding](https://ethereum.org/en/defi/#quadratic-funding) where unique humanity is more important than holding the most tokens.

**Airdrops**

Everyone likes an airdrop, but no one likes a Sybil attack. Reputation as “proof of individual” could help weed out users who try to game airdrops with multiple accounts while preserving more of the token allocation for authentic community members.

## Limitations

Interep can do a lot of things, but it can’t do everything. Some current limitations include:

- Centralization of reputation service: only Interep can calculate reputation.
- Data availability: groups are currently saved in mongodb instance, which presents a single point of failure. This could be mitigated in the long term by moving to distributed storage.
- Members cannot be removed.
- The Interep server is a point of centralization. If a malicious actor gained access, they could censor new group additions or try to analyze stored data to reveal links between IDs.
- It is possible for someone with access to the Interep database to determine which provider accounts have been used to create Interep identities
- The way reputation is calculated is still very basic. We’d love your [feedback](https://docs.google.com/forms/d/e/1FAIpQLSdMKSIL-3RBriGqA_v-tJhNJOCciQEX7bwFvOW7ptWeDDhjpQ/viewform) on how to make it more robust!

## Credible humanity

Existing web2 platforms can be centralized, opaque, and reckless with their user’s private information – all problems the Ethereum community is actively building solutions and alternatives for. However, these platforms also have well-developed user bases with strong reputational networks and social ties.

All the digital reputation amassed over the years need not be thrown away in order to build a new decentralized version of the internet. With a pragmatic reputational on-ramp our Ethereum identities can become much more than a history of our financial transactions. They can become more contextual, more relational, more social, and more credibly human.

## Build with Interep

If you’d like to learn more or build with Interep, check out our [documentation](https://docs.interep.link/), [presentation](https://www.youtube.com/watch?v=CoRV0V_9qMs), and Github [repo](https://github.com/interep-project). To get involved, join the conversation on [Discord](https://discord.gg/Tp9He7qws4) or help [contribute](https://docs.interep.link/contributing).

Interep is possible thanks to the work of contributors including [Geoff Lamperd](https://github.com/glamperd) (project lead) and [Cedoor](https://github.com/cedoor).
