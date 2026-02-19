"use client"

import ProjectCard from "./project-card"
import { SectionWrapper } from "@/app/components/wrappers/SectionWrapper"
import { LABELS } from "@/app/labels"
import { useProjects } from "@/app/providers/ProjectsProvider"
import {
  ProjectInterface,
  ProjectSection,
  ProjectSectionLabelMapping,
  ProjectSections,
  ProjectStatus,
  ProjectStatusDescriptionMapping,
} from "@/lib/types"
import { cn } from "@/lib/utils"
import NoResultIcon from "@/public/icons/no-result.svg"
import Image from "next/image"
import React, { useCallback, useEffect, useRef, useState } from "react"

const NoResults = () => {
  return (
    <div className="flex flex-col gap-2 pt-24 pb-40 text-center">
      <div className="mx-auto">
        <Image className="h-9 w-9" src={NoResultIcon} alt="No projects found" />
      </div>
      <span className="text-2xl font-bold font-display text-primary">
        {LABELS.COMMON.NO_RESULTS}
      </span>
      <span className="text-lg font-normal text-primary">
        {LABELS.COMMON.NO_RESULTS_DESCRIPTION}
      </span>
    </div>
  )
}

const ProjectStatusOrderList = ["active", "maintained", "inactive"]

export const ProjectList = () => {
  const SCROLL_OFFSET = -400
  const [activeId, setActiveId] = useState("")
  const [isManualScroll, setIsManualScroll] = useState(false)

  const { projects, searchQuery, activeFilters, isLoading } = useProjects()
  const hasSearchParams =
    searchQuery?.length > 0 ||
    Object.values({
      keywords: activeFilters?.keywords ?? [],
      builtWith: activeFilters?.builtWith ?? [],
      themes: activeFilters?.themes ?? [],
    }).some((arr) => arr.length > 0)

  const noItems = projects?.length === 0

  const sectionsRef = useRef<NodeListOf<HTMLElement> | null>(null) // sections are constant so useRef might be better here

  useEffect(() => {
    if (typeof window !== "undefined") {
      sectionsRef.current = document.querySelectorAll("div[data-section]")

      const handleScroll = () => {
        if (isManualScroll) return

        sectionsRef.current?.forEach((section: any) => {
          const sectionTop = section.offsetTop - SCROLL_OFFSET
          if (window.scrollY >= sectionTop && window.scrollY > 0) {
            setActiveId(section.getAttribute("id"))
          }
        })
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [SCROLL_OFFSET, isManualScroll])

  const scrollToId = useCallback((id: string) => {
    if (typeof window !== "undefined") {
      const element = document.getElementById(id)
      const top = element?.offsetTop ?? 0

      if (element) {
        setActiveId(id) // active clicked id
        setIsManualScroll(true) // tell the window event listener to ignore this scrolling
        window?.scrollTo({
          behavior: "smooth",
          top: (top ?? 0) - SCROLL_OFFSET,
        })
      }

      setTimeout(() => setIsManualScroll(false), 800)
    }
  }, [])

  // loading state skeleton
  if (isLoading) {
    return (
      <div className="grid items-start justify-between w-full grid-cols-1 gap-2 md:grid-cols-4 md:gap-6">
        <div className="min-h-[380px] border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-300 animate-pulse h-[180px] w-full"></div>
        </div>
        <div className="min-h-[380px] border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-300 animate-pulse h-[180px] w-full"></div>
        </div>
        <div className="min-h-[380px] border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-300 animate-pulse h-[180px] w-full"></div>
        </div>
        <div className="min-h-[380px] border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-300 animate-pulse h-[180px] w-full"></div>
        </div>
      </div>
    )
  }

  if (noItems) return <NoResults />

  const projectsGroupByStatus = projects.reduce((acc, project) => {
    acc[project.projectStatus] = [
      ...(acc[project.projectStatus] || []),
      project,
    ]
    return acc
  }, {} as Record<ProjectStatus, ProjectInterface[]>)

  if (hasSearchParams) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-6 md:gap-y-10 lg:grid-cols-4">
        {projects?.map((project: any) => (
          <ProjectCard
            key={project?.id}
            project={project}
            showBanner
            showLinks
            border
          />
        ))}
      </div>
    )
  }

  return (
    <div className="relative grid items-start justify-between grid-cols-1">
      <div className="flex flex-col gap-10">
        {ProjectStatusOrderList.map((status, index) => {
          const projects = projectsGroupByStatus[status as ProjectStatus] ?? []
          const description =
            ProjectStatusDescriptionMapping?.[status as ProjectStatus]

          const hasProjects = projects?.length > 0

          if (!hasProjects) return null // no projects for this status, hide the section

          return (
            <div
              key={index}
              data-section={status}
              className="flex justify-between gap-10"
            >
              <div className={cn("flex w-full flex-col gap-10")}>
                <SectionWrapper
                  title={status}
                  description={description}
                  showHeader={!hasSearchParams}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-6 md:gap-y-10 lg:grid-cols-4">
                  {projects.map((project: any) => (
                    <ProjectCard
                      key={project?.id}
                      project={project}
                      showBanner
                      showLinks
                      border
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div id="sidebar" className="sticky hidden p-8 top-20 bg-white/30">
        <div className="flex flex-col gap-4">
          <h6 className="text-lg font-bold font-display text-secondary">
            {LABELS.RESOURCES_PAGE.ON_THIS_PAGE}
          </h6>
          <ul className="font-sans text-black text-normal">
            {ProjectSections.map((id: ProjectSection) => {
              const label = ProjectSectionLabelMapping[id]

              if (!label) return null // no label for this section

              const active = id === activeId

              return (
                <li
                  key={id}
                  onClick={() => {
                    scrollToId(id)
                  }}
                  data-id={id}
                  className={cn(
                    "flex h-8 cursor-pointer items-center border-l-2 border-l-anakiwa-200 px-3 duration-200",
                    {
                      "border-l-anakiwa-500 text-anakiwa-500 font-medium":
                        active,
                    }
                  )}
                >
                  {label}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
