---
authors: ["aleph_v"]
title: "Pretty Good Payments: Free, Private and Scalable Stablecoin Transactions on Ethereum"
tldr: "Pretty Good Payments combines zero-knowledge proofs with a yield-based economic model that turns idle deposits into network fuel, enabling free, private stablecoin transactions that settle directly on Ethereum."
date: "2026-02-26"
canonical: "https://hackmd.io/@geistermeister/ByauB7su-g"
tags: ["privacy", "rollups", "zero-knowledge proofs", "Ethereum", "payments"]
projects: ["private-transactions-research"]
---

> This article is a guest contribution by [aleph_v](https://github.com/aleph-v), an external contributor and developer of Pretty Good Payments. The work was supported by a Cypherpunk Fellowship from Protocol Labs and Web3Privacy Now and a matching grant from EF PSE.

In 1991, Phil Zimmermann released Pretty Good Privacy, a tool that brought practical encryption to everyday email. It wasn't perfect in every theoretical sense, but it was good enough to meaningfully protect ordinary people, and it changed what privacy meant on the internet.

Pretty Good Payments carries that same ambition into finance. It combines zero-knowledge proofs with a novel economic model that turns idle deposits into the fuel that runs the network. Sender, receiver, amount, and transaction graph are all hidden from observers. The whole system settles directly to Ethereum, secured by cryptographic proofs and economic incentives enforced on L1. And it's free — users pay zero fees.

## The Problem

Ethereum users face two persistent frustrations: high transaction costs and zero privacy. When you pay a freelancer in USDC, your employer can see your salary. Your landlord can see your net worth. Anyone who learns a single address of yours can trace your entire financial life — no hack required, just a block explorer. Every transfer is recorded permanently on a public ledger, and anyone can follow the money.

For the privilege of this transparency, you pay gas fees that can spike unpredictably. Existing privacy solutions come with their own costs: high fees, centralization risks, limited token support, or clumsy user experiences. Layer 2 rollups have reduced costs dramatically, but they've done little for privacy.

Pretty Good Payments asks a more ambitious question: *"what if there were no fees at all?"*

## What It Feels Like

You tap send, enter the amount, and confirm. Behind the scenes, a zero-knowledge proof is generated in roughly half a second and submitted to a sequencer. The sequencer validates the transaction and returns a preconfirmation — a commitment to include it in the next block — in milliseconds, as fast as the API can respond. To the user, it feels no different from sending a message.

The recipient sees the funds arrive moments later. Neither party pays a cent in fees — only the intended amount moves. The entire transaction stays completely private: sender, receiver, and amount are all hidden. Final settlement on Ethereum follows after a challenge period, during which anyone can prove fraud if they find it. The preconfirmation is backed by the sequencer's staked ETH — submitting a transaction they preconfirmed and then failing to include it means losing their stake.

Whether you're a freelancer receiving payment, a fintech building a payment app, or a DAO distributing grants — this is what "free and instant" looks like in practice: zero fees, sub-second responsiveness, and up to 400 transactions per second across the network.

## How It Works: The Big Picture

Pretty Good Payments is technically classified as a rollup, though it may not match the mental image that word conjures. It settles directly to Ethereum, its transaction data lives on Ethereum, and its security comes from Ethereum, using an open set of sequencers and standard ERC-20 tokens. Think of it as a smart contract system that batches private transactions and posts them to L1, with a fraud proof mechanism that lets anyone keep sequencers honest.

### Privacy

When you deposit tokens into Pretty Good Payments, they're converted into encrypted notes, sealed envelopes containing value. Each note records the token type, the amount, a random blinding factor, and a public key identifying the owner. All of this is hashed together using a cryptographic function called Poseidon, so the on-chain record reveals nothing about what's inside.

When you want to spend a note, you generate a zero-knowledge proof: a mathematical demonstration that you know the private key for that note, that the note exists in the system, and that your transaction balances. The proof reveals none of the underlying details. An observer sees that *a valid transaction happened* but learns nothing about who sent it, who received it, or how much was transferred.

This is the same foundational approach used by Zcash, adapted for Ethereum.

### Free Transactions Through Yield

Here's where Pretty Good Payments gets creative. When you deposit tokens, the system puts them to work immediately, routing them into yield-generating vaults like Aave or Compound that earn interest on deposited assets.

The yield generated by everyone's deposits is what pays the sequencers, the participants who batch and submit transactions to Ethereum. In a traditional rollup, sequencers charge you fees. In Pretty Good Payments, sequencers earn from the collective yield pool instead. Their share is proportional to how much blob space they fill with transactions — process more transactions, earn more yield. Priority sequencers who commit to reliable block production earn a 2x multiplier during their exclusive submission windows.

To put concrete numbers on it: a single Ethereum block can carry up to 21 EIP-4844 blobs, each holding roughly 273 private transactions — over 5,700 transactions per block, at a cost of 0.01 to 0.001 cents (not dollars) per transaction. For example in a recent demo the team submitted 1638 transactions for 0.06 cents, if you were to submit one such blob each block you'd get 126 transactions per second for a year with only 145k (eg 0.06 cents per block). To support this cost using only low risk DeFi or Ethereum staking yield earning 3% APY you would only need 4.8 million of TVL, which is a very achievable number for a wide range of applications.

The result: users transact for free, and sequencers get paid. Your deposited funds still belong to you and you can withdraw them at any time. For most users, the convenience of free private transactions far exceeds the yield they'd otherwise earn and they might even get yield back if there are enough deposits.

## How Security Works

Pretty Good Payments is a stage two rollup by default, the highest level of rollup decentralization and security. Its security is grounded entirely in Ethereum and in open participation: anyone can become a sequencer, and anyone can hold sequencers accountable.

The system uses an optimistic model — blocks are assumed valid unless proven otherwise. After a sequencer posts a batch, there is a challenge period during which anyone can submit a fraud proof. If no fraud is proven within the window, the block is finalized. If fraud is proven, the block and everything after it is rolled back, and the sequencer's stake is slashed.

### Open Sequencing

Anyone can become a sequencer by staking ETH, and the stake acts as a security bond: submit invalid data and you lose it. To ensure reliable block production, time is divided into epochs. Each epoch has a closed period where a designated priority sequencer gets an uncontested window to submit, followed by an open period where any staked sequencer can participate. The open period guarantees that the system keeps producing blocks even if a priority sequencer is offline, keeping the network live and censorship-resistant.

This openness is particularly relevant for businesses. Any company can register as a sequencer and batch transactions on behalf of its own users, with no approval process and no dependency on a third-party sequencer. A business stakes a small amount of ETH, runs the sequencer software, and submits its customers' transactions directly to Ethereum. The entire relationship is between the business, its users, and the Pretty Good Payments smart contracts.

This opens up real use cases across finance and payments. A financial institution could settle zero coupon bonds through Pretty Good Payments, using private notes to represent positions and settling them on-chain while not revealing onchain the counterparties and notional amounts. A fintech provider could integrate Pretty Good Payments as the payment rail behind a consumer app, giving users instant, free stablecoin transfers with the same feel as any polished payment product, offering super fast preconfirmations and free transactions to only their users. Since the system is generic over many types of assets many types of end users can be served in the same privacy set, with all companies contributing to each other's privacy.

### Permissionless Fraud Proofs

After a sequencer submits a batch of transactions, it enters a challenge period. During this window, anyone can examine the data and prove fraud if they find it. Being a challenger just means running the software.

The system guards against every way a sequencer could cheat: wrong deposit values, double-spends, invalid proofs, incorrect state updates. If a challenger proves any of these, the sequencer loses their entire stake, with half going to the challenger as a reward and the other half burned. The fraudulent batch and everything submitted after it is rolled back.

This makes fraud strictly unprofitable, because even if a sequencer colludes with a challenger, the burned half guarantees a net loss. The system further simplifies the process with single-round fraud proofs: the challenger submits all evidence in one transaction and the contract verifies everything on the spot.

## Ethereum-Keyed Accounts: Programmable Privacy

Any note in Pretty Good Payments can be owned by an Ethereum address — including a smart contract. Spending requires an on-chain approval through the system's Transaction Registry, so private value can move in and out of on-chain logic atomically. The authorizing address is visible, but the destination, amount, and transaction graph remain hidden. Users can always transfer from an Ethereum-keyed note into a standard ZK-keyed note, making the visible portion a brief, deliberate moment in a longer private flow. This means that you can maintain full programmable composability with Ethereum while also using private transfers of arbitrary assets.

This opens up programmable privacy across Ethereum:

- **Trustless private swaps**: A DEX contract matches orders on-chain but settles through private note transfers — the counterparty and amount stay hidden.
- **Treasury management**: A multisig or DAO treasury governed by on-chain votes distributes payroll or grants where the total outflow is visible but individual recipients and amounts are not.
- **Escrow and subscriptions**: Escrow logic is transparent and auditable on L1, while the actual movement of value to end recipients happens privately.

## The Road Ahead

Pretty Good Payments sits at a new point in the rollup landscape, one where privacy and zero fees aren't competing luxuries but complementary features of the same economic model. Yield-funded sequencing aligns incentives in a way that traditional fee markets can't: users want free transactions, sequencers want deposits that generate yield, and both get what they want.

What comes next is getting Pretty Good Payments into the hands of builders: fintechs looking for a payment rail, institutions that need private settlement, and developers who want to build on programmable privacy. If you or your company is interested in these features please reach out to the team for help and advice on deployment and integration.

---

*Pretty Good Payments is open source. Explore the architecture, run a sequencer, or start building on top of it at the [project repository](https://github.com/aleph-v/pretty_good_payments).*
