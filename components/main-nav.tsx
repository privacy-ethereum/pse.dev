"use client"

import { Icons } from "./icons"
import { useGlobalProvider } from "@/app/providers/GlobalProvider"
import { SearchButton } from "@/components/search/search-button"
import { SearchModal } from "@/components/search/search-modal"
import { cn } from "@/lib/utils"
import { NavItem } from "@/types/nav"
import { SunMedium as SunIcon, Moon as MoonIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export interface MainNavProps {
  items: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const router = usePathname()
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const { isDarkMode, setIsDarkMode } = useGlobalProvider()

  return (
    <div className="flex flex-1 items-center justify-between gap-6 lg:gap-10">
      <div className="flex items-center gap-6 lg:gap-10">
        <Link
          href="/"
          className="flex items-center space-x-2"
          aria-label="Go to homepage"
        >
          <Icons.Logo className="text-black dark:text-anakiwa-400" size={32} />
        </Link>
        <nav className="nav-responsive flex items-center gap-6">
          {items.map((item, index) => {
            if (item?.onlyFooter) return null
            if (item?.onlyMobile) return null

            const pathParts = item.href
              .replace("/", "")
              .split("/")
              .filter(Boolean)

            const isHome = router === "/" && item.href === "/"
            const isActive =
              isHome ||
              (router !== null &&
                pathParts[0] === router.replace("/", "").split("/")[1])

            return (
              <Link
                key={index}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                className={cn(
                  "flex cursor-pointer items-center border-b-2 uppercase",
                  {
                    "cursor-not-allowed": item.disabled,
                    "border-transparent": item.href !== router,
                    "!border-anakiwa-400": item.href === router || isActive,
                    "text-sm font-medium duration-200 ease-in-out hover:border-anakiwa-400":
                      true,
                  }
                )}
              >
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center mr-5 gap-4 lg:gap-10">
        <div className="w-60 mx-auto lg:mx-0 lg:ml-auto">
          <SearchButton onClick={() => setIsSearchModalOpen(true)} />
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="hidden lg:block text-black dark:text-anakiwa-400 ml-auto"
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>
      </div>

      <SearchModal open={isSearchModalOpen} setOpen={setIsSearchModalOpen} />
    </div>
  )
}
