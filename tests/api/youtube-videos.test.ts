import { GET, OPTIONS } from "@/app/api/youtube/videos/route"
import { NextRequest } from "next/server"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// Mock fetch globally
const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

// Mock environment variables
const originalEnv = process.env

describe("/api/youtube/videos", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  const createMockRequest = (searchParams: Record<string, string> = {}) => {
    const url = new URL("http://localhost:3000/api/youtube/videos")
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
    return new NextRequest(url.toString())
  }

  const mockYouTubeResponse = {
    items: [
      {
        id: "video-id-1",
        snippet: {
          title: "Test Video 1",
          description: "Test description 1",
          publishedAt: "2024-01-01T00:00:00Z",
          channelTitle: "Test Channel",
          thumbnails: {
            high: {
              url: "https://i.ytimg.com/vi/video-id-1/hqdefault.jpg",
            },
            standard: {
              url: "https://i.ytimg.com/vi/video-id-1/sddefault.jpg",
            },
            maxres: {
              url: "https://i.ytimg.com/vi/video-id-1/maxresdefault.jpg",
            },
          },
        },
      },
      {
        id: "video-id-2",
        snippet: {
          title: "Test Video 2",
          description: "Test description 2",
          publishedAt: "2024-01-02T00:00:00Z",
          channelTitle: "Test Channel",
          thumbnails: {
            high: {
              url: "https://i.ytimg.com/vi/video-id-2/hqdefault.jpg",
            },
          },
        },
      },
    ],
  }

  const expectedFormattedVideos = [
    {
      id: "video-id-1",
      title: "Test Video 1",
      description: "Test description 1",
      thumbnailUrl: "https://i.ytimg.com/vi/video-id-1/maxresdefault.jpg",
      publishedAt: "2024-01-01T00:00:00Z",
      channelTitle: "Test Channel",
    },
    {
      id: "video-id-2",
      title: "Test Video 2",
      description: "Test description 2",
      thumbnailUrl: "https://i.ytimg.com/vi/video-id-2/hqdefault.jpg",
      publishedAt: "2024-01-02T00:00:00Z",
      channelTitle: "Test Channel",
    },
  ]

  describe("OPTIONS /api/youtube/videos", () => {
    it("returns CORS headers for preflight requests", async () => {
      const response = await OPTIONS()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({})
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
      expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
        "GET, POST, PUT, DELETE, OPTIONS"
      )
      expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
        "Content-Type, Authorization"
      )
    })
  })

  describe("GET /api/youtube/videos", () => {
    beforeEach(() => {
      process.env.YOUTUBE_API_KEY = "test-api-key"
    })

    it("successfully fetches videos with valid API key and IDs", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockYouTubeResponse),
      })

      const request = createMockRequest({ ids: "video-id-1,video-id-2" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(expectedFormattedVideos)
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
      expect(mockFetch).toHaveBeenCalledWith(
        "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=video-id-1,video-id-2&key=test-api-key"
      )
    })

    it("returns error when video IDs are not provided", async () => {
      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        error: "No video IDs provided",
      })
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it("returns error when YouTube API key is not configured", async () => {
      delete process.env.YOUTUBE_API_KEY

      const request = createMockRequest({ ids: "video-id-1" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({
        error: "YouTube API key not configured",
      })
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it("handles YouTube API HTTP errors", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 403,
      })

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const request = createMockRequest({ ids: "video-id-1" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({
        error: "Failed to fetch videos from YouTube API",
      })
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching YouTube videos:",
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it("handles network errors gracefully", async () => {
      mockFetch.mockRejectedValue(new Error("Network timeout"))

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const request = createMockRequest({ ids: "video-id-1" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({
        error: "Failed to fetch videos from YouTube API",
      })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching YouTube videos:",
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it("selects best available thumbnail quality", async () => {
      const responseWithVariousThumbnails = {
        items: [
          {
            id: "maxres-video",
            snippet: {
              title: "Maxres Video",
              description: "Description",
              publishedAt: "2024-01-01T00:00:00Z",
              channelTitle: "Channel",
              thumbnails: {
                high: { url: "high.jpg" },
                standard: { url: "standard.jpg" },
                maxres: { url: "maxres.jpg" },
              },
            },
          },
          {
            id: "standard-video",
            snippet: {
              title: "Standard Video",
              description: "Description",
              publishedAt: "2024-01-01T00:00:00Z",
              channelTitle: "Channel",
              thumbnails: {
                high: { url: "high.jpg" },
                standard: { url: "standard.jpg" },
              },
            },
          },
          {
            id: "high-only-video",
            snippet: {
              title: "High Only Video",
              description: "Description",
              publishedAt: "2024-01-01T00:00:00Z",
              channelTitle: "Channel",
              thumbnails: {
                high: { url: "high.jpg" },
              },
            },
          },
        ],
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(responseWithVariousThumbnails),
      })

      const request = createMockRequest({ ids: "video1,video2,video3" })
      const response = await GET(request)
      const data = await response.json()

      expect(data[0].thumbnailUrl).toBe("maxres.jpg") // maxres preferred
      expect(data[1].thumbnailUrl).toBe("standard.jpg") // standard fallback
      expect(data[2].thumbnailUrl).toBe("high.jpg") // high fallback
    })

    it("handles empty response from YouTube API", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      })

      const request = createMockRequest({ ids: "nonexistent-video" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })

    it("properly formats video data structure", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockYouTubeResponse),
      })

      const request = createMockRequest({ ids: "video-id-1" })
      const response = await GET(request)
      const data = await response.json()

      expect(data[0]).toHaveProperty("id")
      expect(data[0]).toHaveProperty("title")
      expect(data[0]).toHaveProperty("description")
      expect(data[0]).toHaveProperty("thumbnailUrl")
      expect(data[0]).toHaveProperty("publishedAt")
      expect(data[0]).toHaveProperty("channelTitle")

      // Should not have nested snippet property
      expect(data[0]).not.toHaveProperty("snippet")
    })

    it("handles single video ID", async () => {
      const singleVideoResponse = {
        items: [mockYouTubeResponse.items[0]],
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(singleVideoResponse),
      })

      const request = createMockRequest({ ids: "video-id-1" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(1)
      expect(data[0].id).toBe("video-id-1")
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("&id=video-id-1&")
      )
    })

    it("constructs correct YouTube API URL", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      })

      const request = createMockRequest({ ids: "abc123,def456" })
      await GET(request)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=abc123,def456&key=test-api-key"
      )
    })

    it("includes CORS headers in all responses", async () => {
      // Test successful response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      })

      const request = createMockRequest({ ids: "test" })
      const response = await GET(request)

      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
      expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
        "GET, POST, PUT, DELETE, OPTIONS"
      )
      expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
        "Content-Type, Authorization"
      )
    })

    it("handles malformed JSON response from YouTube API", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error("Invalid JSON")),
      })

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const request = createMockRequest({ ids: "video-id-1" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({
        error: "Failed to fetch videos from YouTube API",
      })

      consoleErrorSpy.mockRestore()
    })
  })
})
