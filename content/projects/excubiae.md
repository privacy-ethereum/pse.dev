---
id: "excubiae"
name: "Excubiae"
image: ""
section: "pse"
projectStatus: "maintained"
category: "devtools"
tldr: "an on-chain flexible & composable framework to create, reuse and customize gatekeepers."
license: "MIT"
tags:
  keywords: ["Gatekeeper", "Access Control", "Policy", "Checker"]
  themes: ["build"]
  types: ["Legos/dev tools", "Lego sets/frameworks"]
  builtWith: ["TypeScript", "Solidity"]
links:
  github: "https://github.com/privacy-scaling-explorations/excubiae"
  discord: "https://discord.com/channels/943612659163602974/1332087370065117260"
---

### Overview

Excubiae is a composable framework for implementing custom, attribute-based access control policies on EVM-compatible networks. It separates policy definition (_what rules to enforce_) from policy checking (_how to validate those rules_), enabling flexible and reusable access control patterns.

The framework enforces access through two core components: Policy, which defines the enforcement of rules and, Checker which defines the validation of submitted evidence based on the rules.

Designed with modularity, customizability and reusability in mind, Excubiae provides protocol developers with the building blocks to implement robust access control systems.

The name "Excubiae" comes from the ancient Roman guards who stood watch and enforced access control—a fitting metaphor for a system that secures smart contract access through configurable policies.

### Vision

As blockchain protocols evolve, they generate new forms of verifiable evidence and proofs. While these proofs are critical for access control, integrating them into on-chain systems outside their native environments (e.g., APIs, apps, libraries) remains a challenge.

Excubiae bridges this gap by providing a universal framework for composing and enforcing interoperable on-chain access policies, serving as a foundational layer for secure, evidence-based authentication across the ecosystem.

### Features

- **Composable Access Control** – A modular and reusable framework for attribute-based access control on EVM-compatible networks. Excubiae separates policy logic from validation logic, enabling independent audits and cross-protocol composability.
- **Gas-Efficient Minimal Proxy Pattern** – Uses a minimal proxy pattern with immutable arguments to reduce gas costs. Factory contracts can efficiently deploy Policies and Checkers while ensuring proper initialization.
- **Multi-Stage Validation System** – Supports three validation stages to support layered access control for use cases such as voting, governance, and staged authentication.
  - **PRE** – Initial conditions (e.g., token ownership).
  - **MAIN** – Ongoing validation (e.g., governance approval).
  - **POST** – Follow-up actions (e.g., logging, permission updates).

### Status

🚀 Version [v0.3.2](https://github.com/privacy-scaling-explorations/excubiae/releases/tag/v0.3.2) has been officially released! Excubiae has reached a fully-fledged MVP, and the focus is now on adoption and integration.

The roadmap includes:

- ✅ A set of ready-to-use Checkers & Policies and their respective Factories ("extensions"). We are going to start by porting the [MACI Gatekeepers](https://github.com/privacy-scaling-explorations/maci/tree/dev/apps/website/versioned_docs/version-v1.2/solidity-docs/gatekeepers) as Excubiae Policy-Checker contracts.
  - The current version supports the porting of MACI's [Semaphore](https://github.com/privacy-scaling-explorations/excubiae/tree/main/packages/contracts/contracts/extensions) gatekeeper as extension. This extension enforces membership proofs for a Semaphore group with frontrunning resistance.
- ✅ Deployment scripts, guides, and examples for seamless integration.
  - You can already find a [BaseVoting or AdvancedVoting](https://github.com/privacy-scaling-explorations/excubiae/tree/main/packages/contracts/contracts/test/core) examples, plus the Semaphore extension built on the Base core contracts.
- ⚠️ Some lower-priority features are on hold and may be revisited based on adoption trends.

### Contributing

We welcome contributions! Whether you're interested in integrating Excubiae, developing custom Policies or Checkers, or providing feedback, we'd love to hear from you.

🔗 Join the conversation:

- 📢 [PSE Discord](https://discord.com/invite/sF5CT5rzrR) (#🚪-excubiae channel)
- 🛠️ Open an [Issue](https://github.com/privacy-scaling-explorations/excubiae/issues/new) or [Pull Request](https://github.com/privacy-scaling-explorations/excubiae/compare) on the [GitHub monorepo](https://github.com/privacy-scaling-explorations/excubiae).

### Learn More

For deeper insights into the core design, philosophy, roadmap, and integration guides, check out our [documentation](https://github.com/privacy-scaling-explorations/excubiae/tree/main/documentation).
