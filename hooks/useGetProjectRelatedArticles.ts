import { Article } from "@/lib/content"
import { useState, useEffect } from "react"

interface UseGetProjectRelatedArticlesProps {
  projectId: string
  excludeIds?: string[]
  partialIdMatch?: boolean
}

export async function fetchArticles(
  project: string,
  excludeIds: string[] = [],
  partialIdMatch = false
) {
  const response = await fetch(`/api/articles?project=${project}`)
  const data = await response.json()
  return data.articles.filter((article: Article) => {
    if (partialIdMatch) {
      return !excludeIds.some((excludeId) => {
        const normalizedArticleId = article.id.toLowerCase().replace(/-/g, "")
        const normalizedExcludeId = excludeId.toLowerCase().replace(/-/g, "")
        return normalizedArticleId.includes(normalizedExcludeId)
      })
    }
    // Exact match check
    return !excludeIds.includes(article.id)
  })
}

export function useGetProjectRelatedArticles({
  projectId,
  excludeIds = [],
  partialIdMatch = false,
}: UseGetProjectRelatedArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getArticles = async () => {
      try {
        const data = await fetchArticles(projectId, excludeIds, partialIdMatch)
        setArticles(data)
      } catch (error) {
        console.error("Error fetching articles:", error)
      } finally {
        setLoading(false)
      }
    }

    getArticles()
  }, [projectId])

  return {
    articles,
    loading,
  }
}
