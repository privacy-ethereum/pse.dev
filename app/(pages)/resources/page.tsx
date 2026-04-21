import Link from "next/link"

import { interpolate } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import { LABELS } from "@/app/labels"

import { Banner } from "@/components/banner"
import { Divider } from "@/components/divider"
import { Icons } from "@/components/icons"
import { AppContent } from "@/components/ui/app-content"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import ResourcesContent from "@/content/resources.md"
import { Metadata } from "next"
import { ResourceNav } from "@/components/resources/ResourceNav"
import { AppLink } from "@/components/app-link"

export const metadata: Metadata = {
  title: "Resources",
  description: "Resources for the Privacy Stewards of Ethereum community",
}

interface ResourceItemProps {
  label: string
  icon?:
    | "globe"
    | "discord"
    | "twitter"
    | "gitHub"
    | "notion"
    | "figma"
    | "drive"
  description: string
  url: string
}

interface ResourceCardProps {
  id?: string
  title: string
  children?: React.ReactNode
}

const ResourceItem = ({
  label,
  icon = "globe",
  description,
  url,
}: ResourceItemProps) => {
  const Icon = Icons?.[icon as keyof typeof Icons] ?? Icons.globe

  return (
    <Link
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="group pb-3 duration-500 group-hover:transition self-start"
    >
      <div className="flex items-center gap-1">
        <div className="flex space-x-3 items-center">
          <div className="h-6 w-6 text-anakiwa-500 opacity-50 transition group-hover:text-primary group-hover:opacity-100">
            <Icon />
          </div>
          <span className="text-lg font-medium duration-200 group-hover:text-orange leading-none">
            {label}
          </span>
        </div>
        <Icons.externalUrl className="text-primary transition duration-200 group-hover:text-orange" />
      </div>
      <div className="p-[2px]"></div>
      <p className="text-sm text-tuatara-500 dark:text-anakiwa-50">
        {description}
      </p>
    </Link>
  )
}

const ResourceCard = ({ id, title, children }: ResourceCardProps) => {
  return (
    <div
      id={id}
      data-section={id}
      className="mx-auto flex max-w-[644px] flex-col rounded-lg"
    >
      <Label.Section label={title} className="pb-8 text-center" />
      <div className="mb-4 grid gap-6 rounded-lg border border-tuatara-300 bg-anakiwa-100 px-10 py-8 dark:border-anakiwa-800 dark:bg-black dark:text-white">
        {children}
      </div>
    </div>
  )
}

export default function ResourcePage() {
  return (
    <div className="flex flex-col">
      <div className="w-full bg-page-header-gradient dark:bg-transparent-gradient">
        <AppContent className="flex flex-col gap-4 py-10 w-full">
          <Label.PageTitle label={LABELS.RESOURCES_PAGE.TITLE} />
          <h6 className="font-sans text-base font-normal text-primary md:text-[18px] md:leading-[27px] md:max-w-[700px]">
            {LABELS.RESOURCES_PAGE.SUBTITLE}
          </h6>
          <AppLink
            href={siteConfig.addGithubResource}
            variant="button"
            external
            passHref
          >
            <Button className="w-full md:w-auto" size="lg">
              <div className="flex items-center gap-1">
                <Icons.discord size={18} />
                <span className="pl-2 text-left text-sm font-medium uppercase">
                  {LABELS.COMMON.ADD_RESOURCE}
                </span>
                <Icons.externalUrl size={22} />
              </div>
            </Button>
          </AppLink>
        </AppContent>
      </div>
      <Divider.Section className="bg-background">
        <div className="flex justify-center">
          <AppContent className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[3fr_1fr] md:pb-20 lg:grid-cols-[4fr_1fr]">
            <div className="flex flex-col gap-6">
              <article className="flex flex-col space-y-8 ">
                <ResourcesContent
                  components={{
                    ResourceItem: (props: ResourceItemProps) => (
                      <ResourceItem {...props} />
                    ),
                    ResourceCard: (props: ResourceCardProps) => (
                      <ResourceCard {...props} />
                    ),
                  }}
                />
              </article>
            </div>
            <section className="relative hidden md:block ">
              <div className="sticky right-0 top-16 ml-auto">
                <ResourceNav />
              </div>
            </section>
          </AppContent>
        </div>
        <Banner
          title={
            <h3 className="py-2 font-display text-[18px] font-bold text-primary md:text-3xl">
              {LABELS.RESOURCES_PAGE.ADD_RESOURCE_QUESTION}
            </h3>
          }
        >
          <div className="pb-6"></div>
          <AppLink
            href={siteConfig.links.discord}
            className="w-fit mx-auto"
            external
            variant="button"
          >
            <Button>
              <div className="flex items-center gap-1">
                <Icons.discord size={18} />
                <span className="text-[14px] uppercase">
                  {interpolate(LABELS.COMMON.CONNECT_WITH_US_ON_PLATFORM, {
                    platform: "Discord",
                  })}
                </span>
                <Icons.externalUrl size={20} />
              </div>
            </Button>
          </AppLink>
        </Banner>
      </Divider.Section>
    </div>
  )
}
