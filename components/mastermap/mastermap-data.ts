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
      "Publish client-side proving benchmarks and develop transparent, post-quantum proving ZKP systems with potential on-chain verification.",
    href: "/mastermap/csp",
    tags: ["Benchmarks", "Post-quantum", "WHIR", "GPU Accel"],
    now: [
      {
        name: "CSP Benchmarks",
        description:
          "Maintain Ethproofs benchmarks for 16 proof systems and zkVMs across SHA-256, Keccak, Poseidon/Poseidon2, and ECDSA workloads.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "Spartan-WHIR R&D",
        description:
          "Develop a Spartan-style sumcheck prover with WHIR PCS, compare it against ProveKit and other CSP candidates.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "WHIR Small-Field Solidity Verifier",
        description:
          "Measure standalone WHIR verification over a 31-bit field on EVM: 5.65M gas in software and 4.33M gas with experimental extension-field precompiles.",
        status: "Published \u00b7 follow-up R&D",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Spartan-WHIR Frontend",
        description:
          "Connect Spartan-WHIR to practical circuit frontend flows and include it in the benchmark harness.",
        status: "Planned",
        statusDot: "yellow",
      },
      {
        name: "Full SNARK Verifier Path",
        description:
          "Use the standalone WHIR verifier results to design the amortized (recursive/aggregated) post-quantum onchain verifier.",
        status: "Research",
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
        "Published CSP benchmarks on Ethproofs",
        "Spartan-WHIR implementation and benchmark integration",
        "Measured WHIR small-field Solidity verifier",
      ],
      impact: [
        "Ecosystem uses benchmarks for informed decisions",
        "Post-quantum readiness for on-chain ZKP verification",
        "Client-side proving becomes practical on mobile",
      ],
    },
    kpis: [
      {
        label: "Standalone WHIR verification",
        target: "5.65M software / 4.33M precompile experiment",
        status: "Published",
      },
      {
        label: "Spartan-WHIR prover",
        target: "Faster than ProveKit on selected CSP workloads",
        status: "WIP",
      },
      {
        label: "Benchmark coverage",
        target: "SHA-256, Keccak, Poseidon/Poseidon2, ECDSA",
        status: "Published and expanding",
      },
      {
        label: "Ecosystem citations per release",
        target: "10+",
        status: "Tracking",
      },
      {
        label: "Community contributions",
        target: "3+ per quarter",
        status: "New contributions by maintainers of ProveKit, Barretenberg, Jolt",
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
    completion: 25,
    description:
      "Practical indistinguishability obfuscation. Roadmap through Q2 2027: blind PRF over key-homomorphic encodings, \u226564-bit obfuscation, SNARK verification, witness encryption.",
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
          "Implement a SNARK verification circuit over key-homomorphic encodings; PV vs DV scheme selection (or new design) plus an Argo-style garbled-circuit path.",
        status: "Q4 2026 – Q1 2027",
        statusDot: "gray",
      },
      {
        name: "Witness encryption",
        description:
          "Obfuscation that releases a hardcoded message iff a SNARK proof verifies, unlocking trustless bridges, encrypted mempools, one-time programs, and time-lock encryption.",
        status: "Q1 – Q2 2027",
        statusDot: "gray",
      },
    ],
    details: {
      description: [
        "Improve efficiency of key-homomorphic encodings to enable blind PRF and noise refreshing",
        "Diamond iO 2, supporting larger input sizes without compromising efficiency",
        "SNARK verification over key-homomorphic encodings (Q4 2026 – Q1 2027)",
        "Witness encryption as the first end-user-relevant deliverable (Q1 – Q2 2027)",
      ],
      deliverables: [
        "Implementation of FHE multiplication + blind FHE over key-homomorphic encodings, along with noise refreshing",
        "Implementation of obfuscation with a 64-bit input size or its concrete estimation of the required hardware costs and performance",
        "Papers on the new lookup table evaluation method and low-depth circuit in Q2 and the next diamond iO construction in Q3",
        "SNARK verification circuit and prover (Q4 2026 – Q1 2027), then witness encryption with a demo application (Q1 – Q2 2027)",
      ],
      impact: [
        "First practical-performance iO for nontrivial input size",
        "First witness encryption for general NP, enabling trustless bridges, encrypted mempools, and time-lock encryption",
        "Foundation for verifiable FHE and obfuscation for conditional FHE decryption (out of scope this cycle)",
      ],
    },
  },
  {
    id: "ptr",
    name: "Private Transfers (Research)",
    category: "private-writes",
    status: "Active R&D",
    statusVariant: "rd",
    completion: 25,
    description:
      "Four-track Q2/Q3 2026 program: L1 Privacy (PQ-secure private ETH transfers), Lean Staking (EIP-8222), Sonobe folding library, and Plasmablind (maintenance).",
    href: "/mastermap/ptr",
    tags: ["L1 Privacy", "Lean Staking", "Sonobe", "Plasmablind", "Folding", "Post-quantum"],
    now: [
      {
        name: "L1 Privacy writeup",
        description:
          "End-of-June capstone bundling OMR, PIR, PQ signatures, hardware wallets and smart accounts.",
        status: "End of June \u00b7 Critical path",
        statusDot: "green",
      },
      {
        name: "Lean Staking EIP iteration",
        description:
          "Bring EIP-8222 to an ACDE call and refine open issues.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "AI vs human audit publication",
        description:
          "ethresearch post comparing AI and human Sonobe audit findings.",
        status: "In progress",
        statusDot: "green",
      },
      {
        name: "Intmax Sonobe migration",
        description:
          "Bring Intmax's zERC20 stack onto the audited Sonobe by end of May.",
        status: "End of May",
        statusDot: "green",
      },
    ],
    next: [
      {
        name: "Sonobe ZK layer for folding",
        description:
          "Port BlindFold to Nova and ship to `main` by end of June.",
        status: "End of June \u00b7 Critical",
        statusDot: "yellow",
      },
      {
        name: "PQ signature circuits",
        description:
          "Hash-based PQ signature R1CS/AIR circuits + cross-zkVM benchmarks (XMSS lead).",
        status: "Q2\u2013Q3 2026",
        statusDot: "yellow",
      },
      {
        name: "Sonobe PQ folding + aggregation",
        description:
          "Generic PQ folding design plus folded PQ signature aggregation by end of September.",
        status: "End of September",
        statusDot: "yellow",
      },
      {
        name: "Lean Staking Devcon package",
        description:
          "Presentation + project website + `0x03` withdrawal credential extension.",
        status: "Through Devconnect",
        statusDot: "yellow",
      },
    ],
    later: [
      {
        name: "Plasma Fold + Plasma Blind merged paper",
        description:
          "Submit a single reframed paper for reviewer feedback.",
        status: "End of Q3 2026",
        statusDot: "gray",
      },
      {
        name: "L1 Privacy \u2192 Devcon Mumbai",
        description:
          "Lock sub-track implementation roadmap after the end-of-June review.",
        status: "Devcon Mumbai",
        statusDot: "gray",
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
      "[PIR schemes](https://privreads.ethereum.foundation/workstreams/pir) tailored to the Ethereum hot state can and archival history, allowing users to read chain data from remote servers without revealing what is being queried. The sharded approach allows optimizing for different data types, contexts of usage, and tolerance to latency.",
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
        name: "VIA in Rust",
        description:
          "Port VIA from [Pythonic specs](https://github.com/turanzv/via-spec) to a Rust reference implementation; feeds into the sharded harness and benchmark comparisons.",
        status: "Q2 2026",
        statusDot: "yellow",
      },
      {
        name: "LeanPIR paper",
        description:
          "Academic paper on LeanPIR and its GPU acceleration. EuroTT workshop keynote targeted for May 2026.",
        status: "Q2-3 2026",
        statusDot: "yellow",
      },
      {
        name: "GPU scale-up",
        description:
          "Benchmark the leading candidates for GPU-accelerated PIR — Inspire, Onion v2, LeanPIR, VIA, and Harmony — at 100+ GB scale. Benchmark matrix being db/entry sizes, db segmentation, no. GPUs, ..",
        status: "Q2–Q3 2026",
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
        "Users can read state data without revealing what they queried while expressing their queries using the same Ethereum RPC standard",
        "Hardening the privacy guarantees provided by other privacy measures (shielding, network-level privacy)",
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
    name: "Abstract Access Layer",
    category: "private-reads",
    status: "Active R&D",
    statusVariant: "rd",
    completion: 10,
    description:
      "Pluggable abstraction over anonymization networks (onion nets, mixnets, or any other). The edge ([in-browser] wallets, SDKs, light-clients, ..) can swap networks without app-layer changes. The architecture and access/validation standard may be extended to accessing P2P networks generally.",
    href: "/mastermap/access-layer",
    tags: ["Access Layer", "Standards", "WebRTC", "Mixnet", "Onion routing"],
    now: [
      {
        name: "Architecture sketch",
        description:
          "Design of the arch for an abstracted access to anonymization networks (onion-based, mixnets, or any other). Comprised validation standard of client binaries, standard for signaling and discovery.",
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
        name: "Publish the arch design",
        description:
          "Publish the access-layer architecture, with a companion community post inviting feedback. Share at an engineering monthly to convene wallets, SDKs, and anonymization-network maintainers around a common interface.",
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
          "Dip into Lean / formal methods for critical access-layer plumbing; early exploration of verified builds for privacy primitives, RustCrypto library being an initial candidate.",
        status: "Exploratory",
        statusDot: "blue",
      },
    ],
    details: {
      deliverables: [
        "Access architecture and standard + community feedback",
        "Implement the standard and do a pilot implementation for a representative instantiation (wallet -> tor -> EL node)",
      ],
      impact: [
        "Censorship and centralized RPC outages no longer take wallets offline",
        "Apps are not bound to a single anonymization network; users and integrators can choose/swap",
        "Ethereum RPC traffic becomes routable over any anonym. network (onion, mixnet, or any other)",
        "Make Ethereum users' assumed-ISP-exposed web2 traffic unlinkable to transacting on or reading the Ethereum state — via any anonymization network they choose",
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
      "Provably L1-equivalent execution-layer node that is running against a [Unified Binary Tree](https://privreads.ethereum.foundation/workstreams/ubt) ([EIP-7864](https://eips.ethereum.org/EIPS/eip-7864)). PIR servers, wallets, and light clients can begin consuming binary-based state today ahead of EIP-7864 inclusion in protocol, while relying on equivalence proof for data validity.",
    href: "/mastermap/ubt",
    tags: ["UBT", "EIP7864", "Statelessness", "EL Clients", "PIR"],
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
        "Fully sync'd UBT sidecar node on Geth / Ethrex",
        "Recursive zkVM proof chain from genesis to head",
        "MPT↔UBT utilities and monitoring tooling",
      ],
      impact: [
        "Get the benefits of binary trie state today off-chain, and increase readiness for it when it goes on-chain (EIP-7864)",
        "PIR services can rely on provable state without trusting a node",
        "Light clients can verify state from genesis with a single proof chain",
        "A concrete step toward stateless L1 execution",
        "Bonus: indirectly contributes to the testing and benchmarking of EIP-7864",
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
          "Browser-native WebRTC transport replacing WebSocket for Arti↔relay. In building it we saw a larger opportunity: a general-purpose transport for reaching anonymity and p2p networks from the edge (browsers, wallets). That broader effort is now the Abstract Access Layer, with WebRTC as the core.",
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
        name: "Direct Edge to P2P boradcasting+",
        description:
          "Support edge (wallets, light clients, ..) to P2P transaction broadcasting and IP-leakage prevention, leveraging WebRTC work in TorJS plus (a) .onion-exposing infra providers (dRPC, Flashbots, …) and (b) direct ethp2p peers after that [abstraction is implemented](/mastermap/access-layer).",
        status: "Q3 2026",
        statusDot: "gray",
      },
      {
        name: "PIR-over-Tor bootstrap",
        description:
          "Use our own PIR to privately retrieve the Tor directory on bootstrap, removing a plaintext metadata leak at the start of every session.",
        status: "Q3 2026",
        statusDot: "gray",
      },
    ],
    details: {
      deliverables: [
        "[WASM](https://privreads.ethereum.foundation/feed/embedding-arti-in-the-browser/)-[compiled](https://privreads.ethereum.foundation/docs/torjs/) Arti client",
        "Integrations across wallets, SDKs (ethers.js, viem.js), and light clients",
        "Arti security audit report and upstream merges into Tor Project's Arti",
      ],
      impact: [
        "Make Ethereum users' assumed-ISP-exposed web2 traffic unlinkable to transacting on or reading the Ethereum state",
        "Ethereum users get network-level privacy without installing additional software",
        "RPC providers can no longer correlate queries with user IPs",
        "Any wallet, SDK, or light client that adopts the transport inherits anonymized routing",
        "App developers can plug into onion routing using a familiar ([fetch](https://privreads.ethereum.foundation/docs/torjs/#fetch-flow)), without dealing with onionization complexity ([~3 lines of code](https://privreads.ethereum.foundation/docs/torjs))",
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
