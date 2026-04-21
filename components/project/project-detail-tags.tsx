"use client"

import { HtmlHTMLAttributes, useMemo } from "react"
import Link from "next/link"
import {
  FilterLabelMapping,
  ProjectFilter,
} from "@/app/providers/ProjectsProvider"

import { ProjectInterface } from "@/lib/types"
import { LABELS } from "@/app/labels"

import { CategoryTag } from "../ui/categoryTag"

interface TagsProps extends HtmlHTMLAttributes<HTMLDivElement> {
  label: string
}

interface TagGroup {
  key: string
  label: string
  tags: string[]
}

const TagsWrapper = ({ label, children }: TagsProps) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <h3 className="text-[22px] font-bold text-secondary">{label}</h3>
      {children}
    </div>
  )
}

type IProjectTags = {
  project: ProjectInterface
}

export function ProjectTags({ project }: IProjectTags) {
  const FilterKeyMapping = useMemo(
    () => ({
      keywords: LABELS.COMMON.FILTER_LABELS.KEYWORDS,
      builtWith: LABELS.COMMON.FILTER_LABELS.BUILT_WITH,
      themes: LABELS.COMMON.FILTER_LABELS.THEMES,
      fundingSource: LABELS.COMMON.FILTER_LABELS.FUNDING_SOURCE,
    }),
    []
  )

  const filteredTags = useMemo(
    () =>
      Object.entries(FilterLabelMapping)
        .filter(([key]) => !["themes", "builtWith"].includes(key))
        .map(([key]) => {
          const keyTags = project?.tags?.[key as ProjectFilter]
          const hasItems = keyTags && keyTags?.length > 0

          if (!hasItems) return null

          return {
            key,
            label: FilterKeyMapping[key as ProjectFilter] || key,
            tags: keyTags,
          }
        })
        .filter((item): item is TagGroup => item !== null),
    [project?.tags, FilterKeyMapping]
  )

  return (
    <div className="flex flex-col gap-4 pt-10">
      {filteredTags.map((tagGroup) => (
        <div data-section-id={tagGroup.key} key={tagGroup.key}>
          <TagsWrapper label={tagGroup.label}>
            <div className="flex flex-wrap gap-[6px]">
              {tagGroup.tags?.map((tag, index) => (
                <Link key={index} href={`/projects?${tagGroup.key}=${tag}`}>
                  <CategoryTag key={tag} variant="gray">
                    {tag}
                  </CategoryTag>
                </Link>
              ))}
            </div>
          </TagsWrapper>
        </div>
      ))}
    </div>
  )
}
