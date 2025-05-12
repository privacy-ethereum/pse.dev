"use client"

import { useTranslation } from "@/app/i18n/client"
import Image from "next/image"
import Link from "next/link"
import { Icons } from "../icons"
import { useEffect, useState } from "react"

interface VideoCardProps {
  videoId: string
}

const VideoCard = ({ videoId }: VideoCardProps) => {
  const [title, setTitle] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  useEffect(() => {
    // Use YouTube's oEmbed API to get video title (no CORS issues)
    fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        setTitle(data.title)
        setIsLoading(false)
      })
      .catch(() => {
        // If oEmbed fails, we'll just show "YouTube Video"
        setIsLoading(false)
      })
  }, [videoId])

  return (
    <Link
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-4"
    >
      <div className="relative overflow-hidden aspect-video rounded-sm">
        <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-60 transition-opacity duration-300 z-10"></div>
        <Image
          src={thumbnailUrl}
          alt={title || "YouTube video"}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-300 scale-105 group-hover:scale-110"
          onError={(e) => {
            // Fallback to medium quality if maxresdefault is not available
            const target = e.target as HTMLImageElement
            target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Icons.play />
        </div>
      </div>
      <h3 className="font-sans text-sm font-normal line-clamp-3 text-tuatara-800 group-hover:text-tuatara-600 transition-colors">
        {isLoading ? (
          <div className="h-5 w-full bg-slate-200 animate-pulse rounded-sm"></div>
        ) : (
          title || "YouTube Video"
        )}
      </h3>
    </Link>
  )
}

export const ProjectYouTubeVideos = ({
  youtubeLinks,
  lang,
}: {
  youtubeLinks: string[]
  lang: string
}) => {
  const { t } = useTranslation(lang, "common")
  const [videoIds, setVideoIds] = useState<string[]>([])

  const extractVideoId = (url: string): string => {
    if (url.includes("youtube.com/watch?v=")) {
      const urlObj = new URL(url)
      return urlObj.searchParams.get("v") || ""
    } else if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1]?.split("?")[0] || ""
    } else if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url
    }
    return ""
  }

  useEffect(() => {
    if (!youtubeLinks || youtubeLinks.length === 0) {
      return
    }

    // Extract valid video IDs
    const ids = youtubeLinks.map(extractVideoId).filter((id) => id)

    setVideoIds(ids)
  }, [youtubeLinks])

  if (!youtubeLinks || youtubeLinks.length === 0 || videoIds.length === 0) {
    return null
  }

  return (
    <section
      className="w-full py-6"
      id="youtube-videos"
      data-section-id="youtube-videos"
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-[22px] font-bold text-tuatara-700">
          {t("projectVideos") || "Project Videos"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoIds.map((videoId) => (
            <VideoCard key={videoId} videoId={videoId} />
          ))}
        </div>
      </div>
    </section>
  )
}
