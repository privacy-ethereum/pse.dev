import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import Image from "next/image"
import Link from "next/link"
import React from "react"

export interface EcosystemItem {
  id: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  href?: string
  type?: "report" | "map" | "other"
  date?: string
  team?: string
  cardTags?: {
    primary?: string
    secondary?: string
    wip?: boolean
  }
}

interface EcosystemCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ecosystemCardVariants> {
  item: EcosystemItem
  showBanner?: boolean
}

const tagCardVariants = cva(
  "text-xs font-sans text-white rounded-[3px] py-[2px] px-[6px] dark:text-black",
  {
    variants: {
      variant: {
        primary: "bg-[#D8FEA8]",
        secondary: "bg-[#C2E8F5]",
        team: "bg-[#E8D5FF]",
        wip: "bg-[#FFB84D] font-semibold",
      },
    },
  }
)

const ecosystemCardVariants = cva(
  "flex flex-col overflow-hidden rounded-lg transition duration-200 ease-in border border-transparent h-full",
  {
    variants: {
      showBanner: {
        true: "min-h-[280px]",
        false: "min-h-[200px]",
      },
      border: {
        true: "border border-slate-900/20 dark:border-anakiwa-800",
      },
    },
  }
)

export default function EcosystemCard({
  item,
  showBanner = true,
  border = false,
  className,
}: EcosystemCardProps) {
  const { id, title, description, image, imageAlt, href, date, team, cardTags } = item

  // Parse teams - split by comma and trim whitespace
  const teams = team
    ? team
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    : []

  const cardContent = (
    <>
      {showBanner && (
        <div className="relative flex flex-col border-b border-black/10">
          <Image
            src={image ? image : "/project-banners/fallback.webp"}
            alt={imageAlt || title}
            width={1200}
            height={630}
            className="h-[160px] w-full overflow-hidden rounded-t-lg border-none object-cover"
          />
          {!image && (
            <span className="absolute w-full px-5 text-xl font-bold text-center text-black -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
              {imageAlt || title}
            </span>
          )}
          {/* Teams and WIP tag in top-right corner of banner */}
          {(teams.length > 0 || cardTags?.wip) && (
            <div className="absolute top-2 right-2 flex items-center gap-1 flex-wrap justify-end">
              {cardTags?.wip && (
                <div className={tagCardVariants({ variant: "wip" })}>
                  WIP
                </div>
              )}
              {teams.map((teamName, index) => (
                <div key={index} className={tagCardVariants({ variant: "team" })}>
                  {teamName}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col justify-between gap-4 p-4 bg-white rounded-b-lg dark:bg-black relative">
        {/* Teams and WIP tag in top-right corner when no banner */}
        {!showBanner && (teams.length > 0 || cardTags?.wip) && (
          <div className="absolute top-4 right-4 flex items-center gap-1 flex-wrap justify-end">
            {cardTags?.wip && (
              <div className={tagCardVariants({ variant: "wip" })}>
                WIP
              </div>
            )}
            {teams.map((teamName, index) => (
              <div key={index} className={tagCardVariants({ variant: "team" })}>
                {teamName}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col justify-start gap-2 flex-1">
          <h3 className="text-2xl font-bold leading-7 text-primary duration-200 cursor-pointer hover:text-anakiwa-500">
            {title}
          </h3>
          {date && (
            <p className="text-sm text-tuatara-400 dark:text-tuatara-400">
              {date}
            </p>
          )}
          {description?.length > 0 && (
            <div className="flex flex-col gap-4">
              <p className="text-tuatara-500 text-base line-clamp-4 dark:text-tuatara-200">
                {description}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex justify-between items-center">
            {cardTags && (
              <div className="flex items-center gap-1 flex-wrap">
                {cardTags.primary && (
                  <div className={tagCardVariants({ variant: "primary" })}>
                    {cardTags.primary}
                  </div>
                )}
                {cardTags.secondary && (
                  <div className={tagCardVariants({ variant: "secondary" })}>
                    {cardTags.secondary}
                  </div>
                )}
                {cardTags.wip && (
                  <div className={tagCardVariants({ variant: "wip" })}>
                    WIP
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={cn(
          "group cursor-pointer",
          ecosystemCardVariants({ showBanner, border, className })
        )}
      >
        {cardContent}
      </Link>
    )
  }

  return (
    <div
      className={cn(
        "group",
        ecosystemCardVariants({ showBanner, border, className })
      )}
    >
      {cardContent}
    </div>
  )
}
