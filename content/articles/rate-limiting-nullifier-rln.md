---
authors: ["curryrasul"]
title: "Rate-Limiting Nullifier (RLN)"
image: "/articles/rate-limiting-nullifier-rln/rate-limiting-nullifier-rln-cover.webp"
tldr: "This post was authored by [@curryrasul](https://twitter.com/curryrasul)."
date: "2023-08-01"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/iCLmH1JVb7fDqp6Mms2NR001m2_n5OOSHsLF2QrxDnQ"
tags:
  [
    "rln",
    "rate-limiting nullifier",
    "nullifiers",
    "zero-knowledge proofs",
    "spam protection",
    "privacy",
    "anonymity/privacy",
    "cryptography",
    "security",
    "infrastructure/protocol",
  ]
---

We’re pleased to announce the “production-ready” release of **[Rate-Limiting Nullifier](https://github.com/Rate-Limiting-Nullifier)** (RLN) protocol.

## **What’s RLN?**

Developing zero-knowledge protocols (such as [Semaphore](https://semaphore.appliedzkp.org/)) allows us to create truly anonymous apps. But anonymous environments allow spammers to act with impunity because they are impossible to find.

RLN is a zero-knowledge gadget that enables spam prevention. It is a solution to this problem.

Even though spam prevention is the primary use case for RLN, it can also be used for any rate-limiting in anonymous systems (for example, limit-bid anonymous auctions, voting, etc.).

## **How does it work?**

Let’s start by diving a bit into the [Semaphore](https://semaphore.appliedzkp.org/) protocol. Semaphore allows users to prove membership in a group without revealing their individual identities. The system uses zk-proofs of inclusion or “membership” in a [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree): users have to generate zk-proofs that they know some secret value that’s in the Merkle tree.

If users decide to spam, we cannot just ban them by their IP or blockchain address, because they still will be able to generate proofs of inclusion, and therefore use the system.

The only thing we can do is remove spammers from the “membership” Merkle tree. We need _a mechanism_ that will reveal the user’s identity if they spam, so we can remove them.

But since spammers can just re-register and spam again, we also need an economic mechanism to deter them from spamming again. For that, we require users to stake some amount of money (RLN contract receives ERC-20 tokens) to register in the RLN system.

It’s possible to remove yourself from the app and get back your stake by making a zk-proof of the secret, **but** if you spam, someone else will be able to withdraw your stake before you.

The mechanism we need is **Shamir’s Secret Sharing (SSS)**.

What’s the SSS scheme? It’s a scheme that can split a value into `N` parts and recover it using `K` parts where `K <= N`. You can learn more by reading [our explanation here](https://rate-limiting-nullifier.github.io/rln-docs/sss.html).

That mechanism allows us to construct the rule: if users overuse the system and exceed the limit, their secret key can be immediately recovered by anyone and therefore they’ll lose the stake (this process is also called “slashing”).

---

Now, knowing how RLN works on a high level, we can dive a bit deeper.

The **RLN** protocol consists of three parts:

- registration;
- interaction (signaling);
- removal/withdrawal (or slashing).

Let’s discuss these parts in detail.

### **Registration**

The first part of **RLN** is registration. To register in the system users must submit an `identityCommitment` and place it in the Merkle Tree.

Users generate random secret key value _\-_ `a₀`. Identity commitment is the Poseidon hash of the secret key:

`identityCommitment = Poseidon(a₀)`

### **Signaling**

Now that users are registered, they can interact with the system. Imagine that the system is an _anonymous chat_ and the interaction is a sending of messages.

The SSS scheme used in the RLN protocol means users implicitly “own” their polynomial, that contains their secret key in it. We use linear polynomial  
`f(x) = kx + b`

To send a message, users need to generate a zk-proof of membership in the Merkle tree and that a _share_ = `(x,y)` from their polynomial is valid.

We denote:

`x = Poseidon(message)`

`y = A(x)`

As the first-degree polynomial is used, having two shares is enough to recover it and a secret key. It’s important to remember that anyone who has user’s secret key, can remove them from the system and take their stake.

#### **Range check trick and resulting polynomial**

We use first-degree polynomial for simplicity of the protocol and circuits. But limiting the system to only one message is really undesirable, because we want to have higher rate-limits. What we can do is use polynomial of higher degree, but this makes the protocol more complex. Instead, we can do a clever trick: introduce an additional circuit input: `messageId`, that will serve as a counter.

Let’s say we make `messageLimit = n`. Then for each message we send, we also need an additional input `messageId`. This value will be range checked to show it is less than `messageLimit` (to be more precise: `0 ≤ messageId < messageLimit`.

And our polynomial will depend on this input as well, so that for each message - different `messageId` will be used, therefore the resulting polynomials will be different.

Our polynomial will be:

`A(x) = a₁ ∗ x + a₀`

`a₁ = Poseidon(a₀, externalNullifier, messageId)`

The general anti-spam rule is in the form of: users must not make more than X interactions per epoch. The epoch can be translated as just a time interval.

`externalNullifier` value is a public parameter that denotes the epoch. More formally:

`externalNullifier = Poseidon(epoch, rlnIidentifier)`

where `rlnIdentifier` is a random finite field value, unique per RLN app.

`rlnIdentifier` value is used as a “salt” parameter. Without that salt, using the same secret key in different RLN apps with the same epoch value will lead to unintentional sharing of different points from their polynomial, which means it will be possible to recover a user’s secret key even if they did not spam.

#### **Different rate-limits for different users**

It also may be desired to have different rate-limits for different users, for example based on their stake amount. We can achieve that by calculating `userMessageLimit` value and then deriving `rateCommitment:`

`rateCommitment = Poseidon(identityCommitment, userMessageLimit)` during the registration phase.

And it’s the `rateCommitment` values that are stored in the membership Merkle tree.

Therefore, in the circuit users will have to prove that the:  
`identityCommitment = Poseidon(identitySecret)`

`rateCommitment = Poseidon(identityCommitment,userMessageLimit)`

`0 ≤ messageId < userMessageLimit`

We use the scheme with `userMessageLimit` as it’s more general, though it is not necessary to have different rate-limits for different users. We can enforce users to have the same rate-limit during the registration.

### **Slashing**

Recall how RLN works: if a user sends more than one message, everyone else will be able to recover their secret, slash them and take their stake.

Now, imagine there are a lot of users sending messages, and after each received message, we need to check if any member should be slashed. To do this, we can use all combinations of received shares and try to recover the polynomial, but this is a naive and non-optimal approach. Suppose we have a mechanism that will tell us about the connection between a person and their messages while not revealing their identity. In that case, we can solve this without brute-forcing all possibilities by making users also send the `nullifier = Poseidon(a₁)`\- so if a user sends more than one message, it will be immediately visible to everyone. Validity of `nullifier` value is also checked with zkp.

Based on `nullifier` we can find the spammer and use SSS recovery, using their shares.

---

The current version of RLN consists of:

- [RLN circuits in circom](https://github.com/Rate-Limiting-Nullifier/circom-rln);
- [registry smart-contract](https://github.com/Rate-Limiting-Nullifier/rln-contract);
- dev libraries ([rlnjs](https://github.com/Rate-Limiting-Nullifier/rlnjs), [zerokit](https://github.com/vacp2p/zerokit)).

The Vac team also works on RLN (especially Waku) and collaborates with us on the [CLI app](https://github.com/vacp2p/zerokit/tree/master/rln-cli) that can be used to easily work with Zerokit library and use the RLN API.

Circuits were audited by **Veridise**. Their audit also included formal verification of the protocol. In addition, they were also audited during the **yAcademy fellowhship**. In general, there were no critical bugs found in the circuits. All other findings of the auditors were taken into account and fixed.

---

Even though the circuits are simple and zk-proofs for RLN can be generated fast (~1s using snarkjs), in some use cases, such as validator privacy, Tor anti-spam it’s still considered slow. That’s why our team is working on newer RLN versions, such as [KZG-RLN](https://zkresear.ch/t/rln-on-kzg-polynomial-commitment-scheme-cross-posted/114), that will allow us to generate RLN proofs faster.

## **RLN trusted setup ceremony**

RLN is powered by the Groth16 proof system, which requires trusted setup.

We are pleased to invite you to join our **RLN trusted setup ceremony**. The ceremony includes trusted setup for the RLN circuits with different parameters (such as the depth of membership Merkle tree). The [p0tion](https://p0tion.super.site/) tool is used for the trusted setup ceremony coordination.

**Instruction**:

1\. To install p0tion trusted setup tool:

```
npm install -g @p0tion/phase2cli -f
```

2\. If you used p0tion before, then you need to logout first:

```
phase2cli logout
```

3\. After that you need to auth with GitHub:

```
phase2cli auth
```

4\. Finally, to join the ceremony:

```
phase2cli contribute --ceremony rln-trusted-setup-ceremony
```

or if you want to enter your entropy manually:

```
phase2cli contribute --ceremony rln-trusted-setup-ceremony --entropy &lt;YOUR_ENTROPY&gt;
```

To participate, you need to have at least 5 following, 1 follower and 1 public repo on GitHub.

If you want to learn more on trusted setups, you may be interested in these posts:

- [How do trusted setups work?](https://vitalik.ca/general/2022/03/14/trustedsetup.html)
- [Learnings from the KZG Ceremony](https://mirror.xyz/privacy-scaling-explorations.eth/naTdx-u7kyirczTLSAnWwH6ZdedfTQu1yCWQj1m_n-E)

## **How to get involved?**

Should you wish to get involved with RLN or report a bug, feel free to visit repositories in our [GitHub organization](https://github.com/Rate-Limiting-Nullifier) and open an issue or comment under an open issue to notify the team!

You can also help us with [KZG-RLN](https://github.com/Rate-Limiting-Nullifier/kzg-rln) development.

## **Useful references**

- [Documentation](https://rate-limiting-nullifier.github.io/rln-docs/);
- [circom-rln](https://github.com/Rate-Limiting-Nullifier/circom-rln);
- [smart-contract](https://github.com/Rate-Limiting-Nullifier/rln-contract);
- [rlnjs](https://github.com/Rate-Limiting-Nullifier/rlnjs);
- [GitHub organization](https://github.com/Rate-Limiting-Nullifier);
- [kzg-rln](https://github.com/Rate-Limiting-Nullifier/kzg-rln);
- [first proposal/idea of RLN by Barry WhiteHat](https://ethresear.ch/t/semaphore-rln-rate-limiting-nullifier-for-spam-prevention-in-anonymous-p2p-setting/5009).
