/* eslint-disable react/display-name */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, RenderOptions } from "@testing-library/react"
import React, { ReactElement } from "react"
import { vi } from "vitest"

interface WrapperProps {
  children: React.ReactNode
}

// Mock the GlobalProvider to avoid localStorage and media query complications in tests
const MockGlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  const mockGlobalValue = {
    isDarkMode: false,
    setIsDarkMode: vi.fn(),
  }

  const GlobalContext = React.createContext(mockGlobalValue)

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContext.Provider value={mockGlobalValue}>
        {children}
      </GlobalContext.Provider>
    </QueryClientProvider>
  )
}

MockGlobalProvider.displayName = "MockGlobalProvider"

// Mock ProjectsProvider - simplified version for testing
const MockProjectsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const mockProjectsValue = {
    projects: [],
    filteredProjects: [],
    tags: [],
    selectedTags: [],
    searchTerm: "",
    setSearchTerm: vi.fn(),
    toggleTag: vi.fn(),
    clearFilters: vi.fn(),
    resetProjects: vi.fn(),
    isLoading: false,
    categories: [],
    sections: [],
    selectedCategories: [],
    selectedSections: [],
    toggleCategory: vi.fn(),
    toggleSection: vi.fn(),
  }

  const ProjectsContext = React.createContext(mockProjectsValue)

  return (
    <ProjectsContext.Provider value={mockProjectsValue}>
      {children}
    </ProjectsContext.Provider>
  )
}

MockProjectsProvider.displayName = "MockProjectsProvider"

// Mock ThemeProvider
const MockThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="light">{children}</div>
}

MockThemeProvider.displayName = "MockThemeProvider"

// Complete wrapper with all providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <MockGlobalProvider>
      <MockProjectsProvider>
        <MockThemeProvider>{children}</MockThemeProvider>
      </MockProjectsProvider>
    </MockGlobalProvider>
  )
}

AllTheProviders.displayName = "AllTheProviders"

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options })

// Custom render with specific providers (for more granular control)
export const renderWithProviders = (
  ui: ReactElement,
  {
    withGlobal = true,
    withProjects = true,
    withTheme = true,
    ...renderOptions
  }: {
    withGlobal?: boolean
    withProjects?: boolean
    withTheme?: boolean
  } & Omit<RenderOptions, "wrapper"> = {}
) => {
  let Wrapper: React.FC<WrapperProps> = ({ children }) => <>{children}</>

  if (withTheme) {
    const PrevWrapper = Wrapper
    Wrapper = ({ children }: WrapperProps) => (
      <PrevWrapper>
        <MockThemeProvider>{children}</MockThemeProvider>
      </PrevWrapper>
    )
    Wrapper.displayName = "ThemeWrapper"
  }

  if (withProjects) {
    const PrevWrapper = Wrapper
    Wrapper = ({ children }: WrapperProps) => (
      <PrevWrapper>
        <MockProjectsProvider>{children}</MockProjectsProvider>
      </PrevWrapper>
    )
    Wrapper.displayName = "ProjectsWrapper"
  }

  if (withGlobal) {
    const PrevWrapper = Wrapper
    Wrapper = ({ children }: WrapperProps) => (
      <PrevWrapper>
        <MockGlobalProvider>{children}</MockGlobalProvider>
      </PrevWrapper>
    )
    Wrapper.displayName = "GlobalWrapper"
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything
export * from "@testing-library/react"
export { customRender as render }

// Helper to create a fresh QueryClient for tests
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

// Helper to wait for async operations
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0))

// Helper to mock window.matchMedia with specific matches
export const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// Helper to mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key])
    }),
    length: Object.keys(store).length,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  }
}

// Helper to reset all mocks
export const resetAllMocks = () => {
  vi.clearAllMocks()
  // Reset localStorage mock
  const mockStorage = mockLocalStorage()
  Object.defineProperty(window, "localStorage", {
    value: mockStorage,
  })
}
