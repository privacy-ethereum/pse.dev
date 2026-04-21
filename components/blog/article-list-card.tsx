"use client"

import { Button } from "../ui/button"
import { Markdown } from "../ui/markdown"
import { Article } from "@/lib/content"
import { getBackgroundImage } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export const ArticleListCard = ({
  article,
  lineClamp = false,
}: {
  article: Article
  lineClamp?: boolean
}) => {
  const url = `/blog/${article.id}`

  const formattedDate = new Date(article.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const tldr = lineClamp
    ? (article.tldr || "").replace(/\n/g, " ").substring(0, 120) +
      (article.tldr && article.tldr.length > 120 ? "..." : "")
    : article.tldr || ""

  const tags = article?.tags ?? []
  const backgroundImage = getBackgroundImage(article?.image)
  const contentClassName =
    "font-sans text-sm text-tuatara-600 group-hover:text-primary duration-200 dark:text-tuatara-200"

  return (
    <div className="flex h-full">
      <Link
        className="full group cursor-pointer hover:scale-105 duration-300"
        href={url}
        rel="noreferrer"
      >
        <div className="grid grid-cols-[80px_1fr] lg:grid-cols-[120px_1fr] items-center gap-4 lg:gap-10">
          <div className="relative size-[80px] lg:size-[120px] rounded-full bg-slate-200 overflow-hidden">
            {backgroundImage ? (
              <Image
                src={backgroundImage}
                alt="Article thumbnail"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 80px, 120px"
                priority={false}
              />
            ) : null}
          </div>
          <div className="flex flex-col gap-4 lg:gap-5">
            <span className="text-[10px] font-bold tracking-[2.1px] text-tuatara-400 font-sans uppercase dark:text-tuatara-100">
              {formattedDate}
            </span>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-display lg:text-[22px] font-bold text-primary group-hover:text-anakiwa-500 group-hover:underline duration-200 lg:leading-6">
                {article.title}
              </span>
              {(article?.authors ?? [])?.length > 0 && (
                <span className="text-tuatara-400 lg:text-xs text-[10px] leading-none font-sans dark:text-tuatara-300">
                  {article.authors?.map((author) => author).join(", ")}
                </span>
              )}
              <div className="hidden lg:block">
                <Markdown
                  components={{
                    a: ({ children }) => (
                      <span className={contentClassName}>{children}</span>
                    ),
                    h1: ({ children }) => (
                      <h1 className={contentClassName}>{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className={contentClassName}>{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className={contentClassName}>{children}</h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className={contentClassName}>{children}</h4>
                    ),
                    h5: ({ children }) => (
                      <h5 className={contentClassName}>{children}</h5>
                    ),
                    h6: ({ children }) => (
                      <h6 className={contentClassName}>{children}</h6>
                    ),
                    p: ({ children }) => (
                      <p className={contentClassName}>{children}</p>
                    ),
                    img: ({ src, alt }) => null,
                  }}
                >
                  {tldr}
                </Markdown>
              </div>
            </div>
            {tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 5).map((tag) => (
                  <Link key={tag.id} href={`/blog/tags/${tag.id}`}>
                    <Button size="xs" variant="secondary">
                      {tag.name}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
