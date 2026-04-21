"use client"

import { AppLink } from "@/components/app-link"
import { cn } from "@/lib/utils"
import { ProgressBar } from "./progress-bar"
import { StatusBadge } from "./status-badge"
import type { ProjectData, Category } from "./mastermap-data"
import { CATEGORIES } from "./mastermap-data"

interface ProjectCardProps {
  project: ProjectData
}

export function ProjectCard({ project }: ProjectCardProps) {
  const category = CATEGORIES.find(
    (c) => c.id === project.category
  ) as Category

  const cardContent = (
    <div
      className={cn(
        "group bg-white dark:bg-tuatara-800 border border-tuatara-100 dark:border-tuatara-700 rounded-lg p-6 transition-all duration-200 h-full",
        project.href &&
          "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
      )}
      style={{ borderLeftWidth: 4, borderLeftColor: category.color }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-sans text-lg font-bold text-tuatara-950 dark:text-white">
          {project.name}
        </h3>
        <span
          className="font-sans text-base font-bold ml-2 shrink-0"
          style={{ color: category.color }}
        >
          {project.completion}%
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <StatusBadge label={project.status} variant={project.statusVariant} />
      </div>

      <ProgressBar
        completion={project.completion}
        color={category.color}
        className="mb-3"
      />

      <p className="font-sans text-sm text-tuatara-500 dark:text-tuatara-300 leading-relaxed mb-4">
        {project.description}
      </p>

      <div className="flex items-center justify-between">
        {project.href ? (
          <span className="font-sans text-sm font-semibold text-anakiwa-600 dark:text-anakiwa-400 group-hover:underline">
            View roadmap &rsaquo;
          </span>
        ) : (
          <span className="font-sans text-xs text-tuatara-400">
            Ecosystem managed
          </span>
        )}
        <span className="font-sans text-[11px] text-tuatara-400 dark:text-tuatara-500">
          {category.name}
        </span>
      </div>
    </div>
  )

  if (project.href) {
    return (
      <AppLink href={project.href} variant="button" className="no-underline">
        {cardContent}
      </AppLink>
    )
  }
  return cardContent
}
