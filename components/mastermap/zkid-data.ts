import type { ProjectData } from "./mastermap-data"

export const ZKID: ProjectData = {
  id: "zkid",
  name: "zkID",
  category: "private-proving",
  status: "Research & development",
  statusVariant: "rd",
  completion: 50,
  description:
    "Privacy-preserving identity proofs. OpenAC wallet unit aligned with EUDI. ZK-friendly primitives.",
  href: "/mastermap/zkid",
  tags: ["Identity", "EUDI", "OpenAC", "Standards"],
  now: [
    {
      name: "Generalized Predicates Benchmarking",
      description:
        "Benchmark the generalized predicates implementation to measure performance.",
      status: "In Progress",
      statusDot: "green",
    },
    {
      name: "mDOC/MDL Support",
      description:
        "Add support for ISO mDOC/mDL credential formats in OpenAC.",
      status: "In Progress",
      statusDot: "green",
    },
    {
      name: "Multi-VC Linking Research",
      description:
        "Research approaches for linking multiple verifiable credentials within a single proof.",
      status: "In Progress",
      statusDot: "green",
    },
    {
      name: "OpenAC ETSI Profile",
      description:
        "Development of a draft specification of the OpenAC profile as a contribution to ETSI TS 119 476-2.",
      status: "In Progress",
      statusDot: "green",
    },
    {
      name: "Third Party Wallet Integration",
      description:
        "Technical collaboration with EU wallet vendors and integration testing with MODA/TWDIW.",
      status: "Ongoing",
      statusDot: "green",
    },
    {
      name: "Explore OpenAC Integration Strategy",
      description:
        "Ongoing exploration of integration strategies and partnerships for OpenAC adoption.",
      status: "Ongoing",
      statusDot: "green",
    },
    {
      name: "Compare Values Within the Same Credential",
      description:
        "Design and implement predicates that compare values within a single verifiable credential.",
      status: "Completed",
      statusDot: "green",
    },
    {
      name: "Implement Generalized Predicates",
      description:
        "Enable flexible, expressive, composable verification requests over verifiable credentials.",
      status: "Completed",
      statusDot: "green",
    },
    {
      name: "Publish OpenAC SDK",
      description:
        "Publish the OpenAC SDK with complete documentation for external integration.",
      status: "Completed",
      statusDot: "green",
    },
    {
      name: "Address Paper Feedback",
      description:
        "Address community feedback, refine content, and publish a revised version of the OpenAC paper.",
      status: "Completed",
      statusDot: "green",
    },
    {
      name: "Research and Rewrite Circuits Using Bellpepper or Arkworks",
      description:
        "Research and rewrite circuits using Bellpepper or Arkworks for improved performance.",
      status: "Completed",
      statusDot: "green",
    },
    {
      name: "Optimize Circom Circuit Implementations",
      description:
        "Improve efficiency, readability, and performance of existing Circom circuits.",
      status: "Completed",
      statusDot: "green",
    },
    {
      name: "Revocation Reports",
      description:
        "Publish the Merkle Tree-based revocation report on PSE blog and support completion of the DIF Revocation report.",
      status: "Completed",
      statusDot: "green",
    },
    {
      name: "EU Commission Engagement",
      description:
        "Presentations and workshops with the European Commission on OpenAC.",
      status: "Completed",
      statusDot: "green",
    },
    {
      name: "Explore On-chain Verification",
      description:
        "Explore EVM-compatible on-chain verification of OpenAC proofs.",
      status: "Completed",
      statusDot: "green",
    },
  ],
  next: [
    {
      name: "Multi-VC Linking Implementation",
      description:
        "Implement multi-VC linking based on research outcomes.",
      status: "Planned",
      statusDot: "yellow",
    },
    {
      name: "Add Generalized Predicates to OpenAC SDK",
      description:
        "Extend the OpenAC SDK to expose generalized predicates to integrators.",
      status: "Planned",
      statusDot: "yellow",
    },
    {
      name: "W3C VC Support",
      description:
        "Add support for the W3C Verifiable Credentials format in OpenAC.",
      status: "Planned",
      statusDot: "yellow",
    },
    {
      name: "Optimized Non-Membership Tree for Revocation",
      description:
        "Design and implement an optimized non-membership tree suitable for privacy-preserving revocation and generic non-membership proofs.",
      status: "Planned",
      statusDot: "yellow",
    },
    {
      name: "Privacy Revocation for OpenAC",
      description:
        "Design and implement privacy-preserving revocation for OpenAC credentials.",
      status: "Planned",
      statusDot: "yellow",
    },
    {
      name: "Write v2 OpenAC Paper",
      description:
        "Publish an updated OpenAC paper reflecting the v2 design and latest research.",
      status: "Planned",
      statusDot: "yellow",
    },
    {
      name: "Documentation for OpenAC v2",
      description:
        "Produce complete documentation for the OpenAC v2 specification.",
      status: "Planned",
      statusDot: "yellow",
    },
  ],
  later: [
    {
      name: "X.509 Certificate Support",
      description:
        "Implement support for X.509 certificates to enable use cases that rely on existing industry standards.",
      status: "Target Q3 2026",
      statusDot: "gray",
    },
    {
      name: "PQ-OpenAC Research",
      description:
        "Research post-quantum secure constructions for OpenAC verifiable presentations.",
      status: "Target Q3 2026",
      statusDot: "gray",
    },
  ],
  details: {
    description: [
      "Modular ZKP wallet unit aligned with EUDI",
      "Post-quantum secure verifiable presentations",
      "Drive Ethereum as identity trust layer",
    ],
    deliverables: [
      "Revised OpenAC paper",
      "Generalized predicates support",
      "OpenAC SDKs with full docs",
      "OpenAC v2 paper and documentation",
      "OpenAC SDK with generalized predicates",
      "mDOC/MDL and W3C VC format support",
      "Multi-VC linking",
      "Privacy-preserving revocation",
      "OpenAC ETSI profile",
      "X.509 Certificate support",
    ],
    impact: [
      "2 external OpenAC integrations (wallet, sandbox, or institution)",
      "2 external projects integrating our generalized predicates solution/SDK/library",
      "Inform revocation flow for 2 identity projects",
      "2 governments using Ethereum (or L2) as an identity trust registry",
      "OpenAC or ZKP standard inclusion in one identity framework",
    ],
  },
}
