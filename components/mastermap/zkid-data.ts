import type { ProjectData } from "./mastermap-data"

export const ZKID: ProjectData = {
  id: "zkid",
  name: "zkID",
  category: "private-proving",
  status: "Research & development",
  statusVariant: "rd",
  completion: 15,
  description:
    "Privacy-preserving identity proofs. OpenAC wallet unit aligned with EUDI. ZK-friendly primitives.",
  href: "/mastermap/zkid",
  tags: ["Identity", "EUDI", "OpenAC", "Standards"],
  now: [
    {
      name: "OpenAC Paper",
      description:
        "Address community feedback, refine explanations and strengthen the paper.",
      status: "In progress",
      statusDot: "green",
    },
    {
      name: "Revocation Reports",
      description:
        "Publish Merkle Tree-Based report on PSE blog. Wrap up DIF Grant Revocation report.",
      status: "In progress",
      statusDot: "green",
    },
    {
      name: "EU Commission Engagement",
      description:
        "Presentations and workshops with European Commission on OpenAC.",
      status: "Ongoing",
      statusDot: "green",
    },
  ],
  next: [
    {
      name: "Generalized Predicates",
      description:
        "Enable flexible, expressive, composable verification requests over verifiable credentials.",
      status: "Planned \u00b7 Critical path",
      statusDot: "yellow",
    },
    {
      name: "OpenAC SDKs",
      description:
        "Publish SDKs with complete documentation for external integration.",
      status: "Planned",
      statusDot: "yellow",
    },
    {
      name: "EU Wallet Vendor Collaboration",
      description:
        "Technical collaboration with 1-2 EU wallet vendors. Integration testing with MODA/TWDIW.",
      status: "Planned",
      statusDot: "yellow",
    },
  ],
  later: [
    {
      name: "Circom Optimization",
      description:
        "Improve efficiency, readability, and performance of existing circuits.",
      status: "Planned",
      statusDot: "gray",
    },
    {
      name: "Member State Pilot",
      description:
        "Pilot testing with EU member states for real-world deployment.",
      status: "Target H2 2026",
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
    ],
    impact: [
      "2+ external integrations (wallet/sandbox/institution)",
      "2+ governments using Ethereum as identity registry",
      "ZKP standard inclusion in one identity framework",
    ],
  },
}
