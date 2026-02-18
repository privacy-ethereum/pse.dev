export interface RoadmapItem {
  name: string
  description: string
  status: string
  statusDot: "green" | "yellow" | "gray" | "blue"
}

export interface ProjectData {
  id: string
  name: string
  category: CategoryId
  status: string
  statusVariant: "active" | "rd" | "research" | "planned" | "production" | "ecosystem" | "maintenance"
  completion: number
  description: string
  href: string | null
  now: RoadmapItem[]
  next: RoadmapItem[]
  later: RoadmapItem[]
  tags: string[]
  details?: {
    description: string[]
    deliverables: string[]
    impact: string[]
  }
  kpis?: { label: string; target: string; status: string }[]
  projectUrl?: string
}

export type CategoryId =
  | "private-proving"
  | "private-writes"
  | "private-reads"

export interface Category {
  id: CategoryId
  name: string
  description: string
  color: string
  bgLight: string
  bgDark: string
}

// Category colors use anakiwa (site brand) shades for consistency with the rest of the site.
export const CATEGORIES: Category[] = [
  {
    id: "private-proving",
    name: "Private Proving",
    description: "Make proving any data private and accessible.",
    color: "#29ACCE",
    bgLight: "bg-anakiwa-50",
    bgDark: "dark:bg-anakiwa-975/30",
  },
  {
    id: "private-writes",
    name: "Private Writes",
    description:
      "Make private onchain actions as cheap and seamless as public ones.",
    color: "#1A8BAF",
    bgLight: "bg-anakiwa-100",
    bgDark: "dark:bg-anakiwa-975/30",
  },
  {
    id: "private-reads",
    name: "Private Reads",
    description:
      "Enable reads from Ethereum without revealing identity or intent.",
    color: "#50C3E0",
    bgLight: "bg-anakiwa-50",
    bgDark: "dark:bg-anakiwa-975/30",
  },
]

export const PROJECTS: ProjectData[] = [
  // ─── Private Proving ───
  {
    id: "csp",
    name: "Client-Side Proving (CSP)",
    category: "private-proving",
    status: "Active R&D",
    statusVariant: "rd",
    completion: 25,
    description:
      "Benchmark ZKP systems, bridge ecosystem gaps, push toward PQ-sound on-chain verification.",
    href: "/mastermap/csp",
    tags: ["Benchmarks", "Post-Quantum", "WHIR", "GPU Acceleration"],
    now: [
      {
        name: "Benchmark 15 zkVMs and ZKP systems",
        description:
          "Expand [benchmarking](https://github.com/privacy-ethereum/csp-benchmarks) to ECDSA, Poseidon, Poseidon2 and Keccak across 14 zkVMs and proof systems.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "WHIR-Based Systems Assessment",
        description:
          "Finish [SotA assessment](https://hackmd.io/@clientsideproving/whir-based) of WHIR-based ZKP systems. Author consultation for potential improvements.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "GPU-accelerated Jolt",
        description:
          "Apply mobile GPU acceleration to Jolt zkVM, targeting >20% proving improvement.",
        status: "In progress",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Small Field WHIR EVM Verifier",
        description:
          "Implement EVM WHIR verifier on 31-bit prime field and benchmark the gas cost.",
        status: "Planned",
        statusDot: "yellow",
      },
      {
        name: "PQ ZKP On-chain",
        description:
          "WHIR-based post-quantum sound ZKP system directly verifiable on-chain with <1.5M gas cost.",
        status: "Planned \u00b7 Critical path",
        statusDot: "yellow",
      },
      {
        name: "ZK Podcast",
        description:
          "Record ZK Podcast episode about CSP benchmarks to drive ecosystem awareness.",
        status: "Planned",
        statusDot: "gray",
      },
    ],
    later: [
      {
        name: "CSP Awards at Devcon",
        description:
          "Present summary of one year of benchmarking. Highlight best system in each category.",
        status: "Q4 2026",
        statusDot: "gray",
      },
      {
        name: "Zinc for zkID",
        description:
          "Benchmark Zinc integer arithmetic against existing zkID ECDSA implementation. Contingent on results.",
        status: "Contingent",
        statusDot: "blue",
      },
    ],
    details: {
      description: [
        "Credibly neutral benchmark source for the ecosystem",
        "Bridge gaps revealed by benchmark results",
        "Push adoption of PQ-sound proving systems",
      ],
      deliverables: [
        "Comprehensive benchmarks across 15 systems",
        "PQ client-side ZKP system verifiable on-chain (<1.5M gas)",
        "GPU-accelerated Jolt with >20% improvement",
      ],
      impact: [
        "Ecosystem uses benchmarks for informed decisions",
        "Post-quantum readiness for client-side ZKP",
        "Improved performance for mobile ZKP",
      ],
    },
    kpis: [
      {
        label: "WHIR EVM verification gas cost",
        target: "<1.5M gas (100+ bit security)",
        status: "In research",
      },
      {
        label: "Mobile GPU proving performance improvement",
        target: ">20% reduction",
        status: "In progress",
      },
      {
        label: "Ecosystem citations of benchmark results, per release",
        target: "10+",
        status: "Tracking",
      },
      {
        label: "Community benchmark contributions",
        target: "3+ per quarter",
        status: "Approached by Ligetron, Kakarot",
      },
    ],
  },
  {
    id: "mopro",
    name: "Mopro",
    category: "private-proving",
    status: "Active development",
    statusVariant: "active",
    completion: 20,
    description:
      "Mobile-first proving infrastructure. Native provers for Swift/Kotlin/RN/Flutter. GPU crypto libraries.",
    href: "/mastermap/mopro",
    tags: ["Mobile", "GPU Acceleration", "zkVM", "Taiwan PTT"],
    now: [
      {
        name: "Native Prover (Swift/Kotlin/RN/Flutter)",
        description:
          "Developers use Circom/Noir provers directly in native platforms without Rust toolchain setup.",
        status: "In progress \u00b7 ~2 months",
        statusDot: "green",
      },
      {
        name: "GPU Crypto Libs",
        description:
          "Community-owned ZK primitives libraries for client-side GPU. Foundation for future PQ proving.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "Taiwan PTT Collaboration",
        description:
          "Mobile + laptop native provers for Taiwan citizen ID verification. 100K+ users target.",
        status: "In progress \u00b7 Critical",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Mopro Pack (Plugin SDK)",
        description:
          "Plugin-level integration: consume prover as a functional SDK. Drop into existing stacks like Anon Aadhaar.",
        status: "Planned \u00b7 ~2 weeks",
        statusDot: "yellow",
      },
      {
        name: "zkVM Mobile Study",
        description:
          "Port Jolt/Nexus/RISC0 to ARM64 mobile. Profile thermal throttling, battery impact.",
        status: "Planned",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "GPU Best Practice Reference",
        description:
          "1-2 proving schemes with GPU acceleration. At least one PQ scheme. Mobile-specific optimizations.",
        status: "Q2-Q3 2026",
        statusDot: "gray",
      },
      {
        name: "Kohaku Mobile SDK",
        description:
          "Wrap Kohaku in Rust, package with mopro pack for mobile wallet integration.",
        status: "Backlog",
        statusDot: "gray",
      },
    ],
    details: {
      description: [
        "No complex Rust setup required for native mobile ZK",
        "Saves up to three major integration steps",
        "Foundation for client-side GPU proving ecosystem",
      ],
      deliverables: [
        "Native prover SDK (Swift, Kotlin, RN, Flutter)",
        "Community GPU crypto libraries",
        "Taiwan citizen ID verification (100K+ users)",
      ],
      impact: [
        "ZK proving dropped into mature codebases easily",
        "Harvest Now Decrypt Later defense via PQ GPU libs",
        "Mass adoption through mobile zkVM feasibility",
      ],
    },
  },
  {
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
  },
  {
    id: "machina",
    name: "Machina iO",
    category: "private-proving",
    status: "Research",
    statusVariant: "research",
    completion: 10,
    description:
      "Practical indistinguishability obfuscation. 2026 focus: noise refreshing, blind PRF over key-homomorphic encodings, \u226564-bit obfuscation, SNARK verification kickoff.",
    href: "/mastermap/machina",
    tags: ["iO", "GGH15", "Lattice", "FHE", "key-homomorphic"],
    now: [
      {
        name: "FHE multiplication over encodings",
        description:
          "Implement FHE multiplication over key-homomorphic encodings. Foundation for blind PRF; unlocks predicate encryption / LFE.",
        status: "Q1 2026 \u00b7 In progress",
        statusDot: "green",
      },
      {
        name: "Noise refreshing + dummy blind PRF",
        description:
          "Implement noise refreshing of GGH15 encodings with replaceable dummy blind PRF. Confirm parameter growth is polylogarithmic.",
        status: "Q2 2026",
        statusDot: "green",
      },
      {
        name: "Benchmark harness",
        description:
          "Circuit size/depth sensitivity and parameter-growth behavior. Set targets for real blind PRF circuit size.",
        status: "Q2 2026",
        statusDot: "yellow",
      },
      {
        name: "Noise refreshing paper",
        description:
          "Paper: noise refreshing construction and security proof (venue TBD).",
        status: "Q2 2026",
        statusDot: "yellow",
      },
    ],
    next: [
      {
        name: "Blind PRF over key-homomorphic encodings",
        description:
          "Circuit over encodings that simulates a PRF without revealing key or output. Replace dummy in noise refreshing.",
        status: "Q2\u2013Q3 2026 \u00b7 Critical",
        statusDot: "yellow",
      },
      {
        name: "\u226564-bit obfuscation",
        description:
          "End-to-end obfuscation and evaluation for \u226564 input bits. First practical iO beyond lookup-table scale.",
        status: "Q3 2026",
        statusDot: "yellow",
      },
      {
        name: "Devcon 2026",
        description:
          "Paper and presentation: first practical-performance iO for nontrivial input size.",
        status: "Q3 2026",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "SNARK verification over encodings",
        description:
          "Milestone 5 kickoff: PV vs DV scheme selection, verification circuit over key-homomorphic encodings. Continues into Q1 2027.",
        status: "Q4 2026",
        statusDot: "gray",
      },
      {
        name: "Collaboration: security \u00b7 efficiency",
        description:
          "Academic collaboration on cryptanalysis (all-product LWE, evasive LWE, encodings) and efficiency improvements.",
        status: "2026",
        statusDot: "gray",
      },
    ],
    details: {
      description: [
        "Execute 2026 critical path toward practical iO",
        "Noise refreshing in practice; real blind PRF; \u226564-bit obfuscation",
        "SNARK verification over encodings (kickoff Q4)",
      ],
      deliverables: [
        "FHE multiplication + noise refreshing (dummy then real blind PRF)",
        "First \u226564-bit obfuscation with reproducible benchmarks",
        "Noise refreshing + security proof paper; Devcon 2026 dissemination",
        "SNARK verification scheme selection and early prototype (Q4)",
      ],
      impact: [
        "First practical-performance iO for nontrivial input size",
        "Foundation for predicate encryption / LFE implementations",
        "Security and efficiency collaboration with academia",
      ],
    },
  },
  {
    id: "tlsnotary",
    name: "TLSNotary",
    category: "private-proving",
    status: "Active development",
    statusVariant: "active",
    completion: 15,
    description:
      "Cryptographic proofs of web data authenticity using TLS and MPC. Approaching production readiness.",
    href: "/mastermap/tlsnotary",
    tags: ["zkTLS", "MPC", "Attestation", "SDK"],
    now: [
      {
        name: "alpha-14",
        description: "Latest protocol release with updated benchmarks.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "SDK Preview",
        description:
          "Developer SDK preview for building on TLSNotary.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "FOSDEM Presentation",
        description: "Public communication: standard interfaces for zkTLS.",
        status: "Feb 1-2",
        statusDot: "yellow",
      },
    ],
    next: [
      {
        name: "Production Ready Protocol",
        description:
          "Production-grade protocol implementation. Scoping in progress.",
        status: "Planned \u00b7 Critical",
        statusDot: "yellow",
      },
      {
        name: "Full SDK",
        description: "Complete developer SDK with full documentation.",
        status: "Planned",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "Smart Contract Attestation",
        description:
          "Attestation workflow for on-chain verification of TLSNotary proofs.",
        status: "Scoping",
        statusDot: "gray",
      },
    ],
  },
  {
    id: "verifiable-compute",
    name: "Verifiable Compute",
    category: "private-proving",
    status: "Research & development",
    statusVariant: "rd",
    completion: 10,
    description:
      "Standard interface for verifiable computation in WebAssembly. Enables private applications to run in secure, isolated environments and use WASM as a portable compilation target for zkVMs without coupling to a specific proving system.",
    href: null,
    tags: ["WASM", "zkVM", "VOLE", "WIT", "Verifiable Compute"],
    now: [
      {
        name: "Interface requirements",
        description:
          "Research and define requirements for a verifiable compute interface (WIT, visibility semantics, host/guest boundary).",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "VOLE zkVM prototype",
        description:
          "Implement VOLE-based zkVM implementing the Verifiable Compute API. Target: web proof ecosystem and zkID.",
        status: "In progress",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Verifiable Compute SDK",
        description:
          "Prototype SDK for web and mobile (web extension, Kohaku integration; Mopro alignment for mobile).",
        status: "Planned",
        statusDot: "yellow",
      },
      {
        name: "VOLE zkVM benchmarks",
        description:
          "Benchmark VOLE zkVM against other CSP candidates (e.g. Ligetron).",
        status: "Planned",
        statusDot: "yellow",
      },
      {
        name: "TLSNotary integration",
        description:
          "Integrate VOLE zkVM into TLSNotary core protocol and Verifiable Compute SDK.",
        status: "Planned",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "Ecosystem feedback",
        description:
          "Solicit ecosystem feedback and encourage other proving systems to implement the interface.",
        status: "Q2 2026",
        statusDot: "gray",
      },
      {
        name: "Advanced zkVM features",
        description:
          "Oblivious control flow and ORAM for VOLE zkVM where needed.",
        status: "R&D",
        statusDot: "blue",
      },
    ],
  },

  // ─── Private Writes ───
  {
    id: "ptr",
    name: "Private Transfers (Research)",
    category: "private-writes",
    status: "Active R&D",
    statusVariant: "rd",
    completion: 20,
    description:
      "Plasmablind, Sonobe folding library, Wormholes v2, one-time programs and stealth mixers.",
    href: "/mastermap/ptr",
    tags: ["Plasmablind", "Sonobe", "Wormholes", "Folding"],
    now: [
      {
        name: "Plasmablind Paper",
        description:
          "Finish paper writeup. ~300-500 TPS with instant proving on low-end devices.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "Sonobe dev\u2192main merge",
        description:
          "Ship current dev branch with documented release, changelog, migration notes.",
        status: "In progress",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Sonobe Audit",
        description:
          "AI and human-assisted audit. Audit completion: report + fixes merged + final sign-off.",
        status: "Planned \u00b7 Critical",
        statusDot: "yellow",
      },
      {
        name: "Wormholes v2",
        description:
          "Redesign leveraging beacon chain deposits. Re-derive security goals.",
        status: "Research",
        statusDot: "blue",
      },
      {
        name: "Tokyo Meetup",
        description:
          "Mar 20 - Apr 20 collaboration with Intmax on sonobe and ideation.",
        status: "Planned",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "zERC-20",
        description:
          "Support Intmax on zERC-20 implementation using audited Sonobe.",
        status: "Q2 2026",
        statusDot: "gray",
      },
      {
        name: "OTP / Stealth Mixers",
        description:
          "Mixers using one-time programs with garbled circuits and extractable witness encryption.",
        status: "Research",
        statusDot: "blue",
      },
    ],
  },
  {
    id: "pte",
    name: "Private Transfers (Engineering)",
    category: "private-writes",
    status: "Active development",
    statusVariant: "active",
    completion: 15,
    description:
      "Benchmark protocols, prototype L2 precompiles, gas analysis, specify native shielded pools.",
    href: "/mastermap/pte",
    tags: ["L2 Precompiles", "Benchmarks", "RIPs", "Shielded Pools"],
    now: [
      {
        name: "Protocol Benchmarks",
        description:
          "Comprehensive benchmarks: cost and speed metrics for 2-3 protocols per technology category.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "OP-stack Setup",
        description:
          "Run all OP stack components. Add test precompile to understand implementation mechanism.",
        status: "Planned",
        statusDot: "yellow",
      },
    ],
    next: [
      {
        name: "State of Private Transfers",
        description:
          "Comprehensive landscape report. Benchmarks + analysis. Social media campaign.",
        status: "Planned \u00b7 Critical",
        statusDot: "yellow",
      },
      {
        name: "L2 Precompiles (2-3)",
        description:
          "Implement 2-3 native changes (MVP: 1). Fuzz testing. Gas cost analysis for DoS protection.",
        status: "Planned \u00b7 Critical",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "RIP Proposals",
        description:
          "Propose precompile changes as Rollup Improvement Proposals.",
        status: "Q3 2026",
        statusDot: "gray",
      },
      {
        name: "L2 Shielded Pool Spec",
        description:
          "Specification for native shielded pool: note-based vs account-based, deposit/transfer/withdraw.",
        status: "Q2-Q3 2026",
        statusDot: "gray",
      },
    ],
  },
  {
    id: "iptf",
    name: "IPTF",
    category: "private-writes",
    status: "Active",
    statusVariant: "active",
    completion: 10,
    description:
      "Institutional Privacy Task Force. PoCs, architecture reviews, workshops, market map.",
    href: "/mastermap/iptf",
    tags: ["Institutional", "PoCs", "Workshops", "Market Map"],
    now: [
      {
        name: "PoCs (2-3)",
        description:
          "3 weeks dev time per PoC. Usable demo slices. Validate institutional demand for privacy.",
        status: "Planned",
        statusDot: "yellow",
      },
      {
        name: "Architecture Reviews",
        description:
          "Phased technical review of confidentiality architectures across blockchain ecosystems.",
        status: "Planned",
        statusDot: "yellow",
      },
      {
        name: "Workshops (2-3)",
        description:
          "Targeted engagement with institutional stakeholders. Capture constraints and build trust.",
        status: "Planned",
        statusDot: "yellow",
      },
    ],
    next: [
      {
        name: "Privacy Market Map Updates",
        description:
          "Keep the market map growing. Maintain contribution momentum.",
        status: "Ongoing",
        statusDot: "green",
      },
      {
        name: "Reports & Specifications",
        description:
          "Explainer documents building toward \"State of Institutional Privacy\" marquee report.",
        status: "Planned",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "State of Institutional Privacy",
        description:
          "Marquee report with benchmarks, comparisons, and institutional landscape analysis.",
        status: "H2 2026",
        statusDot: "gray",
      },
    ],
  },

  // ─── Private Reads ───
  {
    id: "pir",
    name: "PIR",
    category: "private-reads",
    status: "Active R&D",
    statusVariant: "rd",
    completion: 20,
    description:
      "PIR schemes tailored for Ethereum state and history. Optimized for wallets, frontends, tax software, dApps.",
    href: "/mastermap/pir",
    tags: ["PIR", "Private state"],
    now: [
      {
        name: "PIR Systems (2-4 schemes)",
        description:
          "PIR schemes tailored for Ethereum state and history. Optimized for wallets, frontends, tax software, dApps.",
        status: "In progress \u00b7 Critical",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "PIR Integration",
        description: "\u22651 integration with wallet and/or light client.",
        status: "Planned",
        statusDot: "yellow",
      },
    ],
    later: [],
  },
  {
    id: "ubt",
    name: "UBT",
    category: "private-reads",
    status: "Active R&D",
    statusVariant: "rd",
    completion: 15,
    description:
      "Provably L1-equivalent EL node using UBT data structure. MPT-equivalent.",
    href: "/mastermap/ubt",
    tags: ["UBT", "EIP7864", "Execution layer"],
    now: [
      {
        name: "UBT Node (EIP7864)",
        description:
          "Provably L1-equivalent EL node using UBT data structure. MPT-equivalent.",
        status: "In progress",
        statusDot: "green",
      },
    ],
    next: [],
    later: [],
  },
  {
    id: "tor-in-js",
    name: "Tor in JS",
    category: "private-reads",
    status: "Active R&D",
    statusVariant: "rd",
    completion: 20,
    description:
      "Arti Tor client in-browser for anonymized RPC. Kohaku integration for plug-in anonymous routing in wallets and frontends.",
    href: "/mastermap/tor-in-js",
    projectUrl: "/projects/tor-in-js",
    tags: ["Arti", "Tor", "Kohaku"],
    now: [
      {
        name: "Arti in-browser",
        description:
          "Tor client running in browser for anonymized RPC calls from wallets and frontends.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "Kohaku Integration",
        description:
          "Integrate Arti with Kohaku and at least one wallet SDK for plug-in anonymous routing.",
        status: "In progress",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Privacy Dashboard",
        description:
          "Showcase privacy affordances and adoption of anonymized routing in wallets and RPC providers.",
        status: "Planned",
        statusDot: "yellow",
      },
      {
        name: "Spotlight Series",
        description: "2-5 articles communicating privacy to the public.",
        status: "Planned",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "Certification Badges",
        description:
          "Standardize certification badges of privacy adherence for wallets, frontends, RPC providers.",
        status: "Q2 2026",
        statusDot: "gray",
      },
      {
        name: "Wallet SDK Privacy",
        description:
          "Drive integration of Arti for network-level-private RPC calls in wallet SDKs.",
        status: "Q2 2026",
        statusDot: "gray",
      },
    ],
  },
]
