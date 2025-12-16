"use client"

import React from "react"
import EcosystemCard, { EcosystemItem } from "./ecosystem-card"
import { SectionWrapper } from "@/app/components/wrappers/SectionWrapper"
import { LABELS } from "@/app/labels"
import { useState } from "react"

const MOCK_ECOSYSTEM_ITEMS: EcosystemItem[] = [
  {
    id: "state-of-private-voting-2026",
    title: "State of Private Voting 2026",
    description:
      "An in-depth analysis of private voting protocols in the Ethereum ecosystem.",
    type: "report",
    href: "https://pse.dev/articles/state-of-private-voting-2026/state-of-private-voting-2026.pdf",
    image: "/images/ecosystem/state-of-private-voting-2026.png",
    imageAlt: "State of Private Voting 2026",
    date: "November 2025",
    team: "PSE, Shutter",
    cardTags: {
      primary: "Report",
      secondary: "Voting",
    },
  },
  {
    id: "private-transfers",
    title: "Private Transfers",
    description:
      "Research and documentation on private transfer protocols and mechanisms in the Ethereum ecosystem, exploring privacy-preserving transaction technologies.",
    type: "report",
    href: "hhttps://publish.obsidian.md/private-writes/Private+Writes+Vault",
    date: "December 2025",
    team: "PSE",
    cardTags: {
      primary: "Report",
      secondary: "Private Transfers",
      wip: true,
    },
  },
  {
    id: "navigating-privacy-compliance-blockchain",
    title: "Navigating Privacy and Compliance in Blockchain Systems",
    description:
      "An analysis of privacy-preserving technologies and compliance considerations in blockchain systems, exploring the intersection of cryptographic privacy and regulatory requirements.",
    type: "report",
    href: "https://drive.google.com/file/d/1eeCZbLfKP3nxLECaCVlPinva948V9dKX/view",
    date: "December 2025",
    team: "Inco, Predicate",
    cardTags: {
      primary: "Report",
      secondary: "Privacy",
    },
  },
  {
    id: "research-brief-identity",
    title: "Research Brief: Identity",
    description:
      "A research brief exploring identity systems, privacy-preserving identity solutions, and identity protocols in the Ethereum ecosystem.",
    type: "report",
    href: "https://pse-team.notion.site/Research-Brief-Identity-4e819dd75a5d4137a4a639080ccbe5a4",
    date: "March 2024",
    team: "PSE",
    cardTags: {
      primary: "Report",
      secondary: "Identity",
    },
  },
  {
    id: "pse-identity-research",
    title: "PSE Identity Research",
    description:
      "Comprehensive research on identity systems, privacy-preserving identity protocols, and identity solutions for the Ethereum ecosystem.",
    type: "report",
    href: "https://pse-team.notion.site/PSE-Identity-Research-30fc197196494fcdb5f4117c6c734b53?pvs=74",
    date: "June 2024",
    team: "PSE",
    cardTags: {
      primary: "Report",
      secondary: "Identity",
    },
  },
  {
    id: "evaluation-framework-ssi-solutions",
    title: "Evaluation Framework for SSI Solutions",
    description:
      "A comprehensive evaluation framework for assessing Self-Sovereign Identity (SSI) solutions, providing standardized criteria and methodologies for comparing identity systems.",
    type: "report",
    href: "https://pse-team.notion.site/Evaluation-Framework-for-SSI-Solutions-8eceb793a5b442cb8da65acc3c337d5c",
    date: "July 2024",
    team: "PSE",
    cardTags: {
      primary: "Report",
      secondary: "Identity",
    },
  },
  {
    id: "l2s-report",
    title: "L2s Report",
    description:
      "A comprehensive analysis of Layer 2 scaling solutions for Ethereum, covering rollups, state channels, and other scaling technologies.",
    type: "report",
    href: "https://cdn.prod.website-files.com/6728e9076a3b5a8ca8ec4816/6931c20f55129e498a8da223_%5BCompressed%5D%20L2s%20Report.pdf",
    date: "November 2025",
    team: "Etherealize",
    cardTags: {
      primary: "Report",
      secondary: "Layer 2",
    },
  },
  {
    id: "open-application-driven-fhe-ethereum",
    title: "Open, Application-Driven FHE for Ethereum",
    description:
      "A comprehensive analysis of Fully Homomorphic Encryption (FHE) for Ethereum, covering use cases, ecosystem players, scheme choices, verifiability, and key management challenges.",
    type: "report",
    href: "https://ethresear.ch/t/open-application-driven-fhe-for-ethereum/23044",
    date: "September 2025",
    team: "PSE",
    cardTags: {
      primary: "Report",
      secondary: "FHE",
    },
  },
  {
    id: "combined-ssi-research",
    title: "Combined SSI Research",
    description:
      "Comprehensive research on Self-Sovereign Identity (SSI) solutions, covering identity systems, privacy-preserving protocols, and decentralized identity technologies.",
    type: "report",
    href: "https://pse-team.notion.site/Combined-SSI-research-f7bc6d108f76445bae372abd2b411363?pvs=74",
    date: "September 2024",
    team: "PSE",
    cardTags: {
      primary: "Report",
      secondary: "Identity",
    },
  },
]

// Helper function to parse date strings like "November 2025" or "December 2025"
function parseDate(dateString: string | undefined): Date {
  if (!dateString) return new Date(0) // Return epoch for items without dates (will sort last)

  const months: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  }

  const parts = dateString.trim().toLowerCase().split(" ")
  if (parts.length >= 2) {
    const monthName = parts[0]
    const year = parseInt(parts[1], 10)
    const month = months[monthName] ?? 0

    if (!isNaN(year)) {
      return new Date(year, month, 1)
    }
  }

  return new Date(0) // Return epoch if parsing fails
}

// Sort function to order by date (most recent first)
function sortByDateDescending(a: EcosystemItem, b: EcosystemItem): number {
  const dateA = parseDate(a.date)
  const dateB = parseDate(b.date)
  return dateB.getTime() - dateA.getTime()
}

export const EcosystemList = () => {
  const [ecosystemItems] = useState<EcosystemItem[]>(MOCK_ECOSYSTEM_ITEMS)

  // Filter items for PSE reports (reports that include PSE in team)
  const pseReports = ecosystemItems
    .filter((item) => {
      if (!item.team) return false
      // Check if team includes "PSE" (case-insensitive)
      const teamLower = item.team.toLowerCase()
      return teamLower.includes("pse")
    })
    .sort(sortByDateDescending)

  // Filter items for external research reports (reports not from PSE)
  const externalResearchReports = ecosystemItems
    .filter((item) => {
      if (item.type !== "report") return false
      if (!item.team) return false
      // Check if team doesn't include "PSE" (case-insensitive)
      const teamLower = item.team.toLowerCase()
      return !teamLower.includes("pse")
    })
    .sort(sortByDateDescending)

  if (ecosystemItems.length === 0) {
    return (
      <div className="flex flex-col gap-2 pt-24 pb-40 text-center">
        <span className="text-2xl font-bold font-display text-primary">
          {LABELS.COMMON.NO_RESULTS}
        </span>
        <span className="text-lg font-normal text-primary">
          {LABELS.COMMON.NO_RESULTS_DESCRIPTION}
        </span>
      </div>
    )
  }

  return (
    <div className="relative grid items-start justify-between grid-cols-1">
      <div className="flex flex-col justify-between gap-10">
        <SectionWrapper title={LABELS.ECOSYSTEM_PAGE.ARTIFACTS.toUpperCase()}>
          <div className="grid grid-cols-1 gap-4 md:gap-x-6 md:gap-y-10 lg:grid-cols-4 items-stretch">
            {pseReports.map((item: EcosystemItem) => (
              <EcosystemCard
                key={item.id}
                item={item}
                showBanner={true}
                border
              />
            ))}
          </div>
        </SectionWrapper>
        {externalResearchReports.length > 0 && (
          <div className="flex flex-col gap-10 justify-center dark:bg-anakiwa-975 py-16 lg:py-20 overflow-hidden bg-cover-gradient dark:bg-none">
            <span className="dark:text-tuatara-100 text-tuatara-950 text-xl lg:text-3xl lg:leading-[45px] font-normal font-sans text-center lg:px-0 px-4">
              {LABELS.ECOSYSTEM_PAGE.EXTERNAL_RESEARCH_REPORTS}
            </span>
            <div className="lg:px-4 px-4">
              <div className="grid grid-cols-1 gap-4 md:gap-x-6 md:gap-y-10 lg:grid-cols-4 items-stretch">
                {externalResearchReports.map((item: EcosystemItem) => (
                  <EcosystemCard
                    key={item.id}
                    item={item}
                    showBanner={true}
                    border
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
