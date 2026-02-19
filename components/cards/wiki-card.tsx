"use client"

import { AppLink } from "../app-link"
import { ThemesStatusMapping } from "../project/project-filters-bar"
import { Card } from "./card"
import { LABELS } from "@/app/labels"
import { ProjectInterface, ProjectSectionLabelMapping } from "@/lib/types"
import { cn, removeProtocol } from "@/lib/utils"
import Image from "next/image"
import { ReactNode } from "react"

interface WikiDetailProps {
  label: string
  value?: ReactNode
}

interface WikiCardProps {
  project: ProjectInterface
  className?: string
}

interface WikiLinkProps {
  href: string
  external?: boolean
  children: ReactNode
}

const WikiDetail = ({ label, value }: WikiDetailProps) => {
  if (!value) return null

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-[90px_1fr] md:items-start md:gap-5">
      <div className="break-all font-sans text-xs font-bold leading-[14px] text-primary">
        {label}
      </div>
      {typeof value === "string" ? (
        <span className="font-sans text-xs font-normal leading-[18px] text-primary">
          {value}
        </span>
      ) : (
        <div className="break-all">{value}</div>
      )}
    </div>
  )
}

const WikiLink = ({ href, external, children }: WikiLinkProps) => {
  return (
    <AppLink
      className="duration-200 "
      href={href}
      external={external}
      withExternalIcon
    >
      <span className="text-xs leading-[14px]">{children}</span>
    </AppLink>
  )
}

export const WikiCard = ({ project, className = "" }: WikiCardProps) => {
  const statusItem = ThemesStatusMapping

  const { website } = project.links ?? {}

  const projectFunding = ProjectSectionLabelMapping[project?.section]
  const { label: projectStatus } = statusItem?.[project?.projectStatus] ?? {}
  const builtWithKeys: string[] = project?.tags?.builtWith ?? []
  const previousBrandImage = project?.previousBrandImage ?? ""

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="mx-auto flex max-w-[290px] flex-col gap-6 w-full">
        <Card className="bg-background" padding="none">
          <div className="relative flex h-[140px] items-center justify-center overflow-hidden rounded-t-lg">
            <Image
              src={project.image || "/project-banners/fallback.webp"}
              alt={`${project.name} banner`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              quality={85}
            />
            {!project?.image && (
              <span className="absolute w-full px-5 text-xl font-bold text-center text-black -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                {project?.imageAlt || project?.name}
              </span>
            )}
          </div>
          <div className="gap-[10px] px-6 py-4 md:flex md:flex-col">
            <WikiDetail
              label={LABELS.COMMON.FILTER_LABELS.PROJECT_STATUS}
              value={projectStatus}
            />
            {builtWithKeys?.length > 0 && (
              <WikiDetail
                label={LABELS.COMMON.FILTER_LABELS.BUILT_WITH}
                value={
                  <div className="flex flex-col gap-1 ">
                    {builtWithKeys.map((key) => (
                      <WikiLink href={`/projects?builtWith=${key}`} key={key}>
                        {key}
                      </WikiLink>
                    ))}
                  </div>
                }
              />
            )}
            <WikiDetail
              label={LABELS.COMMON.FILTER_LABELS.FUNDING}
              value={projectFunding}
            />
            <WikiDetail
              label={LABELS.COMMON.FILTER_LABELS.LICENSE}
              value={project?.license}
            />
            {website && (
              <WikiDetail
                label="Website"
                value={
                  <WikiLink href={website} external>
                    {removeProtocol(website)}
                  </WikiLink>
                }
              />
            )}
          </div>
        </Card>
        {(previousBrandImage ?? "")?.length > 0 && (
          <Card padding="none">
            <div className="relative flex max-h-[140px] items-center justify-center overflow-hidden rounded-t-lg ">
              <Image
                src={previousBrandImage}
                alt={`${project.name} banner`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                quality={85}
              />
              {!project?.image && (
                <span className="absolute w-full px-5 text-xl font-bold text-center text-black -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                  {project?.imageAlt || project?.name}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center py-4 bg-background">
              <span className="text-xs font-normal text-black">
                {LABELS.COMMON.PREV_BRAND_IMAGE}
              </span>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
