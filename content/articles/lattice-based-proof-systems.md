---
authors: ["Miha Stopar"]
title: "Lattice-Based Proof Systems"
image: "/articles/lattice-based-proof-systems/lattice-based-proof-systems-cover.webp"
tldr: "This post was written by PSE researcher Miha Stopar."
date: "2025-02-18"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/4OyAht_dHsVT1MgcZTwrK2qJ-bwxpINcpBmLNfF4I2E"
---

Post-quantum cryptography (PQC) is important because it addresses the potential threat posed by quantum computers to classical cryptographic systems.

Quantum computers leverage the principles of quantum mechanics to perform calculations exponentially faster than classical computers in certain cases. Two algorithms, in particular, pose significant threats:

- [Shor's Algorithm](https://en.wikipedia.org/wiki/Shor%27s_algorithm): Efficiently solves integer factorization and discrete logarithm problems, which are the basis of widely used cryptographic protocols like RSA, DSA, and Diffie-Hellman.
- [Grover's Algorithm](https://en.wikipedia.org/wiki/Grover%27s_algorithm): Reduces the security of symmetric-key algorithms by effectively halving the key length (e.g., a 128-bit AES key would offer only 64 bits of security against Grover's algorithm).

If large-scale, fault-tolerant quantum computers become practical, many of today's encryption, digital signature, and key exchange protocols would be rendered insecure.

Lattice-based cryptography is a promising area within modern cryptography. It is likely the most versatile and performant subfield of PQC. For example, the folding scheme [LatticeFold](https://eprint.iacr.org/2024/257.pdf) is believed to be as efficient as the fastest traditional elliptic curve-based folding schemes.

The competing non-lattice PQC zero-knowledge proof systems ([Ligero](https://eprint.iacr.org/2022/1608.pdf), [Aurora](https://eprint.iacr.org/2018/828.pdf)) base their security only on the security of unstructured hash functions, but they suffer from extremely high demands for computational resources.

In this post, we will discuss some of the challenges involved in constructing zero-knowledge proof systems based on lattices. For a more in-depth explanation, please refer to the video by [Vadim Lyubashevsky](https://www.youtube.com/watch?v=xEDZ4tyesMY&t=148s).

## Zero-knowledge proofs based on discrete logarithm

A zero-knowledge proof (ZKP) is a cryptographic protocol that allows one party (the prover) to convince another party (the verifier) that a specific statement is true without revealing any additional information beyond the fact that the statement is true.

Typically, the prover may also wish to demonstrate additional properties of these statements. For instance, suppose the prover wants to prove the knowledge of $x_1$ such that:

$g^{x_1} = h_1$

and the knowledge of $x_2$ such that

$g^{x_2} = h_2$

for some public values $g, h_1, h_2$. Furthermore, the prover would like to prove

$x_1 = u \cdot x_2$

for some $u$.

For the zero-knowledge proof of $x_1$ such that $g^{x_1} = h_1$, the [Schnorr protocol](https://en.wikipedia.org/wiki/Proof_of_knowledge) can be employed (technically, it is an honest-verifier zero-knowledge proof, but we will set this detail aside):

- The prover chooses $y_1$ and sends $t_1 = g^{y_1}$ to the verifier.
- The verifier chooses a challenge $d$ and sends it to the prover.
- The prover sends $z_1 = y_1 + x_1 d$ to the verifier.
- The verifier checks whether $g^{z_1} = t_1 h_1^d$.

![](/articles/lattice-based-proof-systems/image-1.webp)

Now, the protocol can be easily extended to prove the knowledge of $x_2$ such that $g^{x_2} = h_2$. In this case, the prover would also send $t_2 = g^{y_2}$ in the first step and $z_2 = y_2 + x_1 d$ in the third one. The verifier would then check whether $g^{z_2} = t_2 h_2^d$.

![](/articles/lattice-based-proof-systems/image-2.webp)

Note that checking the additional property $x_1 = u \cdot x_2$ is straightforward:

$h_1 = h_2^u$

Also, for instance, if we had $g^{x_3} = h_3$, the linear relation $x_3 = a \cdot x_1 + b \cdot x_2$ is easy to check:

$g^{z_3} = t_3 \cdot (h_1^a h_2^b)^d$

However, the Schnorr protocol is not quantum-safe, as it relies on the discrete logarithm problem, which can be broken by Shor's algorithm. Can we construct similar zero-knowledge proofs using lattices instead?

## Zero-knowledge proofs based on lattices

The discrete logarithm problem is to find $x$ given $g^x$. There is a somewhat analogous problem in the lattice-based cryptography world: the Shortest Integer Solution (SIS) problem.

The system of linear equations

$$Ax = h \pmod{q}$$

where $A \in \mathbb{Z}^{m \times n}_q$ and $h \in \mathbb{Z}^n_q$ can be solved in polynomial time with [Gaussian elimination](https://en.wikipedia.org/wiki/Gaussian_elimination).

But variations of this problem can be hard. For example, when we require that the norm of$x$ is smaller than some bound $B$. Note that the bound needs to be smaller than $q$; otherwise, $(q, 0, ..., 0)$ is a trivial solution.

The SIS problem $SIS(m, n, q, B)$ is the problem of finding $x = (x_1, ..., x_n)$ such that

$$Ax = 0 \pmod{q}$$

and

$$||x|| \leq B$$

Can we do Schnorr-like ZKP for such $x$?

### Schnorr for lattices

Let's have $x_1$ such that

$$Ax_1 = h_1 \pmod{q}$$

and

$$||x_1|| \leq B$$

Would the following protocol work?

![](/articles/lattice-based-proof-systems/image-3.webp)

The last step of the protocol would be verifier checking whether $A z_1 = A y_1 + d A x_1 = t_1 + d h_1$.

However, this would not work. The problem is that $z_1$ might not be short, and if we don't require $z_1$ to be short, the prover could provide $z_1$ such that $A z_1 = t_1 + dh_1$ by using Gauss elimination!

So, $z_1$ needs to be small. To achieve this, $d$ needs to be small as well (note that $z_1 = y_1 + x_1 d$), but on the other hand, we want the challenge space to be large—the larger it is, the better the soundness property. Note that if the prover can guess the challenge $d$, the prover sets the first message to $g^y (g^s)^{-d} $ and the last one to $z_1 = y - s d + s d = y$.

This is one of the reasons why the ring $\mathbb{Z}_q[x]/(x^n + 1)$ is used—it provides a larger set of elements with small norm this way (polynomials with small coefficients, as opposed to small integers).

In the last step, the verifier must verify whether $z_1$ is small as well.

However, that's not the end of the problems with the lattice-based version of Schnorr.

Now, if this is a proof of knowledge of $x$, we can extract the value $x$ from the prover. This is typically done by rewinding: we run the prover as a black box twice and obtain two transcripts: $y$, $d_1$, $z_1 = y + x d_1$ and $y$, $d_2$, $z_2 = y + x d_2$. We get:

$z_2 - z_1 = x(d_2 - d_1)$

In the Schnorr algorithm, one can simply compute

$x = \frac{z_2 - z_1}{d_2 - d_1}$

to obtain the secret $x$ such that $g^x = h$. Using lattices, we obtain $x$ (we can assume $d_2 - d_1$ is invertible) such that $Ax = h$. However, again, $x$ might not be small!

Thus, using lattices, one can only extract $\bar{z}$ such that

$A \bar{z} = \bar{d} h$

where $\\bar{z} = z\_2 - z\_1 $ and $\bar{d} = d_2 - d_1$.

Note that the value $\bar{z}$ is still small (though not as small as $x$), and given $A$ and $h$, it is still hard to get such $\bar{z}$ and $\bar{d}$.

In what follows, you will see how the extractor, which returns "only" $\bar{z}$, can still be utilized to construct lattice-based proof systems.

### Lattice-based commitment scheme

One of the key steps in the development of lattice-based proof systems was the publication of the paper [More Efficient Commitments from Structured Lattice Assumptions](https://eprint.iacr.org/2016/997.pdf). The commitment scheme described in the paper proceeds as follows.

#### Key generation

The key generation returns $\bf{A}_1 \in R_q^{n \times k}$ and $\bf{A}_2 \in R_q^{l \times k}$ as

$\mathbf{A}_1 = [\mathbf{I}_n | \mathbf{A}_1']$

$\mathbf{A}_2 = [\mathbf{0}^{l \times n} | \mathbf{I}_l | \mathbf{A}_2']$

where $\mathbf{A}_1'$ is random from $R_q^{n \times (k-n)}$ and $\mathbf{A}_2'$ is random from $R_q^{n \times (k-n-l)}$.

#### Commitment

To commit to $\mathbf{x} \in R_q^l$, we choose a random polynomial vector $\mathbf{r}$ with a small norm and output the commitment

$Com(\mathbf{x}, \mathbf{r}) := \begin{pmatrix} \mathbf{c}_1 \\ \mathbf{c}_2 \end{pmatrix} = \begin{pmatrix} \mathbf{A}_1 \\ \mathbf{A}_2 \end{pmatrix} \cdot \mathbf{r} + \begin{pmatrix} \mathbf{0}^n \\ \mathbf{x} \end{pmatrix}$

#### Opening

A valid opening of a commitment

$\begin{pmatrix} \mathbf{c}_1 \\ \mathbf{c}_2 \end{pmatrix}$

is a 3-tuple consisting of $\mathbf{x} \in R_q^l$, $r = \begin{pmatrix} \mathbf{r}_1 \ ... \ \mathbf{r}_k \end{pmatrix} \in R_q^k$, and $f \in \bar{C}.$

The verifier checks that:

$f \cdot \begin{pmatrix} \mathbf{c}_1 \\ \mathbf{c}_2 \end{pmatrix} = \begin{pmatrix} \mathbf{A}_1 \\ \mathbf{A}_2 \end{pmatrix} \cdot \mathbf{r} + f \cdot \begin{pmatrix} \mathbf{0}^n \\ \mathbf{x} \end{pmatrix}$

#### Proof of opening

![](/articles/lattice-based-proof-systems/image-4.webp)

Note that the opening for this commitment schemes is not simply $\mathbf{r}$ and $\mathbf{x}$; it also includes a polynomial $f \in \bar{C}.$ This is due to the issue with the extractor described above.

The extractor needs to return the triple $\mathbf{x}, \mathbf{r}, f$ such that:

$f \cdot \begin{pmatrix} \mathbf{c}_1 \\ \mathbf{c}_2 \end{pmatrix} = \begin{pmatrix} \mathbf{A}_1 \\ \mathbf{A}_2 \end{pmatrix} \cdot \mathbf{r} + f \cdot \begin{pmatrix} \mathbf{0}^n \\ \mathbf{x} \end{pmatrix}$

Such a triple can be obtained through rewinding:

$\mathbf{z}_2 - \mathbf{z}_1 = (d_2 - d_1) \mathbf{r}$

Then we have:

$\mathbf{A}_1 (\mathbf{z}_2 - \mathbf{z}_1) = (d_2 - d_1) \mathbf{A}_1 \mathbf{r} = (d_2 - d_1) \mathbf{c}_1$

$\mathbf{A}_1 \bar{\mathbf{z}} = f \mathbf{c}_1$

where $\bar{\mathbf{z}} = \mathbf{z}_2 - \mathbf{z}_1$ and $f = d_2 - d_1$.

Thus, instead of having $\mathbf{A}_1 \mathbf{r} = \mathbf{c}_1$, we have $\mathbf{A}_1 \bar{\mathbf{z}} = f \mathbf{c}_1$.

We extract the message $\mathbf{x}_f$ as:

$\mathbf{x}_f = \mathbf{c}_2 −f^{-1} ·\mathbf{A}_2 ·r$

The extracted triple is $\mathbf{x}_f, \mathbf{\bar{z}}, f$. It can be easily seen ($\mathbf{\bar{z}} = f \mathbf{r}$):

$f \cdot \begin{pmatrix} \mathbf{c}_1 \\ \mathbf{c}_2 \end{pmatrix} = \begin{pmatrix} \mathbf{A}_1 \\ \mathbf{A}_2 \end{pmatrix} \cdot \mathbf{\bar{z}} + f \cdot \begin{pmatrix} \mathbf{0}^n \\ \mathbf{x}_f \end{pmatrix}$

## Conclusion

Since the commitment scheme described above, there have been many new improvements in the field of lattice-based zero-knowledge proofs. So expect some new material describing lattice-based and other post-quantum cryptographic schemes soon :). At PSE, we are committed to staying at the forefront of this rapidly evolving field by continuously following and testing the latest advancements in post-quantum cryptography. Our goal is to ensure that we are well-prepared for the challenges and opportunities that come with the transition to quantum-safe systems.
