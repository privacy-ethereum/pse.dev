import { AppContent } from "./ui/app-content"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

type BannerProps = {
  title: ReactNode
  subtitle?: string
  children?: ReactNode
  headingLevel?: "h2" | "h3" | "h4"
  className?: string
}

const Banner = ({
  title,
  subtitle,
  children,
  headingLevel = "h2",
  className = "",
}: BannerProps) => {
  const HeadingTag = headingLevel

  return (
    <section
      className={cn(
        "relative bg-cover-gradient dark:bg-anakiwa-975 text-center dark:bg-none",
        className
      )}
    >
      <div className="py-16">
        <AppContent className="flex flex-col gap-8">
          <div className="flex flex-col items-center text-center">
            {typeof title === "string" ? (
              <HeadingTag className="py-4 font-sans text-base font-bold uppercase tracking-[4px] text-primary dark:text-white">
                {title}
              </HeadingTag>
            ) : (
              title
            )}
            {subtitle && (
              <span className="md:max-w-[600px] text-base lg:text-xl font-normal font-sans text-tuatara-950 dark:text-tuatara-100">
                {subtitle}
              </span>
            )}
          </div>
          {children}
        </AppContent>
      </div>
    </section>
  )
}

Banner.displayName = "Banner"

export { Banner }
