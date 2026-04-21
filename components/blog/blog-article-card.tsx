import { Article } from "@/lib/content"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import Image from "next/image"

export const blogArticleCardTagCardVariants = cva(
  "text-xs font-sans text-primary rounded-[3px] py-[2px] px-[6px] w-fit shrink-[0] dark:text-black",
  {
    variants: {
      variant: {
        primary: "bg-[#D8FEA8]",
        secondary: "bg-[#C2E8F5]",
      },
    },
  }
)

export const BlogArticleCard = ({
  id,
  image,
  title,
  date,
  authors,
}: Article) => {
  const imageUrl = image && (image ?? "")?.length > 0 ? image : "/fallback.webp"
  return (
    <div className="flex flex-col h-full w-full">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={imageUrl}
          alt="Article cover image"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          quality={85}
          loading="lazy"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow gap-5 lg:gap-8 min-h-[180px]">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold leading-7 text-black duration-200 cursor-pointer hover:text-anakiwa-500">
            {title}
          </h3>
        </div>

        <div className="flex justify-between mt-auto gap-4 items-center">
          {authors && authors.length > 0 && (
            <p className="text-gray-500 text-sm mt-auto">
              By {authors.join(", ")}
            </p>
          )}
          {date && (
            <div
              className={cn(
                "ml-auto",
                blogArticleCardTagCardVariants({ variant: "secondary" })
              )}
            >
              {new Date(date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
