---
authors: ["PSE Team"]
title: "PSE December 2025 Newsletter"
image: "/articles/pse-december-2025/cover.webp"
tldr: "The year is about to end and we'd like to share our last updates this year."
date: "2025-12-18"
tags: ["newsletter"]
---

Welcome to the December edition of the PSE newsletter! The year is about to end and we'd like to share our last updates this year.

---

## 🏗️ Private Writes

### - Plasma{Fold, Blind}

We’re happy to share that we’ve finished the WARP implementation and have already run benchmarks to validate performance. Next, we’ll explore how to integrate post-quantum accumulation with private L2s.

### IPTF (Institutional Privacy Task Force)

In November, the team attended Devconnect in Buenos Aires. This was a great opportunity to (i) meet protocol teams in the ecosystem (ii) be more public about IPTF with talks and panels (iii) have a mini team-retreat and strategic EF-internal discussions. After Devconnect, most of the team took some time off to recharge.

We talked to many institutions over the month, and we also held office hours in Buenos Aires for 15+ protocol teams. We also gave talks and panels at many events: PSE Workshop, Cypherpunk Congress, DeFi Today, [Unchained Podcast](https://www.youtube.com/watch?v=ZarQsQy_czc), Privacy Stack Panel, ZK ID Day, Privacy & Compliance Summit, Privacy Salon, LFDT Privacy Panel, Ethereum Insights Forum. In addition to above, IPTF also spent a lot of time on things like: strategy, meeting with internal stakeholders at EF, cost center budget proposal, hiring.

As a result of our presence at Devconnect, we have a much better understanding of where vendor and protocol teams in the ecosystem are at in terms of meeting institutional privacy needs. By hosting office hours and showing them the work we do, they have a much better understanding of what the IPTF is and how we can help. By creating tight feedback loops (e.g. through the privacy market map), we are in a better position to ensure the ecosystem solves institutional blockers.

### Private Transfers

The Private Transfers team started work in October and has been researching the ecosystem since then. We have been reaching out to teams to understand different approaches and the problems they are facing, so we can decide how best to allocate resources. We spoke to lots of teams at devconnect and have continued those conversations with additional teams since then.
    
Our north star goal is to increase the number of asset transfers that happen on Ethereum privately. We are aiming to publish our 6 month roadmap by the end of January. We are currently exploring L2 changes for private transfers, zkWormholes, and ERC20 token transfers as potential roadmap items.

---

## 🪢 Private Proving

### iO

- We appeared on the ZK Podcast, where we talked about our team’s story and the progress of our research toward practical iO.
- We hosted Obfuscation Day, an obfuscation-focused event, at Devconnect in Buenos Aires. We explained why iO is essential to make Ethereum scalable for confidential smart contracts, and we presented our roadmap toward practical iO.

### Mopro 

We successfully delivered a talk and hosted a hands-on workshop at DevConnect. It was exciting to see a growing number of teams showing strong interest in — and actively building — ZK mobile applications.
    
At zkID Day, we also demonstrated an important capability on Android: proof generation can run entirely in the background. Even if the app is closed, the proving process continues, and users receive a notification once the proof is ready. This significantly improves the user experience and can be applied to any proving system.

### TLSNotary

- **alpha.14 nearly ready** (1 ticket left): sans-IO, keccak256 commitments, performance improvements, better config validation, bugfixes
- Ongoing work on **selective disclosure gadgets** and discussing a fast client-side proving **zkVM** for selective disclosure
- **Browser extension** component close to MVP + demo is ready deployment
- Continued progress on **plugin-based SDK** using the **WASM component model**
- DevConnect
    - [Videos online](https://www.youtube.com/playlist?list=PL_mbTxtri1CwCZ6CaelJY_gVvSAh9jp68) (recommended:“zkTLS fundamentals”)
    - Demo: [https://devconnect.tlsnotary.org](https://devconnect.tlsnotary.org/)

### zkID Standards

The zkID team attended Devconnect in Buenos Aires and successfully organized the zkID and Client-Side Proving Day, presenting work on Privacy in Digital ID, Revocation, and zkPDF. The OpenAC whitepaper was released publicly and announced, with ongoing efforts to collect and address feedback.

### Client-Side Proving

November was driven by the broader push to get the project Devconnect-ready, so most changes were about tightening the client-side proving benchmark correctness/coverage and making runs dependable on dedicated hardware.

On the benchmark side, we expanded ECDSA coverage to ProveKit, Barretenberg, and RISC Zero, alongside follow-up fixes to ensure curve choices and benchmark properties were correct. We also filled in missing reported properties across several systems (so outputs are consistent), and made those properties required so results don’t silently omit fields. We implemented detailed log/profiler output parsing to automatically extract constraint counts for non-Rust systems, rather than relying on manually maintained numbers.

Operationally, we set up a dedicated bare-metal AWS machine and installed a self-hosted GitHub Actions runner. To make it reliable, we removed workflow dependencies on shell init files (like ~/.bashrc), improved manual triggering/collection, and fixed CMake/native build caching so caches are separated per runner type and don’t restore stale absolute paths from the GitHub runner.

We have presented the benchmarking results at the **zkID and Client-Side Proving day** at Devconnect. You can explore the results at the new section of the EthProofs page: https://ethproofs.org/csp-benchmarks

### Privacy Experience

Over the past months, Privacy Experience team has focused on strengthening the privacy ecosystem through community-building, research, and strategic alignment. We hosted seven events before and during Devconnect, including Preconnect and multiple privacy-focused days, bringing together builders, researchers, and projects to showcase PSE’s work, deepen collaboration, and advance conversations around privacy infrastructure. In parallel, we completed our privacy experience research, combining qualitative interviews and survey data to assess the current state of privacy tools. Building on these efforts, we are now pivoting toward the Private Reads track and launching a new Privacy Acceleration team to support wallets, RPCs, indexers, and explorers in integrating privacy features starting with Tor-based solutions. Meanwhile, we will continue to explore more tangible outputs to improve privacy user experience across Web3.
