"use client"

import { ProjectsProvider } from "./ProjectsProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react"

interface GlobalContextType {
  children?: ReactNode
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const PSE_DARK_MODE_KEY = "pse-dark-mode"

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Initialize dark mode from localStorage or system preference AFTER hydration
  useEffect(() => {
    const storedPreference = localStorage.getItem(PSE_DARK_MODE_KEY)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    if (storedPreference !== null) {
      setIsDarkMode(storedPreference === "true")
    } else {
      setIsDarkMode(mediaQuery.matches)
    }

    setIsInitialized(true)

    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(PSE_DARK_MODE_KEY) === null) {
        setIsDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const handleSetIsDarkMode = (value: boolean) => {
    setIsDarkMode(value)
    localStorage.setItem(PSE_DARK_MODE_KEY, String(value))
  }

  const value = {
    isDarkMode,
    setIsDarkMode: handleSetIsDarkMode,
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ProjectsProvider>
        <GlobalContext.Provider value={value}>
          {children}
        </GlobalContext.Provider>
      </ProjectsProvider>
    </QueryClientProvider>
  )
}

export function useGlobalProvider() {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider")
  }
  return context
}