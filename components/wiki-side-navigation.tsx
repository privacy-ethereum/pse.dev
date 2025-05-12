"use client"

import { useEffect, useRef, useState } from "react"

import { ProjectExtraLinkType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/app/i18n/client"

import { Icons } from "./icons"
import { useGetProjectRelatedArticles } from "@/hooks/useGetProjectRelatedArticles"

interface Section {
  level: number
  text: string
  id: string
}

interface WikiSideNavigationProps {
  className?: string
  lang?: string
  content?: string
  project?: any
}

const SideNavigationItem = ({
  text,
  id,
  activeSection,
  onClick,
}: {
  text: string
  id: string
  activeSection: string | null
  onClick: () => void
}) => {
  return (
    <li
      key={id}
      className={cn(
        "flex min-h-8 items-center border-l-2 border-l-anakiwa-200 px-2 duration-200 cursor-pointer w-full pb-2",
        {
          "border-l-anakiwa-500 text-anakiwa-500 font-medium":
            activeSection === id,
        }
      )}
    >
      <button onClick={onClick} className="text-left">
        {text}
      </button>
    </li>
  )
}

export const WikiSideNavigation = ({
  className,
  lang = "en",
  content = "",
  project,
}: WikiSideNavigationProps) => {
  const { t } = useTranslation(lang, "common")
  const [sections, setSections] = useState<Section[]>([])
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const { articles, loading } = useGetProjectRelatedArticles({
    projectId: project.id,
  })

  useEffect(() => {
    if (!content) return
    const sectionsRegex = /^(#{1,3})\s(.+)/gm
    const extractedSections: Section[] = []
    let match

    while ((match = sectionsRegex.exec(content)) !== null) {
      const text = match[2]
      if (!extractedSections.some((section) => section.text === text)) {
        extractedSections.push({
          level: match[1].length,
          text,
          id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        })
      }
    }

    setSections(extractedSections)
    if (extractedSections.length > 0) {
      setActiveSection(extractedSections[0].id)
    }
  }, [content])

  // Set up intersection observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0,
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.getAttribute("data-section-id"))
        }
      })
    }, observerOptions)

    sections.forEach((section) => {
      const element = document.querySelector(
        `[data-section-id="${section.id}"]`
      )
      if (element) observerRef.current?.observe(element)
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [sections, loading])

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section-id="${sectionId}"]`)
    if (element) {
      const offset = 80 // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
      setActiveSection(sectionId)
    }
  }

  const ExtraLinkLabelMapping: Record<
    ProjectExtraLinkType,
    {
      label: string
      icon?: any
    }
  > = {
    buildWith: {
      label: t("buildWith"),
      icon: <Icons.hammer />,
    },
    play: {
      label: t("tryItOut"),
      icon: <Icons.hand />,
    },
    research: {
      label: t("deepDiveResearch"),
      icon: <Icons.readme />,
    },
    learn: {
      label: t("learnMore"),
    },
  }

  const { extraLinks = {}, team = [], youtubeLinks = [] } = project

  const hasRelatedArticles = articles.length > 0 && !loading
  const hasTeam = Array.isArray(team) && team.length > 0
  const hasYoutubeVideos =
    Array.isArray(youtubeLinks) && youtubeLinks.length > 0

  console.log(hasTeam, hasYoutubeVideos, youtubeLinks)

  if (sections.length === 0 || content.length === 0) return null

  return (
    <div className="sticky overflow-hidden top-20">
      <aside className={cn("flex flex-col", className)}>
        <h6 className="text-lg font-bold font-display text-tuatara-700">
          {t("contents")}
        </h6>
        <ul className="pt-4 font-sans text-black text-normal">
          {sections.map((section, index) => (
            <SideNavigationItem
              key={index}
              activeSection={activeSection}
              text={section.text}
              id={section.id}
              onClick={() => scrollToSection(section.id)}
            />
          ))}
          {Object.entries(ExtraLinkLabelMapping).map(([key]) => {
            const links = extraLinks[key as ProjectExtraLinkType] ?? []
            // @ts-expect-error - ExtraLinkLabelMapping is not typed
            const { label } = ExtraLinkLabelMapping?.[key as any] ?? {}
            if (!links.length) return null // no links hide the section
            return (
              <SideNavigationItem
                key={key}
                onClick={() => scrollToSection(key)}
                activeSection={activeSection}
                text={label}
                id={key}
              />
            )
          })}

          {hasYoutubeVideos && (
            <SideNavigationItem
              key="youtube-videos"
              onClick={() => scrollToSection("youtube-videos")}
              activeSection={activeSection}
              text={t("youtubeVideos") || "YouTube Videos"}
              id="youtube-videos"
            />
          )}

          {hasTeam && (
            <SideNavigationItem
              key="team"
              onClick={() => scrollToSection("team")}
              activeSection={activeSection}
              text={t("projectTeam") || "Team"}
              id="team"
            />
          )}

          {hasRelatedArticles && (
            <SideNavigationItem
              key="related-articles"
              onClick={() => scrollToSection("related-articles")}
              activeSection={activeSection}
              text="Related articles"
              id="related-articles"
            />
          )}
          <SideNavigationItem
            key="edit"
            onClick={() => scrollToSection("edit-this-page")}
            activeSection={activeSection}
            text="Edit this page"
            id="edit-this-page"
          />
        </ul>
      </aside>
    </div>
  )
}
