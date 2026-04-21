import { getArticles } from "@/lib/content"
import { NextRequest, NextResponse } from "next/server"

// Cache control - Extended for better performance
export const revalidate = 1800 // Revalidate cache after 30 minutes
export const dynamic = "force-dynamic" // Ensure the route is always evaluated

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get("tag") || undefined
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string, 10)
    : undefined
  const project = searchParams.get("project") || undefined

  try {
    const articles = getArticles({
      tag,
      limit,
      project,
    })

    return NextResponse.json(
      {
        articles,
        success: true,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    )
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch articles", success: false },
      { status: 500 }
    )
  }
}
