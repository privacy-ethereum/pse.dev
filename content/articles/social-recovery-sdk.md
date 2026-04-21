---
authors: ["Rasul Ibragimov"]
title: "Social Recovery SDK: design, implementation and learnings"
image: null
tldr: "Social recovery is a wallet recovery model where trusted guardians can help restore access if the owner loses their key, replacing fragile seed-phrase backups with programmable onchain policy. Social Recovery SDK gives developers a complete toolkit to add this flow to smart wallets: configure guardian sets and thresholds, verify guardian proofs, run challenge periods, and execute secure ownership handover. In this blog post we break down the architecture, implementation details, and key learnings from building it."
date: "2026-03-02"
tags: ["social recovery", "zkp", "privacy"]
---

## TL;DR

Social recovery has been discussed for years, but developers still lack a practical, trustless SDK they can integrate directly into wallets. In this post, we present Social Recovery SDK: an on-chain recovery stack with threshold policies, timelocks, and multiple guardian authentication methods (EOA signatures, passkeys, and zkJWT). We explain why we chose a monolithic RecoveryManager architecture over a composable design, and how we implemented and tested the system across Noir circuits, Solidity contracts, and client SDK modules. The result is a working v1 with strong on-chain guarantees, plus clear open problems for future iterations.

## What is Social Recovery

Social recovery is a mechanism to restore control over an account when the original signing key is no longer usable, by executing a predefined recovery procedure that involves other actors (**guardians**).

Social recovery generally comes in two forms: **off-chain recovery**, where trust and reconstruction happen outside the blockchain (for example via Shamir Secret Sharing key restore mechanism), and **on-chain recovery**, where guardian policy, verification, and ownership handover are enforced directly by smart contracts; this blog post (and SDK) covers the latter.

The recovery mechanism targets non-custodial accounts (EOA with EIP-7702 or, more generally, Smart Accounts); it is intended for key-loss recovery (not seed phrase theft protection). It relies on protocol-defined rules (policies), not on a "support desk" or a single master key.

Social recovery is not a new idea: the core primitives have existed for years, and many wallet teams have already implemented custom recovery flows. The topic has been discussed for a long time, including Vitalik Buterin's writing on social recovery in January 2021[^1], yet there is still no simple, trustless, developer-friendly SDK that supports multiple authentication methods out of the box. That is exactly why we built Social Recovery SDK.

## Social Recovery SDK: architecture / design

Designing the architecture was the hardest part of building Social Recovery SDK. Most implementation bugs can be fixed later, but core design mistakes become protocol constraints, so we treated this phase as the critical one. While working through architecture, we uncovered several non-obvious tradeoffs around trust assumptions, UX, and policy enforcement. *In this section, we share the key decisions that shaped the SDK*.

There are many valid ways to design social recovery, so we started from goals rather than from a specific implementation. Our target properties were: no single party can unilaterally take over an account; N-of-M approvals with timelocks; support for multiple guardian authentication classes; minimal reliance on centralized services; and better guardian privacy so the guardian set is not trivially exposed on-chain. Just as importantly, we wanted a recovery flow that non-developers can complete, closer to a Web2 “Forgot password” experience than a research prototype.

From these goals, the SDK architecture naturally split into two major layers. First is the **smart-contract layer**: interfaces and concrete contracts for guardian authentication adapters and recovery policies, where security-critical rules are enforced on-chain. Second is the **client SDK layer**: adapters and orchestration logic that generate proofs, package recovery intents, and interact with contracts safely.

At a high level, the recovery lifecycle has two phases. The first is **configuration**: the wallet owner defines guardians, threshold (N-of-M), and challenge period/timelock policy. The second is **recovery** itself: guardians initiate and submit authenticated approvals, and once threshold and timing conditions are satisfied, the contract verifies this and transfers smart-account ownership to the new owner. This split keeps policy explicit up front and execution deterministic during incidents.

### What is a guardian and guardian types

A guardian is an actor that can help restore access to an account under a recovery policy, for example by approving a recovery intent or proving an authentication claim. A guardian can be a person, device, organization, or another account, and in our SDK guardians are handled as policy participants enforced on-chain (not via any centralized admin). In the first published version of the SDK, we support three guardian classes: EOA (ECDSA signature verification), Google email (zkJWT), and passkeys.

### Architectural Options for On-Chain Recovery

There are multiple valid ways to design on-chain social recovery, and early in the project we seriously evaluated both.
At a high level, the tradeoff is between a monolithic RecoveryManager (one contract owns policy + verification + execution) and a composable architecture (guardian-specific auth contracts plus a separate policy aggregator).

Our initial direction was the composable approach. In that model, different guardian classes are implemented in separate contracts, and recovery can be coordinated through existing primitives such as a dedicated Safe, where guardians act as signers and Safe enforces N-of-M approvals. This has clear advantages: development is usually faster, components are easier to test and debug independently, and upgrades or bug fixes can be isolated per module. We built a local PoC around this idea, and it worked.

But the main issue there was a timelock enforcement. For social recovery, timelocks are not optional: without them, a colluding guardian set can potentially take over a wallet before the owner can react. In a composable setup based on Safe signers, robust timelock enforcement requires adding an extra custom Safe module/plugin. At that point, effective control shifts to that module, which is not meaningfully simpler than running a dedicated RecoveryManager contract, and the overall system becomes just heavier.

For that reason, we chose the monolithic approach for the first SDK release. This decision was also informed by discussions with the ZK Email team, who have worked on social recovery for a long time[^2]. The monolithic design gave us the most direct way to guarantee policy correctness, timelock semantics, and end-to-end security in one place.

---

For more details about the design and architecture, refer to the documentation[^5] and specification[^4].

## Implementation

### High-level diagram of the SDK

![High-level architecture diagram for the Social Recovery SDK](/articles/social-recovery-sdk/high-level-architecture.svg)

### zkJWT Circuit

For the zkJWT circuit, we implemented the proving logic in Noir and kept the constraints aligned with the recovery intent model from the spec[^4]. At a high level, the circuit verifies:
* JWT signature validity
* enforces email_verified = true
* checks that the claimed email matches the private input
* binds the proof to the recovery flow via intent_hash.

It then outputs a guardian commitment $\operatorname{Poseidon2}(\mathrm{email\\_hash}, \mathrm{salt})$ that is used by on-chain verification.

Testing is split into two layers: circuit-level tests inside [main.nr](https://github.com/privacy-ethereum/social-recovery-sdk/blob/main/circuits/zkjwt/src/main.nr) and integration-style proving flow through scripts ([generate-prover.ts](https://github.com/privacy-ethereum/social-recovery-sdk/blob/main/circuits/zkjwt/scripts/src/generate-prover.ts)) that produce Prover.toml, run witness/proof generation, and verify outputs against expected commitment/public inputs.

### Smart Contracts

For Smart Contracts, we used Foundry for compilation, testing, and deployment workflows. The core design is one RecoveryManager per wallet policy, with dedicated verifier contracts for passkeys and zkJWT, while EOA validation is handled through signature recovery. Current test coverage is broad across lifecycle, replay protection, mixed guardian types, edge cases, and policy updates; at the moment the suite reports **155 passing tests**. This includes both unit-style checks (libraries/verifiers) and full recovery-flow tests (start, submit, execute, cancel, expire, and policy mutation behavior).

### Client SDK

On the client side, the SDK provides the integration surface as reusable modules, not app-specific glue code. AuthManager + adapters (EOA, Passkey, zkJWT) generate guardian proofs in a common format, while RecoveryClient handles *start -> submit -> execute* interactions with typed contract wrappers. PolicyBuilder provides deterministic policy construction for guardian sets and thresholds, and EIP-712 helpers keep intent hashing/signing consistent between off-chain and on-chain paths. The goal of this layer is to keep wallet integration thin while preserving the protocol guarantees defined in contracts.

### Integration & Example App

The SDK is designed to be integrated directly into existing wallets and dapps, rather than used as a standalone protocol service. A typical integration flow is straightforward: deploy verifier/recovery contracts, configure guardian policy for each wallet, wire SDK auth adapters on the client, and expose recovery actions (start, submit proof, execute) in the product UI. This lets teams keep their own wallet UX while delegating recovery-critical enforcement to on-chain policy logic. For implementation details and exact integration steps, follow the project documentation[^5].

To make integration concrete, we also built a local demo dapp: a minimal smart-wallet app with the SDK recovery flow fully wired in. It includes policy setup, guardian-based recovery, and end-to-end execution against a local chain. You can run it locally with Foundry installed, plus Google OAuth configuration for JWT-based authentication (required for zkJWT). For full setup and run instructions, use the dedicated guide[^6].

---

You can find the implementation of the SDK here[^3].

---

## Open questions

While the protocol is production-oriented in scope, a few important open problems remain outside the SDK boundary and are worth calling out explicitly:

1. **Private salt synchronization (owner <-> guardian).**  
   For zkJWT-style guardians, the private salt must be shared in a way that preserves privacy and does not create extra UX friction. The unresolved question is who should generate it and how it should be transferred without forcing users into awkward side channels (for example, manual email exchange). In the current SDK flow, this sync is intentionally left to the wallet owner (manual handoff).

2. **DKIM public-key registry and trustless rotation.**  
   DNSSEC coverage is still incomplete across providers (including major ones), which makes trustless key-rotation handling a real issue for email-based authentication. Our recommendation is to use self-maintained on-chain registries updated by the domain owner. For long inactivity windows, a fallback migration path to a DAO-supported key registry is a practical safety mechanism.

3. **Cross-chain UX without keystores.**  
   Without shared keystore primitives, users must reconfigure and repeat recovery setup across chains, which degrades UX and increases operational risk. This limitation is out of scope for the current SDK but affects real adoption. We expect proposals like RIP-7728 (L1SLOAD precompile + Keystores) to materially improve this by making cross-chain recovery state more portable.

[^1]: Vitalik Buterin, *Why we need wide adoption of social recovery wallets* (January 2021): https://vitalik.eth.limo/general/2021/01/11/recovery.html  
[^2]: ZK Email social recovery docs: https://docs.zk.email/account-recovery/  
[^3]: Social Recovery SDK repository: https://github.com/privacy-ethereum/social-recovery-sdk/  
[^4]: Specification (SPEC.md): https://github.com/privacy-ethereum/social-recovery-sdk/blob/main/SPEC.md  
[^5]: Official documentation: https://privacy-ethereum.github.io/social-recovery-sdk/  
[^6]: Example app / integration guide: https://github.com/privacy-ethereum/social-recovery-sdk/tree/main/example
