---
authors: ["PSE Team"]
title: "Rate Limiting Nullifier: A spam-protection mechanism for anonymous environments"
image: null
tldr: "In this post we describe a mechanism that can be used to prevent spam in anonymous environments. We provide a technical overview, some examples and use cases. The goal is to get more people excited about the idea and hopefully implement it in practice."
date: "2022-08-29"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/aKjLmLVyunELfGjrPlbhWu5lZI9QU-P3OuBK8mOY"
tags:
  [
    "rln",
    "nullifiers",
    "zero-knowledge proofs",
    "privacy",
    "anonymity/privacy",
    "security",
    "cryptography",
    "merkle tree",
    "infrastructure/protocol",
    "ethereum",
  ]
projects: ["rln"]
---

Originally published on Aug 30, 2021:

RLN (Rate limiting nullfier) is a construct based on [zero-knowledge proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof) that enables spam prevention mechanism for decentralized, anonymous environments. In anonymous environments, the identity of the entities is unknown.

The anonymity property opens up the possibility for spam attack and sybil attack vectors for certain applications, which could seriously degrade the user experience and the overall functioning of the application. For example, imagine a decentralised voting application where the user identities are anonymous. Without any spam protection mechanism the voting outcomes can be easily manipulated, thus making the application unusable.

Let's take a fully anonymous group chat application as another example. Not having a proper spam prevention mechanism enables anyone to pollute the group chats easily. The application would not be able to recognise the spammer and remove them, because the origin of the messages is unknown. For a pseudo-anonymous group chat application, sybil attacks represent a bigger treat. Even if the application can properly remove the spammers, new pseudo-anonymous identities can be spawned easily and pollute the application.

Thus having a reliable spam detection and prevention mechanism, which enables anonymity is very important.

The RLN construct prevents sybil attacks by increasing the cost of identity replication. To be able to use an application that leverages the RLN construct and be an active participant, the users must provide a stake first. The stake can be of economic or social form, and it should represent something of high value for the user. The user identity replication will be very costly or impossible in some cases (again depending on the application). Providing a stake does not reveal the user's identity, it is just a membership permit for application usage, a requirement for the user to participate in the app's specific activities.

An example for an economic stake is cryptocurrency such as Ether, and example for social stake is a reputable social media profile.

Staking also disincentivizes the users to spam, as spamming is contrary to their interest.

The proof system of the RLN contract enforces revealing the user credentials upon breaking the anti-spam rules. By having the user's credentials, anyone can remove the user from the application and withdraw their stake. The user credentials are associated with the user's stake.

## Technical overview

The RLN construct's functionality consists of three parts, which when integrated together provide spam and sybil attack protection. These parts should be integrated by the upstream applications which require anonymity and spam protection. The applications can be centralized or decentralized. For decentralized applications, each user maintains a separate storage and compute resources for the application. The three parts are:

- user registration
- user interactions
- user removal

## User registrations

Before registering to the application the user needs to generate a secret key and derive an identity commitment from the secret key using the [Poseidon hash function](https://eprint.iacr.org/2019/458.pdf) (_identityCommitment = posseidonHash(secretKey))._

The user registers to the application by providing a form of stake and their identity commitment, which is derived from the secret key. The application maintains a [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree) data structure (in the latest iteration of the RLN construct we use the [Incremental Merkle Tree](https://arxiv.org/pdf/2105.06009v1.pdf) algorithm), which stores the identity commitments of the registered users. Upon successful registration the user's identity commitment is stored in a leaf of the Merkle tree and an index is given to them, representing their position in the tree.

## User interactions

For each interaction that the user wants to make with the application, the user must generate a zero-knowledge proof which ensures the other participants (the verifiers) that they are a valid member of the application and their identity commitment is part of the membership Merkle tree.

The interactions are app specific, such as voting for voting application and message sending for chat applications. The verifier is usually a server for centralized applications, or the other users for decentralized applications.

Anti-spam rule is also introduced for the protocol. The rule is usually in the form of:

`Users must not make more than X interactions per epoch`.

The epoch can be translated as time interval of `Y` units of time unit `Z`. For simplicity sake, let's transform the rule into:

`Users must not send more than 1 message per second.`

The anti-spam rule is implemented using the [Shamir's Secret Sharing scheme](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing), which enables secret sharing by using polynomials. SSS allows for a secret to be split into multiple shares, from which a minimum number is needed to reconstruct the original secret. This can be also written as: any M of N shares are needed to reliably reconstruct the secret (M, N).

The minimum number is determined by the polynomial used for the scheme. If the minimum number of shares needed to recover the secret is set to `X` then `X-1` degree polynomial needs to be used.

In our case the secret is the user's secret key, and the shares are parts of the secret key.

To implement the simplified anti-spam rule we can implement a (2,3) SSS scheme using a linear polynomial. This means that the user's secret key can be reconstructed if they send two messages per epoch.

For these claims to hold true, the user's ZK proof must also include shares of their secret key (the X and Y shares) and the epoch. By not having any of these fields included the ZK proof will be treated as invalid.

For each interaction they make, the users are leaking a portion of their secret key. Thus if they make more interactions than allowed per epoch their secret key can be fully reconstructed by the verifiers.

## User removal

The final property of the RLN mechanism is that it allows for the users to be removed from the membership tree by anyone that knows their secret key. The membership tree contains the identity commitments of all registered users. User's identity commitment is derived from their secret key, and the secret key of the user is only revealed in a spam event (except for the scenarios where the original users wants to remove themselves, which they can always do because they know their secret key). When an economic stake is present, the RLN mechanism can be implemented in a way that the spammer's stake is sent to the first user that correctly reports the spammer by providing the reconstructed secret key of the spammer as a proof.

## RLN example

The following is an example scenario for a decentralised anonymous chat application. The chat application uses a smart contract as a registry which holds the registered users stake and stores a list of registered users. The registry smart contract has only two functions, register and withdrawal, and it also emits events when a new member registers and when a member is slashed. The users maintain RLN membership trees locally, which represent the state of registered users for the application. By "pubKey", we refer to the user's identity commitment, and by "privKey" to their secret key.

![](https://miro.medium.com/max/1400/1*zIFheJ70SJWdLFvfdgev3w.jpeg)

Step 1: Charlie wants to be an active participants and sends a registration transaction to the smart contract, providing his stake. The smart contract emits event that a new identity commitment was registered and each user should update their RLN membership tree with the newly registered identity commitment.

![](https://miro.medium.com/max/1400/1*CczM9RZzlihLv7Ot4TTdwA.jpeg)

Step 2: Charlie sends a message in epoch 1 to Alice and Bob, with all of the required parameters and valid ZK proof.

![](https://miro.medium.com/max/1400/1*A9ybuXMaZtmwrEeXE71OKA.jpeg)

Step 3: Charlie sends second message in epoch 1 to Alice and Bob. All the message parameters are valid as well as the ZK proof. Charlie violated the anti-spam rules and Alice and Bob can reconstruct Charlie's secret key and remove him from their RLN membership tree.

![](https://miro.medium.com/max/1400/1*dyBsMECE7v8ho-0hYskf4Q.jpeg)

Step 4: Alice sends withdrawal transaction to the RLN Membership smart contract to withdraw Charlie's stake. The smart contract emits an event which signals that Charlie is banned from the application and should be flagged as such by all of the users.

## Use cases

The RLN construct can be used by broad range of applications which operate in anonymous environments. Essentially every application that enables interactions for users with anonymous identities needs a spam protection by some degree.

There are many use cases, but we've identified few which we think are very interesting for applying the RLN construct and experimenting with it:

- [Private communication channel for ETH2 validators](https://ethresear.ch/t/private-message-sharing-for-eth2-validators/10664)
- Instant messaging applications for private and anonymous communications
- [Cloudflare-like service which uses RLN for spam protection (instead of captcha)](https://ethresear.ch/t/decentralised-cloudflare-using-rln-and-rich-user-identities/10774)
- Decentralised, anonymous voting applications
- Privacy preserving peer to peer networks

In the upcoming posts that we will publish on [ethresear.ch](https://ethresear.ch/), we will provide detailed overview as well as technical specifications for these ideas.

## History

The initial idea and the needs for RLN are described by Barry WhiteHat in [this post.](https://ethresear.ch/t/semaphore-rln-rate-limiting-nullifier-for-spam-prevention-in-anonymous-p2p-setting/5009) The RLN construct was implemented by [Onur Kilic](https://github.com/kilic) which can be found [here](https://github.com/kilic/rln). He also created a [demo application](https://github.com/kilic/rlnapp) using the RLN construct.

[The Vac research team](https://vac.dev/) has been heavily experimenting with the RLN construct. Their plan is to use it in production for [Waku v2](https://vac.dev/waku-v2-plan) which is a privacy-preserving peer-to-peer messaging protocol for resource restricted devices.

## Additional resources

The RLN construct specification — [https://hackmd.io/@aeAuSD7mSCKofwwx445eAQ/BJcfDByNF](https://hackmd.io/@aeAuSD7mSCKofwwx445eAQ/BJcfDByNF)

The updated RLN circuits — [https://github.com/appliedzkp/rln](https://github.com/appliedzkp/rln)

A great post about why RLN is important and how it can solve the spam attack problems for Waku v2 — [https://vac.dev/rln-relay](https://vac.dev/rln-relay).

Video by Barry Whitehat explaining the needs for spam protection and also the RLN construct and some potential application — [https://www.youtube.com/watch?v=cfx1udF7IJI](https://www.youtube.com/watch?v=cfx1udF7IJI).

Thoughts on DoS protection and spam related problems for the Status chat application — [https://discuss.status.im/t/longer-form-thoughts-on-dos-spam-prevention/1973](https://discuss.status.im/t/longer-form-thoughts-on-dos-spam-prevention/1973)

RLN incentives for p2p networks — [https://ethresear.ch/t/rln-incentives-for-p2p-networks/8085](https://ethresear.ch/t/rln-incentives-for-p2p-networks/8085)

Tutorial and PoC application on how to use RLN in practice — [https://github.com/bdim1/rln-anonymous-chat-app](https://github.com/bdim1/rln-anonymous-chat-app)

## Call to action

We are actively searching for developers to implement RLN. If you are interested reach out in our [Telegram channel](https://t.me/joinchat/Le3cTB0izAjf1jzHyJfeOg).
