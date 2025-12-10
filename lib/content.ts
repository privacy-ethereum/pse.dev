import fs from "fs"
import matter from "gray-matter"
import jsYaml from "js-yaml"
import path from "path"

// Valid base paths for images in the public folder
const VALID_IMAGE_BASES = ["articles", "projects", "project", "project-banners"]

/**
 * Normalizes image paths in markdown content to ensure they resolve correctly.
 * Handles various user input formats and converts them to /{basePath}/[slug]/[filename]
 * @param content - The markdown content to process
 * @param defaultBasePath - The default base path to use if none is detected (e.g., "articles" or "projects")
 */
function normalizeContentImagePaths(
  content: string,
  defaultBasePath: string = "articles"
): string {
  const normalizeImagePath = (imagePath: string): string => {
    // Skip external URLs, data URIs, and anchor links
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("data:") ||
      imagePath.startsWith("#")
    ) {
      return imagePath
    }

    let normalized = imagePath.trim()

    // Remove leading ./ or ../
    normalized = normalized.replace(/^(?:\.\.?\/)+/, "")

    // Remove leading /
    normalized = normalized.replace(/^\/+/, "")

    // Remove public/ prefix (with or without leading slash already handled)
    normalized = normalized.replace(/^public\//, "")

    // Check if path already starts with a valid base
    const hasValidBase = VALID_IMAGE_BASES.some((base) =>
      normalized.startsWith(`${base}/`)
    )

    // If no valid base, prepend the default base path
    if (!hasValidBase) {
      normalized = `${defaultBasePath}/${normalized}`
    }

    // Add leading /
    return `/${normalized}`
  }

  // Match markdown images: ![alt](path) - handles optional title
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
  content = content.replace(markdownImageRegex, (match, alt, imagePath) => {
    const normalized = normalizeImagePath(imagePath)
    return `![${alt}](${normalized})`
  })

  // Match HTML img tags: <img src="path" /> or <img src='path' />
  const htmlImageRegex = /(<img\s+[^>]*src=)(["'])([^"']+)\2([^>]*>)/gi
  content = content.replace(
    htmlImageRegex,
    (match, prefix, quote, imagePath, suffix) => {
      const normalized = normalizeImagePath(imagePath)
      return `${prefix}${quote}${normalized}${quote}${suffix}`
    }
  )

  return content
}

export interface Project {
  id: string
  title: string
  description: string
  [key: string]: any
}

export interface ArticleTag {
  id: string
  name: string
}

export interface Article {
  id: string
  title: string
  image?: string
  tldr?: string
  content: string
  date: string
  authors?: string[]
  signature?: string
  publicKey?: string
  hash?: string
  canonical?: string
  tags?: ArticleTag[]
  projects?: string[]
}

const articlesDirectory = path.join(process.cwd(), "content/articles")
const projectsDirectory = path.join(process.cwd(), "content/projects")

// Generic function to read and process markdown content from any directory
export function getMarkdownContent<T = any>(options: {
  directory: string
  excludeFiles?: string[]
  processContent?: (data: any, content: string, id: string) => T
}): T[] {
  const { directory, excludeFiles = ["readme"], processContent } = options

  const fileNames = fs.readdirSync(directory)
  const allContentData = fileNames.map((fileName: string) => {
    const id = fileName.replace(/\.md$/, "")
    if (
      excludeFiles.some((exclude) => id.toLowerCase() === exclude.toLowerCase())
    ) {
      return null
    }

    // Read markdown file as string
    const fullPath = path.join(directory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    try {
      // Use matter with options to handle multiline strings
      const matterResult = matter(fileContents, {
        engines: {
          yaml: {
            // Ensure multiline strings are parsed correctly
            parse: (str: string) => {
              try {
                // Use js-yaml's safe load to parse the YAML with type assertion
                return jsYaml.load(str) as object
              } catch (e) {
                console.error(`Error parsing frontmatter in ${fileName}:`, e)
                // Fallback to empty object if parsing fails
                return {}
              }
            },
          },
        },
      })

      // Use custom processor if provided
      if (processContent) {
        return processContent(matterResult.data, matterResult.content, id)
      }

      // Default processing - return raw data with content
      return {
        id,
        ...matterResult.data,
        content: matterResult.content,
      }
    } catch (error) {
      console.error(`Error processing ${fileName}:`, error)
      // Return minimal content data if there's an error
      return {
        id,
        title: `Error processing ${id}`,
        content: "This content could not be processed due to an error.",
        date: new Date().toISOString().split("T")[0],
      }
    }
  })

  return allContentData.filter(Boolean) as T[]
}

export function getArticles(options?: {
  limit?: number
  tag?: string
  project?: string
}) {
  const { limit = 1000, tag, project } = options ?? {}

  const allArticles = getMarkdownContent<Article>({
    directory: articlesDirectory,
    excludeFiles: ["readme", "_readme", "_article-template"],
    processContent: (data, content, id) => {
      // Normalize tags from both 'tags' and 'tag' fields
      const rawTags = [
        ...(Array.isArray(data?.tags) ? data.tags : []),
        ...(data?.tag ? [data.tag] : []),
      ]

      // Process and normalize tags
      const normalizedTags = rawTags
        .map((tag) => {
          if (typeof tag !== "string") return null
          const name = tag.trim()
          if (!name) return null
          return {
            id: name
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, ""),
            name,
          }
        })
        .filter((tag): tag is ArticleTag => tag !== null)

      return {
        id,
        ...data,
        tags: normalizedTags,
        content: normalizeContentImagePaths(content, "articles"),
      }
    },
  })

  let filteredArticles = allArticles

  // Filter by tag if provided
  if (tag) {
    const tagId = tag.toLowerCase()
    filteredArticles = filteredArticles.filter((article) =>
      article.tags?.some((t) => t.id === tagId)
    )
  }

  // Filter by project if provided
  if (project) {
    filteredArticles = filteredArticles.filter(
      (article) =>
        Array.isArray(article.projects) && article.projects.includes(project)
    )
  }

  // Sort posts by date
  return filteredArticles
    .sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)

      // Sort in descending order (newest first)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, limit)
    .filter((article) => article.id !== "_article-template")
}

export function getProjects(options?: {
  tag?: string
  limit?: number
  status?: string
}) {
  const { tag, limit, status } = options ?? {}
  let allProjects = getMarkdownContent<Project>({
    directory: projectsDirectory,
    excludeFiles: ["readme", "_readme", "_project-template"],
    processContent: (data, content, id) => ({
      id,
      ...data,
      content: normalizeContentImagePaths(content, "projects"),
    }),
  })

  // Filter by tag if provided
  if (tag) {
    allProjects = allProjects.filter((project) => project.tags?.includes(tag))
  }

  // Filter by status if provided
  if (status) {
    allProjects = allProjects.filter((project) => project.status === status)
  }

  // Apply limit if provided
  if (limit && limit > 0) {
    allProjects = allProjects.slice(0, limit)
  }

  return allProjects
}

export const getArticleTags = () => {
  const articles = getArticles()
  const allTags = articles.reduce<ArticleTag[]>((acc, article) => {
    article.tags?.forEach((tag) => {
      if (!acc.some((t) => t.id === tag.id)) {
        acc.push(tag)
      }
    })
    return acc
  }, [])

  // Sort tags alphabetically by name
  return allTags.sort((a, b) => a.name.localeCompare(b.name))
}

export const getArticleTagsWithIds = () => {
  const tags = getArticleTags()
  return tags.map((tag: any) => ({
    id: tag
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, ""),
    name: tag,
  }))
}

export function getArticleById(slug?: string) {
  const articles = getArticles()
  return articles.find((article) => article.id === slug)
}

const lib = { getArticles, getArticleById, getProjects }

export default lib
