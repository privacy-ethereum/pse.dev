"use client"

import { AppLink } from "../app-link"
import { Icons } from "../icons"
import { AppContent } from "../ui/app-content"
import { Button } from "../ui/button"
import { LABELS } from "@/app/labels"
import { useYoutube } from "@/hooks/useYoutube"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  channelTitle: string
  url?: string
}

const VideoCard = ({
  video,
  isPriority = false,
}: {
  video: Video
  isPriority?: boolean
}) => {
  return (
    <Link
      href={video.url || `https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-4"
    >
      <div className="relative overflow-hidden aspect-video rounded-sm">
        <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-60 transition-opacity duration-300 z-10"></div>
        <Image
          src={video.thumbnailUrl || ""}
          alt="Video thumbnail"
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-300 scale-105 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={isPriority}
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Icons.play />
        </div>
      </div>
      <h4 className="font-sans text-sm font-normal line-clamp-3 text-white group-hover:text-tuatara-400 transition-colors">
        {video.title}
      </h4>
    </Link>
  )
}

const VideoCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="flex flex-col gap-1">
        <div className="bg-skeleton aspect-video w-full animate-pulse"></div>
        <div className="bg-skeleton h-3 w-full animate-pulse"></div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="bg-skeleton aspect-video w-full animate-pulse"></div>
        <div className="bg-skeleton h-3 w-full animate-pulse"></div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="bg-skeleton aspect-video w-full animate-pulse"></div>
        <div className="bg-skeleton h-3 w-full animate-pulse"></div>
      </div>
    </div>
  )
}

export const HomepageVideoFeed = () => {
  const { data: videos = [], isLoading, isError } = useYoutube()

  return (
    <section className="mx-auto py-10 lg:pt-0 lg:pb-20 bg-white dark:bg-black w-full">
      <AppContent className="flex flex-col gap-8 lg:max-w-[1200px] w-full">
        <div className="col-span-1 lg:col-span-4">
          <h2 className="font-sans text-base font-bold uppercase tracking-[3.36px] text-tuatara-950 text-center dark:text-tuatara-100">
            {LABELS.HOMEPAGE.VIDEOS}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_280px] gap-10 lg:gap-8 lg:divide-x divide-[#626262]">
          <div className="lg:col-span-3">
            {isLoading ? (
              <VideoCardSkeleton />
            ) : isError ? (
              <div className="flex flex-col gap-4 items-center w-full">
                <VideoCardSkeleton />
                <p className="text-center text-destructive">
                  {LABELS.HOMEPAGE.ERROR_LOADING_VIDEOS}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {videos.slice(0, 3).map((video: Video, index: number) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    isPriority={index === 0}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="lg:p-6 flex flex-col gap-8">
              <span className="text-base text-tuatara-950 dark:text-tuatara-100">
                {LABELS.HOMEPAGE.CHECK_OUT_OUR_YOUTUBE}
              </span>
              <AppLink
                href="https://www.youtube.com/@PrivacyEthereum"
                external
                variant="button"
                className="group mx-auto lg:mx-0 lg:inline-flex"
              >
                <Button className="w-fit mx-auto lg:w-full" variant="orange">
                  <div className="flex items-center gap-1">
                    <span className="font-medium uppercase">
                      {LABELS.HOMEPAGE.VISIT_OUR_CHANNEL}
                    </span>
                    <ArrowRight className="h-5 w-5 duration-200 ease-in-out group-hover:translate-x-2" />
                  </div>
                </Button>
              </AppLink>
            </div>
          </div>
        </div>
      </AppContent>
    </section>
  )
}
