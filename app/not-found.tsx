"use client"

import "@/globals.css"
import { LABELS } from "./labels"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import React from "react"

export const metadata: Metadata = {
  title: "404: Page Not Found",
}

export default function NotFound() {
  return (
    <div className="relative flex h-screen flex-col bg-anakiwa-50 dark:bg-black">
      <div className="container m-auto">
        <div className="-mt-16 flex flex-col gap-7">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex flex-col gap-2">
              <Image
                width={176}
                height={256}
                src="/icons/404-search.svg"
                alt="emotion sad"
                className="mx-auto h-12 w-12 text-anakiwa-400 md:h-64 md:w-44"
              />
            </div>
            <div className="flex flex-col gap-5">
              <span className="font-display text-2xl font-bold text-primary md:text-6xl">
                {LABELS.COMMON.ERROR["404"].TITLE}
              </span>
              <span className="font-sans text-base font-normal md:text-lg">
                {LABELS.COMMON.ERROR["404"].DESCRIPTION}
              </span>
            </div>
          </div>
          <Link href="/" className="mx-auto">
            <Button variant="black" className="uppercase">
              {LABELS.COMMON.GO_TO_HOME}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
