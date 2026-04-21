"use client"

import { useAppSettings } from "@/hooks/useAppSettings"
import { MainNav } from "@/components/main-nav"

import { SiteHeaderMobile } from "./site-header-mobile"
import { AppContent } from "./ui/app-content"

export function SiteHeader() {
  const { MAIN_NAV } = useAppSettings()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-tuatara-300 bg-white shadow-sm dark:bg-black dark:border-anakiwa-950">
      <AppContent>
        <div className="flex h-16 items-center justify-between space-x-4 sm:space-x-0">
          <MainNav items={MAIN_NAV} />
          <SiteHeaderMobile />
        </div>
      </AppContent>
    </header>
  )
}
