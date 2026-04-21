---
authors: ["kichong"]
title: "Beyond Zero-Knowledge: What's Next in Programmable Cryptography?"
image: "/articles/beyond-zero-knowledge-whats-next-in-programmable-cryptography/beyond-zero-knowledge-whats-next-in-programmable-cryptography-cover.webp"
tldr: "_This post was written by [kichong](https://twitter.com/kichongtran) with helpful feedback and comments from [sinu](https://twitter.com/sinu_eth) and [jmall](https://twitter.com/Janmajaya_mall)._"
date: "2023-11-09"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/xXcRj5QfvA_qhkiZCVg46Gn9uX8P_Ld-DXlqY51roPY"
tags:
  [
    "cryptography",
    "programmable cryptography",
    "zero-knowledge proofs",
    "mpc",
    "secure multi-party computation",
    "fhe",
    "fully homomorphic encryption",
    "io",
    "privacy",
    "security",
  ]
projects: ["pse-security"]
---

MPC, FHE, iO. If these combinations of letters make little sense to you, then you're in the right place. This post attempts to review, at a high level, the world of programmable cryptography beyond the borders of zero-knowledge (ZK).

The intent is to expose people to the idea that ZK is only one part of a constantly shifting landscape of cryptographic primitives, techniques, and protocols. And what remains is more powerful, more private, and more confusing than the average cryptography-curious person is aware of.

This post makes no claims, conclusions, or predictions. This is no deep dive. At best, it's an informal skimming of the surface in the quest for the holy grail of cryptography.

While encryption has been around for thousands of years, programmable cryptography is a modern technology. Described as "[general-purpose cryptography … \[or\] an expressive language for claims](https://archive.devcon.org/archive/watch/6/zkps-and-programmable-cryptography/?tab=YouTube)", it's the idea that a cryptographic primitive like a ZK proof could be made flexible and adaptive enough that a developer could program nearly any function on top of it. That there can exist an unbroken chain of logic from someone clicking a button on a website to the mathematical proof that guarantees the security of a cryptographic operation.

![https://youtu.be/qAfprVCBhdQ?t=1024](/articles/beyond-zero-knowledge-whats-next-in-programmable-cryptography/6I3pxfsamZF_nsL_X3k6T.webp)

https://youtu.be/qAfprVCBhdQ?t=1024

While traditional cryptography relied on fixed sets of functionalities, which required a skilled cryptographer to build a specialized system for every new mechanism, programmable cryptography lets developers deploy cryptographic properties and functionality in a language closer to what they already understand. It gives developers who are not cryptography experts a more familiar interface.

ZK proofs were first [conceived of in 1985](https://people.csail.mit.edu/silvio/Selected%20Scientific%20Papers/Proof%20Systems/The_Knowledge_Complexity_Of_Interactive_Proof_Systems.pdf). The concept was officially published in 1989, but remained mostly theoretical until 2012 when a type of ZK proof called a [zk-SNARK](https://eprint.iacr.org/2011/443.pdf) was discovered. This new primitive allowed ZK proofs to prove or authenticate nearly any function or arbitrary computation.

Since zkSNARKS became possible, resources and talent have poured into building zCash, zkRollups, zkEVMs, and a host of other applications beginning with the letter z. It turned out, decentralized systems like Ethereum, and blockchains in general, were the perfect motivation to get people interested in cryptography, turning a once-impractical research field into an active ecosystem with actual end-user applications.

There are no guarantees that [Multi-Party Computation (MPC)](https://en.wikipedia.org/wiki/Secure_multi-party_computation), [Fully Homomorphic Encryption (FHE)](https://en.wikipedia.org/wiki/Homomorphic_encryption), and [Indistinguishable Obfuscation (iO)](https://en.wikipedia.org/wiki/Indistinguishability_obfuscation) will follow the same path as ZK, becoming more practical, optimized, and general-purpose as time goes on. But at this early stage, it is certainly possible.

If you think of programmable cryptography as a type of digital computer, built on certain assumptions that allow for certain properties and guarantees, then we are still at the hardware stage. We are still actively figuring out the best way to construct the logical gates or circuits for this new computer.

## **Relatively intuitive comparisons**

To better understand the general landscape of programmable cryptography, let's start by very roughly approximating where MPC, FHE, and IO stand in relation to ZK, and each other. In this section, and really all the sections that come after, we will trade-off nuance, precision, and formality in favor of simplicity and accessibility.

The simplest way to reason about cryptography is what information is kept hidden or secret. And what the system proves or reveals.

![](/articles/beyond-zero-knowledge-whats-next-in-programmable-cryptography/-AAI15NdLONUuc7SGb9Jt.webp)

You can also think of each of these systems as standing in for an imaginary mutual friend. [Wikipedia calls this friend "Tony."](https://en.wikipedia.org/wiki/Secure_multi-party_computation#Definition_and_overview) Tony is infallible, incorruptible, and totally trustworthy. Tony's job is to keep secrets. In the table below, think of the "Private Elements" as what secrets Tony can be trusted to keep, the "Use Cases" as tasks Tony could perform reasonably well, and the "Practicality" as how skillfully Tony could perform these tasks today.

![](/articles/beyond-zero-knowledge-whats-next-in-programmable-cryptography/lj84zAzL24ghhq-rWsuW2.webp)

The tables above are intended to give a rough idea for different areas of programmable cryptography. Now, let's go a bit deeper and review what MPC, FHE, and iO do along with some interesting tidbits about each field.

## **Multi-Party Computation (MPC)**

Multi-Party Computation (MPC) allows many parties to jointly compute some agreed upon function without revealing any data to the other participants. With MPC, the same computation is applied to everyone's data, but each party's input is kept secret. Intermediate values would also stay secret. Only the output is revealed at the end.

As opposed to ZK, MPC is collaborative. It allows different parties to collaborate on the same computation, each contributing their own data, to get some mutual result everyone wants.

We can compare ZK and MPC in the context of an AI system to get more context. ZK would be good at authenticating or verifying a piece of data came from a real person or from a person's phone. MPC is better for training an AI system because different individuals, groups, or organizations could share sensitive data with the AI system but trust that the data won't be revealed to anyone else.

## **Millionaire problems**

MPC was thought of in [1982 by Andrew Yao](https://research.cs.wisc.edu/areas/sec/yao1982-ocr.pdf) to solve a thought experiment called the "Millionaire's Problem" where two millionaire's want to know who is richer without telling each other how much money they have. The solution was to use [garbled circuits, which according to Vitalik Buterin,](https://vitalik.ca/general/2020/03/21/garbled.html) frequent explainer of cryptographic concepts, is also one of the most basic ways to wrap your head around MPC.

\[Before learning about a garbled circuit, you need to know what a arithmetic circuit is in general. If you're new to the idea of circuits, there's a [simple explanation here.](https://mirror.xyz/privacy-scaling-explorations.eth/AW854RXMqS3SU8WCA7Yz-LVnTXCOjpwhmwUq30UNi1Q)\]

MPC is a multi-step, interactive process where millionaire #1 (Alice the Garbler) must first create the circuit, enter her net worth, then transform it into a garbled or encrypted form before passing it along to millionaire #2 (Bob the Evaluator). When Bob gets his hands on the circuit, his job is to add his own net worth, then evaluate or run the circuit to make sure it's correct. Finally, Bob decrypts the final output and, for example, learns Alice is richer, but never learns that Alice is, in fact, way richer, and he shouldn't have made assumptions.

The Millionaire's Problem and garbled circuits as a solution were crucial to the early development of MPC. But its application was limited. A more complex and nuanced version of the problem, called the [Socialist Millionaire's Problem](https://en.wikipedia.org/wiki/Socialist_millionaire_problem), checked if the two millionaires were equally rich, instead of revealing which one had more money. This subtle difference significantly extended MPC functionality but required more complex cryptographic solutions and techniques beyond the scope of this article.

## **Fully Homomorphic Encryption (FHE)**

Fully Homomorphic Encryption (FHE) allows computations on encrypted data. It can perform a function on encrypted data just as if it had remained unencrypted. The output of the function is only decrypted by the party with the secret key. If we think of encryption as a black box that hides secrets, then FHE ensures that the data and the computations on that data remain within that black box.

Though there are no famous thought experiments like the Millionaire's Problem for MPC, FHE does solve a fundamental security weakness: ["the need to decrypt before processing data."](https://blog.cryptographyengineering.com/2012/01/02/very-casual-introduction-to-fully/)

![https://www.zama.ai/post/the-revolution-of-fhe](/articles/beyond-zero-knowledge-whats-next-in-programmable-cryptography/p7FPMhbZ6Hx4lWf-OdWpy.webp)

https://www.zama.ai/post/the-revolution-of-fhe

In an AI context, FHE would keep all the data between the user (secret key holder) and the AI system encrypted. The user interacts with the system as normal, but the user could be confident that the AI never "learned" anything about the data being given. The entire interaction would be encrypted. The AI never learns what you typed or asked, what pictures you sent, or who sent it, but can still respond as if it did know the information.

If it works, FHE will be one of the most powerful privacy-preserving technologies available. And who knows? [In 10 years, we may even have FHE-EVMs](https://youtu.be/ptoKckmRLBw?si=WQDbSStGkqWCx5JM&t=1734).

## **Noise management**

Compared to MPC and ZK, FHE is – at the moment – on the more theoretical or less practical end of the spectrum. The technology was only considered to be feasible in [2009 when Craig Gentry](https://www.cs.cmu.edu/~odonnell/hits09/gentry-homomorphic-encryption.pdf) figured out how to deal with noise.

FHE operations are computationally very intensive because "noise" is added during the encryption process to enhance security. Noise in FHE is a small random value added to the plaintext (unencrypted data) before it is turned into ciphertext (encrypted data). Each operation increases noise. While addition and subtraction operations cause negligible noise growth, multiplication is more computationally expensive, which results in significant noise growth. So as the complexity of a program increases, noise – the space required to accommodate noise and the computational resources needed to process noise – accumulates.

Gentry's breakthrough was a technique called bootstrapping, which could reduce noise and allow for more computation on encrypted data in FHE systems. Bootstrapping takes the ciphertext and decrypts it homomorphically, which means reducing the noise level on an encrypted piece of data without actually revealing what it is. The result is a ciphertext with much lower pre-defined noise, thus allowing us to compute on the ciphertext further. Bootstrapping, in general, allows us to circumvent the need of having higher space for noise growth as complexity of computation increases. We can limit the space to a few operations and repeatedly bootstrap to compute arbitrarily large computations without compromising the original data.

Depending on the FHE scheme, bootstrapping can either take several minutes or milliseconds. If bootstrapping is slower, the computational cost can be spread out by applying it to several ciphertexts at once. If bootstrapping is faster, it usually comes with the trade-off of only working with small pieces of plaintext (usually 8 bits) at a time to stay efficient.

## **Indistinguishability Obfuscation (iO)**

If FHE turns all the elements of the computation into a black box, then iO turns the computation itself into a black box.

Indistinguishability Obfuscation (iO) is considered the most powerful cryptographic system within the realm of theoretic possibility. In [one article](https://www.quantamagazine.org/computer-scientists-achieve-crown-jewel-of-cryptography-20201110/), iO is described as a "master tool from which nearly every other cryptographic protocol could be built" and referred to by cryptography experts as a "crown jewel" and "one cryptographic primitive to rule them all."

According to Amit Sahai, the professor known for [explaining ZK proofs to kids](https://www.youtube.com/watch?v=fOGdb1CTu5c), and one of the researchers who devised a way [build iO on well-founded assumptions](https://eprint.iacr.org/2020/1003), iO works on a fundamentally different paradigm than previous cryptographic systems. IO assumes the adversary can already read your mind (a metaphor for your computer). Your secrets are already known so can't be hidden. The only thing you can do is obfuscate what the adversary can already see.

![https://youtu.be/v2RR_c5hn1E](/articles/beyond-zero-knowledge-whats-next-in-programmable-cryptography/0JS-dJVwLCjsLtdvd9dOR.webp)

https://youtu.be/v2RR_c5hn1E

The point of iO is to make two functions or computations equally obscure. If you turn two computations into a form that is indistinguishable from each other, then you can hide how the program works. If you can't tell the difference between two programs, you don't know which of the two programs is being executed, and no information can be deduced from either one, other than that they both perform the same function. Both programs take the same inputs and produce the same outputs, but iO makes it so no one can figure out how.

With iO, you can conceal the structure of every type of function including nearly all the functions that make up cryptography. In other words, by obscuring nearly anything, you reach the most general-purpose programmable cryptography on which other primitives can be programmed on top of.

Technically, there is a black box bigger than iO. It's literally called [black box obfuscation](https://en.wikipedia.org/wiki/Black-box_obfuscation). But that one is still impossible.

## **Well-founded assumptions**

No one knew how to build iO [until 2013, when multilinear maps were proposed by Garg, Gentry, Halevi, Raykova, Sahai, Waters.](https://eprint.iacr.org/2013/451.pdf) A computer program could be broken up like puzzle pieces then obscured using multilinear maps. The obscured pieces could be reassembled to achieve the same functionality as the original program without revealing its inner workings.

Multilinear maps are a generalization of the bilinear maps or pairings used in [Elliptic Curves Cryptography (ECC](https://blog.cloudflare.com/a-relatively-easy-to-understand-primer-on-elliptic-curve-cryptography/)). While bilinear maps are foundational to existing cryptographic schemes like [BLS signatures](https://en.wikipedia.org/wiki/BLS_digital_signature), they are not complex or expressive enough for iO. And while multilinear maps could handle iO, this newly developed algebraic structure was easily attackable and wasn't secure so relying on multilinear maps was generally unsatisfying for cryptographers. The field was stuck again.

Then, in 2020, [Jain, Lin, and Sahai proposed](https://eprint.iacr.org/2020/1003) a solution that while unusual and new, was simple enough for cryptographers to reason about, and instead of relying on newly developed assumptions like multilinear maps, this version of iO could be built on more standard and well-founded assumptions that have been studied for decades such as [Learning with Errors (LWE).](https://en.wikipedia.org/wiki/Learning_with_errors) With this latest breakthrough, iO became feasible again. The holy grail was still in reach.

## **Untamed wilderness**

Each cryptographic system is made of different mathematical assumptions and cryptographic techniques. No single breakthrough solves all the problems in a system. Instead, discoveries follow an unpredictable series of small steps and big leaps that alter existing assumptions and techniques, which in turn lead to more breakthroughs and discoveries. And for every discovery that worked, many more did not.

![](/articles/beyond-zero-knowledge-whats-next-in-programmable-cryptography/jAMju2X2AJnMDj5mit-AN.webp)

In a presentation on iO, Sahai described the field as being in the "[untamed wilderness](https://youtu.be/v2RR_c5hn1E?t=1317),", where it wasn't even clear what was not understood and what the right problems to solve were.

Teams like [PSE](https://www.appliedzkp.org/) primarily work on the practical or applied side of programmable cryptography, focusing on primitives like ZK and MPC with well-founded assumptions that have been battle-tested, relatively optimized, and thought to be secure and effective. Though there are plenty of optimizations left, ZK is now firmly within the realm of practicality. But there was also a time when ZK was confined to the untamed wilderness.

To maximize the number of privacy-preserving, security-guaranteeing, claim-verifying, cryptography-enabled tools the world has access to, we should keep, at least, one eye squinted toward the horizon of what's to come because no one can predict what will be practical in 10 years.

Sahai's presentation includes a quote from a [2003 Nature article by Steven Weinberg called Four Golden Lessons](https://www.nature.com/articles/426389a), which highlights another reason to work on the currently impractical.

"When I was teaching at the Massachusetts Institute of Technology in the late 1960s, a student told me that he wanted to go into general relativity rather than the area I was working on, elementary particle physics, because the principles of the former were well known, while the latter seemed like a mess to him. It struck me that he had just given a perfectly good reason for doing the opposite… My advice is to go for the messes — that's where the action is."

---

Programmable Cryptography is being explored by a variety of teams including [PSE](https://pse.dev/) and [0xPARC](https://0xparc.org/), co-organizers of a 2-day event called the [Programmable Cryptography Conference](https://progcrypto.org/) happening in Istanbul, Turkey on November 16 & 17, 2023.

Come say hello! Or find [PSE online on Discord](https://discord.com/invite/sF5CT5rzrR).
