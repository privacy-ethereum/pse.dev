import { NextRequest, NextResponse } from "next/server"
import { getArticles, getProjects } from "@/lib/content"
import { calculateRelevance, highlight } from "@/lib/search"

export const revalidate = 300 // 5 minutes

const allIndexes = ["blog", "projects"]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query") || ""
  const indexName = searchParams.get("index") || ""
  const hitsPerPage = parseInt(searchParams.get("hitsPerPage") || "5", 10)

  if (!query || query.trim() === "") {
    return NextResponse.json({
      results: [],
      status: "empty",
      availableIndexes: allIndexes,
    })
  }

  const results = []

  // Search articles
  if (!indexName || indexName === "blog") {
    const articles = getArticles()
    const matches = articles
      .map((article) => ({
        article,
        relevance: calculateRelevance(article, query),
      }))
      .filter(({ relevance }) => relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, hitsPerPage)
      .map(({ article }) => ({
        objectID: article.id,
        title: article.title,
        content: article.tldr || article.content.slice(0, 200),
        url: `/blog/${article.id}`,
        _highlightResult: {
          title: { value: highlight(article.title, query) },
          content: {
            value: highlight(
              article.tldr || article.content.slice(0, 200),
              query
            ),
          },
        },
      }))

    if (matches.length > 0) {
      results.push({
        indexName: "blog",
        hits: matches,
      })
    }
  }

  // Search projects
  if (!indexName || indexName === "projects") {
    const projects = getProjects()
    const matches = projects
      .map((project) => ({
        project,
        relevance: calculateRelevance(project, query),
      }))
      .filter(({ relevance }) => relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, hitsPerPage)
      .map(({ project }) => ({
        objectID: project.id,
        title: project.name || project.title,
        description: project.description || project.tldr,
        url: `/projects/${project.id}`,
        _highlightResult: {
          title: { value: highlight(project.name || project.title, query) },
          description: {
            value: highlight(project.description || project.tldr || "", query),
          },
        },
      }))

    if (matches.length > 0) {
      results.push({
        indexName: "projects",
        hits: matches,
      })
    }
  }

  // If searching specific index, return single index format
  if (indexName) {
    const indexResult = results.find((r) => r.indexName === indexName)
    return NextResponse.json(
      {
        hits: indexResult?.hits || [],
        status: "success",
        availableIndexes: allIndexes,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    )
  }

  // Return multi-index format
  return NextResponse.json(
    {
      results,
      status: "success",
      availableIndexes: allIndexes,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  )
}
