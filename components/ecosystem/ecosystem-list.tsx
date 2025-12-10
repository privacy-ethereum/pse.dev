"use client"

import React from "react"
import EcosystemCard, { EcosystemItem } from "./ecosystem-card"
import {
  SectionWrapper,
  SectionWrapperTitle,
} from "@/app/components/wrappers/SectionWrapper"
import { LABELS } from "@/app/labels"
import { useState, useEffect } from "react"

// Placeholder data - replace with actual data source later
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
    team: "PSE, Shutter Network",
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
    href: "https://publish.obsidian.md/private-writes/Private+Transfers/Phase+A/00_Index/Phase+A+Index",
    date: "December 2025",
    team: "PSE",
    cardTags: {
      primary: "Report",
      secondary: "Private Transfers",
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
    id: "identity-research-page-1",
    title: "Identity Research",
    description:
      "Research documentation on identity systems and privacy-preserving identity technologies in blockchain ecosystems.",
    type: "report",
    href: "https://www.notion.so/pse-team/6a6eaafed9b3486ebdb3dcf84e201fe5?v=2e1ffa04558b4b5d99014ec18b321415&p=f7bc6d108f76445bae372abd2b411363&pm=s",
    date: "2024",
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

export const EcosystemList = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [ecosystemItems] = useState<EcosystemItem[]>(MOCK_ECOSYSTEM_ITEMS)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 overflow-hidden">
          <SectionWrapperTitle className={"after:left-[100px] lg:after:left-[200px]"}>
            <div className="h-3 lg:h-4 w-[120px] lg:w-[220px] bg-gray-200 animate-pulse rounded-lg"></div>
          </SectionWrapperTitle>
        </div>
        <div className="grid items-start justify-between w-full grid-cols-1 gap-2 md:grid-cols-3 md:gap-6">
          <div className="min-h-[200px] border border-gray-200 bg-gray-200 animate-pulse rounded-lg overflow-hidden"></div>
          <div className="min-h-[200px] border border-gray-200 bg-gray-200 animate-pulse rounded-lg overflow-hidden"></div>
          <div className="min-h-[200px] border border-gray-200 bg-gray-200 animate-pulse rounded-lg overflow-hidden"></div>
        </div>
      </div>
    )
  }

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
          <div className="grid grid-cols-1 gap-4 md:gap-x-6 md:gap-y-10 lg:grid-cols-3">
            {ecosystemItems.map((item: EcosystemItem) => (
              <EcosystemCard
                key={item.id}
                item={item}
                showBanner={true}
                border
              />
            ))}
          </div>
        </SectionWrapper>
      </div>
    </div>
  )
}
