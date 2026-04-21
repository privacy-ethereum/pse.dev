---
authors: ["PSE Team"]
title: "Zkitter: An Anon-friendly Social Network"
image: "/articles/zkitter-an-anon-friendly-social-network/cover.webp"
tldr: ""
date: "2023-01-11"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/P4jDH1gLrVQ-DP5VyIKQrlPAJUTDhtXZkFl2vp8ewSg"
tags:
  [
    "zkitter",
    "semaphore",
    "interep",
    "rln",
    "privacy",
    "anonymity/privacy",
    "social",
    "identity",
    "zero-knowledge proofs",
    "sybil",
  ]
projects: ["zkitter", "semaphore", "interep", "rln"]
---

Zkitter is a decentralized social network where users have the option to interact anonymously. The platform provides familiar social media functions such as posting, chatting, following, and liking, but with a private identity layer under the hood.

Zkitter was created as a public good for more open and honest conversation. With privacy and anonymity enabled by default – and without the fear of damaging or risking one's personal reputation – the theory is that users will be able to express themselves more freely on Zkitter compared to mainstream platforms.

Zkitter is a social experiment made possible by decentralized blockchains and privacy-preserving [zero-knowledge proofs](https://ethereum.org/en/zero-knowledge-proofs/), and is currently in [alpha testing.](https://www.zkitter.com/explore/)

## What is Zkitter?

Zkitter is a private and decentralized social protocol meant to be an alternative means of communication for the crypto community and an experiment in anonymity and free speech. Data is decentralized and runs on a [peer-to-peer network](https://docs.zkitter.com/developers/overview) of nodes. Private identity functions are enabled by a stack of zero knowledge protocols: [Semaphore](https://semaphore.appliedzkp.org/), [Interep](https://interep.link/), [RLN](https://mirror.xyz/privacy-scaling-explorations.eth/aKjLmLVyunELnGObrzPlbhXWu5lZI9QU-P3OuBK8mOY), and [zkchat](https://github.com/zkitter/zkitterd/tree/main/lib/zk-chat-server).

**Semaphore**

Semaphore allows Ethereum users to prove their membership of a group and send signals without revealing their original identity. Zkitter users create a [Semaphore identity](https://semaphore.appliedzkp.org/docs/guides/identities) to join, post, reply, upvote, and chat publicly, either anonymously, or using an Ethereum address or ENS as their username. By using a Semaphore identity, Zkitter users reveal only the content of their messages or posts – and nothing else.

**Interep**

Another challenge with anonymity is [Sybil attacks](https://en.wikipedia.org/wiki/Sybil_attack), where a user creates multiple accounts to spam or gain influence. Zkitter uses Interep to increase Sybil resistance by leveraging existing reputations. Before creating an anonymous account on Zkitter, anonymous users need to prove they also own a reputation on an existing web2 social network such as Twitter or Reddit.

**RLN**

Spam can be a serious problem in anonymous environments. In "real life", or on social networks where users have persistent identities, the threat of reputational damage or banning prevents most people from openly spamming. On anonymous networks, where a user's actions can't be traced to their identity, we can't know who's spamming – so we can't punish or ban them. [RLN](https://mirror.xyz/privacy-scaling-explorations.eth/aKjLmLVyunELnGObrzPlbhXWu5lZI9QU-P3OuBK8mOY) (Rate Limit Nullifier) requires users to put something at stake, either financial or social, and punishes users who violate the spam rules by either slashing or banning them.

**Zkchat**

One of the first use cases for RLN was ["RLN Anonymous Chat"](https://github.com/zkitter/zkitterd/tree/main/lib/zk-chat-server), which later became known as zkchat, a spam resistant instant messaging application for private and anonymous communication. Zkchat powers Zkitter's chat functionality and the zkchat project is now maintained by Zkitter.

## Experimenting with anonymity

> "Man is least himself when he talks in his own person.
>
> Give him a mask, and he will tell you the truth."
>
> \- Oscar Wilde

Zkitter is a social experiment. Philosophically, it is an experiment in whether the Oscar Wilde quote above is true. Does the option of anonymity, by separating reputation from speech, create a space for more open and honest self-expression? What would happen if the option to be anonymous was available as a default and widely considered to be a "normal" thing to do? How might the conversation change when the content of what's being said is detached from the reputation of the person saying it?

As an anon or using a pseudonym, people can say what they really believe, and honest conversation is ultimately the most valuable thing for important topics like governance decisions. Because the stakes are so high, and decisions may potentially last decades or even centuries, debate must be as authentic as possible. Though [DAO](https://ethereum.org/en/dao/) governance may come to mind for most people reading this article; using anonymity, pseudonyms, or aliases to debate controversial topics is not new.

In the late 1700s, when the newly formed United States of America was deciding between a weak or strong constitution (governance protocol in crypto-speak), the bulk of the conversation took place between anons. Writers of [the Federalist Papers](https://en.wikipedia.org/wiki/The_Federalist_Papers) argued for a strong constitution while the authors of the [Anti-Federalist Papers](https://en.wikipedia.org/wiki/Anti-Federalist_Papers) took the opposite side. Both sides used pseudonyms or aliases such as Publius, Cato, and Brutus to express their arguments as a collective and as individuals. To this day, historians are not completely certain who wrote which paper.

Modern crypto and its various sub-cultures are built on the work of the anon [Satoshi Nakamoto](https://nakamoto.com/satoshi-nakamoto/) (along with many other anonymous and pseudonymous contributors) so it should be no surprise that anonymity is a regular feature of crypto-related discussions on platforms like Twitter. The idea for Zkitter is to go a step further and create a space where anons are not outliers but first-class citizens – where privacy is the default, going anonymous is as trivial as toggling between dark mode and light mode, and decentralization and censorship resistance are part of the architecture of the system. In other words, align the values of the platform with the values of the community.

## Using Zkitter

Zkitter offers many of the basic functions people have come to expect from a social network. Where things get interesting are the anonymity options.

**Signup**

When signing up you can decide whether to create an account using an Ethereum address or [ENS name](https://ens.domains/), which will be displayed as your username, or to create an anonymous account.

![https://www.zkitter.com/signup](/articles/zkitter-an-anon-friendly-social-network/dBqPvJok48PmEavi4ziVB.webp)

https://www.zkitter.com/signup

To join Zkitter anonymously, you need to verify your reputation on an existing social network. [Interep](https://mirror.xyz/privacy-scaling-explorations.eth/w7zCHj0xoxIfhoJIxI-ZeYIXwvNatP1t4w0TsqSIBe4) imports a reputation from an existing platform to help prevent spammers or bots from creating many anonymous accounts. You can currently import your Twitter, Reddit, or Github reputation to Zkitter. Thanks to the magic of ZK proofs, the information from your Twitter account is not linked to your anon identity on Zkitter – Interep only verifies that you meet the reputation criteria and does not collect or store any details about either account.

![https://docs.zkitter.com/faqs/how-to-create-an-anonymous-user](/articles/zkitter-an-anon-friendly-social-network/srqVAqctPfgTFRapL_qCp.webp)

https://docs.zkitter.com/faqs/how-to-create-an-anonymous-user

Once your reputation is verified, instead of a username, your Zkitter posts will simply show your reputation tier.

When you join Zkitter, you will sign a message to generate a [new ECDSA key pair](https://docs.zkitter.com/developers/identity) and write the public key to a [smart contract](https://arbiscan.io/address/0x6b0a11f9aa5aa275f16e44e1d479a59dd00abe58) on Arbitrum. The ECDSA key pair is used to authenticate messages and recover your Zkitter identity – so you aren't using your Ethereum account private key to sign for actions on Zkitter.

**Posting**

Posting to Zkitter will feel pretty familiar, but with some extra options. You can choose whether to post as yourself, or anonymously – even if you don't have an anonymous account. You can decide who you want to allow replies from, as well as whether the post will appear on the global feed or only on your own. If you've connected your Twitter account, you can also mirror your post to Twitter.

**Chat**

Any Zkitter user – anon or publicly known – has the option to chat anonymously.

![https://docs.zkitter.com/faqs/how-to-chat-anonymously](/articles/zkitter-an-anon-friendly-social-network/AjfTdRvCPiIPjnguqjrpV.webp)

https://docs.zkitter.com/faqs/how-to-chat-anonymously

Known identities and anonymous identities can interact with each other in private chats or on public threads.

## Private, on-chain identity

Zkitter is possible because of composability. The platform combines a variety of zero knowledge primitives and puts them all into one user-friendly package.

The base primitive of Zkitter is [Semaphore](https://mirror.xyz/privacy-scaling-explorations.eth/ImQNsJsJuDf_VFDm9EUr4njAuf3unhAGiPu5MzpDIjI), a private identity layer that lets users interact and post content anonymously. Semaphore IDs allow users to prove they are in a group and send signals as part of a group without revealing any other information.

Interep is the anti-Sybil mechanism of Zkitter. Because users are anonymous and anyone can join the network permissionlessly, Zkitter is susceptible to Sybil attacks. Interep allows new users to prove they possess a certain level of reputation from existing social networks.

![https://www.zkitter.com/explore](/articles/zkitter-an-anon-friendly-social-network/a-6ZAmTQi43YjwOUaKBz5.webp)

https://www.zkitter.com/explore

[RLN](https://mirror.xyz/privacy-scaling-explorations.eth/aKjLmLVyunELnGObrzPlbhXWu5lZI9QU-P3OuBK8mOY) provides spam protection for Zkitter and is also integrated with the [zkchat](https://github.com/njofce/zk-chat) encrypted chat function. RLN allows the protocol to set a limit on how many messages a user can send in a certain amount of time, and a user who breaks the spam rules can be [identified and removed](https://rate-limiting-nullifier.github.io/rln-docs/what_is_rln.html#user-removal-slashing).

A social platform with basic privacy guarantees and protections from spam and Sybil attacks allows users to explore how anonymity affects speech. Whether the option to interact anonymously is useful, or even interesting, will depend on what happens on social experiments like Zkitter. With no name, phone number, or email address to tie your digital identity to the one you use in the physical world, what would you say?

How would you be different?

## Join the experiment

If you are interested in experimenting with anonymous thread posting or chatting, you can [try Zkitter now](https://www.zkitter.com/home). If you have any comments or feedback, please let us know by using [#feedback](https://www.zkitter.com/tag/%23feedback/) directly on [Zkitter](http://zkitter/) or by joining the [PSE Discord channel](https://discord.gg/jCpW67a6CG).

To help build Zkitter, check out the [Github repo here](https://github.com/zkitter) or learn more by reading the [docs.](https://docs.zkitter.com/developers/identity)

Zkitter is being built anonymously by [0xtsukino](https://www.zkitter.com/0xtsukino.eth/) with contributions from [AtHeartEngineer](https://github.com/AtHeartEngineer), [r1oga](https://github.com/r1oga), and others.
