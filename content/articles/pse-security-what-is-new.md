---
authors: ["Kyle Charbonnet"]
title: "PSE Security: What’s New"
image: null
tldr: "Explore the latest work from the PSE Security team on improving L2 and ZK security across Ethereum. Learn about tools like the ZK Bug Tracker, Bridge Bug Tracker, and advances in static analysis and formal verification."
date: "2023-04-25"
canonical: "http://web.archive.org/web/20240616003122/https://mirror.xyz/privacy-scaling-explorations.eth/BaqGMfBhEZR1cvTJlA9E3Xu5ZhD7IthLiUK-Q75rQMM"
tags: ["zk", "security", "l2", "formal-verification", "circom", "audits"]
projects: ["pse-security"]
---

# PSE Security: What’s New

This post was authored by **Kyle Charbonnet**, team lead of PSE Security.

## Table of Contents

- [What is the PSE Security Team?](#what-is-the-pse-security-team)
- [L2 Security](#l2-security)
- [ZK Security](#zk-security)
- [Recent Projects](#recent-projects)
- [How can I contribute?](#how-can-i-contribute)
- [Team Members](#team-members)

---

## What is the PSE Security Team?

The Privacy Stewards of Ethereum (PSE) team at the Ethereum Foundation has a dedicated security division focused on finding bugs and strengthening security in Ethereum’s L2 and zero-knowledge ecosystems. Bugs in these areas can have critical consequences, so proactive security is essential, especially in such fast-evolving domains.

---

## L2 Security

Layer 2s (L2s) are Ethereum’s main scaling strategy. While many are EVM-compatible, their security profile is distinct. The biggest concerns include:

- Secure bridging between L1 and L2
- Fraud proof mechanisms in optimistic rollups
- Sequencer control and data availability

ZK rollups share many of the same concerns but rely on validity proofs rather than fraud proofs. A great resource for L2 risk analysis is [L2Beat](https://l2beat.com), which categorizes L2 security characteristics.

---

## ZK Security

ZK technology, such as ZK rollups and zkEVMs, is pivotal for Ethereum’s scalability. But it introduces new security challenges:

- New codebases often have novel bugs
- ZK circuits are mathematically different from typical smart contracts
- Requires a new approach to verification and testing

Organizations like **Veridise**, **Trail of Bits**, and **0xPARC** are contributing to tools and research in this area.

---

## Recent Projects

### 1. ZK Bug Tracker with 0xPARC

This GitHub repo catalogs bugs and vulnerabilities in ZK apps.

- **Bugs in the Wild**: Real incidents across the ecosystem
- **Common Vulnerabilities**: Categorized, repeatable bug patterns
- Helps auditors target known failure points efficiently

![bug tracker](/articles/pse-security-what-is-new/1-bug-tracker.webp)

### 2. BigInt Audit with Veridise

Veridise and PSE collaborated to audit the Circom BigInt library.

- Found 8 critical bugs in CircomLib via formal verification
- ZK circuits lend themselves well to formal methods due to their mathematical structure
- Highlights tradeoffs between traditional code audits and math-based specs

![audit report](/articles/pse-security-what-is-new/audit-report.webp)

### 3. ZK Circuit Static Analysis with Veridise

A collaboration with researchers at UCSB and UT Austin produced the paper _“Practical Security Analysis of Zero-Knowledge Proof Circuits.”_

- Created 9 static vulnerability detectors
- Works on Circom circuits but is language-agnostic
- Complements formal verification—fast, automatic, and scalable

![audit report](/articles/pse-security-what-is-new/security-analysis.webp)

### 4. Bridge Bug Tracker

Created by Yufei Li, this repo documents bridge hacks and security learnings.

- Over $2B lost since 2021 in bridge exploits
- Tracks vulnerabilities and security best practices
- Critical as L2s rely heavily on bridging for asset transfer

![audit report](/articles/pse-security-what-is-new/hack-tracker.webp)

---

## How Can I Contribute?

Both the **ZK Bug Tracker** and **Bridge Bug Tracker** are open to community contributions. If you know of a bug or exploit not listed, feel free to open a pull request or issue.

---

## Team Members

- **Kyle Charbonnet** – Team Lead
- **Yufei Li** – L2 Security Engineer
- **Mridul Garg** – ZK Security Engineer

---

### Stay Updated

Subscribe to [Privacy Stewards of Ethereum](https://pse.dev) to get the latest on research, tooling, and security efforts.

Mint this entry as an NFT to add it to your collection.

Verification:  
Author Address: `0x7EC121d4AB04255…Ef81F2f4313F185`  
Content Digest: `BaqGMfBhEZR1cvT…IthLiUK-Q75rQMM`
