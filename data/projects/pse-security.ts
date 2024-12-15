import {
  ProjectCategory,
  ProjectContent,
  ProjectInterface,
  ProjectStatus,
} from "@/lib/types"

const content: ProjectContent = {
  en: {
    tldr: "Proactively securing Ethereum's L2 and ZK ecosystems.",
    description: `PSE Security is a division of the Privacy & Scaling Explorations team at the Ethereum Foundation. Its primary goal is to identify and rectify bugs, thereby enhancing the security of the Ethereum Layer 2 and Zero-Knowledge ecosystems. Recognizing the potential for critical bugs to cause significant setbacks, PSE Security is committed to preemptively addressing these issues. The team offers open-source projects like the ZK Bug Tracker and Bridge Bug Tracker, which track real bugs and exploits in production code, and encourages community contributions. PSE Security also conducts manual audits and plans to help teach the community more about security and ways they can prevent bugs themselves.`,
  },
}

export const pseSecurity: ProjectInterface = {
  id: "pse-security",
  projectStatus: ProjectStatus.ACTIVE,
  category: ProjectCategory.RESEARCH,
  section: "pse",
  content,
  image: "pse-security.png",
  name: "PSE Security",
  links: {
    github: "https://github.com/privacy-scaling-explorations/security",
  },
  tags: {
    keywords: [
      "Anonymity/privacy",
      "Education",
      "Key management",
      "Scaling",
      "Security",
    ],
    themes: ["build"],
    types: ["Legos/dev tools"],
    builtWith: ["slither", "ecne", "circomspect", "echidna"],
  },
}
