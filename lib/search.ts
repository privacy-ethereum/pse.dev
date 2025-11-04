export function searchText(text: string | undefined, query: string): boolean {
  if (!text) return false
  return text.toLowerCase().includes(query.toLowerCase())
}

export function calculateRelevance(
  item: {
    title?: string
    content?: string
    description?: string
    tldr?: string
    tags?: { name: string }[]
  },
  query: string
): number {
  const q = query.toLowerCase()
  let score = 0

  // Title match (highest priority)
  if (item.title?.toLowerCase().includes(q)) {
    score += 100
    // Exact title match gets bonus
    if (item.title.toLowerCase() === q) score += 50
    // Title starts with query gets bonus
    if (item.title.toLowerCase().startsWith(q)) score += 25
  }

  // Tag match (high priority)
  if (item.tags?.some((tag) => tag.name.toLowerCase().includes(q))) {
    score += 50
  }

  // TLDR/description match (medium priority)
  if (
    item.tldr?.toLowerCase().includes(q) ||
    item.description?.toLowerCase().includes(q)
  ) {
    score += 25
  }

  // Content match (lower priority)
  if (item.content?.toLowerCase().includes(q)) {
    score += 10
  }

  return score
}

export function highlight(text: string | undefined, query: string): string {
  if (!text) return ""
  const regex = new RegExp(`(${query})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}
