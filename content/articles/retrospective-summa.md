---
authors: ["Summa Team"]
title: "Retrospective: Summa"
image: "/articles/retrospective-summa/retrospective-summa-cover.webp"
tldr: "This post was authored by the Summa team."
date: "2025-02-10"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/HRlshQwWxo66EMt3lwk6PSuDkitJCr_-ltCETZHNeu0"
tags:
  [
    "summa",
    "proof of reserves",
    "zero-knowledge proofs",
    "cryptography",
    "privacy",
    "security",
    "centralized exchange",
    "halo2",
    "ethereum",
    "infrastructure/protocol",
  ]
projects: ["summa"]
---

### History and Goals of the project

The Summa project began in March of 2023 in response to the collapse of FTX months prior. It aimed to solve an issue that has plagued centralized exchanges since the Mt Gox collapse in 2013; how can users be assured that the funds they entrust to the exchange are going to be available when they choose to withdrawal them?

The goal was to create software that helps centralized exchanges (CEX’s) provide _auditor-less_ and _private_ Proof of Reserves\* with instant finality to their users. The project aimed to provide custodial services with tools that allowed more accountable to their users, with minimal additional overhead, while at the same time protecting user privacy. The vision was for frequent audits of a custodian’s reserves possible on the scale of millions of users.

\*_Note that in general, while the terms “Proof of Reserves” and “Proof of Solvency” are used interchangeably throughout documentation and references, we use the term “Proof of Reserves” in this post exclusively._

### Notable contributors

- Enrico, Jin, Alex
- Nam as consultant

### Technical Approach

While the overall technical goal was to optimise both the _time_ and _cost_ for generating a liabilities commitment, each version of Summa had a slightly different approach:

- In Summa **Version 1**, Halo2 circuits were used for the proving system, with the verifier and prover written to an onchain smart contract on the Ethereum network. The proofs were then managed via a merkle tree. You can read more about Summa Version 1 in the documentation [here](https://summa.gitbook.io/summa/1).
- Summa **Version 2** used the same basic tech stack as version 1, but replaced the merkle tree with the use of univariate sumcheck protocol. This version also made some custom modifications to the Halo2 zero knowledge prover. You can read more about Summa Version 2 in the [official documentation](https://summa.gitbook.io/summa) and technical reports: [Summa V2: Polynomial Interpolation Approach](https://hackmd.io/Rh8_F4blTTGmuJSmmUIB3g) and [Summa 2.0 aka SNARKless Proof Of Solvency for CEX](https://hackmd.io/@summa/r18MaCK7p)
- Summa **Version 3** is made up of three different iterations using HyperPlonk, each with distinct tradeoffs. You can learn more about each iteration in [this report](https://hackmd.io/khqyQzoiQ32UjkJd7fegnw).

You can learn more about the differences between the three versions, including benchmarking, [here.](https://hackmd.io/wt4NkeUWSWi2ym6DNcsT-Q)

### Achievements

Ultimately what the team successfully built was the core infrastructure of a cryptographically provable Proof of Reserves (PoR) system that addresses scalability where many other PoR systems fall short. While many additional components of a comprehensive PoR system aren’t addressed by this work (addressed further down), there is a significant foundation to build on from here.

In short, this system operates as follows:

- The Custodian verifies their onchain liabilities (customer deposits) by committing a batch of signatures from their addresses to a smart contract.
- The Custodian then generates a liabilities commitment, which represents the sum of all user account balances on their platform.
- To ensure all account balances were accounted for in the liabilities commitment, the custodian generates and supplies zero knowledge inclusion proofs to each of its customers, who can then independently verify that their individual balance was included.

The following are some of the breakthroughs the team made throughout the life of the project:

- **Summa Version 1** made improvements over previous PoR systems by including the verifier directly in the contract. This increased the transparency of the verifying contract, ensuring that users were using one standard verifier when verifying their inclusion proofs, and also improved UX and security by reducing the need to run additional local software.
- **Summa Version 2**

  - Offered a novel alternative to merkle trees via the use of the univariate sumcheck protocol, which provided a significant improvement of commitment performance. This was achieved through the development of a more optimised and readable solidity KZG verifier to handle using univariate polynomials in a smart contract.
  - Used a technique called [Amortized KZG](https://hackmd.io/@summa/HJ-dtmNdT), developed by another team within PSE, to enable batch proofing. This allowed for the verification of customer groups numbering fewer than approximately 10 million, effectively thwarting a profiling attack for groups of this size.

- **Summa Version 3** showed a significant improvement over v1 and v2 when it came to generating inclusion proof performance. A benchmark comparison can be seen [here](https://hackmd.io/wt4NkeUWSWi2ym6DNcsT-Q#Performance-Comparison-by-Summa-versions).
- Additionally, the team published this [vulnerability report on Binance’s Proof of Reserves system](https://hackmd.io/@summa/HygFa2eek0).

## Challenges and Learnings

### Technical Challenges

Implementing robust Proof of Reserve systems presents significant technical challenges that extend far beyond simple data verification. It’s imperative to consider things such as performance tradeoffs, security vulnerabilities, attack vectors and scalability limitations. Intention must be given to carefully balance commitment times, proof generation efficiency, and protection against potential profiling attacks; all while maintaining the core goal of creating a transparent, verifiable system that can demonstrate cryptocurrency custodial holdings without compromising user privacy or introducing systemic risks.

The following are technical challenges the team faced throughout the development process:

- The team was not able to create a system that is cryptographically provable from beginning to end. The address ownership proof is optimistically verifiable, and there is no recourse for customers if their proof does end up being invalid.
- In general, any improvement of the commitment time introduced performance tradeoffs by increasing the inclusion proof time, and vice versa.
- Discrete Fourier transform (DFT) presented a scalability bottleneck in v2 when using univariate sumcheck protocol. This inspired the exploration of hyperplonk in v3 to try to mitigate that bottleneck, which ultimately led to a regression.
- In v3 it was no longer possible to use the KZG verifier in the smart contract due to the lack of a hyperplonk verifier written in solidity, and we reverted to the use of additional software for verification. This unfortunately negated the improvements introduced in Version 1 and 2 of having the verifier placed in the contract.
- V3 also introduced a balancing attack due to the non-zero constraint feature introduced to remove the running sum. Due to this, two alternative iterations of v3 were briefly explored, each offering their own tradeoffs; you can find a detailed comparison of the different iterations [here](https://hackmd.io/khqyQzoiQ32UjkJd7fegnw).
- Due to the lack of structured reference strings (SRS) in hyperplonk Summa, Version 3 requires its own trusted setup. Switching to plonkish backend could potentially solve the trusted setup issue, but more research would be needed to confirm this.
- Big datasets using the same proof were limited to generating proofs for only 9-10 currencies without the need for more commitment proofs to be generated. This isn’t an insurmountable issue, but the team chose not to pursue it toward the end of the project’s life.
- There are general limitations associated with generating all inclusion proofs at once, especially for large batches. By generating proofs on demand instead of all at once, the custodian can easily see which customers are actively verifying proofs or not. This opens up a profiling attack, explained in more detail [here](https://www.notion.so/Challenges-8c0e4718b93f4a1ca3537c348e8a621d?pvs=21).
- Additional Summa attack vectors are documented [here](https://hackmd.io/@summa/SJYZUtpA2).

### Organizational Challenges

The development also faced significant organizational challenges, primarily due to a lack of clear goals and a structured roadmap with defined milestones. The team reflected that approaching the initiative as a research project rather than a product would have allowed for deeper exploration of concepts instead of prioritizing user experience optimizations prematurely. Additionally, the assumption that adoption would naturally follow development (“build it and they will come”) proved false, further emphasizing the need for clearer objectives and strategic planning from the outset to measure success effectively.

### Adoption

Adoption of the software faced significant hurdles due to a lack of thorough research into the problem space and unclear project goals, which hindered the team’s ability to engage effectively with CEXs and gather meaningful feedback. Additionally, it became evident that custodians had little incentive to implement robust Proof of Reserves systems, as there was limited demand or pressure from their customers to prioritize transparency and accountability, despite a vocal call to do so in the wake of the FTX collapse. The team found that even in cases where CEXs had implemented some form of PoR, it often fell short of a true Proof of Reserves system, insufficient for ensuring transparency, privacy and recourse for exchange users.

### Discontinuing the project

Following an [analysis](https://pse-team.notion.site/summa-analysis?pvs=74) of the status and impact of Summa, the team decided to halt development. The decision to discontinue the project stemmed from a growing understanding that the issues it aimed to address — such as reducing the cost of generating liability commitments for large customer sets — were only one small part of a much larger problem space in the Proof of Reserves landscape. Key components necessary for a truly robust PoR system, such as offchain asset verification, dispute resolution mechanisms, and zero-knowledge address ownership verification, were identified as critical but clearly fell outside the project’s scope.

Additionally, the assumption that improving the speed and cost-efficiency of commitments and proofs would drive industry-wide adoption proved overly simplistic. The team also recognized that other, more impactful PoR challenges existed but were beyond their capacity to address, making it clear that solving these broader issues alongside the specific ones the team addressed would be essential for scalable adoption.

### The Future

The Summa project, born in response to the FTX collapse, made significant strides in developing a scalable and cryptographically robust Proof of Reserves system for centralized cryptocurrency exchanges. Despite facing various challenges, the team achieved several notable outcomes:

- Creating three versions of the Summa system, each [iterating on performance](https://hackmd.io/wt4NkeUWSWi2ym6DNcsT-Q?view=#Performance-Comparison-by-Summa-versions) and [security aspects.](https://hackmd.io/wt4NkeUWSWi2ym6DNcsT-Q?stext=11843%3A1719%3A0%3A1738307701%3A1ckFiy&view=)
- [Implementing an innovative alternative to Merkle trees using the sumcheck protocol.](https://hackmd.io/wt4NkeUWSWi2ym6DNcsT-Q#Summa-V2)
- Developing a Solidity KZG verifier for improved smart contract integration.
- [Significantly improving inclusion proof generation performance in the final version.](https://hackmd.io/wt4NkeUWSWi2ym6DNcsT-Q#Performance-Comparison-by-Summa-versions)

These tools and resources provide a solid foundation for future PoR system development. While the project is no longer under active development, its findings and technical achievements remain valuable. Future researchers and developers can build upon this work by addressing identified gaps, such as off-chain asset verification and dispute resolution mechanisms, to create more comprehensive PoR solutions.

For those interested in continuing this work:

- A comprehensive project analysis is available [here](https://pse-team.notion.site/summa-analysis?pvs=74).
- A list of potential improvement components can be found [here](https://www.notion.so/Improvement-Components-390eb0fd89944631a162c3223de02a68?pvs=21)
- An audit by yAcademy has been [completed](https://github.com/electisec/summa-audit-report/blob/main/README.md) and the issues raised in the audit have been addressed [here](https://github.com/summa-dev/summa-solvency/pull/300).
- The project’s [GitHub repository](https://github.com/summa-dev) will remain open source.

While no further development is currently planned, the Summa project’s contributions to the field of Proof of Reserves systems provide a valuable starting point for future innovations in cryptocurrency exchange transparency and security.
