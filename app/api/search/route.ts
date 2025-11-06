import { NextRequest, NextResponse } from "next/server"
import { getArticles, getProjects } from "@/lib/content"
import { searchArticles, searchProjects } from "@/lib/search"

export const revalidate = 300 // 5 minutes

const allIndexes = ["blog", "projects", "research"]

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
    const matches = searchArticles(articles, query)
      .slice(0, hitsPerPage)
      .map((article: any) => ({
        objectID: article.id,
        title: article.title,
        content: article.tldr || article.content.slice(0, 200),
        url: `/blog/${article.id}`,
      }))

    if (matches.length > 0) {
      results.push({
        indexName: "blog",
        hits: matches,
      })
    }
  }

  // Search projects (applications and devtools only)
  if (!indexName || indexName === "projects") {
    const allProjects = getProjects()
    const projectsOnly = allProjects.filter(
      (p: any) =>
        p.category?.toLowerCase() === "application" ||
        p.category?.toLowerCase() === "devtools"
    )
    const matches = searchProjects(projectsOnly, query)
      .slice(0, hitsPerPage)
      .map((project: any) => ({
        objectID: project.id,
        title: project.name || project.title,
        description: project.description || project.tldr,
        url: `/projects/${project.id}`,
      }))

    if (matches.length > 0) {
      results.push({
        indexName: "projects",
        hits: matches,
      })
    }
  }

  // Search research (research category only)
  if (!indexName || indexName === "research") {
    const allProjects = getProjects()
    const researchOnly = allProjects.filter(
      (p: any) => p.category?.toLowerCase() === "research"
    )
    const matches = searchProjects(researchOnly, query)
      .slice(0, hitsPerPage)
      .map((project: any) => ({
        objectID: project.id,
        title: project.name || project.title,
        description: project.description || project.tldr,
        url: `/projects/${project.id}`,
      }))

    if (matches.length > 0) {
      results.push({
        indexName: "research",
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
