function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function searchText(text: string | undefined, query: string): boolean {
  if (!text) return false
  // Use word boundary matching: matches whole words or word starts
  const escapedQuery = escapeRegex(query)
  const regex = new RegExp(`\\b${escapedQuery}`, "i")
  return regex.test(text)
}

export function calculateRelevance(
  item: {
    title?: string
    name?: string
    content?: string
    description?: string
    tldr?: string
    tags?: any
  },
  query: string
): number {
  const q = query.toLowerCase()
  let score = 0

  // Title/name match (highest priority)
  const titleOrName = item.title || item.name
  if (titleOrName && searchText(titleOrName, q)) {
    score += 100
    // Exact title match gets bonus
    if (titleOrName.toLowerCase() === q) score += 50
    // Title starts with query gets bonus
    if (titleOrName.toLowerCase().startsWith(q)) score += 25
  }

  // Tag match (high priority) - handle both article and project tag formats
  if (item.tags) {
    let tagMatches = false

    // Article format: [{ id: "test", name: "Test" }]
    if (Array.isArray(item.tags)) {
      tagMatches = item.tags.some((tag) => {
        if (typeof tag === "string") {
          return searchText(tag, q)
        }
        if (tag.name) {
          return searchText(tag.name, q)
        }
        return false
      })
    }
    // Project format: { keywords: ["tag1", "tag2"] }
    else if (item.tags.keywords && Array.isArray(item.tags.keywords)) {
      tagMatches = item.tags.keywords.some((keyword: string) =>
        searchText(keyword, q)
      )
    }

    if (tagMatches) {
      score += 50
    }
  }

  // TLDR/description match (medium priority)
  if (searchText(item.tldr, q) || searchText(item.description, q)) {
    score += 25
  }

  // Content match (lower priority)
  if (searchText(item.content, q)) {
    score += 10
  }

  return score
}

export function highlight(text: string | undefined, query: string): string {
  if (!text) return ""
  const escapedQuery = escapeRegex(query)
  const regex = new RegExp(`\\b(${escapedQuery})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}
