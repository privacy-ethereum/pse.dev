---
authors: ["PSE Team"]
title: "Reflecting on MACI Platform: What We Built, Learned, and What’s Next"
image: "/articles/reflecting-on-maci-platform/reflecting-on-maci-platform.webp"
tldr: "After a year of development and experimentation, the MACI Platform project is being sunset. In this retrospective, we share what we built, what we learned, and how the work can continue."
date: "2025-05-01"
canonical: ""
projects: ["maci"]
tags:
  [
    "MACI",
    "Privacy",
    "Public Goods",
    "RetroPGF",
    "Zero Knowledge",
    "Governance",
  ]
---

Over the past year, we've been on a journey to explore how [MACI](https://github.com/privacy-scaling-explorations/maci) could power more democratic, privacy-preserving voting in real-world funding scenarios. The MACI Platform was our experiment in bringing those ideals into practice. Today, we're sharing [what we built](#what-we-built), [what we learned](#what-we-learned), and [why we've decided to sunset the project](#why-were-sunsetting)—along with some parting thoughts on where the opportunity still lies.

---

## From Demo to Deployment

The MACI Platform began as a fork of [Easy Retro PGF](https://github.com/gitcoinco/easy-retro-pgf), with the initial goal of showcasing to the Optimism Foundation that MACI could be used to run onchain, private RPGF (Retroactive Public Goods Funding) rounds. As the project evolved, so did our ambitions.

We moved beyond a demo mindset and set out to build a robust, production-ready platform for running secure, privacy-preserving voting rounds—whether for RPGF, Quadratic Funding (QF), or simpler vote-based allocations. Our approach was simple: **build → run rounds → gather feedback → iterate**.

This is in line to the [multi-mechanism future that Gitcoin](https://x.com/gitcoin/status/1881739519101145294) and other industry leaders propose.

---

## What We Built

After around 10 months of development, the MACI Platform reached [v2](https://github.com/privacy-scaling-explorations/maci-platform/releases/tag/v2), and included:

- **Flexible gatekeeping** via:, [Zupass](https://zupass.org/), [EAS](https://eas.eth/), [Hats](https://hatsprotocol.xyz/), [Semaphore](https://semaphore.pse.dev/), ERC721 token ownership, etc.
- **Quadratic and non-quadratic voting modes**
- **Project submission workflows** for voters and round organizers
- **Support for running multiple concurrent rounds**

We collaborated with communities to deploy real RPGF and QV rounds at:

- [EthMexico](https://pse-team.notion.site/case-study-eth-mexico-24?pvs=73)
- [Cryptoversidad](https://pse-team.notion.site/case-study-cryptoversidad-24?pvs=74)
- [Ethereum TGU](https://pse-team.notion.site/case-study-ethereum-tgu-24-trust-round?pvs=74)
- [Devcon SEA](https://pse-team.notion.site/case-study-devcon-sea-24?pvs=74)
- [Hacking PSE](https://pse-team.notion.site/case-study-hacking-pse-24?pvs=74)

The **Devcon round** was our most ambitious deployment, with a $250K funding pool, thousands of possible voters, hundreds of participants voting directly from smart wallets on their phones and laptops—with gas fully abstracted.

---

## What We Learned

### 💡 Technical

- Integrating MACI into a user-friendly frontend remains non-trivial.
- The protocol and tooling still lacked maturity for frictionless integration.
- Running real rounds offered invaluable feedback loops that shaped both the platform and MACI itself.

### 🧭 Organizational

Because the platform and protocol were built by the same team, feedback loops lacked external pressure. Engineers often “fixed” protocol-side issues themselves, which meant we didn’t experience MACI the way an independent integrator might. A separate protocol/app team split might have surfaced deeper usability pain points earlier.

### 📉 Adoption

Aside from Devcon and our internal hackathon, most rounds only happened when we provided grant support. While the platform showed promise, spontaneous adoption didn’t materialize. We believe time and visibility may have changed this, but we had to weigh tradeoffs.

---

## Why We’re Sunsetting

We’re officially sunsetting the MACI Platform for a few core reasons:

- **Lack of organic demand**: Gitcoin already serves much of the QF/RPGF space. Demand for privacy in these flows appears low at this stage.
- **Better MACI integrations elsewhere**: For example, [Gitcoin’s own MACI integration](https://github.com/gitcoinco/MACI_QF) is more likely to evolve with user needs.
- **Alternative options emerging**:
  - [MACI Wrapper](https://github.com/yashgo0018/maci-wrapper)
  - [PriVote](https://github.com/PriVote-Project)
  - and others...

---

## What We’re Leaving Behind

Although we’re moving on, we’re leaving behind tools and code we hope others can build on:

- [MACI Platform Codebase](https://github.com/privacy-scaling-explorations/maci-platform):
  - Extended smart contracts
  - Subgraph for frontend integration
  - Complete frontend stack

We **won’t be maintaining this codebase** going forward. However, it is fully functional and can be used as-is with MACI v2—or forked to integrate with future versions like MACI v3.

The [MACI protocol](https://github.com/privacy-scaling-explorations/maci) itself is very much alive and improving. If you're looking to build a secure, private voting experience into your app or DAO, we’d love to support you.

---

## Gratitude

This project wouldn’t have existed without the care, sweat, and imagination of:

**Sam, Ctrlc03, Doris, Cris, Anton, Nico, Hodlon, Andy, Mari, Kali, and John**

And our partners in the Ethereum and PGF ecosystem who took a bet on using something still experimental. Your support made this a truly generative learning experience.

---

## Looking Ahead

The platform development may pause, but the need for privacy-preserving voting remains. We believe that one day, MACI—or protocols like it—will be foundational infrastructure for democratic coordination onchain and offchain. Until then, we’ll keep building, listening, and sharing what we learn.

_– The MACI Platform Team_
