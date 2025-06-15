"use client"

import Link from "next/link"
import { siteConfig } from "@/config/site"
import { ProjectCategory, ProjectStatus } from "@/lib/types"

import { cn } from "@/lib/utils"
import { LABELS } from "@/app/labels"
import { AppContent } from "@/components/ui/app-content"
import { Markdown, createMarkdownElement } from "@/components/ui/markdown"
import { Divider } from "@/components/divider"
import { Icons } from "@/components/icons"
import DiscoverMoreProjects from "@/components/project/discover-more-projects"
import { ProjectTags } from "@/components/project/project-detail-tags"
import ProjectExtraLinks from "@/components/project/project-extra-links"
import { ProjectLinkIconMap } from "@/components/mappings/project-links"
import { WikiSideNavigation } from "@/components/wiki-side-navigation"
import { WikiCard } from "@/components/cards/wiki-card"
import { ProjectTeamMembers } from "@/components/project/project-team"
import { ProjectBlogArticles } from "@/components/blog/project-blog-articles"
import { ProjectYouTubeVideos } from "@/components/sections/ProjectYouTubeVideos"
import { useProjects } from "@/app/providers/ProjectsProvider"
import { Button } from "@/components/ui/button"

const markdownContentClassName =
  "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4 dark:text-tuatara-100"

const markdownComponents = {
  h1: ({ ...props }) =>
    createMarkdownElement("h1", {
      className: markdownContentClassName,
      ...props,
    }),
  h2: ({ ...props }) =>
    createMarkdownElement("h2", {
      className: markdownContentClassName,
      ...props,
    }),
  h3: ({ ...props }) =>
    createMarkdownElement("h3", {
      className: markdownContentClassName,
      ...props,
    }),
  h4: ({ ...props }) =>
    createMarkdownElement("h4", {
      className: markdownContentClassName,
      ...props,
    }),
  h5: ({ ...props }) =>
    createMarkdownElement("h5", {
      className: markdownContentClassName,
      ...props,
    }),
  h6: ({ ...props }) =>
    createMarkdownElement("h6", {
      className: markdownContentClassName,
      ...props,
    }),
  p: ({ ...props }) =>
    createMarkdownElement("p", {
      className:
        "py-2 leading-[150%] text-base text-slate-600 dark:text-tuatara-100",
      ...props,
    }),
}

export const ProjectContent = ({ id }: { id: string }) => {
  const { getProjectById } = useProjects()
  const { project } = getProjectById(id) ?? {}

  const hasSocialLinks = Object.keys(project?.links ?? {}).length > 0
  const editPageURL = siteConfig?.editProjectPage(project?.id as string)

  const ProjectStatusMessageMap: Record<ProjectStatus, string> = {
    [ProjectStatus.ACTIVE]: "",
    [ProjectStatus.INACTIVE]: LABELS.COMMON.PROJECT_SUNSET,
    [ProjectStatus.MAINTAINED]: LABELS.COMMON.PROJECT_MAINTENANCE,
  }

  const projectStatusMessage =
    ProjectStatusMessageMap?.[project?.projectStatus as ProjectStatus]

  const isResearchProject = project?.category === ProjectCategory.RESEARCH

  if (!project?.id) {
    return null
  }

  return (
    <section className="bg-project-page-gradient dark:bg-transparent-gradient">
      <div className="flex flex-col">
        <Divider.Section className="flex flex-col items-center">
          <AppContent className="flex flex-col gap-12 py-16">
            <div
              className={cn(
                "grid grid-cols-1 gap-10 lg:items-start lg:gap-12",
                (project?.content as any)?.length > 0
                  ? "lg:grid-cols-[140px_1fr_290px]"
                  : "lg:grid-cols-[1fr_290px]"
              )}
            >
              {(project?.content as any)?.length > 0 && (
                <WikiSideNavigation
                  className="hidden lg:block"
                  project={project}
                  content={project?.content as any}
                />
              )}

              <div className="flex flex-col items-center justify-center w-full gap-5 lg:col-start-2">
                <div className="w-full ">
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-6 text-left">
                      <Link
                        className="flex items-center gap-2 text-primary/80 hover:text-primary mr-auto"
                        href="/projects"
                      >
                        <Icons.arrowLeft />
                        <span className="font-sans text-base">
                          {LABELS.COMMON.PROJECT_LIBRARY}
                        </span>
                      </Link>
                      <div className="flex flex-col gap-2">
                        <h1 className="py-2 text-3xl font-bold leading-[110%] md:text-5xl">
                          {project?.name}
                        </h1>
                        {project?.tldr && (
                          <Markdown components={markdownComponents}>
                            {project?.tldr}
                          </Markdown>
                        )}
                      </div>
                    </div>
                    {hasSocialLinks && (
                      <div className="flex flex-wrap items-center justify-start gap-6 pt-4">
                        {Object?.entries(project.links ?? {})?.map(
                          ([key, value]) => {
                            return (
                              <Link
                                key={key}
                                href={value ?? ""}
                                target="_blank"
                                rel="noreferrer"
                                className="group"
                              >
                                <div className="flex items-center gap-2">
                                  {ProjectLinkIconMap?.[key]}
                                  <p className="capitalize duration-200 text-slate-600 group-hover:text-orange dark:text-white dark:group-hover:text-orange">
                                    {key}
                                  </p>
                                </div>
                              </Link>
                            )
                          }
                        )}
                      </div>
                    )}
                    <div className="mt-10 hidden h-[1px] w-full bg-anakiwa-300 md:block"></div>
                  </div>

                  <div className="flex flex-col w-full gap-6 mt-6 md:gap-10 md:mt-10">
                    {projectStatusMessage?.length > 0 && (
                      <span className="relative pl-6 text-tuatara-500">
                        <div className="border-l-[4px] border-l-orangeDark absolute left-0 top-0 bottom-0"></div>
                        <span className="text-tuatara-500">
                          {projectStatusMessage}
                        </span>
                      </span>
                    )}
                    <div className="flex flex-col w-full text-base font-normal leading-relaxed">
                      {(project?.content as any) && (
                        <Markdown components={markdownComponents}>
                          {project?.content as any}
                        </Markdown>
                      )}

                      {project?.youtubeLinks &&
                        project.youtubeLinks.length > 0 && (
                          <div className="mt-5">
                            <ProjectYouTubeVideos
                              youtubeLinks={project.youtubeLinks}
                            />
                          </div>
                        )}

                      {project?.team && project.team.length > 0 && (
                        <div className="mt-5">
                          <ProjectTeamMembers team={project.team} />
                        </div>
                      )}
                      <ProjectTags project={project} />
                    </div>

                    <ProjectExtraLinks project={project} />
                  </div>

                  <ProjectBlogArticles project={project} />
                </div>
              </div>
              {!isResearchProject && (
                <WikiCard className="lg:sticky lg:top-20" project={project} />
              )}
              <div data-section-id="edit-this-page" className="lg:col-start-2">
                <Link
                  href={editPageURL}
                  target="_blank"
                  rel="noreferrer"
                  passHref
                  className="inline-flex items-center self-start gap-2 px-4 py-2 duration-200 bg-white border-2 rounded-md group border-tuatara-950 hover:bg-tuatara-950 hover:text-white dark:bg-black dark:border-anakiwa-800 dark:border dark:hover:bg-anakiwa-400"
                >
                  <Icons.edit />
                  <span className="text-sm duration-200 text-primary group-hover:text-white">
                    {LABELS.COMMON.EDIT_THIS_PAGE}
                  </span>
                </Link>
              </div>
            </div>
          </AppContent>

          <DiscoverMoreProjects project={project} />
        </Divider.Section>
      </div>
    </section>
  )
}
