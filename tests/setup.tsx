import "@testing-library/jest-dom"
import "vitest-canvas-mock"
import React from "react"
// Mock Next.js router
import { vi, beforeAll, afterAll } from "vitest"

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: (props: any) => {
    return <img {...props} />
  },
}))

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => {
    return <a {...props}>{children}</a>
  },
}))

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    entries: vi.fn(),
    forEach: vi.fn(),
    toString: vi.fn(),
  }),
  usePathname: () => "/",
  useParams: () => ({}),
  notFound: vi.fn(),
  redirect: vi.fn(),
}))

// Mock Next.js Script component
vi.mock("next/script", () => ({
  default: (props: any) => {
    return <script {...props} />
  },
}))

// Mock Next.js Font components
vi.mock("next/font/google", () => ({
  Space_Grotesk: () => ({
    style: {
      fontFamily: "Space Grotesk",
    },
    variable: "--font-display",
  }),
  DM_Sans: () => ({
    style: {
      fontFamily: "DM Sans",
    },
    variable: "--font-sans",
  }),
}))

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const createLocalStorageMock = () => {
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
    length: 0,
    key: vi.fn(),
  }
}

const localStorageMock = createLocalStorageMock()
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

// Mock sessionStorage
Object.defineProperty(window, "sessionStorage", {
  value: localStorageMock,
})

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
})

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  setTimeout(cb, 0)
  return 0
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock environment variables
vi.stubEnv("NODE_ENV", "test")

// Suppress console errors during tests (optional)
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render is no longer supported") ||
        args[0].includes("Warning: An invalid form control"))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
