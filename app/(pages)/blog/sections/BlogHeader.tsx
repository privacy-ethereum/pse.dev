"use client"

import { AppLink } from "@/components/app-link"
import { blogArticleCardTagCardVariants } from "@/components/blog/blog-article-card"
import { AppContent } from "@/components/ui/app-content"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Markdown } from "@/components/ui/markdown"
import { cn } from "@/lib/utils"

interface BlogHeaderProps {
  post: any
  imageAsCover: boolean
}

export const BlogHeader = ({ post, imageAsCover }: BlogHeaderProps) => {
  const authors =
    (post?.authors ?? [])?.length > 0 ? post.authors?.join(", ") : null

  return (
    <div className="flex items-start justify-center z-0 bg-cover border-tuatara-300 border-b w-full dark:border-anakiwa-800">
      <AppContent className="flex flex-col gap-8 py-10 max-w-[978px]">
        <div className="flex flex-col gap-2">
          <Label.PageTitle
            label={post?.title}
            className={cn(imageAsCover && "text-white")}
          />
          {authors && (
            <span className={cn("text-sm font-sans text-tuatara-300")}>
              {authors}
            </span>
          )}
        </div>

        {post?.date || post?.tldr ? (
          <div className="flex flex-col gap-2">
            {post?.date && (
              <div
                className={blogArticleCardTagCardVariants({
                  variant: "secondary",
                })}
              >
                {new Date(post?.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            )}
            {post?.canonical && post.canonical.trim() && (
              <div
                className={cn(
                  "text-sm italic  mt-1",
                  imageAsCover ? "text-white" : "text-gray-500"
                )}
              >
                This post was originally posted in{" "}
                <AppLink
                  href={post.canonical}
                  external
                  className={cn(
                    "text-primary hover:underline",
                    imageAsCover ? "!text-white" : "!text-gray-500"
                  )}
                >
                  {new URL(post.canonical).hostname.replace(/^www\./, "")}
                </AppLink>
              </div>
            )}
            {post?.tldr && (
              <Markdown
                darkMode={imageAsCover}
                components={{
                  p: ({ children }) => (
                    <p className="text-white dark:text-tuatara-200 font-sans text-lg font-normal">
                      {children}
                    </p>
                  ),
                }}
              >
                {post?.tldr}
              </Markdown>
            )}
          </div>
        ) : null}
        {(post?.tags ?? [])?.length > 0 && (
          <div className="flex flex-col gap-2">
            <span
              className={cn(
                "text-sm italic",
                imageAsCover ? "text-white" : "text-primary"
              )}
            >
              Tags:
            </span>
            <div className="flex flex-wrap gap-2">
              {post?.tags?.map((tag: any) => (
                <AppLink
                  key={tag.id}
                  href={`/blog/tags/${tag.id}`}
                  variant="button"
                  className="w-fit"
                >
                  <Button
                    size="xs"
                    variant={imageAsCover ? "secondary" : "default"}
                  >
                    {tag.name}
                  </Button>
                </AppLink>
              ))}
            </div>
          </div>
        )}
      </AppContent>
    </div>
  )
}
