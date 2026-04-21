---
authors: ["Enrico Bottazzi"]
title: "Why We Can't Build Perfectly Secure Multi-Party Applications (yet)"
image: "/articles/why-we-cant-build-perfectly-secure-multi-party-applications-yet/why-we-cant-build-perfectly-secure-multi-party-applications-yet-cover.webp"
tldr: "This post was written by PSE researcher Enrico Bottazzi. Thanks to Pia Park for discussions and reviews."
date: "2025-01-14"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/nXUhkZ84ckZi_5mYRFCCKgkLVFAmM2ECdEFCQul2jPs"
tags:
  [
    "mpc",
    "secure multi-party computation",
    "fhe",
    "fully homomorphic encryption",
  ]
projects: ["mpc-framework"]
---

In this post, we'll explore why building secure multi-party applications, which aim to compute a function over inputs from different parties while keeping those inputs private, is impossible today. We use Multi-party Trade Credit Set-off (MTCS) as an example, showing how technologies like multi-party computation and fully homomorphic encryption fall short of perfect security due to a fundamental tradeoff between security and liveness. The current solution involves a delegated security model, but it's not ideal. Are there any robust patches to this problem, or will we have to wait for indistinguishability obfuscation?

### Multilateral Trade Credit Set-off

Multilateral Trade Credit Set-off (MTCS) is a process run by a service provider that collects trade credit data (i.e. obligations from a firm to pay another firm) from a network of firms and detects cycles of debts that can be removed from the system. The process yields liquidity savings for the participants, who can discharge their debts without relying on expensive loans.

![Trade credit network before and after MTCS](/articles/why-we-cant-build-perfectly-secure-multi-party-applications-yet/R8q8o6EwgXE3RimPPHMhu.webp)

Trade credit network before and after MTCS

We propose an MTCS protocol that protects firms' sensitive data, such as the obligation amount or the identity of the firms they trade with. The results are presented in the paper _[Multilateral Trade Credit Set-off in MPC via Graph Anonymization and Network Simplex](https://eprint.iacr.org/2024/2037),_ authored by Enrico Bottazzi, Chan Nam Ngo, and Masato Tsutsumi.

Despite what you might think, I am not here to celebrate our results. The curious reader who is interested in how we _reduced the asymptotic round complexity of the secure minimum cost flow algorithm_ is warmly invited to check out the paper. Instead, I want to abstract the characteristics of this specific application to **any** secure multi-party application and analyze how technologies such as fully homomorphic encryption (FHE) or secure multi-party computation (MPC) yield an **imperfect security model** given an inherent tradeoff between security and liveness.

However, not all hope is lost: we present some temporary patches until we reach [indistinguishability obfuscation](https://www.leku.blog/io/), which will break this tradeoff once and for all and allow us to build fully secure multi-party applications.

### Secure multi-party applications

A secure multi-party application is an application in which a function has to be computed over inputs coming from different parties, and this input should remain private: each party should not learn anything beyond what can be inferred from their input and the output of the function. Note that this definition is independent from the technology used to build such application.

In the real world, these applications are usually built leveraging a third party that performs the function and is **trusted** to keep the data for themselves and not do anything malicious with it. This is also the case for MTCS: Slovenia has been running it country-wide since 1991. The process is run every month by having the national firms submit their invoice to a government agency, which performs the clearing by having access to the entire trade credit graph. The low [participation rate](https://www.ajpes.si/Bonitetne_storitve/Vecstranski_pobot/Porocila#b671) (1500 firms, 0.2% of the total, in 2022) suggests that Slovenian firms might feel more comfortable in keeping their sensitive trade credit data for themselves and not join the process, despite the benefits that it yields. In the following sections, we'll iteratively try to build such a secure multi-party app, that does not depend on a single trusted third party.

![MTCS via a trusted third party](/articles/why-we-cant-build-perfectly-secure-multi-party-applications-yet/ZJT8oZgkydYe6GS_DzIaJ.webp)

MTCS via a trusted third party

### Building secure multi-party applications with MPC

MPC allows $n$ parties to compute a function on their combined private input without disclosing it to each other. In its most secure form, each input is split within $n$ shares such that any combination of $n-1$ shares reveals absolutely nothing about the underlying information. Functions can be performed "obliviously" by having the parties exchange information every time a multiplication is performed. With the strongest security assumptions, privacy and correctness of the executed function are guaranteed as long as one participant is honest. From the point of view of a firm, this is ideal: as long as I keep my shares protected, no one can learn any information.

But the devil lies in the details! In a protocol with $n$ participants, $n \* (n-1) / 2$, communication channels need to exist to carry out the computation correctly, making the system highly inefficient (and therefore impractical) for networks of tens of thousands of firms. More importantly, those channels need to remain active during the whole protocol to guarantee its finality. Any malicious actor can decide to drop off in the middle of the algorithm execution, making it impossible for the others to recover their output.

### Building secure multi-party applications with FHE

When it comes to performing computation over encrypted data, fully homomorphic encryption (FHE) is another possible solution. The mental model for FHE is straightforward: any untrusted server can perform $f$ on encrypted data without learning any information about the underlying data. While MPC is information-theoretic secure, in FHE the privacy of the data is guaranteed by the hardness of solving a specific mathematical problem. A further guarantee of correct computation can be achieved, with an additional cost, by slapping a zkSNARK on top of the server's operation.

But there's a caveat: FHE still requires someone to hold the decryption key. Outsourcing the ownership of the decryption key to a single party is not a good idea since this party would have god-mode read access to every encrypted data. A more secure approach is to run a [distributed key generation](https://en.wikipedia.org/wiki/Distributed_key_generation) (DKG) ceremony between the $n$ firms, encrypt all the data under the generated encryption key, outsource the computation of $f$ to a server and require the firms to come together again to decrypt each output and deliver it to the designated receiver firm. The decryption part must be done via MPC.

This brings us to the same problem we encountered before: one negligent (or malicious) firm that loses its decryption key share is sufficient to bring the whole protocol to a halt.

### The delegated security model

A perfect security model, "trust no one but yourself," presents limitations given the interaction needed between the $n$ protocol participants. Given that a secure MTCS protocol should support tens of thousands of firms, the price of this security level is too high for a practical instantiation. Sora describes this as a tradeoff between safety and liveness.

![Where x-axis represents the probability of success based on liveness assumptions. Source: https://speakerdeck.com/sorasuegami/ideal-obfuscation-io](/articles/why-we-cant-build-perfectly-secure-multi-party-applications-yet/f7BtryGDapIIIC4fXczn5.webp)

Where x-axis represents the probability of success based on liveness assumptions. Source: https://speakerdeck.com/sorasuegami/ideal-obfuscation-io

And indeed, the solution we proposed in the paper does not achieve a perfect security model. Instead, we rely on a client-to-server MPC protocol in which the computation (and the security) of the security is delegated to three servers. The strongest security assumption can guarantee that the privacy of the firm's data is safe as long as at least one of the servers is honest. However, the firms cannot do much to prevent the server managers from secretly meeting and gathering their shares to reconstruct any data involved. To make things even worse, there is no immediate way to detect this malicious action and keep the servers accountable for any misbehaviour.

![MTCS via MPC](/articles/why-we-cant-build-perfectly-secure-multi-party-applications-yet/DrwIYwRjsbbqkZ5bwaS5I.webp)

MTCS via MPC

### Temporary patches and endgame

There is a set of patches that aim to partially increase the security of such "imperfect" secure multi-party applications. The easiest to implement relies on social dynamics and involves choosing delegates that have conflicting interests with each other, such that a collusion between them is unlikely. For example, in the paper, we propose a delegated security model in which the three server managers are the National Chamber of Commerce, the tax authority, and a payment processor.

A more advanced implementation requires the servers to wrap their computation inside a TEE to add an additional layer of security: to assemble their shares, the servers must first break the TEE security. A more theoretical approach involves [traitor tracing](https://eprint.iacr.org/2023/1724) systems to add accountability for misbehaving servers.

The endgame for secure multi-party applications is [indistiguishability obfuscation](https://www.leku.blog/io/) (iO), which promises to be able to break the tradeoff between safety and liveness by removing any need for interaction during the decryption/output reconstruction phase. In particular, the decryption key of a FHE scheme can be embedded inside an obfuscated program as a result of a trusted set-up ceremony: as long as one participant is honest, no human can recover the key. The obfuscated program is designed to take a FHE ciphertext as input together with a proof that such ciphertext is allowed to be decrypted according to the predefined application logic. The program will verify the proof, and, on successful verification, output the decryption of the ciphertext. Since the obfuscated program is public, the decryption can be performed by anyone without requiring any interaction between parties holding the key.

While there are no practical iO implementations yet, the potential impact on secure multi-party applications is profound. At PSE, we're starting a new team to explore novel approaches based on recent publications to build practical iO.

If you're a researcher interested in contributing, reach out to [me](https://t.me/demivoleegaston)! You can also join the discussion on our brand new [PSE forum](https://forum.pse.dev/post/1/7) 🙌
