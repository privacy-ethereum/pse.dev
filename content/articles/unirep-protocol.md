---
authors: ["PSE Team"]
title: "UniRep Protocol"
image: "/articles/unirep-protocol/cover.webp"
tldr: ""
date: "2023-01-04"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/FCVVfy-TQ6R7_wavKj1lCr5dd1zqRvwjnDOYRM5NtsE"
tags:
  [
    "unirep",
    "semaphore",
    "privacy",
    "reputation",
    "zero-knowledge proofs",
    "anonymity/privacy",
    "identity",
    "ethereum",
    "social",
    "infrastructure/protocol",
  ]
projects: ["unirep", "semaphore"]
---

Anonymity gives people a clean slate to express themselves, unconnected to an existing identity. Reputation provides context: it reveals an aspect about a person's history in relation to others. [UniRep protocol](https://github.com/unirep) adds reputation to anonymity, allowing people to provide relational context without revealing specifics of their history.

UniRep stands for [Universal Reputation](https://mirror.xyz/privacy-scaling-explorations.eth/S04tvQuLbRjf_9ZrzDTE0T2aho9_GoSuok5NEFyHNO4) and serves as a base layer for applying reputation across multiple communities using interoperable smart contracts while preserving user privacy through [zero-knowledge proofs](https://ethereum.org/en/zero-knowledge-proofs/).

## Universal reputation

Reputation is relational: it is built on claims about a person's behavior or character. It's also subjective and context-dependent. It can take a qualitative form such as a reference letter from an acquaintance or an Airbnb review, or it can be an upvote or downvote on Reddit, or a positive or negative integer in a database. Many of the apps and services we depend on wouldn't work without reputation acting as a reference for deciding whether and how to interact with strangers on the internet.

UniRep protocol is a standard on which different reputational rules can interoperate. It doesn't dictate how reputation is used in a given application, but instead functions as a generic and [extensible](https://www.youtube.com/watch?v=jd2Dg9czJzI&list=PLV91V4b0yVqRQ62Mv0nUgWxJhi4E67XSY&index=5) system where platforms such as AirBNB, Uber, Reddit, Medium, Trip Advisor, or Trust Pilot would be [attesters](https://developer.unirep.io/docs/protocol/users-and-attesters): providers of negative or positive reputation.

Attesters are at the application layer. They are the platforms, businesses, and communities in the ZK social ecosystem. They act as world builders and community managers. Attesters have great flexibility in what to build. They decide how many user identities are used, how users are onboarded, and how users interact with each other. Most importantly, attesters decide why someone receives a positive reputation and why someone receives a negative reputation. In other words, attesters provide accountability.

Attesters use publicly known Ethereum addresses while user identities are always kept private. Users receive reputation from attesters and can create a zero-knowledge proof verifying they have a certain level of reputation from a certain attester.

UniRep users are always in control of how their reputation is used: only they can see how much they've accrued and only they have the power to reveal their reputation – and only to who they want.

## How UniRep works: adding accountability to anonymity

The UniRep protocol evolved from an [ethresearch proposal by Barry WhiteHat](https://ethresear.ch/t/anonymous-reputation-risking-and-burning/3926) for a system where users could be banned or have their reputation destroyed even if they are anonymous. The proposal outlined a mechanism for giving positive and negative reputation in a way that the user must accept while maintaining privacy. To guarantee reputation is non-repudiable (cannot be refused) UniRep employs a system of epochs, temporary identities, and the migration of reputation and user information from one state to the next via ZK proofs.

![](/articles/unirep-protocol/4jSmWwzhXMTHRcMhVm1Hv.webp)

## Temporary identities

Reputation is accumulated to users via rotating identities called [epoch keys](https://developer.unirep.io/docs/protocol/epoch-key). Epoch keys can be thought of as temporary Ethereum addresses that change regularly but are tied to a persistent user, which preserves anonymity for users while maintaining the history needed for a meaningful reputation.

[Epochs](https://developer.unirep.io/docs/protocol/epoch) represent the ticking of time. Similar to blocks in a blockchain, they can be thought of as cycles in the UniRep system: with each transition, the reputation balances of all users are finalized and carried over into the new epoch. Each attester sets their own epoch length.

Epoch keys are created from an [identity commitment](https://semaphore.appliedzkp.org/docs/guides/identities) generated via [Semaphore](https://semaphore.appliedzkp.org/), a generic privacy layer where users can anonymously send signals from within a group. Inside of a Semaphore group, users' actions are unconnected to their "outside" identities. Instead of interacting with people as a uniquely identifiable individual, Semaphore identities are expressed simply as a member of the group.

Epoch keys change every epoch, are unique to every user, and look completely random. Only the user knows if they are receiving an attestation or reputation; others would see only an attestation to a random value. Epochs and changing epoch keys help preserve privacy by mixing up where reputation accrues and what identities people use to interact.

## All about the trees

UniRep uses a system of migrating [Merkle tees](https://www.youtube.com/watch?v=YIc6MNfv5iQ) to maintain reputation and privacy at the same time. Merkle trees are data structures capable of efficiently storing and verifying information; reputation and user data are stored as leaves in UniRep's Merkle trees. Proving a UniRep reputation means generating a proof that a user's claim (their reputation level) exists in a valid Merkle tree.

When users first sign up, their data is entered into a [State Tree](https://developer.unirep.io/docs/protocol/trees#state-tree). Each attester has their own separate version of a State Tree, which changes every epoch. State Trees can be thought of as the meta reputation tracker for a specific attester: containing relevant UniRep users and their starting reputations at the beginning of an epoch.

Since epoch keys are temporary, the reputations they accumulate must be migrated to a new Merkle tree. When users transition into the new epoch, they receive new epoch keys and the old epoch keys become invalid. In the background, their reputation follows them to the next iteration of an attester's State Tree via ZK proofs. Moving to the new State Tree means creating a [User State Transition Proof](https://developer.unirep.io/docs/circuits-api/circuits#user-state-transition-proof) verifying the user followed all the rules of the protocol. The proofs show there was no cheating: no omitting negative attestations or adding fraudulent positive attestations.

![](/articles/unirep-protocol/X1povaSYYwUDI4HdZL_Rw.webp)

The user generates a User State Transition proof containing a new state tree leaf containing the attester ID, the user's [Semaphore identity nullifier](https://semaphore.appliedzkp.org/docs/guides/identities), sum of the user's positive and negative reputation from the previous epoch, timestamp and "graffiti" - a value given to the user by the attester. This new leaf is provided to the smart contract, which verifies the proof and inserts it into the new State Tree.

Once a user accrues reputation, they can prove how many reputation points they've accumulated through a [reputation proof](https://developer.unirep.io/docs/circuits-api/circuits#reputation-proof). The reputation proof is a ZK proof that verifies the user exists, has the claimed reputation, and has performed all the necessary transitions or migrations. The reputation proof makes sure the user's claims are consistent with the data in the State Tree.

There are many parallel efforts to reimagine and rearchitect online social systems to be more decentralized, permissionless, and censorship-resistant. Though different in their approaches, all these initiatives are creating basic building blocks for identity and reputation, then playing with different ways to stack the structure.

Efforts such as [Decentralized Identifiers (DIDs)](https://www.w3.org/TR/2022/REC-did-core-20220719/#abstract), [Decentralized Society (DeSoc)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4105763), [peer-to-peer networks](https://scuttlebutt.nz/about/) and [Federated universes](https://eric442.substack.com/p/what-is-the-fediverse-0d6) or [networks](https://blueskyweb.xyz/blog/10-18-2022-the-at-protocol) allow anyone to join in, express themselves, and have the freedom to choose how they connect and participate with others. In these systems, users own their accounts, their data and their social graphs; users can choose how they interface with the network; and independent servers or systems are able to talk to each other by default.

When we hear "social applications" we tend to think of social media platforms like Twitter or Reddit – but restaurant reviews, marketplaces, rideshares and homestays are all highly social and highly dependent on reliable reputation systems. ZK social or [ZK identity](https://0xparc.org/blog/zk-id-2) share many of the principles of the decentralized social efforts mentioned previously, but ZK social starts with privacy as the foundational layer to build upon – which is especially important in use cases like homestays that cross into "real life" – and uses zero-knowledge proofs as the primary mechanism to make claims about identities or reputations. UniRep protocol is one building block in the ZK social stack.

Adding on complexity and data to an anonymous system allows people to regain the color that is lost when users can't be individually identified. Building social primitives from scratch means having to consider and experiment with new ways to layer in constraints, rules, and feedback mechanisms.

Eventually, interesting, multi-dimensional, user-owned, privacy-preserving, digital identity and reputation systems – all interoperating – are expected to emerge. But it's still early days. Protocols such as Semaphore and UniRep are meant to serve as foundational building blocks near the base of the ZK social stack. These primitives can't decide how this ZK-enabled social future will look or feel; that can only be decided by users, attesters, and builders.

## Next steps

UniRep is still in the early stages of development, but the team is already working on the [next version](https://github.com/Unirep/Unirep/issues/134) of the protocol, which aims to make the system more customizable and easy for attesters as well as more scalable by reducing the complexity of creating ZK proofs.

You can try a [demo app](https://unirep.social/) built with UniRep Protocol, which resembles Reddit but with anonymity and privacy by default.

If you'd like to contribute to helping build the next version of [UniRep Protocol](https://github.com/unirep) or integrating this anonymous reputation layer to your project, check out the [docs](https://developer.unirep.io/docs/welcome) and join the [UniRep Discord here](https://discord.gg/VzMMDJmYc5).

UniRep Protocol is possible thanks to the contributions of [Vivian](https://github.com/vivianjeng), [Chance](https://github.com/vimwitch), [Doris](https://github.com/kittybest), [Anthony](https://github.com/AnthonyMadia), [Yuriko](https://github.com/yuriko627), [CJ](https://github.com/CJ-Rose), and [Chiali](https://github.com/ChialiTsai).
