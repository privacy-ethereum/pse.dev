---
authors: ["Miha Stopar"]
title: "Are elliptic curves going to survive the quantum apocalypse?"
image: "/articles/are-elliptic-curves-going-to-survive-the-quantum-apocalypse/cover.webp"
tldr: "Quantum computers will shatter today’s elliptic-curve schemes (and the pairing magic built on them), but curves aren’t dead: isogeny-based constructions could keep elliptic-style crypto alive and even pave the way for stronger multilinear tools in a post-quantum world."
date: "2025-05-20"
---

Elliptic curves offer unmatched cryptographic power, especially with [pairings](https://en.wikipedia.org/wiki/Pairing-based_cryptography) that enable advanced protocols like identity-based encryption and short signatures. But quantum computers threaten this entire ecosystem by breaking the discrete logarithm problem—on which these schemes depend.

However, elliptic curves might retain their place in cryptography after all—through entirely different assumptions.

## A happy coincidence: the magic of pairings on elliptic curves

Elliptic curves are wonderful—no other area of mathematics combines cryptographic versatility with computational efficiency so effectively. Just think of pairings—you can do all kinds of things with pairings. You can construct identity-based encryption, build short signatures, enable non-interactive zero-knowledge proofs, or design functional encryption schemes. It's a beautiful intersection of theory and practice, where abstract concepts translate directly into cutting-edge protocols.

The fact that pairings can be defined on elliptic curves—which were already a highly attractive setting for cryptography even before pairings came into use—is, as one of the pioneers of pairing-based cryptography, Ben Lynn, [put it](https://static1.squarespace.com/static/5fdbb09f31d71c1227082339/t/5ff394720493bd28278889c6/1609798774687/PairingsForBeginners.pdf), a “happy coincidence”.

Pairings are special bilinear maps defined on groups derived from elliptic curves or higher-dimensional abelian varieties. A typical pairing has the form:

$$
e: G_1 \times G_2 \to G_T
$$

where $G_1$, $G_2$, and $G_T$ are groups of the same prime order $p$. There’s one crucial property of pairings, called bilinearity:

$$
e(aP, bQ) = e(P, Q)^{ab}.
$$

Pairings allow one to perform certain operations on hidden exponents without solving the discrete logarithm.

Suppose you have:

$$
A = aP \in G_1
$$

$$
B = bQ \in G_2
$$

You cannot recover $a$ or $b$ ([discrete logatihm](https://en.wikipedia.org/wiki/Discrete_logarithm) is hard), but using a bilinear pairing, you can compute:

$$
e(A, B) = e(aP, bQ) = e(P, Q)^{ab}
$$

This means that although $a$ and $b$ are hidden, you can compute something that depends on their product—without knowing either value individually.

## Will quantum computers kill the magic of elliptic curves?

So, is all this magic set to _die_ with the advent of quantum computers?

Given two points $P$ and $R$ on an elliptic curve, a quantum computer can efficiently compute an integer $\ell$ such that $\ell P = R$, if such an $\ell$ exists. This task—known as the discrete logarithm problem—is believed to be hard for classical computers, and the security of virtually all elliptic curve cryptography depends on that hardness.

But with a sufficiently powerful quantum computer, this problem becomes efficiently solvable using [Shor’s algorithm](https://en.wikipedia.org/wiki/Shor%27s_algorithm). And that means most of the elegant constructions enabled by elliptic curves would no longer be secure.

Will pairings be lost as well?

Unfortunately, yes. Pairing-based cryptography relies on the discrete logarithm problem being hard (in all three groups: $G_1$, $G_2$, and $G_T$).

So yes, my friend. _You should be sad that elliptic curve cryptography is going to be buried._

## Unless...

However, there’s a branch of elliptic curve cryptography that might just survive the apocalypse.

Isogeny-based cryptography is a post-quantum alternative that still relies on elliptic curves—but in a very different way. Instead of depending on the hardness of the discrete logarithm problem, it leverages the difficulty of finding isogenies: special maps between elliptic curves.

![genus-1](https://hackmd.io/_uploads/S1Chdpybee.png)

This means that, given two elliptic curves, computing an explicit isogeny between them is believed to be computationally hard—even for a quantum computer.

Yeah, you might mention [Castryck-Decru attack](https://eprint.iacr.org/2022/975), but as I wrote [last time](https://pse.dev/en/blog/code-optimizations-in-the-landscape-of-post-quantum-cryptography), this applies only to certain special isogeny-based schemes.

In fact, this attack has opened up many constructive possibilities. The techniques developed in the attack have been leveraged to construct new schemes. This situation mirrors the early history of pairing-based cryptography. Initially, pairings were used as part of an attack against traditional Diffie–Hellman key exchange schemes, but over time, they have become a cornerstone of many constructive cryptographic protocols, such as identity-based encryption and short signatures.

The attack triggered a major shift toward higher-dimensional constructions in this area of cryptography. Elliptic curves are simply one-dimensional abelian varieties—that is, genus 1. Moving to higher dimensions means working with more general abelian varieties, such as those of genus 2 or 3, which possess richer algebraic structure.

![genus-2](https://hackmd.io/_uploads/rJPP_TJ-eg.png)

But besides the shift to higher dimensions, the field experienced another major transformation—this time toward the theta model.

A theta model is an alternative coordinate system for describing abelian varieties. Over the complex numbers, every (principally polarized) abelian variety of dimension $g$ can be analytically represented as a complex torus $\mathbb{C}^g / \Lambda$, where $\Lambda$ is a rank-$2g$ lattice. Associated to this lattice are special transcendental functions called theta functions, which capture the geometry of the variety. Instead of working with explicit algebraic equations for curves, one can describe the variety using theta constants—the evaluations of theta functions at specific points—which serve as coordinates in the theta model.

![theta](https://hackmd.io/_uploads/BkjRopJ-le.png)

Yeah, this sounds awfully abstract. Essentially, it means we’re trading the familiar equation of an elliptic curve—like $y^2 = x^3 + ax + b$—for a more mysterious object: a theta function, as shown in the picture.

The funny thing is, this abstract creature actually allows for [simple and compact formulas](https://eprint.iacr.org/2023/1747.pdf) when it comes to computing isogenies.

To evaluate the image of a point under the isogeny—that is, to determine where a given point is mapped—one simply performs three basic operations: squaring, a Hadamard transformation (a linear transformation), and scaling:

![formula](https://hackmd.io/_uploads/ByroJC1-gx.png)

The theta model significantly accelerates isogeny-based cryptography in higher dimensions. But what’s even more intriguing is the possibility that abelian varieties—and the theta machinery—could one day enable [trilinear maps](https://hal.science/tel-03498268/document). And you know, trilinear maps are bilinear maps on steroids.

A trilinear map is a function

$$
e : G_1 \times G_2 \times G_3 \to G_T
$$

where all groups have the same prime order $p$, satisfying the following property:

$$
e(aP, bQ, cR) = e(P, Q, R)^{abc}
$$

Trilinear maps are strictly more powerful than bilinear maps because they generalize the same core idea—exponent multiplication—across an additional dimension. That opens the door to even richer and more expressive cryptographic constructions.

## Conclusion

While abelian varieties offer a tantalizing prospect for realizing trilinear maps, the truth is—we’re not there yet. No known construction of trilinear maps is practical today, whether based on abelian varieties or any other mathematical structure. Still, the outlook is far from bleak.

Abelian varieties, and the isogeny-based cryptography they enable, present a promising foundation for quantum-resistant cryptographic protocols. They carry forward the essential magic of elliptic curves—not merely as a relic of the past, but as a richer, higher-dimensional generalization.
