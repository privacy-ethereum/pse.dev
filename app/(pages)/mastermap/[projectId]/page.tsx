import { notFound } from "next/navigation"
import { AppLink } from "@/components/app-link"
import { AppContent } from "@/components/ui/app-content"
import { CategoryTag } from "@/components/ui/categoryTag"
import { NowNextLater } from "@/components/mastermap/now-next-later"
import { ProgressBar } from "@/components/mastermap/progress-bar"
import { StatusBadge } from "@/components/mastermap/status-badge"
import { PROJECTS, CATEGORIES } from "@/components/mastermap/mastermap-data"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ projectId: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { projectId } = await params
  const project = PROJECTS.find((p) => p.id === projectId)
  if (!project) return { title: "Not Found" }
  return {
    title: `${project.name} — Master Map`,
    description: project.description,
  }
}

export function generateStaticParams() {
  return PROJECTS.filter((p) => p.href).map((p) => ({ projectId: p.id }))
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { projectId } = await params
  const project = PROJECTS.find((p) => p.id === projectId)
  if (!project) notFound()

  const category = CATEGORIES.find((c) => c.id === project.category)!

  return (
    <div className="flex flex-col gap-8 pb-32">
      <AppContent className="flex flex-col gap-6 pt-10 w-full">
        {/* Back link */}
        <AppLink
          href="/mastermap"
          variant="blue"
          className="font-sans text-sm"
        >
          &larr; Back to Master Map
        </AppLink>

        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold font-display text-tuatara-950 dark:text-white mb-2">
            {project.name}
          </h1>
          <p className="text-base lg:text-lg text-tuatara-500 dark:text-tuatara-300 font-sans max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Completion + Status */}
        <div className="flex flex-wrap items-center gap-4">
          <StatusBadge
            label={project.status}
            variant={project.statusVariant}
          />
          <div className="flex items-center gap-3">
            <span className="font-sans text-sm font-semibold text-tuatara-950 dark:text-white">
              Roadmap Completion: {project.completion}%
            </span>
            <div className="w-48">
              <ProgressBar
                completion={project.completion}
                color={category.color}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <CategoryTag key={tag} variant="gray">
                {tag}
              </CategoryTag>
            ))}
          </div>
        )}
      </AppContent>

      {/* Now / Next / Later */}
      {(project.now.length > 0 ||
        project.next.length > 0 ||
        project.later.length > 0) && (
        <AppContent>
          <NowNextLater
            now={project.now}
            next={project.next}
            later={project.later}
          />
        </AppContent>
      )}

      {/* Details Grid */}
      {project.details && (
        <AppContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-sans text-base font-bold text-tuatara-950 dark:text-white mb-3">
                Description
              </h3>
              <ul className="space-y-2">
                {project.details.description.map((item, i) => (
                  <li
                    key={i}
                    className="font-sans text-sm text-tuatara-500 dark:text-tuatara-300 flex gap-2"
                  >
                    <span className="text-anakiwa-500 shrink-0">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-tuatara-950 dark:text-white mb-3">
                Deliverables
              </h3>
              <ul className="space-y-2">
                {project.details.deliverables.map((item, i) => (
                  <li
                    key={i}
                    className="font-sans text-sm text-tuatara-500 dark:text-tuatara-300 flex gap-2"
                  >
                    <span className="text-anakiwa-500 shrink-0">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-tuatara-950 dark:text-white mb-3">
                Impact
              </h3>
              <ul className="space-y-2">
                {project.details.impact.map((item, i) => (
                  <li
                    key={i}
                    className="font-sans text-sm text-tuatara-500 dark:text-tuatara-300 flex gap-2"
                  >
                    <span className="text-anakiwa-500 shrink-0">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AppContent>
      )}

      {/* KPIs */}
      {project.kpis && project.kpis.length > 0 && (
        <AppContent>
          <h3 className="font-sans text-base font-bold text-tuatara-950 dark:text-white mb-4">
            Key Performance Indicators
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm border-collapse">
              <thead>
                <tr className="border-b border-tuatara-100 dark:border-tuatara-700">
                  <th className="text-left py-3 px-4 font-semibold text-tuatara-950 dark:text-white bg-tuatara-100/50 dark:bg-tuatara-800 rounded-tl">
                    KPI
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-tuatara-950 dark:text-white bg-tuatara-100/50 dark:bg-tuatara-800">
                    Target
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-tuatara-950 dark:text-white bg-tuatara-100/50 dark:bg-tuatara-800 rounded-tr">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {project.kpis.map((kpi, i) => (
                  <tr
                    key={i}
                    className="border-b border-tuatara-100 dark:border-tuatara-700"
                  >
                    <td className="py-3 px-4 text-tuatara-600 dark:text-tuatara-300">
                      {kpi.label}
                    </td>
                    <td className="py-3 px-4 text-tuatara-600 dark:text-tuatara-300">
                      {kpi.target}
                    </td>
                    <td className="py-3 px-4 text-tuatara-400 dark:text-tuatara-500">
                      {kpi.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AppContent>
      )}
    </div>
  )
}
