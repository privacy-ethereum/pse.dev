"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useProjects } from "@/app/providers/ProjectsProvider"

import { ProjectInterface } from "@/lib/types"
import { shuffleArray } from "@/lib/utils"
import { LABELS } from "@/app/labels"

import { Icons } from "../icons"
import ProjectCard from "./project-card"
import { ProjectProps } from "@/app/(pages)/projects/[id]/page"

export default function DiscoverMoreProjects({ project }: ProjectProps) {
  const { projects: allProjects, onFilterProject } = useProjects()

  const suggestedProject = useMemo(() => {
    const projectList = allProjects.filter(
      (p: ProjectInterface) => p.id !== project.id
    )

    // Filter projects by tags
    onFilterProject("")
    const suggestedProjects = projectList.filter((p) => {
      const projectThemes = project.tags?.themes ?? []
      const pThemes = p.tags?.themes ?? []
      return projectThemes.some((tag) => pThemes.includes(tag))
    })

    // No match return random projects
    if (suggestedProjects?.length < 2) {
      return shuffleArray(projectList).slice(0, 2)
    }

    return suggestedProjects.slice(0, 2)
  }, [allProjects, project.id, project.tags?.themes, onFilterProject])

  return (
    <div className="w-full bg-cover-gradient dark:bg-transparent-gradient">
      <div className="mx-auto flex w-full max-w-[644px] flex-col items-center justify-center gap-14 px-6 py-12 md:px-0 md:py-16">
        <h2 className="text-3xl font-bold text-center">
          {LABELS.COMMON.DISCOVER_MORE}
        </h2>
        <div className="grid flex-col grid-cols-1 gap-5 md:grid-cols-2 md:flex-row">
          {suggestedProject?.map((project: ProjectInterface) => (
            <ProjectCard key={project.id} border project={project} />
          ))}
        </div>
        <Link
          className="flex items-center gap-2 text-primary/80 hover:text-primary"
          href="/projects"
        >
          <Icons.arrowLeft />
          <span className="font-sans text-base">
            {LABELS.COMMON.BACK_TO_PROJECT_LIBRARY}
          </span>
        </Link>
      </div>
    </div>
  )
}
