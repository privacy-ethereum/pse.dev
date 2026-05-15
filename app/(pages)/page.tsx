import { LABELS } from "../labels"
import { BlogRecentArticles } from "@/components/blog/blog-recent-articles"
import { Icons } from "@/components/icons"
import { HomepageBanner } from "@/components/sections/HomepageBanner"
import { HomepageVideoFeedLazy } from "@/components/sections/HomepageVideoFeedLazy"
import { OurWork } from "@/components/sections/OurWork"
import { ParallaxHero } from "@/components/sections/ParallaxHero"
import { AppContent } from "@/components/ui/app-content"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"

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

      <HomepageVideoFeedLazy />

      <HomepageBanner />
    </section>
  )
}
