---
authors: ["PSE Team"]
title: "Zkopru Trusted Setup Ceremony"
image: null
tldr: "Use this link to participate in the trusted setup (on a desktop, mobile isn't recommended): [https://mpc.zkopru.network/](https://mpc.zkopru.network/)"
date: "2022-08-26"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/a2Ut19fwRGNJoCd-IoQadyn3sUMRgGNSfRgHEc4iGhw"
tags:
  [
    "zkopru",
    "trusted setup",
    "ceremony",
    "zero-knowledge proofs",
    "privacy",
    "scaling",
    "optimistic rollup",
    "ethereum",
    "security",
    "cryptography",
  ]
projects: ["zkopru"]
---

_Originally posted on Mar 26, 2021:_

We are excited to announce that the trusted setup ceremony for Zkopru has been launched.

## What is Zkopru?

![](https://miro.medium.com/max/1400/1*CR-P2g6fjWIFtgmqtUdUvA.png)

Zkopru, pronounced \[zikopru\], is short for zk-optimistic-rollup. It's a novel layer-2 scaling solution that allows for cheap private transactions. It uses optimistic rollup to scale and zk-SNARKs for privacy. Zkopru supports private transfers and private atomic swaps between ETH, ERC20, ERC721 at low cost. It also provides instant withdrawals via the pay-in-advance feature and compliance compatibility using spending key and viewing keys. See Wanseob [presenting](https://www.youtube.com/watch?v=443EZ0ndaio) the project on zkSummit and check out the Zkopru [website](https://zkopru.network/). You can also dive deeper in the original [ethresear.ch](https://ethresear.ch/t/zkopru-zk-optimistic-rollup-for-private-transactions/7717) post.

We have just completed an audit with Least Authority and the next step is to conduct a trusted setup.

## Why a trusted setup?

Zkopru relies on a number of different SNARKs and each requires a trusted setup which ensures that no one is able to fake proofs and steal user funds or compromise privacy. The setup is performed in such a way that, to fake a proof, an attacker must compromise every single participant of the ceremony. Therefore, the security goes up with the number of participants.

## How exactly does the setup work?

Our trusted setup is done in 2 steps. The first step is already completed and is called Perpetual Powers of Tau. It's an ongoing effort led by Wei Jie of the Ethereum Foundation. We are using the output of Iden3's [selection process](https://blog.hermez.io/hermez-zero-knowledge-proofs/) based on the [54th](https://github.com/weijiekoh/perpetualpowersoftau) Perpetual Powers of Tau contribution.

The second step is called Phase 2 and is circuit-specific, so it should be done separately for each different SNARK. This is what you participate in here.

## How to participate?

It is very simple!

1.  Open the link to our ceremony website: [https://mpc.zkopru.network/](https://mpc.zkopru.network/).
2.  Log in with your Github account. You can only participate once with your Github account.

![](https://miro.medium.com/max/736/1*4lc66pyFeyeFxR56FWlaZQ.png)

Click Login

3\. Click on "Launch Ceremony".

![](https://miro.medium.com/max/942/1*gYzc5NI17iFZ1FK3wLIqSQ.png)

Click Launch Ceremony

4\. You will contribute to 16 circuits some of them take (much) longer than others. Particiants are queued and if someone is in front of you, you will be put in a line, just wait.

![](https://miro.medium.com/max/1352/1*_XiuefrTja0DCjTrz9PhPA.png)

5\. While the ceremony is running please don't close or refresh the site (you can switch browser tabs) otherwise your contribution will be aborted. The process should take 30–50 mins. Once the ceremony is completed you can tweet about your participation to spread the word and make Zkopru more secure.

![](https://miro.medium.com/max/1216/1*BDUciwbSPkjDo-LqdLEzNw.png)

Wait until you see this

## Troubleshooting

If the twitter button doesnt show up in your browser you can try this: Refresh > Menu >Logout, then Login, and launch again. It won't run any circuits, but it might pick up your hashes and allow you to tweet.

Your browser might go blank, you can just refresh and restart, it will pick up where you left.

You dont see your contribution hash for any or all circuits? In that case something went wrong and your contribution was discarded. We will give any participant with failed contributions a second chance.

Encountering any issues? Let us know in the Zkopru telegram group.

## How to verify?

After your participation you will be presented with a contribution hash. We will make the files available to download and you will be able to verify your contribution (see more info [here](https://github.com/glamperd/setup-mpc-ui#verifying-the-ceremony-files)). You can also contribute via CLI if you want more control, ask about it in our [telegram](https://t.me/zkopru) group.

## Whats the time line?

The ceremony will run for at least 2 weeks from now on. Once we have enough contributions we will announce a public random beacon for the last contribution.

## Want to learn more?

Source code for the ceremony is available [here](https://github.com/glamperd/setup-mpc-ui#verifying-the-ceremony-files). Contribution computation is performed in the browser. The computation code is compiled to WASM, based on the repo above, a fork of Kobi Gurkan's phase 2 computation module which has been [audited](https://research.nccgroup.com/2020/06/24/security-considerations-of-zk-snark-parameter-multi-party-computation/).We made these unaudited changes:

\- For the WASM build, return the result hash to the caller.- Also for the WASM build: Progress is reported by invoking a callback.- Corrected errors in progress report count totals.

## More Questions?

[Join](https://t.me/zkopru) our telegram group.
