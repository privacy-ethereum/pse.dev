import { NextResponse } from "next/server"
import { generateRssFeed } from "@/lib/rss"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate every hour

export async function GET(request: Request) {
  try {
    const feed = await generateRssFeed()
    console.log("RSS feed generated successfully")

    return new NextResponse(feed, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    })
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }
    return new NextResponse(
      `Error generating RSS feed: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    )
  }
}
