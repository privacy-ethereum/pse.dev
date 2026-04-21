import { LABELS } from "@/app/labels"
import { blogArticleCardTagCardVariants } from "@/components/blog/blog-article-card"
import { BlogContent } from "@/components/blog/blog-content"
import { Icons } from "@/components/icons"
import { AppContent } from "@/components/ui/app-content"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Markdown } from "@/components/ui/markdown"
import { siteConfig } from "@/config/site"
import { getArticles, getArticleById } from "@/lib/content"
import { cn, getBackgroundImage } from "@/lib/utils"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogHeader } from "../sections/BlogHeader"

export const dynamic = "force-dynamic"

export const generateStaticParams = async () => {
  const articles = await getArticles()
  return articles.map(({ id }) => ({
    slug: id,
  }))
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const post = await getArticleById(params.slug)

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found",
    }
  }

  const imageUrl =
    post && (post?.image ?? "")?.length > 0 ? post?.image : "/og-image.png"

  const metadata: Metadata = {
    title: post?.title,
    description: post?.tldr,
    openGraph: {
      images: [{ url: imageUrl as string, width: 1200, height: 630 }],
    },
  }

  if (post && "canonical" in post) {
    metadata.alternates = {
      canonical: post.canonical as string,
    }
  }

  return metadata
}

export default function BlogArticle({ params }: any) {
  const slug = params.slug
  const post = getArticleById(slug)

  if (!post) {
    notFound()
  }

  const imageUrl = getBackgroundImage(post?.image)

  const imageAsCover = true

  const isNewsletter =
    post?.title?.toLowerCase().includes("newsletter") ||
    post?.tags?.some((tag) => tag.name.toLowerCase().includes("newsletter")) ||
    post?.tldr?.toLowerCase()?.includes("newsletter")

  return (
    <div className="flex flex-col relative">
      <Link
        href={siteConfig.editBlogPage(slug)}
        target="_blank"
        className="fixed bottom-5 left-5 lg:bottom-5 lg:left-10 z-10"
      >
        <Button className="w-full md:w-auto" size="sm">
          <div className="flex items-center gap-1">
            <Icons.gitHub size={18} />
            <span className="pl-2 text-left text-sm font-medium uppercase">
              {LABELS.COMMON.EDIT_THIS_PAGE}
            </span>
            <Icons.externalUrl size={22} />
          </div>
        </Button>
      </Link>
      <div className="flex items-start justify-center z-0 relative">
        <div
          className={cn(
            "absolute inset-0 bg-cover",
            imageAsCover
              ? "bg-cover after:content-[''] after:absolute after:inset-0 after:bg-black after:opacity-60 bg-center"
              : "bg-cover-gradient"
          )}
          style={{
            backgroundImage:
              imageAsCover && imageUrl?.length > 0
                ? `url(${imageUrl})`
                : undefined,
          }}
        />
        <BlogHeader post={post} imageAsCover={imageAsCover} />
      </div>
      <div className="pt-10 md:pt-16 pb-32">
        <BlogContent post={post} isNewsletter={isNewsletter} />
      </div>
    </div>
  )
}
