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
  cardTags?: {
    primary?: string
    secondary?: string
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
      },
    },
  }
)

const ecosystemCardVariants = cva(
  "flex flex-col overflow-hidden rounded-lg transition duration-200 ease-in border border-transparent",
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
  const { id, title, description, image, imageAlt, href, cardTags } = item

  const cardContent = (
    <>
      {showBanner && (
        <div className="relative flex flex-col border-b border-black/10">
          {image ? (
            <Image
              src={image}
              alt={imageAlt || title}
              width={1200}
              height={630}
              className="h-[160px] w-full overflow-hidden rounded-t-lg border-none object-cover"
            />
          ) : (
            <div className="h-[160px] w-full bg-gradient-to-br from-anakiwa-400 to-anakiwa-600 flex items-center justify-center rounded-t-lg">
              <span className="px-5 text-xl font-bold text-center text-black">
                {imageAlt || title}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col justify-between h-full gap-8 p-4 bg-white rounded-b-lg dark:bg-black">
        <div className="flex flex-col justify-start gap-2">
          {href ? (
            <Link href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
              <h3 className="text-2xl font-bold leading-7 text-primary duration-200 cursor-pointer hover:text-anakiwa-500">
                {title}
              </h3>
            </Link>
          ) : (
            <h3 className="text-2xl font-bold leading-7 text-primary duration-200">
              {title}
            </h3>
          )}
          {description?.length > 0 && (
            <div className="flex flex-col h-24 gap-4">
              <p className="text-tuatara-500 text-base line-clamp-4 dark:text-tuatara-200">
                {description}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            {cardTags && (
              <div className="flex items-center gap-1">
                {cardTags?.primary && (
                  <div className={tagCardVariants({ variant: "primary" })}>
                    {cardTags.primary}
                  </div>
                )}
                {cardTags?.secondary && (
                  <div className={tagCardVariants({ variant: "secondary" })}>
                    {cardTags.secondary}
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
