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
        name: "Test Project",
        title: "Test Project",
        description: "Test project description",
        category: "application",
      },
      {
        id: "test-research",
        name: "Test Research",
        title: "Test Research",
        description: "Research project description",
        category: "research",
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
        availableIndexes: ["blog", "projects", "research"],
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
        availableIndexes: ["blog", "projects", "research"],
      })
    })

    it("searches articles by title", async () => {
      const request = createMockRequest({ query: "test article" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe("success")
      expect(data.results.length).toBeGreaterThan(0)
      const blogResult = data.results.find((r: any) => r.indexName === "blog")
      expect(blogResult).toBeDefined()
      expect(blogResult.hits[0].title).toBe("Test Article")
    })

    it("searches projects by description", async () => {
      const request = createMockRequest({ query: "project", index: "projects" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe("success")
      expect(data.hits).toBeDefined()
      expect(data.hits.length).toBeGreaterThan(0)
      expect(data.hits[0].title).toBe("Test Project")
    })

    it("searches research index separately", async () => {
      const request = createMockRequest({ query: "research", index: "research" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe("success")
      expect(data.hits).toBeDefined()
    })

    it("filters projects by category (application/devtools only)", async () => {
      const request = createMockRequest({ query: "test", index: "projects" })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // Should only return application project, not research
      const researchHit = data.hits.find((h: any) => h.objectID === "test-research")
      expect(researchHit).toBeUndefined()
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
        { id: "1", title: "Article 1", content: "test", tldr: "test", date: "2024-01-01", tags: [] },
        { id: "2", title: "Article 2", content: "test", tldr: "test", date: "2024-01-02", tags: [] },
        { id: "3", title: "Article 3", content: "test", tldr: "test", date: "2024-01-03", tags: [] },
      ])

      const request = createMockRequest({ query: "article", hitsPerPage: "2" })
      const response = await GET(request)
      const data = await response.json()

      const blogResult = data.results.find((r: any) => r.indexName === "blog")
      expect(blogResult?.hits.length).toBeLessThanOrEqual(2)
    })

    // New tests for word boundary matching
    describe("Word Boundary Matching", () => {
      it("matches words with word boundaries, not partial matches within words", async () => {
        mockGetArticles.mockReturnValue([
          {
            id: "pir-article",
            title: "Understanding PIR (Private Information Retrieval)",
            content: "PIR is important for privacy",
            tldr: "Learn about PIR",
            date: "2024-01-01",
            tags: [],
          },
          {
            id: "inspired-article",
            title: "Inspired by Innovation",
            content: "This article was inspired by research",
            tldr: "Get inspired",
            date: "2024-01-02",
            tags: [],
          },
        ])

        const request = createMockRequest({ query: "pir" })
        const response = await GET(request)
        const data = await response.json()

        const blogResult = data.results.find((r: any) => r.indexName === "blog")
        expect(blogResult).toBeDefined()
        expect(blogResult.hits).toHaveLength(1)
        expect(blogResult.hits[0].objectID).toBe("pir-article")
      })

      it("matches words followed by punctuation at boundaries", async () => {
        mockGetProjects.mockReturnValue([
          {
            id: "semaphore",
            name: "Semaphore",
            title: "Semaphore Protocol",
            description: "Privacy protocol (Semaphore) for anonymous signaling.",
            category: "application",
          },
        ])

        const request = createMockRequest({ query: "semaphore", index: "projects" })
        const response = await GET(request)
        const data = await response.json()

        expect(data.hits.length).toBeGreaterThan(0)
        expect(data.hits[0].objectID).toBe("semaphore")
      })

      it("performs case-insensitive word boundary matching", async () => {
        mockGetArticles.mockReturnValue([
          {
            id: "snark-article",
            title: "SNARK Technology Overview",
            content: "SNARKs are powerful cryptographic proofs",
            tldr: "Learn about SNARKs",
            date: "2024-01-01",
            tags: [],
          },
        ])

        const request = createMockRequest({ query: "snark" })
        const response = await GET(request)
        const data = await response.json()

        const blogResult = data.results.find((r: any) => r.indexName === "blog")
        expect(blogResult).toBeDefined()
        expect(blogResult.hits).toHaveLength(1)
        expect(blogResult.hits[0].title).toBe("SNARK Technology Overview")
      })

      it("requires all words in multi-word query to match at word boundaries", async () => {
        mockGetArticles.mockReturnValue([
          {
            id: "crypto-zk",
            title: "Zero Knowledge Cryptography",
            content: "ZK proofs are used in crypto applications",
            tldr: "ZK and crypto together",
            date: "2024-01-01",
            tags: [],
          },
          {
            id: "encryption-only",
            title: "Cryptographic Methods",
            content: "Various encryption techniques without zero knowledge",
            tldr: "Encryption techniques",
            date: "2024-01-02",
            tags: [],
          },
        ])

        const request = createMockRequest({ query: "crypto zero" })
        const response = await GET(request)
        const data = await response.json()

        const blogResult = data.results.find((r: any) => r.indexName === "blog")
        expect(blogResult).toBeDefined()
        expect(blogResult.hits).toHaveLength(1)
        expect(blogResult.hits[0].objectID).toBe("crypto-zk")
      })

      it("returns no results when fuzzy matches don't satisfy word boundaries", async () => {
        mockGetArticles.mockReturnValue([
          {
            id: "inspiration",
            title: "Inspiration for Developers",
            content: "Get inspired by these innovative ideas",
            tldr: "Developer inspiration",
            date: "2024-01-01",
            tags: [],
          },
        ])

        // "pir" should not match "inspiration" due to word boundary filtering
        const request = createMockRequest({ query: "pir" })
        const response = await GET(request)
        const data = await response.json()

        expect(data.status).toBe("success")
        expect(data.results).toHaveLength(0)
      })
    })

    // New tests for tag matching
    describe("Tag Search with Word Boundaries", () => {
      it("searches tags with word boundary matching", async () => {
        mockGetArticles.mockReturnValue([
          {
            id: "privacy-article",
            title: "Privacy Technologies (PIR)",
            content: "Various privacy tools including PIR",
            tldr: "Privacy overview with PIR",
            tags: [{ id: "pir", name: "PIR" }],
            date: "2024-01-01",
          },
          {
            id: "inspiration-article",
            title: "Inspired Ideas",
            content: "Inspiration for developers",
            tldr: "Get inspired",
            tags: [{ id: "inspiration", name: "Inspiration" }],
            date: "2024-01-02",
          },
        ])

        const request = createMockRequest({ query: "pir" })
        const response = await GET(request)
        const data = await response.json()

        const blogResult = data.results.find((r: any) => r.indexName === "blog")
        expect(blogResult).toBeDefined()
        expect(blogResult.hits).toHaveLength(1)
        expect(blogResult.hits[0].objectID).toBe("privacy-article")
      })

      it("matches tags across multiple tag fields in projects", async () => {
        mockGetProjects.mockReturnValue([
          {
            id: "zk-project",
            name: "ZK Application",
            title: "ZK Application",
            description: "Application using zero knowledge",
            category: "application",
            tags: {
              themes: ["privacy"],
              keywords: ["zk", "cryptography"],
              builtWith: ["circom"],
            },
          },
        ])

        const request = createMockRequest({ query: "zk", index: "projects" })
        const response = await GET(request)
        const data = await response.json()

        expect(data.hits).toHaveLength(1)
        expect(data.hits[0].objectID).toBe("zk-project")
      })
    })

    // New tests for fuzzy matching
    describe("Fuzzy Matching", () => {
      it("performs fuzzy matching with low threshold for typos", async () => {
        mockGetProjects.mockReturnValue([
          {
            id: "semaphore",
            name: "Semaphore",
            title: "Semaphore",
            description: "Privacy signaling protocol",
            category: "application",
          },
        ])

        // "semaphor" (missing 'e') should match "Semaphore" with fuzzy matching
        const request = createMockRequest({ query: "semaphor", index: "projects" })
        const response = await GET(request)
        const data = await response.json()

        expect(data.hits.length).toBeGreaterThan(0)
        expect(data.hits[0].objectID).toBe("semaphore")
      })

      it("handles special characters in search queries", async () => {
        mockGetArticles.mockReturnValue([
          {
            id: "regex-article",
            title: "Understanding Regular Expressions (regex)",
            content: "Learn about regex patterns",
            tldr: "Regex tutorial",
            date: "2024-01-01",
            tags: [],
          },
        ])

        const request = createMockRequest({ query: "regex" })
        const response = await GET(request)
        const data = await response.json()

        const blogResult = data.results.find((r: any) => r.indexName === "blog")
        expect(blogResult).toBeDefined()
        expect(blogResult.hits.length).toBeGreaterThan(0)
      })
    })
  })
})
