import {
  cn,
  uniq,
  queryStringToObject,
  shuffleArray,
  getBackgroundImage,
  removeProtocol,
  interpolate,
} from "../../lib/utils"
import { ReadonlyURLSearchParams } from "next/navigation"
import { describe, it, expect } from "vitest"

describe("utils", () => {
  describe("cn (className merger)", () => {
    it("should merge class names correctly", () => {
      expect(cn("foo", "bar")).toBe("foo bar")
      expect(cn("foo", { bar: true, baz: false })).toBe("foo bar")
      expect(cn("foo", ["bar", "baz"])).toBe("foo bar baz")
      // Test Tailwind class merging
      expect(cn("p-4 bg-red-500", "p-8")).toBe("bg-red-500 p-8")
    })
  })

  describe("uniq", () => {
    it("should remove duplicates from array", () => {
      expect(uniq([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4])
      expect(uniq(["a", "b", "b", "c"])).toEqual(["a", "b", "c"])
    })

    it("should handle empty values based on removeEmpty parameter", () => {
      const arrayWithEmpty = [1, "", null, undefined, 2, "", 3]
      expect(uniq(arrayWithEmpty, true)).toEqual([1, 2, 3])
      expect(uniq(arrayWithEmpty, false)).toEqual([
        1,
        "",
        null,
        undefined,
        2,
        3,
      ])
    })
  })

  describe("queryStringToObject", () => {
    it("should convert URLSearchParams to object with array values", () => {
      const mockSearchParams = {
        entries: () => [
          ["category", "tech,news"],
          ["tags", "javascript,typescript"],
        ],
      } as unknown as ReadonlyURLSearchParams

      const result = queryStringToObject(mockSearchParams)
      expect(result).toEqual({
        category: ["tech", "news"],
        tags: ["javascript", "typescript"],
      })
    })

    it("should handle empty values", () => {
      const mockSearchParams = {
        entries: () => [["empty", ""]],
      } as unknown as ReadonlyURLSearchParams

      const result = queryStringToObject(mockSearchParams)
      expect(result).toEqual({
        empty: [""],
      })
    })
  })

  describe("shuffleArray", () => {
    it("should return an array of the same length", () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray([...original])
      expect(shuffled).toHaveLength(original.length)
      expect(shuffled).toEqual(expect.arrayContaining(original))
    })

    it("should maintain all original elements", () => {
      const original = ["a", "b", "c", "d"]
      const shuffled = shuffleArray([...original])
      expect(new Set(shuffled)).toEqual(new Set(original))
    })
  })

  describe("getBackgroundImage", () => {
    it("should return fallback image for null/undefined/empty values", () => {
      expect(getBackgroundImage(null)).toBe("/fallback.webp")
      expect(getBackgroundImage(undefined)).toBe("/fallback.webp")
      expect(getBackgroundImage("")).toBe("/fallback.webp")
    })

    it("should return the provided image path when valid", () => {
      expect(getBackgroundImage("/path/to/image.jpg")).toBe(
        "/path/to/image.jpg"
      )
    })
  })

  describe("removeProtocol", () => {
    it("should remove http:// and https:// from URLs", () => {
      expect(removeProtocol("https://example.com")).toBe("example.com")
      expect(removeProtocol("http://example.com")).toBe("example.com")
    })

    it("should handle URLs without protocol", () => {
      expect(removeProtocol("example.com")).toBe("example.com")
    })

    it("should handle undefined input", () => {
      expect(removeProtocol(undefined as unknown as string)).toBe(undefined)
    })
  })

  describe("interpolate", () => {
    it("should replace placeholders with provided values", () => {
      const template = "Hello {{name}}, you are {{age}} years old"
      const params = { name: "John", age: 30 }
      expect(interpolate(template, params)).toBe(
        "Hello John, you are 30 years old"
      )
    })

    it("should handle missing parameters", () => {
      const template = "Hello {{name}}, you are {{age}} years old"
      const params = { name: "John" }
      expect(interpolate(template, params)).toBe(
        "Hello John, you are {{age}} years old"
      )
    })

    it("should handle empty/undefined inputs", () => {
      expect(interpolate("", {})).toBe("")
      expect(interpolate("Hello", undefined)).toBe("Hello")
      expect(interpolate(undefined as unknown as string)).toBe(undefined)
    })

    it("should handle numeric values", () => {
      const template = "Count: {{count}}"
      expect(interpolate(template, { count: 42 })).toBe("Count: 42")
    })
  })
})
