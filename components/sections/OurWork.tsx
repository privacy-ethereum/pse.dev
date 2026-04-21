"use client"

import { Icons } from "../icons"
import { AppContent } from "../ui/app-content"
import { LABELS } from "@/app/labels"
import Link from "next/link"

type OurWorkContent = {
  title: string
  description: string
  icon: any
  action?: string
  link: string
}

export const OurWork = () => {
  const content: OurWorkContent[] = [
    {
      title: LABELS.WHAT_WE_DO_SECTION.BUILD.TITLE,
      description: LABELS.WHAT_WE_DO_SECTION.BUILD.DESCRIPTION,
      action: LABELS.WHAT_WE_DO_SECTION.BUILD.ACTION,
      link: "/projects",
      icon: Icons.privacy,
    },
    {
      title: LABELS.WHAT_WE_DO_SECTION.RESEARCH.TITLE,
      description: LABELS.WHAT_WE_DO_SECTION.RESEARCH.DESCRIPTION,
      action: LABELS.WHAT_WE_DO_SECTION.RESEARCH.ACTION,
      link: "/research",
      icon: Icons.scaling,
    },
  ]

  return (
    <div className="flex flex-col justify-center bg-cover-gradient dark:bg-anakiwa-975 dark:bg-none py-16 lg:py-20">
      <AppContent className="mx-auto lg:max-w-[845px] w-full">
        <section className="flex flex-col gap-10">
          <h2 className="font-sans text-base font-bold uppercase tracking-[4px] text-black dark:text-white text-center">
            What we do
          </h2>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 max-auto">
            {content.map((item) => (
              <div
                key={`${item.link}-${item.title}`}
                className="flex flex-col gap-6 w-full lg:max-w-[300px]"
              >
                <article className="flex flex-col gap-2">
                  <h3 className="font-sans text-xl font-medium text-tuatara-950 dark:text-tuatara-100">
                    {item.title}
                  </h3>
                  <p className="font-sans text-base font-normal text-tuatara-950 dark:text-tuatara-100">
                    {item.description}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </section>
      </AppContent>
    </div>
  )
}
