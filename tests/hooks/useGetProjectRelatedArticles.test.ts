import { fetchArticles } from "../../hooks/useGetProjectRelatedArticles"
import { describe, it, expect, beforeEach, vi } from "vitest"

// Mock fetch globally
global.fetch = vi.fn()

describe("fetchArticles", () => {
  const mockArticles = [
    { id: "pse-july-newsletter-2024", title: "July Newsletter" },
    { id: "newsletter-august-2024", title: "August Newsletter" },
    { id: "regular-article", title: "Regular Article" },
    { id: "news-letter-special", title: "Special Edition" },
  ]

  beforeEach(() => {
    // Reset mock before each test
    vi.resetAllMocks()

    // Mock the fetch response
    ;(global.fetch as any).mockResolvedValue({
      json: () => Promise.resolve({ articles: mockArticles }),
    })
  })

  it("should fetch all articles when no excludeIds provided", async () => {
    const articles = await fetchArticles("test-project")
    expect(articles).toHaveLength(4)
    expect(articles).toEqual(mockArticles)
  })

  it("should exclude exact matches when partialIdMatch is false", async () => {
    const excludeIds = ["newsletter-august-2024"]
    const articles = await fetchArticles("test-project", excludeIds, false)

    expect(articles).toHaveLength(3)
    expect(
      articles.find((a: any) => a.id === "newsletter-august-2024")
    ).toBeUndefined()
    expect(
      articles.find((a: any) => a.id === "pse-july-newsletter-2024")
    ).toBeDefined()
  })

  it("should exclude partial matches when partialIdMatch is true", async () => {
    const excludeIds = ["newsletter"]
    const articles = await fetchArticles("test-project", excludeIds, true)

    // Should exclude all articles containing 'newsletter' (case insensitive)
    expect(articles).toHaveLength(1)
    expect(articles[0].id).toBe("regular-article")

    // Verify excluded articles
    expect(
      articles.find((a: any) => a.id === "pse-july-newsletter-2024")
    ).toBeUndefined()
    expect(
      articles.find((a: any) => a.id === "newsletter-august-2024")
    ).toBeUndefined()
    expect(
      articles.find((a: any) => a.id === "news-letter-special")
    ).toBeUndefined()
  })

  it("should handle case-insensitive partial matches", async () => {
    const excludeIds = ["NEWSLETTER"]
    const articles = await fetchArticles("test-project", excludeIds, true)

    expect(articles).toHaveLength(1)
    expect(articles[0].id).toBe("regular-article")
  })

  it("should handle multiple exclude patterns", async () => {
    const excludeIds = ["newsletter", "special"]
    const articles = await fetchArticles("test-project", excludeIds, true)

    expect(articles).toHaveLength(1)
    expect(articles[0].id).toBe("regular-article")
  })

  it("should make API call with correct project parameter", async () => {
    await fetchArticles("test-project")

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/articles?project=test-project"
    )
  })
})
