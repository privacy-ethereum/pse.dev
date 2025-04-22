"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { siteConfig } from "@/config/site"
import { getProjectById } from "@/lib/projectsUtils"
import { ProjectCategory, ProjectStatus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AppContent } from "@/components/ui/app-content"
import { Markdown, createMarkdownElement } from "@/components/ui/markdown"
import { WikiCard } from "@/components/cards/wiki-card"
import { Divider } from "@/components/divider"
import { Icons } from "@/components/icons"
import DiscoverMoreProjects from "@/components/project/discover-more-projects"
import { ProjectTags } from "@/components/project/project-detail-tags"
import ProjectExtraLinks from "@/components/project/project-extra-links"
import { ProjectLinkIconMap } from "@/components/mappings/project-links"
import { WikiSideNavigation } from "@/components/wiki-side-navigation"
import { useTranslation } from "@/app/i18n/client"
import { LocaleTypes } from "@/app/i18n/settings"

export const ProjectContent = ({
  id,
  lang = "en",
}: {
  id: string
  lang: LocaleTypes
}) => {
  const router = useRouter()
  const { project, content } = getProjectById(id) ?? {}
  const { t } = useTranslation(lang, "common")

  const hasSocialLinks = Object.keys(project?.links ?? {}).length > 0

  const editPageURL = siteConfig?.editProjectPage(project?.id)

  const ProjectStatusMessageMap: Record<ProjectStatus, string> = {
    [ProjectStatus.ACTIVE]: "",
    [ProjectStatus.INACTIVE]: t("projectSunset"),
    [ProjectStatus.MAINTAINED]: t("projectMaintenance"),
  }

  const projectStatusMessage =
    ProjectStatusMessageMap?.[project?.projectStatus as ProjectStatus]

  const isResearchProject = project?.category === ProjectCategory.RESEARCH

  if (!project?.id) {
    router.push("/404")
  }

  if (!project?.id) {
    return null
  }

  return (
    <section className="bg-project-page-gradient">
      <div className="flex flex-col">
        <Divider.Section className="flex flex-col items-center">
          <AppContent className="flex flex-col gap-12 py-16">
            <div
              className={cn(
                "grid grid-cols-1 gap-10 lg:items-start lg:gap-12",
                content?.description?.length > 0
                  ? "lg:grid-cols-[140px_1fr_290px]"
                  : "lg:grid-cols-[1fr_290px]"
              )}
            >
              {content?.description?.length > 0 && (
                <WikiSideNavigation
                  className="hidden lg:block"
                  project={project}
                  content={content?.description}
                />
              )}

              <div className="flex flex-col items-center justify-center w-full gap-5 lg:col-start-2">
                <div className="w-full ">
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-6 text-left">
                      <Link
                        className="flex items-center gap-2 text-tuatara-950/80 hover:text-tuatara-950"
                        href={`/${lang}/projects`}
                      >
                        <Icons.arrowLeft />
                        <span className="font-sans text-base">
                          {t("projectLibrary")}
                        </span>
                      </Link>
                      <div className="flex flex-col gap-2">
                        <h1 className="py-2 text-3xl font-bold leading-[110%] md:text-5xl">
                          {project?.name}
                        </h1>
                        {content?.tldr && (
                          <Markdown
                            components={{
                              h1: ({ ...props }) =>
                                createMarkdownElement("h1", {
                                  className:
                                    "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4",
                                  ...props,
                                }),
                              h2: ({ ...props }) =>
                                createMarkdownElement("h2", {
                                  className:
                                    "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4",
                                  ...props,
                                }),
                              h3: ({ ...props }) =>
                                createMarkdownElement("h3", {
                                  className:
                                    "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4",
                                  ...props,
                                }),
                              h4: ({ ...props }) =>
                                createMarkdownElement("h4", {
                                  className:
                                    "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4",
                                  ...props,
                                }),
                              h5: ({ ...props }) =>
                                createMarkdownElement("h5", {
                                  className:
                                    "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4",
                                  ...props,
                                }),
                              h6: ({ ...props }) =>
                                createMarkdownElement("h6", {
                                  className:
                                    "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4",
                                  ...props,
                                }),
                              p: ({ ...props }) =>
                                createMarkdownElement("p", {
                                  className:
                                    "py-2 leading-[150%] text-base text-slate-600",
                                  ...props,
                                }),
                            }}
                          >
                            {content?.tldr}
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
                                  <p className="capitalize duration-200 text-slate-600 group-hover:text-orange">
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
                      {content?.description && (
                        <Markdown
                          components={{
                            h1: ({ ...props }) =>
                              createMarkdownElement("h1", {
                                className:
                                  "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4",
                                ...props,
                              }),
                            h2: ({ ...props }) =>
                              createMarkdownElement("h2", {
                                className:
                                  "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4",
                                ...props,
                              }),
                            h3: ({ ...props }) =>
                              createMarkdownElement("h3", {
                                className:
                                  "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4",
                                ...props,
                              }),
                            h4: ({ ...props }) =>
                              createMarkdownElement("h4", {
                                className:
                                  "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4",
                                ...props,
                              }),
                            h5: ({ ...props }) =>
                              createMarkdownElement("h5", {
                                className:
                                  "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4",
                                ...props,
                              }),
                            h6: ({ ...props }) =>
                              createMarkdownElement("h6", {
                                className:
                                  "text-neutral-700 text-[22px] leading-6 font-bold pt-10 pb-4",
                                ...props,
                              }),
                            p: ({ ...props }) =>
                              createMarkdownElement("p", {
                                className:
                                  "text-tuatara-700 font-sans text-base font-normal peer mt-4 first:mt-0",
                                ...props,
                              }),
                          }}
                        >
                          {content?.description}
                        </Markdown>
                      )}
                      <ProjectTags project={project} lang={lang} />
                    </div>
                    <ProjectExtraLinks project={project} lang={lang} />
                  </div>
                </div>
              </div>
              {!isResearchProject && (
                <WikiCard
                  className="lg:sticky lg:top-20"
                  project={project}
                  lang={lang}
                />
              )}
              <div data-section-id="edit-this-page" className="lg:col-start-2">
                <Link
                  href={editPageURL}
                  target="_blank"
                  rel="noreferrer"
                  passHref
                  className="inline-flex items-center self-start gap-2 px-4 py-2 duration-200 bg-white border-2 rounded-md group border-tuatara-950 hover:bg-tuatara-950 hover:text-white"
                >
                  <Icons.edit />
                  <span className="text-sm duration-200 text-tuatara-950 group-hover:text-white">
                    {t("editThisPage")}
                  </span>
                </Link>
              </div>
            </div>
          </AppContent>

          <DiscoverMoreProjects project={project} lang={lang} />
        </Divider.Section>
      </div>
    </section>
  )
}
