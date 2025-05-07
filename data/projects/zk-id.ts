import {
  ProjectCategory,
  ProjectContent,
  ProjectInterface,
  ProjectStatus,
} from "@/lib/types"

const content: ProjectContent = {
  en: {
    tldr: "zkID advances privacy-preserving digital identity by drafting standards, open-source infrastructure, and prototypes using ZKPs.",
    description: `
### Overview

zkID is a strategic initiative of the Ethereum Foundation, in collaboration with Privacy and Scaling Explorations (PSE), focused on advancing the use of Zero Knowledge Proofs (ZKPs) in digital identity systems. We contribute to PSE by leading research, coordination, education, and development efforts that enable privacy-preserving, interoperable, and standards-aligned identity infrastructure.

Our team works and distributes grants across the identity ecosystem to draft technical standards, maintain open-source resources, and prototype infrastructure that aligns with evolving regulatory frameworks. By stewarding collaboration between researchers, developers, governments, and institutions, zkID bridges foundational cryptographic research with real-world deployment and impact. The potential for real-world impact of zkID is clear: the way identity systems are designed and deployed will shape how billions of people prove who they are, access essential services, and participate in public life.

### Vision

Our vision is a future where digital identity infrastructure is **privacy-preserving.** We are working to ensure that **privacy is** built into global digital identity systems *by default*. As governments make foundational decisions on how identity is issued, verified, and protected, we see an opportunity for EF and PSE to: 

- Embed **zero-knowledge proofs (ZKPs)** at the core of these systems
- Define the underlying [blockchain and distributed ledger](https://github.com/orgs/eu-digital-identity-wallet/projects/29/views/1?pane=issue&itemId=86398709&issue=eu-digital-identity-wallet%7Ceudi-doc-standards-and-technical-specifications%7C202) technology used as trust registries

### Why It Is Urgent

The [European Union’s **EUDI Wallet**](https://ec.europa.eu/digital-building-blocks/sites/display/EUDIGITALIDENTITYWALLET/EU+Digital+Identity+Wallet+Home) is on track for rollout in **2026**. In parallel, countries are building identity stacks, with deployment frameworks and policies that mirror or precede the EU’s. This is a **critical inflection point**: [technical decisions](https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/discussions/408) made today will determine whether future digital identity systems become tools for mass surveillance or embed privacy, user agency, and interoperability as defaults. 

We are in a rare window of influence. Over the next 12 to 18 months:

- **Standards are ossifying**. [Technical specifications](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/README.md) and legal requirements being defined now will become defaults for dozens of countries.
- **Public-private partnerships are forming**. Major technology monopolies ([Google](https://datatracker.ietf.org/doc/draft-google-cfrg-libzk/), [Microsoft](https://github.com/microsoft/crescent-credentials), [Orange](https://csrc.nist.gov/csrc/media/presentations/2024/wpec2024-3b3/images-media/wpec2024-3b3-slides-antoine-jacques--BBS-sharp-eIDAS2.pdf), etc.) are positioning themselves to define and deploy identity solutions - from non-credibly neutral stances.
- **Once deployed, systems are sticky.** National identity systems are expensive, complex, and politically sensitive to overhaul. As we have learned from our experience working with other countries, if ZKPs are not integrated now, retrofitting them later will be slow, bureaucratic, and unlikely to succeed.

### What We Are Doing

zkID operates across [three strategic workstreams](https://www.notion.so/zkID-Team-Strategy-Proposal-db3c5788dc7a4916a33e580a79177053?pvs=21) to ensure zero-knowledge proofs (ZKPs) are embedded in digital identity systems of the future:

### 1. **Proliferate Programmable ZKP Standards**

We work with standard bodies to embed ZKPs into emerging identity frameworks to ensure interoperability. Our [grant](https://hackmd.io/@therealyingtong/zkid-grant-proposal)-backed efforts include:

- [Technical reviews](https://docs.google.com/presentation/d/1C4D8zK4gAdafgIEW-2m_qDyyT39gWo0mmFYpwmA8N3M/edit#slide=id.g338a079cb64_0_15) of implementations from Orange, Google, and Microsoft
- [Technical reviews](https://hackmd.io/@therealyingtong/vc-formats) of verifiable credential data models
- Drafting a IETF [standard on Programmable ZKPs](https://docs.google.com/presentation/d/1HqFtSiS2hVHaSS8-u-8iecVFeMehMGBtZJnnbnXj83c/edit#slide=id.p)
- Participating in [DIF](https://github.com/decentralized-identity/zkp-self-attestations) and [W3C](https://docs.google.com/presentation/d/1HqFtSiS2hVHaSS8-u-8iecVFeMehMGBtZJnnbnXj83c/edit#slide=id.p) standards working groups
- Shaping specifications within the [EUDI technical framework](https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/discussions/408)

Standards like the IETF and EUDI framework are **global signaling mechanisms.** Dozens of countries reference the EUDI frameworks to shape their own identity regulations. If we can ensure ZKPs are part of the EUDI ARF spec, we create downstream pressure to adopt privacy-preserving architecture across multiple jurisdictions.

### 2. **Research, Prototype, Subtraction**

We [research](https://www.notion.so/Evaluation-Framework-for-SSI-Solutions-8eceb793a5b442cb8da65acc3c337d5c?pvs=21) and build standards compliant, [**minimal and modular PoCs**](https://github.com/adria0/seediq-playground) like the [ZKP Wallet Unit](https://www.notion.so/External-zkID-ZKP-Wallet-Unit-Proposal-1bad57e8dd7e80c98d73fc7e7666375d?pvs=21). This is done in collaboration with governments, to ensure practical real-world ZKP integration pathways.

By delivering vendor-neutral, open-source PoCs, zkID aims to provide tangible working proof in production-ready environments.,

### 3. **Education and Strategic Outreach**

We publish research, [articles](https://mirror.xyz/privacy-scaling-explorations.eth/zRM7qQSt_igfoSxdSa0Pts9MFdAoD96DD3m43bPQJT8), [analysis](https://www.notion.so/Evaluation-Framework-for-SSI-Solutions-8eceb793a5b442cb8da65acc3c337d5c?pvs=21), lead [workshops](https://docs.google.com/presentation/d/1YROCEHK_t10wo5CukgYWmS1nuYKZi46NJBu-XZ8zXiw/edit#slide=id.p), and run [technical engagements](https://docs.google.com/presentation/d/1C4D8zK4gAdafgIEW-2m_qDyyT39gWo0mmFYpwmA8N3M/edit#slide=id.g338a079cb64_0_15).

[Zero-knowledge proofs](https://docs.zkproof.org/reference.pdf) are powerful, but often misunderstood or underutilized by policymakers and civic organizations.

In parallel, we aim to advise institutions on selecting the right Layer 2 infrastructure, prioritizing solutions with strong decentralization roadmaps for identity-specific use cases.

zkID serves as a neutral translator and strategic steward, helping institutions grasp the practical applications of ZKPs and guiding their integration into public goods.

`,
  },
}

export const zkID: ProjectInterface = {
  id: "zk-id",
  projectStatus: ProjectStatus.ACTIVE,
  category: ProjectCategory.DEVTOOLS,
  section: "pse",
  content,
  image: "",
  imageAlt: "ZK Identity",
  name: "zkID",
  links: {
    github: "https://github.com/zkspecs/zkspecs",
  },
  tags: {
    keywords: [
      "Identity",
      "Credentials",
      "Standards",
      "SSI",
      "Verifiable Credentials",
    ],
    themes: ["research"],
    types: ["Legos/dev tools", "Lego sets/toolkits"],
  },
}
