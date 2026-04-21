"use client"

import React from "react"
import Link from "next/link"

import {
  ActionLinkTypeLink,
  ProjectExtraLinkType,
  ProjectInterface,
} from "@/lib/types"
import { LABELS } from "@/app/labels"

import { Icons } from "../icons"

interface ProjectExtraLinksProps {
  project: ProjectInterface
}

interface ExtraLinkItemsProps {
  id: ProjectExtraLinkType
  links: ActionLinkTypeLink[]
}

export default function ProjectExtraLinks({ project }: ProjectExtraLinksProps) {
  const { extraLinks = {} } = project
  const hasExtraLinks = Object.keys(extraLinks).length > 0

  const ExtraLinkLabelMapping: Record<
    ProjectExtraLinkType,
    {
      label: string
      icon?: any
    }
  > = {
    buildWith: {
      label: LABELS.COMMON.BUILD_WITH_THIS_TOOL,
      icon: <Icons.hammer />,
    },
    play: {
      label: LABELS.COMMON.TRY_IT_OUT,
      icon: <Icons.hand />,
    },
    research: {
      label: LABELS.COMMON.DEEP_DIVE_RESEARCH,
      icon: <Icons.readme />,
    },
    learn: {
      label: LABELS.COMMON.LEARN_MORE,
    },
  }

  if (!hasExtraLinks) return null

  const ExtraLinkItems = ({ id, links = [] }: ExtraLinkItemsProps) => {
    const { label } = ExtraLinkLabelMapping[id]

    if (!links.length) return null // no links hide the section

    return (
      <div className="flex flex-col gap-2" data-section-id={id}>
        <div className="flex items-center gap-2">
          <p className="text-[22px] font-bold text-secondary">{label}</p>
        </div>
        <div className="flex flex-col items-start gap-2">
          {links.map((link: ActionLinkTypeLink, index) => {
            if (!link) return null
            const { label, url } = link ?? {}
            return (
              <Link
                key={index}
                href={url}
                target="_blank"
                className="flex items-center gap-1 overflow-hidden font-sans font-normal duration-200 ease-in-out border-b cursor-pointer border-anakiwa-400 text-primary hover:border-orange"
              >
                {label}
                <Icons.externalUrl />
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(ExtraLinkLabelMapping).map(([key]) => {
        const links = extraLinks[key as ProjectExtraLinkType] ?? []
        return (
          <ExtraLinkItems
            key={key}
            id={key as ProjectExtraLinkType}
            links={links}
          />
        )
      })}
    </div>
  )
}
