"use client"

import dynamic from "next/dynamic"

export const HomepageVideoFeedLazy = dynamic(
  () =>
    import("@/components/sections/HomepageVideoFeed").then((mod) => ({
      default: mod.HomepageVideoFeed,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="mx-auto py-10 lg:pt-0 lg:pb-20 bg-white dark:bg-black w-full">
        <div className="flex flex-col gap-8 lg:max-w-[1200px] w-full mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-32 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  }
)
