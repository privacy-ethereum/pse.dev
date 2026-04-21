---
authors: ["Anon Aadhaar team"]
title: "Announcing Anon Aadhaar"
image: "/articles/announcing-anon-aadhaar/announcing-anon-aadhaar-cover.webp"
tldr: "_This post was written by the Anon Aadhaar team._ /n/n _We're excited to announce the public release of Anon Aadhaar!_"
date: "2023-09-21"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/6R8kACTYp9mF3eIpLZMXs8JAQmTyb6Uy8KnZqzmDFZI"
tags:
  [
    "anonaadhaar",
    "privacy",
    "zero-knowledge proofs",
    "digital identity",
    "identity",
    "ethereum",
    "proof of personhood",
    "credentials",
  ]
projects: ["anon-aadhaar", "bandada", "discreetly"]
---

### What is Anon Aadhaar?

Anon Aadhaar is a protocol that lets users anonymously prove their Aadhaar (Indian) identity, in a very fast and simple way. The core of the protocol is the [circuits](https://github.com/privacy-scaling-explorations/anon-aadhaar/tree/main/packages/anon-aadhaar-pcd/circuits), but we also provide a SDK to let any app use the protocol.

[Try our demo](https://anon-aadhaar-example.vercel.app/) with your Aadhaar card or example files ([signed pdf](https://anon-aadhaar-documentation.vercel.app/assets/files/signed-66a64f9f9b3da47ff19b81f6510e26fe.pdf), [certificate file](https://anon-aadhaar-documentation.vercel.app/assets/files/certificate-8bda87cda7bd74771f70cc0df28fc400.cer)). Follow our tutorial by [building a voting app with Anon Aadhaar](https://anon-aadhaar-documentation.vercel.app/blog), fork our [example app](https://github.com/anon-aadhaar-private/anon-aadhaar-example) and build your own.

### Why Aadhaar cards?

The [Aadhaar program](https://en.wikipedia.org/wiki/Aadhaar) is among the largest digital identity schemes in the world. There are 1.2 billion people enrolled, accounting for around 90% of India's population.

Aadhaar cards carry both demographic and biometric data, including the holder's date of birth and its fingerprint. They are used in a variety of contexts such as loan agreements or housing applications. Bring this onchain in a privacy preserving way opens the possibility for many more applications on Ethereum.

Anon Aadhaar is one instantiation of the broader "Anonymous Credentials" with the goals of "[proof of citizenship](https://discord.com/channels/943612659163602974/1141757600568971304/1141759379578822707)", "proof of identity", "proof of passport", "proof of personhood", among others. Our approach leverages government identities, in this case Aadhaar Cards, to enhance digital interactions.

### Importance of Anonymity

A healthy society enables people to voice their concerns, opinions and ideas without fear or reprimands. Although there are many protocols that provide anonymity, anonymity without context lowers the value of the interactions. How can I be sure the opinions shared are not part of a bot network, campaign, or external influence for my country/DAO/company?

**Contextual anonymity is key to build trust** and enhance the value of noise to signal.

In the broader context, Anon Aadhaar supports [proof of personhood](https://vitalik.ca/general/2023/07/24/biometric.html) by adding a convenient privacy layer. We can talk about a "forth column" that leverages existing PKI and public government ID programs to enhance digital interactions.

![](/articles/announcing-anon-aadhaar/ZfpBm9HmDYDgP8rTYnA_9.webp)

_Table modified from [https://vitalik.ca/general/2023/07/24/biometric.html](https://vitalik.ca/general/2023/07/24/biometric.html)_

\*Low decentralization in regard to the Government being the single issuer of the IDs. But high decentralization in the verification and permissionless applications that can be built on top of them.

## Highlight Features

- SDK to directly integrate with your dapp
- PCD package to leverage this framework
- React package to quickly integrate your front-end
- Example app to try it and fork
- Proving time ~30s (avg on browser)

### What it contains

- **[anon-aadhaar-contracts:](https://github.com/privacy-scaling-explorations/anon-aadhaar/tree/main/packages/anon-aadhaar-contracts)** import it directly in your smart contract to check on-chain that a user has a valid anon Aadhaar identity proof.
- **[anon-aadhaar-pcd:](https://github.com/privacy-scaling-explorations/anon-aadhaar/tree/main/packages/anon-aadhaar-pcd)** [PCD](https://pcd.team/) is a clever framework for programmable cryptography to facilitate composability and interoperability. This package facilitates building dapps using PCDs.
- **[anon-aadhaar-react](https://github.com/privacy-scaling-explorations/anon-aadhaar/tree/main/packages/anon-aadhaar-react)** React component library to embed the [anon-aadhaar](https://github.com/privacy-scaling-explorations/anon-aadhaar) circuit in your project, and let you verify that a user has a regular Aadhaar ID, by generating ZKProofs, and authenticating them.

Check our [documentation](https://anon-aadhaar-documentation.vercel.app/docs/intro) and feel free to try our [Integration Tutorial](https://anon-aadhaar-documentation.vercel.app/docs/integration-tuto).

### Building with Anon Aadhaar

Anonymous protocols are very versatile, so get creating! If you want inspiration here are some ideas:

- **HeyIndia:** a copy of [HeyAnon](https://heyanon.xyz/) app, but need to prove you're from India in order to post.
- **Aadhaar Wallet:** similar to [Myna](https://ethglobal.com/showcase/myna-uxzdd), create an ERC-4337 compatible wallet that uses your Aadhaar card to approve transactions or social recover with other users.
- **Voting App for Quadratic Voting:** vote if you can prove your citizenship.
- **Telegram private groups:** where you need to prove you're an Indian citizen in order to join
- **[Bandada](https://pse.dev/projects/bandada) credential groups**: gatekept by Anon Aadhaar proofs and then integrated to anonymous chats using [Discreetly](https://pse.dev/projects/discreetly).
- **SSO Server:** anonymously login with your "proof of citizenship" in any website. Explore integrations with Sign in with Ethereum
- **Payment Channel:** use Anon Aadhaar SDK to create payment channel. Help people can verify another party with zkp. This is only for demo how people can use our SDK.
- **Loan Approval Platform:** create a platform for secure and anonymous loan approvals based on Aadhaar information.
- **Ethereum Wallet Recovery:** design a dApp that helps users recover their Ethereum wallets using their Aadhaar credentials.
- **Web3 API Access Control:** develop a dApp that enables developers to control access to their web3 APIs based on verified Aadhaar identities.
- **Privacy-Preserving Developer Communities:** decentralized developer communities where members can engage in discussions and collaborations while maintaining their anonymity.

### Additional Links

- [Anon Aadhaar - Install Solidity Verifier](https://anon-aadhaar-documentation.vercel.app/docs/install-solidity-verifier)
- [Ethresear.ch](http://ethresear.ch/) - [Leveraging an existing PKI for a trustless and privacy preserving identity verification scheme](https://ethresear.ch/t/leveraging-an-existing-pki-for-a-trustless-and-privacy-preserving-identity-verification-scheme/15154)
- [https://polygon.technology/blog/polygon-id-is-more-than-biometric-proof-of-personhood](https://polygon.technology/blog/polygon-id-is-more-than-biometric-proof-of-personhood?utm_source=twitter&utm_medium=social&utm_content=polygon-id-more-than-biometric)
- [https://whitepaper.worldcoin.org/proof-of-personhood](https://whitepaper.worldcoin.org/proof-of-personhood)
- [https://ethglobal.com/showcase/proof-of-baguette-ing99](https://ethglobal.com/showcase/proof-of-baguette-ing99)
- [https://ethglobal.com/showcase/myna-uxzdd](https://ethglobal.com/showcase/myna-uxzdd)

### Looking ahead

Our two key next features are 🏍️ **Supporting Nullifiers** & 🏍️ **iOS Support**. Future ideas include: faster proving times, supporting more countries, etc.

Check our [roadmap](https://www.notion.so/Anon-Aadhaar-H2-2023-Roadmap-30206f5cb8654fdd959f4aa1470ad2f0?pvs=21) and feel free to give feedback at [#proof-of-citizenship](https://discord.com/channels/943612659163602974/1141757600568971304)

Thanks to [@vuvoth](https://github.com/vuvoth), [@Meyanis95](https://github.com/Meyanis95) , [@andy](https://twitter.com/AndyGuzmanEth), [@jmall](https://twitter.com/Janmajaya_mall), [@xyz_pierre](https://twitter.com/xyz_pierre)**, @PSE design team**
