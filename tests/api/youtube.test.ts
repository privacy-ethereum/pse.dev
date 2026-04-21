import { GET } from "@/app/api/youtube/route"
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock fetch globally
const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

describe("/api/youtube", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <yt:videoId>test-video-id-1</yt:videoId>
    <title>Test Video Title 1</title>
    <media:description>This is a test video description that should be truncated if it exceeds 150 characters to ensure proper display in the UI components.</media:description>
    <published>2024-01-01T00:00:00.000Z</published>
  </entry>
  <entry>
    <yt:videoId>test-video-id-2</yt:videoId>
    <title>Test Video Title 2 &amp; Special Characters</title>
    <media:description>Short description</media:description>
    <published>2024-01-02T00:00:00.000Z</published>
  </entry>
</feed>`

  const expectedVideos = [
    {
      id: "test-video-id-1",
      title: "Test Video Title 1",
      description:
        "This is a test video description that should be truncated if it exceeds 150 characters to ensure proper display in the UI components.",
      thumbnailUrl: "https://i.ytimg.com/vi/test-video-id-1/hqdefault.jpg",
      publishedAt: "2024-01-01T00:00:00.000Z",
      channelTitle: "Privacy Stewards of Ethereum",
      url: "https://www.youtube.com/watch?v=test-video-id-1",
    },
    {
      id: "test-video-id-2",
      title: "Test Video Title 2 & Special Characters",
      description: "Short description",
      thumbnailUrl: "https://i.ytimg.com/vi/test-video-id-2/hqdefault.jpg",
      publishedAt: "2024-01-02T00:00:00.000Z",
      channelTitle: "Privacy Stewards of Ethereum",
      url: "https://www.youtube.com/watch?v=test-video-id-2",
    },
  ]

  describe("GET /api/youtube", () => {
    it("successfully fetches and parses YouTube videos from RSS feed", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockXmlResponse),
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        videos: expectedVideos,
      })
      expect(mockFetch).toHaveBeenCalledWith(
        "https://www.youtube.com/feeds/videos.xml?channel_id=UCh7qkafm95-kRiLMVPlbIcQ",
        { next: { revalidate: 3600 } }
      )
    })

    it("handles YouTube RSS feed HTTP errors", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      })

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        videos: [],
      })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching videos from RSS feed:",
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it("handles network errors gracefully", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"))

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        videos: [],
      })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching videos from RSS feed:",
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it("limits videos to maximum count", async () => {
      // Create XML with more than 6 videos (MAX_VIDEOS = 6)
      const manyVideosXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  ${Array.from(
    { length: 10 },
    (_, i) => `
    <entry>
      <yt:videoId>video-${i}</yt:videoId>
      <title>Video ${i}</title>
      <media:description>Description ${i}</media:description>
      <published>2024-01-0${(i % 9) + 1}T00:00:00.000Z</published>
    </entry>
  `
  ).join("")}
</feed>`

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(manyVideosXml),
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.videos).toHaveLength(6) // MAX_VIDEOS = 6
    })

    it("handles malformed XML gracefully", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("Invalid XML content"),
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        videos: [],
      })
    })

    it("properly decodes HTML entities in video titles and descriptions", async () => {
      const xmlWithEntities = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <yt:videoId>test-video</yt:videoId>
    <title>Title with &amp; &lt;special&gt; &quot;characters&quot; &#39;test&#39;</title>
    <media:description>Description with &amp; &lt;entities&gt;</media:description>
    <published>2024-01-01T00:00:00.000Z</published>
  </entry>
</feed>`

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(xmlWithEntities),
      })

      const response = await GET()
      const data = await response.json()

      expect(data.videos[0].title).toBe(
        "Title with & <special> \"characters\" 'test'"
      )
      expect(data.videos[0].description).toBe("Description with & <entities>")
    })

    it("handles entries missing required fields", async () => {
      const incompleteXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <!-- Missing yt:videoId -->
    <title>Video without ID</title>
    <media:description>Description</media:description>
    <published>2024-01-01T00:00:00.000Z</published>
  </entry>
  <entry>
    <yt:videoId>valid-video</yt:videoId>
    <title>Valid Video</title>
    <media:description>Valid Description</media:description>
    <published>2024-01-01T00:00:00.000Z</published>
  </entry>
</feed>`

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(incompleteXml),
      })

      const response = await GET()
      const data = await response.json()

      expect(data.videos).toHaveLength(1)
      expect(data.videos[0].id).toBe("valid-video")
    })

    it("generates correct thumbnail URLs", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockXmlResponse),
      })

      const response = await GET()
      const data = await response.json()

      expect(data.videos[0].thumbnailUrl).toBe(
        "https://i.ytimg.com/vi/test-video-id-1/hqdefault.jpg"
      )
    })

    it("generates correct video URLs", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockXmlResponse),
      })

      const response = await GET()
      const data = await response.json()

      expect(data.videos[0].url).toBe(
        "https://www.youtube.com/watch?v=test-video-id-1"
      )
    })

    it("handles missing published date gracefully", async () => {
      const xmlWithoutDate = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <yt:videoId>test-video</yt:videoId>
    <title>Video without date</title>
    <media:description>Description</media:description>
  </entry>
</feed>`

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(xmlWithoutDate),
      })

      const response = await GET()
      const data = await response.json()

      expect(data.videos[0].publishedAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      )
    })

    it("uses correct channel ID in RSS URL", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("<feed></feed>"),
      })

      await GET()

      expect(mockFetch).toHaveBeenCalledWith(
        "https://www.youtube.com/feeds/videos.xml?channel_id=UCh7qkafm95-kRiLMVPlbIcQ",
        expect.any(Object)
      )
    })
  })
})
