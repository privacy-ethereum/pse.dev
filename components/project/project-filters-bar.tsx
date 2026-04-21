"use client"

import { Icons } from "../icons"
import Badge from "../ui/badge"
import { Button } from "../ui/button"
import { CategoryTag } from "../ui/categoryTag"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { Modal } from "../ui/modal"
import { LABELS } from "@/app/labels"
import {
  useProjects,
  ProjectFilter,
  FilterLabelMapping,
} from "@/app/providers/ProjectsProvider"
import {
  ProjectSectionLabelMapping,
  ProjectSections,
  ProjectStatus,
  ProjectStatusLabelMapping,
} from "@/lib/types"
import { cn, queryStringToObject } from "@/lib/utils"
import { IThemeStatus, IThemesButton } from "@/types/common"
import { useRouter, useSearchParams } from "next/navigation"
import React, { ChangeEvent, ReactNode, useEffect, useState } from "react"
import { useDebounce } from "react-use"

// Define the mapping for filter types
const FilterTypeMapping: Record<ProjectFilter, "checkbox" | "button"> = {
  keywords: "checkbox",
  builtWith: "checkbox",
  themes: "button",
  fundingSource: "checkbox",
}

interface FilterWrapperProps {
  label: string
  children?: ReactNode
  className?: string
}

const FilterWrapper = ({ label, children, className }: FilterWrapperProps) => {
  return (
    <div className={cn("flex flex-col gap-4 py-6", className)}>
      <span className="text-sm font-medium text-primary md:text-base">
        {label}
      </span>
      {children}
    </div>
  )
}

export const ThemesButtonMapping: IThemesButton = {
  build: {
    label: LABELS.COMMON.TAGS.BUILD,
    icon: <Icons.hammer />,
  },
  play: {
    label: LABELS.COMMON.TAGS.PLAY,
    icon: <Icons.hand />,
  },
  research: {
    label: LABELS.COMMON.TAGS.RESEARCH,
    icon: <Icons.readme />,
  },
}

export const ThemesStatusMapping: IThemeStatus = {
  active: {
    label: LABELS.COMMON.STATUS.ACTIVE,
    icon: <Icons.checkActive />,
  },
  inactive: {
    label: LABELS.COMMON.STATUS.INACTIVE,
    icon: <Icons.archived />,
  },
}

export default function ProjectFiltersBar() {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCount, setFilterCount] = useState(0)

  const {
    filters,
    toggleFilter,
    queryString,
    activeFilters,
    onFilterProject,
    setFilterFromQueryString,
  } = useProjects()

  useEffect(() => {
    if (!queryString) return
    router.push(`/projects?${queryString}`)
  }, [queryString, router])

  useEffect(() => {
    // set active filters from url
    setFilterFromQueryString(queryStringToObject(searchParams))
  }, [searchParams, setFilterFromQueryString])

  useEffect(() => {
    const count = Object.values(activeFilters).reduce((acc, curr) => {
      return acc + curr.length
    }, 0)
    setFilterCount(count)
  }, [activeFilters])

  const clearAllFilters = () => {
    setFilterFromQueryString({})
    setSearchQuery("") // clear input
    router.push("/projects")
  }

  useDebounce(
    () => {
      onFilterProject(searchQuery)
    },
    500, // debounce timeout in ms when user is typing
    [searchQuery]
  )
  const hasActiveFilters = filterCount > 0 || searchQuery.length > 0

  return (
    <>
      <Modal
        title={LABELS.COMMON.FILTERS}
        footer={
          <div className="flex">
            <Button
              disabled={!hasActiveFilters}
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
            >
              {LABELS.COMMON.CLEAR_ALL}
            </Button>
            <div className="ml-auto">
              <Button
                variant="black"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                {LABELS.COMMON.SHOW_PROJECTS}
              </Button>
            </div>
          </div>
        }
        open={showModal}
        setOpen={setShowModal}
      >
        <div className="flex flex-col divide-y divide-tuatara-200 w-full">
          {Object.entries(filters).map(([key, items]) => {
            const filterLabel = FilterLabelMapping?.[key as ProjectFilter] ?? ""
            const type = FilterTypeMapping?.[key as ProjectFilter]
            const hasItems = items.length > 0

            const hasActiveThemeFilters =
              (activeFilters?.themes ?? [])?.length > 0

            if (key === "themes" && !hasActiveThemeFilters) return null

            return (
              hasItems && (
                <FilterWrapper key={key} label={filterLabel}>
                  <div
                    className={cn("gap-y-2", {
                      "grid grid-cols-1 gap-2 md:grid-cols-3":
                        type === "checkbox",
                      "flex gap-x-4 flex-wrap": type === "button",
                    })}
                  >
                    {items.map((item, index) => {
                      const isActive =
                        activeFilters?.[key as ProjectFilter]?.includes(item)

                      if (type === "checkbox") {
                        return (
                          <Checkbox
                            key={item}
                            onClick={() =>
                              toggleFilter({
                                tag: key as ProjectFilter,
                                value: item,
                                searchQuery,
                              })
                            }
                            name={item}
                            label={item}
                            checked={isActive}
                          />
                        )
                      }

                      if (type === "button") {
                        const { icon, label } = ThemesButtonMapping[item]
                        if (!isActive) return null
                        return (
                          <div key={index}>
                            <CategoryTag
                              variant="selected"
                              closable
                              onClose={() => {
                                toggleFilter({
                                  tag: "themes",
                                  value: item,
                                  searchQuery,
                                })
                              }}
                            >
                              <div className="flex items-center gap-2">
                                {icon}
                                <span className="font-sans text-sm md:text-base">
                                  {label}
                                </span>
                              </div>
                            </CategoryTag>
                          </div>
                        )
                      }

                      return null
                    })}
                  </div>
                </FilterWrapper>
              )
            )
          })}
          <FilterWrapper
            className="hidden"
            label={LABELS.COMMON.FILTER_LABELS.FUNDING_SOURCE}
          >
            {ProjectSections.map((section) => {
              const label = ProjectSectionLabelMapping[section]
              return <Checkbox key={section} name={section} label={label} />
            })}
          </FilterWrapper>
          <FilterWrapper
            className="hidden"
            label={LABELS.COMMON.FILTER_LABELS.PROJECT_STATUS}
          >
            {Object.keys(ProjectStatus).map((section: any) => {
              // @ts-expect-error - ProjectStatusLabelMapping is not typed
              const label = ProjectStatusLabelMapping?.[section]
              return <Checkbox key={section} name={section} label={label} />
            })}
          </FilterWrapper>
        </div>
      </Modal>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <div className="grid items-center justify-between grid-cols-1 gap-3 md:grid-cols-[1fr_122px_55px] md:gap-12">
            <div className="col-span-1 grid grid-cols-[1fr_auto] gap-2 md:col-span-3 md:gap-3">
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e?.target?.value)
                  onFilterProject(e?.target?.value)
                }}
                value={searchQuery}
                placeholder={LABELS.COMMON.SEARCH_PROJECT_PLACEHOLDER}
              />
              <div className="flex items-center gap-3">
                <Badge value={filterCount}>
                  <Button
                    onClick={() => setShowModal(true)}
                    variant="white"
                    className={cn({
                      "border-2 border-anakiwa-950": filterCount > 0,
                    })}
                  >
                    <div className="flex items-center gap-2">
                      <Icons.Filter className="text-anakiwa-950 dark:text-anakiwa-400" />
                      <span className="hidden lg:block text-sm">
                        {LABELS.COMMON.FILTERS}
                      </span>
                    </div>
                  </Button>
                </Badge>
                <button
                  disabled={!hasActiveFilters}
                  onClick={clearAllFilters}
                  className="hidden lg:block bg-transparent cursor-pointer opacity-85 text-primary hover:opacity-100 disabled:pointer-events-none disabled:opacity-50 dark:text-anakiwa-400 dark:hover:text-anakiwa-400"
                >
                  <div className="flex items-center gap-2 border-b-2 border-black dark:border-anakiwa-800">
                    <span className="text-sm font-medium">
                      {LABELS.COMMON.CLEAR_ALL}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
