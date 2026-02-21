import type { ProjectData } from "./mastermap-data"

export const ZKID: ProjectData = {
  id: "zkid",
  name: "zkID",
  category: "private-proving",
  status: "Research & development",
  statusVariant: "rd",
  completion: 25,
  description:
    "Privacy-preserving identity proofs. OpenAC wallet unit aligned with EUDI. ZK-friendly primitives.",
  href: "/mastermap/zkid",
  tags: ["Identity", "EUDI", "OpenAC", "Standards"],
  now: [
    {
      name: "Revocation Reports",
      description:
        "Publish Merkle Tree-Based report on PSE blog. Support the completion of the DIF Revocation report.",
      status: "In Progress",
      statusDot: "green",
    },
    {
      name: "Generalized Predicates",
      description:
        "Enable flexible, expressive, composable verification requests over verifiable credentials.",
      status: "In Progress",
      statusDot: "green",
    },
    {
      name: "OpenAC SDKs",
      description:
        "Publish SDKs with complete documentation for external integration.",
      status: "In Progress",
      statusDot: "green",
    },
    {
      name: "On-chain Verification",
      description:
        "Support EVM compatible on-chain verification of OpenAC proofs.",
      status: "In Progress",
      statusDot: "green",
    },
    {
      name: "EU Commission Engagement",
      description:
        "Presentations and workshops with European Commission on OpenAC.",
      status: "Ongoing",
      statusDot: "green",
    },
    {
      name: "OpenAC Paper",
      description:
        "Address community feedback, refine content, and publish a revised version.",
      status: "Completed",
      statusDot: "green",
    },
    {
      name: "Circom Optimization",
      description:
        "Improve efficiency, readability, and performance of existing circuits.",
      status: "Completed",
      statusDot: "green",
    },
  ],
  next: [
    {
      name: "EU Wallet Vendor Collaboration",
      description:
        "Technical collaboration with 1-2 EU wallet vendors. Integration testing with MODA/TWDIW.",
      status: "Planned",
      statusDot: "yellow",
    },
    {
      name: "X.509 Certificate Support",
      description:
        "Implement support for X.509 certificates to enable use cases that rely on existing industry standards.",
      status: "Planned",
      statusDot: "yellow",
    }
  ],
  later: [
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
      "X.509 Certificate support",
      "EVM compatible on-chain verification support",
    ],
    impact: [
      "2+ external integrations (wallet/sandbox/institution)",
      "2+ governments using Ethereum as identity registry",
      "ZKP standard inclusion in one identity framework",
    ],
  },
}
