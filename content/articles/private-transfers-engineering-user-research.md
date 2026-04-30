---
authors: ["John Guilding"] # Add your name or multiple authors in an array
title: "Private Transfers: User Research" # The title of your article
image: "/articles/private-transfers-engineering-user-research/cover.webp" # Image used as cover,  Keep in mind the image size, where possible use .webp format, possibly images less then 200/300kb
tldr: "A summary of 38 interviews conducted for user research into private transfers" #Short summary
date: "2026-05-01" # Publication date in ISO format
tags: ["Private Transfers", "User Research"] # (Optional) Add relevant tags as an array of strings to categorize the article
projects: ["Private Transfers Engineering"]
---

# Private Transfers: User Research

The Private Transfers Engineering team conducted 38 user interviews with teams working in the private transfers space. We interviewed protocol teams building for end users — not end users themselves. The conversations were freeform, but three main lines of questioning were covered:

1. What technical problems they were facing
2. What core protocol changes they would like to see
3. What non-technical problems they were facing

Roughly a quarter of projects interviewed had some sort of ZK-based shielded pool architecture. Approximately 3 were stealth address protocols, ~4 were FHE-based, ~3 were wormhole-based, ~7 were L2s, and ~3 used TEEs, followed by a long tail of other specific tech stacks and mixed-technology protocols. For example, some teams used a combination of technologies — ZK + stealth addresses, ZK + FHE, etc. ZK-based shielded pools and L2s therefore formed a large proportion of the sample size, and impact results accordingly.

This does not constitute representative quantitative data, but can be used to assess what problems were most often mentioned across the aforementioned mix of teams and technologies. Technical problems faced and core protocol changes requested should not be interpreted as the most important issues to work on, or a vote on those changes.

## Technical Problems

A number of technical problems were raised across multiple categories. As mentioned above, the sample of projects interviewed skewed in favour of ZK-based projects, but important recurring themes were making privacy protocols cheaper to use for end users, reducing trust assumptions, and composing with DeFi.

### Cost & Performance

**ZK proof verification gas:** Verification of zero-knowledge proofs on Ethereum is prohibitively expensive in terms of onchain gas costs. Verification gas and proving times were identified as the highest-priority bottlenecks for several teams — this was also a key reason why some teams opted to drop ZK in favour of other approaches. Verifying a Groth16 proof for a private transfer costs on the order of magnitude of several hundred thousand gas today, while verifying a Halo2 (KZG Plonk) proof with a small circuit can cost approximately 1,000,000 gas.

**ZK proof generation time:** Generation of zero-knowledge proofs is computationally heavy for user devices. Proof generation is too slow on client side, especially on mobile devices. For example, elliptic-curve pairing operations are a specific bottleneck on user devices. Server-side proving is a straightforward solution but constitutes a censorship vector, and can reveal user private state if proof data is sent unencrypted. Some protocols require proof generation times on the order of magnitude of tens of seconds. Sub-second proving was cited as the threshold for this no longer being a problem.

**Hash function inefficiency:** The enshrined hash function (Keccak) is inefficient to prove inside ZK circuits. There is a lack of native support for a ZK-friendly hash function such as Poseidon. This leads to increased circuit size and proving time. A ZK-friendly enshrined hash function would significantly alleviate this inefficiency.

**Ethereum storage proofs are expensive:** Proving things about Ethereum’s state is slow and expensive today. This blocks privacy designs that need storage proofs such as wormholes.

**Large ciphertexts:** Large ciphertexts (specifically for FHE) do not fit well into Ethereum’s storage model. Projects rely on events, or off-chain storage with a hashed commitment onchain. FHE ciphertexts can be in the range of multiple KB depending on the scheme used.

**Throughput:** Several teams highlighted Ethereum throughput, rollup capacity, and FHE coprocessor throughput as incompatible with the scale required for privacy-preserving payment rails. Some FHE projects could reach hundreds of TPS but wanted tens of thousands of TPS. For some projects, current throughput was enough to meet demand, but this is not sufficient to meet prospective future demand.

**Long block times and slow finality:** Not necessarily important for privacy itself (it is important for bytecode obfuscation techniques which rely on sending transactions over multiple blocks for maximum privacy), but important for payments in general.

### State, Composability, & Integration

**Fragmented anonymity sets:** Shielded pools are fragmented across different dapps and chains, reducing the effective anonymity set for all users. Each new privacy protocol must bootstrap its own anonymity set. This also leads to walled garden effects.

**Privacy protocol state growth:** State growth (e.g. nullifier state tree growth) is a long-term scaling concern. Unlike a regular transfer, where new state is added on a per-account basis (each new account adds new state for that account's balance), a UTXO-based private transfer protocol using a commitment and nullifier tree adds new state per transaction. This is because encrypted UTXOs need to be created, and also marked as spent using nullifiers to prevent double spends every transfer.

**State management and synchronisation scalability:** Syncing private state (scanning for incoming notes/events) is a bottleneck for clients. Client-side devices have to scan large amounts of chain state in order to construct their private balance state. This degrades UX as wallet users have to wait for scanning to complete before they can see their latest balance. Advances in PIR or OMR could unlock more scalable approaches, and using oblivious synchronisation such as outlined in Zcash's project Tachyon offers one path forward for handling protocol state growth.

**DeFi composability:** Wrapping/unwrapping tokens for DeFi operations leaks privacy and intent, and breaks composability with existing protocols. Smart contracts cannot easily interact with encrypted/private balances. Shielded assets lack an unencrypted balance, and stealth address balances lack a single unified balance, both of which conflict with existing protocol designs such as AMMs and lending protocols. DeFi operations by their nature have much richer transaction data than regular transfers, which makes it harder to hide in the crowd, and makes analysis easier. Another way of framing lack of composability is to say that private state is isolated, whereas contract state is normally shared state. This state model and lack of composability puts limits on the design space of applications. This problem was raised by a variety of teams as a difficult and important problem to solve.

**Deposit/withdrawal privacy leakage:** Several teams identified the entry and exit points of privacy systems as the dominant privacy leak, not the protocol itself. For example, depositing and quickly withdrawing makes analysis of that identity much more straightforward. Liquidity and anonymity are split across different chains — bridging across chains also leaks privacy.

**Full privacy is harder to achieve for account-based approaches:** When using an account-based privacy approach, such as [ERC-7984: Confidential Fungible Token](https://eips.ethereum.org/EIPS/eip-7984), different aspects of privacy are harder compared to using a note-based, multi-asset shielded pool. Account-based approaches simplify many aspects of composability with the EVM, but come with other tradeoffs. Asset privacy is hard to achieve since the token contract explicitly defines the asset type. Anonymity is harder to achieve than confidentiality, since state access patterns reveal which state was accessed, which over time allows analysis to correlate specific account state with specific identities.

**Tooling:** Ethereum developer tooling lacks support for private transfers and private contract state.

### Wallets, Key Management, & Standards

**Lack of native wallet support:** Privacy features such as new addresses per dapp, and access to private transfers, are not natively integrated into major wallets. This forces reliance on specific dapps, and significantly damages UX.

**Key management complexity:** Users can be forced to manage multiple keys (spending, viewing), which is a UX hurdle. Some protocols address this by deriving additional secrets from existing user accounts.

**Spending funds with stealth addresses:** Receiving funds privately (e.g. via stealth addresses) is solved, but spending them without linking to a public gas-paying address remains difficult. After you receive funds privately, using those funds without accidentally revealing links is still hard (moving funds, offramps, interacting with apps). Having no unified balance also makes interacting with protocols harder, since a protocol such as an AMM assumes a single balance.

**Lack of hardware wallet support for ZK-friendly cryptography:** ZK protocols prefer ZK-friendly hashing and signatures to make proof generation efficient. Hardware wallets do not natively support ZK-friendly curves and signature schemes such as EdDSA over BabyJubJub.

**Traditional viewing-key model is not programmable enough:** The model of having a single viewing key with full view of an account's history is not compatible with compliance requirements. Compliance requires fine-grained control with expressive selective disclosure of the relevant data to specific counterparties.

**Lack of standards:** There are limited or no standards for private tokens, compliance, or wallet interactions. This leads to ecosystem fragmentation.

### Security & Additional Trust Assumptions

**Relayer reliance:** To break links or pay gas for private transactions, protocols often rely on third-party relayers. This introduces centralisation and censorship risks. Privacy leaks still remain if gas sponsorship is traceable, which is predominantly the case — at least to the relayer entity.

**Reliance on external networks:** Encrypted tokens and many privacy protocols rely on external networks to provide services such as encryption/decryption — for example, FHE coprocessors and TEEs. This introduces censorship and privacy risks. For example, FHE coprocessors use threshold-encryption schemes with a committee to perform decryption, which adds additional trust assumptions compared to sending a regular Ethereum transaction. It should be noted that these external networks offer significant advantages in other areas, which make them attractive for many use cases. FHE allows for composable and programmable encrypted smart contracts, and TEEs offer unmatched performance at the expense of hardware trust assumptions.

**Collision risks with unspendable addresses:** Wormhole-based projects all suffer from the same security problem. Each unspendable address has 80 bits of entropy, which means an attacker can potentially generate a private key that collides with an unspendable address and claim the funds. While each attack would be limited to a single address, this level of security is not high enough. You can add a small proof of work to each address to generate an extra 12 bits of security, taking each address to 92 bits. For reference, L1 follows typical security guidance and targets 128 bits of security.

## Core Protocol Changes Requested

**Precompiles for ZK efficiency:** Introduction of precompiles for ZK-friendly cryptographic primitives (e.g. Poseidon hash, specific elliptic curve operations, bulletproofs) to reduce verification costs.

**State-tree improvements:** Several teams asked for improvements to the Ethereum state tree — Poseidon or other ZK-friendly tree hashes, and binary or otherwise more proof-friendly structures.

**Native shielded pools:** Requests for a protocol-level shielded pool (similar to the Zcash model) where users can move funds into private state natively (including requests for a multi-asset shielded pool).

**Protocol features that many privacy protocols can share:** A more general request — shared primitives to avoid fragmentation. For example, wormhole-style primitives, or a shared shielded pool.

**Better primitives for storage proofs:** Making it much easier and cheaper to prove things about Ethereum’s state.

**Native account abstraction:** Necessary for enabling private gas payments (paymasters) to disconnect the spender's identity from the transaction fee payer.

**Encrypted data types:** A standard way for the protocol to handle or point to encrypted data types, allowing smart contracts to interact with private balances more easily. Smart contracts today cannot represent encrypted values as a first-class data type. Encrypted state ends up passed around as bytes, stored off-chain with a commitment onchain, or emitted as events. Some FHE teams asked for the protocol to define how encrypted data is represented and accessed, so contracts can interact with private balances the way they interact with ERC-20s today. ERC-7995 was named as a candidate.

**zkWormhole support:** Interest in mechanisms that allow for "plausibly deniable" deposits and withdrawals. 32-byte addresses would address the 80-bit security problem. At the same time, some teams expressed strong concern and opposition to wormholes at the L1. This is because the plausible deniability gained from using wormholes mixes clean and illicit funds. This contradicts certain interpretations of user sovereignty, whereby users should be able to choose which funds they associate with.

**Shorter block times and finality:** While not directly related to private transfers, shorter block times and faster finality were mentioned as an option to significantly improve private payments UX.

**Deliberate stances of where not to change the protocol:** While there was appetite from many teams for L1 changes, some teams did not come back with requests for protocol changes, or came back with only a single request. This was mainly because they didn't have opinions on the core protocol, or because they didn't view something as important enough. While the case for private transfers, shared data structures, increased performance, etc. was much clearer, due to the state model on Ethereum, appetite for generalised private contract state was far more uncertain and was not directly requested. And as mentioned above, some opposed features that would provide plausibly deniable private transfers.

The good news is that a number of these features are already on the Ethereum roadmap. A variant of Poseidon is landing as part of the Lean Ethereum roadmap and is undergoing cryptanalysis now. The long-awaited migration from the Merkle Patricia Trie is planned, native account abstraction proposals are progressing, and quicker finality and shorter slots are now high priority, with 3-slot finality being targeted. Importantly, private transfers at the L1 is now a planned feature. However, what shape this upgrade will take is currently unspecified.

## Non-Technical Problems

There are a number of non-technical concerns projects raised. These are not problems teams like PSE could necessarily solve, but it is good to understand these constraints, as they impact technical implementations. Interestingly, while all teams highlighted technical problems, a number of projects stated that the most important problems they faced in their business were NOT technical problems. Teams had built products where they deemed the technical tradeoffs sufficient to go to market, and were now dealing with how to navigate the regulatory environment and achieve PMF.

**Regulatory uncertainty:** Teams were unsure what level of privacy with compliance is acceptable. Association sets à la Privacy Pools have minimal legal precedent. Institutions want stronger forms of compliance, which creates tension with wanting unconditional privacy.

**Low demand and no product-market fit:** Narrative interest has not necessarily translated into usage. There is a mismatch between stated interest and revealed preference. Users are unwilling to pay or suffer friction for privacy. Teams reported that retail demand was low, and that institutional demand was theoretically high but strictly conditional on compliance, and had not arrived in size yet. Some institutional demand was exploratory, and not urgent. While lack of retail PMF was mentioned by some teams, for others there was evidence of PMF. For example, some whales are happy paying 25-50 bps per trade for privacy.

**Legal risk:** Developers fear legal repercussions (sanctions, law enforcement action) if their tools are used by illicit actors. This discourages the development of open, permissionless privacy tools in favour of compliant privacy tools. When thinking about privacy at the core protocol level, some highlighted that risks exist here too. Major exchanges cannot list certain privacy assets, and one worry is that a sufficiently strong default privacy design could put ETH itself in that category, impacting Ethereum adoption.

**Risk of institutions setting the bar too low for privacy:** Privacy is table-stakes for many institutions wanting to come onchain, and projects are rightfully building for these user needs. Attracting institutional capital comes with the risk of building for them at the expense of individual user sovereignty. For example, institutions can be more concerned with privacy as confidentiality than as anonymity. Institutions want to know "to whom and when" information is disclosed, rather than have complete anonymity. Institutions also require compliance, and compliance introduces censorship vectors that can harm user privacy.

**Liquidity constraints:** Several teams said a practical blocker to private transfers being useful was liquidity. More liquidity in privacy protocols is needed to increase effective-anonymity set sizes, and therefore utility for users. Where large counterparties such as exchanges, market-makers, stablecoin issuers, and TradFi institutions choose to park their capital will impact this issue, and they themselves would need sufficient liquidity provided to enter privacy protocols.

**Priority of privacy:** Privacy can be a lower priority for some apps until later stages, or not at all. Privacy will become more important as products develop and market penetration increases.

**Lack of shared roadmap or coordination:** Teams wanted EF-level guidance. A lot of teams asked what our plans were for private transfers. Teams also wanted to understand what upcoming features to expect related to privacy, as it would impact their roadmap. Teams didn’t want to build in the wrong direction. _Note that these interviews were conducted before private transfers at L1 were announced on the EF strawmap_. Since the specific privacy features at the L1 are under research, a fully-defined shared roadmap is still missing.

**Resource constraints and sustainability:** Many teams are small and face significant resource constraints. Small teams can’t take on large redesigns or deep protocol work. They need to work on smaller tasks and have a shorter time horizon because of runway. Audits remain expensive. Some privacy projects struggle to find sustainable business models, often relying on grants rather than business revenue.

**Hiring strong technical talent is difficult:** It's hard to find talented developers with experience in ZK, for example. The developer pool is small.

## Top Topics (by team mention count)

Rough mention counts across the 38 interviews. ZK-based shielded pools and L2s formed a large proportion of the teams interviewed compared to other categories. This impacts results, and the following table should not be interpreted as representative quantitative data from all privacy teams.

Non-technical problems showed up more often than many technical problems. High-level topics that had the largest share of mentions were: cost and performance of private transfers (raised as several distinct problems), composability with DeFi, regulatory uncertainty, and finding product-market fit.

| Rank | Topic                                                           | Approx No. of Teams |
| ---: | --------------------------------------------------------------- | ------------------: |
|    1 | **ZK proof generation time**                                    |                  14 |
|    2 | **ZK proof verification gas**                                   |                  13 |
|    3 | **Regulatory uncertainty**                                      |                  11 |
|    3 | **DeFi composability**                                          |                  11 |
|    5 | **Deposit/withdrawal privacy leakage**                          |                  10 |
|    5 | **Lack of native wallet support**                               |                  10 |
|    7 | **Reliance on external networks**                               |                   9 |
|    8 | **Hash function inefficiency**                                  |                   8 |
|    8 | **Lack of standards**                                           |                   8 |
|    8 | **Resource constraints and sustainability**                     |                   8 |
|   11 | **Legal risk**                                                  |                   7 |
|   12 | **Low demand and no product-market fit**                        |                   6 |
|   12 | **Private state synchronisation**                               |                   6 |
|   14 | **Tooling**                                                     |                   5 |
|   14 | **Collision risks with unspendable addresses**                  |                   5 |
|   14 | **EVM not designed for privacy**                                |                   5 |
|   14 | **Fragmented anonymity sets**                                   |                   5 |
|   18 | **Throughput**                                                  |                   4 |
|   18 | **Institutional preference for confidentiality over anonymity** |                   4 |
|   20 | **Cross-team coordination forum**                               |                   3 |
|   20 | **Relayer reliance**                                            |                   3 |
|   20 | **Large ciphertexts**                                           |                   3 |
|   20 | **Full privacy is harder for account-based approaches**         |                   3 |

## What's next

The user research uncovered a number of problems and surfaced what was important to many different teams. Making privacy protocols cheaper was a recurring mention, alongside finding a good way to compose with DeFi, and a number of non-technical problems were important to teams as well. It is clear that appetite exists amongst privacy teams for privacy at the L1 — improving cost and performance of privacy protocols, and having shared features different teams could plug into, were notable high-level goals mentioned.

The Private Transfers Engineering team is publishing our exploration into L2 precompiles next. Stay tuned for our State of Private Transfers Report launching at the beginning of Q2, which will be accompanied by a dashboard.
