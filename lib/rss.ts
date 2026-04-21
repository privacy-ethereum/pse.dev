import { Feed } from "feed"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pse.dev"

function formatDate(dateString: string | undefined): Date {
  if (!dateString) {
    console.warn("No date provided, using current date")
    return new Date()
  }

  try {
    const [year, month, day] = dateString.split("-").map(Number)

    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
      console.warn(`Invalid date format: ${dateString}, using current date`)
      return new Date()
    }

    const date = new Date(year, month - 1, day)

    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateString}, using current date`)
      return new Date()
    }

    return date
  } catch (error) {
    console.warn(`Error parsing date: ${dateString}, using current date`)
    return new Date()
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

    const articles = articleFiles
      .filter((file) => file.endsWith(".md") && file !== "_article-template.md")
      .map((file) => {
        try {
          const filePath = path.join(articlesDirectory, file)
          const fileContents = fs.readFileSync(filePath, "utf8")
          const { data, content } = matter(fileContents)

          return {
            slug: file.replace(/\.md$/, ""),
            frontmatter: data,
            content,
          }
        } catch (error) {
          console.warn(`Error processing article ${file}:`, error)
          return null
        }
      })
      .filter(
        (article): article is NonNullable<typeof article> => article !== null
      )
      .sort(
        (a, b) =>
          formatDate(b.frontmatter.date).getTime() -
          formatDate(a.frontmatter.date).getTime()
      )

    // Add articles to feed
    articles.forEach((article) => {
      try {
        const url = `${SITE_URL}/blog/${article.slug}`
        const pubDate = formatDate(article.frontmatter.date)

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
