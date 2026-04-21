"use client"

import { useMemo } from "react"
import { useProjects } from "@/app/providers/ProjectsProvider"
import ProjectCard from "../project/project-card"

interface BlogArticleRelatedProjectsProps {
  projectsIds: string[]
}

export const BlogArticleRelatedProjects = ({
  projectsIds,
}: BlogArticleRelatedProjectsProps) => {
  const { projects: allProjects, researchs: allResearchs } = useProjects()

  const projects = useMemo(() => {
    return [...allProjects, ...allResearchs].filter((project) =>
      projectsIds.includes(project.id)
    )
  }, [allProjects, allResearchs, projectsIds])

  if (projects.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-primary text-lg font-semibold leading-6">
        Related projects
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-6 md:gap-y-10 lg:grid-cols-3">
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            showBanner
            border
            showLinks={false}
          />
        ))}
      </div>
    </div>
  )
}
