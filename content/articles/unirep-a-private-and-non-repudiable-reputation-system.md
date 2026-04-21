---
authors: ["PSE Team"]
title: "Unirep: A private and non-repudiable reputation system"
image: null
tldr: "Unirep is a protocol that allows users to receive and give reputation anonymously and prove their own reputation on other platforms that support the protocol."
date: "2022-08-29"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/S04tvQuLbRjf_9ZrzDTE0T2aho9_GoSuok5NEFyHNO4"
tags:
  [
    "unirep",
    "privacy",
    "reputation",
    "zero-knowledge proofs",
    "identity",
    "semaphore",
    "ethereum",
    "social",
    "anonymity/privacy",
    "infrastructure/protocol",
  ]
projects: ["unirep", "semaphore"]
---

_Originally published on Aug 26, 2021_

![](https://miro.medium.com/max/1106/0*nr6Aia8myVXSIZ2R)

## What is the Unirep protocol?

[Unirep](https://github.com/Unirep/Unirep) is a private and non-repudiable reputation protocol built on Ethereum using zero knowledge proof technology. The protocol offers a system where users can:

- Anonymously give positive and negative reputation to others
- Receive positive and negative reputation from other anonymous users while not being able to refuse to accept the reputation (non-repudiable).
- Voluntarily prove that they have at least a certain amount of reputation without revealing the exact amount.

Using Unirep, we can build applications that provide people with new types of experiences where they can build private reputation. Named after **Uni**versal\*\* Rep\*\*utation, \*\*UniRep \*\*technology allows people to easily apply their reputation across multiple communities using interoperable smart contracts all while preserving user privacy using zero knowledge proofs.

This allows us to reimagine how existing web applications work. Many services from online shopping, social media to the sharing-economy, not to mention blockchain applications leverage reputation systems and could benefit from this approach.

One use case, which we are working on, is a social media application on top of Unirep, let’s call it Unirep Social for this post. The motivation is to foster open dialogue among anonymous users who are all participating with only the reputation they’ve built up within platforms using the Unirep Protocol.

Imagine Alice has an account on a reddit-like platform and has received a lot of karma from other users. A minimum amount of karma is required to make posts in some subreddits and other users will take posts of accounts with high Karma scores more seriously. One day Alice wants to make a post about something that she doesn’t want to be associated with for the rest of her internet life. She could create a new account on the platform but this would mean she needs to start accumulating karma from scratch. Using Unirep we can allow Alice to stay completely private but still accumulate karma and allow her to prove her karma score to others.

## Why does this matter?

Traditional social media apps have built entire economies around public reputation. The more content (regardless of quality) and engagement with that content (positive or negative) the greater the reputation can be. It costs nothing to post, comment or like/dislike cultivating a reactive communication environment. Following are some of the issues caused by public, reputable protocols:

- Public figures often receive [irrelevant responses](https://youtu.be/oLsb7clrXMQ?t=1000) to their posts regardless of their posts intellectual merit (or lack thereof).
- People with few followers can go unheard regardless of the quality of what they have shared.
- Anyone can receive a response skewed by the threat of social repercussions if the opinion they post differs from their followers expectations.

Public prominence (or lack thereof) need not influence the collective attention paid to any post or comment. The community anonymously chooses which anonymous content creators it empowers and disempowers. Furthermore, if a person chooses to share their reputation score, it can be proven that they meet a selected threshold without revealing their exact reputation.

## The Unirep Protocol Explained

The following is a high level overview of the Unirep protocol. We use the social media application Unirep Social as an illustrative example. If you are interested to learn more stay tuned for a more detailed post or dive right in on [Github](https://github.com/Unirep/Unirep). To begin, let us define the two different actors who interact with the Unirep protocol: users and attesters.

**Users** can receive and spend reputation, prove their reputation, and use temporary identities called **epoch keys** to interact with other people. Users can generate five new epoch keys every epoch (in this case, 7 days). In a way, the user gets a completely new identity every epoch which preserves their privacy.

**Attesters** represent users to give reputation to an epoch key. Attester IDs are public and unchangeable so users can always prove that the reputation is from the attester.

In the Unirep Social example an attester would be the Unirep Social application and Users are users of the application who vote on each other’s comments.

## **1\. Registration**

Users and attesters use different ways to sign up in Unirep.

![](https://miro.medium.com/max/1400/0*wcqrf4SN2TRx38YI)

_User signup and attester signup in Unirep_

## User

A user generates identity and identity commitment through [Semaphore](https://github.com/appliedzkp/semaphore).\*\* \*\*Semaphore is a zero-knowledge gadget which allows Ethereum users to prove their membership of a set which they had previously joined without revealing their original identity.

The user hoIds the identity like a private key, and the identity commitment is like a public key that is submitted to the Unirep contract.

## Attester

The attester uses his own wallet or the address of a smart contract to register. After calling the attester sign up function, the Unirep contract will assign an attester ID to this address.

Whenever the attester gives an attestation, the Unirep contract will check whether the address is registered. If it is registered, the attester is allowed to give reputation to an epoch key.

**Note:** Everyone can sign up as an attester with their wallet address and will receive a new attester ID

## 2\. Give Reputation

Only epoch keys can receive attestations. The next graphic shows how attesters and users interact in the Unirep Protocol.

![](https://miro.medium.com/max/1400/0*zxlIej01nppoYBoc)

_How an attester attests to an epoch key_

After Alice signs up to Unirep, she can generate epoch keys to receive reputation. These epoch keys change every epoch, are unique to every user and look completely random. In the Unirep Social example users can make posts with their epoch keys. Now, when a user sees a post made by an epoch key, how can others know that it is indeed from a registered user? And how can they be sure that the epoch key is computed correctly with the current epoch and a valid nonce? Alice can not simply provide this information since this would enable everyone to calculate what reputation Alice has received, removing the desired privacy.

This is where zero-knowledge proofs (ZKP) come into play. A ZKP is used to prove that the epoch key is valid without revealing additional information. For details, please refer to the [epoch key proof](https://github.com/Unirep/Unirep/blob/f69b39c6011ae80cd2cb868f8da0eea594ab8cff/packages/circuits/circuits/verifyEpochKey.circom), which proves that the user is indeed registered, and the epoch and nonce are valid numbers.

The user can see the `epoch_key` in the post and the `epoch_key_proof` provided by Alice, and verifies them through the Unirep contract, and then can give an attestation through the attester (in our example Unirep Social) to the epoch key.

Users can also _spend_ reputation if it makes sense for the application. They would generate a reputation proof about their current amount of reputation and the attester will send a negative reputation to decrease the balance. Spending reputation is a way for users to give reputation to other users through an attester without having to register as an attester themselves.

## 3\. Receive Reputation

A user can prove which epoch key she owns and everyone can easily query how much reputation the epoch key has from the contract. A user that has received some bad reputation during a certain epoch could decide not to show those epoch keys to other users. Therefore, after an epoch ends and all epoch keys are sealed, Unirep restricts users to generate a User State Transition proof that is used to update their reputation status.

![](https://miro.medium.com/max/1400/0*t18QHcnKhY5LA5P8)

_User State Transition in Unirep_

The [User State Transition Proof](https://github.com/Unirep/Unirep/blob/f69b39c6011ae80cd2cb868f8da0eea594ab8cff/packages/circuits/circuits/userStateTransition.circom) is used to ensure that the user calculates the latest user state in the correct way, and the user does not miss any attestation.

In other words, after an epoch is over, Alice can collect reputation from other users (via Unirep Social) through User State Transition and update her reputation status.

## 4\. Prove Reputation

After Alice performs a User State Transition, she will have the latest user state. At this time, Alice can prove to everyone on the platform how many reputation points she has in Unirep Social through a [reputation proof](https://github.com/Unirep/Unirep/blob/f69b39c6011ae80cd2cb868f8da0eea594ab8cff/packages/circuits/circuits/proveReputation.circom). The reputation proof checks whether the user exists, has the claimed reputation (for example it sums up positive and negative reputation from specified attester IDs), and performs User State Transition.

For privacy reasons it could be disadvantageous to reveal the exact amount of reputation one has received. If Alice has 100 karma in total, Unirep allows Alice to prove that she has \*“at least 10 karma” \*instead of revealing that the total is 100.

## Conclusion

Unirep s a reputation system with privacy protection. Thanks to ZKP magic, users can receive reputation, give reputation, and prove reputation to others **anonymously**. Unirep can be used for cross-application reputation certification. One can obtain reputation in application A, and prove in application B how much reputation is obtained. If you want to learn more about Unirep, you can refer to [Github](https://github.com/Unirep/Unirep), [documents](https://unirep.gitbook.io/unirep/) or join the [Discord channel](https://discord.gg/VzMMDJmYc5) to discuss.

_Special thanks to Thore and Rachel for feedback and review._
