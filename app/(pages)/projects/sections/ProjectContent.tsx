"use client"

import { LABELS } from "@/app/labels"
import { AppLink } from "@/components/app-link"
import { ProjectBlogArticles } from "@/components/blog/project-blog-articles"
import { WikiCard } from "@/components/cards/wiki-card"
import { Divider } from "@/components/divider"
import { Icons } from "@/components/icons"
import { ProjectLinkIconMap } from "@/components/mappings/project-links"
import DiscoverMoreProjects from "@/components/project/discover-more-projects"
import { ProjectTags } from "@/components/project/project-detail-tags"
import ProjectExtraLinks from "@/components/project/project-extra-links"
import { ProjectTeamMembers } from "@/components/project/project-team"
import { ProjectYouTubeVideos } from "@/components/sections/ProjectYouTubeVideos"
import { AppContent } from "@/components/ui/app-content"
import { Button } from "@/components/ui/button"
import { Markdown, createMarkdownElement } from "@/components/ui/markdown"
import { WikiSideNavigation } from "@/components/wiki-side-navigation"
import { siteConfig } from "@/config/site"
import { ProjectCategory, ProjectStatus, ProjectInterface } from "@/lib/types"
import { cn } from "@/lib/utils"

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
        "py-2 leading-[150%] text-base lg:text-xl text-tuatara-500 dark:text-tuatara-100",
      ...props,
    }),
}

export const ProjectContent = ({ project }: { project: ProjectInterface }) => {
  const hasSocialLinks = Object.keys(project?.links ?? {}).length > 0

  const ProjectStatusMessageMap: Record<ProjectStatus, string> = {
    [ProjectStatus.ACTIVE]: "",
    [ProjectStatus.INACTIVE]: LABELS.COMMON.PROJECT_SUNSET,
    [ProjectStatus.MAINTAINED]: LABELS.COMMON.PROJECT_MAINTENANCE,
  }

  const projectStatusMessage =
    ProjectStatusMessageMap?.[project?.projectStatus as ProjectStatus]

  const isResearchProject =
    project?.category?.toLowerCase() === ProjectCategory.RESEARCH.toLowerCase()
  const backLink = isResearchProject ? "/research" : "/projects"

  console.table({
    isResearchProject,
  })

  return (
    <section className="bg-project-page-gradient dark:bg-transparent-gradient relative">
      <AppLink
        href={siteConfig.editProjectPage(project.id)}
        external
        className="fixed bottom-5 left-5 lg:bottom-5 lg:left-10 z-10"
        variant="button"
      >
        <Button className="w-full md:w-auto" size="sm">
          <div className="flex items-center gap-1">
            <Icons.gitHub size={18} />
            <span className="pl-2 text-left text-sm font-medium uppercase">
              {LABELS.COMMON.EDIT_THIS_PAGE}
            </span>
            <Icons.externalUrl size={22} />
          </div>
        </Button>
      </AppLink>
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
                      <AppLink href={backLink}>
                        <Icons.arrowLeft />
                        <span className="font-sans text-base">
                          {isResearchProject
                            ? LABELS.COMMON.PROJECT_RESEARCH_LIBRARY
                            : LABELS.COMMON.PROJECT_LIBRARY}
                        </span>
                      </AppLink>
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
                              <AppLink
                                key={key}
                                href={value ?? ""}
                                external
                                className="group"
                              >
                                <div className="flex items-center gap-2">
                                  {ProjectLinkIconMap?.[key]}
                                  <p className="capitalize duration-200 text-slate-600 group-hover:text-orange dark:text-white dark:group-hover:text-orange">
                                    {key}
                                  </p>
                                </div>
                              </AppLink>
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
                        <span className="text-tuatara-500 dark:text-white">
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
            </div>
          </AppContent>

          <DiscoverMoreProjects project={project} />
        </Divider.Section>
      </div>
    </section>
  )
}
