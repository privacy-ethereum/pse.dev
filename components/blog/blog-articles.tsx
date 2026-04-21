import { Article, getArticles } from "@/lib/content"
import { BlogArticleCard } from "./blog-article-card"
import { AppLink } from "../app-link"

interface BlogArticlesProps {
  tag?: string
}

async function fetchArticles(tag?: string) {
  return getArticles({
    tag,
    limit: undefined,
  })
}

function ArticlesGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {articles.length === 0 && (
        <p className="col-span-full text-center text-gray-500">
          No articles found for this tag.
        </p>
      )}
      {articles.map(
        ({ id, title, image, tldr = "", date, authors, content }: Article) => {
          const url = `/blog/${id}`
          return (
            <div key={id} className="flex h-full">
              <AppLink
                className="flex-1 w-full hover:opacity-90 transition-opacity duration-300 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-900/10"
                href={url}
              >
                <BlogArticleCard
                  id={id}
                  image={image}
                  title={title}
                  date={date}
                  authors={authors}
                  content={content}
                />
              </AppLink>
            </div>
          )
        }
      )}
    </div>
  )
}

export async function BlogArticles({ tag }: BlogArticlesProps) {
  const articles = await fetchArticles(tag)
  return <ArticlesGrid articles={articles} />
}
