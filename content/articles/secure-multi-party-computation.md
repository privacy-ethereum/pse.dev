---
authors: ["Brechy"]
title: "Secure Multi-Party Computation"
image: "/articles/secure-multi-party-computation/secure-multi-party-computation-cover.webp"
tldr: "This post was written by [Brechy](https://github.com/brech1). Thanks [Nam Ngo](https://github.com/namnc) for the feedback and review!"
date: "2024-08-06"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/v_KNOV_NwQwKV0tb81uBS4m-rbs-qJGvCx7WvwP4sDg"
tags:
  [
    "mpc",
    "secure multi-party computation",
    "privacy",
    "cryptography",
    "garbled circuit",
    "secret sharing",
    "oblivious transfer",
    "security",
    "circuits",
    "threshold cryptography",
  ]
projects: ["mpz", "tlsn", "mpc-framework"]
---

Secure multi-party computation (MPC) enables a group of participants to collaborate on a specific task that requires their data as input, ensuring the privacy of their inputs and the correctness of the output.

![](/articles/secure-multi-party-computation/Kek3E-J1uGuMT7Cj-SYqo.webp)

This allows performing operations on private information without disclosing it or involving a trusted third party. The only data each party receives is the function's result.

There are several MPC protocols. This post provides an overview of the most general concepts and tools shared by many of them.

## Introduction

MPC enables multiple parties to collaborate on a specific function without revealing their private data to one another. This ensures that no single party can access the data of others. The participants agree on a particular task or function to perform, and then use an MPC protocol to collectively determine the result.

We can think of a sample use case of managing the private keys of an Ethereum account:

- A set of participants is each given a segment of the secret key.
- Using an MPC protocol, they can input their segments and run the protocol to execute the signature function.

No single participant can sign a transaction unless **all or a sufficient number** of participants input their secret key segments, and no participant has enough information to reconstruct the secret key.

## Protocol Scope

MPC protocols can be categorized based on the functions they are designed to run, falling into two main categories: generic and specialized.

### Specialized Protocols

Specialized protocols are designed and optimized for a specific functionality. These protocols are built around a specific task, like Private Set Intersection (PSI) or voting. Specialized protocols leveraging the specific structure of a function can offer significant performance improvements.

### Generic Protocols

Generic protocols can compute any function that can be represented as a fixed-size circuit. Yao's Garbled Circuits protocol is an example of a generic protocol. They can be applied to a wide range of problems.

## Secure Protocol Requirements

We can use the following properties to help us define an **ideal** secure protocol:

- **Privacy:** No party should learn anything more than the function output.
- **Correctness:** Each party is guaranteed to receive the correct output.
- **Independence of Inputs:** Every party can decide its input independently of other parties.
- **Guaranteed Output Delivery:** No party can prevent other parties from receiving the function output.
- **Fairness:** If one party receives the function output, every party will receive the output.

These guarantee the correctness of the output and ensure that no party can disrupt the process or gain an unfair advantage. However, additional measures are needed to ensure input integrity and protect the output from giving away information.

### Input Integrity

Participants can input any value, potentially manipulating the process. For instance, in an auction, a participant could falsely input an extremely high bid to ensure they win, even though their actual bid is much lower. To mitigate this, mechanisms like requiring signed inputs verified can be used, though this can increase computational costs.

### Result Information

The process result could reveal information about the inputs or the participants. Using the auction example, if the final highest bid is revealed, other participants can infer details about the highest bidder's strategy or budget.

## Use Cases

Let's explore some real world use cases.

### Privacy Preserving Machine Learning

It's possible to enhance privacy during the machine learning training and inference phases. During training, multiple parties can collaboratively train a model without disclosing their individual datasets. For inference, it can ensure that both the client's input data and the server's model remain confidential. This allows clients to receive model outputs without exposing their data and ensures that the provider's model remains private.

### Threshold Cryptography

Companies can enhance key protection by distributing key shares across multiple secure environments. This ensures that no single location holds the entire private key, reducing the risk of key compromise. An adversary would need to breach all environments to access the complete key. This protects cryptographic keys, secures authentication processes and enforces signature approval policies.

### Collaborative Data Analysis

Multiple parties can combine and analyze datasets without disclosing private information. Organizations can securely integrate various records to study trends while adhering to privacy regulations. This application enables data analysis without compromising confidentiality.

## Circuits

Many protocols use a circuit to represent the function being computed. The circuit's structure and operations remain constant and are not influenced by user inputs. As a result, the runtime of the protocol does not disclose any information about the inputs.

![](/articles/secure-multi-party-computation/02PrsVGP55vTaEOeac28r.webp)

A simple circuit:

$Output = ((A + B) * (C + D)) + E$

These circuits can be either **boolean** circuits that process binary variables using logic gates, or **arithmetic** circuits that perform operations on numerical values.

Boolean circuits need to redefine basic operations for **every bit width**: supporting arithmetic on n-bit integers in such a protocol requires implementing n-bit addition and multiplication circuits.

Arithmetic circuits typically operate over a finite field, where the size of the field is set in advance. Although arithmetic circuits are primarily designed for arithmetic operations, non-arithmetic operations such as comparisons and equality checks can also be implemented.

Expressing the target computation as a circuit can be challenging since not every function can be easily converted into a circuit format, but compilers can be used for this. However, every function must be deterministic and free of indefinite loops.

A compiler converts a program written in a specialized, high-level language to an intermediate representation (often a circuit). The circuit is then passed as input to a runtime, which executes an MPC protocol and produces an output.

Let's consider an example where our function performs matrix element-wise multiplication, and our input and output are 2x2 matrices. We can use Circom and the [circom-2-arithc](https://github.com/namnc/circom-2-arithc/) compiler to create our circuit.

```js
template matrixElementMul (m,n) {
    signal input a[m][n];
    signal input b[m][n];
    signal output out[m][n];

    for (var i=0; i < m; i++) {
        for (var j=0; j < n; j++) {
            out[i][j] <== a[i][j] * b[i][j];
        }
    }
}

component main = matrixElementMul(2,2);
```

The compiled circuit will consist of four arithmetic multiplication gates:

```json
[
  { "op": "AMul", "lh_in": 0, "rh_in": 4, "out": 8 },
  { "op": "AMul", "lh_in": 1, "rh_in": 5, "out": 9 },
  { "op": "AMul", "lh_in": 2, "rh_in": 6, "out": 11 },
  { "op": "AMul", "lh_in": 3, "rh_in": 7, "out": 10 }
]
```

### Circuit Diagram

![](/articles/secure-multi-party-computation/0n_GrMSZOLlaK9QmICESR.webp)

For this example, it might have been quicker to manually construct the gates. However, we now have a function that can serve as a building block for actual matrix multiplication or more complex operations.

## Oblivious Transfer

Oblivious transfer (OT) is a cryptographic two-party protocol. It allows the receiving party to [obliviously](https://www.oxfordlearnersdictionaries.com/definition/english/obliviously) select one of the sending party's inputs . The protocol's privacy guarantees ensure that the sender does not learn the choice of the receiver and the receiver does not learn the non selected inputs.

Let's review a basic example, the **1-out-of-2 oblivious transfer**. In this protocol, the sender has two messages, 𝑚 0 and 𝑚 1 . The receiver wants to learn one of these messages, 𝑚 𝑏 , without the sender knowing which message was chosen.

![](/articles/secure-multi-party-computation/C-_iyr8RuoKAaFhMwSU-h.webp)

1-out-of-2 Oblivious Transfer protocol

- Initialization:

  - The sender has two messages: 𝑚 0 and 𝑚 1 .
  - The receiver wants to choose one of these messages, indexed by 𝑏 , where 𝑏 ∈ { 0 , 1 } .

- Communication Phase:

  - The receiver generates a pair of public and secret keys ( 𝑝 𝑘 , 𝑠 𝑘 ) .
  - The receiver sends 𝑝 𝑘 to the sender.
  - The sender encrypts 𝑚 0 and 𝑚 1 using 𝑝 𝑘 in such a way that only the selected message 𝑚 𝑏 can be decrypted by the receiver using the secret key 𝑠 𝑘 .

- Transfer Phase:

  - The sender sends the encrypted messages to the receiver. The receiver uses 𝑠 𝑘 to decrypt the chosen message 𝑚 𝑏 .

- This way we ensure that data privacy is maintained:

  - The receiver learns only the chosen message 𝑚 𝑏 and nothing about the other message 𝑚 1 − 𝑏
  - The sender does not learn which message the receiver chose.

## Garbled Circuits

Garbled circuits (GCs) were introduced by Andrew Yao in the 1980s as a technique for secure **two-party computation (2PC)**. The GC protocol involves two parties, the garbler and the evaluator, who work together to securely evaluate a function represented as a Boolean circuit. The function consists of AND and XOR gates, and each party contributes part of the input.

![](/articles/secure-multi-party-computation/SiLbmmhQPfgfdjITGQnAA.webp)

_Garbled Circuit protocol_

Here's a step-by-step overview of how the GC protocol works for a simple circuit.

### Circuit

Our circuit will be constructed with only one AND gate. The truth table shows the output for all possible input combinations:

![](/articles/secure-multi-party-computation/xoTM5PYnM42abFV5xDvtn.webp)

### Garbling

Garbling is a process by which the truth table is obfuscated. The garbler picks four random strings, or **labels:**

![](/articles/secure-multi-party-computation/slKxMPXbpepuMk2KINjc0.webp)

The garbler then uses every pair of labels corresponding to a possible scenario to encrypt the output corresponding to that scenario.

![](/articles/secure-multi-party-computation/Br-ye9lyqq6ZKWEhqRjz7.webp)

The two relevant labels are put through a key derivation function 𝐻 to derive a symmetric encryption key, and that key is used to encrypt 𝑎 ∧ 𝑏 . Then the garbled gate consists of the four resulting ciphertexts, in a random order.

![](/articles/secure-multi-party-computation/qbwHH7Sb-pjnwWJf3m4es.webp)

### Evaluation

Once the evaluator receives the garbled gate, it needs to decrypt exactly one ciphertext: the one corresponding to the real values 𝑎 and 𝑏 , encrypted with $H(W_{a}^A, W_{b}^B)$.

In order to do this, it needs to receive from the garbler $W_{a}^A$ and $W_{b}^B$.

Since the garbler knows 𝑎 , he can send the evaluator $W_{a}^A$. The labels are all random, independent, and identically distributed, so the evaluator won't learn anything about 𝑎 from $W_{a}^A$

However, getting $W_{b}^B$ to the evaluator is harder. The garbler can't send both $W_{0}^B$ and $W_{1}^B$ to the evaluator because that will allow them to decrypt two ciphertexts in the garbled gate. Similarly, the evaluator can't simply ask for the one they want because they don't want the garbler to learn 𝑏 .

So, the garbler and the evaluator use Oblivious Transfer, which allows the evaluator to learn only $W_{b}^B$ without revealing 𝑏 to the garbler.

Note that in order for this to work, the evaluator needs to know when decryption succeeds and when it doesn't. Otherwise, there's no way for them to know which ciphertext yields the correct answer.

### Example Walkthrough

Let's create an example walkthrough for the case where the garbler's input is $a = 0$ and the evaluator's input is $b = 1$.

1.  **Initialization**:

    - Garbler generates labels for inputs $a$ and $b$.
    - Garbler creates and transfer the garbled circuit.

2.  **Input Label Distribution**:

    - Garbler sends $W_{0}^A$ to evaluator (since $a = 0$).

3.  **Oblivious Transfer**:

    - Evaluator uses Oblivious Transfer to receive $W_{1}^B$ (since $b = 1$).

4.  **Evaluation**:

    - Evaluator uses the keys $W_{0}^A$ and $W_{1}^B$ to decrypt the corresponding entry in the garbled table:
    - $Enc(H(W_{0}^A, W_{1}^B), W_{0}^{out}) \rightarrow W_{0}^{out}$

5.  **Output Reconstruction**:

    - Evaluator maps the decrypted key $W_{0}^{out}$ to the output value 0.

## Secret Sharing

Secret sharing is an approach for distributing a secret value using **shares** that separately do not reveal any information about the secret. The secret value can only be reconstructed if all or a sufficient number of shares are combined.

Let's review how **Additive Secret Sharing** works, in an example involving 3 participants and an addition operation. In this scheme, the secret is divided into $m$ parts, and the secret can only be reconstructed when all parts are combined.

### Secret Splitting

- Choose a secret value.

  - $S = 1337$

- Choose $m-1$ random numbers as shares.

  - $m = 3$
  - $S_1 = 220$
  - $S_2 = 540$

- Calculate the final share $S_3$.

  - $S = S_1 + S_2 + S_3$
  - $S_3 = S - (S_1 + S_2) = 1337 - (220 + 540) = 577$

Let's split another secret to perform an addition:

- $T = 1440$

  - $T_1 = 118$
  - $T_2 = 330$
  - $T_3 = 992$

Distribute the shares to the participants.

- Participant 1: $S_1$ and $T_1$
- Participant 2: $S_2$ and $T_2$
- Participant 3: $S_3$ and $T_3$

### Perform Operation

Each participant can perform the addition locally.

- $R_1 = S_1 + T_1 = 220 + 118 = 338$
- $R_2 = S_2 + T_2 = 540 + 330 = 870$
- $R_3 = S_3 + T_3 = 577 + 992 = 1569$

### Secret Reconstruction

Reconstruct the result from the shares:

- $R = S + T$
- $R = (S_1 + S_2 + S_3) + (T_1 + T_2 + T_3) = (S_1 + T_1) + (S_2 + T_2) + (S_3 + T_3)$
- $R = 338 + 870 + 1569 = 2777$

Since operations on secret-shared numbers produce secret-shared numbers, they can be executed one after the other and create more complex functions. This way, any function given as a circuit can be evaluated on secret-shared numbers:

- The secret inputs of the parties are secret-shared between them.
- The circuit is evaluated, gate by gate, using secret-shared numbers.
- The output is reconstructed from the final shares.

**Reconstruction only happens at the end.** In all previous steps, parties work with their own shares, so as not to reveal anything about the secret inputs.

## Security Implications

**No single party can be inherently trusted.** Parties interact with each other through the protocol and this outlines the expected behaviors and communications for each participant. The protocol specifies the actions to take at each step, including what messages to send, to whom, and when to stop.

Adversaries can **corrupt** parties at any stage of the process. Depending on the threat model, corrupted parties might either follow the protocol or deviate from it:

- **Semi-honest (Honest-but-curious)**: These adversaries corrupt parties but follow the protocol as specified. While they execute the protocol honestly, they try to learn as much as possible from the messages they receive from other parties.
- **Malicious (Active)**: These adversaries may cause corrupted parties to deviate from the protocol.

In terms of security guarantees, we can classify protocols in:

- Protocols guaranteeing security in the presence of an **honest majority**
- Protocols guaranteeing security against an **arbitrary number of corrupted parties**

Protocols of the first type are generally more **efficient** than those of the second type, even in hybrid models that implement ideal cryptographic primitives such as oblivious transfer. However, the second type of protocols offers a significant qualitative advantage, as they provide security without requiring any trust among parties. This is especially important in secure **two-party computation**.

## Performance

Despite the demand for this technology, its practical adoption remains limited. This limitation is mainly due to the efficiency challenges associated with the underlying protocols. Although generic protocols have been known for over 30 years, they were largely theoretical and too inefficient for practical use.

Two key factors impact performance: **communication** and **computation**.

### Communication

This includes the volume of data exchanged and the number of communication rounds required.

- **Data Volume**: Total size of messages exchanged between parties during the protocol execution.
- **Communication Rounds**: Number of back-and-forth message exchanges required to complete the protocol.

### Computation

Refers to the amount of processing power required. The key factors here are the **complexity** and the **number** of cryptographic operations.

As evidenced by the results in \[[1](https://www.net.in.tum.de/fileadmin/TUM/NET/NET-2019-06-1/NET-2019-06-1_02.pdf)\], MPC is feasible for intranet applications with **limited peers, low latency, and high transmission rates**. However, it faces significant execution time increases under less optimal conditions. Specifically:

- **Transmission Rate**: Lower transmission rates lead to notable execution time delays.
- **Number of Peers**: An increase in the number of peers results in longer execution times.
- **Network Latency**: Even small delays in network latency can cause **substantial** increases in execution time.

Therefore, while real-time applications of MPC currently seem unfeasible, use cases with softer time constraints or faster infrastructure remain viable.

## Programmable Cryptography

MPC can be integrated with zero-knowledge proofs and fully homomorphic encryption to enhance security and functionality. Consider exploring the following resources on the [PSE Blog](https://mirror.xyz/privacy-scaling-explorations.eth/):

- [Zero to Start: Applied Fully Homomorphic Encryption](https://mirror.xyz/privacy-scaling-explorations.eth/D8UHFW1t48x2liWb5wuP6LDdCRbgUH_8vOFvA0tNDJA)
- [Beyond Zero-Knowledge: What's Next in Programmable Cryptography?](https://mirror.xyz/privacy-scaling-explorations.eth/xXcRj5QfvA_qhkiZCVg46Gn9uX8P_Ld-DXlqY51roPY)

## Conclusion

Secure multi-party computation is a powerful cryptographic tool that allows multiple parties to work together on a function without revealing their private data. Despite its potential, practical use has been slow due to issues like high communication costs and intense computational needs. However, as technology improves and protocols are refined, MPC applications are growing. This technology is key for enabling secure, distributed computation and data analysis in our increasingly connected digital world.

## Resources

These are some MPC projects we're building at [PSE](https://pse.dev/):

- [mpz](https://github.com/privacy-scaling-explorations/mpz): Collection of multi-party computation libraries written in Rust :crab:.
- [tlsn](https://github.com/tlsnotary/tlsn): Data provenance and privacy with secure multi-party computation.
- [mpc-framework](https://github.com/voltrevo/circom-2-arithc-ts): Circom to Arithmetic Circuit compiler TypeScript library.

And this is a great list of software libraries and frameworks to start building:

- [awesome-mpc](https://github.com/rdragos/awesome-mpc?tab=readme-ov-file#software)

## References

1.  Dickmanns Ludwig and von Maltitz Marcel. "Performance of Secure Multiparty Computation." [PDF](https://www.net.in.tum.de/fileadmin/TUM/NET/NET-2019-06-1/NET-2019-06-1_02.pdf), 2019.
2.  Escudero Daniel. "An Introduction to Secret-Sharing-Based Secure Multiparty Computation." [PDF](https://eprint.iacr.org/2022/062.pdf), 2022.
3.  Evans David, Kolesnikov Vladimir, and Rosulek Mike. "A Pragmatic Introduction to Secure Multi-Party Computation." [PDF](https://securecomputation.org/docs/pragmaticmpc.pdf), 2018.
4.  Hastings Marcella, Hemenway Brett, Noble Daniel, and Zdancewic Steve. "SoK: General Purpose Compilers for Secure Multi-Party Computation." [PDF](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8835312), 2019.
5.  Ishai Yuval, Prabhakaran Manoj, and Sahai Amit. "Founding Cryptography on Oblivious Transfer – Efficiently." [PDF](https://iacr.org/archive/crypto2008/51570574/51570574.pdf), 2008.
6.  Lindell Yehuda. "Secure Multiparty Computation (MPC)." [PDF](https://eprint.iacr.org/2020/300.pdf), 2020.
7.  Mann Zoltán Ádám, Weinert Christian, Chabal Daphnee, and Bos Joppe W. "Towards Practical Secure Neural Network Inference: The Journey So Far and the Road Ahead." [PDF](https://eprint.iacr.org/2022/1483.pdf), 2022.
8.  Yakoubov Sophia. "A Gentle Introduction to Yao's Garbled Circuits." [PDF](https://web.mit.edu/sonka89/www/papers/2017ygc.pdf), 2017.
