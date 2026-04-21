import { LABELS } from "@/app/labels"
import { ArticleListCard } from "@/components/blog/article-list-card"
import { Icons } from "@/components/icons"
import { Skeleton } from "@/components/skeleton"
import { AppContent } from "@/components/ui/app-content"
import { Label } from "@/components/ui/label"
import { getArticles, Article, getArticleTags, ArticleTag } from "@/lib/content"
import { interpolate } from "@/lib/utils"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"
import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

interface BlogTagPageProps {
  params: { tag: string }
}

export async function generateMetadata({
  params,
}: BlogTagPageProps): Promise<Metadata> {
  const { tag } = params
  const tags = await getArticleTags()
  const tagInfo = tags.find((t) => t.id === tag)

  return {
    title: interpolate(LABELS.BLOG_TAGS_PAGE.TAG_TITLE, {
      tag: tagInfo?.name ?? tag,
    }),
    description: LABELS.BLOG_TAGS_PAGE.SUBTITLE,
  }
}

export const generateStaticParams = async () => {
  const tags = await getArticleTags()
  return tags.map((tag) => ({ tag: tag.id }))
}

const BlogLoadingSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-stretch">
        <Skeleton.Card className="h-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:col-span-2 h-full">
          <Skeleton.Card size="md" className="max-h-[200px]" />
          <Skeleton.Card size="md" className="max-h-[200px]" />
          <Skeleton.Card size="md" className="max-h-[200px]" />
          <Skeleton.Card size="md" className="max-h-[200px]" />
        </div>
      </div>
      <div className="flex flex-col gap-5 lg:gap-14">
        <div className="grid grid-cols-[80px_1fr] lg:grid-cols-[120px_1fr] items-center gap-4 lg:gap-10">
          <Skeleton.Circle size="full" />
          <div className="flex flex-col gap-2">
            <Skeleton.Line size="lg" />
            <Skeleton.Line size="md" />
            <Skeleton.Line size="xs" />
          </div>
        </div>
        <div className="grid grid-cols-[80px_1fr] lg:grid-cols-[120px_1fr] items-center gap-4 lg:gap-10">
          <Skeleton.Circle size="full" />
          <div className="flex flex-col gap-2">
            <Skeleton.Line size="lg" />
            <Skeleton.Line size="md" />
            <Skeleton.Line size="xs" />
          </div>
        </div>
      </div>
    </>
  )
}

const BlogTagPage = async ({ params }: BlogTagPageProps) => {
  const { tag } = params
  const queryClient = new QueryClient()

  // First get all tags to find the display name
  await queryClient.prefetchQuery({
    queryKey: ["get-articles-tags"],
    queryFn: async () => {
      try {
        const tags = getArticleTags()
        return tags
      } catch (error) {
        console.error("Error fetching article tags:", error)
        return []
      }
    },
  })

  const tags = queryClient.getQueryData(["get-articles-tags"]) as ArticleTag[]
  const tagInfo = tags.find((t) => t.id === tag)

  await queryClient.prefetchQuery({
    queryKey: ["get-articles-by-tag", tag],
    queryFn: async () => {
      try {
        const articles = getArticles({ tag })
        return articles
      } catch (error) {
        console.error("Error fetching articles:", error)
        return []
      }
    },
  })

  const articles = queryClient.getQueryData([
    "get-articles-by-tag",
    tag,
  ]) as Article[]

  return (
    <div className="flex flex-col">
      <AppContent className="flex flex-col gap-10 pb-10 lg:py-10 lg:max-w-[978px]">
        <div className="flex flex-col gap-4 py-10 w-full">
          <Link
            className="flex items-center gap-2 text-primary/80 hover:text-primary mr-auto"
            href="/blog"
          >
            <Icons.arrowLeft />
            <span className="font-sans text-base">
              {LABELS.BLOG_TAGS_PAGE.BACK_TO_ARTICLES}
            </span>
          </Link>
          <Label.Section
            label={interpolate(LABELS.BLOG_TAGS_PAGE.TAG_TITLE, {
              tag: tagInfo?.name ?? tag,
            })}
          />
        </div>
        <Suspense fallback={<BlogLoadingSkeleton />}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex flex-col gap-5 lg:gap-14">
              {articles?.map((article: Article) => (
                <ArticleListCard key={article.id} article={article} />
              ))}
              {articles?.length === 0 && (
                <p className="text-center text-gray-500 py-10">
                  No articles found for tag &quot;{tagInfo?.name ?? tag}&quot;
                </p>
              )}
            </div>
          </HydrationBoundary>
        </Suspense>
      </AppContent>
    </div>
  )
}

export default BlogTagPage
