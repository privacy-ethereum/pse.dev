---
authors: ["PSE Team"]
title: "Devcon VI Recap"
image: null
tldr: ""
date: "2022-11-16"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/plfDBIpiKZVyNSJWhE9vix76JaJoJ1seDfRAddV7HEc"
tags:
  [
    "zero-knowledge proofs",
    "semaphore",
    "privacy",
    "ethereum",
    "pse",
    "zkevm",
    "zkopru",
    "interep",
    "identity",
    "public goods",
  ]
projects: ["semaphore", "zkopru", "interep", "bls-wallet"]
---

The potential of [zero-knowledge](https://ethereum.org/en/zero-knowledge-proofs/#what-are-zk-proofs) cryptography was on full display at Devcon VI in Bogota, which featured a [dedicated ZK track](https://archive.devcon.org/archive/playlists/devcon-6-zkps-privacy-identity-infrastructure-and-more/) for the first time ever. Since most of [PSE’s work](https://appliedzkp.org/) has happened in the 3 years since [Devcon V in Osaka](https://archive.devcon.org/archive/watch?edition=5&order=desc&sort=edition), it was also a debut for many of our projects – and many of our team members met for the first time! There was a lot we were excited to share with the community. In this post, we’ll revisit some highlights of our time in Bogota, including talks by PSE team members and the Devcon VI Temporary Anonymous Zone.

## Temporary Anonymous Zone (TAZ)

Devcon VI [Community Hubs](https://forum.devcon.org/t/rfp-5-community-hubs-closed/454) were dedicated community spaces to gather around topics or initiatives, each hosted by a different group or organization. The PSE team had the opportunity to design one of these hubs, which we called the Temporary Anonymous Zone (TAZ).

![](/articles/devcon-vi-recap/jRWhyCjD9FEtEXssLtAFh.webp)

ZKPs may have earned a track on the Devcon schedule, but the technology we work on can still sometimes feel mysterious – even scary – so we hoped to create a friendly and welcoming place for experts and beginners alike.

![](/articles/devcon-vi-recap/XxQMColt3EwEgrx7q2BAq.webp)

The TAZ allowed us to show the human side of our work and create a space for open questions and conversations about ZK. There were plenty of “aha” moments and realizations for both the people we talked to and the PSE team itself.

The PSE team’s work revolves around exploration and community support. Conversations at the TAZ helped us understand more about our place within the Ethereum community and how we might decide which directions to explore next.

![](/articles/devcon-vi-recap/3yn-D87gf2ncklpE3KOzG.webp)

We also heard from more than one totally unpaid person that we had the “best swag”…

![https://twitter.com/shumochu/status/1580258439829168128](/articles/devcon-vi-recap/lKfXl5zS4FJPUCA7Jjijq.webp)

https://twitter.com/shumochu/status/1580258439829168128

### TAZ App

When the WiFi permitted it, the [TAZ app](https://taz.appliedzkp.org/) allowed many visitors to use ZKPs for the first time in a low-stakes and accessible way. With just a QR code and their phone, people could easily generate a Semaphore ID and interact anonymously with other Devcon attendees by drawing or asking and answering questions. Live applications like [heyanon](https://twitter.com/DevconAnon) and [zkitter](https://www.zkitter.com/explore/) let users get a sense for how anonymity could change the way they expressed themselves.

![https://taz.appliedzkp.org/](/articles/devcon-vi-recap/5VNb1RHAyZ4T0d-6W5APN.webp)

https://taz.appliedzkp.org/

The TAZ app was a practical showcase for how Semaphore could be integrated into different applications and let people try using ZK proofs for anonymous social interaction. We hope to continue building and improving on this idea in the future. One thing we wish we did with the app was get feedback!

If you were with us at Devcon and still have your Semaphore ID QR code, you can log back into the app and [share your feedback](https://taz.appliedzkp.org/feedback) anonymously. We’re already making plans for future TAZ experiments, and your feedback on the first version will help us make the next one even better.

You can also let us know how we did on the [PSE Discord.](https://discord.gg/jCpW67a6CG) Or just come say hi!

## PSE Talks Roundup

### PSE: What We Do and How to Get Involved

If this is your first time hearing of the PSE team, this talk is a good place to start. It gives an overview of the primitives, infrastructure, tools the PSE team has been building and how we support contributors.

![](/articles/devcon-vi-recap/84S0htnB4QjvRftfNUdtZ.webp)

Watch [PSE: What We Do and How to Get Involved](https://www.youtube.com/watch?v=HnGmgVo3nWw)

### Semaphore: Anonymous Signaling on Ethereum

[Semaphore](https://semaphore.appliedzkp.org/), the protocol used in the TAZ to allow users to interact anonymously with the Devcon group, is one of PSE’s most used privacy primitives.

![](/articles/devcon-vi-recap/-l9236SLJtNbiJ6lgKVf2.webp)

Watch [Semaphore: Anonymous Signaling on Ethereum](https://archive.devcon.org/archive/watch/6/anonymous-signalling-on-ethereum/?tab=YouTube)

### Interep: An Identity Bridge from Web2 to Web3

[Interep](https://interep.link/), built using Semaphore, is a practical solution for preventing sybil attacks on Ethereum. Geoff explained how the protocol uses ZK proofs to anonymously import reputation from Web2 networks such as Github, Reddit, and Twitter.

![](/articles/devcon-vi-recap/4WYV18ECt-am4PkJ3P0XH.webp)

Watch [Interep: An Identity Bridge from Web2 to Web3](https://archive.devcon.org/archive/watch/6/interep-an-identity-bridge-from-web2-to-web3/?tab=YouTube)

### Private Exchange on Zkopru

[Zkopru](https://zkopru.network/), an optimistic rollup that uses ZK proofs to protect the privacy of its users and one of PSE’s longest-running projects, was featured in two presentations:

![](/articles/devcon-vi-recap/bsAbX--0Ys64kQm9rln_q.webp)

- [Private Exchange on Zkopru](https://archive.devcon.org/archive/watch/6/private-exchange-on-zkopru/?tab=Swarm) focused on the implementation of Zkopru with other zero knowledge protocols in a private exchange application.
- [Public Goods, Experiments and the Journey of Zkopru](https://archive.devcon.org/archive/watch/6/public-goods-and-experiments-the-journey-of-zkopru/?tab=Swarm) traced the development of Zkopru and how it fits into the PSE ethos of experimentation and building public goods.

### Onboard The World Into Your Rollup dApp with BLS Wallet

[Account abstraction](https://archive.devcon.org/archive/watch/6/account-abstraction-panel/?tab=YouTube) continued to gain steam in Bogota, with some great hackathon projects at ETHBogota and [talks at Devcon](https://archive.devcon.org/archive/watch/?order=desc&q=account%20abstraction&sort=edition). Adoption challenges still remain, but a friendlier and faster user experience is gaining adoption via innovations like BLS signatures and account abstraction.

![](/articles/devcon-vi-recap/VkegEmh-Jot1gWvUu79NA.webp)

Watch [Onboard The World Into Your Rollup dApp with BLS Wallet](https://archive.devcon.org/archive/watch/6/onboard-the-world-into-your-rollup-dapp-with-bls-wallet/?tab=YouTube)

### Designing Public Goods Using ZKPs

At the PSE, we take design seriously. Thinking deeply about the best ways to help people understand and use tools enabled by ZK proofs (ZKPs) is a huge part of the team’s work. Rachel shared some of the processes and philosophies PSE’s design team uses to translate complex concepts into recognizable mental models.

![](/articles/devcon-vi-recap/Mm-5YFd99jIHgl5JUyfq-.webp)

Watch [Designing Public Goods Using ZKPs](https://archive.devcon.org/archive/watch/6/designing-public-goods-using-zkps/?tab=YouTube)

### ELI5: Zero Knowledge

If all this ZK stuff is sorcery to you, you’re not alone. This field is complex, confusing, and intimidating – especially for beginners – so sometimes learning like a 5-year-old is the best way to get started. Check out this introductory talk to increase your knowledge from zero to slightly more than zero.

![](/articles/devcon-vi-recap/_5mjaUv_5w2bbds35k-md.webp)

And if you don’t know, now you know.

Watch [ELI5: Zero Knowledge](https://archive.devcon.org/archive/watch/6/eli5-zero-knowledge/?tab=YouTube)

### What to know about Zero Knowledge

One of our favorite panels was a conversation moderated by Albert Ni between Barry Whitehat, Vitalik Buterin, and Gubsheep. If you’re interested in high-level ideas surrounding ZK and why so many in the community are excited about this area of research, this is one to watch (or rewatch)!

![](/articles/devcon-vi-recap/Z7D_I3d469JfUJ1mz5-Zx.webp)

Watch [What to know about Zero Knowledge](https://archive.devcon.org/archive/watch/6/what-to-know-about-zero-knowledge/?tab=YouTube)

BONUS: For another high-level perspective about the potential of zero-knowledge cryptography, check out gubsheep’s talk: [ZKPs and "Programmable Cryptography"](https://archive.devcon.org/archive/watch/6/zkps-and-programmable-cryptography/?tab=YouTube).

### Sessions with 0xPARC

PSE is just one of many teams and organizations in the broader ZK community. We’re all trying to push the boundaries of ZK research and figure out what’s possible through exploration and experimentation. At Devcon, we were fortunate enough to organize a full day of programming with our friends and frequent collaborators at [0xPARC](https://0xparc.org/), with presenters from all over the ecosystem covering a range of topics in the applied ZK field.

Unfortunately there were some recording issues during these sessions so some presentations were missing sections of video or audio 🙁. We’ve collected the recordings we do have into playlists below, and we’ll work with presenters to re-record and upload talks that were affected by the technical difficulties.

The **Future of ZK Proving Systems** session explored techniques, tools, and applications enabling the interoperable and efficient proof systems of the future. \[[https://www.youtube.com/playlist?list=PLV91V4b0yVqSyooZlCxKhYn3my9Mh6Tgn](https://www.youtube.com/playlist?list=PLV91V4b0yVqSyooZlCxKhYn3my9Mh6Tgn)\]

The **ZK Security workshop** brought together experts in ZK, formal verification and assurance to discuss approaches to securing ZK apps. \[Videos coming soon at: [https://www.youtube.com/playlist?list=PLV91V4b0yVqQBwxoUGqoHHuif1GRfg2Ih](https://www.youtube.com/playlist?list=PLV91V4b0yVqQBwxoUGqoHHuif1GRfg2Ih)\]

The **ZK Application Showcase** was a rapid-fire series of presentations and demos to get up to speed on some of the newest projects from across the ZK community.

![](/articles/devcon-vi-recap/GPXCiodHqQzrls07d-yYl.webp)

Watch [ZK Application Showcase](https://www.youtube.com/playlist?list=PLV91V4b0yVqSR2OJhFv-0ZxEvTWnm7bDR)

### PSE Playlist

This is just a sampling of presentations by the PSE team, but there are many other projects at varying levels of maturity. If you want to get up to speed on all things PSE at Devcon, we’ve curated a playlist to get you started.

![](/articles/devcon-vi-recap/P297hpwnF0bummk6vNJDi.webp)

Watch [PSE Playlist](https://www.youtube.com/playlist?list=PLV91V4b0yVqRQ62Mv0nUgWxJhi4E67XSY)

## ¡Muchas Gracias, Bogotá!

For the PSE team, Devcon was a time to finally put a face to the voice or avatar on Discord. We had an amazing time meeting and getting to know each other and the Ethereum community. Hope to see you next time!
