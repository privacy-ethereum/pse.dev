import { LABELS } from "@/app/labels"
import ProjectFiltersBar from "@/components/project/project-filters-bar"
import { ProjectGraduated } from "@/components/project/project-graduated"
import { ProjectList } from "@/components/project/project-list"
import { ProjectResultBar } from "@/components/project/project-result-bar"
import { AppContent } from "@/components/ui/app-content"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Project Library",
  description:
    "PSE supports projects working on theoretical cryptography research, protocol development, open source tooling, experimental applications, and more.",
}

export default async function ProjectsPage() {
  return (
    <div className="flex flex-col">
      <AppContent className="flex flex-col gap-10 pt-10 pb-20 lg:py-16 w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-10">
            <div className="lg:w-1/2 mx-auto w-full">
              <div className="flex flex-col gap-10">
                <h1 className="dark:text-tuatara-100 text-tuatara-950 text-2xl lg:text-3xl lg:leading-[45px] font-normal font-sans text-center">
                  {LABELS.PROJECTS_PAGE.TITLE}
                </h1>
                <Suspense fallback={<div>Loading...</div>}>
                  <ProjectFiltersBar />
                </Suspense>
              </div>
            </div>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectResultBar />
          </Suspense>
        </div>
        <ProjectList />
      </AppContent>
      <ProjectGraduated />
    </div>
  )
}
