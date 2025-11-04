import { GET } from "@/app/api/search/route"
import { NextRequest } from "next/server"
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock content functions
const mockGetArticles = vi.fn()
const mockGetProjects = vi.fn()

vi.mock("@/lib/content", () => ({
  getArticles: () => mockGetArticles(),
  getProjects: () => mockGetProjects(),
}))

// Mock search functions (uses real implementation)
vi.mock("@/lib/search", async () => {
  const actual = await vi.importActual("@/lib/search")
  return actual
})

describe("/api/search", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetArticles.mockReturnValue([
      {
        id: "test-article",
        title: "Test Article",
        content: "This is test content",
        tldr: "Test summary",
        date: "2024-01-01",
        tags: [{ id: "test", name: "Test" }],
      },
    ])
    mockGetProjects.mockReturnValue([
      {
        id: "test-project",
        title: "Test Project",
        description: "Test project description",
      },
    ])
  })

  const createMockRequest = (searchParams: Record<string, string> = {}) => {
    const url = new URL("http://localhost:3000/api/search")
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
    return new NextRequest(url.toString())
  }

  describe("GET /api/search", () => {
    it("returns empty results when query is empty", async () => {
      const request = createMockRequest({ query: "" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        results: [],
        status: "empty",
        availableIndexes: ["blog", "projects"],
      })
    })

    it("returns empty results when query is whitespace only", async () => {
      const request = createMockRequest({ query: "   " })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        results: [],
        status: "empty",
        availableIndexes: ["blog", "projects"],
      })
    })

    it("searches articles by title", async () => {
      const request = createMockRequest({ query: "test article" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe("success")
      expect(data.results).toHaveLength(2)
      expect(data.results[0].indexName).toBe("blog")
      expect(data.results[0].hits[0].title).toBe("Test Article")
    })

    it("searches projects by description", async () => {
      const request = createMockRequest({ query: "project", index: "projects" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe("success")
      expect(data.hits).toBeDefined()
      expect(data.hits[0].title).toBe("Test Project")
    })

    it("returns no results for non-matching query", async () => {
      const request = createMockRequest({ query: "nonexistent" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe("success")
      expect(data.results).toHaveLength(0)
    })

    it("respects hitsPerPage parameter", async () => {
      mockGetArticles.mockReturnValue([
        { id: "1", title: "Article 1", content: "test", date: "2024-01-01" },
        { id: "2", title: "Article 2", content: "test", date: "2024-01-02" },
        { id: "3", title: "Article 3", content: "test", date: "2024-01-03" },
      ])

      const request = createMockRequest({ query: "test", hitsPerPage: "2" })
      const response = await GET(request)
      const data = await response.json()

      expect(data.results[0].hits).toHaveLength(2)
    })
  })
})
