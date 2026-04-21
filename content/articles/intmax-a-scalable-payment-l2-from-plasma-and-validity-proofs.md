---
authors: ["PSE researcher Pierre"]
title: "Intmax: a scalable payment L2 from plasma and validity proofs"
image: "/articles/intmax-a-scalable-payment-l2-from-plasma-and-validity-proofs/intmax-a-scalable-payment-l2-from-plasma-and-validity-proofs-cover.webp"
tldr: "This post was written by PSE researcher Pierre and originally posted on his [personal blog](https://www.pierredm.xyz/posts/intmax). Thanks to the Intmax team for their helpful review on this post!"
date: "2025-03-04"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/__VLZrfjSScx42E786k-Ba4YptQfv8ujCWY_DuN1k4o"
tags:
  [
    "intmax",
    "plasma",
    "l2",
    "scaling",
    "zero-knowledge proofs",
    "validity proofs",
    "plonky2",
    "data availability",
  ]
projects: ["plasma-fold"]
---

[Intmax](https://www.intmax.io/) has been pioneering L2 transaction-only constructions based on [client-side validation](https://eprint.iacr.org/2025/068.pdf) (CSV), where transaction validation relies on cryptographic proofs rather than blockchain consensus rules. Data is intermittently posted on a dedicated blockchain, primarily for deposits, withdrawals, and account checkpoints.

The Intmax2 [paper](https://eprint.iacr.org/2023/1082) is an instantiation of CSV. It consists of two core primitives: a Plasma-like data availability (DA) mechanism and validity proofs. It demonstrated that such a combination can help L2s achieve quite high TPS numbers. In this piece, we will explore why that is the case and how Intmax operates under the hood.

## Plasma

Originally, plasma was considered a strong L2 architecture candidate, distinct from both optimistic and zk-rollups. Its two key differences lay in the role assigned to the block builder (or "aggregator") and the amount of data posted on-chain. Until recently, this data primarily consisted of block hashes produced by plasma aggregators, resulting in a minimal on-chain data footprint for plasma rollups.

To enable that DA model, plasma designers assumed that (1) users would stay online and participate in non-trivial challenge games when aggregators misbehave (e.g., using fraud proofs) and (2) mechanisms would be in place to prevent the aggregator from withholding block data (e.g., requiring signatures on blocks submitted by the aggregator).

Many plasma designs have been proposed in the past ([original plasma](https://www.plasma.io/plasma.pdf), [plasma cash](https://arxiv.org/abs/1911.12095), and various [ethresearch posts](https://ethresear.ch/tags/plasma), among others1^11). However, a key difference today is the cambrian explosion in sn(t)ark development—both in new constructions and improved frameworks—that has taken place in the meantime.

Given today's DA scarcity and relatively [low TPS numbers](https://l2beat.com/scaling/activity), there are strong incentives to revisit these designs while leveraging the best of both validity proofs and plasma DA. This research is particularly relevant for ecosystems with expensive blockspace and emerging L2s, such as Bitcoin.

![DA scarcity is starting to hit, we have been regularly reaching the blob target for a few months now. See https://dune.com/hildobby/blobs.](/articles/intmax-a-scalable-payment-l2-from-plasma-and-validity-proofs/fm-nMw5onjaqpw6QOLypf.webp)

## Preventing data withholding with BLS Signatures

The first attack plasma chains aim to address is data withholding by the aggregator. Since (roughly) only block roots are posted on-chain, plasma users must ensure that block data (i.e., transaction inclusion proofs) is properly delivered to the transaction senders included in the posted block.

To address this, Intmax aggregators send [block proposals](https://github.com/InternetMaximalism/intmax2-zkp/blob/8f511d8ee5f2f3286ecb1d6854f31b056872a57a/src/mock/block_builder.rs#L135) to users, who then [BLS-sign](https://github.com/InternetMaximalism/intmax2-zkp/blob/8f511d8ee5f2f3286ecb1d6854f31b056872a57a/src/mock/client.rs#L285) them—attesting to data availability—and send them back to the aggregator. When the block is posted on-chain, the block proposer submits an [aggregated BLS signature](https://github.com/InternetMaximalism/intmax2-zkp/blob/4f43690a9cd005686f1283746204845f13dcea8b/src/mock/block_builder.rs#L345), composed of all the signatures received from senders. This aggregated signature, along with all sender addresses, is then [verified](https://github.com/InternetMaximalism/intmax2-contract/blob/2e77bbbe77a5b86449b588691183b05d9887603b/contracts/rollup/Rollup.sol#L184) within the plasma rollup contract.

You could still observe that the data withholding problem could be flipped on its head: can't users delay block production by retaining their signatures when asked by the aggregator? To avoid this, if the aggregator does not receive the signature in some specified timeframe, the transaction will still be included in the block but the aggregator will [include a boolean flag](https://github.com/InternetMaximalism/intmax2-zkp/blob/4f43690a9cd005686f1283746204845f13dcea8b/src/mock/block_builder.rs#L327) indicating that the signature was not sent back.

## Preventing malicious aggregators with validity proofs

The second attack plasma chains want to solve is the aggregator including malicious transactions - i.e. spending coins which do not exist. To prevent this, Intmax leverages [proof-carrying data](https://dspace.mit.edu/bitstream/handle/1721.1/61151/698133641-MIT.pdf) (PCD) to compose together proofs which end up attesting to the validity of coins being spent. In Intmax, users prove their balance by aggregating proofs, each attesting to the validity of either its own balance (such as in the case of deposits, withdrawals or coin sends) or of others (such as in the case of coin receipts). The aggregated proof is called the "balance proof": πbalance. It attests to the user's balance on the plasma chain and results from composing proofs originating from various sources.

There are 4 important different action types which will contribute to changing the user's balance proof. Each action type update the user's πbalance balance proof:

1.  send: updates the balance if the user knows a valid witness attesting to a send operation.
2.  receive: updates the balance if the user knows a valid witness attesting to the user receiving a coin transfer.
3.  deposit: updates the balance if the user knows a valid witness attesting to the user performing a deposit.
4.  update: a "utility" which updates the balance from one block Bt−i to another Bt−j if the user knows a valid witness attesting to the correctness of the balance at block Bt−j.

An instantiation of this logic is Intmax's `BalanceProcessor` struct, implementing four methods, all corresponding to each of the different types described above: `prove_send`, `prove_update`, `prove_receive_transfer` and `prove_receive_deposit`. This struct's method will be invoked each time an intmax user will perform the corresponding state changing actions on the plasma chain.

## How scalable is this design?

Intmax's has one of the lowest onchain data footprint among all L2s. This directly stems from its plasma design and the clever trick they found for identifying plasma users on the L1. Briefly, senders ids are stored with approx. 4.15 bytes of data on the L1: this means that with 12s block time and 0.375mb of da, Intmax has some of the highest _theoretical_ TPS, hovering around 7k transactions/second - and _doable today_!

## Main algorithms

Intmax uses [plonky2](https://github.com/0xPolygonZero/plonky2) to entangle proofs together to yield one single balance proof. This means that Intmax's code is a bit involved. We lay out here in a somewhat detailed, yet informal fashion the main algorithms used by intmax's plasma according to the [code](https://github.com/InternetMaximalism/intmax2-zkp/tree/cli)2^22, instead of the paper. The implementation contains interesting details, which probably in the name of succinctness, were not included in the paper.

One pattern of Intmax's PCD flow is for users to (1) update their balance proof to show the state of the account right before a plasma action happened, (2) generate a transition proof attesting to the validity of the transition of the account private state when the plasma action is applied and (3) generate a new public balance proof attesting to the balance of the user once the action has been processed. We now review how the balance proof is updated according to each action triggered by an Intmax plasma user.

### Deposit

A deposit consists in a user sending funds to the Intmax rollup contract, an aggregator building a block acknowledging the deposit and the depositor updating his balance proof using deposit witness data.

1.  User deposits [onchain](https://github.com/InternetMaximalism/intmax2-zkp/blob/8f511d8ee5f2f3286ecb1d6854f31b056872a57a/src/mock/client.rs#L119) (a mocked contract here), updating the onchain [deposit tree](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/contract.rs#L88) and [generates a proof](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/balance_logic.rs#L34) attesting to the existence of the block BtB_tBt​ where the deposit occurred onchain and of his account inclusion within the account tree.
2.  User [updates his balance proof](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/balance_logic.rs#L50) πt−ibalance→πt−1balance, right before the deposit block BtB\_{t}Bt​. To this end, he uses an update witness wt−1update _attesting to block_ Bt−1B\_{t-1}Bt−1​ correctness and to the existence of the user's account at that block.
3.  User retrieves a deposit witness wtdeposit _attesting to the onchain deposit validity - i.e. the deposit is present at block_ BtB{t}Bt, which has been built correctly.
4.  User generates a balance transition proof πt−1,ttransition _using the deposit witness_ wtdeposit attesting to the validity of the account's state transition.
5.  Uses the πt−1,ttransition* proof to generate the [final, public, balance proof](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/balance_logic.rs#L91) *πtbalance

### Transfer

A transfer involves a sender and an aggregator communicating over a block proposal. Once the block proposal has been signed by the sender and posted onchain by the aggregator, the sender is able to update his balance proof and convince the receiver of the transaction's validity.

1.  Sender makes a transaction request to the aggregator. a. Generates a [transfer tree](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/client.rs#L183) TttransferT^{transfer}\_{t}Tttransfer​*b. Generates a [spent witness](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/client.rs#L189) *wtspentw^{spent}\_{t}wtspent​, used later on to prove a valid send operation. c. Generates a [spent proof](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/client.rs#L197) πtspent attesting to the user's transaction validity. d. [Sends a transaction request](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/client.rs#L203) (containing the nonce and the transfer tree root) to the aggregator.
2.  Aggregator builds block and sends transaction inclusion merkle proof πtinclusion to senders.
3.  Sender finalizes the transaction: a. Checks the transaction merkle inclusion proof πtinclusion* b. [BLS signs](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/client.rs#L285) the transaction merkle inclusion proof *πtinclusion c. Sends transaction data (πtspent,πtinclusion) to the transaction receiver
4.  Builder posts BproposalB^{proposal}Bproposal onchain along with [aggregated signatures](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/client.rs#L286) from senders

### Receive

Receiving a transfer means both receiver and sender update their balance proofs. On the sender side:

1.  Updates his balance proof πt−ibalance→πt−1balance, up to right before the transfer block BtB_tBt​.
2.  Using the transaction TxtTx\_{t}Txt​ and the spent proof πtspent*, [generates a transition proof](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/circuits/balance/transition/transition_processor.rs#L87) *πt−1,ttransition attesting to a valid send operation and uses it to update his balance proof πt−ibalance→πtbalance
3.  Updates his private state accordingly: updates his asset tree (removing the corresponding sent transfer amounts), increments his nonce.

On the receiver side:

1.  [Updates his balance proof](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/balance_logic.rs#L127) πt−ibalance→πt−1balance, up to right before the transfer block BtB_tBt​.
2.  Generates a balance transition proof πt−1,ttransition*, which [attests to the receipt of a valid transfer](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/circuits/balance/transition/transition_processor.rs#L215) πt−1,ttransferπt−1,ttransfer. It uses the transfer witness wttransfer*, which contains transaction data (πtspent,πtinclusion*) and the sender's balance proof* πbalancet.
3.  Generates the [new balance proof](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/circuits/balance/transition/transition_processor.rs#L235) πtbalance _using the balance transition proof_ πt−1,ttransition.

### Withdraw

Withdraws are akin to regular transfers, but occur between an Intmax account and an L1 address. This means that users initiate a transfer by simply sending their funds to the L1 address that they would like to withdraw to. Since it is easy [to detect an L1 pubkey](https://github.com/InternetMaximalism/intmax2-zkp/blob/8f511d8ee5f2f3286ecb1d6854f31b056872a57a/src/common/generic_address.rs#L58), intmax clients can easily [detect and sync](https://github.com/InternetMaximalism/intmax2-zkp/blob/8f511d8ee5f2f3286ecb1d6854f31b056872a57a/src/mock/client.rs#L278) to new withdrawal requests. This also means that all the steps used in the transfer process are effectively the same in the case of a withdraw. The major difference is when retrieving funds from the L1 contract:

1.  The client syncs with withdrawals requests that have been done so far and picks the one relevant to the user from an [encrypted vault](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/client.rs#L401) storing withdrawals proofs.
2.  If needed, the user updates his balance proof πtbalance _by applying the withdrawal transfer_ TtwithdrawT^{withdraw}\_{t}Ttwithdraw​ which occurred at block BtB_tBt​.
3.  The user generates a [withdrawal proof](https://github.com/InternetMaximalism/intmax2-zkp/blob/233a26eb1d8b2580f66136a95319ad99eb1f62f2/src/mock/client.rs#L630) πtwithdraw using a withdrawal witness wtwithdraw*t \_attesting to a transfer occurring from an intmax to an L1 address and included within block* BtB_tBt​*. The withdrawal proof* πtwithdraw is sent to a withdrawal aggregator.
4.  A withdrawal aggregator chains together withdrawal proofs πtwithdraw,0,...,πtwithdraw,k and verifies them on the L1, triggering effective funds withdrawals on the rollup contract.

## Common questions

1.  Can't the transaction sender retain data from the recipient?

There is no sender data withholding problem: the sender of a coin wants the receiver to acknowledge he received and validated the spent - think in terms of buying a coffee, how would he be able to buy it otherwise? So this isn't a problem in our case, the sender of a coin hasn't really any incentive to retain his spent proof from the recipient.

1.  Can't I just double spend my coins to two people at the same time?

No. Validity proofs prevent a sender from doing so since he will need to provide a balance proof to each of the recipients, thereby attesting to the fact that their transaction has been processed correctly and with a sufficient balance.

1.  Does it mean users have to keep their data on their device?

Yes, one drawback of such designs is to assume users will safeguard their data on their local devices. To alleviate some of the risks attached to this (keys aren't the only thing you should keep safely in this model), the initial intmax implementation features a server vault in charge of storing (not yet) encrypted users data.

## Footnotes

1.  [Plasma World Map](https://ethresear.ch/t/plasma-world-map-the-hitchhiker-s-guide-to-the-plasma/4333), [Minimal Viable Plasma](https://ethresear.ch/t/minimal-viable-plasma/426), [Roll_up](https://ethresear.ch/t/roll-up-roll-back-snark-side-chain-17000-tps/3675), [Plasma Cash with much less per user data checking](https://ethresear.ch/t/plasma-cash-plasma-with-much-less-per-user-data-checking/1298/116?u=pierre)
2.  We will be working on the `cli` branch

## Verification

|                         |                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| **ARWEAVE TRANSACTION** | [dg39kqSRB8RgH9H…h3vmfJBRpMpleUo](https://viewblock.io/arweave/tx/dg39kqSRB8RgH9HqJ4enlzm9WsXUh3vmfJBRpMpleUo) |
| **AUTHOR ADDRESS**      | [0xe8D02b67Bd04A49…67a2c8f3fb02e9c](https://etherscan.io/address/0xe8D02b67Bd04A490ef4f1126b67a2c8f3fb02e9c)   |
| **CONTENT DIGEST**      | \_\_VLZrfjSScx42E…v8ujCWY_DuN1k4o                                                                              |
