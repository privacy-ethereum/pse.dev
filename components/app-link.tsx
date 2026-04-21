"use client"

import { Icons } from "./icons"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import Link from "next/link"
import React from "react"

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  href: string
  to?: string
  external?: boolean
  withExternalIcon?: boolean
  variant?: "default" | "blue" | "button" | "nav"
  passHref?: boolean
}

const linkClass = cva("inline-flex", {
  variants: {
    variant: {
      default:
        "text-black dark:text-white hover:text-orange duration-200 underline",
      blue: "text-anakiwa-500 hover:text-anakiwa-700",
      nav: "text-tuatara-100 hover:text-anakiwa-400 duration-200",
      button: "flex",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

/**
 * This component easily manages internal and external links and adds the necessary attributes.
 *
 * @param {string} href - The URL of the link.
 * @param {React.ReactNode} children - The content of the link.
 * @param {boolean} external - If the link is external, in this case it will open in a new tab and also add rel="noreferrer noopener nofollow".
 */
export const AppLink = ({
  href,
  children,
  external,
  className,
  withExternalIcon = false,
  variant = "default",
  passHref = false,
  ...props
}: LinkProps) => {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className={cn(linkClass({ variant }), className)}
      rel={external ? "noreferrer noopener nofollow" : undefined}
      passHref={passHref}
      {...props}
    >
      <div className={cn("flex items-center gap-0.5")}>
        {children}
        {withExternalIcon && external && <Icons.externalPageUrl />}
      </div>
    </Link>
  )
}
