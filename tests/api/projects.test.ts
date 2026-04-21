import { GET } from "@/app/api/projects/route"
import { getProjects } from "@/lib/content"
import { NextRequest } from "next/server"
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock the content library
vi.mock("@/lib/content", () => ({
  getProjects: vi.fn(),
}))

describe("/api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockRequest = (searchParams: Record<string, string> = {}) => {
    const url = new URL("http://localhost:3000/api/projects")
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
    return new NextRequest(url.toString())
  }

  const mockProjects = [
    {
      id: "project-1",
      title: "Test Project 1",
      name: "Test Project 1",
      description: "Description 1",
      tags: ["tag1", "tag2"],
      status: "active",
      github: "https://github.com/project1",
    },
    {
      id: "project-2",
      title: "Test Project 2",
      name: "Test Project 2",
      description: "Description 2",
      tags: ["tag2", "tag3"],
      status: "archived",
      github: "https://github.com/project2",
    },
  ]

  describe("GET /api/projects", () => {
    it("returns all projects when no filters are provided", async () => {
      vi.mocked(getProjects).mockReturnValue(mockProjects)

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockProjects)
      expect(getProjects).toHaveBeenCalledWith({
        tag: undefined,
        limit: undefined,
        status: undefined,
      })
    })

    it("returns filtered projects by tag", async () => {
      const filteredProjects = [mockProjects[0]]
      vi.mocked(getProjects).mockReturnValue(filteredProjects)

      const request = createMockRequest({ tag: "tag1" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(filteredProjects)
      expect(getProjects).toHaveBeenCalledWith({
        tag: "tag1",
        limit: undefined,
        status: undefined,
      })
    })

    it("returns limited number of projects", async () => {
      const limitedProjects = [mockProjects[0]]
      vi.mocked(getProjects).mockReturnValue(limitedProjects)

      const request = createMockRequest({ limit: "1" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(limitedProjects)
      expect(getProjects).toHaveBeenCalledWith({
        tag: undefined,
        limit: 1,
        status: undefined,
      })
    })

    it("returns projects filtered by status", async () => {
      const activeProjects = [mockProjects[0]]
      vi.mocked(getProjects).mockReturnValue(activeProjects)

      const request = createMockRequest({ status: "active" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(activeProjects)
      expect(getProjects).toHaveBeenCalledWith({
        tag: undefined,
        limit: undefined,
        status: "active",
      })
    })

    it("returns projects with multiple filters", async () => {
      const filteredProjects = [mockProjects[0]]
      vi.mocked(getProjects).mockReturnValue(filteredProjects)

      const request = createMockRequest({
        tag: "tag1",
        limit: "5",
        status: "active",
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(filteredProjects)
      expect(getProjects).toHaveBeenCalledWith({
        tag: "tag1",
        limit: 5,
        status: "active",
      })
    })

    it("handles invalid limit parameter gracefully", async () => {
      vi.mocked(getProjects).mockReturnValue(mockProjects)

      const request = createMockRequest({ limit: "invalid" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(getProjects).toHaveBeenCalledWith({
        tag: undefined,
        limit: NaN,
        status: undefined,
      })
    })

    it("returns empty array when getProjects returns null", async () => {
      vi.mocked(getProjects).mockReturnValue([])

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })

    it("handles errors from getProjects function", async () => {
      const error = new Error("File system error")
      vi.mocked(getProjects).mockImplementation(() => {
        throw error
      })

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({
        error: "Failed to fetch projects",
        success: false,
      })
    })

    it("returns empty array when no projects match filters", async () => {
      vi.mocked(getProjects).mockReturnValue([])

      const request = createMockRequest({ tag: "nonexistent" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })
  })
})
