export interface GlossaryEntry {
  term: string
  definition: string
  category?: string
}

export const glossaryTerms: Record<string, GlossaryEntry> = {
  // Zero Knowledge
  "zero-knowledge": {
    term: "Zero-Knowledge Proof",
    definition: "A cryptographic method that allows one party to prove to another that a statement is true without revealing any additional information beyond the validity of the statement itself.",
    category: "Cryptography"
  },
  "zkp": {
    term: "ZKP (Zero-Knowledge Proof)",
    definition: "A cryptographic method that allows one party to prove to another that a statement is true without revealing any additional information beyond the validity of the statement itself.",
    category: "Cryptography"
  },
  "zk-snark": {
    term: "zk-SNARK",
    definition: "Zero-Knowledge Succinct Non-Interactive Argument of Knowledge. A type of zero-knowledge proof that is small in size and quick to verify, commonly used in blockchain applications.",
    category: "Cryptography"
  },
  "zk-stark": {
    term: "zk-STARK",
    definition: "Zero-Knowledge Scalable Transparent Argument of Knowledge. A type of zero-knowledge proof that doesn't require a trusted setup and is resistant to quantum computing attacks.",
    category: "Cryptography"
  },

  // Privacy
  "tor": {
    term: "Tor",
    definition: "The Onion Router - a network that enables anonymous communication by routing traffic through multiple encrypted layers, protecting users' privacy and location.",
    category: "Privacy"
  },
  "mixnet": {
    term: "Mixnet",
    definition: "A routing protocol that creates hard-to-trace communications by mixing messages from multiple senders, making it difficult to link senders to recipients.",
    category: "Privacy"
  },
  "mpc": {
    term: "MPC (Multi-Party Computation)",
    definition: "A cryptographic protocol that allows multiple parties to jointly compute a function over their inputs while keeping those inputs private.",
    category: "Cryptography"
  },
  "fhe": {
    term: "FHE (Fully Homomorphic Encryption)",
    definition: "An encryption scheme that allows computations to be performed on encrypted data without decrypting it first, producing an encrypted result.",
    category: "Cryptography"
  },

  // Blockchain
  "rpc": {
    term: "RPC (Remote Procedure Call)",
    definition: "A protocol that allows a program to request a service from another program on a different computer or network, commonly used to interact with blockchain nodes.",
    category: "Blockchain"
  },
  "l2": {
    term: "Layer 2 (L2)",
    definition: "A secondary framework or protocol built on top of an existing blockchain (Layer 1) to improve scalability and reduce transaction costs.",
    category: "Blockchain"
  },
  "rollup": {
    term: "Rollup",
    definition: "A Layer 2 scaling solution that executes transactions outside the main chain but posts transaction data on Layer 1, inheriting its security.",
    category: "Blockchain"
  },
  "evm": {
    term: "EVM (Ethereum Virtual Machine)",
    definition: "The runtime environment for smart contracts in Ethereum. It executes bytecode and maintains the state of the blockchain.",
    category: "Blockchain"
  },

  // PSE Specific
  "pse": {
    term: "PSE (Privacy & Scaling Explorations)",
    definition: "A multidisciplinary team supported by the Ethereum Foundation, focused on building open-source tools for privacy and scaling in the Ethereum ecosystem.",
    category: "Organization"
  },
  "semaphore": {
    term: "Semaphore",
    definition: "A zero-knowledge protocol that allows users to prove their membership in a group and send signals (like votes or endorsements) without revealing their identity.",
    category: "PSE Projects"
  },
  "bandada": {
    term: "Bandada",
    definition: "An infrastructure for managing privacy-preserving groups using Semaphore, enabling anonymous group membership and signaling.",
    category: "PSE Projects"
  },
  "tlsn": {
    term: "TLSNotary",
    definition: "A protocol that allows users to prove that specific data was received from a particular website, enabling portable data verification without revealing all content.",
    category: "PSE Projects"
  },
  "zupass": {
    term: "Zupass",
    definition: "A zero-knowledge identity and ticketing system that allows users to prove attributes about themselves without revealing unnecessary personal information.",
    category: "PSE Projects"
  },

  // General Crypto
  "merkle-tree": {
    term: "Merkle Tree",
    definition: "A tree data structure where every leaf node contains a hash of a data block, and every non-leaf node contains a hash of its children, used for efficient data verification.",
    category: "Cryptography"
  },
  "hash": {
    term: "Hash Function",
    definition: "A mathematical function that converts input data of any size into a fixed-size output (hash), which is deterministic and practically impossible to reverse.",
    category: "Cryptography"
  },
  "commitment": {
    term: "Commitment Scheme",
    definition: "A cryptographic primitive that allows one to commit to a chosen value while keeping it hidden, with the ability to reveal it later.",
    category: "Cryptography"
  }
}

// Helper function to find a term (case-insensitive)
export function findGlossaryTerm(searchTerm: string): GlossaryEntry | undefined {
  const normalized = searchTerm.toLowerCase().replace(/\s+/g, "-")
  return glossaryTerms[normalized]
}

// Get all terms as an array
export function getAllGlossaryTerms(): GlossaryEntry[] {
  return Object.values(glossaryTerms)
}

// Get terms by category
export function getTermsByCategory(category: string): GlossaryEntry[] {
  return Object.values(glossaryTerms).filter(entry => entry.category === category)
}
