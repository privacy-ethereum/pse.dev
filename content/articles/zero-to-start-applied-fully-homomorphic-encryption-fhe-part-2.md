---
authors: ["0xZoey"]
title: "Zero to Start: Applied Fully Homomorphic Encryption (FHE) Part 2"
image: "/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2-cover-1.webp"
tldr: "This post was written by [0xZoey](https://twitter.com/0xZoey), with contributions from Chance. /n This is an extension of [Part 1: An Introduction to FHE, ZKPs & MPC, and The State of FHE Development](https://mirror.xyz/privacy-scaling-explorations.eth/D8UHFW1t48x2liWb5wuP6LDdCRbgUH_8vOFvA0tNDJA)."
date: "2023-12-21"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/wQZqa9acMdGS7LTXmKX-fR05VHfkgFf9Wrjso7XxDzs"
tags:
  [
    "fhe",
    "cryptography",
    "privacy",
    "lattice-based cryptography",
    "threshold cryptography",
    "mpc",
    "security",
    "ethereum",
    "private transactions",
    "education",
  ]
projects: ["mpc-framework", "pse-security", "post-quantum-cryptography"]
---

## **Fundamental Concepts**

### **Threshold FHE**

Threshold cryptography involves splitting a single cryptographic key into "shares" across multiple parties. You may already be familiar with Threshold Signatures Schemes (TSS), which are most commonly used in MPC wallets. The required threshold of parties to collaborate to gain access to the private key is usually predefined. This is different from a multi-sig scenario where multiple "whole" keys are used.

![Threshold Cryptography vs Multi-Sig](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2/wfpyPpbJRvjEtiiMA2BSK.webp)

Threshold Cryptography vs Multi-Sig

In [Threshold FHE](https://eprint.iacr.org/2017/257), the concept acts similarly to TSS, but key shares are extended to the decryption process, requiring multiple entities to cooperate to decrypt data. This reinforces security by distributing decryption authority.

In the [PESCA](https://eprint.iacr.org/2022/1119.pdf) blueprint and [Zama](https://github.com/zama-ai/fhevm/blob/main/fhevm-whitepaper.pdf)'s implementation, an example of threshold FHE is used to compute over encrypted blockchain states. The transparent and public nature of blockchain data means that to maintain privacy, we need to be able to decrypt states and allow smart contracts to be composable selectively. The private key shares are distributed to validators, and a certain threshold of private keys is required for decryption. No single validator or group smaller than the threshold is able to decrypt the blockchain state. [Note](https://discord.com/channels/901152454077452399/1126507772524113930/1156317837850329098) that the threshold only applies to privacy and the risk is on confidentiality, not on actual assets.

Dynamic Proactive Secret Sharing could theoretically be used to support a consensus set where validator nodes are joining and leaving. There are some caveats to a Threshold FHE setup that requires an honest majority, which we discuss further in the challenges section.

### **FHE & MPC**

With Threshold-FHE, trust is placed with a group of private key holders; in [FHE-MPC,](https://link.springer.com/article/10.1007/s10623-022-01160-x) trust assumptions are minimized to each individual party. A simple example between 2 parties:

- The first party encrypts their input to create a ciphertext
- The ciphertext is passed to the second party
- The second party performs a function using FHE on the ciphertext and their own input, producing a second ciphertext.
- The second ciphertext is returned to the first person who performs the decryption.

![FHE-MPC](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2/2Q7CXhkswBJb3Yp1Y77Er.webp)

FHE-MPC

MPC and FHE can be combined in several ways:

- Multi-Key FHE-based MPC: Multiple FHE key pairs are combined to perform MPC
- Multi-Party FHE-based MPC: Key generation is distributed, and Decryption is also distributed.

The [takeaway](https://eprint.iacr.org/2023/981.pdf) here is the combination of the two technologies allow the key properties of MPC to be combined with FHE. However, managing FHE ciphertext size with the communication complexity between parties in MPC is an important consideration.

### **Lattice-based cryptography**

Lattice-based cryptography provides the mathematical framework that underpins every FHE scheme. It is also used in the three post-quantum computing (PQC) standardization digital signature schemes [selected by NIST](https://csrc.nist.gov/news/2023/additional-pqc-digital-signature-candidates), CRYSTALS-Dilithium, FALCON, and SPHINCS+. The security of lattice-based cryptography comes from the inherent difficulty of solving lattice problems.

Think of [lattice-based cryptography](https://www.youtube.com/watch?v=K026C5YaB3A) as two vectors forming a pattern over a grid. As we add more vectors across multiple dimensions, this pattern becomes increasingly complex.

![Lattice-Based Cryptography](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2/1hOeDx2ijeoP2fjQyIWhR.webp)

Lattice-Based Cryptography

Finding the shortest vector to the point of origin of the very first vector becomes extremely difficult, almost impossible. This is known as the Shortest Vector Problem (SVP).

### **Learning With Errors (LWE) & Ring-LWE**

[Learning With Errors](https://www.youtube.com/watch?v=K026C5YaB3A) (LWE) is a hard math problem based on the approximate Shortest Vector Problem (SVP). Similar to lattice problems, its hardness makes it a good candidate for use in PQC cryptography. Ring-LWE is a progression of LWE based on the SVP over ideal lattices. It is significant for FHE because the second generation of FHE schemes utilise LWE and RLWE to reduce ciphertext size and reduce noise, thus increasing performance.

### **Managing Noise**

In FHE, noise refers to the distortion or error accumulating during homomorphic operations on encrypted data. Noise arises due to the mathematical properties of the homomorphic encryption and scale with the operations performed on encrypted values.

The [diagram](https://homomorphicencryption.org/wp-content/uploads/2018/10/CCS-HE-Tutorial-Slides.pdf?ref=blog.sunscreen.tech) below represents fresh encryption, where each component can be expressed as a coefficient in a polynomial or a vector. The height of the element represents the size of the coefficients. Note that in the first step, the initial noise is small.

![](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2/sB_dnGBjpaiXUWrKLkFnM.webp)

As the number of computations (operations) increases, we see a corresponding growth in noise. The growth in noise can be described as exponential, polynomial, linear, constant, or logarithmic.

![](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2/4hvv268J3cUZaeoYQCL20.webp)

When working with FHE, the primary goal is to manage the noise reservoir. When there is an excessive number of operations, we experience noise overflow, at which point decryption becomes impossible.

![](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2/SHHKJ9JkqJkIBw6yCBose.webp)

Noise management techniques in FHE aim to control or reduce the noise level to maintain the correctness of computations. The main types of noise management include

- **Bootstrapping**: this maintains the correctness of computations on encrypted data by reducing the impact of accumulated noise.
- **Modulous Switching**: lightweight noise management without secret-key use, rescaling ciphertexts. It is most effective when applied after each homomorphic multiplication.
- **Batching:** increasing efficiency by packing multiple plaintexts into the same ciphertext so FHE can be conducted on multiple inputs

### **Bootstrapping**

Bootstrapping is the key technique used to manage noise overflow. When bootstrapping, the initial private key is encrypted as the bootstrapping key, allowing you to use it in a decryption circuit. This is secure as long as one assumes circular security.

![Bootstrapping](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2/CHT9FELAjHHTvA0bXuXEq.webp)

Bootstrapping

The ciphertext is re-encrypted recursively, and the noise level is reset to the same level created by the bootstrapping operation itself. Think of each recursive encryption as layers of wrapping over the original ciphertext, giving you a ciphertext of a ciphertext.

Using our layers example, each "inner layer" is homomorphically decrypted. As long as your noise reservoir allows room to do one more homomorphic operation (addition or multiplication), you can achieve FHE by running bootstrapping.

### **Relinerization**

Relinerization is a technique to transform quadratic equations into linear ones, effectively shortening ciphertext size. It is the key to fine-tuning FHE performance independent of bootstrapping and is particularly useful for homomorphic multiplication, where the cost of computation linearly increases with input size. Despite being computationally heavy, it can reduce computation costs and storage burdens.

## **FHE Schemes**

The development of FHE [schemes](https://queue.acm.org/detail.cfm?id=3561800) in the last decade has been rapid, with TFHE and BGV being the most popular blockchain applications. We focus on three main schemes in this article, but [many](https://github.com/jonaschn/awesome-he) others exist. Like any programming language, each comes with its unique properties suited for various use cases.

![Generations of FHE Schemes](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2/BVTrv4k2df5KQNhuQ1yG-.webp)

Generations of FHE Schemes

### **BGV & BFV**

[Second-generation](https://queue.acm.org/detail.cfm?id=3561800) FHE schemes [BGV](https://eprint.iacr.org/2011/277.pdf) (2011) drastically improved performance and allowed for weaker security assumptions. With BGV, the concept of [Learning With Errors](https://www.youtube.com/watch?v=K026C5YaB3A&t=28s) (LWE) was introduced, reducing the 30 minutes per bit operation performance time down to seconds. [BFV](https://eprint.iacr.org/2012/144.pdf) (2012) was published very shortly after BGV, where instead of using linear equations with LWE, polynomial rings over finite fields, Ring-LWE, is used.

BGV and BFV's computations use modular arithmetic circuits and work well with applications that require large vectors of small integers. These schemes are particularly useful for private information retrieval and database query applications.

### **TFHE**

Fully Homomorphic Encryption over the Torus (TFHE)(2016) is an improved version of [FHEW](https://link.springer.com/chapter/10.1007/978-3-662-46800-5_24) (2014). It was the first scheme to [realize programmable bootstrapping](https://www.tfhe.com/evolution-of-homomorphic-encryption-schemes) using a lookup table over a ciphertext with a managed level of noise. It drastically [improved](https://link.springer.com/epdf/10.1007/978-3-662-53887-6_1?sharing_token=YsC3Hu6iPFp104kZQ6tZgPe4RwlQNchNByi7wbcMAY5bBAyAdgprN5xaaLEWgAqi3OyJt9tYY67Qr-JCwidvui2AFZZY23Iilns5cEmIIZMMdU8UUbfVmV_DCtPpkTVuaYBGgF2rZ79A9GuOu_QQi5L1eWufxVcTMf8_0-DEecE%3D) comparison and bootstrapping speeds, reducing times from seconds to milliseconds. TFHE's original implementation only allowed for Boolean circuits, but newer implementations like TFHErs are capable of bootstrapping over integers. It is most suitable for general-purpose computation.

### **CKKS**

CKKS (2016) is most appropriate for applications working with real numbers, such as practical machine learning problems, regression training, neural network inference, and statistical computations. CKKS [deals with](https://dualitytech.com/blog/bootstrapping-in-fully-homomorphic-encryption-fhe/) approximate arithmetic and so is not compatible with web3 applications where precise financial data is required. However, we list it here as a particularly efficient scheme and has proven to be a significant advancement in the last few years.

## **Scheme Comparisons**

Here is a high-level [comparison](https://www.youtube.com/watch?v=VJZSGM4DdZ0) of the three most relevant FHE schemes:

![FHE Scheme Comparisons](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2/fD4DfgunYv-8mOXw4eWnV.webp)

FHE Scheme Comparisons

## **Step-by-Step Development**

Now that we have foundational concepts down, we dive into some practical considerations for building with FHE. Development can be broken down into the following [steps](https://homomorphicencryption.org/wp-content/uploads/2018/10/CCS-HE-Tutorial-Slides.pdf?ref=blog.sunscreen.tech):

- Pick a FHE scheme appropriate for your use case

  - BFV or TFHE most appropriate for web3 development at the moment

- Determine how data should be encoded

  - Will batching be used?
  - Will you use one ciphertext per integer, vector, or matrix?
  - Aim to reduce ciphertext/plaintext size ratio

- Pick scheme parameters

  - Some compilers do this automatically
  - [Considerations:](https://www.youtube.com/watch?v=VJZSGM4DdZ0)

    - What kinds of computation are you looking to do?
    - What, if any, limitations do you have on ciphertext and key sizes?
    - What level of performance are you looking to attain?
    - Is relinerization required?

- Prove information about your encrypted data (may include ZKP element)

  - Prove that the inputs are valid ie. the transaction amount
  - Prove that the data satisfies the condition i.e. check that the transacted amount is smaller than the balance in the account

So far, we have discussed FHE theoretically as a general concept in cryptography. Applied implementations of FHE can be categorized as relevant to the web3 stack as follows:

- FHE Applications: Implementations of FHE that are compatible with existing blockchains and smart contracts
- FHE Infrastructure: Implementations of FHE that relate to data availability, scaling, block building, or consensus mechanisms

We outline a few examples of FHE Applications here; despite their diversity, they share common elements. In each scenario, we:

1.  **Encrypt data**: presented as an encrypted integer (i.e., euint8), which serves as a wrapper over FHE ciphertext.
2.  **Perform an Operation**: computation is run on the encrypted data using FHE (i.e, add, sum, diff)
3.  **Apply the Condition**: the result of the operation is used to take some action. This is achieved by using an "If…else…" multiplexer operator (i.e., [cmux](https://docs.zama.ai/fhevm/writing-contracts/functions#multiplexer-operator-cmux), where three inputs return one output). Think of this like a railroad switch where two tracks converge to a single destination.

### **Confidential ERC20 Tokens**

In this implementation of a [confidential ERC20](https://www.zama.ai/post/confidential-erc-20-tokens-using-homomorphic-encryption) token contract by Zama, FHE is used to check that the wallet viewing the balance also owns the balance, effectively keeping the balance hidden from everyone else.

1.  During a token transfer, the amount sent is encrypted.
2.  The sender user balance is checked to make sure that it is greater than the transfer amount to prevent overspending using FHE.
3.  The transfer is then executed on-chain, deducting the sender's balance and adding it to the recipient's balance.

Additional measures are also taken with token minting to prevent information about balances from leaking. In a [different implementation](https://docs.fhenix.io/examples/reference-dapps/wrapped-erc20) by Fhenix, a wrapped ERC20 keeps balances and amounts confidential, but the sender and receiver remain public. Note that these implementations are used as an extension of the existing ERC20 standard and not a replacement.

### **Order matching**

In a privacy-preserving [dark pool](https://www.ifaamas.org/Proceedings/aamas2020/pdfs/p1747.pdf):

1.  Traders can send their buy and sell orders encrypted to an exchange.
2.  The exchange uses FHE to find a match in the order book without knowing the order type, amount, or price.
3.  Once a match is found, the order is executed on the public market.

![Dark Pools: Order Matching using FHE](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2/GOkAOvsRMVxarQtvfdlag.webp)

Dark Pools: Order Matching using FHE

In this use case, traders can place orders without "alerting" the open market of their intentions, potentially giving away high-value alpha. Exchange operators remain neutral and establish trust, as their role here is purely used in order matching and execution. Regulatory authorities can ensure compliance with an additional layer, mitigating conflicts of interest between traders and operators. For an [on-chain darkpool](https://github.com/omurovec/fhe-darkpools/blob/master/src/DarkPool.sol), trades can be encrypted to prevent MEV. Zama has an FHE implementation of a [dark market](https://www.zama.ai/post/dark-market-tfhe-rs), and Sunscreen provides an AMM example [here](https://docs.sunscreen.tech/fhe/fhe_programs/example.html). Note that most of these are partial implementations, and privacy leaks exist.

### **Private Voting**

Tokens or NFT owners can anonymously vote on proposals for DAO governance. Details such as token circulation amount, voting decisions, and delegation selection can be kept confidential with FHE.

In this specific delegation [example](https://www.zama.ai/post/confidential-dao-voting-using-homomorphic-encryption), an existing Compound contract is used:

1.  The COMP token contract, including token balances, is first encrypted.
2.  Any changes in vote delegation are subsequently run over the encrypted token contract using FHE.
3.  The number of votes per delegate is then stored for each specific block.

The Governor contract subsequently manages proposals and votes:

1.  Each delegate's "for" or "against" vote is encrypted.
2.  The vote tally is made over encrypted votes with FHE.
3.  The vote is cast for the respective proposal.

### **Blind Auctions**

In previous blind auctions with ZKP implementations, bid data and compute is off-chain, requiring the trust of a third-party entity for proof creation. FHE allows [blind auctions](https://www.zama.ai/post/on-chain-blind-auctions-using-homomorphic-encryption) to run entirely on-chain, allowing parties to submit an encrypted private bid. In the bidding process:

1.  The bid amount by each user is kept encrypted.
2.  FHE is used to check if a previous bid has been made and determines the highest bid from all bidders.
3.  The contract returns the auction object to the winner and returns losing bids back to other auction participants.

### **Other Novel Applications**

Some other fhEVM novel use cases are being explored by the community [here](https://fhevm-explorers.notion.site/fhevm-explorers/fhEVM-Novel-Use-Cases-c1e637b0ca5740afa7fe598407b7266f); they include:

- Private Surveys: Survey answers are encrypted, and FHE is used to run analytics on the results whilst keeping participants and their answers anonymized
- DIDs: NFTs could contain encrypted metadata; FHE is run on the private metadata to enable entry into gated communities or authentication for access
- Gaming: Poker, battleship, rock paper scissors - game results are calculated with FHE from encrypted play submissions.

## **Challenges and Open Problems**

The open problems for FHE fall into three categories: usability, composability, and performance. Expanding the scope of feasible computations remains a challenge, and different schemes excel in different areas, but generally, there needs to be more standardization between schemes. Performance issues predominantly revolve around data efficiency due to large ciphertext and bootstrapping key sizes. Note that most challenges are often scheme-specific; we only discuss them at a high level for simplicity.

![Applied FHE Challenges](/articles/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-2/xNITwo9-6vXmdx_85xOih.webp)

Applied FHE Challenges

## **Transciphering/ Hybrid Homomorphic Encryption**

The large size of ciphertexts is one of the greatest barriers to practical implementation due to its associated computation time and bandwidth usage. [Transciphering](https://eprint.iacr.org/2023/1531.pdf), or Hybrid Homomorphic Encryption, is a method of carrying out compression encryption within the FHE setup. Data is first compacted with a scheme like [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) before creating a ciphertext, which FHE is then run on. There are several [methods of transciphering](https://eprint.iacr.org/2023/980.pdf) being explored at the moment that are compatible with TFHE schemes.

## **Hardware Acceleration**

Whilst bootstrapping reduces ciphertext noise to make FHE practically possible, it still requires a large amount of computation and time. [Hardware acceleration](https://dualitytech.com/blog/hardware-acceleration-of-fully-homomorphic-encryption-making-privacy-preserving-machine-learning-practical/) allows for computing tasks to be offloaded to specialized hardware components. At the moment, there are several teams working on ASICs for TFHE; the speedup with the use of more efficient hardware is likely to hit 1000x by 2025.

Reducing the complexity of FHE for developers is crucial. Creating user-friendly libraries, tools, and APIs that abstract the cryptography-heavy aspects of FHE while offering easy integration into existing development frameworks can encourage wider adoption. At the moment, there is a lack of standardization when it comes to APIs, schemes, and compilers. Improving [library interoperability](https://homomorphicencryption.org/wp-content/uploads/2018/10/CCS-HE-Tutorial-Slides.pdf?ref=blog.sunscreen.tech) and higher-level automation for developers will make FHE more usable.

## **FHE Compilers**

A compiler is a piece of software that converts source code to binary code in one go. Think of it as a translator for human readable languages (programming languages) to machine-readable languages (binary code). The majority of FHE compilers that exist at the moment add a significant amount of time to computation. The most efficient compiler at the time of writing (Sunscreen) has 1.3x overhead when compared to a low-level FHE library.

One of the barriers to wider FHE adoption is the need for developer-friendly compilers. [Sunscreen](https://blog.sunscreen.tech/from-toy-programs-to-real-life-building-an-fhe-compiler/) and [Zama](https://docs.zama.ai/concrete/) are actively building compilers that increase the usability of FHE by automating parameters and key selection. At the moment, both compilers currently only support single-key FHE schemes and are standalone. The compatibility of the two is being worked on so that ZKPs can be used to prove information with FHE ciphertexts.

## **FHE for Blockchain**

### Performance

Improving the performance of FHE schemes is essential for responsive Web3 applications. As blockchains are limited by block size, we need to find a way to maximize throughput without sacrificing block space. When it comes to user experience, both cost and latency need to be managed to usable levels. Reducing ciphertext size will be key here.

### **Gas Cost**

Gas cost estimations are possible on the blockchain because transaction data is public. In the case of FHE, smart contract execution flow logic will differ depending on the outcome of computation (which may be hidden), making it difficult to accurately estimate gas costs. However, there are currently some [proposed ways](https://github.com/zama-ai/fhevm/blob/main/fhevm-whitepaper.pdf) to navigate this, and more accurate techniques will need to be developed to create a desirable user experience.

### **Trust assumptions**

The implementation of Threshold FHE for encrypted states on a private blockchain utilizes the security assumptions of a network of decentralized validators. In order to perform the decryption, only 2/3rds of the validators or the number predetermined in the Threshold-FHE setup is required. Unlike a public blockchain, any form of collusion would be [undetectable](https://hackmd.io/cd7YCyEqQh-n_LJ0kArtQw); malicious activity would, therefore, leave no verifiable trace. Some would argue that a setup requiring stronger trust assumptions, like FHE-MPC, is more prudent. Decryption nodes and validator notes could also be potentially [separate entities](https://discord.com/channels/901152454077452399/1126507772524113930/1153599900244791397), varying the trust assumptions and threshold of the two operations.

### **Privacy Leaks**

The simple act of the client sending a command to the server running the fhEVM may already disclose more information than the user is willing to. Similarly, any wallet that interacts with a smart contract to run the FHE application like voting will disclose, at a minimum they have voted. On the transaction level, we may be able to hide specific balances or amounts, but external parties may be able to deduce details from the macro state. Creating a cohesive system that prevents critical data leakage is a challenge, one which the composability of FHE, ZKPs and MPC might help to solve.

## **Conclusion**

FHE opens up new frontiers in secure computation, realizing its full potential demands overcoming challenges such as usability, performance, and integration with other cryptographic primitives. While practical applications of FHE across domains are just emerging, its integration into decentralized systems remains an ongoing narrative. The technology's potential to reshape data privacy is vast, promising a future where we default to privacy-centric systems.

The road ahead involves deeper dives into advanced concepts and integration strategies like [Ring-LWE](https://www.mdpi.com/2227-7390/10/5/728), [ZK](https://github.com/emilianobonassi/zkFHE)-[FHE](https://github.com/enricobottazzi/zk-fhe), [FHE Rollups](https://www.fhenix.io/wp-content/uploads/2023/11/FHE_Rollups_Whitepaper.pdf), [FHE-MPC](https://eprint.iacr.org/2023/981.pdf), and Latticed-based [ZKP](https://eprint.iacr.org/2022/284)s.

## **FHE Resources**

Craig Gentry: A Fully Homomorphic Encryption Scheme [https://cdn.sanity.io/files/r000fwn3/production/5496636b7474ef68f79248de4a63dd879db55334.pdf](https://cdn.sanity.io/files/r000fwn3/production/5496636b7474ef68f79248de4a63dd879db55334.pdf)

Slides: CSS_HE tutorial slides [https://homomorphicencryption.org/wp-content/uploads/2018/10/CCS-HE-Tutorial-Slides.pdf?ref=blog.sunscreen.tech](https://homomorphicencryption.org/wp-content/uploads/2018/10/CCS-HE-Tutorial-Slides.pdf?ref=blog.sunscreen.tech)

Slides: Computing Arbitrary Functions of Encrypted Data [https://crypto.stanford.edu/craig/easy-fhe.pdf](https://crypto.stanford.edu/craig/easy-fhe.pdf)

Fhenix: FHE Rollups

**[FHE-Rollups: Scaling Confidential Smart Contracts on Ethereum and Beyond – whitepaper](https://www.fhenix.io/fhe-rollups-scaling-confidential-smart-contracts-on-ethereum-and-beyond-whitepaper/)**

fhEVM Whitepaper:

**[fhevm/fhevm-whitepaper.pdf at main · zama-ai/fhevm](https://github.com/zama-ai/fhevm/blob/main/fhevm-whitepaper.pdf)**

fhEVM Novel Use cases: [https://fhevm-explorers.notion.site/fhevm-explorers/fhEVM-Novel-Use-Cases-c1e637b0ca5740afa7fe598407b7266f](https://fhevm-explorers.notion.site/fhevm-explorers/fhEVM-Novel-Use-Cases-c1e637b0ca5740afa7fe598407b7266f)

FHE-MPC Advanced Grad Course

**[homes.esat.kuleuven.be](https://homes.esat.kuleuven.be/~nsmart/FHE-MPC/)**

Fully Composable Homomorphic Encryption

**[cseweb.ucsd.edu](https://cseweb.ucsd.edu/classes/fa23/cse208-a/cfhe-draft.pdf)**

Video: FHE and MPC by Shruthi Gorantala [https://www.youtube.com/watch?v=Q3glyMsaWIE](https://www.youtube.com/watch?v=Q3glyMsaWIE)

Github: FHE awesome list

**[GitHub - jonaschn/awesome-he: ✨ Awesome - A curated list of amazing Homomorphic Encryption libraries, software and resources](https://github.com/jonaschn/awesome-he)**

Pesca: A Privacy Enhancing Smart Contract Architecture

**[eprint.iacr.org](https://eprint.iacr.org/2022/1119.pdf)**

Slides: MPC from Theory to Practice, Nigel Smart

**[crypto.stanford.edu](https://crypto.stanford.edu/RealWorldCrypto/slides/smart.pdf)**

Video: Prog Crypto

**[PROGCRYPTO - Archive](https://app.streameth.org/devconnect/progcrypto/archive)**

Sunscreen:

An Intro to FHE: [https://blog.sunscreen.tech/an-intro-to-fully-homomorphic-encryption-for-engineers/](https://blog.sunscreen.tech/an-intro-to-fully-homomorphic-encryption-for-engineers/)

Building Private Dapps:[https://www.youtube.com/watch?v=\_AiEmS8ojvU](https://www.youtube.com/watch?v=_AiEmS8ojvU)

Documentation: [https://docs.sunscreen.tech/](https://docs.sunscreen.tech/)

ZK9 Building an FHE Compiler: [https://www.youtube.com/watch?v=VJZSGM4DdZ0](https://www.youtube.com/watch?v=VJZSGM4DdZ0)

ZK Podcast: Episode 295 The Return to MPC with Nigel Smart

**[Episode 295: Return to MPC with Nigel Smart](https://open.spotify.com/episode/4zfrPFbPWZvn6fXwrrEa5f?si=9ab56d47510f4da0)**
