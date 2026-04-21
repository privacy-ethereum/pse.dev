import { GET } from "@/app/api/rss/route"
import { generateRssFeed } from "@/lib/rss"
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock the RSS library
vi.mock("@/lib/rss", () => ({
  generateRssFeed: vi.fn(),
}))

describe("/api/rss", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockRssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Test RSS Feed</title>
    <description>Test Description</description>
    <link>https://example.com</link>
    <atom:link href="https://example.com/rss" rel="self" type="application/rss+xml"/>
    <item>
      <title>Test Article</title>
      <description>Test article description</description>
      <link>https://example.com/articles/test</link>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`

  describe("GET /api/rss", () => {
    it("successfully generates and returns RSS feed", async () => {
      vi.mocked(generateRssFeed).mockResolvedValue(mockRssFeed)

      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {})

      const response = await GET(new Request("http://localhost:3000/api/rss"))

      expect(response.status).toBe(200)
      expect(response.headers.get("Content-Type")).toBe("application/xml")
      expect(response.headers.get("Cache-Control")).toBe(
        "public, s-maxage=3600, stale-while-revalidate=1800"
      )

      const responseText = await response.text()
      expect(responseText).toBe(mockRssFeed)

      expect(generateRssFeed).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "RSS feed generated successfully"
      )

      consoleLogSpy.mockRestore()
    })

    it("handles RSS generation errors gracefully", async () => {
      const error = new Error("Failed to read content files")
      vi.mocked(generateRssFeed).mockRejectedValue(error)

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const response = await GET(new Request("http://localhost:3000/api/rss"))

      expect(response.status).toBe(500)

      const responseText = await response.text()
      expect(responseText).toBe(
        "Error generating RSS feed: Failed to read content files"
      )

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating RSS feed:",
        error
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error details:", {
        message: "Failed to read content files",
        stack: error.stack,
        name: "Error",
      })

      consoleErrorSpy.mockRestore()
    })

    it("handles non-Error objects thrown during generation", async () => {
      const stringError = "String error message"
      vi.mocked(generateRssFeed).mockRejectedValue(stringError)

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const response = await GET(new Request("http://localhost:3000/api/rss"))

      expect(response.status).toBe(500)

      const responseText = await response.text()
      expect(responseText).toBe("Error generating RSS feed: Unknown error")

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating RSS feed:",
        stringError
      )

      consoleErrorSpy.mockRestore()
    })

    it("returns proper content type header for XML", async () => {
      vi.mocked(generateRssFeed).mockResolvedValue(mockRssFeed)

      const response = await GET(new Request("http://localhost:3000/api/rss"))

      expect(response.headers.get("Content-Type")).toBe("application/xml")
    })

    it("sets appropriate cache control headers", async () => {
      vi.mocked(generateRssFeed).mockResolvedValue(mockRssFeed)

      const response = await GET(new Request("http://localhost:3000/api/rss"))

      const cacheControl = response.headers.get("Cache-Control")
      expect(cacheControl).toBe(
        "public, s-maxage=3600, stale-while-revalidate=1800"
      )
    })

    it("handles empty RSS feed content", async () => {
      vi.mocked(generateRssFeed).mockResolvedValue("")

      const response = await GET(new Request("http://localhost:3000/api/rss"))

      expect(response.status).toBe(200)
      const responseText = await response.text()
      expect(responseText).toBe("")
    })

    it("logs successful RSS generation", async () => {
      vi.mocked(generateRssFeed).mockResolvedValue(mockRssFeed)

      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {})

      await GET(new Request("http://localhost:3000/api/rss"))

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "RSS feed generated successfully"
      )

      consoleLogSpy.mockRestore()
    })

    it("provides detailed error logging for Error objects", async () => {
      const error = new Error("Detailed error message")
      error.name = "CustomError"
      error.stack = "Error stack trace"
      vi.mocked(generateRssFeed).mockRejectedValue(error)

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      await GET(new Request("http://localhost:3000/api/rss"))

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating RSS feed:",
        error
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error details:", {
        message: "Detailed error message",
        stack: "Error stack trace",
        name: "CustomError",
      })

      consoleErrorSpy.mockRestore()
    })

    it("handles timeout errors from RSS generation", async () => {
      const timeoutError = new Error("Operation timed out")
      timeoutError.name = "TimeoutError"
      vi.mocked(generateRssFeed).mockRejectedValue(timeoutError)

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const response = await GET(new Request("http://localhost:3000/api/rss"))

      expect(response.status).toBe(500)
      const responseText = await response.text()
      expect(responseText).toBe(
        "Error generating RSS feed: Operation timed out"
      )

      consoleErrorSpy.mockRestore()
    })

    it("returns valid XML structure", async () => {
      vi.mocked(generateRssFeed).mockResolvedValue(mockRssFeed)

      const response = await GET(new Request("http://localhost:3000/api/rss"))
      const responseText = await response.text()

      // Basic XML structure validation
      expect(responseText).toContain("<?xml version=\"1.0\" encoding=\"UTF-8\"?>")
      expect(responseText).toContain("<rss version=\"2.0\"")
      expect(responseText).toContain("<channel>")
      expect(responseText).toContain("</channel>")
      expect(responseText).toContain("</rss>")
    })

    it("preserves RSS feed content exactly as generated", async () => {
      const customRssFeed = `<?xml version="1.0"?>
<rss><channel><title>Custom</title></channel></rss>`

      vi.mocked(generateRssFeed).mockResolvedValue(customRssFeed)

      const response = await GET(new Request("http://localhost:3000/api/rss"))
      const responseText = await response.text()

      expect(responseText).toBe(customRssFeed)
    })
  })
})
