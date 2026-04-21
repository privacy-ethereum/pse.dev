import { NextRequest, NextResponse } from "next/server"

// Cache video data for better performance
export const revalidate = 1800 // Revalidate cache after 30 minutes

interface YoutubeVideoResponse {
  items: {
    id: string
    snippet: {
      title: string
      description: string
      publishedAt: string
      channelTitle: string
      thumbnails: {
        high: {
          url: string
        }
        standard?: {
          url: string
        }
        maxres?: {
          url: string
        }
      }
    }
  }[]
}

// Helper function to add CORS and cache headers
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() })
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ids = searchParams.get("ids")

    if (!ids) {
      return NextResponse.json(
        { error: "No video IDs provided" },
        { status: 400, headers: corsHeaders() }
      )
    }

    // API key should be in env variables
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "YouTube API key not configured" },
        { status: 500, headers: corsHeaders() }
      )
    }

    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids}&key=${apiKey}`

    const response = await fetch(youtubeApiUrl)

    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`)
    }

    const data: YoutubeVideoResponse = await response.json()

    const formattedVideos = data.items.map((item) => {
      // Get best available thumbnail
      const thumbnailUrl =
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.standard?.url ||
        item.snippet.thumbnails.high.url

      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
      }
    })

    return NextResponse.json(formattedVideos, { headers: corsHeaders() })
  } catch (error) {
    console.error("Error fetching YouTube videos:", error)
    return NextResponse.json(
      { error: "Failed to fetch videos from YouTube API" },
      { status: 500, headers: corsHeaders() }
    )
  }
}
