import { cn } from "@/lib/utils"
import { classed } from "@tw-classed/react"
import { ReactNode } from "react"

interface SectionWrapperProps {
  title: string
  description?: string
  showHeader?: boolean
  children?: ReactNode
  className?: string
}

export const SectionWrapperTitle = classed.h3(
  "relative font-sans text-base font-bold uppercase tracking-[3.36px] text-anakiwa-950 dark:text-anakiwa-400 dark:text-white",
  {
    variants: {
      variant: {
        default:
          "after:ml-8 after:absolute after:top-1/2 after:h-[1px] after:w-full after:translate-y-1/2 after:bg-anakiwa-300 after:content-['']",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const SectionWrapper = ({
  title = "",
  description = "",
  showHeader = true,
  children = null,
  className = "",
}: SectionWrapperProps) => {
  return (
    <div className={cn("flex w-full flex-col gap-10", className)}>
      {showHeader && (
        <div className="flex flex-col gap-6 overflow-hidden">
          <SectionWrapperTitle>{title}</SectionWrapperTitle>
          {description?.length > 0 && (
            <span className="font-sans text-base italic text-primary">
              {description}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
