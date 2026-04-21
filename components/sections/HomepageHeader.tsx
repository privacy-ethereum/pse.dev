"use client"

import { Icons } from "../icons"
import { PageHeader } from "../page-header"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { LABELS } from "@/app/labels"
import PSELogo from "@/public/icons/archstar.webp"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"

const MotionH1 = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.h1),
  { ssr: false, loading: () => <h1 /> }
)

export const HomepageHeader = () => {
  return (
    <PageHeader
      title={
        <MotionH1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Label.PageTitle size="large" label={LABELS.HOMEPAGE.HEADER_TITLE} />
        </MotionH1>
      }
      subtitle={LABELS.HOMEPAGE.HEADER_SUBTITLE}
      image={
        <div className="m-auto flex h-[320px] w-full max-w-[280px] items-center justify-center md:m-0 md:h-full md:w-full lg:max-w-[380px]">
          <Image
            src={PSELogo}
            alt="Privacy & Scaling Explorations"
            className="object-cover"
            priority
            quality={90}
            sizes="(max-width: 768px) 280px, (max-width: 1200px) 380px, 380px"
          />
        </div>
      }
      actions={
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-10">
          <Link href="/research" className="flex items-center gap-2 group">
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
          <Link href="/projects" className="flex items-center gap-2 group">
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
        </div>
      }
    />
  )
}
