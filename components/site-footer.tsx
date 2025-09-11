"use client"

import { AppLink } from "./app-link"
import { Icons } from "./icons"
import { AppContent } from "./ui/app-content"
import { LABELS } from "@/app/labels"
import { siteConfig } from "@/config/site"
import { useAppSettings } from "@/hooks/useAppSettings"
import { cn } from "@/lib/utils"
import { NavItem } from "@/types/nav"

const ItemLabel = ({
  label,
  external = false,
  icon,
}: {
  label: string
  external?: boolean
  icon?: React.ReactNode
}) => {
  return (
    <div className="group flex items-center gap-2">
      {external && (
        <Icons.externalUrl className="text-white w-5 duration-200 group-hover:text-anakiwa-400" />
      )}
      {icon && (
        <div className="text-white group-hover:text-anakiwa-400">{icon}</div>
      )}
      <span className="mt-[0.9px] font-sans text-sm font-normal uppercase leading-[21px] text-white duration-200 group-hover:text-anakiwa-400 md:block">
        {label}
      </span>
    </div>
  )
}

const LinksWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>
}

export function SiteFooter() {
  const { MAIN_NAV } = useAppSettings()

  return (
    <footer className="flex flex-col">
      <div className="bg-tuatara-950 text-white py-8 text-left text-[14px] dark:bg-black">
        <AppContent className="flex flex-col lg:flex-row gap-10 py-2 lg:gap-24 justify-center">
          <LinksWrapper>
            {MAIN_NAV.map(
              (
                { title, href, external = false, onlyHeader }: NavItem,
                indexKey
              ) =>
                !onlyHeader && (
                  <AppLink
                    key={indexKey}
                    href={href}
                    external={external}
                    variant="button"
                  >
                    <ItemLabel label={title} />
                  </AppLink>
                )
            )}
          </LinksWrapper>
          <LinksWrapper>
            <AppLink
              href={siteConfig.links.discord}
              className="flex items-start gap-2"
              variant="button"
              external
            >
              <ItemLabel
                label="Discord"
                icon={<Icons.discord className="w-4" />}
              />
            </AppLink>
            <AppLink
              href={siteConfig.links.github}
              className="flex items-start gap-2"
              variant="button"
              external
            >
              <ItemLabel
                label="Github"
                icon={<Icons.gitHub className="w-4" />}
              />
            </AppLink>
            <AppLink
              href={siteConfig.links.twitter}
              className="flex items-center gap-2"
              variant="button"
              external
            >
              <ItemLabel
                label="Twitter"
                icon={
                  <div className="w-4">
                    <Icons.twitter className="w-full" />
                  </div>
                }
              />
            </AppLink>
            <AppLink
              href={siteConfig.links.youtube}
              className="flex items-center gap-2"
              variant="button"
              external
            >
              <ItemLabel
                label="Youtube"
                icon={
                  <div className="w-4">
                    <Icons.youtube className="w-full" />
                  </div>
                }
              />
            </AppLink>
            <AppLink
              href="/api/rss"
              className="flex items-center gap-2"
              variant="button"
              external
            >
              <ItemLabel
                label="RSS"
                icon={
                  <div className="w-4">
                    <Icons.rss className="w-full" />
                  </div>
                }
              />
            </AppLink>
            <AppLink
              href={siteConfig.links.jobs}
              variant="button"
              external
              className="flex items-center gap-2"
            >
              <ItemLabel label="Jobs" external />
            </AppLink>
          </LinksWrapper>
          <LinksWrapper>
            <AppLink href={siteConfig.links.discord} external variant="button">
              <ItemLabel label="Feedback" />
            </AppLink>
            <AppLink
              href={siteConfig.links.privacyPolicy}
              external
              variant="button"
            >
              <ItemLabel label={LABELS.COMMON.FOOTER.PRIVACY_POLICY} />
            </AppLink>
            <AppLink
              href={siteConfig.links.termOfUse}
              external
              variant="button"
            >
              <ItemLabel label={LABELS.COMMON.FOOTER.TERMS_OF_USE} />
            </AppLink>
          </LinksWrapper>
        </AppContent>
      </div>
    </footer>
  )
}
