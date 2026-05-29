import { Feed } from "feed"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pse.dev"

function parseDate(rawDate: unknown): Date | null {
  if (!rawDate) return null

  // YAML auto-parses unquoted `YYYY-MM-DD` frontmatter into Date objects.
  if (rawDate instanceof Date) {
    return isNaN(rawDate.getTime()) ? null : rawDate
  }

  if (typeof rawDate !== "string") return null

  try {
    const [year, month, day] = rawDate.split("-").map(Number)

    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
      return null
    }

    const date = new Date(year, month - 1, day)

    if (isNaN(date.getTime())) return null

    return date
  } catch (error) {
    return null
  }
}

export async function generateRssFeed() {
  const feed = new Feed({
    title: "Privacy Stewards of Ethereum",
    description:
      "PSE is a research and development lab with a mission of making cryptography useful for human collaboration. We build open source tooling with things like zero-knowledge proofs, multiparty computation, homomorphic encryption, Ethereum, and more.",
    id: SITE_URL,
    link: SITE_URL,
    language: "en",
    image: `${SITE_URL}/favicon.ico`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Privacy Stewards of Ethereum`,
    updated: new Date(),
    feedLinks: {
      rss2: `${SITE_URL}/api/rss`,
    },
    author: {
      name: "PSE Team",
      link: SITE_URL,
    },
  })

  try {
    // Get all articles
    const articlesDirectory = path.join(process.cwd(), "content/articles")
    const articleFiles = fs.readdirSync(articlesDirectory)

    const excludedSlugs = new Set(["readme", "_readme", "_article-template"])

    const articles = articleFiles
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const slug = file.replace(/\.md$/, "")
        if (excludedSlugs.has(slug.toLowerCase())) return null

        try {
          const filePath = path.join(articlesDirectory, file)
          const fileContents = fs.readFileSync(filePath, "utf8")
          const { data, content } = matter(fileContents)

          const pubDate = parseDate(data.date)
          if (!pubDate) {
            console.warn(
              `Skipping ${file} in RSS feed: missing or invalid date`
            )
            return null
          }

          return {
            slug,
            frontmatter: data,
            content,
            pubDate,
          }
        } catch (error) {
          console.warn(`Error processing article ${file}:`, error)
          return null
        }
      })
      .filter(
        (article): article is NonNullable<typeof article> => article !== null
      )
      .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())

    // Add articles to feed
    articles.forEach((article) => {
      try {
        const url = `${SITE_URL}/blog/${article.slug}`
        const pubDate = article.pubDate

        feed.addItem({
          title: article.frontmatter.title || "Untitled Article",
          id: url,
          link: url,
          description: article.frontmatter.tldr || "",
          content: article.content,
          author: article.frontmatter.authors?.map((author: string) => ({
            name: author,
          })) || [{ name: "PSE Team" }],
          date: pubDate,
          image: article.frontmatter.image
            ? `${SITE_URL}${article.frontmatter.image}`
            : undefined,
          category:
            article.frontmatter.tags?.map((tag: string) => ({ name: tag })) ||
            [],
        })
      } catch (error) {
        console.warn(`Error adding article ${article.slug} to feed:`, error)
      }
    })

    return feed.rss2()
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    throw error
  }
}
