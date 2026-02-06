---
id: "verifiable-ubt"
name: "Verifiable UBT"
image: "verifiable-ubt.svg"
section: "pse"
projectStatus: "active"
category: "devtools"
tldr: "Recursive zkVM proofs that UBT and MPT state updates match per block"
tags:
  themes: ["research", "build"]
  keywords:
    ["UBT", "MPT", "Ethereum", "state trie", "zkVM", "stateless execution", "light clients"]
  builtWith: ["go", "geth"]
links:
  github: "https://github.com/tkmct/go-ethereum/tree/test-ubt-prompt"
---

# Verifiable UBT

## What it is

Run a Unified Binary Trie (UBT) next to Ethereum’s Merkle Patricia Trie (MPT),
and produce a zkVM proof per block that UBT state updates match the MPT updates.
Proofs are generated from Keeper’s stateless block execution, so verification
does not require trusting a node and the canonical chain remains unchanged.

- Recursive proof chain: each block proof consumes the prior proof, attesting to
  the full UBT conversion history back to genesis.

## Why it matters

- Anyone can verify UBT state from genesis to head with a single proof chain,
  without trusting the provider.
- Enables light clients and PIR services to rely on provable state transitions.
- UBT’s binary structure is more zk-friendly than MPT.
- Backward compatible: MPT stays canonical.

## What we’re building

- A UBT sidecar that stays in sync with MPT state.
- A proof pipeline that generates block proofs and chains them recursively.
- Proving backend: OpenVM (Womir).
