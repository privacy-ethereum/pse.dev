---
authors: ["PSE Team"]
title: "BLS Wallet: Bundling up data - Privacy Stewards of Ethereum"
image: null
tldr: "BLS Wallet is an end-to-end system allowing wallets, dapps, and L2 nodes to easily plug the moon math magic of BLS signatures directly into their code."
date: "2022-08-26"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/e8Xy1X1phqdqGwkzaLMlyT9BY-8MpLoelYTsJc_DzfU"
tags:
  [
    "bls",
    "wallet",
    "scaling",
    "rollups",
    "ethereum",
    "l2",
    "account abstraction",
    "cryptography",
    "infrastructure/protocol",
    "security",
  ]
projects: ["bls-wallet"]
---

![](https://miro.medium.com/max/1400/0*9HpuJbMoePFp4117.png)

Originally published on Aug 5, 2022:

[Rollups](https://ethereum.org/en/developers/docs/scaling/#rollups) are providing faster and cheaper ways to use Ethereum, but they still face a key constraint: the need to store and pay for data on layer 1. BLS Wallet uses [BLS signatures](https://en.wikipedia.org/wiki/BLS_digital_signature) for transactions, so multiple signatures can be combined into one while still being able to verify all signed transactions. By requiring one signature where many were needed before, less data needs to be stored on-chain and layer 2 (L2) solutions become even cheaper.

[BLS Wallet](https://blswallet.org/) is an end-to-end system allowing wallets, dapps, and L2 nodes to easily plug the moon math magic of BLS signatures directly into their code.

## BLS Signatures: Just addition

BLS signatures are a cryptographic primitive most notably used [in the Beacon Chain](https://eth2book.info/altair/part2/building_blocks/signatures) to verify large numbers of signatures. According to Vitalik Buterin, BLS signatures are actually “very simple (aside from the extreme complexity in elliptic curve pairings themselves).” Luckily, the inventors of this signature scheme (Dan Boneh, Ben Lynn and Hovav Shacham) have done that extremely complex math for us.

![](https://miro.medium.com/max/960/0*9Zu5oRJ8z66iJ2sN)

Elliptic curve, from Vitalik Buterin and Justin Drake’s [presentation on BLS aggregation](https://www.youtube.com/watch?v=DpV0Hh9YajU)

In optimistic rollups such as [Arbitrum](https://bridge.arbitrum.io/) and [Optimism](https://www.optimism.io/), each transaction must be accompanied by its own signature. These signatures end up being stored on layer 1 (L1) as calldata, a read-only format that’s committed as part of a transaction rather than to (much more expensive) contract storage. Storing transactions and signatures as [calldata](https://ethereum.org/en/developers/tutorials/short-abi/#main-content) is the cheapest method available for rollups to keep data on L1, but calldata costs still add up.

The key property of BLS signatures is that multiple signatures can be combined into one; so instead of needing to verify each individual signature, only one aggregate signature needs to be verified and stored on-chain.

For the Ethereum developer and user, less on-chain data means less gas fees.

![](https://miro.medium.com/max/1400/0*4iNGzvvqE4j8YRjs.png)

Ethereum’s scalability and usability problems are being chipped away from all angles. Protocol-level changes such as [sharding](https://ethereum.org/en/upgrades/sharding/#main-content) and [EIP-4488](https://eips.ethereum.org/EIPS/eip-4488) are intended to increase data availability and reduce the cost of storing data on Ethereum. Layer 2 solutions like optimistic and zk rollups are already here, with more on the way. BLS aggregation is a powerful technique that can be used right now in combination with other efforts.

By improving costs using readily available and proven cryptographic primitives, more adoption and more use cases become possible sooner rather than later.

## Storage is expensive

L1 data storage is expensive and remains the main bottleneck for rollups. For the rollup to have L1 security guarantees, the rollup’s compressed state must be stored on L1, and L1 storage is the most significant cost factor.

All rollups bundle multiple transactions on L2 and write the results of the transactions to L1. BLS Wallet is a means to further reduce rollup costs by enabling on-chain verification of multiple transactions via a single aggregated signature. Data and transaction signatures are aggregated from a variety of different users, wallets, and dapps that have integrated BLS Wallet, resulting in a cascade of bundled transactions.

The bundling of transactions using a system like BLS Wallet has a compounding effect on reducing gas costs. The more transactions get included in a bundle, the cheaper each transaction is. In other words, more people using BLS Wallet at the same time means greater savings for each user or application. This allows [optimistic rollups](https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/) to remain competitive in cost with [ZK rollups](https://ethereum.org/en/developers/docs/scaling/zk-rollups/) while still enjoying the EVM-equivalency we’ve all come to know and love.

**What’s in a bundle?**

BLS Wallet bundles can contain both simple transactions (“send money from account A to account B”) and more complex interactions. A single, basic L2 transaction is called an _action_. An _operation_ is an array of actions to be performed atomically, which means all actions in an operation are successfully executed or none are. Operations guarantee complex, multi-step actions can be executed without unwanted interference. Using a single operation instead of multiple separate actions means users and dapps never have to worry about partial completion of an intended function or lingering token approvals.

An operation must contain the nonce of the smart contract wallet, a BLS signature, and the action(s) to be executed including the address of the smart contract to be called and the function to call.

```js
const bundle = wallet.sign({
  nonce: await wallet.Nonce(),
  // All actions in this operation are atomic
  actions: [
    {
      ethValue: 0,
      contractAddress: erc20Contract.address,
      encodedFunction: erc20Contract.address.interface.encodeFunctionData(
        "approve",
        [dexContract.address, amount]
      ),
    },
    {
      ethValue: 0,
      contractAddress: dexContract.address,
      encodedFunction: dexContract.address.interface.encodeFunctionData(
        "swap",
        [erc20Contract.address, amount, otherERC20Contract.address]
      ),
    },
  ],
})
```

Example of a single operation bundle

## A better wallet

Today, nearly all transactions on Ethereum begin with an [Externally Owned Account (EOA)](https://ethereum.org/en/developers/docs/accounts/), otherwise known as a standard Ethereum address, which has limited functionality. Smart contract wallets allow more flexibility for a better user experience.

The main barrier to widespread smart contract wallet usage has been, to the surprise of probably no one reading this, high gas fees! Smart contract wallets are expensive to deploy and use on L1 Ethereum. However, they become practical on L2 where gas fees are lower and it is much cheaper to execute complex transactions.

BLS Wallet provides the infrastructure for a smart contract wallet for EVM-compatible L2s. Besides the cheaper fees from compressed data and BLS signature aggregation, you also get other features enabled by smart contract wallets:

- \*\*Gasless transactions: \*\*Developers can choose to cover the fees for users and abstract away gas costs in the process.
- \*\*Account abstraction: \*\*Authorization logic of an account is decoupled from that of the protocol.
- \*\*Account recovery: \*\*Recovery is implemented by nominating an address to recover from lost or compromised BLS keys.
- \*\*Upgradeability: \*\*At the user’s discretion, wallets can be upgraded, ensuring they are futureproof.
- \*\*Multi-action: \*\*Transactions can be grouped together, allowing dapp developers to think in terms of multi-step operations instead of single transactions.

With a smart contract wallet, the user experience can be designed to feel more familiar to a non-crypto user. Instead of needing to know about contract interactions and gas fees as a prerequisite to using a dapp, users can learn about Ethereum at their own pace.

## BLS Wallet in action

BLS Wallet can be thought of as a 3-part system consisting of the:

1.  Client Module
2.  Aggregator
3.  Verification Gateway

![](https://miro.medium.com/max/1400/0*_DBEgX1Bzow-aXF0)

**Client Module**

The Client Module, where the first bundling of actions occurs, acts as the gateway for most users or dapps to interact with the BLS Wallet system. The Client Module provides the interface for users to generate BLS keypairs and create new smart contract wallets as well as sign transactions and operations.

![](https://miro.medium.com/max/1400/0*ausFxS5nsTaIOxkk)

The BLS Client Module can be integrated into an existing wallet.

With the Client Module, users and dapps can:

1.  Create single or multiple actions
2.  Sign action bundles with BLS signatures
3.  Send signed actions to the Aggregator

**Aggregator**

[The Aggregator](https://github.com/web3well/bls-wallet/tree/main/aggregator) is currently a hosted off-chain server for EVM-compatible L2s. The Aggregator receives actions and operations from the Client Module and further bundles them with other actions received from other Client Modules. One bundle can contain actions and operations from a variety of Client Modules operating on behalf of multiple wallets or dapps.

The Aggregator creates a single bundle, aggregates all the signatures, and further compresses the data where possible. The new aggregated and signed bundle is sent to the Verification Gateway on the L2 node.

In production, the Aggregator will most likely need to be paid a fee to perform its services so each bundle will need to include a reward or incentive for the Aggregator.

**Verification Gateway**

The [Verification Gateway](https://github.com/web3well/bls-wallet/tree/main/contracts) is the on-chain EVM smart contract on L2. It verifies that the signatures match the correct public keys before sending the actions to the corresponding smart contract wallets for processing. Though the Verification Gateway submits one transaction on-chain, multiple contract calls can occur within that single transaction.

The Verification Gateway processes transactions by:

1\. Expanding the compressed data and aggregated signatures

2\. Checking all operations and public keys against the aggregated signature to verify they are correct and matching

3\. Sending validly signed actions to the corresponding smart contract wallets to be executed one at a time on behalf of the user and dapps

## Building with BLS Wallet

All of the BLS Wallet components are open source and available in the [BLS Wallet Repo](https://github.com/web3well/bls-wallet). If you’re interested in integrating BLS Wallet into a wallet or L2 project, [here](https://github.com/web3well/bls-wallet/blob/main/docs/use_bls_wallet_clients.md) is a good place to start.

You can also try out Quill, a prototype BLS Wallet browser plugin. Quill generates new BLS keypairs and smart contract wallets capable of bundling multiple transactions and sending them to the Aggregator. Watch the [Quill demo](https://www.youtube.com/watch?v=MOQ3sCLP56g) presented by Kautuk at L2 Amsterdam, or [try installing it yourself](https://github.com/web3well/bls-wallet/tree/main/extension).

Let us know it goes! We welcome contributions, comments and questions on [Github](https://github.com/web3well/bls-wallet/blob/main/CONTRIBUTING.md) or [Discord](https://discord.gg/Wz3NvbB8Br).

## Web3well

[Web3well](https://github.com/web3well/) aims to be a neutral place for competing ecosystem teams to gather and explore how advanced features like BLS signatures can be used to achieve faster adoption and new use cases through improved usability. BLS Wallet is the primer for what we hope will be more collaborative conversations around wallets, designs and ideas.

Web3well and BLS Wallet are possible thanks to the work of contributors including [James Zaki](https://github.com/jzaki) (project lead), [Jake Caban-Tomski](https://github.com/jacque006), [Kautuk Kundan](https://github.com/kautukkundan) and [Andrew Morris](https://github.com/voltrevo).
