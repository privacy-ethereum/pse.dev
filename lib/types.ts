import { ReactNode } from "react"

export enum ProjectCategory {
  APPLICATION = "APPLICATIONS",
  DEVTOOLS = "DEVTOOLS",
  RESEARCH = "RESEARCH", // Category has now it's own page
}

export const ProjectSections = [
  "pse",
  "grant",
  "collaboration",
  "archived",
] as const
export type ProjectSection = (typeof ProjectSections)[number]

export enum ProjectStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTAINED = "maintained",
}

export const ProjectSectionLabelMapping: Record<ProjectSection, string> = {
  pse: "PSE projects",
  grant: "Grants",
  collaboration: "Collaborations",
  archived: "Archived",
}

export const ProjectStatusLabelMapping: Record<ProjectStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  maintained: "Maintained",
}

export const ProjectStatusDescriptionMapping: Record<ProjectStatus, string> = {
  active: "These projects are under active development by PSE-supported teams",
  inactive:
    "The projects in our archive are not currently being worked on by PSE, but we encourage everyone to check out their findings and continue experimentation!",
  maintained:
    "Maintenance projects are still being monitored for bug fixes, but are not under active feature development",
}

export type ProjectLinkWebsite =
  | "github"
  | "website"
  | "discord"
  | "twitter"
  | "youtube"
  | "telegram"

export type ProjectLinkType = Partial<Record<ProjectLinkWebsite, any>>
export type ProjectExtraLinkType = "buildWith" | "play" | "research" | "learn"
export type TagType =
  | "types"
  | "themes"
  | "builtWith"
  | "keywords"
  | "fundingSource"
export type ProjectTags = Partial<Record<TagType, string[]>>
export type ActionLinkTypeLink = {
  label: string
  url: string
}
export type ActionLinkType = Partial<
  Record<ProjectExtraLinkType, Array<ActionLinkTypeLink>>
>

export interface ProjectContent {
  [language: string]: {
    tldr: string
    description: string
  }
}

export interface ProjectTeamMember {
  name: string
  role?: string
  image?: string
  links?: ProjectLinkType
  email?: string
}

export interface ProjectInterface {
  id: string
  hasWiki?: boolean // show project with wiki page template
  graduated?: boolean
  youtubeLinks?: string[]
  team?: ProjectTeamMember[]
  license?: string
  content: ProjectContent //  project tldr and description with support for multiple language
  category?: ProjectCategory // project category used as filter to replace section
  section: ProjectSection // 'pse', 'grant', 'collaboration', 'archived'
  image: string
  previousBrandImage?: string
  imageAlt?: string
  name: string
  links?: ProjectLinkType
  projectStatus: ProjectStatus
  tags?: ProjectTags
  extraLinks?: ActionLinkType
  tldr?: string
  cardTags?: {
    primary?: string
    secondary?: string
  }
}
