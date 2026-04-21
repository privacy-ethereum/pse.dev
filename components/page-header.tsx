import { AppContent } from "./ui/app-content"
import { Label } from "./ui/label"
import { ReactNode } from "react"

type PageHeaderProps = {
  title: ReactNode
  subtitle?: string
  actions?: ReactNode
  children?: ReactNode
  image?: ReactNode
  contentWidth?: number
  showDivider?: boolean
  size?: "small" | "large"
}

const PageHeader = ({
  title,
  subtitle,
  actions,
  children,
  image,
  showDivider = true,
  size = "small",
}: PageHeaderProps) => {
  return (
    <div className="flex h-full w-full items-center bg-cover-gradient md:h-[600px] dark:bg-transparent-gradient">
      <AppContent className="relative flex flex-col w-full gap-10 py-10 md:gap-14 md:py-20">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:gap-28">
          <div className="flex w-full flex-col justify-center gap-6 md:max-w-[700px] md:gap-8 lg:gap-14">
            <div className="flex flex-col gap-4 md:gap-8">
              <Label.PageTitle label={title} size={size} />
              {subtitle && (
                <p className="font-sans text-base font-normal text-primary md:text-[18px] md:leading-[27px] dark:text-tuatara-100">
                  {subtitle}
                </p>
              )}
            </div>
            {actions}
          </div>
          {image}
        </div>
        {children && (
          <div className="flex flex-col gap-10">
            {showDivider && <div className="h-[1px] w-20 bg-anakiwa-500"></div>}
            {children}
          </div>
        )}
      </AppContent>
    </div>
  )
}

PageHeader.displayName = "PageHeader"

export { PageHeader }
