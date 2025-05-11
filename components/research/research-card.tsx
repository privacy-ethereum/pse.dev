import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { VariantProps, cva } from "class-variance-authority"

import { getProjectById } from "@/lib/projectsUtils"
import {
  ProjectInterface,
  ProjectLinkWebsite,
  ProjectStatus,
  ProjectStatusLabelMapping,
} from "@/lib/types"
import { cn } from "@/lib/utils"
import { LocaleTypes } from "@/app/i18n/settings"

import { ProjectLink } from "../mappings/project-link"

interface ProjectCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof projectCardVariants> {
  project: ProjectInterface
  showLinks?: boolean // show links in the card
  showBanner?: boolean // show images in the card
  showCardTags?: boolean // show card tags in the card
  showStatus?: boolean // show status in the card
  contentClassName?: string // show status in the card
}

const tagCardVariants = cva(
  "text-xs font-sans text-tuatara-950 rounded-[3px] py-[2px] px-[6px]",
  {
    variants: {
      variant: {
        primary: "bg-[#D8FEA8]",
        secondary: "bg-[#C2E8F5]",
      },
    },
  }
)
const projectCardVariants = cva(
  "flex flex-col overflow-hidden rounded-lg transition duration-200 ease-in border border-transparent",
  {
    variants: {
      showLinks: {
        true: "min-h-[280px]",
        false: "min-h-[200px]",
      },
      border: {
        true: "border border-slate-900/20",
      },
    },
  }
)

export const ProjectStatusColorMapping: Record<ProjectStatus, string> = {
  active: "#D8FEA8",
  inactive: "#FFB7AA",
  maintained: "#FFEC9E",
}

export default function ProjectCard({
  project,
  showLinks = false,
  showBanner = false,
  border = false,
  showCardTags = true,
  showStatus = true,
  className,
  contentClassName,
  lang,
}: ProjectCardProps & { lang: LocaleTypes }) {
  const router = useRouter()

  const { id, image, links, name, imageAlt, projectStatus, cardTags } =
    project ?? {}

  const { content: projectContent } = getProjectById(id, lang)

  return (
    <div
      className={cn(
        "group cursor-pointer",
        projectCardVariants({ showLinks, border, className })
      )}
      onClick={() => {
        router.push(`/projects/${id?.toLowerCase()}`)
      }}
    >
      {showBanner && (
        <div
          className="relative flex flex-col border-b border-black/10 cursor-pointer"
          onClick={() => {
            router.push(`/projects/${id?.toLowerCase()}`)
          }}
        >
          <Image
            src={`/project-banners/${image ? image : "fallback.webp"}`}
            alt={`${name} banner`}
            width={1200}
            height={630}
            className="h-[160px] w-full overflow-hidden rounded-t-lg border-none object-cover"
          />
          {!image && (
            <span className="absolute w-full px-5 text-xl font-bold text-center text-black -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
              {imageAlt || name}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "flex flex-col justify-between h-full gap-8 p-[30px] bg-white rounded-b-lg hover:bg-research-card-gradient duration-300",
          contentClassName,
          {
            "bg-white": !showBanner,
            "bg-transparent": showBanner,
          }
        )}
      >
        <div className="flex flex-col justify-start gap-2">
          <h1 className="text-2xl font-bold leading-7 duration-200 cursor-pointer text-anakiwa-700 line-clamp-2">
            {name}
          </h1>
          {projectContent?.tldr && (
            <div className="flex flex-col h-24 gap-4">
              <p className="text-slate-900/80 line-clamp-3">
                {projectContent?.tldr}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between ">
            {showLinks && (
              <div className="flex items-center justify-start gap-3">
                {Object.entries(links ?? {})?.map(([website, url], index) => {
                  return (
                    <ProjectLink
                      key={index}
                      url={url}
                      website={website as ProjectLinkWebsite}
                    />
                  )
                })}
              </div>
            )}

            {showStatus && (
              <div
                className="px-[6px] py-[2px] text-xs font-normal leading-none flex items-center justify-center rounded-[3px]"
                style={{
                  backgroundColor: ProjectStatusColorMapping[projectStatus],
                }}
              >
                {ProjectStatusLabelMapping[project?.projectStatus]}
              </div>
            )}
            {showCardTags && (
              <>
                {cardTags && (
                  <div className="flex items-center gap-1">
                    {cardTags?.primary && (
                      <div className={tagCardVariants({ variant: "primary" })}>
                        {cardTags?.primary}
                      </div>
                    )}
                    {cardTags?.secondary && (
                      <div
                        className={tagCardVariants({ variant: "secondary" })}
                      >
                        {cardTags?.secondary}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
