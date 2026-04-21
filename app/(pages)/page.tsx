import { LABELS } from "../labels"
import { BlogRecentArticles } from "@/components/blog/blog-recent-articles"
import { Icons } from "@/components/icons"
import { HomepageBanner } from "@/components/sections/HomepageBanner"
import { OurWork } from "@/components/sections/OurWork"
import { ParallaxHero } from "@/components/sections/ParallaxHero"
import { AppContent } from "@/components/ui/app-content"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Suspense } from "react"

// Lazy load video feed to improve initial page load
const HomepageVideoFeed = dynamic(
  () =>
    import("@/components/sections/HomepageVideoFeed").then((mod) => ({
      default: mod.HomepageVideoFeed,
    })),
  {
    ssr: false, // Don't block server rendering
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

function BlogSection() {
  return (
    <Suspense
      fallback={
        <div className="py-10 lg:py-16 text-center">
          Loading recent articles...
        </div>
      }
    >
      <BlogRecentArticles />
    </Suspense>
  )
}

export default function IndexPage() {
  return (
    <section className="flex flex-col w-full">
      <ParallaxHero />

      <div className="flex flex-col justify-center bg-white dark:bg-black py-16 lg:py-20">
        <AppContent className="lg:max-w-[890px] flex flex-col mx-auto gap-10 justify-center items-center">
          <span className="font-sans text-base text-center text-tuatara-950 dark:text-tuatara-100 font-bold uppercase tracking-[3.36px]">
            {LABELS.HOMEPAGE.MISSION_TITLE}
          </span>
          <span className="dark:text-tuatara-100 font-sans text-base lg:text-xl text-center text-tuatara-500 font-medium lg:px-0 px-4">
            {LABELS.HOMEPAGE.MISSION_DESCRIPTION}
          </span>
          <Link href="/about">
            <Button>
              <div className="flex items-center gap-1">
                <span className="text-base font-medium uppercase">
                  {LABELS.HOMEPAGE.MISSION_BUTTON}
                </span>
                <Icons.arrowRight
                  fill="white"
                  className="h-5 duration-200 ease-in-out group-hover:translate-x-2"
                />
              </div>
            </Button>
          </Link>
        </AppContent>
      </div>

      <OurWork />

      <BlogSection />

      <HomepageVideoFeed />

      <HomepageBanner />
    </section>
  )
}
