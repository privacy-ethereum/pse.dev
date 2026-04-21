---
authors: ["Chance"]
title: "UniRep Ceremony: An Invitation to the Celestial Call and UniRep v2"
image: "/articles/unirep-ceremony-an-invitation-to-the-celestial-call-and-unirep-v2/unirep-ceremony-an-invitation-to-the-celestial-call-and-unirep-v2-cover.webp"
tldr: "The initial ideas for this blog post originated from UniRep core contributor [Chance](https://github.com/vimwitch). Additional write up and review by [CJ](https://github.com/CJ-Rose), [Chiali](https://github.com/ChialiT), [Vivian](https://github.com/vivianjeng), [Doris](https://github.com/kittybest), and [Anthony](https://github.com/AnthonyMadia)."
date: "2023-10-24"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/z-gW2RtgFTV18ZkRGED2XKLn_wDd-SwMSs17vWQwfLs"
tags:
  [
    "unirep",
    "trusted setup",
    "ceremony",
    "privacy",
    "zero-knowledge proofs",
    "identity",
    "reputation",
    "anonymity/privacy",
    "cryptography",
    "infrastructure/protocol",
  ]
---

## **Introduction**

[“The Celestial Call”](https://ceremony.unirep.io/) is UniRep protocol’s trusted setup ceremony, aiming to gather a collective input to secure the foundation of the protocol. The keys generated from your input will solidify the next frontier of digital reputation, anonymity, and data sovereignty! The ceremony opened for contributions on October 10, 2023 and will remain open for 64 days. But first let’s expand our concept of what can be accomplished when building with UniRep, by moving beyond simplistic notions of reputation.

## **Rethinking reputation**

[Historically](https://mirror.xyz/privacy-scaling-explorations.eth/FCVVfy-TQ6R7_wavKj1lCr5dd1zqRvwjnDOYRM5NtsE), we’ve used the term “reputation” in Universal Reputation (UniRep) to mean positive or negative reputation. This definition is very limiting in application and does not express what UniRep is capable of storing. Instead, reputation should be thought of as **user data**, including things like historical actions, preferences, associations, balances, ownership, friends, etc.

UniRep allows applications to associate user data with anonymous users. Applications attest to changes to user data using anonymous identifiers ([epoch keys](https://developer.unirep.io/docs/2.0.0-beta-4/protocol/epoch-key)). A user’s data is the combination of all changes to all identifiers controlled by the user. The application cannot determine what changes belong to what user.

Thus we can build non-custodial applications: applications that never have custody of user data. Users can interact with UniRep based applications trustlessly. Applications negate the risk of user data being hacked or stolen by never *knowing* user data.

## **Privacy-preserving personalization**

Many of the platforms and services we rely on for our everyday needs — for communication, entertainment, shopping, banking, transportation, travel, etc .— give us no control over the security or privacy of our personal data. UniRep offers an opportunity for building privacy-first applications that invert the prevailing model and place control of information in the hands of its users.

Imagine a consumer product platform where users’ viewing history, preferences, and transactions aren’t stored as user profiles on the platform’s servers, but as disassociated data points on a public blockchain. Because this data is attributed to ephemeral anonymous identifiers, and not names or accounts, the platform can’t associate any data to any individual user. Instead, the user will submit a ZK proof to verify their ownership of data relevant to a specific interaction or request.

For example:

- **anonymously request updates** (e.g. processing/delivery) by proving ownership of a purchase
- **anonymously leave a rating** for a product by proving ownership of a purchase and generating a nullifier.
- **anonymously request a refund** by proving ownership of a purchase, generating a nullifier, and providing information about the refund request.

With this new model, applications can use information about user interactions to offer services like recommendations and reviews, without connecting that information to any individual’s persistent identity.

## **Identity trapdoor**

For this post, let’s define three levels of identity.

1.  Fully identified. e.g. That’s John, he lives on Fig Street and works at the bank
2.  Pseudonymous. e.g. That’s trundleop, they write posts about bridges and trolls.
3.  Anonymous. e.g. Identifier _0x219fa91a9b9299bf_ wrote a post about bees. This identifier will never be seen again.

It’s very hard to go from lower levels of identity to higher levels of identity. If I see John spraypaint graffiti on the back of the bank he works at in real life, he’s going to have a hard time convincing me it was someone else.

Conversely, it’s very easy to go from fully anonymous to less anonymity – or less identifiable to more identifiable. If I control identifier _0x219fa91a9b9299bf_, I can always make a ZK proof showing control or linking it to a pseudonym, identity, or another anonymous identifier.

Identification is basically a trapdoor. It makes sense to build primitives that are *anonymous by default*. Users, or even applications, can choose to operate at lower levels of identity, depending on their priorities. To support anonymity for everyone, UniRep is designed to be fully anonymous by default.

As we eagerly anticipate the unveiling of UniRep V2, we’re highlighting a foundational cryptographic layer: the trusted setup. This ceremony is more than just a formality; it's a multiparty computation designed to establish the secure parameters vital for common UniRep proofs. Within the UniRep framework, there are pivotal tasks — like user sign-ups and state transitions — that rely on these parameters.

The trusted setup ceremony has two phases. For phase 1, we’ve used [Perpetual Powers of Tau](https://github.com/privacy-scaling-explorations/perpetualpowersoftau), a universal ceremony first launched in 2019. Phase 2, which we’ve named “The Celestial Call”, is specific to UniRep’s circuits. This setup ensures these circuits are distributed safely alongside our package code, fortifying every interaction within the system, and [you’re invited to participate](https://ceremony.unirep.io/).

By joining “The Celestial Call”, you're not just contributing—you're helping to anchor a decentralized, anonymous, and deeply personal multiverse. The next chapter in anonymous, secure, and personalized interactions awaits your contribution.

## **Join the Celestial Call**

The ceremony is planned to run for 64 days, beginning on October 10th, 2023 and concluding on December 12th, 2023. After this period, we'll compile all contributions, finalize the transcripts, and unveil the collaborative multiverse. You are welcome to revisit and verify your individual contribution and the final result.

## **Learn more about UniRep**

Check out the website: [https://developer.unirep.io/](https://developer.unirep.io/)

Build an application: [https://developer.unirep.io/docs/next/getting-started/create-unirep-app](https://developer.unirep.io/docs/next/getting-started/create-unirep-app)

Try the attester demo app: [https://demo.unirep.io](https://demo.unirep.io/)

Join our discord! [https://discord.gg/umW6qATuUP](https://discord.gg/umW6qATuUP)
