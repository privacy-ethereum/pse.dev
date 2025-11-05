import Fuse from "fuse.js"

interface SearchResult<T> {
  item: T
  score: number
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
    threshold: 0.3,
    distance: 100,
    includeScore: true,
    ignoreLocation: true,
  })

  return fuse.search(query).map((result) => result.item)
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
    threshold: 0.3,
    distance: 200,
    findAllMatches: true,
    includeScore: true,
    useExtendedSearch: true,
  })

  return fuse.search(query).map((result) => result.item)
}

