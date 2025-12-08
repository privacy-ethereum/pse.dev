"use client"

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
    cardTags: {
      primary: "Report",
      secondary: "Voting",
    },
  },
  {
    id: "zk-snarks-ecosystem-map",
    title: "ZK-SNARKs Ecosystem Map",
    description:
      "A comprehensive mapping of the ZK-SNARKs ecosystem, evaluating ZKP solutions using standardized and reproducible benchmarks.",
    type: "map",
    cardTags: {
      primary: "Map",
      secondary: "ZK-SNARKs",
    },
  },
  {
    id: "privacy-technology-landscape",
    title: "Privacy Technology Landscape",
    description:
      "An in-depth analysis of privacy-preserving technologies in the Ethereum ecosystem, covering zero-knowledge proofs, fully homomorphic encryption, and more.",
    type: "report",
    cardTags: {
      primary: "Report",
      secondary: "Privacy",
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
