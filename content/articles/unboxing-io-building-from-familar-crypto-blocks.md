---
authors: ["Sora Suegami", "Enrico Bottazzi", "Pia Park"]
title: "Unboxing iO: Building From Familar Crypto Blocks"
image: "/articles/unboxing-io-building-from-familar-crypto-blocks/cover.webp"
tldr: ""
canonical: "https://machina-io.com/posts/unboxing.html"
date: "2025-07-11"
projects: ["machina-iO"]
---

# UNBOXING IO: BUILDING FROM FAMILIAR CRYPTO BLOCKS

2025‑07‑01

by [Enrico Bottazzi](https://x.com/backaes), with contribution and review from [Pia Park](https://x.com/0xpiapark) and [Sora Suegami](https://x.com/SoraSue77)

## Introduction

Over the past few months of researching and implementing indistinguishability obfuscation (iO), we’ve noticed a frustrating gap in the available resources. Most papers are highly technical and intimidating, while beginner friendly articles stay at a vague, feature‑level overview: they tell you what iO can enable but nothing about how to construct it.  
This article aims to bridge that gap. We’ll work through a concrete, end‑to‑end example, of a non‑interactive conditional signature printer, building it in several attempts **using familiar cryptographic primitives as building blocks**. By the end, you should have a clear roadmap of the theoretical building blocks behind iO and a hands‑on understanding of its power.

## Goal: non‑interactive conditional signature printer

Our target program $f$ behaves as follows:

$$
f(k, x)=
\begin{cases}
\textsf{sign}(k, x) & \text{if } x \text{ is prime},\\
\bot & \text{otherwise}.
\end{cases}
$$

That is, given a message $x$, it outputs a valid signature under the secret key $k$ when $x$ is prime, and $\bot$ otherwise.  
The setting involves a **key owner**, who generates the program and holds the signing key $k$, and a collection of **users**, who supply numbers $x$ and hope to obtain signatures when the condition holds. Any viable construction must meet two requirements:

1. **No interaction.** Once the program is published, users must be able to run it and (conditionally) obtain signatures without ever contacting the key owner. Even if the key owner is off‑grid on a desert island, the system must keep working.
2. **Key privacy.** Executing the program should reveal nothing about $k$ beyond what is already implicit in the output $f(k, x)$. Simply releasing the source code is therefore out of the question, because it would expose the key.

In the sections that follow we’ll try to build this program with various attempts: first with a public truth table, then with fully homomorphic encryption (FHE), next with functional encryption (FE), and finally with an augmented version of FE that we'll call indistinguishability obfuscation (iO).

### Attempt #1 – public truth table

We start from something straightforward: let the key owner, holding the signing key $k$, publish a truth table that maps every possible input $x_i$ to the corresponding output $f(k,x_i)$. Concretely, the key owner fixes an input domain, say 64 bits, and precomputes $f(k,x_i)$ for each of the $2^{64}$ possible inputs. You can imagine the truth table as a huge dictionary keyed by every $x_i$, with each value equal to $f(k,x_i)$. Given Alice as a user with input $x=7$, she could lookup the truth table corresponding to her key and obtain $f(k, 7)$.  
While this approach satisfies the two requirements laid out earlier, it scales exponentially with the input size, so it's impractical. We therefore add a third requirement: the work done by the key owner should not grow exponentially with the bit length of the user’s input.

### Attempt #2 - fully homomorphic encryption

As you might have heard in some conference, fully homomorphic encryption (FHE) is always mentioned with respect to "computation on encrypted data", so it sounds a potential solution to our problem.  
We first list the core APIs of FHE. In particular, we describe the secret key variant. We won't go too deep into this as, differently from iO, you can find plenty of [great resources online](https://fhe.org/resources/).

$$
\begin{aligned}
\mathsf{FHE.Keygen}() &\rightarrow sk\\
\mathsf{FHE.Enc}(k, sk) &\rightarrow ct_k\\
\mathsf{FHE.Eval}(f, ct_k) &\rightarrow ct_{f(k)}\\
\mathsf{FHE.Dec}(ct_{f(k)}, sk) &\rightarrow f(k)
\end{aligned}
$$

Here's a sketch of a non‑interactive conditional signature printer based on FHE. The key owner is also the holder of the FHE secret key $sk$. The role of the cloud is to store data produced by the key owner and make them available to everyone, including any other user such as Bob or Carl that might be unknown to the key owner.

![FHE](https://hackmd.io/_uploads/HyIN1bkVxg.png)

Although Alice can evaluate the function $f$ over the encrypted signing key $ct_k$ and her input $7$ to obtain an encrypted version of the output $ct_{f(k,7)}$, this still requires a further interaction with key owner to decrypt it. So this violates our no‑interaction requirement. On the other hand, publishing the FHE secret key $sk$ would allow for non‑interactive decryption but also violate the security requirement of our application, since now Alice can also decrypt $ct_k$. We need to think deeper...

### Attempt #3 - functional encryption

The next technology that we are going to introduce is functional encryption (FE). This is a less "popular" cryptographic building block. This is not surprising since it took me many months to find a valid motivating application for it. We first analyse the core APIs of FE and describe such application. Only then we'll be equipped to apply FE to our problem.

$$
\begin{aligned}
\mathsf{FE.Setup}() &\rightarrow mpk, msk\\
\mathsf{FE.Keygen}(msk, f) &\rightarrow sk_f\\
\mathsf{FE.Enc}(k, mpk) &\rightarrow ct_k\\
\mathsf{FE.Dec}(ct_k, sk_f) &\rightarrow f(k)
\end{aligned}
$$

The motivating example we chose to help you understand FE is email spam filtering: on one hand, Daisy doesn't want to rely on a cloud mail provider able to read all her emails. On the other hand, a secure (fully encrypted) cloud mail provider wouldn't be able to detect spam emails and require Daisy to download each email, including potentiall spam ones, consuming her precious bandwidth and device space.

Instead, Daisy can run the setup to obtain a master public key $mpk$ and a master secret key $msk$. Use the latter to generate a functional secret key $sk_f$ tied to a function $f$ that detects if an email is spam (returns $1$) or not (returns $0$). Share the functional key with her secure email cloud provider. Every sender can encrypt an email $k$ directed to Daisy under her master public key $mpk$ and share the ciphertext $ct_k$ to the email provider. For each email received by Daisy, the provider can run the FE decryption and learn whether an email is spam or not and only serve the non‑spam ones to Daisy. More importantly, the server doesn't learn any information about the content of an email beyond whether this is spam or not. We additionally note that the function $f$ is public to the receiver of $sk_f$.

Having clarified the interface of FE, we can go back to our problem: building a non‑interactive conditional signature printer. Here's a potential sketch.

![FE](https://hackmd.io/_uploads/Bk-ad-1Egg.png)

While we appreciate the non‑interactive property of FE decryption we still have a major issue. FE decryption doesn't allow Alice to additionally inject their input $x=7$. How can the key owner allow for the inputs dynamically chosen by Alice (and, potentially, by many other unknown users)? A naive solution is for the key owner to generate a functional key for any possible input combination. Specifically, for each possible input $x_i$, the key owner defines a function $f_{[x_i]}(k)$ that, on input $k$, returns $f(k, x_i)$ where $x_i$ is hardcoded into the function definition. In that scenario, Alice could use the functional key for $f_{[7]}(k)$ and obtain the decrypted value $f(k, 7)$. But this means that the work of the key owner is exponential to the number of input bits. Are we back to square one? Rather than discouraging ourselves, we see the glass half full: we finally found a way to allow for non‑interactive decryption binded to a specific function set by the key owner. We just need to add a little piece to it...

### Attempt #4 augmented FE (implying iO)

We now imagine a wishful solution: what if the scheme supported an additional API (in blue) that allows Alice to extend the ciphertext provided by the key owner with her dinamically chosen input $x$.

$$
\begin{aligned}
\mathsf{FE.Setup}() &\rightarrow mpk, msk\\
\mathsf{FE.Keygen}(msk, f) &\rightarrow sk_f\\
\mathsf{FE.Enc}(k, mpk) &\rightarrow ct_k\\
\color{blue}{\mathsf{FE.ExtendCT}(ct_k, x)} &\color{blue}{\rightarrow ct_{k || x}}\\
\mathsf{FE.Dec}(ct_{k || x}, sk_f) &\rightarrow f(k, x)
\end{aligned}
$$

Here's the sketch of the application assuming this augemented FE construction

![A_FE](https://hackmd.io/_uploads/ryK9AbJVxx.png)

Success! This solution satisfies all the required properties:

- Alice, and potentially any other user, can obtain the result of $f(k, x)$ without any interaction with the key owner
- The construction is secure as the users nothing more than $f(k, x)$. The definition of $f$ is public but this is not an issue
- No exponential effort is required from the key owner

Before moving forward, we do notice that our interface has become too cluttered and, while cleaning it up, we redefine it as iO!

$$
\begin{aligned}
  % ---------- first group ----------
  \left.
    \begin{array}{l}
      \mathsf{FE.Setup}() \rightarrow mpk, msk\\
      \mathsf{FE.Keygen}(msk, f) \rightarrow sk_f\\
      \mathsf{FE.Enc}(k, mpk) \rightarrow ct_k
    \end{array}
  \right\} &\;\mathsf{iO.Obf}(f(k,\cdot)) \rightarrow \tilde{C}
  \\[8pt]
  % ---------- second group ----------
  \left.
    \begin{array}{l}
      \mathsf{FE.ExtendCT}(ct_k, x) \rightarrow ct_{k \,\|\, x}\\
      \mathsf{FE.Dec}(ct_{k \,\|\, x}, sk_f) \rightarrow f(k, x)
    \end{array}
  \right\} &\;\mathsf{iO.Eval}(\tilde{C}, x) \leftarrow f(k, x)
\end{aligned}
$$

Everything (hopefully) became much cleaner now. iO can be viewed as an extended version of FE that allows a user to inject their inputs bits into the ciphertext. The interface is set to allow an obfuscator (which, in our example, is the key owner) to set a public function $f$ that takes as inputs a secret $k$ and another yet unknown input of fixed size and obtain an obfuscated version $\tilde{C}$ of that program. The obfuscated program can be freely published to the public and any evaluator (such as Alice) with input $x$ can evaluate it to obtain $f(k, x)$.

The final sketch for our non‑interactive conditional signature printer build via iO looks as follows:

![IO](https://hackmd.io/_uploads/B1u0Gf1Elg.png)

The following diagram illustrates the program that we managed to obfuscate. In particular, everything that is inside the dotted rectangle represents our obfuscated program $\tilde{C}$:

- the function definition $f$, made of the set of arithmetic gates to be performed by the program, is public
- the signing key $k$ is private

![Screenshot 2025-06-21 at 10.45.44](https://hackmd.io/_uploads/SJlUSWg4Egg.png)

### Final building blocks

We saw that iO is required to build a non‑interactive conditional signature printer and it can be viewed as an extended version of FE that supports ciphertext extension. Now we can finally sketch out a map of the core primitives needed to build iO, with pointers to the main academic references.

![Screenshot 2025-07-01 at 13.35.47](https://hackmd.io/_uploads/H1fyiNQBlx.png)

To build functional encryption, we heavily rely on the construction introduced by [AKY24a](https://eprint.iacr.org/archive/2024/1719/20241022:040259)[*] which only uses matrix multiplication, [BGG+ encoding](https://www.youtube.com/watch?v=O0NoW4UOd9Y) and [lattice trapdoors](https://eprint.iacr.org/2011/501). Once functional encryption is built, there are different ways to obtain iO which we defined under the umbrella and informal term "augmented FE". Constructions from [AKY24b](https://eprint.iacr.org/2024/1720)[*], [AJ15](https://www.youtube.com/watch?v=4TR_NCSqG4I&t=321s)[**] and [BV15](https://eprint.iacr.org/2015/163.pdf)[**] obtain iO via a recursive usage of FE. This represents the main efficiency bottleneck of current iO constructions. Conversely, our construction [SBP25](https://eprint.iacr.org/2025/236)[*] builds iO from FE using [AKY24a] in a non‑black‑box way allowing us to replace recursive FE with simple matrix multiplications.

[*] The construction builds FE/iO only for pseudorandom functions, which can be extended to iO for functions using the transformation from [BDJ+24](https://eprint.iacr.org/2024/1742.pdf).  
[**] The construction describes how to transform **any** FE scheme for general functions to iO.

## Conclusion

Throughout the sections, we’ve taken a look at various ways to construct a non‑interactive conditional signature printer. Among these attempts, the iO based construction is the only one that strictly satisfies our requirements. Although [we still need to push for its practicality first](https://machina-io.com/posts/hello_world_first.html), we believe iO could unlock applications that were impossible before. We hope you’re as excited as we are about the future possibilities of this technology!
