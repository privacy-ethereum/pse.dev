import fs from "fs"
import matter from "gray-matter"
import jsYaml from "js-yaml"
import path from "path"

const VALID_IMAGE_BASES = ["articles", "projects", "project", "project-banners"]

function normalizeImagePath(
  imagePath: string | undefined,
  defaultBasePath: string = "articles",
  slug?: string
): string | undefined {
  if (!imagePath) return undefined

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:") ||
    imagePath.startsWith("#")
  ) {
    return imagePath
  }

  let normalized = imagePath.trim()
  normalized = normalized.replace(/^(?:\.\.?\/)+/, "")
  normalized = normalized.replace(/^\/+/, "")
  normalized = normalized.replace(/^public\//, "")

  const hasValidBase = VALID_IMAGE_BASES.some((base) =>
    normalized.startsWith(`${base}/`)
  )

  if (!hasValidBase) {
    const isJustFilename = !normalized.includes("/")
    if (isJustFilename && slug) {
      normalized = `${defaultBasePath}/${slug}/${normalized}`
    } else {
      normalized = `${defaultBasePath}/${normalized}`
    }
  }

  return `/${normalized}`
}

function normalizeContentImagePaths(
  content: string,
  defaultBasePath: string = "articles",
  slug?: string
): string {
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
  content = content.replace(markdownImageRegex, (match, alt, imagePath) => {
    const normalized = normalizeImagePath(imagePath, defaultBasePath, slug)
    return `![${alt}](${normalized})`
  })

  const htmlImageRegex = /(<img\s+[^>]*src=)(["'])([^"']+)\2([^>]*>)/gi
  content = content.replace(
    htmlImageRegex,
    (match, prefix, quote, imagePath, suffix) => {
      const normalized = normalizeImagePath(imagePath, defaultBasePath, slug)
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

    const fullPath = path.join(directory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    try {
      const matterResult = matter(fileContents, {
        engines: {
          yaml: {
            parse: (str: string) => {
              try {
                return jsYaml.load(str) as object
              } catch (e) {
                console.error(`Error parsing frontmatter in ${fileName}:`, e)
                return {}
              }
            },
          },
        },
      })

      if (processContent) {
        return processContent(matterResult.data, matterResult.content, id)
      }

      return {
        id,
        ...matterResult.data,
        content: matterResult.content,
      }
    } catch (error) {
      console.error(`Error processing ${fileName}:`, error)
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
      const rawTags = [
        ...(Array.isArray(data?.tags) ? data.tags : []),
        ...(data?.tag ? [data.tag] : []),
      ]

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
        image: normalizeImagePath(data.image, "articles", id),
        tags: normalizedTags,
        content: normalizeContentImagePaths(content, "articles", id),
      }
    },
  })

  let filteredArticles = allArticles

  if (tag) {
    const tagId = tag.toLowerCase()
    filteredArticles = filteredArticles.filter((article) =>
      article.tags?.some((t) => t.id === tagId)
    )
  }

  if (project) {
    filteredArticles = filteredArticles.filter(
      (article) =>
        Array.isArray(article.projects) && article.projects.includes(project)
    )
  }

  return filteredArticles
    .sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
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
      image: normalizeImagePath(data.image, "projects", id),
      content: normalizeContentImagePaths(content, "projects", id),
    }),
  })

  if (tag) {
    allProjects = allProjects.filter((project) => project.tags?.includes(tag))
  }

  if (status) {
    allProjects = allProjects.filter((project) => project.status === status)
  }

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
