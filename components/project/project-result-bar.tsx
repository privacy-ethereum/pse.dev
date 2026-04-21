"use client"

import {
  ProjectFilter,
  ProjectSortBy,
  useProjects,
} from "@/app/providers/ProjectsProvider"

import { LABELS } from "@/app/labels"
import { interpolate } from "@/lib/utils"

import { CategoryTag } from "../ui/categoryTag"
import { Dropdown } from "../ui/dropdown"

const labelClass =
  "h-5 text-xs text-base md:h-6 text-slate-900/70 md:text-sm dark:text-white"

export const ProjectResultBar = () => {
  const { activeFilters, toggleFilter, projects, sortProjectBy, sortBy } =
    useProjects()

  const haveActiveFilters = Object.entries(activeFilters).some(
    ([, values]) => values?.length > 0
  )

  const resultLabel = haveActiveFilters
    ? interpolate(LABELS.COMMON.SHOWING_PROJECTS_WITH, {
        count: projects?.length,
      })
    : interpolate(LABELS.COMMON.SHOWING_PROJECTS, { count: projects?.length })

  const projectSortItems: { label: string; value: ProjectSortBy }[] = [
    { label: LABELS.COMMON.FILTER_OPTIONS.RANDOM, value: "random" },
    { label: LABELS.COMMON.FILTER_OPTIONS.ASC, value: "asc" },
    { label: LABELS.COMMON.FILTER_OPTIONS.DESC, value: "desc" },
    // { label: LABELS.COMMON.FILTER_OPTIONS.RELEVANCE, value: "relevance" },
  ]

  const getSortOptionLabel = (sortBy: string) => {
    switch (sortBy) {
      case "random":
        return LABELS.COMMON.FILTER_OPTIONS.RANDOM
      case "asc":
        return LABELS.COMMON.FILTER_OPTIONS.ASC
      case "desc":
        return LABELS.COMMON.FILTER_OPTIONS.DESC
      case "relevance":
        return LABELS.COMMON.FILTER_OPTIONS.RELEVANCE
      default:
        return LABELS.COMMON.FILTER_OPTIONS.RANDOM
    }
  }

  const activeSortOption = interpolate(LABELS.COMMON.SORT_BY, {
    option: getSortOptionLabel(sortBy),
  })

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className={labelClass}>{resultLabel}</span>
        <Dropdown
          label={activeSortOption}
          defaultItem="asc"
          items={projectSortItems}
          onChange={(sortBy) => sortProjectBy(sortBy as ProjectSortBy)}
          disabled={!projects?.length}
        />
      </div>
      {haveActiveFilters && (
        <div className="inline-flex flex-wrap gap-1 md:gap-4">
          {Object.entries(activeFilters)
            .flatMap(([key, filters]) =>
              (filters ?? []).map((filter) => ({
                key,
                filter,
              }))
            )
            .filter(({ filter }) => filter?.length > 0)
            .map(({ key, filter }, index) => (
              <CategoryTag
                key={`${key}-${filter}-${index}`}
                closable
                variant="gray"
                onClose={() =>
                  toggleFilter({
                    tag: key as ProjectFilter,
                    value: filter,
                  })
                }
              >
                {filter}
              </CategoryTag>
            ))}
        </div>
      )}
    </div>
  )
}
