import { ProjectLink } from "../mappings/project-link"
import {
  ProjectInterface,
  ProjectLinkWebsite,
  ProjectStatus,
  ProjectStatusLabelMapping,
} from "@/lib/types"
import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"

interface ProjectCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof projectCardVariants> {
  project: ProjectInterface
  showLinks?: boolean // show links in the card
  showBanner?: boolean // show images in the card
}

const tagCardVariants = cva(
  "text-xs font-sans text-white rounded-[3px] py-[2px] px-[6px] dark:text-black",
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
        true: "border border-slate-900/20 dark:border-anakiwa-800",
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
  className,
}: ProjectCardProps) {
  const router = useRouter()

  const { id, image, links, name, imageAlt, projectStatus, cardTags, tldr } =
    project ?? {}

  return (
    <div
      className={cn(
        "group",
        projectCardVariants({ showLinks, border, className })
      )}
    >
      {showBanner && (
        <div
          className="relative flex flex-col border-b border-black/10 cursor-pointer"
          onClick={() => {
            router.push(`/projects/${id}`)
          }}
        >
          <Image
            src={image || "/project-banners/fallback.webp"}
            alt="Project banner image"
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
      <div className="flex flex-col justify-between h-full gap-8 p-4 bg-white rounded-b-lg dark:bg-black">
        <div className="flex flex-col justify-start gap-2">
          <Link href={`/projects/${id}`}>
            <h3 className="text-2xl font-bold leading-7 text-primary duration-200 cursor-pointer hover:text-anakiwa-500">
              {name}
            </h3>
          </Link>
          {(tldr ?? "")?.length > 0 && (
            <div className="flex flex-col h-24 gap-4">
              <p className=" text-tuatara-500 text-base line-clamp-4 dark:text-tuatara-200">
                {tldr}
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

            <div
              className="px-[6px] py-[2px] text-xs font-normal leading-none flex items-center justify-center rounded-[3px] text-black dark:text-black"
              style={{
                backgroundColor: ProjectStatusColorMapping[projectStatus],
              }}
            >
              {ProjectStatusLabelMapping[project?.projectStatus]}
            </div>
            {cardTags && (
              <div className="flex items-center gap-1">
                {cardTags?.primary && (
                  <div className={tagCardVariants({ variant: "primary" })}>
                    {cardTags?.primary}
                  </div>
                )}
                {cardTags?.secondary && (
                  <div className={tagCardVariants({ variant: "secondary" })}>
                    {cardTags?.secondary}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
