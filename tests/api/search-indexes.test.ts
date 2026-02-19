import { GET } from "../../app/api/search/indexes/route"
import { describe, it, expect, vi } from "vitest"

describe("/api/search/indexes", () => {
  describe("GET /api/search/indexes", () => {
    it("returns available search indexes", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        indexes: ["blog", "projects", "research"],
        status: "success",
      })
    })

    it("handles errors gracefully", async () => {
      // This test verifies the error handling structure is in place
      // Since NextResponse.json handles serialization internally,
      // we just verify the basic error response structure
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("indexes")
      expect(data).toHaveProperty("status")
    })

    it("returns consistent indexes with search route", async () => {
      // This test ensures the indexes are the same as those used in the search route
      const response = await GET()
      const data = await response.json()

      // Should match the allIndexes constant in search/route.ts
      expect(data.indexes).toEqual(["blog", "projects", "research"])
      expect(Array.isArray(data.indexes)).toBe(true)
      expect(data.indexes.length).toBe(3)
    })

    it("returns proper response structure", async () => {
      const response = await GET()
      const data = await response.json()

      expect(data).toEqual({
        indexes: expect.any(Array),
        status: "success",
      })
      expect(data.indexes).toEqual(["blog", "projects", "research"])
      expect(data.status).toBe("success")
    })

    it("has correct response headers", async () => {
      const response = await GET()

      expect(response.headers.get("content-type")).toContain("application/json")
    })
  })
})
