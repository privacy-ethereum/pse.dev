"use client"

import { ProjectLinkIconMap } from "./project-links"
import { ProjectLinkWebsite } from "@/lib/types"

interface ProjectLinkProps {
  url: string
  website: ProjectLinkWebsite
}

export function ProjectLink({ website, url }: ProjectLinkProps) {
  const icon = ProjectLinkIconMap?.[website as ProjectLinkWebsite]

  // Add aria-label mapping for accessibility
  const ariaLabels: Record<string, string> = {
    github: "View project on GitHub",
    website: "Visit project website",
    twitter: "Follow project on Twitter",
    telegram: "Join project Telegram",
    discord: "Join project Discord",
  }

  if (!icon) return null
  return (
    <a
      href={url}
      onClick={(event) => {
        // prevent box link to redirect to project page
        event?.stopPropagation()
      }}
      target="_blank"
      rel="noopener noreferrer"
      className="text-lg"
      aria-label={ariaLabels[website] || "Visit external link"}
    >
      {icon}
    </a>
  )
}
