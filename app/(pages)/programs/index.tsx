"use client"

import { LABELS } from "@/app/labels"
import { AppLink } from "@/components/app-link"
import { Banner } from "@/components/banner"
import { Card } from "@/components/cards/card"
import { TableRowCard } from "@/components/cards/table-row-card"
import { Divider } from "@/components/divider"
import { Icons } from "@/components/icons"
import { PageHeader } from "@/components/page-header"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn, interpolate } from "@/lib/utils"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { ReactNode } from "react-markdown/lib/ast-to-react"
import { twMerge } from "tailwind-merge"

type ProgramDetailProps = {
  region?: string
  title: ReactNode
  deadline?: string
  location?: string
  date: string
}

const SectionTitle = ({ label }: { label: string }) => {
  return (
    <span className="text-center font-display text-[32px] font-bold text-primary">
      {label}
    </span>
  )
}

const AccordionLabel = ({
  label,
  className,
}: {
  label: string
  className?: string
}) => {
  return (
    <span
      className={twMerge(
        "mx-auto text-center text-base font-bold uppercase tracking-[3.36px] text-primary",
        className
      )}
    >
      {label}
    </span>
  )
}

const ProgramDetail = ({
  title,
  location,
  date,
  region,
  deadline,
}: ProgramDetailProps) => {
  return (
    <div className="flex flex-col gap-4 text-center">
      <span className="font-display text-lg font-bold leading-none text-primary">
        {region} <br />
        {title}
      </span>

      {deadline && (
        <span className="font-sans text-xs font-normal italic text-tuatara-500 dark:text-whit">
          Application Deadline: {deadline}
        </span>
      )}

      {location && (
        <div className="mx-auto flex items-center gap-2">
          <Icons.location />
          <span className="font-sans text-xs font-normal text-primary">
            {location}
          </span>
        </div>
      )}
      <div className="mx-auto flex items-center gap-2">
        <Icons.calendar />
        <span className="font-sans text-xs font-normal text-primary">
          {date}
        </span>
      </div>
    </div>
  )
}

const ProgramSections = ["coreProgram", "accelerationProgram"] as const

export const ProgramPageContent = () => {
  const [activeId, setActiveId] = useState("")
  const [isManualScroll, setIsManualScroll] = useState(false)
  const SCROLL_OFFSET = -900
  const sectionsRef = useRef<NodeListOf<HTMLElement> | null>(null)

  const howToApply = LABELS.PROGRAMS_PAGE.HOW_TO_APPLY
  const coreProgramDescription = LABELS.PROGRAMS_PAGE.CORE_PROGRAM.DESCRIPTION
  const accelerationProgramDescription =
    LABELS.PROGRAMS_PAGE.ACCELERATION_PROGRAM.DESCRIPTION
  const curriculum = LABELS.PROGRAMS_PAGE.CURRICULUM

  useEffect(() => {
    if (sectionsRef.current === null)
      sectionsRef.current = document.querySelectorAll("div[data-section]")
    if (!activeId) setActiveId(ProgramSections?.[0] ?? "")

    const handleScroll = () => {
      if (isManualScroll) return

      sectionsRef.current?.forEach((section: any) => {
        const sectionTop = section.offsetTop - SCROLL_OFFSET
        if (window.scrollY >= sectionTop && window.scrollY > 0) {
          setActiveId(section.getAttribute("id"))
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [SCROLL_OFFSET, activeId, isManualScroll])

  const scrollToId = useCallback((id: string) => {
    const element = document.getElementById(id)
    const scrollTop = document.documentElement.scrollTop
    const rectViewportTop = element?.getBoundingClientRect()?.top ?? 0
    const top = rectViewportTop + scrollTop

    if (element) {
      setActiveId(id) // active clicked id
      setIsManualScroll(true) // tell the window event listener to ignore this scrolling
      window?.scrollTo({
        behavior: "smooth",
        top,
      })
    }

    setTimeout(() => setIsManualScroll(false), 800)
  }, [])

  const getSectionTitle = (sectionId: string) => {
    switch (sectionId) {
      case "coreProgram":
        return LABELS.PROGRAMS_PAGE.CORE_PROGRAM.TITLE
      case "accelerationProgram":
        return LABELS.PROGRAMS_PAGE.ACCELERATION_PROGRAM.TITLE
      default:
        return ""
    }
  }

  return (
    <Divider.Section className="flex flex-col">
      <div className="bg-second-gradient dark:bg-transparent-gradient">
        <PageHeader
          title={LABELS.PROGRAMS_PAGE.TITLE}
          subtitle={LABELS.PROGRAMS_PAGE.DESCRIPTION}
          image={
            <Image
              width={280}
              height={280}
              className="mx-auto h-[256px] w-[290px] lg:ml-auto lg:h-[428px] lg:w-[484px]"
              src="/images/programs.webp"
              alt=""
            />
          }
        />
      </div>
      <div className="relative flex w-full flex-col justify-center">
        <div className="sticky right-0 top-0 z-10 mx-auto flex w-full max-w-screen-3xl">
          <div
            id="sidebar"
            className="relative ml-auto hidden bg-background p-2 lg:block"
          >
            <div className="absolute right-0 mt-[80px] flex flex-col gap-4 lg:w-[220px] xl:w-[320px] xl:px-8">
              <h2 className="font-display text-lg font-bold text-secondary">
                {LABELS.COMMON.ON_THIS_PAGE}
              </h2>
              <ul className="text-normal font-sans text-primary">
                {ProgramSections.map((id: string) => {
                  const label = getSectionTitle(id)

                  if (!label) return null // no label for this section

                  const active = id === activeId

                  return (
                    <li
                      key={id}
                      onClick={() => {
                        scrollToId(id)
                      }}
                      data-id={id}
                      className={cn(
                        "flex h-8 cursor-pointer items-center border-l-2 border-l-anakiwa-200 px-3 duration-200",
                        {
                          "border-l-anakiwa-500 text-anakiwa-500 font-medium":
                            active,
                        }
                      )}
                    >
                      {label}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="relative z-0 flex w-full flex-col divide-y divide-tuatara-300 ">
          <div
            id="coreProgram"
            data-section="coreProgram"
            className="w-ful py-10 md:py-16"
          >
            <div className="mx-auto flex flex-col md:max-w-2xl">
              <div className="flex flex-col gap-8">
                <SectionTitle label={LABELS.PROGRAMS_PAGE.CORE_PROGRAM.TITLE} />
                <div className="flex flex-col">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card className="flex flex-col gap-10">
                      <ProgramDetail
                        region="LatAm"
                        title="Core Program"
                        deadline="Apr. 30, 2024"
                        location="Buenos Aires - Cuenca - San Jose"
                        date="Jul. 22, 2024 - Sep. 15, 2024"
                      />
                      <AppLink
                        href={siteConfig.links.coreProgram}
                        external
                        variant="button"
                      >
                        <Button className="w-full uppercase">
                          <div className="flex items-center gap-3">
                            <span>{LABELS.PROGRAMS_PAGE.COMMON.APPLY_NOW}</span>
                            <Icons.arrowRight size={20} />
                          </div>
                        </Button>
                      </AppLink>
                    </Card>
                    <Card className="flex flex-col gap-10">
                      <ProgramDetail
                        region="Asia"
                        title="Core Program"
                        deadline="Apr. 30, 2024"
                        location="Seoul - Taipei - Tokyo"
                        date="Jul. 29, 2024 - Sep. 22, 2024"
                      />
                      <AppLink
                        href={siteConfig.links.coreProgram}
                        external
                        variant="button"
                      >
                        <Button className="w-full uppercase">
                          <div className="flex items-center gap-3">
                            <span>{LABELS.PROGRAMS_PAGE.COMMON.APPLY_NOW}</span>
                            <Icons.arrowRight size={20} />
                          </div>
                        </Button>
                      </AppLink>
                    </Card>
                  </div>
                  <div className="flex flex-col gap-2 pt-8">
                    {coreProgramDescription?.map((description, index) => {
                      return (
                        <span
                          key={index}
                          className="font-sans text-base text-primary"
                        >
                          {description}
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-0 md:mt-4 md:gap-10">
                  <div className="flex flex-col gap-10">
                    <AccordionLabel
                      label={LABELS.PROGRAMS_PAGE.COMMON.CURRICULUM}
                    />
                    <TableRowCard
                      items={curriculum.map(({ TITLE, ITEMS }, index) => ({
                        title: (
                          <span>
                            {interpolate(LABELS.PROGRAMS_PAGE.COMMON.WEEK, {
                              week: index,
                            })}
                          </span>
                        ),
                        subtitle: TITLE,
                        items: ITEMS,
                      }))}
                    />
                  </div>

                  <div className="flex flex-col">
                    <AccordionLabel label="FAQ" />
                    <div className="pt-10">
                      <Accordion
                        id="faq"
                        className="!border-anakiwa-300"
                        size="xs"
                        items={LABELS.CORE_PROGRAM_FAQ.map(
                          ({ QUESTION: label, ANSWER: answer }, index) => {
                            return {
                              label,
                              value: index.toString(),
                              children: (
                                <span
                                  className="font-sans text-sm font-normal text-primary"
                                  dangerouslySetInnerHTML={{
                                    __html: answer?.toString() ?? "",
                                  }}
                                ></span>
                              ),
                            }
                          }
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col">
            <div
              id="accelerationProgram"
              data-section="accelerationProgram"
              className="mx-auto flex flex-col py-10 md:max-w-2xl md:py-16"
            >
              <div className="flex flex-col gap-5">
                <SectionTitle
                  label={LABELS.PROGRAMS_PAGE.ACCELERATION_PROGRAM.TITLE}
                />
                <Card className="flex flex-col gap-5">
                  <ProgramDetail
                    title={
                      <>
                        Acceleration Program <br />
                        Round 2
                      </>
                    }
                    deadline="May 31, 2024"
                    location="Remote Application"
                    date="June 1, 2024 - August 31, 2024"
                  />
                  <div className="mx-auto">
                    <AppLink
                      href={siteConfig.links.accelerationProgram}
                      external
                      variant="button"
                    >
                      <Button className="uppercase">
                        <div className="flex items-center gap-3">
                          {LABELS.PROGRAMS_PAGE.COMMON.LEARN_MORE_ON_GITHUB}
                          <Icons.arrowRight size={20} />
                        </div>
                      </Button>
                    </AppLink>
                  </div>
                </Card>
              </div>
              <div className="flex flex-col gap-2 pt-8">
                {accelerationProgramDescription?.map((description, index) => {
                  return (
                    <span
                      key={index}
                      className="font-sans text-base text-primary"
                    >
                      {description}
                    </span>
                  )
                })}
              </div>
              <div className="flex flex-col gap-0  pt-14 md:gap-10">
                <div className="flex flex-col">
                  <AccordionLabel label={LABELS.COMMON.HOW_TO_APPLY} />
                  <div className="mt-10">
                    <div className="flex flex-col gap-8 pb-10 md:pb-16">
                      <div id="howToApply" className="flex flex-col gap-8">
                        <div>
                          <span className="text-base font-medium text-primary">
                            {LABELS.PROGRAMS_PAGE.HOW_TO_APPLY.OPEN_TASKS.TITLE}
                          </span>
                          <ul className="list-decimal">
                            {howToApply.OPEN_TASKS.DESCRIPTION.map(
                              (task: string, index: number) => {
                                return (
                                  <li
                                    key={index}
                                    className="ml-8 list-item items-center"
                                  >
                                    <div
                                      className="text-primary"
                                      dangerouslySetInnerHTML={{
                                        __html: task,
                                      }}
                                    ></div>
                                  </li>
                                )
                              }
                            )}
                          </ul>
                        </div>
                        <div>
                          <span className="text-base font-medium text-primary">
                            {
                              LABELS.PROGRAMS_PAGE.HOW_TO_APPLY.SUBMIT_IDEA
                                .TITLE
                            }
                          </span>
                          <ul className="list-decimal">
                            {howToApply.SUBMIT_IDEA.DESCRIPTION.map(
                              (task: string, index: number) => {
                                return (
                                  <li
                                    key={index}
                                    className="ml-8 list-item items-center"
                                  >
                                    <div
                                      className="text-tuatara-95"
                                      dangerouslySetInnerHTML={{
                                        __html: task,
                                      }}
                                    ></div>
                                  </li>
                                )
                              }
                            )}
                          </ul>
                        </div>
                        <span className="text-base text-primary">
                          {LABELS.PROGRAMS_PAGE.HOW_TO_APPLY.DESCRIPTION}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <AccordionLabel label="FAQ" />
                  <div className="mt-10 flex flex-col gap-8">
                    <Accordion
                      className="!border-anakiwa-300"
                      size="xs"
                      items={LABELS.ACCELERATION_PROGRAM_FAQ.map(
                        ({ QUESTION: label, ANSWER: answer }, index) => {
                          return {
                            label,
                            value: index.toString(),
                            children: (
                              <span className="flex flex-col gap-3 text-base text-primary">
                                {typeof answer === "string"
                                  ? answer
                                  : answer.map((item, index) => {
                                      return <span key={index}>{item}</span>
                                    })}
                              </span>
                            ),
                          }
                        }
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Banner
        title={LABELS.COMMON.LEARN_MORE}
        subtitle={LABELS.COMMON.LEARN_MORE_DISCORD}
      >
        <AppLink href={siteConfig.links.discord} external passHref>
          <Button>
            <div className="flex items-center gap-2">
              <Icons.discord fill="white" className="h-4" />
              <span className="text-[14px] uppercase">
                {LABELS.COMMON.JOIN_OUR_DISCORD}
              </span>
              <Icons.externalUrl fill="white" className="h-5" />
            </div>
          </Button>
        </AppLink>
      </Banner>
    </Divider.Section>
  )
}
