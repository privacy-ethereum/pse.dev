"use client"

import { LocaleTypes } from "@/app/i18n/settings"
import { ProjectInterface } from "@/lib/types"
import { AppContent } from "../ui/app-content"
import { Article } from "@/lib/blog"
import { ArticleListCard } from "./article-list-card"
import { useGetProjectRelatedArticles } from "@/hooks/useGetProjectRelatedArticles"

export const ProjectBlogArticles = ({
  project,
  lang,
}: {
  project: ProjectInterface
  lang: LocaleTypes
}) => {
  const { articles, loading } = useGetProjectRelatedArticles({
    projectId: project.id,
  })

  if (loading) {
    return (
      <div
        id="related-articles"
        data-section-id="related-articles"
        className="py-10 lg:py-16 w-full"
      >
        <AppContent>
          <div className="flex flex-col gap-10">
            <h3 className="text-base font-bold font-sans text-left uppercase tracking-[3.36px]">
              Related articles
            </h3>
            <div className="grid grid-cols-1 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-[80px_1fr] lg:grid-cols-[120px_1fr] items-center gap-4 lg:gap-10"
                >
                  <div className="size-[80px] lg:size-[120px] rounded-full bg-slate-200 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="h-5 w-full bg-slate-200 animate-pulse"></div>
                    <div className="h-4 w-full bg-slate-200 animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-slate-200 animate-pulse "></div>
                    <div className="h-2 w-14 bg-slate-200 animate-pulse "></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AppContent>
      </div>
    )
  }

  if (articles.length === 0 && !loading) {
    return null
  }

  return (
    <div
      id="related-articles"
      data-section-id="related-articles"
      className="py-10 lg:py-16 w-full"
    >
      <div className="flex flex-col gap-10">
        <h3 className="text-[22px] font-bold text-tuatara-700">
          Related articles
        </h3>
        <div className="grid grid-cols-1 gap-4 lg:gap-8">
          {articles.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No articles found for this project.
            </p>
          )}
          {articles.map((article: Article) => {
            return (
              <ArticleListCard key={article.id} lang={lang} article={article} />
            )
          })}
        </div>
      </div>
    </div>
  )
}
