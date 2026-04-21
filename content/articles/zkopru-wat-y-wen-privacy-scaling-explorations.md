---
authors: ["PSE Team"]
title: "Zkopru: Wat, Y & Wen - Privacy Stewards of Ethereum"
image: null
tldr: "Zkopru is almost ready, we explain what it is and why it's awesome. We also announce a date for the testnet."
date: "2022-08-26"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/kfuuBPtGtDjl_J2wBq-jrtyURGLmQpUhZfDTuZChEy8"
tags:
  [
    "zkopru",
    "optimistic rollup",
    "zero-knowledge proofs",
    "privacy",
    "scaling",
    "ethereum",
    "l2",
    "transaction privacy",
    "utxo",
    "infrastructure/protocol",
  ]
projects: ["zkopru"]
---

Originally published on Aug 10, 2021:

## Intro

The Privacy Stewards of Ethereums Team works to bridge the gap between cutting-edge research in Zero-Knowledge Proofs (ZKP), and application development on Ethereum.

One of our recent focus areas has been [zkopru](https://zkopru.network/) (zero knowledge optimistic rollup), a new protocol for gas-efficient private transactions. We completed a [trusted setup](https://medium.com/privacy-scaling-explorations/zkopru-trusted-setup-completed-92e614ba44ef) in April and since then have been heads down working on bringing it to completion. We are in the final stages of completing the web wallet and stress testing the system. A second audit is also on its way. With this post we want to give a high level overview of Zkopru's features and what will be happening in the upcoming weeks as Zkopru moves to public testnet and mainnet.

This post assumes that you are generally familiar with Ethereum, layer 2, and the basics of zero knowledge proofs.

![](https://miro.medium.com/max/946/1*R0tVYYlbZEBkWBWeoSb3JQ.png)

Zkopru stands for zk (zero knowledge) opru (optimistic rollup). You might have heard about zero knowledge proofs, zk rollups and optimistic rollups, so what is a zk-optimistic rollup? Let's start with the basics.

\*\*What is a Zero Knowledge Proof (zkp)?\*\*Zero knowledge proofs such as zkSNARK allow verifying the correctness of computations without having to execute them and without revealing their inputs. Zkps can therefore be used for scaling and privacy. Zkopru uses zkps to make transactions private. [Zcash](https://z.cash/), [AZTEK network](https://aztec.network/) and [tornado.cash](https://tornado.cash/) are other examples where zkps are used for privacy on blockchains.

\*\*What's an optimistic rollup?\*\*Optimistic rollups sit in parallel to the main Ethereum chain on layer 2. They can offer improvements in scalability because they don't do any computation on-chain by default. Instead, after a transaction, they propose only a stateroot to mainnet and transaction data is stored as calldata, which doesn't grow the state and therefore has reduced gas cost. As modifying the state is the slow, expensive part of using Ethereum, optimistic rollups can offer up to 10–100x improvements in scalability depending on the transaction. See [here](https://ethereum.org/en/developers/docs/scaling/layer-2-rollups/) for more information on optimistic rollups. Instead of miners, rollups have coordinators that receive transactions, calculate the new state and submit data to Ethereum.

\*\*What is Zk + opru\*\*Zkopru is an optimistic UTXO based rollup. There is also another type of rollup called zk-rollup, which uses zero-knowledge proofs to verify the correct computation of the next state when new transactions are applied — but Zkopru is _not_ a zk-rollup. Whereas zk-rollups use the "zk" part to create a validity proof for the rollup state transition, Zkopru uses it to make individual transfers private.

This concept has significant advantages in terms of gas consumption. For zk-transactions directly on the main Ethereum chain, it would be necessary to use a SNARK-friendly hash function to construct a Merkle tree, which is very expensive. Using an optimistic rollup, we can update the SNARK friendly Merkle tree at a low cost off chain. As a result, this protocol consumes about 8,800 gas per private transfer (a normal ETH transfer on Ethereum costs 21,000 Gas) 🎊.

## Y? Features of Zkopru

![](https://miro.medium.com/max/1062/1*X17IFo5Z-f-lR_xPSsdxww.png)

Next, let's look at the most important user facing functionalities of Zkopru. Users will interact with the system via a web wallet to carry out deposits, withdrawals, transfers and swaps on L2. We'll give an overview of the UX for each of these functions below; for more detailed technical information check out our [documentation](https://docs.zkopru.network/) and [github](https://github.com/wanseob/zkopru) .

**Deposit:** The user is able to deposit Ether, ERC-20 or NFTs to the Zkopru contracts on L1 (Ethereum) through the Zkopru user interface. After depositing the user will be able to view and transfer their assets on L2, represented behind the scenes as UTXOs. .

**Transfer:** After deposit the assets are still linked to the user's account but the private transfer feature can be used to break the link. For a transfer, the sender needs the Zkopru address of the recipient. This is not an Ethereum address, but a user can use their Ethereum private key to generate a corresponding address in the Zkopru wallet. The wallet generates a zkp that proves the integrity of the system after the transfer without revealing any details and sends the transaction to the Zkopru coordinator. After the coordinator has included the transaction (for a fee) the funds are considered private.

**Withdraw:** A user that wants to move their assets back from L2 (Zkopru) to L1 (Ethereum) can use the withdraw function of the wallet. Transaction details will need to be revealed for this action, so the address and amount withdrawn are not private anymore. Like other optimistic rollups, Zkopru requires the user to wait for 7 days for withdrawals to be finalized. Anyone who doesn't want to wait that long can use the instant withdrawal mechanism.

\*\*Instant withdraw:\*\*If a user wants to make an instant withdrawal, they can make a request to another user to advance the funds in exchange for a fee. The user who advances the funds keeps the fee but takes on any risk of the transaction being invalidated by a fraud proof.

\*\*Atomic Swap:\*\*Zkopru supports atomic swaps. Two users can ask the coordinator to facilitate the exchange of their two assets, and if the coordinator doesn't do so they will be slashed. This service will have its own site. At the moment it is difficult to find matching orders efficiently and privately. We're working on a solution that allows for private order matching.

\*\*Cost:\*\*Users can deposit and withdraw ETH, ERC20 and NFTs. It's also possible to combine deposits of NFTs and ERC20s with ETH in the same transaction. The USD values below are the costs incurred on Ethereum assuming a gas price of 25 gwei and an ETH price of USD $2,500.

![](https://miro.medium.com/max/1400/1*zEx3-wuS2th3H3Al5QjkUw.png)

For private transfers within the rollup, the coordinator will charge fees according to their cost incurred on L1 (Ethereum). Transactions become cheaper in bulk and depend on the number of UTXOs used:

![](https://miro.medium.com/max/1400/1*N8322pqIvlGrUbFh5GI9vA.png)

On top of the costs listed in the table above, the coordinator has to pay a finalization cost of 171,954 Gas, (currently around USD10,75) per batch.

## Wen can we use Zkopru?

![](https://miro.medium.com/max/1080/1*wkAXunWTJaW0FOldy4nV1w.png)

In about 2 weeks the Zkopru contracts will be deployed on testnet, the wallet UI will be released and we'll publish more documentation explaining how to interact with the system. If there are no major issues on testnet for another ~2 weeks we will announce the release of the mainnet contracts. A second audit is also expected to be concluded by that time.

## Conclusion

After years of hard work we are stoked that Zkopru will soon be in production providing cheap, private transactions on Ethereum. If you want to use Zkopru on testnet, stay tuned for our next blog post. You can learn more about Zkopru on [github](https://github.com/wanseob/zkopru), our [website](https://zkopru.network/) and [blog](https://medium.com/privacy-scaling-explorations).
