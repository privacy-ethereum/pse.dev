import { NextResponse } from "next/server"

const CHANNEL_ID = "UCh7qkafm95-kRiLMVPlbIcQ" // Privacy Stewards of Ethereum channel ID
const MAX_VIDEOS = 6

export const revalidate = 3600

export async function GET() {
  try {
    console.log(`Fetching videos from YouTube channel: ${CHANNEL_ID}`)

    const videos = await getVideosFromRSS()

    return NextResponse.json(
      { videos },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    )
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ videos: [] })
  }
}

async function getVideosFromRSS() {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
    const response = await fetch(rssUrl, { next: { revalidate } })

    if (!response.ok) {
      throw new Error(`YouTube RSS feed responded with ${response.status}`)
    }

    const xmlData = await response.text()

    const videos = parseVideosFromXml(xmlData)

    return videos.slice(0, MAX_VIDEOS)
  } catch (error) {
    console.error("Error fetching videos from RSS feed:", error)
    return []
  }
}

function parseVideosFromXml(xmlData: string) {
  const videos = []
  const entries = []

  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  let match

  while ((match = entryRegex.exec(xmlData)) !== null) {
    entries.push(match[1])
  }

  for (const entry of entries) {
    try {
      const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)
      if (!videoIdMatch) continue
      const videoId = videoIdMatch[1]

      const titleMatch = entry.match(/<title>(.*?)<\/title>/)
      const title = titleMatch ? decodeHtmlEntities(titleMatch[1]) : ""

      const descriptionMatch = entry.match(
        /<media:description>([\s\S]*?)<\/media:description>/
      )
      const fullDescription = descriptionMatch
        ? decodeHtmlEntities(descriptionMatch[1])
        : ""

      const description =
        fullDescription.length > 150
          ? fullDescription.substring(0, 150) + "..."
          : fullDescription

      const publishedMatch = entry.match(/<published>(.*?)<\/published>/)
      const publishedAt = publishedMatch
        ? publishedMatch[1]
        : new Date().toISOString()

      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

      videos.push({
        id: videoId,
        title,
        description,
        thumbnailUrl,
        publishedAt,
        channelTitle: "Privacy Stewards of Ethereum",
        url: `https://www.youtube.com/watch?v=${videoId}`,
      })
    } catch (error) {
      console.warn("Error parsing video entry:", error)
    }
  }

  return videos
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
}
