import { LABELS } from "@/app/labels"
import { AppContent } from "@/components/ui/app-content"
import { ProjectCard } from "@/components/mastermap/project-card"
import { CATEGORIES, PROJECTS } from "@/components/mastermap/mastermap-data"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Master Map",
  description:
    "A consolidated view of PSE's highest-priority initiatives across Private Proving, Private Writes, and Private Reads.",
}

export default function MasterMapPage() {
  return (
    <div className="flex flex-col gap-10 pb-32">
      {/* Header */}
      <AppContent className="flex flex-col gap-4 pt-10 w-full">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="dark:text-tuatara-100 text-tuatara-950 text-2xl lg:text-4xl font-bold font-display">
              {LABELS.MASTER_MAP_PAGE.TITLE}
            </h1>
            <p className="text-base lg:text-lg dark:text-tuatara-200 text-tuatara-500 font-sans">
              {LABELS.MASTER_MAP_PAGE.SUBTITLE}
            </p>
          </div>
          <p className="text-xs text-tuatara-400 dark:text-tuatara-500 font-sans italic shrink-0 mt-2">
            {LABELS.MASTER_MAP_PAGE.DISCLAIMER}
          </p>
        </div>
      </AppContent>

      {/* Category Sections */}
      {CATEGORIES.map((category) => {
        const categoryProjects = PROJECTS.filter(
          (p) => p.category === category.id
        )
        if (categoryProjects.length === 0) return null

        return (
          <AppContent key={category.id} className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold font-display text-tuatara-950 dark:text-white">
                {category.name}
              </h2>
              <p className="text-sm lg:text-base text-tuatara-500 dark:text-tuatara-300 font-sans mt-1">
                {category.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </AppContent>
        )
      })}
    </div>
  )
}
