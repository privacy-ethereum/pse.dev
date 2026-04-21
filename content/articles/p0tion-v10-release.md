---
authors: ["MACI Team", "Trusted Setup Team", "RLN Team", "Design Team"]
title: "p0tion V1.0 Release"
image: "/articles/p0tion-v10-release/cover.webp"
tldr: "P0tion was built with love by: MACI, Trusted Setup, RLN, and Design Teams at PSE."
date: "2023-08-08"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/TuLZRdgCQsydC8JJgCNH4F7GzifRBQ6fr31DHGLFVWM"
tags:
  [
    "p0tion",
    "trusted setups",
    "zero-knowledge proofs",
    "groth16",
    "ceremony",
    "maci",
    "rln",
    "cryptography",
    "security",
    "toolkits",
  ]
projects: ["p0tion", "maci", "rln", "trusted-setups"]
---

We are excited to unveil p0tion V1, a versatile and comprehensive toolkit designed to streamline Groth16 zk-application development and enable them to become production-ready.  The goal is to facilitate Phase 2 Trusted Setup ceremonies for multiple circuits simultaneously, making the entire process more efficient and scalable.

## **Motivation**

The Groth16 proving system has gained popularity for its ability to produce small, fast, and cost-effective proofs. However, its lack of universality poses a challenge for production use. Each modification to a circuit necessitates a new Phase 2 Trusted Setup ceremony, adding complexity and time to the process. To address this, Groth16 zk-SNARK circuits require an MPC Trusted Setup ceremony to generate the parameters needed for zkSNARKs-based systems. Creating a protocol for these ceremonies involves considerable time and development resources, including design, auditing, testing, security measures, operational planning, guides, and more. To simplify this process and eliminate the burdens associated with MPC ceremonies, we are proud to introduce p0tion – an all-in-one toolkit that automates the setup, execution, coordination, and finalization of Phase 2 Trusted Setup ceremonies for one or more zkSNARKs circuits.

[p0tion](https://github.com/privacy-scaling-explorations/p0tion), was originally built by the MACI team to conduct trusted setup ceremonies for large circuits (aka number of constraints), as in [MACI](https://github.com/privacy-scaling-explorations/maci) V1. You may think of p0tion as a toolkit to manage Trusted Setup Phase 2 ceremonies for multiple circuits simultaneously. Its aim is to democratize the process, allowing individuals and teams to easily deploy the infrastructure required to run their ceremonies. Our vision is based on four core values:

- **Secure Groth16 Circuits in Production**: With p0tion, Circom developers, including the MACI team, can implement continuous delivery of secure Groth16 zkApps within an agile setting. By automating Phase 2 ceremonies, they can ensure the security and efficiency of their applications.
- **Easy to Read and Use**: The documentation and code of p0tion are clear, concise, and articulate. Even newcomers to the tool can quickly grasp its functionalities and deploy a ceremony in less than one hour.
- **Ready for Change**: Developers can have full confidence in the security of the ceremony tool. Moreover, they can easily fork and adapt the code to suit their own ceremony requirements, fostering flexibility and customization.
- **Infrastructure as Code**: p0tion streamlines the entire process for infrastructure setup, coordination, scaling, and ceremony conduction. It provides a black-box approach to simplify the complexity of the underlying operations.

## **RLN Trusted Setup Ceremony**

We are happy to announce that p0tion is being used for the RLN (Rate-Limiting Nullifier) zero-knowledge gadget that enables spam prevention. You can find more information on how to help make the protocol more secure at the end of this [blog post](https://mirror.xyz/privacy-scaling-explorations.eth/iCLmH1JVb7fDqp6Mms2NR001m2_n5OOSHsLF2QrxDnQ).

## **How it works**

Running a Trusted Setup ceremony with [p0tion](https://github.com/privacy-scaling-explorations/p0tion) is a straightforward process, consisting of three main steps. To access these steps, both coordinators and participants need to authenticate with the CLI using OAuth2.0, with the current version supporting the Github Device Flow authentication mechanism, by simply running the auth command.

1.  **Setup**: The coordinator initiates the ceremony by preparing it interactively or non-interactively using the setup command. This involves providing the output of the circuit compilation as input to the setup command. This command enables coordinators to configure the ceremony based on their needs by providing the data of one or more circuits, selecting timeout mechanisms (fixed/dynamic), whether to use custom ad-hoc EC2 instances for contribution verification or Cloud Functions and so on.
2.  **Contribution**: During the contribution period, participants authenticate themselves and contribute to the ceremony by providing entropy (referred to as toxic waste) using the CLI via the contribute command. Participants can provide their own entropy or generate it for them.
3.  **Finalization**: Once the contribution period ends, the coordinator finalizes the ceremony to extract the keys required for proof generation and verification and the Verifier (smart contract), by running the finalize command.

To guarantee the flexibility and satisfaction of this workflow, the p0tion codebase (v1.x) is designed with modularity in mind, split into three distinct packages: actions, contains key features, types, and helpers forming an agnostic set of ready-to-use functions (SDK), backend for configuration and deployment of the infrastructure, utilizing Firebase Authentication and Cloud Functions, AWS S3 and EC2 instances and, phase2cli a command-line interface which serves coordinators and contributors in Trusted Setup Phase 2 ceremonies, operating with multiple commands on top of the p0tion infrastructure. Additionally, the CLI enables contributors to fully use their machine computing power, allowing contributions on a larger scale compared to ordinary web-browser clients.

## **How to get involved?**

We built p0tion as zk-developers, for zk-developers. We’d like to onboard as many zk-SNARK developers as possible to run ceremonies for their circuits, but at the same time, we would love to see the community helping to make this framework even better.

You could learn more about Trusted Setups ceremonies, coordinating and contributing using p0tion by visiting the [documentation and guidelines](https://p0tion.super.site/) and the [Github Repository](https://github.com/privacy-scaling-explorations/p0tion). Any feedback can be submitted to the [PSE Discord](https://discord.gg/jy3eax25) or opening a [Github Issues](https://github.com/privacy-scaling-explorations/p0tion/issues). Contributors are always welcome! If you are a zk-SNARK developer, either working as an individual or as a team, feel free to reach out to one of our team members. We will be happy to show you how to use p0tion, or potentially setup and host a trusted setup ceremony for your project.

_This post was written by the MACI team._
