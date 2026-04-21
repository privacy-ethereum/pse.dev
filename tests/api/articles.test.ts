import { GET } from "@/app/api/articles/route"
import { getArticles } from "@/lib/content"
import { NextRequest } from "next/server"
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock the content library
vi.mock("@/lib/content", () => ({
  getArticles: vi.fn(),
}))

describe("/api/articles", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockRequest = (searchParams: Record<string, string> = {}) => {
    const url = new URL("http://localhost:3000/api/articles")
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
    return new NextRequest(url.toString())
  }

  const mockArticles = [
    {
      id: "article-1",
      title: "Test Article 1",
      description: "Description 1",
      content: "Content 1",
      date: "2024-01-01",
      tags: [
        { id: "tag1", name: "tag1" },
        { id: "tag2", name: "tag2" },
      ],
      project: "project1",
      publishedAt: "2024-01-01",
    },
    {
      id: "article-2",
      title: "Test Article 2",
      description: "Description 2",
      content: "Content 2",
      date: "2024-01-02",
      tags: [
        { id: "tag2", name: "tag2" },
        { id: "tag3", name: "tag3" },
      ],
      project: "project2",
      publishedAt: "2024-01-02",
    },
  ]

  describe("GET /api/articles", () => {
    it("returns all articles when no filters are provided", async () => {
      vi.mocked(getArticles).mockReturnValue(mockArticles)

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        articles: mockArticles,
        success: true,
      })
      expect(getArticles).toHaveBeenCalledWith({
        tag: undefined,
        limit: undefined,
        project: undefined,
      })
    })

    it("returns filtered articles by tag", async () => {
      const filteredArticles = [mockArticles[0]]
      vi.mocked(getArticles).mockReturnValue(filteredArticles)

      const request = createMockRequest({ tag: "tag1" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        articles: filteredArticles,
        success: true,
      })
      expect(getArticles).toHaveBeenCalledWith({
        tag: "tag1",
        limit: undefined,
        project: undefined,
      })
    })

    it("returns limited number of articles", async () => {
      const limitedArticles = [mockArticles[0]]
      vi.mocked(getArticles).mockReturnValue(limitedArticles)

      const request = createMockRequest({ limit: "1" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        articles: limitedArticles,
        success: true,
      })
      expect(getArticles).toHaveBeenCalledWith({
        tag: undefined,
        limit: 1,
        project: undefined,
      })
    })

    it("returns articles filtered by project", async () => {
      const projectArticles = [mockArticles[0]]
      vi.mocked(getArticles).mockReturnValue(projectArticles)

      const request = createMockRequest({ project: "project1" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        articles: projectArticles,
        success: true,
      })
      expect(getArticles).toHaveBeenCalledWith({
        tag: undefined,
        limit: undefined,
        project: "project1",
      })
    })

    it("returns articles with multiple filters", async () => {
      const filteredArticles = [mockArticles[0]]
      vi.mocked(getArticles).mockReturnValue(filteredArticles)

      const request = createMockRequest({
        tag: "tag1",
        limit: "5",
        project: "project1",
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        articles: filteredArticles,
        success: true,
      })
      expect(getArticles).toHaveBeenCalledWith({
        tag: "tag1",
        limit: 5,
        project: "project1",
      })
    })

    it("handles invalid limit parameter gracefully", async () => {
      vi.mocked(getArticles).mockReturnValue(mockArticles)

      const request = createMockRequest({ limit: "invalid" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(getArticles).toHaveBeenCalledWith({
        tag: undefined,
        limit: NaN,
        project: undefined,
      })
    })

    it("handles errors from getArticles function", async () => {
      const error = new Error("Database connection failed")
      vi.mocked(getArticles).mockImplementation(() => {
        throw error
      })

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({
        error: "Failed to fetch articles",
        success: false,
      })
    })

    it("returns empty array when no articles match filters", async () => {
      vi.mocked(getArticles).mockReturnValue([])

      const request = createMockRequest({ tag: "nonexistent" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        articles: [],
        success: true,
      })
    })
  })
})
