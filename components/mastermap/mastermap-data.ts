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
    description?: string[]
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
  url?: string
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
      "Protect Ethereum users from leaking [who](https://privreads.ethereum.foundation/workstreams/torjs) they are and [what](https://privreads.ethereum.foundation/workstreams/pir) they are reading from the Ethereum [state](https://privreads.ethereum.foundation/workstreams/ubt/).",
    color: "#50C3E0",
    bgLight: "bg-anakiwa-50",
    bgDark: "dark:bg-anakiwa-975/30",
    url: "https://privreads.ethereum.foundation",
  },
]

import { TLSNOTARY } from "./tlsnotary-data"
import { ZKID } from "./zkid-data"

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
    tags: ["Benchmarks", "Post-quantum", "WHIR", "GPU Accel"],
    now: [
      {
        name: "Benchmark 24 zkVMs",
        description:
          "Expand benchmarking to SHA256, ECDSA, Poseidon2, Keccak across 24 zkVMs and proof systems.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "WHIR Assessment",
        description:
          "Finish SotA assessment of WHIR-based ZKP systems. Author consultation for potential improvements.",
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
        name: "KoalaBear Verifier",
        description:
          "Refactor WHIR verifier for KoalaBear field. Smaller field enables gas cost optimizations.",
        status: "Planned",
        statusDot: "yellow",
      },
      {
        name: "PQ ZKP On-chain",
        description:
          "Post-quantum sound ZKP system directly verifiable on-chain with <1.5M gas verification.",
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
        "Comprehensive benchmarks across 24 systems",
        "PQ ZKP system verifiable on-chain (<1.5M gas)",
        "GPU-accelerated Jolt with >20% improvement",
      ],
      impact: [
        "Ecosystem uses benchmarks for informed decisions",
        "Post-quantum readiness for Ethereum proofs",
        "Client-side proving becomes practical on mobile",
      ],
    },
    kpis: [
      {
        label: "Verification gas cost",
        target: "<1.5M gas (100+ bit security)",
        status: "In research",
      },
      {
        label: "GPU proving improvement",
        target: ">20% reduction",
        status: "In progress",
      },
      {
        label: "Ecosystem citations per release",
        target: "10+",
        status: "Tracking",
      },
      {
        label: "Community contributions",
        target: "3+ per quarter",
        status: "Approached by gnark, Kakarot",
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
    tags: ["Mobile", "GPU", "zkVM"],
    now: [
      {
        name: "Native Prover (Swift/Kotlin/RN/Flutter)",
        description:
          "Developers use Circom/Noir provers directly in native platforms without Rust toolchain setup.",
        status: "Done",
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
        name: "ZK-Based Human Verification at Scale",
        description:
          "Native mobile and desktop provers powering privacy-preserving human verification using government-grade identity credentials. Designed for real-world adoption, with an initial rollout targeting 100,000+ verified users.",
        status: "In progress \u00b7 Critical",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Noir version upgrade",
        description:
          "Upgrade Noir version to the latest stable release, ensuring compatibility with the latest features and improvements.",
        status: "Planned \u00b7 ~2 weeks",
        statusDot: "yellow",
      },
      {
        name: "TWDIW Integration",
        description:
          "Provides a PoC showcasing OpenAC × TWDIW privacy-preserving age verification solution for online alcohol purchases in Taiwan.",
        status: "Planned \u00b7 ~2 weeks",
        statusDot: "yellow",
      },
      {
        name: "AI refactor",
        description:
          "Leverage AI to refactor mopro, enhancing code quality, maintainability, and overall developer experience.",
        status: "Planned \u00b7 ~1 month",
        statusDot: "yellow",
      },
      {
        name: "Mopro Pack (Plugin SDK)",
        description:
          "Plugin-level integration: consume prover as a functional SDK. Drop into existing stacks like Anon Aadhaar.",
        status: "Planned \u00b7 ~2 weeks",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "GPU Best Practice Reference",
        description:
          "1-2 proving schemes with GPU acceleration. At least one PQ scheme. Mobile-specific optimizations.",
        status: "Planned \u00b7 ~2 month",
        statusDot: "gray",
      },
      {
        name: "zkVM Mobile Study",
        description:
          "Port Jolt/Nexus/RISC0 to ARM64 mobile. Profile thermal throttling, battery impact.",
        status: "Planned \u00b7 ~1 month",
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
  ZKID,
  TLSNOTARY,
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
    id: "machina",
    name: "Machina iO",
    category: "private-writes",
    status: "Research",
    statusVariant: "research",
    completion: 20,
    description:
      "Practical indistinguishability obfuscation. 2026 focus: noise refreshing, blind PRF over key-homomorphic encodings, \u226564-bit obfuscation, SNARK verification kickoff.",
    href: "/mastermap/machina",
    tags: ["iO", "Lattice", "key-homomorphic encodings", "FHE", "GGH15"],
    now: [
      {
        name: "FHE multiplication over key-homomorphic encodings",
        description:
          "Implement FHE multiplication over key-homomorphic encodings. Foundation for blind PRF; unlocks predicate encryption / LFE.",
        status: "Q1 2026 \u00b7 The FHE multiplication circuit compatible with key-homomorphic encodings has been implemented. A further optimization and the evaluation of the circuit over the encodings is underway.",
        statusDot: "green",
      },
      {
        name: "A paper on a new lookup table evaluation method over key-homomorphic encodings and low-depth modulo operation circuits",
        description: "Publish a paper detailing a new method for evaluating lookup tables over key-homomorphic encodings, along with low-depth modulo operation circuits.",
        status: "Q2 2026 \u00b7 The method and the circuit have been implemented, and the paper is in the process of being written.",
        statusDot: "green",
      },
      {
        name: "Noise refreshing with a dummy blind PRF",
        description:
          "Implement noise refreshing of GGH15 encodings with replaceable dummy blind PRF. Confirm parameter growth is polylogarithmic.",
        status: "Q2 2026 \u00b7 The noise refreshing with a dummy blind PRF has not been implemented yet, but the high-level design has been finalized.",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Blind PRF over key-homomorphic encodings",
        description:
          "Implement a circuit compatible with key-homomorphic encodings that simulates a PRF without revealing key or output. The circuit will be used to replace the dummy blind PRF in the noise refreshing construction.",
        status: "Q2\u2013Q3 2026 \u00b7 The circuit is expected to be implementable by combining the gadgets implemented in Q1 2026, although further efficiency improvements and careful parameter tuning are still needed.",
        statusDot: "yellow",
      },
      {
        name: "Diamond iO 2",
        description: "Implement the next version of the diamond iO, which will support a larger input size without compromising efficiency. A paper describing the construction and its security proof will be published as well.",
        status: "Q3 2026",
        statusDot: "yellow",
      },
      {
        name: "Devcon 2026: obfuscation for nontrivial input size",
        description:
          "Demo and presentation: the first practical-performance iO for nontrivial input size (e.g., 64 input bits), or its concrete estimation of the required hardware costs and performance.",
        status: "Q3 2026",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "SNARK verification over key-homomorphic encodings",
        description:
          "Start implementing a SNARK verification circuit over key-homomorphic encodings. Continues into Q1 2027.",
        status: "Q4 2026",
        statusDot: "gray",
      },
    ],
    details: {
      description: [
        "Improve efficiency of key-homomorphic encodings to enable blind PRF and noise refreshing",
        "Diamond iO 2, supporting larger input sizes without compromising efficiency",
        "SNARK verification over key-homomorphic encodings (kickoff Q4)",
      ],
      deliverables: [
        "Implementation of FHE multiplication + blind FHE over key-homomorphic encodings, along with noise refreshing",
        "Implementation of obfuscation with a 64-bit input size or its concrete estimation of the required hardware costs and performance",
        "Papers on the new lookup table evaluation method and low-depth circuit in Q2 and the next diamond iO construction in Q3",
        "Concrete specs for the SNARK verification circuit compatible with key-homomorphic encodings",
      ],
      impact: [
        "First practical-performance iO for nontrivial input size",
        "Foundation for practical implementations of key-homomorphic encodings",
        "Security and efficiency collaboration with academia",
      ],
    },
  },
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
      "Analyse protocols, measure gas cost of protocols, explore privacy standardisation",
    href: "/mastermap/pte",
    tags: ["State of Private Transfers", "Gas Benchmarks", "ERCs", "ERC20s"],
    now: [
      {
        name: "Protocol Analysis",
        description:
          "Comprehensive analysis: analyse 2-3 protocols per technology category against a set of set of criteria.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "Protocol Benchmarks",
        description:
          "Comprehensive benchmarks: cost and speed metrics for 2-3 protocols per technology category.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "Explore Approaches to ERC20 Transfer Anonymity",
        description:
          "Explore approaches to ERC20 token transfer anonymity to compliment existing confidentiality standards. Open to explore privacy standardisation beyond this scope should compelling opportunities exist.",
        status: "In progress",
        statusDot: "green",
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
        name: "Build Standards",
        description:
          "If explorations into standardisation feaibility are successful, build ERC(s) with other teams.",
        status: "Planned \u00b7 Critical",
        statusDot: "yellow",
      },
      {
        name: "Gather Standard Feedback and Requirements",
        description:
          "Standardisation requires user feedback and understanding of DeFi protocol interactions. Research and build requirements into any work.",
        status: "Planned \u00b7 Critical",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "Promote ERC(s)",
        description:
          "Promote ERC(s) along with teams we have worked with.",
        status: "Planned \u00b7 Critical",
        statusDot: "yellow",
      },
    ],
  },
  {
    id: "iptf",
    name: "IPTF",
    category: "private-writes",
    status: "Active",
    statusVariant: "active",
    completion: 40,
    description:
      "Institutional Privacy Task Force. PoCs, architecture reviews, workshops, market map.",
    href: "/mastermap/iptf",
    tags: ["Institutional", "PoCs", "Workshops", "Market Map"],
    now: [
      {
        name: "PoCs (7 shipped)",
        description:
          "Private Bonds (3 approaches: UTXO+ZK, Aztec L2, FHE), Private Transfers (shielded pool), Plasma Stablecoins, DIY Validium (RISC Zero), TEE Cross-Chain Atomic Swap. Each with blog write-up and open-source code.",
        status: "Done",
        statusDot: "green",
      },
      {
        name: "Privacy Market Map v0.3.0",
        description:
          "Open-source knowledge base: 58 patterns, 12 approaches, 25 vendors, 22 use cases. CROPS evaluation framework, CI validation, external contributions.",
        status: "Done · Ongoing",
        statusDot: "green",
      },
      {
        name: "Blog Series (10 posts)",
        description:
          "Published on iptf.ethereum.org: Private Bonds (3 parts), Public Rails vs Private Ledgers, Private Transfers, Plasma Stablecoins, DIY Validium, TEE Atomic Swap (2 parts), Cypherpunk & Institutional Privacy.",
        status: "Done",
        statusDot: "green",
      },
      {
        name: "Workshops & Engagement",
        description:
          "3 workshops delivered. Reached 14 financial institutions, 17 tech companies, 9 government orgs. 33% conversion rate on institutional outreach.",
        status: "Done · Ongoing",
        statusDot: "green",
      },
      {
        name: "Survive Track (3 PoCs)",
        description:
          "Adversarial resilience sprint testing I2U protections: escape hatches, force withdrawal, rugpull protection. Feeds directly into CROPS I2U scoring.",
        status: "In progress",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Guide v0 (Web Product)",
        description:
          "Persona-routed web app on iptf.ethereum.org. Pattern cards with CROPS visuals. Approach pages as case studies. Entry points for Legal, Risk, Business, and Technical personas.",
        status: "Mid-May 2026 · Critical",
        statusDot: "yellow",
      },
      {
        name: "PoCs (3-4 new)",
        description:
          "Mix of institutional and resilience PoCs. Candidates: encrypted mempool, PIR in shielded pool, private money market fund, private derivatives, PQ shielded pool.",
        status: "Q2 2026",
        statusDot: "yellow",
      },
      {
        name: "End-User Privacy Protections",
        description:
          "Map patterns that cover end-user privacy against institutions: escape hatches, force withdrawal, rugpull protection, viewing-key limits.",
        status: "Q2 2026",
        statusDot: "yellow",
      },
      {
        name: "Workshops & Institutional Engagement",
        description:
          "2+ workshops lined up, plus deeper second-tier engagements. Broadening reach to governments, NGOs, and central banks alongside financial institutions. Push for public collaboration announcements. Expand communications beyond crypto Twitter to LinkedIn and business journals.",
        status: "Q2 2026",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "Specifications Repository",
        description:
          "Formal specification lifecycle for institutional privacy primitives. Scope decision pending: institutional specs vs broader access layer specs.",
        status: "H2 2026",
        statusDot: "gray",
      },
      {
        name: "State of Institutional Privacy",
        description:
          "~50-page marquee report: use cases, approaches, PoC summaries, benchmarks. Physical copies for Devcon.",
        status: "H2 2026",
        statusDot: "gray",
      },
    ],
    details: {
      description: [
        "Help institutions and enterprises adopt Ethereum with robust privacy protections",
        "Turn the privacy market map into a product: guide, one-pagers, reports as projections of a single source of truth",
        "Expand coverage to protect end users against institutional adversaries",
      ],
      deliverables: [
        "7 PoCs shipped in Q1 with 10 blog posts and open-source code",
        "Guide v0 on iptf.ethereum.org with persona-routed entry points",
        "End-user protection patterns and resilience PoCs",
      ],
      impact: [
        "Institutions have concrete, open-source references for building privacy on Ethereum",
        "Ecosystem has a credibly neutral, verified map of privacy solutions and trade-offs",
        "End-user protections proven in code alongside institutional privacy",
      ],
    },
    kpis: [
      {
        label: "PoCs shipped",
        target: "7 in Q1, ~5 in Q2",
        status: "Q1 done · Q2 in progress",
      },
      {
        label: "Map coverage",
        target: "58 patterns, 25 vendors",
        status: "Ongoing",
      },
      {
        label: "Institutional engagement",
        target: "Governments, NGOs, FIs",
        status: "Expanding",
      },
      {
        label: "Workshops per quarter",
        target: "2-3",
        status: "On track",
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
    completion: 35,
    description:
      "[PIR schemes](https://privreads.ethereum.foundation/workstreams/pir) tailored for Ethereum state and history. Sharded multi-engine design that allows Ethereum users to read chain data from remote servers without revealing what they queried.",
    href: "/mastermap/pir",
    tags: ["PIR", "Sharded PIR", "GPU", "Ethereum state"],
    now: [
      {
        name: "LeanPIR (GPU-accelerated)",
        description:
          "[New scheme](https://privreads.ethereum.foundation/feed/update-march-2026). Sub-second preprocessing on a 32 GB database and ~30 ms response time. Productionizing with GPU acceleration via external collaborators.",
        status: "Q2 2026 · Critical",
        statusDot: "green",
      },
      {
        name: "Sharded PIR design",
        description:
          "Flesh out the multi-engine sharded architecture with ≥2 inaugural schemes; builds on our [sharded PIR design](https://privreads.ethereum.foundation/feed/sharded-pir-design) for Ethereum state.",
        status: "Q2 2026",
        statusDot: "green",
      },
      {
        name: "VIA in Rust",
        description:
          "Port VIA from [Pythonic specs](https://github.com/turanzv/via-spec) to a Rust reference implementation; feeds into the sharded harness and benchmark comparisons.",
        status: "Q2 2026",
        statusDot: "green",
      },
      {
        name: "Balance-retrieval demo",
        description:
          "End-to-end demo of ETH balance retrieval over LeanPIR, targeted at wallet integration.",
        status: "Q2 2026",
        statusDot: "green",
      },
      {
        name: "Reproducible benchmarks",
        description:
          "[Reproducible harness](https://privreads.ethereum.foundation/docs/pir-benchmarks/) comparing PIR schemes via a mix of reported data, independent replication, and benchmarking under unified test vectors.",
        status: "Ongoing",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "LeanPIR paper",
        description:
          "Academic paper on LeanPIR and its GPU acceleration. EuroTT workshop keynote targeted for May 2026.",
        status: "Q2 2026",
        statusDot: "yellow",
      },
      {
        name: "GPU multi-collaborator scale-up",
        description:
          "Multi-GPU (100+ GB scale) collaboration with external researchers (Seoul National University, Illinois) — microgrants and co-authorship.",
        status: "Q2–Q3 2026",
        statusDot: "yellow",
      },
      {
        name: "PIR integration in wallet / light client",
        description:
          "Ad-hoc LeanPIR demo integrated into a wallet and/or light client.",
        status: "Q3 2026 · Critical",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "[E2E](https://ethresear.ch/t/sharded-pir-design-for-the-ethereum-state/24552#p-59339-h-7-universal-pir-interface-17) sharded PIR on Ethereum state",
        description:
          "End-to-end sharded PIR with ≥2 schemes over a non-trivial amount of Ethereum state data. Stretch carried from Q2.",
        status: "H2 2026",
        statusDot: "gray",
      },
      {
        name: "Archival-state snarkification",
        description:
          "Technical post on snarkifying archival state to reduce database size, enabling smaller PIR servers.",
        status: "Q3 2026",
        statusDot: "gray",
      },
      {
        name: "PIR ↔ Statelessness",
        description:
          "Exploring PIR served from Ethereum nodes and how that will work depending on the statelessness route taken by the protocol.",
        status: "2027",
        statusDot: "gray",
      },
    ],
    details: {
      deliverables: [
        "Sharded PIR design fleshed out with ≥2 inaugural schemes",
        "LeanPIR paper + GPU-accelerated reference implementation",
        "VIA in Rust based on Pythonic specs",
        "ETH balance-retrieval demo over LeanPIR",
      ],
      impact: [
        "Users can fetch account state without revealing what they queried, while expressing their queries using the same Ethereum RPC standard",
        "Developers get a unified and stable PIR interface",
        "[Sharded](https://ethresear.ch/t/sharded-pir-design-for-the-ethereum-state/24552#p-59339-h-51-sharding-13) design and other [optimizations](https://ethresear.ch/t/sharded-pir-design-for-the-ethereum-state/24552#p-59339-h-8-ongoing-research-optimizations-18) bring PIR closer to practical overall efficiency",
      ],
    },
    kpis: [
      {
        label: "% of Ethereum state servable via PIR",
        target: "Under practical overheads",
        status: "Ongoing, various promising schemes for different slices",
      },
    ],
  },
  {
    id: "access-layer",
    name: "Anonymization Access Layer",
    category: "private-reads",
    status: "Active R&D",
    statusVariant: "rd",
    completion: 10,
    description:
      "Pluggable abstraction over anonymization networks (onion nets, mixnets, or any other). The edge ([in-browser] wallets, SDKs, light-clients, ..) can swap networks without app-layer changes.",
    href: "/mastermap/access-layer",
    tags: ["Access Layer", "WebRTC", "Mixnet", "Onion routing"],
    now: [
      {
        name: "Architecture sketch",
        description:
          "Design sketch (not implementation) for the access-layer abstraction; consulting Will (Protocol Labs, original Snowflake author) and peers on P2P + consensus-driven dialing.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "WebRTC transport kit",
        description:
          "Foundational transport for the [access layer](https://privreads.ethereum.foundation/code) — connectivity from the edge (browsers, wallets) to a range of infrastructure: PIR servers, anonymity-network nodes (Tor, mixnets), and Ethereum p2p nodes. Born from [embedding Arti in the browser](https://privreads.ethereum.foundation/feed/embedding-arti-in-the-browser), then generalized; same wire behavior across TorJS, Geth (in-process go-webrtc), other EL clients, and Rust-based mixnet nodes.",
        status: "In progress",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Publish design sketch",
        description:
          "Publish the access-layer architecture sketch, with a companion community post inviting feedback. Share at an engineering monthly to convene wallets, SDKs, and anonymization-network maintainers around a common interface.",
        status: "Q2 2026",
        statusDot: "yellow",
      },
      {
        name: "Reference transport spec",
        description:
          "Unified WebRTC transport spec usable identically from browser (WebRTC API) and Node.js (go-webrtc), with standardized WASM-binary validation across networks.",
        status: "Q2 2026",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "Lean verifiable software integration",
        description:
          "Dip into Lean / formal methods for critical access-layer plumbing; early exploration of verified builds for privacy primitives.",
        status: "Exploratory",
        statusDot: "blue",
      },
    ],
    details: {
      deliverables: [
        "Access-layer design sketch + community feedback",
        "WebRTC transport PoC across TorJS and Geth",
      ],
      impact: [
        "Apps are not bound to a single anonymization network; users and integrators can choose",
        "Ethereum RPC traffic becomes routable over any anonym. network (onion, mixnet, or any other)",
        "Censorship and centralized RPC outages no longer take wallets offline",
      ],
    },
  },
  {
    id: "ubt",
    name: "Verifiable UBT",
    category: "private-reads",
    status: "Active R&D",
    statusVariant: "rd",
    completion: 25,
    description:
      "Provably L1-equivalent execution-layer node using a [Unified Binary Tree](https://privreads.ethereum.foundation/workstreams/ubt) ([EIP-7864](https://eips.ethereum.org/EIPS/eip-7864)). MPT-equivalent state with a zk-friendlier structure, used as a base by light clients and PIR services that need provable state transitions.",
    href: "/mastermap/ubt",
    tags: ["UBT", "EIP7864", "EL Clients", "PIR"],
    now: [
      {
        name: "UBT sidecar on Geth",
        description:
          "Geth-based UBT node syncing mainnet. Most RPCs implemented; eth_call and debug_executionWitness pending. Blocked on inefficient binary-MPT conversion — upstream optimization work ongoing.",
        status: "In progress · Carried from Q1",
        statusDot: "green",
      },
      {
        name: "UBT on Ethrex",
        description:
          "Rust EL client path, kicked off late Q1 via Lambdaclass PR. Preferred long-term for its Rust toolchain and zkVM-proving story.",
        status: "In progress",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Shadow chain sync to mainnet",
        description:
          "UBT shadow chain fully sync'd to mainnet head, producing MPT-equivalent state roots per block — validates the conversion pipeline under real load.",
        status: "Q2 2026 · Critical",
        statusDot: "yellow",
      },
      {
        name: "Remaining RPC parity",
        description:
          "Implement eth_call and debug_executionWitness parity with MPT-backed Geth so UBT can back a full-featured node.",
        status: "Q2 2026",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "zkVM proving of UBT transitions",
        description:
          "Recursive zkVM proof chain that UBT state updates match MPT updates per block.",
        status: "Q3 2026",
        statusDot: "gray",
      },
      {
        name: "UBT↔PIR integration",
        description:
          "PIR servers and clients lean on provable UBT state — no need to trust the serving node.",
        status: "Contingent",
        statusDot: "blue",
      },
    ],
    details: {
      deliverables: [
        "Fully sync'd UBT sidecar node on Geth and/or Ethrex",
        "Recursive zkVM proof chain from genesis to head",
        "MPT↔UBT comparison tooling",
      ],
      impact: [
        "PIR services can rely on provable state without trusting a node",
        "Light clients can verify state from genesis with a single proof chain",
        "A concrete step toward stateless L1 execution",
      ],
    },
    kpis: [
      {
        label: "Mainnet-sync'd shadow chain",
        target: "Q2 2026",
        status: "Geth + Ethrex paths in flight",
      },
      {
        label: "RPC parity",
        target: "All RPCs (incl. eth_call, debug_executionWitness)",
        status: "Blocked by node UBT-readiness",
      },
    ],
  },
  {
    id: "tor-js",
    name: "TorJS",
    category: "private-reads",
    status: "Production",
    statusVariant: "production",
    completion: 50,
    description:
      "[Arti](https://privreads.ethereum.foundation/feed/embedding-arti-in-the-browser) — Tor's official Rust client — compiled to WebAssembly. Anonymized RPC from wallets, frontends, and dApps, running entirely in the browser.",
    href: "/mastermap/tor-js",
    tags: ["Arti", "Anonymized RPC", "Onion routing"],
    now: [
      {
        name: "Wallet / SDK / light-client integrations",
        description:
          "Ship Arti-backed RPC routing as a general transport for wallets, SDKs (ethers.js, viem.js), and light clients — wallet-agnostic, not tied to any single client. Kohaku is the Q2 reference integration.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "Upstream to Tor Project",
        description:
          "Merge async / time compatibility fixes back into Arti. WASM-readiness plumbing lands in Arti; the JS wrapper stays external.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "WebRTC transport for Arti",
        description:
          "Browser-native WebRTC transport replacing WebSocket for Arti↔relay. In building it we saw a larger opportunity: a general-purpose transport for reaching anonymity and p2p networks from the edge (browsers, wallets). That broader effort is now the Anonymization Access Layer, with WebRTC as the core.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "Internal Audit with LLM swarm",
        description:
          "Internal audit of the WASM-compiled Arti client using an LLM-based review swarm; ahead of external audit (includes dedicated audit for RustCrypto lib).",
        status: "Q2 2026",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Arti security audit",
        description:
          "External audit of the WASM-compiled Arti client before broad wallet-SDK adoption.",
        status: "Q2 2026 · Critical",
        statusDot: "yellow",
      },
      {
        name: "Broader SDK / light-client rollout",
        description:
          "Land Arti-backed routing in mainstream wallet SDKs (ethers.js, viem.js) and additional light clients (Helios, etc.) for network-level-private RPC.",
        status: "Q2 2026",
        statusDot: "yellow",
      },
      {
        name: "Messenger-protocol survey",
        description:
          "Survey messenger apps/protocols and propose Arti-backed anonymization integrations; pursue one reference integration.",
        status: "Q2–Q3 2026",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "PIR-over-Tor bootstrap",
        description:
          "Use our own PIR to privately retrieve the Tor directory on bootstrap, removing a plaintext metadata leak at the start of every session.",
        status: "Q3 2026",
        statusDot: "gray",
      },
      {
        name: "Wallet P2P tx broadcasting / IP-leakage prevention",
        description:
          "Support wallets on optional P2P transaction broadcasting and IP-leakage prevention, leveraging WebRTC plus .onion-exposing infra providers (dRPC, Flashbots, …).",
        status: "Q3 2026",
        statusDot: "gray",
      },
    ],
    details: {
      deliverables: [
        "WASM-compiled Arti client (shipped Q1 2026, see [privreads.ethereum.foundation/docs/torjs](https://privreads.ethereum.foundation/docs/torjs/))",
        "Integrations across wallets, SDKs (ethers.js, viem.js), and light clients, seeded by a Kohaku reference integration",
        "Arti security audit report and upstream merges into Tor Project's Arti",
      ],
      impact: [
        "Ethereum users get network-level privacy without installing additional software",
        "RPC providers can no longer correlate queries with user IPs",
        "Any wallet, SDK, or light client that adopts the transport inherits anonymized routing",
      ],
    },
    kpis: [
      {
        label: "Integrations",
        target: "10+ wallets/sdk's/light clients",
        status: "Ongoing",
      },
      {
        label: "Bootstrap time",
        target: "~3 seconds",
        status: "Achieved (was ~3 minutes)",
      },
      {
        label: "Upstream Arti PRs",
        target: "5+ landed",
        status: "Under review with Tor Project",
      },
      {
        label: "Audit",
        target: "External audit complete",
        status: "Internal Audit 2Q26 (LLM swarm)",
      },
    ],
  },
]
