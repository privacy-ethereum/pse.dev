import {
  ProjectCategory,
  ProjectContent,
  ProjectInterface,
  ProjectStatus,
} from '@/lib/types'

const content: ProjectContent = {
  en: {
    tldr: 'A mechanism for anonymous proof of Ethereum address ownership.',
    description:
      "AnonKlub is a tool designed for Ethereum developers that allows for anonymous proof of Ethereum address ownership. It doesn't directly address the public observability of Ethereum transactions but provides a workaround for privacy. Users can prepare a list of Ethereum addresses, sign a message from an address they own, and use that signature to generate a zero-knowledge proof. This proof enables users to perform actions anonymously that would typically require ownership of an address from the initial list. Use cases include anonymous NFT minting and Discord verification for DAOs without disclosing the public address.",
  },
}

export const anonKlub: ProjectInterface = {
  id: 'anon-klub',
  category: ProjectCategory.APPLICATION,
  section: 'archived',
  content,
  projectStatus: ProjectStatus.INACTIVE,
  image: 'anonklub.svg',
  name: 'AnonKlub',
  links: {
    github: 'https://github.com/anonklub',
    website: 'https://anonklub.github.io',
  },
  extraLinks: {
    learn: [
      {
        label:
          'Sunsetting Blog Post: Reflections on Our Journey in Privacy-Preserving Solutions',
        url: 'https://mirror.xyz/privacy-scaling-explorations.eth/7VTKFVR4PM75WtNnBzuQSBZW-UYoJOsnzBBQmB9MWbY',
      },
    ],
  },
  tags: {
    keywords: [
      'Transaction privacy',
      'Anonymity/privacy',
      'Social',
      'Identity',
      'Voting/governance',
    ],
    themes: ['build', 'play'],
    types: ['Infrastructure/protocol', 'Prototype', 'Proof of concept'],
    builtWith: ['circom', 'snarkjs', 'halo2'],
  },
}
