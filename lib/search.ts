import Fuse from "fuse.js"

// Helper to get nested object values (e.g., "tags.name")
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Post-filter results with word boundary matching
// This ensures "pir" matches "(pir)", "pir.", "pirate" but NOT "inspired"
function filterByWordBoundary<T>(results: T[], query: string, keys: string[]): T[] {
  if (!query.trim()) return results

  // Split query into individual words
  const words = query.trim().split(/\s+/)

  // Create regex patterns for each word (word boundary matching)
  const patterns = words.map(word => {
    // Escape special regex characters
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Match at word boundaries (start of word)
    return new RegExp(`\\b${escaped}`, 'i')
  })

  return results.filter(item => {
    // Check if ALL query words match at word boundaries in ANY searchable field
    return patterns.every(pattern => {
      return keys.some(key => {
        const value = getNestedValue(item, key)
        if (!value) return false

        // Handle arrays (like tags)
        if (Array.isArray(value)) {
          return value.some(v => {
            const str = typeof v === 'object' ? JSON.stringify(v) : String(v)
            return pattern.test(str)
          })
        }

        return pattern.test(String(value))
      })
    })
  })
}

// Transform query for Fuse.js extended search
// Use include-match operator for fuzzy matching
function preprocessQuery(query: string): string {
  const words = query.trim().split(/\s+/)

  // Use include-match (') for each word
  const patterns = words.map(word => {
    // If word already has extended search operators, don't modify it
    if (word.startsWith('^') || word.endsWith('$') ||
        word.startsWith('=') || word.startsWith("'") ||
        word.startsWith('!')) {
      return word
    }
    // Use include-match operator (fuzzy match anywhere)
    return `'${word}`
  })

  return patterns.join(' ')
}

// Search articles with proper field weights
export function searchArticles<T>(articles: T[], query: string): T[] {
  if (!query.trim()) return articles

  const fuse = new Fuse(articles, {
    keys: [
      { name: "title", weight: 1.0 },
      { name: "tags.name", weight: 0.75 },
      { name: "tldr", weight: 0.5 },
      { name: "content", weight: 0.25 },
    ],
    threshold: 0.1,
    distance: 200,
    includeScore: true,
    ignoreLocation: true,
    useExtendedSearch: true,
  })

  const processedQuery = preprocessQuery(query)
  const fuseResults = fuse.search(processedQuery).map((result) => result.item)

  // Post-filter with word boundary matching
  const searchKeys = ["title", "tags.name", "tldr", "content"]
  return filterByWordBoundary(fuseResults, query, searchKeys)
}

// Search projects with proper field weights
export function searchProjects<T>(projects: T[], query: string): T[] {
  if (!query.trim()) return projects

  const fuse = new Fuse(projects, {
    keys: [
      { name: "name", weight: 1.0 },
      { name: "tags.themes", weight: 0.75 },
      { name: "tags.keywords", weight: 0.75 },
      { name: "tags.builtWith", weight: 0.75 },
      { name: "tldr", weight: 0.5 },
      { name: "description", weight: 0.5 },
      { name: "projectStatus", weight: 0.25 },
      { name: "content", weight: 0.25 },
    ],
    threshold: 0.1,
    distance: 200,
    findAllMatches: true,
    includeScore: true,
    useExtendedSearch: true,
  })

  const processedQuery = preprocessQuery(query)
  const fuseResults = fuse.search(processedQuery).map((result) => result.item)

  // Post-filter with word boundary matching
  const searchKeys = [
    "name", "tags.themes", "tags.keywords", "tags.builtWith",
    "tldr", "description", "projectStatus", "content"
  ]
  return filterByWordBoundary(fuseResults, query, searchKeys)
}

