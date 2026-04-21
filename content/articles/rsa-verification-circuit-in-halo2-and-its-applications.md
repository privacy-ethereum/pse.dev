---
authors: ["Sora Suegami"]
title: "RSA Verification Circuit in Halo2 and its Applications"
image: null
tldr: "This post was authored by grantee **Sora Suegami** ([Twitter](https://twitter.com/SoraSue77), [Github](https://github.com/SoraSuegami))"
date: "2022-11-14"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/mmkG4uB2PR_peGucULAa7zHag-jz1Y5biZH8W6K2LYM"
tags:
  [
    "rsa",
    "halo2",
    "zero-knowledge proofs",
    "cryptography",
    "circuits",
    "security",
    "zkp",
    "modular exponentiation",
    "digital signatures",
  ]
projects: ["pse-halo2", "zk-email"]
---

## Introduction

We released an RSA verification circuit compatible with the [halo2 library developed by the privacy-scaling-explorations team](https://github.com/privacy-scaling-explorations/halo2). It allows halo2 developers to write circuits to verify RSA-based cryptographic schemes such as RSA signature, RSA accumulator, and [verifiable delay function based on groups of unknown order](https://eprint.iacr.org/2018/623.pdf). This post describes the background design and its applications.

Github repo: [halo2-rsa](https://github.com/SoraSuegami/halo2_rsa)

## Circuit Specification

Our circuit supports verification of the RSA relationship, i.e., ***x*ᵉ mod _n_** for the integer _**x**_ and RSA public key (_**n,e**_). At a high level, it provides the following three functions.

1.  Modular exponentiation It takes as inputs the integer _**x**_ and the RSA public key (_**n,e**_), outputs an integer ***x*ᵉ mod _n_**
2.  Modular exponentiation with fixed _**e**_

    Its functionality is equivalent to that of the first one, except that the exponent integer _**e**_ is fixed in advance.

3.  Pkcs1v15 signature verification.  
    It takes as inputs the pkcs1v15 signature _**c**_, the RSA public key (_**n,e**_), and the signed message _**m**_, makes constraints to verify that _**c**_ is a valid signature for (_**n,e**_) and _**m**_. Note that pkcs1v15 is a specification of the RSA signature defined in [RFC3447](https://www.rfc-editor.org/rfc/rfc3447).

The above functions were developed with reference to the [circom-rsa-verify repository](https://github.com/zkp-application/circom-rsa-verify), which contains a circuit for pkcs1v15 signature verification in the [circom language](https://docs.circom.io/). It first defines a circuit for modular multiplication of big integers, that is to say, integers whose size is larger than that of the native field of the arithmetic circuit, and then verifies the signature by computing modular exponentiation with that circuit. We took a similar approach for our circuits. In addition, the range check, the verification of whether a given integer is within a certain range, was optimized with a lookup table.

Specifically, the constraints for the big integer computation is defined as follows.

## Big Integer Computations on the Circuit

A big integer is represented by multiple values in the native field of the arithmetic circuit, each value being called a limb. It is classified into two types: **Fresh type** and **Muled type**. The former type is assigned to the big integers that have not yet been multiplied, while the latter type is assigned after multiplication. We distinguish them to manage the maximum value of the limbs; the limbs of the Fresh type big integer must fit into _**w**_\-bit, and those of the Muled type may overflow it.

For example, we consider a 2048-bit big integer that consists of 32 64-bit limbs. The big integer has the Fresh type when newly allocated on the circuit, and its limb value is less than _**2⁶⁴**_. When two big integers are added or subtracted, the resulting big integer has the Fresh type, and only the number of limbs is modified. However, in multiplication, the output big integer has Muled type, whose limb can be larger than _**2⁶⁴-1**_.

This is because the big integer multiplication is computed in the same way as polynomial multiplication. Formally, for two big integers _**a = a₀x⁰ +**_ _**a₁x¹ + ⋯ + a₃₁x³¹**_ and _**b₀x⁰ +**_ _**b₁x¹ + ⋯ +b₃₁x³¹**_, where _**x=2⁶⁴**_, their multiplication is defined as follows.

![](/articles/rsa-verification-circuit-in-halo2-and-its-applications/ZdsDrBBUuNyHcZNu76dVj.webp)

To convert the Muled type big integer back into the Fresh type one, our circuit provides a refresh function that creates a big integer equal to the given big integer where each limb value is 64-bit with increasing the number of limbs. By refreshing the product with that function, multiplication can be performed multiple times.

Our circuit also supports modular multiplication, i.e., **_a ∗ b_ mod _n_** for big integers _**a**_,_**b**_ and a modulus _**n**_. It first calculates the quotient _**q = ab/n**_ and the remainder _**r =**_ **_ab_ mod** _**n**_ without making constraints. It then constrains _**q**_ and _**r**_ to satisfy the following conditions.

1.  The product _**ab**_ is equal to _**qn + r**_.
2.  Each limb of _**q**_ and _**r**_ is in the range of \[_**0, 2⁶⁴**_).

To verify the first condition, the (not modular) multiplication function is used. For the second condition, existing circuits such as [circom-bigint](https://github.com/alex-ozdemir/circom-bigint) assign a new value to each bit and verify that the composed value is equal to the original value; however, our circuit uses a lookup table. This optimization allows the prover to prove that multiple values are in the specified range in batch as described in [Plookup protocol](https://eprint.iacr.org/2020/315.pdf).

By repeating the modular multiplication described above, the modular power _**aᵉ**_ **mod _n_** for an exponent big integer _**e**_ is computed. Formally, it is implemented as follows.

1.  Decompose _**e**_ into _**n**_ bits (_**e₀**_,**_a₁,…,eₙ_**₋**_₁_**).
2.  Let _**y = 1**_ be a modular power result.
3.  For ***i*∈** _**{0,…,n−1}**_, update _**y**_ to _**eᵢya²^ⁱ + (1−e₁)y**_.

Notably, if _**e**_ is fixed in the circuit, we can reduce the number of the modular multiplication because _**ya²^ⁱ**_ does not need to be computed for _**i**_ where _**eᵢ = 0**_ holds. Our circuit switches the definition of the constraints depending on whether _**e**_ is variable or fixed. Therefore, when _**e**_ of the RSA public key is fixed, e.g., pkcs1v15 signature verification, the number of constraints for modular multiplication is minimum.

## Application: ZK-Mail

As an application of the RSA verification circuit, we are considering ZK-Mail, a smart contract that performs email verification using ZKP. Today, digital signatures, especially RSA signatures, are widely used in email protocols such as S/MIME and DKIM to authenticate email senders. Our main idea is that a smart contract can authenticate those emails by verifying the RSA signatures with ZKP. If they pass the authentication, the smart contract can interpret their contents as oracle data provided by the email senders.

The smart contract described above is also useful as a contract wallet. Instead of using the wallet application to make a transaction, the user sends an email to the operator of the contract wallet specifying the transfer amount and the destination in its email message. The operator generates a ZK proof indicating that the received email has been authorized, submitting it to the smart contract. The smart contract verifies the proof and transfers the user's assets according to the contents of the email. It allows users to manage their assets on Ethereum without modifying current email systems or installing new tools.

If the user is different from the administrator of the sending email server, the security of the user's assets depends on trust in the administrator because the administrator can steal them by forging the user's emails. However, trust in the operator is not necessary. This is because even if the operator modifies the contents of the received emails, the operator cannot forge the signature corresponding to the email sender. In summary, this is a custodial wallet whose security is guaranteed under trust in the email server administrator, allowing users to manage their assets by simply sending emails using their existing email services.

In the following, we present two situations where the ZK-Mail can be used.

### Scenario 1: Email as oracle data

#### Players and situations

- Alice delivers the latest cryptocurrency prices via email. She attaches her RSA signature to the email following the DKIM protocol.
- Bob subscribes to Alice's emails and provides them for some DeFi contracts as price oracle data.

#### Assumptions

- A public key corresponding to Alice's domain name (e.g. [alice.com](http://alice.com/)) is published in DNS and not changed.
- Alice's public key and email address are registered in the ZK-Mail contract in advance.

#### Procedures

1.  Bob receives Alice's latest email.
2.  Bob extracts the cryptocurrency name and price data from the contents of the email.
3.  Taking Alice's RSA signature and the header/contents of the email as private inputs (witnesses), and her public key, her email address, and the cryptocurrency name and price data as public inputs (statements), Bob generates a ZKP proof confirming the following conditions.

    - The RSA signature is valid for the header/contents and the public key.
    - The From field in the header is equivalent to the provided email address, i.e., Alice's email address.
    - The contents include the cryptocurrency name and price data.

4.  Bob provides the price oracle contract with the cryptocurrency name and price data and the ZKP proof.
5.  The contract calls the ZK-Mail contract with the provided data. It verifies the ZKP proof using Alice's public key and email address registered in advance.
6.  If the proof passes the verification, the price oracle contract accepts the provided name and price data.

![](/articles/rsa-verification-circuit-in-halo2-and-its-applications/9Y4bJxpPnxxhdegr0P6LF.webp)

### Scenario 2: Email as transaction data for the contract wallet

#### Players and situations

- Alice operates an email service. She attaches her RSA signature to her users' emails following the DKIM protocol. Her domain name is [alice.com](http://alice.com/).
- Bob is a user of Alice's email service. His email address is [bob@alice.com](http://mailto:bob@alice.com/).
- Carol operates a contract wallet service. Her email address is [carol@wallet.com](http://mailto:carol@wallet.com/).

#### Assumptions

- A public key corresponding to Alice's domain name (e.g. [alice.com](http://alice.com/)) is published in DNS and does not change.
- Alice's public key is registered in the ZK-Mail contract in advance.
- Bob already registered Carol's wallet service. His email address is registered in the ZK-Mail contract, and he has 2 ETH in his wallet.
- **Alice never attaches her RSA signature to forged emails.**

#### Procedures

1.  Bob wants to transfer 1 ETH to his friend whose email address is [friend@alice.com](http://mailto:friend@alice.com/).
2.  Bob sends an email to [carol@wallet.com](http://mailto:carol@wallet.com/). Its message is "Transfer 1 ETH to [friend@alice.com](http://mailto:friend@alice.com/)".
3.  Alice attaches her RSA signature to the Bob's email.
4.  Carol receives the email from Bob. She extracts the transfer amount and the destination (1 ETH and [friend@alice.com](http://mailto:friend@alice.com/) in this case) from the contents of the email.
5.  Taking Alice's RSA signature and the header/contents of the email as private inputs (witnesses), and her public key, sender's email address, and the transfer amount and the destination as public inputs (statements), Carol generates a ZKP proof confirming the following conditions.

    - The RSA signature is valid for the header/contents and the public key.
    - The From field in the header is equivalent to the provided email address, i.e., [bob@alice.com](http://mailto:bob@alice.com/).
    - The message in the contents is in the form of "Transfer (transfer amount) to (destination)".

6.  Carol provides her service's contract with transaction data including the transfer amount and the destination and the ZKP proof.
7.  The contract calls the ZK-Mail contract with the provided data. It verifies the ZKP proof using Alice's public key and Bob's email address registered in advance.
8.  If the proof passes the verification, the contract wallet transfers Bob's 1 ETH to the wallet corresponding to the email address of [friend@alice.com](http://mailto:friend@alice.com/). (In detail, the contract wallet has storage where the hash of the email address is mapped to the ETH balance. It decreases 1 from the balance of Hash([bob@alice.com](http://mailto:bob@alice.com/)) and increases that of Hash([friend@alice.com](http://mailto:friend@alice.com/)) by the same amount.)

![](/articles/rsa-verification-circuit-in-halo2-and-its-applications/wqZkchwlp5eKjrHxEQDMp.webp)
