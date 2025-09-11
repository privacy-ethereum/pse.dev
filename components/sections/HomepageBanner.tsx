"use client"

import { AppLink } from "../app-link"
import { Banner } from "../banner"
import { Icons } from "../icons"
import { Button } from "../ui/button"
import { LABELS } from "@/app/labels"
import { siteConfig } from "@/config/site"

export const HomepageBanner = () => {
  return (
    <Banner
      title={LABELS.COMMON.CONNECT_WITH_US}
      subtitle={LABELS.COMMON.CONNECT_WITH_US_DESCRIPTION}
    >
      <div className="flex flex-col">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 lg:text-left text-center mx-auto">
          <div className="flex flex-col gap-4 lg:gap-12 w-full lg:max-w-[430px] p-10 rounded-[10px] bg-white border border-anakiwa-300 dark:border-anakiwa-400  dark:bg-anakiwa-975 transition-all">
            <div className="flex flex-col gap-[10px]">
              <span className="font-sans text-xl font-medium text-tuatara-950 dark:text-anakiwa-400">
                {LABELS.HOMEPAGE.LEARN_AND_CONNECT.TITLE}
              </span>
              <span className="font-sans text-base font-normal text-tuatara-500 dark:text-tuatara-100 ">
                {LABELS.HOMEPAGE.LEARN_AND_CONNECT.DESCRIPTION}
              </span>
            </div>
            <AppLink
              href={siteConfig.links.researchAndDevelopmentDiscord}
              rel="noreferrer noopener"
              variant="nav"
              external
              className="mx-auto"
            >
              <Button className="lg:w-full mx-auto lg:text-lg !text-xs">
                <div className="flex items-center gap-2">
                  <Icons.discord fill="white" className="h-4" />
                  <span className="uppercase">
                    {LABELS.HOMEPAGE.LEARN_AND_CONNECT.ACTION}
                  </span>
                  <Icons.externalUrl fill="white" className="h-5" />
                </div>
              </Button>
            </AppLink>
          </div>
          <div className="flex flex-col gap-4 lg:gap-12 w-full lg:max-w-[430px] p-10 rounded-[10px] bg-white border border-anakiwa-300 dark:border-anakiwa-400  dark:bg-anakiwa-975 transition-all">
            <div className="flex flex-col gap-[10px]">
              <span className="font-sans text-xl font-medium text-tuatara-950 dark:text-anakiwa-400">
                {LABELS.HOMEPAGE.COLLABORATE_AND_CONTRIBUTE.TITLE}
              </span>
              <span className="font-sans text-base font-normal text-tuatara-500 dark:text-tuatara-100 ">
                {LABELS.HOMEPAGE.COLLABORATE_AND_CONTRIBUTE.DESCRIPTION}
              </span>
            </div>
            <AppLink
              href={siteConfig.links.magicians}
              rel="noreferrer noopener"
              variant="nav"
              external
              className="mx-auto"
            >
              <Button className="lg:w-full mx-auto lg:text-lg !text-xs">
                <div className="flex items-center gap-2">
                  <Icons.discord fill="white" className="h-4" />
                  <span className="uppercase">
                    {LABELS.HOMEPAGE.COLLABORATE_AND_CONTRIBUTE.ACTION}
                  </span>
                  <Icons.externalUrl fill="white" className="h-5" />
                </div>
              </Button>
            </AppLink>
          </div>
        </div>
      </div>
    </Banner>
  )
}
