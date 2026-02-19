import type { ProjectData } from "./mastermap-data"

export const TLSNOTARY: ProjectData = {
  id: "tlsnotary",
  name: "TLSNotary",
  category: "private-proving",
  status: "Active development",
  statusVariant: "active",
  completion: 75,
  description:
    "Cryptographic proofs of web data authenticity using TLS and MPC. On track toward 1.0 release.",
  href: "/mastermap/tlsnotary",
  tags: ["zkTLS", "MPC", "SDK"],
  now: [
    {
      name: "Proxy Mode",
      description:
        "TLS proxy that generates attestations without requiring MPC. Simpler setup, lower latency, but more trust assumptions.",
      status: "In progress",
      statusDot: "green",
    },
    {
      name: "Stabilization",
      description:
        "Resolve open issues, MPZ cleanup, and upgrade all RustCrypto dependencies.",
      status: "In progress",
      statusDot: "green",
    },
    {
      name: "Benchmarks",
      description:
        "Fully automated benchmarks across native and browser environments.",
      status: "In progress",
      statusDot: "green",
    },
    {
      name: "SDK",
      description:
        "TLSNotary on Web/Mobile",
      status: "In progress",
      statusDot: "green",
    },
    {
      name: "CI / Docs / Demos / Support",
      description:
        "CI improvements, documentation, demos, reference implementations, and integration support.",
      status: "Ongoing",
      statusDot: "green",
    },
    {
      name: "AI-assisted Security Review",
      description:
        "Internal security review of each crate using AI-assisted tooling.",
      status: "In progress",
      statusDot: "green",
    },
  ],
  next: [
    {
      name: "TLS 1.3",
      description:
        "Implement TLS 1.3 MPC KDF and full TLS 1.3 support.",
      status: "Stretch goal",
      statusDot: "blue",
    },
    {
      name: "VOLE-zkVM Integration",
      description:
        "Integrate VOLE-based zkVM into the TLSNotary core protocol.",
      status: "H2 2026",
      statusDot: "yellow",
    },
    {
      name: "Production Ready Protocol",
      description:
        "1.0 release with production-grade protocol. Publish crates to crates.io.",
      status: "H2 2026 · Critical",
      statusDot: "yellow",
    },
    {
      name: "Smart Contract Attestation",
      description:
        "Attestation workflow for on-chain verification of TLSNotary proofs.",
      status: "Scoping",
      statusDot: "gray",
    },
  ],
  later: [
    {
      name: "Standard Interfaces for zkTLS",
      description:
        "Define and publish standard interfaces for the zkTLS ecosystem.",
      status: "H2 2026",
      statusDot: "yellow",
    },
  ],
  details: {
    description: [
      "TLSNotary is an open-source protocol that can verify the authenticity of TLS data with users in full control of their privacy",
      "SDK for Web, Mobile, and native integrations",
    ],
    deliverables: [
      "Rust implementation of stabilized MPC-TLS and Proxy protocol",
      "SDK for Web/Mobile",
      "Benchmarks",
    ],
    impact: [
      "Make Web2 data verifiably portable with full control over privacy",
      "On-chain verification of attested web data",
    ],
  },
}
