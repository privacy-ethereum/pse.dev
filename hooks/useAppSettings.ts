import { MainNavProps } from "@/components/main-nav"
import { LABELS } from "@/app/labels"

export function useAppSettings() {
  const MAIN_NAV: MainNavProps["items"] = [
    {
      title: LABELS.COMMON.MENU.ABOUT,
      href: "/about",
    },
    {
      title: LABELS.COMMON.MENU.PROJECTS,
      href: "/projects",
    },
    {
      title: LABELS.COMMON.MENU.RESEARCH,
      href: "/research",
    },
    {
      title: LABELS.COMMON.MENU.ECOSYSTEM,
      href: "/ecosystem",
    },
    {
      title: LABELS.COMMON.MENU.BLOG,
      href: "/blog",
    },
  ]

  return {
    MAIN_NAV,
  }
}
