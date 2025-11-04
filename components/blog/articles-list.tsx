"use client"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ArticleInEvidenceCard } from "./article-in-evidance-card"
import { ArticleListCard } from "./article-list-card"
import { LABELS } from "@/app/labels"
import { Article, ArticleTag } from "@/lib/content"
import { calculateRelevance } from "@/lib/search"
import { useQuery } from "@tanstack/react-query"
import { Search as SearchIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useDebounce, useMedia } from "react-use"

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
  tag?: string
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  tag,
}: ArticlesListProps) => {
  const router = useRouter()

  const params = useSearchParams()
  const query = params.get("query")
  const [searchQuery, setSearchQuery] = useState(query ?? "")

  const {
    data: articles = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["articles", tag],
    queryFn: () => fetchArticles(tag),
  })

  if (isLoading || articles.length === 0) {
    return null
  }

  if (isError) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg text-red-600">Error loading articles</p>
      </div>
    )
  }

  const hasSearchParams =
    (searchQuery ?? "")?.length > 0 && searchQuery !== "all"

  const lastArticle = articles[0]
  const featuredArticles = !tag ? articles.slice(1, 3) : []
  let otherArticles = !tag && !hasSearchParams ? articles.slice(3, 6) : []

  if (searchQuery === "all") {
    otherArticles = articles
  } else if (searchQuery?.length > 0) {
    otherArticles = articles
      .map((article: Article) => ({
        article,
        relevance: calculateRelevance(article, searchQuery),
      }))
      .filter(
        ({ relevance }: { relevance: number }) => relevance > 0
      )
      .sort(
        (
          a: { article: Article; relevance: number },
          b: { article: Article; relevance: number }
        ) => b.relevance - a.relevance
      )
      .map(({ article }: { article: Article }) => article)
  }

  const hasTag = tag !== undefined

  const onSearchArticles = (query: string) => {
    setSearchQuery(query)
    router.push(`/blog?query=${query}`)
  }

  useDebounce(
    () => {
      if (searchQuery === "") return null
      onSearchArticles(searchQuery)
    },
    500, // debounce timeout in ms when user is typing
    [searchQuery]
  )

  const isMobile = useMedia("(max-width: 768px)")

  return (
    <div className="flex flex-col gap-10 lg:gap-16">
      {!hasTag && !hasSearchParams && searchQuery !== "all" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 items-stretch">
          <div className="lg:col-span-2 h-full flex flex-col gap-4">
            <ArticleInEvidenceCard
              article={lastArticle}
              size="sm"
              className="h-full "
              asLink
            />
            {isMobile && (
              <>
                {featuredArticles?.map((article: Article) => {
                  return (
                    <ArticleInEvidenceCard
                      key={article.id}
                      article={article}
                      size="sm"
                      className="h-full"
                      asLink
                    />
                  )
                })}
              </>
            )}
          </div>
          {!isMobile && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 lg:col-span-2 h-full">
              {featuredArticles?.map((article: Article) => {
                return (
                  <ArticleInEvidenceCard
                    key={article.id}
                    article={article}
                    variant="compact"
                    size="sm"
                    className="h-full"
                    backgroundCover={false}
                    asLink
                  />
                )
              })}
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col gap-10 lg:gap-16 lg:px-12">
        <div className="flex flex-col gap-10 ">
          <Input
            className="max-w-[500px] mx-auto w-full"
            placeholder={LABELS.BLOG_PAGE.SEARCH_PLACEHOLDER}
            icon={SearchIcon}
            onChange={(e) => {
              onSearchArticles(e?.target?.value ?? "")
            }}
            onIconClick={() => {
              onSearchArticles(searchQuery)
            }}
          />
          <div className="flex flex-col gap-5 lg:gap-14 ">
            {otherArticles
              .filter((article: Article) => article.id !== lastArticle.id)
              .map((article: Article) => {
                return <ArticleListCard key={article.id} article={article} />
              })}
          </div>
        </div>
        {searchQuery?.length === 0 && (
          <Button
            className="mx-auto uppercase"
            onClick={() => {
              onSearchArticles("all")
            }}
          >
            {LABELS.COMMON.MORE_POSTS}
          </Button>
        )}
      </div>
    </div>
  )
}
