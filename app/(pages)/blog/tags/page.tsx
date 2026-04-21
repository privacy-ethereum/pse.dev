import { LABELS } from "@/app/labels"
import { Icons } from "@/components/icons"
import { AppContent } from "@/components/ui/app-content"
import { Label } from "@/components/ui/label"
import { getArticleTags, ArticleTag } from "@/lib/content"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"
import Link from "next/link"
import { Suspense } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: LABELS.BLOG_TAGS_PAGE.TITLE,
  description: LABELS.BLOG_TAGS_PAGE.SUBTITLE,
}

const BlogTagsPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["get-articles-tags"],
    queryFn: async () => {
      try {
        const tags = getArticleTags()
        return tags ?? []
      } catch (error) {
        console.error("Error fetching article tags:", error)
        return []
      }
    },
  })

  const tags =
    (queryClient.getQueryData(["get-articles-tags"]) as ArticleTag[]) ?? []

  return (
    <div className="flex flex-col pb-10">
      <AppContent className="flex flex-col gap-6 py-10 lg:max-w-[978px]">
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
          <Label.PageTitle label={LABELS.BLOG_TAGS_PAGE.TITLE} />
        </div>
        {tags?.length > 0 && (
          <div className="grid grid-cols-3 gap-2 lg:gap-10">
            <Suspense fallback={null}>
              <HydrationBoundary state={dehydrate(queryClient)}>
                {tags?.map((tag) => (
                  <Link
                    href={`/blog/tags/${tag.id}`}
                    key={tag.id}
                    className="text-primary border-b-[2px] border-b-anakiwa-500 text-sm font-medium w-fit hover:text-anakiwa-500 duration-200"
                  >
                    {tag.name}
                  </Link>
                ))}
              </HydrationBoundary>
            </Suspense>
          </div>
        )}
      </AppContent>
    </div>
  )
}

export default BlogTagsPage
