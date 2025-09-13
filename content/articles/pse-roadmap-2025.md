---
authors: ["Andy"] # Replace/adjust if you want to use a different display name
title: "PSE Roadmap: 2025 and Beyond"
image: "/articles/pse-roadmap-2025/cover.png" # Suggest placing the cover in a dedicated folder
tldr: "The Privacy Stewards of Ethereum (PSE) mission-driven roadmap for embedding privacy as a first-class citizen across Ethereum, focusing on private writes, private reads, and private proving."
date: "2025-09-12"
tags: ["Ethereum", "Privacy", "Roadmap", "Zero-Knowledge", "Decentralization", "FHE", "MPC", "TEE"]
projects: ["pse"]
---

*This is an aggregation of many ideas from across the ecosystem, shaped by contributions from many people smarter than us. Compilation was driven by [Sam](https://x.com/samonchain), with inspiration and input from Vitalik, Silviculture Society, PSE team & particularly* [*Oskar*](https://x.com/oskarth) *through countless conversations.*

# Introduction

Ethereum is on the path to becoming the settlement layer for the world, but without strong privacy, it risks becoming the backbone of global surveillance rather than global freedom. A system without privacy will push institutions and users elsewhere, undermining the very mission that brought Ethereum into existence. If Ethereum fails to build privacy, it fails to protect the people who rely on it.

That’s why we’re refocusing PSE from a cryptography explorations team, into a problem-first team: **Privacy Stewards for Ethereum**. Our role isn’t to own every solution in the space, but to drive clarity, focus, collaborations, and outcomes across the ecosystem ensuring privacy is treated as a first-class feature at the application layer.

This document lays out how we’ll pursue that mission, and how we can build together in the upcoming months and years.

# Overview

## Mission

_Our mission is to help define and deliver on Ethereum's privacy roadmap._

Ethereum deserves to become core infrastructure for global digital commerce, identity, collaboration, and the internet of value. But this potential is impossible without private data, transactions, and identity. We take responsibility within the Ethereum Foundation for ensuring privacy goals at the application layer are reached, and we’ll work with protocol teams to ensure that any L1 changes needed to enable strong, censorship-resistant intermediary-free privacy take place.

## Vision

_Our vision is to make privacy on Ethereum the norm rather than the exception._

Ethereum will have comprehensive end-to-end privacy embedded across the technical stack (protocol, infrastructure, networking, applications, wallets). Privacy solutions will be widely adopted across core use cases (e.g. finance, identity, governance), seamless in user experience, performant, cost-effective, and compliant with global regulations.

## Identity

_We’re revamping our identity to reflect our new mandate._
PSE is evolving from “Privacy & Scaling Explorations” to “Privacy Stewards of Ethereum”.
This is a change in name, mindset, and culture.
- We’ll focus on concrete problems vs. pursuing cool tech
- We’ll focus on ecosystem outcomes vs. internal projects

[We already revamped our website to reflect these changes: pse.dev](https://pse.dev/) as well as internal team’s goals and ways of working. 

# Strategy

## Approach

PSE will compile and communicate the problem space, ensuring the ecosystem has clarity on priorities and confidence that progress is real.

**Principles**
- Subtraction by default. We should not do everything, we aim for the greatest impact where others do not act.
- Values: inspired by EF’s values of censorship resistance, open source, privacy, security. Our key points of leverage: credible neutrality, reputation, domain expertise, long-term thinking. They guide how we assess the ecosystem, provide constraints on how we evaluate options and make decisions.
- Problem-driven resource allocation. We fund efforts to solve important ecosystem problems based on outcomes we aim to see. This means working our way backwards from end goals, and structuring efforts as “problems to be solved” vs. “projects to fund”.
- These shape how we build, what we pursue vs. ignore, and how we prioritize.

**Process**
1. [Problem radar](https://hackmd.io/@xzoey/HyR3Oi2Bxl): continuously map ecosystem problems related to privacy (iterative process; not a one-off)
2. Execution map: decide and act on what PSE should be actively involved in, with 3 levels of engagement: (a) lead vs (b) support vs (c) monitor, and metrics for tracking progress toward goals.
3. Communicate publicly: and invite feedback. share on e.g. public newsletters, open community calls, working groups, forums and blog posts. Continuous feedback loops should be the norm.

## Key tracks
Drawing inspiration from the simplicity of the [Protocol](https://blog.ethereum.org/2025/06/02/announcing-protocol) and [EcoDev](https://blog.ethereum.org/2025/07/10/future-of-ecodev) announcements, we’re aligning PSE’s roadmap around three clear focus areas. These come out out of our [privacy domain mapping](https://hackmd.io/@xzoey/HyR3Oi2Bxl), highly-rated [user stories](https://docs.google.com/spreadsheets/d/1fvfft-zaSiswxA6PRmw7dfZ4zalhmqdDxfFUyt_nGR0/edit?gid=714505087#gid=714505087), insights from [existing initiatives](https://pse.dev/projects), and various input from key community stakeholders e.g. [Vitalik](https://www.youtube.com/watch?v=oCANLFSCPq8&t=831s), [Silviculture Society](https://ethereum.foundation/silviculture-society), [EF management](https://ethereum.foundation/people).

### (A) Private writes

**Make private onchain actions as cheap and seamless as public ones.**

Improve the feasibility, usability and affordability of writing to Ethereum privately. Whether that’s sending a transfer, casting a vote, or interacting with applications. This track includes longer-term bets on FHE and pushing the cutting-edge towards practical obfuscation.

### (B) Private reads

**Enable reads from Ethereum without revealing identity or intent.**

Improve network-level privacy to ensure users can query, browse, or authenticate with Ethereum apps without surveillance or metadata leakage.

### (C) Private proving

**Make proving any data private and accessible.** 

Make proof generation and verification fast, private, and accessible. Enable data portability and verifiable data provenance across environments, by delivering purpose-bound, data-minimized proofs for on/off-chain states, web data, documents, and identity attestations.

---

These tracks capture what PSE as Privacy Stewards of Ethereum is actively working towards and enabling, both for individuals and institutions. They also serve as rallying points for collaborators across the Ethereum privacy and scaling ecosystem.

These focus areas don’t represent everything PSE touches, but they form the backbone of what we’re committed to shipping and advancing. Specific priorities and initiatives within this tracks will vary in their investment timelines and deliverables, and will evolve with the ecosystem, but we expect these general focus areas to persist for the next few years.

## Key initiatives

These are PSE’s highest priority initiatives we’re starting or continuing executing on for next 3-6 months.

*(numbers for tracking purposes)*

**On Private writes**

### (1) Private transfers

- Continue [PlasmaFold](https://pse.dev/projects/plasma-fold)
    - Add privacy transfer features using PCD and folding. Targeting PoC by Devconnect
    - Add post-quantum accumulation scheme.
    - Work with Intmax and other ecosystem players on path to integration.
- Support Kohaku (privacy wallet PoC).
    - Implement zk account recovery combination framework of N of M methods
    - *Oversight of keystore implementation for stealth addresses
    - .. and more on private reads side
- Map and publish report with different technology approaches to private transfers.

### (2) Private governance

- Present a ‘State of private voting 2025’ report.
- Collaborate with teams on a new private voting protocol/assist with existing efforts.
- Continue work with Aragon and other integrations.

### (3) Confidential DeFi

- Kick off IPTF (Institutional Privacy Task Force) with EF EcoDev Enterprise team.
- Unblock institutional adoption, via privacy specifications and/or PoCs.

### (4) Private computation

- Continue long-term bets on programmable privacy (practical iO, vFHE)
    - Continue [MachinaIO](https://pse.dev/projects/machina-io)
    - Oversee [Phantom Zone](https://phantom.zone/) [grant](https://www.notion.so/20dd57e8dd7e80aba5cbd130a2c2ef0f?pvs=21)
- This nurtures the ecosystem with cutting edge research.
- Continuing ecosystem mapping like [‘Open, Application-Driven FHE for Ethereum’](https://ethresear.ch/t/open-application-driven-fhe-for-ethereum/23044)

**On Private reads**

### (5) Network privacy

- Kick off Private RPC working group with internal researchers/engineers and external advisors
- Kohaku on private RPC: collaborate on privacy-preserving reading of the Ethereum state from remote RPC nodes by integrating an ORAM solution
- Broadcast privacy: bring privacy by routing transactions through mixnet. Spec (eth2p2p discv5) and implement the sphinx mixing protocol.
- End points with privacy-preserving RPC nodes: adding this and other privacy features into a browser with all privacy batteries included by default
- Methodically study the SOTA of ORAM and PIR and share insights in peer-reviewed venues
- Translate the outcomes of research research into ORAM and PIR into the Ethereum user experience: wallets, browser, and RPC nodes.

**On Prove anywhere**

### (6) Data portability

- Advance development of data provenance protocols and tools. In particular
    - **Stabilize and optimize TLSNotary:** make our open-source, neutral and secure zkTLS protocol production ready for others to adopt and build other zkTLS protocols on top.
    - **SDK:** build an SDK that enables seamless integration of the TLSNotary protocol across mobile, server, and browser platforms, improving DevEx and time to market for teams.
    - **Accelerate the ecosystem:** drive adoption and innovation in zkTLS with community initiatives (e.g., zkTLS Day, X spaces, blogs), emphasizing privacy and robust security.

### (7) Private identity

- Advance the development of standards for generic zk-snarks
- Develop a modular, privacy-preserving ZKP wallet unit providing unlinkable verifiable presentations aligned with the EUDI.
- Research and develop revocation frameworks that support unlinkable and scalable credential revocation.
- Steward the digital identity ecosystem by advocating Ethereum and L2s as decentralized trust registries

### (8) Client-side proving

- [Continue applied research on efficient, practical, ZK proving systems](https://pse.dev/projects/client-side-proving)
- Credibly neutral benchmarking, drawing inspiration from [ethproofs.org](http://ethproofs.org/)
- Includes efforts on [Mopro](https://pse.dev/projects/mopro), [PPD](https://pse.dev/projects/private-proof-delegation), and Noir acceleration, a joint effort between the EF, Aztec, and other partners to improve Noir's security, tools, and ecosystem to ensure that the next generation of private applications can be secured on Ethereum, in line with the [EF’s 1TS initiative](https://ethereum.org/en/trillion-dollar-security/) and enterprise adoption goals.

### (9) Privacy experience (PX)

- Holistic view of privacy experience from users’ perspective applied across all 3 tracks
- Identifying design patterns, commons interfaces, tools/specs/standards needed.
- Will include design, comms, events, website work to support privacy efforts.

# Next Steps

So where do we go from here? If you’re building privacy, we want to work with you. Whether we collaborate through working groups, standards, by sharing research, or just by rooting for your project. 

If you read all this way and saw something that didn’t make sense or could be better, we want to hear from you! What did we miss? What’s being mis-prioritized? What’s been over invested?

If you want to reach us over chat please go for [ethresearch discord](https://t.co/EqHJvFlv9E) in the #privacy channel. Find our work at [pse.dev/projects](https://pse.dev/projects) and [pse.dev/research](https://pse.dev/research). Learn our published work at both [ethresear.ch](https://ethresear.ch/) and [ethereum-magicians.org](https://ethereum-magicians.org/). 

Hope to see you all at Devconnect in one of the following events we’ll be present, organizing, or supporting: Ethereum Cypherpunk Congress, Privacy Community Hub, zkTLS Day, zkID Day, Ethereum Privacy Stack, Encryption Days, Noircon2, and many more