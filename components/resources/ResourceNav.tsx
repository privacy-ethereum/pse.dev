"use client"

import { LABELS } from "@/app/labels"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const ResourceNav = () => {
  const SCROLL_OFFSET = 80
  const [activeId, setActiveId] = useState("")
  const [isManualScroll, setIsManualScroll] = useState(false)
  const ID_LABELS_MAPPING: Record<string, string> = {
    "get-involved": LABELS.RESOURCES_PAGE.NAV.GET_INVOLVED,
    learn: LABELS.RESOURCES_PAGE.NAV.LEARN,
    build: LABELS.RESOURCES_PAGE.NAV.BUILD,
    design: LABELS.RESOURCES_PAGE.NAV.DESIGN,
  }
  const sectionsRef = useRef<NodeListOf<HTMLElement> | null>(null) // sections are constant so useRef might be better here

  useEffect(() => {
    if (sectionsRef.current === null)
      sectionsRef.current = document.querySelectorAll("div[data-section]")
    if (!activeId) setActiveId("get-involved")

    const handleScroll = () => {
      if (isManualScroll) return

      sectionsRef.current?.forEach((section: any) => {
        const sectionTop = section.offsetTop - SCROLL_OFFSET
        if (window.scrollY >= sectionTop && window.scrollY > 0) {
          setActiveId(section.getAttribute("id"))
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [activeId, isManualScroll])

  const scrollToId = useCallback((id: string) => {
    const element = document.getElementById(id)
    const top = element?.offsetTop ?? 0

    if (element) {
      setActiveId(id) // active clicked id
      setIsManualScroll(true) // tell the window event listener to ignore this scrolling
      window?.scrollTo({
        behavior: "smooth",
        top: (top ?? 0) - SCROLL_OFFSET,
      })
    }

    setTimeout(() => setIsManualScroll(false), 800)
  }, [])

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-4">
        <h6 className="font-display text-lg font-bold text-secondary dark:text-white">
          {LABELS.RESOURCES_PAGE.ON_THIS_PAGE}
        </h6>
        <ul className="text-normal font-sans text-primary">
          {Object.entries(ID_LABELS_MAPPING).map(([id, label]) => {
            const active = id === activeId
            return (
              <li
                key={id}
                onClick={() => {
                  scrollToId(id)
                }}
                data-id={id}
                className={cn(
                  "flex h-8 cursor-pointer items-center border-l-2 border-l-anakiwa-200 px-3 duration-200",
                  {
                    "border-l-anakiwa-500 text-anakiwa-500 font-medium": active,
                  }
                )}
              >
                {label}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
