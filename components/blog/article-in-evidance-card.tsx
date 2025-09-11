"use client"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import { LABELS } from "@/app/labels"
import { Article } from "@/lib/content"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface ArticleInEvidenceCardProps {
  article: Article
  showReadMore?: boolean
  size?: "sm" | "lg" | "xl"
  variant?: "default" | "compact" | "xl"
  className?: string
  asLink?: boolean
  titleClassName?: string
  contentClassName?: string
  showDate?: boolean
  backgroundCover?: boolean
}

const AsLinkWrapper = ({
  children,
  href,
  asLink,
  className = "",
}: {
  children: React.ReactNode
  href: string
  asLink: boolean
  className?: string
}) => {
  return asLink ? (
    <Link className={cn("group", className)} href={href}>
      {children}
    </Link>
  ) : (
    <div className={cn("group", className)}>{children}</div>
  )
}

export const ArticleInEvidenceCard = ({
  article,
  showReadMore = false,
  size = "lg",
  variant = "default",
  className,
  asLink = false,
  titleClassName = "",
  contentClassName = "",
  showDate = true,
  backgroundCover = true,
}: ArticleInEvidenceCardProps) => {
  const hideTldr = variant === "compact"

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const ArticleContent = ({ backgroundCover = true }: any) => {
    return (
      <div
        className={cn(
          "duration-200 flex flex-col gap-4 text-left relative z-[1] w-full justify-center",
          {
            "px-5 lg:px-16 py-6 lg:py-16": size === "lg",
            "px-6 py-4 lg:p-8": size === "sm",
            "px-6 lg:p-16 justify-center": size === "xl",
            "!p-0 lg:!p-0": !backgroundCover,
          },
          contentClassName
        )}
      >
        {article.date && showDate && (
          <span
            className={cn(
              "text-white text-xs font-sans font-bold tracking-[2.5px] text-left uppercase",
              backgroundCover
                ? "text-white dark:text-white"
                : "text-black dark:text-white"
            )}
          >
            {formatDate(article.date)}
          </span>
        )}
        <div className="flex flex-col gap-2">
          <Link
            href={`/blog/${article.id}`}
            className={cn(
              "font-display hover:text-anakiwa-400 group-hover:text-anakiwa-400 transition-colors",
              backgroundCover
                ? "text-white dark:text-white"
                : "text-black dark:text-white group-hover:underline",
              {
                "text-[20px] font-semibold lg:font-bold lg:text-lg line-clamp-2 mt-auto":
                  variant === "compact",
                "text-[20px] font-semibold lg:font-bold line-clamp-3 mt-auto":
                  variant === "default",
                "text-[20px] font-bold lg:!text-[40px] lg:!leading-[44px] mt-auto":
                  variant === "xl",
              },
              titleClassName
            )}
          >
            {article.title}
          </Link>
          {(article?.authors ?? [])?.length > 0 && (
            <span
              className={cn("text-sm font-sans", {
                "text-white/80": backgroundCover,
                "text-tuatara-600 dark:text-white/80": !backgroundCover,
              })}
            >
              {article.authors?.join(", ")}
            </span>
          )}
          {article.tldr && !hideTldr && (
            <span
              className={cn(
                "text-sm font-san font-normal line-clamp-2 lg:line-clamp-5 mt-auto hidden lg:block",
                {
                  "text-white/80": backgroundCover,
                  "text-tuatara-600 dark:text-white/80": !backgroundCover,
                }
              )}
            >
              {article.tldr}
            </span>
          )}
        </div>
        {(article?.tags ?? [])?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article?.tags?.slice(0, 3)?.map((tag) => (
              <Link key={tag.id} href={`/blog/tags/${tag.id}`}>
                <Button size="xs" variant="secondary">
                  {tag.name}
                </Button>
              </Link>
            ))}
          </div>
        )}
        {showReadMore && (
          <Link
            href={`/blog/${article.id}`}
            className="ml-auto mt-4"
            aria-label={`Read more about ${article.title}`}
          >
            <Button className="uppercase ml-auto" variant="secondary">
              <div className="flex items-center gap-2">
                <span className="!text-center">
                  {LABELS.BLOG_PAGE.READ_MORE}
                </span>
                <Icons.arrowRight className="w-4 h-4" />
              </div>
            </Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <AsLinkWrapper
      href={`/blog/${article.id}`}
      asLink={asLink}
      className="flex flex-col gap-4"
    >
      <div
        className={cn(
          "relative flex flex-col gap-5 w-full items-center overflow-hidden after:absolute after:inset-0 after:content-[''] after:bg-black after:opacity-20 group-hover:after:opacity-80 transition-opacity duration-300 after:z-[0]",
          {
            "aspect-video": !className?.includes("h-full"),
            "min-h-[200px] max-h-[200px]": !backgroundCover,
            "min-h-[177px] lg:min-h-[190px]": backgroundCover,
          },
          className
        )}
      >
        <Image
          src={article.image ?? "/fallback.webp"}
          alt="Article hero image"
          fill
          className="object-cover z-[0]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        {backgroundCover && (
          <ArticleContent backgroundCover={backgroundCover} />
        )}
      </div>
      {!backgroundCover && <ArticleContent backgroundCover={backgroundCover} />}
    </AsLinkWrapper>
  )
}
