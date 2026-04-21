---
authors: ["Rasul Ibragimov"]
title: "Web2 Nullifiers using vOPRF"
image: "/articles/web2-nullifiers-using-voprf/web2-nullifiers-using-voprf-cover.webp"
tldr: "This post was written by PSE researcher Rasul Ibragimov. Big thanks to Lev Soukhanov for explaining the majority of this to me - without him, this blog post wouldn't exist."
date: "2025-01-30"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/L4LSAWflNocKolhV6ZVaqt3KDxdSjFPNSv0U5SCc__0"
tags:
  [
    "voprf",
    "nullifiers",
    "zero-knowledge proofs",
    "privacy",
    "web2",
    "identity",
    "cryptography",
    "mpc",
    "anonymity/privacy",
    "infrastructure/protocol",
  ]
projects: ["zk-email", "tlsn", "anon-aadhaar", "semaphore"]
---

## Abstract

Recent development of protocols, that allow us to make Web2 data portable & verifiable such as [ZK Email](https://prove.email/) or [TLSNotary](https://tlsnotary.org/) opens new use-cases and opportunities for us. For example, we can make proof of ownership of some x.com username or email address and verify it on-chain with ZK Email. Projects like [OpenPassport](https://www.openpassport.app/), [Anon Aadhaar](https://github.com/anon-aadhaar/anon-aadhaar) (and others) are also the case.

We can also do more complex things, e.g. forum where holders of @ethereum.org email addresses will be able to post anonymously, using zk proofs of membership.

Projects like [Semaphore](https://semaphore.pse.dev/) helps us to build pseudonymous systems¹ with membership proofs for "Web3 identities".

In Semaphore users have their $\text{public\_id} = \text{hash(secret, nullifier)}$, and $\text{nullifier}$ actually serves as an id of user - we still don't know who exactly used the system, but we'll be able to find out if they used it more than once. But the thing is **we don't have any nullifiers** in ZK Email/TLS, etc. - that's why it's not possible to create such systems for Web2 identities out of the box. The solution for that is vOPRF.

vOPRFs (verifiable Oblivious PseudoRandom Functions) - are protocols that allow a client to generate deterministic random based on their input, while keeping it private. So, there're two parties in the protocol - first one as I said is a client, and second one is a OPRF network (usually [MPC](https://en.wikipedia.org/wiki/Secure_multi-party_computation) is used for that).

With OPRF we'll be able to generate nullifiers for Web2 ID's': users will just need to ask the MPC to generate it, e.g., based on their email address (without revealing plain text of course).

We can do many things based on that:

- Anonymous voting with ported Web2 identities;
- Anonymous airdrops - projects can just list Github accounts, that are eligible for airdrop, and users will be able to claim (only once) with proof of Github using ZK Email;
- Pseudonymous forums - I mentioned it before, but with OPRF we can have pseudonyms and limit user to only one account + it might be easier to track & ban spammers
- ... many more.

Read the next section for more details.

## Detailed explanation

### Main protocol

There are three parties involved in protocol:

- **User**, that is trying to do some action with their Web2 identity (e.g. google account) pseudonymously (e.g. anonymously participate in voting).
- **OPRF** Server/Network (will just call OPRF).

  - We use MPC, because in the case of having only one node generating nullifiers for users - it'll be able to bruteforce and find out which Web2 identity corresponds to a given nullifier. Every node has to commit to their identity somehow - e.g., by storing their EC public key on a blockchain. For simplicity I'll explain the case with one node OPRF first, and in the OPRF-MPC section I'll explain how we can extend it to multiple nodes.

- **Ethereum** (or any other smart-contract platform)

**1)** User makes ZK Email/TLS auth proof with salted commitment to UserID (or email, name, etc.) as a public output:

                                                  $\text{commitment₁} = \text{hash} \text{(UserID,salt)}$

I'll call it just **Auth proof.**

**2)** User sends new commitment to their UserID to OPRF:

                                                        $\text{commitment₂} = r * G$

where $G = \text{hashToCurve}(\text{UserID})$, and $\\r$ is random scalar. We want to prevent users from sending arbitrary requests (because they would be able to attack the system by sending commitments to different user's identities), so user must additionally provide a small zk proof, that checks the relation between the commitments, where:

Public inputs: $\text{commitment₁}$, $\text{commitment₂}$

- Private inputs: $\text{UserID}, \text{salt}, r$

and constraints:

                                                  $\text{commitment₁} = \text{hash}(\text{UserID},\text{salt})$

                                                       $\text{G} = \text{hashToCurve}(\text{UserID})$

                                                        $\text{commitment₂} = r * G$

**3)** OPRF replies with:

                                               $\text{oprf \textunderscore response} = s * \text{commitment₂}$

where $s$ is a private key of OPRF node; and also replies with proof of correctness of such multiplication, which is in this case might be a Chaum-Pedersen proof of discrete log equality (check [this blog post](https://muens.io/chaum-pedersen-protocol) on that).

**4)** User creates zk proof with the following parameters:

- Public outputs: $\text{commitment₁}, \text{nullifier}$
- Private inputs: $r, \text{UserID}, \text{salt}, \text{chaum \textunderscore pedersen \textunderscore proof}, \text{oprf \textunderscore response}$

and validates that:

                                                  $\text{commitment₁} = \text{hash}(\text{UserID},\text{salt})$

                                                   $G \longleftarrow \text{hashToCurve}(\text{UserID})$

                                              $\text{chaumPedersenVerify} (\text{oprf \textunderscore response})$

                                                   $\text{nullifier} \longleftarrow r^{-1} * \text{oprf \textunderscore response}$

### On nullifiers

That's it, we have a nullifier - and now users can use the system as in Semaphore. If we go a bit further, it's worth to mention that users shouldn't reveal nullifier, because it's linked with their $\text{UserID}$; and if they use the same $\text{UserID}$ in different apps - it'll be possible to track them. We can do it a bit differently - instead of revealing nullifier we can reveal $hash(\text{nullifier}, \text{AppID})$ - where $\text{AppID}$ is a unique identifier of the app, and that's gonna be our real nullifier.

## OPRF MPC

In the example above we used only one node OPRF, but we can easily extend it to multiple nodes. There're many ways to do that, I'll explain few:

**1)** N of N MPC:

- 1.1. All nodes have their own pair of keys.
- 1.2. Every node does step 3 individually: we get $\text{oprf \textunderscore response}_i = s_i * r * G$
- 1.3. On step 4 we verify $\text{chaum \textunderscore pedersen \textunderscore proof}$ for every node
- 1.4 We calculate $\text{nullifier}_i = \text{oprf \textunderscore response}_i * r^{-1}$
- 1.5 We calculate $\sum_{i=1}^N\text{nullifier}_i = s * G$

_Important to mention that we have to verify/calculate everything in the circuit._

**2)** M of N MPC using linear combination for Shamir Secret Sharing:

- Similar to N of N MPC, but we need only M shares

**3)** Using BLS:

- 3.1. Calculate common public key of all OPRF nodes by summing individual public keys
- 3.2. The same as in N of N MPC case
- 3.3., 3.4, 3.5. - The same as in N of N MPC case, **BUT** we can do it outside the circuit
- 3.6. Verify BLS pairing in the circuit

1.  Pseudonymous system - a privacy-preserving system, where users' transactions are linked to unique identifiers (pseudonyms), but not their actual identities.
