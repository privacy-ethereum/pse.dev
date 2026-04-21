import { LABELS } from "@/app/labels"
import { AppLink } from "@/components/app-link"
import { Icons } from "@/components/icons"
import { ResearchList } from "@/components/research/research-list"
import { AppContent } from "@/components/ui/app-content"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Research",
  description:
    "PSE supports projects working on theoretical cryptography research, protocol development, open source tooling, experimental applications, and more.",
}

const ResearchPage = async () => {
  return (
    <div className="flex flex-col gap-10 pb-[128px] ">
      <AppContent className="flex flex-col gap-4 py-10 w-full">
        <div className="flex flex-col gap-10">
          <h1 className="dark:text-tuatara-100 text-tuatara-950 text-xl lg:text-3xl font-normal font-sans text-center">
            {LABELS.RESEARCH_PAGE.TITLE}
          </h1>
          <div className="lg:!w-4/5 w-full flex lg:flex-row flex-col items-center gap-3 lg:gap-10 mx-auto justify-center">
            <span className="text-base lg:text-xl dark:text-tuatara-200 text-tuatara-950 font-sans text-center">
              {LABELS.RESEARCH_PAGE.SUBTITLE}
            </span>
            <AppLink variant="button" href="/about">
              <Button
                icon={Icons.arrowRight}
                iconPosition="right"
                className="uppercase"
              >
                {LABELS.COMMON.LEARN_MORE}
              </Button>
            </AppLink>
          </div>
        </div>
      </AppContent>

      <AppContent className="flex flex-col gap-10">
        <ResearchList />
      </AppContent>
    </div>
  )
}

export default ResearchPage
