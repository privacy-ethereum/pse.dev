"use client"

import React, { ReactNode } from "react"
import * as RadixAccordion from "@radix-ui/react-accordion"

import { cn } from "@/lib/utils"

import { Icons } from "../icons"

interface AccordionItemProps {
  label: ReactNode
  children?: React.ReactNode
  value: string
}

type AccordionPadding = "xs" | "sm"

interface AccordionProps {
  type?: "single" | "multiple"
  size?: AccordionPadding
  defaultValue?: string
  items: AccordionItemProps[]
  className?: string
  iconOnHover?: boolean
  id?: string
}

const AccordionSizeMapping: Record<AccordionPadding, string> = {
  xs: "pt-4",
  sm: "py-6",
}

const Accordion = ({
  type = "multiple",
  id,
  defaultValue,
  items,
  size = "sm",
  className,
  iconOnHover = true,
}: AccordionProps) => {
  const groupName = id ? `group/${id}` : "group"

  return (
    <RadixAccordion.Root
      className={cn("accordion", {
        "hover-icon": iconOnHover,
      })}
      type={type as any}
      defaultValue={defaultValue}
      collapsible={true}
    >
      {items?.map(({ label, children, value }, accordionIndex) => (
        <RadixAccordion.Item
          className={cn(groupName, {
            "pb-4": size === "xs",
          })}
          value={value}
          key={accordionIndex}
        >
          <RadixAccordion.Trigger className="w-full">
            <div
              className={cn(
                "relative grid w-full grid-cols-[1fr_20px] items-center justify-between border-t border-t-primary ring-0 focus:outline-none md:grid-cols-[1fr_30px]",
                className,
                {
                  [AccordionSizeMapping.xs]: size === "xs",
                  [AccordionSizeMapping.sm]: size === "sm",
                }
              )}
            >
              {size === "sm" ? (
                <span className="block text-left font-sans text-base font-bold uppercase tracking-[3.36px] text-primary md:text-xl md:tracking-[4.2px]">
                  {label}
                </span>
              ) : (
                <span className="text-left font-sans text-base font-medium text-primary">
                  {label}
                </span>
              )}
              <div
                className={cn("absolute right-0 flex items-center", {
                  "top-[10px]": size === "xs",
                })}
              >
                <Icons.plus
                  data-icon="plus"
                  className={cn("duration-200", {
                    "w-4 md:w-6": size === "xs",
                    "w-4 md:w-8": size === "sm",
                  })}
                />
                <Icons.minus
                  data-icon="minus"
                  className={cn({
                    "w-4 md:w-6": size === "xs",
                    "w-4 md:w-8": size === "sm",
                  })}
                />
              </div>
            </div>
          </RadixAccordion.Trigger>
          <RadixAccordion.Content className="overflow-hidden pt-2 transition-transform group-data-[state=closed]:animate-slide-up group-data-[state=open]:animate-slide-down">
            {children}
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  )
}

Accordion.displayName = "Accordion"

export { Accordion }
