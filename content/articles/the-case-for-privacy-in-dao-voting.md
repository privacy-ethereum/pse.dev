---
authors: ["Private Governance Team at PSE"]
title: "The case for privacy in DAO voting"
image: "/articles/the-case-for-privacy-in-dao-voting/cover.webp"
tldr: "Private voting prevents corruption, enables more honest participation, and unlocks the full potential of decentralized governance. This post explains why privacy matters, how MACI enables it, and what comes next."
date: "2025-08-07"
tags: ["privacy", "governance", "DAOs", "MACI", "zkSNARKs"]
projects: ["MACI"]
---

# Transparent by default

_“For over a century, it has been recognized that a key technical component making democracy work is the **secret ballot**: no one knows who you voted for, and furthermore, you do not have the ability to prove to anyone else who you voted for, even if you really want to.”_
[- Vitalik Buterin](https://vitalik.eth.limo/general/2025/04/14/privacy.html)

Private voting prevents side games, which can lead to all sorts of perverse incentives (like bribes), which can corrupt votes or produce outcomes that are misaligned with the original intention of having the vote in the first place. Private voting also prevents collusion, where coordination between participants prevents individuals from expressing their true preferences. In general, [“whoever has the information has the power, ergo we need to avoid centralized control over information](https://vitalik.eth.limo/general/2025/04/14/privacy.html)” - so less information leak is a good thing.

Privacy is needed for technological progress. As Ethereum scales and adoption grows, financial and non-financial use cases for the technology increasingly rely on privacy as a necessary component. Lack of privacy locks us into a local maxima - the true potential of DAOs and decentralized governance only gets unlocked after privacy tools are good enough, and become fully integrated into the governance stack.

As important as privacy may be, there are also legitimate tradeoffs to recognize. Ethereum is fully transparent by default because technologies such as zero-knowledge proofs were not practically available when Ethereum was first launched. As a result, transparency - and the readability and accountability that comes with it - are still seen as positive attributes. A [recent post](https://blog.shutter.network/dao-voting-confidence-is-in-decline-how-to-restore-it/) by Decent DAO captures the sentiment well: _“DAOs were supposed to revolutionize governance. In the crypto community, many of us believed that by putting governance on the blockchain – transparently recorded and executed by code - we’d avoid the pitfalls of traditional systems.”_

In [an Optimism Collective discussion](https://gov.optimism.io/t/exploring-shielded-voting-enhancing-governance-on-optimism/8779/3) about shielded voting, community members have pointed out that private voting _“also eliminates the potential benefit of understanding the rationale behind others’ votes. Reading others’ reasoning before casting your vote can enrich your thought process by introducing new angles or considerations that you might not have initially considered (and even make you reconsider your initial stance).”_

Transparency, for all its faults, is highly legible and traceable, so it produces information that may actually improve the quality of the vote. Public voting is a necessary mechanism to judge the quality of delegated or representative voting.

Privacy shouldn’t be a binary all-or-nothing choice, but a trade-off dependent on the context. A modular instead of monolithic design choice. Let everyone have what they want, the Ethereum way!

# MACI: The private voting protocol for DAOs

The idea for [MACI](https://maci.pse.dev/) was first proposed in an [ethresearch post from Vitalik](https://ethresear.ch/t/minimal-anti-collusion-infrastructure/5413) in 2019. Since then, the case has been made again and again that [blockchain voting is important](https://vitalik.eth.limo/general/2021/05/25/voting2.html) and [privacy is essential](https://vitalik.eth.limo/general/2025/04/14/privacy.html). And more recently, we’ve seen huge [DAOs destabilized by vote buying](https://x.com/DefiIgnas/status/1909554283445387366). As DAOs evolve and mature, the need for private voting is becoming more apparent. [Decent DAO is exploring shielded voting](https://blog.shutter.network/dao-voting-confidence-is-in-decline-how-to-restore-it/), and community members have expressed the [desire for hidden ballots](https://x.com/LefterisJP/status/1921562225333916094) for important Ethereum DAO votes.

Privacy-preserving voting infrastructure such as MACI provides a solution to private voting, but adoption has been lacking, so we are working to change that. We hope that by integrating MACI into decentralized governance stacks and making improvements to the core protocol, DAOs and the communities they represent will have more options for higher quality, collective decision making - you can follow us on X to stay in the loop.

The best introduction for learning how MACI works is [this PSE article](https://maci.pse.dev/blog/maci-1-0-technical-introduction), but if you’re strapped for time, here is a high level summary:

![image.webp](/articles/the-case-for-privacy-in-dao-voting/1.webp)

https://maci.pse.dev/blog/maci-1-0-technical-introduction

In MACI, there are two roles: voters and the coordinator. At its most basic, MACI votes are encrypted so no outside party can read them, and the vote results are verified using a zero-knowledge proof so no one can tamper with the results (not even the coordinator). Smart contracts on Ethereum ensure censorship resistance and the system runs as programmed.

MACI relies on zkSNARKs or zero-knowledge proofs (ZKP) that verify a mathematical equation is true without revealing any other information. Very simply, all the votes, the validity of voters, and the outcome of the votes are turned into a mathematical equation that is verified by the ZKP. The ZKP is why the coordinator cannot change or falsify the outcome of the vote.

In Vitalik’s [post on privacy](https://vitalik.eth.limo/general/2025/04/14/privacy.html), he explains “Programmable cryptography techniques like zero-knowledge proofs are powerful, because **they are like Lego bricks for information flow**.” We intend to make the Lego bricks of zero-knowledge proofs easier to work with for DAOs and Ethereum in general.

![image.webp](/articles/the-case-for-privacy-in-dao-voting/2.webp)

https://maci.pse.dev/docs/introduction

---

## Next steps

We hope you are now as motivated to solve privacy in the governance space as we are! As well as pursuing integrations, the MACI team is excited to be undertaking research into a new version of the protocol that makes notable improvements to the trust assumptions of the protocol - stay tuned for announcements on our work over the next month.

DAO stacks, voting stacks, and decentralizing governance infrastructure teams - if you’re interested in MACI as a secure, private, zkSNARK-powered voting plug-in for your stack, please reach out to us at [PSE Discord](https://pse.dev/discord).
