"use client"

import { useGlobalProvider } from "@/app/providers/GlobalProvider"
import { cn } from "@/lib/utils"
import { ReactNode, useEffect } from "react"

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { isDarkMode } = useGlobalProvider()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
    document.body.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  return (
    <div
      className={cn("min-h-screen bg-background antialiased", {
        dark: isDarkMode,
      })}
    >
      {children}
    </div>
  )
}
