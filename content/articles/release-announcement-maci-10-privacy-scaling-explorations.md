---
authors: ["PSE Team"]
title: "Release Announcement: MACI 1.0 - Privacy Stewards of Ethereum"
image: null
tldr: ""
date: "2022-08-29"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/V0QkCAtsYUd5y7RO7L5OAwmawhY9LTJ7jlOZ4KW1J7M"
tags:
  [
    "maci",
    "privacy",
    "zero-knowledge proofs",
    "collusion resistance",
    "voting",
    "quadratic funding",
    "ethereum",
    "zk-snarks",
    "governance",
    "infrastructure/protocol",
  ]
projects: ["maci"]
---

![](https://miro.medium.com/max/1400/1*cG0UuKR3QU0xMr8xBAq4Qg.png)

Originally published on Oct 12, 2021:

The Privacy Stewards of Ethereum team is proud to release version 1.0 of Minimal Anti-Collusion Infrastructure (MACI). MACI enables collusion resistance for decentralised applications, particularly voting and quadratic funding systems. This release is a major upgrade to the project and provides better developer experience and gas savings for users.

The code is in the `v1` branch of the `appliedzkp/maci`repository and will be merged soon.

MACI 1.0 was audited by [Hashcloak](https://hashcloak.com/). All vulnerabilities found have been fixed. The audit report can be found [here](https://github.com/appliedzkp/maci/blob/v1/audit/20210922%20Hashcloak%20audit%20report.pdf). We would like to thank our highly professional and responsive auditors for surfacing these issues and providing clear feedback for addressing them.

## About MACI

MACI is a set of smart contracts and zero-knowledge circuits upon which developers can build collusion-resistant applications, such as voting systems or quadratic funding platforms. MACI per se is not a user-facing application. Rather, developers may build applications on top of it. In turn, such applications can benefit from the following properties:

Comment

- **Collusion resistance**: no-one, except a trusted coordinator, can be convinced of the validity of a vote, reducing the effectiveness of bribery.
- **Receipt-freeness**: a voter cannot prove, besides to the coordinator, which way they voted.
- **Privacy**: no-one, except a trusted coordinator, should be able to decrypt a vote.
- **Uncensorability**: no-one, not even the trusted coordinator, should be able to censor a vote.
- **Unforgeability**: only the owner of a user’s private key may cast a vote tied to its corresponding public key.
- **Non-repudiation**: no-one may modify or delete a vote after it is cast, although a user may cast another vote to nullify it.
- **Correct execution**: no-one, not even the trusted coordinator, should be able to produce a false tally of votes.

Practically speaking, MACI provides a set of Typescript packages, Ethereum smart contracts and zero-knowledge circuits. It inherits security and uncensorability from the underlying Ethereum blockchain, ensures unforgeability via asymmetric encryption, and achieves collusion resistance, privacy, and correct execution via [zk-SNARKs](https://docs.ethhub.io/ethereum-roadmap/privacy/).

**Please note that MACI does not and will not have a token. In other words, it does not represent an investment opportunity.**

## MACI’s history

MACI stems from an [ethresear.ch post by Vitalik Buterin](https://ethresear.ch/t/minimal-anti-collusion-infrastructure/5413?u=weijiekoh). Subsequently, the initial codebase was written in late 2019 and early 2020 by grantees with the Ethereum Foundation, namely [Kendrick Tan](https://twitter.com/kendrick_tn), [Koh Wei Jie](https://kohweijie.com/), and [Chih-Cheng Liang](https://twitter.com/chihchengliang). MACI then saw developer adoption at ETHDenver in February 2020, where [Auryn Macmillan](https://twitter.com/auryn_macmillan) and others started work on [clr.fund](https://clr.fund/), a protocol for the Ethereum community to allocate funds for Ethereum-based public goods.

After the event, we continued to work with clr.fund to improve MACI and integrate it with their application. clr.fund has completed seven rounds of public goods funding, the last of which saw more than US$6000 worth of contributions. At the time of writing, it is currently running an [eighth round](https://clr.fund/#/round/0xd07AA7FAeBA14EFde87f2538699C0D6C9a566C20) with more than US$20k in contributions.

Work on version 1.0 started in late 2020 with the goal of reducing the gas and computational requirements, as well as to improve its flexibility and usability, without compromising any of its anti-collusion, security, and trust guarantees. We also took this opportunity to keep up with new techniques, ideas, and tooling from the rapidly advancing Ethereum and zero-knowledge ecosystem.

Finally, in early 2021 we were very fortunate to bring on [Cory Dickson](http://corydickson.com/) to the team. His work on writing documentation, revamping MACI’s integration test suites, working with our auditors to fix bugs, and collaborating with external teams has been invaluable to the project.

## Why is MACI important?

It is very difficult for naive voting systems, particularly those which are integrated into smart contract platforms, to prevent collusion. For instance, if a simple Ethereum transaction represents a vote, a briber can easily examine its calldata, tell how its sender voted, and reward or punish them accordingly.

More broadly, collusion resistance is particularly important for cryptoeconomic systems. Vitalik Buterin describes the motivations behind MACI in _[On Collusion](https://vitalik.ca/general/2019/04/03/collusion.html)_. He argues that systems that use cryptoeconomic incentive mechanisms to align participants’ behaviour can be vulnerable to collusion attacks, such as bribery. In [another post](https://vitalik.ca/general/2021/05/25/voting2.html), he elaborates:

> _if you can prove how you voted, selling your vote becomes very easy. Provability of votes would also enable forms of coercion where the coercer demands to see some kind of proof of voting for their preferred candidate._

To illustrate this point, consider an alleged example of collusion that [occurred in round 6 of Gitcoin grants](https://gitcoin.co/blog/how-to-attack-and-defend-quadratic-funding/) (a platform for quadratic funding software projects which contribute to public goods). In _[How to Attack and Defend Quadratic Funding](https://gitcoin.co/blog/how-to-attack-and-defend-quadratic-funding/)_, an author from Gitcoin highlights a tweet by a potential grant beneficiary appeared to offer 0.01 ETH in exchange for matching funds:

![](https://miro.medium.com/max/1360/0*_aKOFcRGzjl4RcBB.png)

They explain the nature of this scheme:

> _While creating fake accounts to attract matching funds can be prevented by sybil resistant design, **colluders can easily up their game by coordinating a group of real accounts to “mine Gitcoin matching funds” and split the “interest” among the group**._

Finally, MACI is important because as crypto communities are increasingly adopting Decentralised Autonomous Organisations (DAOs) which [govern through token voting](https://vitalik.ca/general/2021/08/16/voting3.html). The threat of bribery attacks and other forms of collusion will only increase if left unchecked, since such attacks target a fundamental vulnerability of such systems.

## What’s new?

In this release, we rearchitected MACI’s smart contracts to allow for greater flexibility and separation of concerns. In particular, we support multiple polls within a single instance of MACI. This allows the coordinator to run and tally many elections either subsequently or concurrently.

![](https://miro.medium.com/max/1400/0*i0MnnOBj18B_62Zt)

We’ve kept the ability for developers to provide their own set of logic to gate-keep signups. For instance, application developers can write custom logic that only allows addresses which own a certain token to sign up once to MACI in order to participate in polls.

An additional upgrade we have implemented is greater capacity for signups, votes, and vote options. With MACI 1.0, a coordinator can run a round that supports more users, votes, and choices than before, even with the same hardware.

We adopted iden3’s tools for [faster proof generation](https://github.com/iden3/rapidsnark). Furthermore, we rewrote our zk-SNARK circuits using the latest versions of [snarkjs](https://github.com/iden3/snarkjs), [circom](https://github.com/iden3/circom), and [circomlib](https://github.com/iden3/circomlib). We also developed additional developer tooling such as [circom-helper](https://github.com/weijiekoh/circom-helper) and [zkey-manager](https://github.com/appliedzkp/zkey-manager).

Finally, we significantly reduced gas costs borne by users by replacing our incremental Merkle tree contracts with a modified [deposit queue mechanism](https://ethresear.ch/t/batch-deposits-for-op-zk-rollup-mixers-maci/6883). While this new mechanism achieves the same outcome, it shifts some gas costs from users to the coordinator. A comparison of approximate gas costs for user-executed operations is as follows:

![](https://miro.medium.com/max/972/1*m3G3FB9x1-3X23HER3A4oQ.png)

Finally, we are looking forward to collaborating with other projects and supporting their development of client applications and new use cases. For instance, clr.fund team has indicated that they would like to upgrade their stack to MACI v1.0, and other projects have expressed interest in adopting MACI. We hope that through collaboration, the Ethereum community can benefit from our work, and vice versa.

## Further work

There is plenty of space for MACI to grow and we welcome new ideas. We are keen to work with developers who wish to do interesting and impactful work, especially folks who would like to learn how to build applications with zk-SNARKs and Ethereum.

## Negative voting

We thank [Samuel Gosling](https://twitter.com/xGozzy) for completing a grant for work on [negative voting](https://github.com/appliedzkp/maci/pull/283). This allows voters to use their voice credits to not only signal approval of a vote option, but also disapproval. Please note that the negative voting branch, while complete, is currently unaudited and therefore not yet merged into the main MACI codebase.

## Anonymisation

A [suggested upgrade to MACI is to use ElGamal re-randomisation for anonymity of voters](https://ethresear.ch/t/maci-anonymization-using-rerandomizable-encryption/7054). While all votes are encrypted, currently the coordinator is able to decrypt and read them. With re-randomisation, the coordinator would not be able to tell which user took which action.

We are working on tooling that makes it easier for coordinators to interface with deployed contracts and manage tallies for multiple polls. This will allow users to generate proofs and query inputs and outputs from existing circuits through an easy-to-use API. We hope that this will drive more adoption of MACI and offload the need for bespoke infrastructure.

## Trusted setup

Unlike other ZKP projects, MACI does not have an official [trusted setup](https://zeroknowledge.fm/133-2/). Instead, we hope to assist teams implementing MACI in their applications to run their own trusted setup. For instance, [clr.fund recently completed a trusted setup](https://blog.clr.fund/trusted-setup-completed/) (on a previous version of MACI) for a specific set of circuit parameters. Other teams may wish to use a different set of parameters on MACI 1.0, which calls for a different trusted setup.

## Conclusion

This release marks a step towards the hard problem of preventing collusion in decentralised voting and quadratic funding systems. We are excited to share our work and please get in touch if you are a developer and are interested in getting involved in any way.
