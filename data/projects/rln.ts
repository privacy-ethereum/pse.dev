import {
  ProjectCategory,
  ProjectContent,
  ProjectInterface,
  ProjectStatus,
} from "@/lib/types"

const content: ProjectContent = {
  en: {
    tldr: "A protocol for deterring spam and maintaining anonymity in communication systems.",
    description: `
Rate-Limiting Nullifier (RLN) is a protocol designed to combat spam and denial of service attacks in privacy-preserving environments. It allows users in an anonymous system to penalize those who exceed the rate limit, either by withdrawing the offender's stake or revealing their secrets. This mechanism helps maintain system integrity and deters abuse. RLN is built on the Semaphore protocol and uses zero-knowledge proofs and the Shamir's Secret Sharing scheme to reveal the spammer's private key. It's particularly useful for developers working on communication systems that require privacy and anonymity, such as chat apps, client-server communications, and peer-to-peer communications. It's already being used in projects like Zerokit and Waku, and is also being developed for use with the KZG polynomial commitment scheme.
`,
  },
}

export const rln: ProjectInterface = {
  id: "rln",
  content,
  projectStatus: ProjectStatus.INACTIVE,
  category: ProjectCategory.DEVTOOLS,
  section: "pse",
  image: "rln.svg",
  name: "Rate-Limiting Nullifier",
  links: {
    github: "https://github.com/Rate-Limiting-Nullifier/circom-rln",
    website: "https://rate-limiting-nullifier.github.io/rln-docs/",
  },
  tags: {
    keywords: ["Anonymity/privacy"],
    themes: ["build"],
    types: ["Infrastructure/protocol"],
    builtWith: ["circom", "solidity", "semaphore"],
  },
}
