---
authors: ["PSE Comms Team"] 
title: "PSE September 2025 Newsletter" 
image: ""
tldr: "A roundup of updates from PSE teams covering our three new focus areas of private writes, private proving, and private reads."
date: "2025-09-16"
tags: ["newsletter"] 
---

We’re changing the format of our updates to reflect the three focus areas from our new [roadmap](https://ethereum-magicians.org/t/pse-roadmap-2025-and-beyond/25423):

- **Private writes**: improving the feasibility, usability and affordability of writing to Ethereum privately.
- **Private proving: m**aking proof generation and verification fast, private, and accessible.
- **Private reads**: enabling reads from Ethereum without revealing identity or intent.

Here’s what PSE teams have been up to this last month!

## 🏗️ Private Writes

### [MACI](https://pse.dev/projects/maci)

Since our last update, MACI has made solid progress on several fronts: strategy, integrations, and V4 research. Given wider organisation changes, we have been defining a new strategy to accelerate the adoption of privacy in governance - we’ll be announcing the results of this over September!

We unveiled an exciting [integration](https://x.com/AragonProject/status/1958138194278412798) with Aragon to bring private, anti-collusion voting to their DAO tooling stack. We have also been progressing with research into the next MACI version, which aims to improve the trust assumptions of MACI and improve DevEx. We’re aiming share that with collaborators for feedback in October, and present it more widely around November. 


### [Semaphore](https://pse.dev/en/projects/semaphore)

We recently wrapped up the Trusted Setup Ceremony and started to update Semaphore with the new production zk artifacts. This included adding the artifacts to the snark-artifacts repo, updating the protocol's smart contracts and proof package, and releasing version v4.13.0. We also deployed the updated contracts across all supported testnets, updated their subgraphs, and ensured the boilerplate reflected the latest changes. We began exploring how Semaphore can be applied to private governance, mapping out potential use cases.

Next, we'll focus on deploying the new contracts to all supported mainnets and updating their corresponding subgraphs. Once that's complete, we'll publish a new release, update the benchmarks page, and the extensions repository projects, including the benchmarks app, contract extensions, and explorer. The final step will be to announce the new version publicly on X.


### [Indistinguishability Obfuscation (iO)](https://pse.dev/en/projects/machina-io)

We improved the lookup evaluation for BGG+ encodings so that it relies only on the LWE assumption. We are writing a paper to propose this lookup technique for various cryptographic primitives such as attribute based encryption, laconic function evaluation, and so on.
We attended CRYPTO 2025 in Santa Barbara to catch up on recent work in iO and advanced encryption. We also had technical discussions with cryptographers.


### vFHE

We put together an [overview of the FHE + blockchain ecosystem](https://hackmd.io/xcf2tzkZQieZeglAWbR99Q?view), looking at the main players, use cases, and the core considerations when bringing FHE into Web3. The document maps out projects working on confidential smart contracts, encrypted rollups, and verifiable computation, lists who’s active in the space, and shows how different approaches connect. 

We also highlight use cases like private DeFi, stablecoins, and governance, and sketch out principles to keep in mind — from choosing the right scheme to making things verifiable and manageable in practice. It’s meant as a snapshot of where things stand today and a starting point for ongoing discussion.


### [PlasmaFold](https://pse.dev/projects/plasma-fold)

We updated PlasmaFold to run with arkworks latest versions, featuring new msm routines (observed a 2-3x speedup for the transaction aggregator! We are also well below the 1s tx proving time in Chrome now). We are in the literature review phase for a privacy-preserving version of PlasmaFold. 


### IPTF (Institutional Privacy Task Force; was: Enterprise Privacy)

We’ve recently formed a [new team](https://www.notion.so/25ed57e8dd7e803b817af09d7ff253d5?pvs=21) to explore enterprise privacy and have started scoping out the potential impact and deliverables we want to achieve. In the past weeks, we’ve been introduced to members of the EcoDev team and stakeholders who are directly facing precise privacy challenges. These conversations are giving us a clearer view of the landscape and where our efforts could make a meaningful difference.

From those discussions, we’ve kicked off an **Enterprise Privacy Mapping** effort. The goal is to systematically capture the problems enterprises are encountering, map them against possible solutions, and identify the technical gaps where we could step in. This mapping will help us prioritize our work, align with existing needs, and ultimately guide us toward concrete prototypes and solutions that can move the needle for stakeholders.


## 🪢 Private Proving

### [Mopro](https://pse.dev/en/projects/mopro)

This month, Mopro has upgraded to the latest stable Rust version 1.89.0 and enhanced support for proving systems, including Circom 2.2.0 and Noir v1.0.0-beta.8. These updates bring the latest functionalities, such as buses feature for Circom and more stable on-chain verifiers for Noir, unlocking opportunities for builders to explore. Additionally, CLI upgrades will improve the developer experience on mobile.


### [TLSNotary](https://pse.dev/en/projects/tlsn)

We are finishing the alpha.13 release, featuring a range of protocol-level improvements. We’ve optimized performance across the stack, including a better LPN estimator and faster commit logic. These changes not only speed things up but also make the codebase easier to test, maintain, and integrate. We’ll share detailed benchmark results in an upcoming blog post.

Alongside these protocol improvements, we’re working on an SDK with plugin support, designed to be easy to integrate across runtimes. Preparations for TLS 1.3 support have also begun. The trustless verifier demo is now live at [demo.tlsnotary.org](https://demo.tlsnotary.org/), and we’ve published a new blog post covering the project’s history. Preparations for zkTLS Day at Devconnect are well underway, and we’re collaborating with the Mopro team on a Noir example for proving TLS commitments in zero knowledge.


### [zkID Standards](https://pse.dev/projects/zk-id)

This month, we made significant progress across the zkID roadmap, revocation requirements gathering, and research on VORPF for zk-KYC. We also kicked off the L2 Identity Working Group with our ecosystem partners. On the research side, we benchmarked mobile proving performance for the zkID ZKP wallet unit PoC, with findings that highlighted memory bottlenecks for sumcheck. We also explored the feasibility of client-side proving with zkPDF. 

On the community front, we are currently in preparations for the ETHDelhi hackathon, and we’ve aligned on a strong set of CSP ideas to bring to zkID day at Devconect. As we move into September, we’re focused on delivering a finalized revocation plan and solidifying the long-term zkID vision.


### [zk-kit](https://pse.dev/en/projects/zk-kit)

Progress has been made on ongoing maintenance and on finalizing the new website design and implementation, which is nearly ready to launch. Next, a blog post will be published on PSE and the ZK-Kit community exit plan will be announced on X.


### [Client-Side Proving](https://pse.dev/en/projects/client-side-proving)

In August, we advanced the [client-side proving benchmarks](https://github.com/privacy-ethereum/csp-benchmarks) by standardizing metrics reporting, adopting `criterion` for statistically robust runs, and extending SHA-256 benchmarks coverage with new RISC0 and Miden `ere`-based suites. The integration of `ere`, an initiative of the ACT EF team, lets us benchmark multiple zkVMs using a consistent abstraction layer. We introduced reproducible RAM profiling, decoupled performance and memory measurement, and restructured ProveKit inputs for better comparability. We also improved CI reliability by splitting workflows.

We have also advanced [WHIR-based multilinear proving system research](https://hackmd.io/@clientsideproving/whir-based), comparing ProveKit (Spartan-WHIR), Whirlaway, and HyperPlonk-WHIR under consistent benchmarks. We found ProveKit to be the most balanced option, as it combines competitive proving times with stable RAM usage.


### Privacy Experience

We’re excited to introduce a new team, called Privacy Experience, that tries to close the gap from making privacy on Ethereum not just technically possible, but something that users can understand and experience. This month we’re connecting with external teams and doing user testing of different privacy tools to identify challenges and ways to collaborate. We’re also supporting PSE team events and collaborating with other folks in the privacy world to set up a [Privacy Hub](https://forum.devcon.org/t/arg-community-hub-privacy-on-ethereum/7858) at Devconnect!


### [vOPRF](https://pse.dev/projects/voprf)

We’ve been exploring different approaches to ensure reliable data availability of DNS public keys, which are critical for use cases like email verification, JWT validation, and other cryptographic workflows. This line of research is particularly relevant for projects such as vOPRF, which depend on DNS resolution to generate and verify third-party zero-knowledge proofs.

Through this effort, we curated and compared a range of potential solutions for DNS public key availability, spanning both on-chain and off-chain models. Each approach carries different trade-offs in terms of scalability, security, and ease of integration. While the exploration uncovered promising directions, the immediate utility for vOPRF is not yet clear, and further refinement of use cases will be needed before moving forward.


## 🧪 Private Reads

### Private RPC

In our Private Read track, we’re working to preserve privacy in how Ethereum users read state—protecting both what’s being queried and the identity signals (like IP addresses) such requests can reveal. This month we started our initial investigation into the ORAM/TEE stack. This includes the initial design of how we can integrate Oblivious Labs’ ORAM implementation with Kohaku wallet via RPC call. Next we’ll be looking at:

- TEE side: dig deeper into remote attestation in ORAM/TEE setting and integrate attestation feature into Helios
- Concrete plans for securing TEE connection with browser, implementation.
- Intercepting state-access opcodes in Helios in order to package the request for an RPC call to the ORAM-TEE server


### Kohaku

We are excited to support the Kohaku effort for a privacy-first wallet experience. In collaboration with Oblivious Labs, we are implementing the necessary modifications in Kohaku to route RPC read requests to the ORAM-TEE server, which includes handling TEE attestations and encrypting and sending the previously transparent RPC requests. In parallel, we are also working on modifications to the Helios light client, which Kohaku relies on for client-side validation of roots and contract calls, in order to intercept state-read opcodes and getting the required state through the ORAM-TEE server.

