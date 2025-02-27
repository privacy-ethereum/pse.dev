import {
  ProjectCategory,
  ProjectContent,
  ProjectInterface,
  ProjectStatus,
} from "@/lib/types"

const content: ProjectContent = {
  en: {
    tldr: "Run a voting round in your community! Forked from EasyRetroPGF and enhanced with MACI for privacy, anti-bribery and anti-collusion",
    description: `### Overview

[MACI Platform](https://github.com/privacy-scaling-explorations/maci-platform/tree/main) is an implementation of EasyRetroPGF with MACI.

This project enables any community, organization or ecosystem to run a voting round.
It is highly configurable to enable different voting mechanisms (quadratic voting, quadratic funding, etc), gating mechanisms (token based, attestation based, hats-based, etc) and an easy-to-use UI for both round organizers and voters.

### Features

With MACI Platform, you can run different kind of voting rounds for your community, with the following features:

1. Full benefit of MACI's properties - Plug into MACI's anti-collusion and privacy features
2. Clean UX - The interface is optimised for voters and projects that want to participate in rounds
3. Customisable - The platform can be customised quickly to fit different use cases`,
  },
}

export const maciPlatform: ProjectInterface = {
  id: "maci-platform",
  category: ProjectCategory.APPLICATION,
  projectStatus: ProjectStatus.INACTIVE,
  section: "pse",
  content,
  image: "maci-platform.png",
  name: "MACI Platform",
  links: {
    github: "https://github.com/privacy-scaling-explorations/maci-platform",
    website: "https://maci.pse.dev",
    twitter: "https://twitter.com/zkmaci",
  },
  tags: {
    keywords: ["Anonymity/privacy", "Voting/governance"],
    themes: ["build"],
    types: ["Lego sets/toolkits", "Infrastructure/protocol", "Public Good"],
    builtWith: ["MACI", "EAS", "EasyRetroPGF"],
  },
}
