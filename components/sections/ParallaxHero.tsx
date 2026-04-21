"use client"

import { Icons } from "../icons"
import { AppContent } from "../ui/app-content"
import { Button } from "../ui/button"
import { LABELS } from "@/app/labels"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false, loading: () => <div /> }
)

const MotionSpan = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.span),
  { ssr: false, loading: () => <span /> }
)

const MotionH1 = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.h1),
  { ssr: false, loading: () => <h1 /> }
)

export const ParallaxHero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden h-[500px] lg:h-[600px] bg-cover bg-no-repeat bg-center"
      style={{ isolation: "isolate" }}
    >
      {isClient ? (
        <MotionDiv
          className="absolute inset-0 w-full h-full -z-10"
          initial={{ y: 0 }}
        >
          {/* Light mode images */}
          <Image
            src="/hero/hero-mobile.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover lg:hidden dark:hidden"
            sizes="100vw"
          />
          <Image
            src="/hero/hero.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover hidden lg:block dark:hidden"
            sizes="100vw"
          />

          {/* Dark mode images */}
          <Image
            src="/hero/hero-dark-mode-mobile.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover lg:hidden hidden dark:block"
            sizes="100vw"
          />
          <Image
            src="/hero/hero-dark-mode.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover hidden dark:lg:block"
            sizes="100vw"
          />
        </MotionDiv>
      ) : (
        <div className="absolute inset-0 w-full h-full -z-10">
          {/* Light mode images */}
          <Image
            src="/hero/hero-mobile.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover lg:hidden dark:hidden"
            sizes="100vw"
          />
          <Image
            src="/hero/hero.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover hidden lg:block dark:hidden"
            sizes="100vw"
          />

          {/* Dark mode images */}
          <Image
            src="/hero/hero-dark-mode-mobile.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover lg:hidden hidden dark:block"
            sizes="100vw"
          />
          <Image
            src="/hero/hero-dark-mode.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover hidden dark:lg:block"
            sizes="100vw"
          />
        </div>
      )}

      {isClient ? (
        <MotionDiv
          className="relative z-10 flex items-center justify-center h-full py-10 lg:py-[130px]"
          initial={{ y: 0 }}
        >
          <AppContent className="flex flex-col gap-10 max-w-[860px]">
            <MotionDiv
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-10 text-center"
            >
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-[10px]">
                  <MotionSpan className="font-sans font-medium leading-7 uppercase text-tuatara-800 dark:text-anakiwa-400">
                    {LABELS.HOMEPAGE.HEADER_TITLE}
                  </MotionSpan>
                  <MotionH1 className="font-sans text-3xl lg:text-5xl font-medium text-tuatara-950 dark:text-tuatara-100">
                    {LABELS.HOMEPAGE.HEADER_SUBTITLE}
                  </MotionH1>
                </div>
                <MotionDiv className="flex flex-wrap gap-4 lg:gap-8 mx-auto justify-center">
                  <Link
                    href="/projects"
                    className="flex items-center gap-2 group"
                  >
                    <Button className="w-full sm:w-auto">
                      <div className="flex items-center gap-1">
                        <span className="text-base font-medium uppercase">
                          {LABELS.COMMON.DEVELOPMENT_PROJECTS}
                        </span>
                        <Icons.arrowRight
                          fill="white"
                          className="h-5 duration-200 ease-in-out group-hover:translate-x-2"
                        />
                      </div>
                    </Button>
                  </Link>
                  <Link
                    href="/research"
                    className="flex items-center gap-2 group"
                  >
                    <Button className="w-full sm:w-auto">
                      <div className="flex items-center gap-1">
                        <span className="text-base font-medium uppercase">
                          {LABELS.COMMON.APPLIED_RESEARCH}
                        </span>
                        <Icons.arrowRight
                          fill="white"
                          className="h-5 duration-200 ease-in-out group-hover:translate-x-2"
                        />
                      </div>
                    </Button>
                  </Link>
                </MotionDiv>
              </div>
            </MotionDiv>
          </AppContent>
        </MotionDiv>
      ) : (
        <div className="relative z-10 flex items-center justify-center h-full py-10 lg:py-[130px]">
          <AppContent className="flex flex-col gap-10 max-w-[860px]">
            <div className="flex flex-col gap-10 text-center">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-[10px]">
                  <span className="font-sans font-medium leading-7 uppercase text-tuatara-800 dark:text-anakiwa-400">
                    {LABELS.HOMEPAGE.HEADER_TITLE}
                  </span>
                  <h1 className="font-sans text-3xl lg:text-5xl font-medium text-tuatara-950 dark:text-tuatara-100">
                    {LABELS.HOMEPAGE.HEADER_SUBTITLE}
                  </h1>
                </div>
                <div className="flex flex-wrap gap-4 lg:gap-8 mx-auto justify-center">
                  <Link
                    href="/projects"
                    className="flex items-center gap-2 group"
                  >
                    <Button className="w-full sm:w-auto">
                      <div className="flex items-center gap-1">
                        <span className="text-base font-medium uppercase">
                          {LABELS.COMMON.DEVELOPMENT_PROJECTS}
                        </span>
                        <Icons.arrowRight
                          fill="white"
                          className="h-5 duration-200 ease-in-out group-hover:translate-x-2"
                        />
                      </div>
                    </Button>
                  </Link>
                  <Link
                    href="/research"
                    className="flex items-center gap-2 group"
                  >
                    <Button className="w-full sm:w-auto">
                      <div className="flex items-center gap-1">
                        <span className="text-base font-medium uppercase">
                          {LABELS.COMMON.APPLIED_RESEARCH}
                        </span>
                        <Icons.arrowRight
                          fill="white"
                          className="h-5 duration-200 ease-in-out group-hover:translate-x-2"
                        />
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </AppContent>
        </div>
      )}
    </div>
  )
}
