"use client"

import { useQuery } from "@tanstack/react-query"
import { Article } from "@/lib/blog"
import { ArticleListCard } from "./article-list-card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTranslation } from "react-i18next"

const ArticleInEvidenceCard = ({
  article,
  size = "lg",
  variant = "default",
  className,
  asLink = false,
  titleClassName = "",
  contentClassName = "",
  showDate = true,
}: {
  article: Article
  showReadMore?: boolean
  size?: "sm" | "lg" | "xl"
  variant?: "default" | "compact" | "xl"
  className?: string
  asLink?: boolean
  titleClassName?: string
  contentClassName?: string
  showDate?: boolean
}) => {
  const { t } = useTranslation("blog-page")

  const hideTldr = variant === "compact"

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const AsLinkWrapper = ({
    children,
    href,
    asLink,
  }: {
    children: React.ReactNode
    href: string
    asLink: boolean
  }) => {
    return asLink ? (
      <Link className="group" href={href}>
        {children}
      </Link>
    ) : (
      <>{children}</>
    )
  }

  return (
    <AsLinkWrapper href={`/blog/${article.id}`} asLink={asLink}>
      <div
        className={cn(
          "min-h-[177px] lg:min-h-[190px] relative flex flex-col gap-5 w-full items-center after:absolute after:inset-0 after:content-[''] after:bg-black after:opacity-20 group-hover:after:opacity-80 transition-opacity duration-300 after:z-[0]",
          {
            "aspect-video": !className?.includes("h-full"),
          },
          className
        )}
        style={{
          backgroundImage: `url(${article.image ?? "/fallback.webp"})`,
          backgroundSize: "cover",
          backgroundPosition: "center centers",
        }}
      >
        <div
          className={cn(
            "duration-200 flex flex-col gap-[10px] text-left relative z-[1] w-full h-full",
            {
              "px-5 lg:px-16 py-6 lg:py-16 ": size === "lg",
              "px-6 py-4 lg:p-8": size === "sm",
              "px-6 lg:p-16": size === "xl",
            },
            contentClassName
          )}
        >
          {article.date && showDate && (
            <span className="text-white text-xs font-sans font-bold tracking-[2.5px] text-left uppercase">
              {formatDate(article.date)}
            </span>
          )}
          <Link
            href={`/blog/${article.id}`}
            className={cn(
              " text-white font-display hover:text-anakiwa-400 transition-colors",
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
          <span className="text-sm text-white/80 uppercase font-inter">
            {article.authors?.join(", ")}
          </span>
          {article.tldr && !hideTldr && (
            <span
              className={
                "text-sm font-sans text-white font-normal line-clamp-2 lg:line-clamp-5 mt-auto hidden lg:block"
              }
            >
              {article.tldr}
            </span>
          )}
        </div>
      </div>
    </AsLinkWrapper>
  )
}

async function fetchArticles(tag?: string) {
  try {
    const params = new URLSearchParams()
    if (tag) params.append("tag", tag)

    const response = await fetch(`/api/articles?${params.toString()}`, {
      cache: "default",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`)
    }

    const data = await response.json()
    return data.articles || []
  } catch (error) {
    console.error("Error fetching articles:", error)
    return []
  }
}

interface ArticlesListProps {
  lang: string
  tag?: string
}

const ArticlesList = ({ lang, tag }: ArticlesListProps) => {
  const {
    data: articles = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["articles", tag],
    queryFn: () => fetchArticles(tag),
  })

  if (isLoading || articles.length === 0) {
    return <div className="flex justify-center py-10">Loading articles...</div>
  }

  if (isError) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg text-red-600">Error loading articles</p>
      </div>
    )
  }

  const lastArticle = articles[0]
  const featuredArticles = articles.slice(1, 5)
  const otherArticles = articles.slice(5)

  return (
    <div className="flex flex-col gap-10 lg:gap-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-stretch">
        <ArticleInEvidenceCard
          article={lastArticle}
          size="sm"
          className="h-full"
          asLink
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:col-span-2 h-full">
          {featuredArticles?.map((article: Article) => {
            return (
              <ArticleInEvidenceCard
                key={article.id}
                article={article}
                variant="compact"
                size="sm"
                className="h-full"
                asLink
              />
            )
          })}
        </div>
      </div>
      <div className="flex flex-col gap-5 lg:gap-14">
        {otherArticles.map((article: Article) => {
          return (
            <ArticleListCard key={article.id} lang={lang} article={article} />
          )
        })}
      </div>
    </div>
  )
}

export default ArticlesList
