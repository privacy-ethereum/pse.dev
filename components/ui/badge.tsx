import React, { HtmlHTMLAttributes } from "react"

interface BadgeProps extends HtmlHTMLAttributes<HTMLDivElement> {
  value?: number | string
}

export default function Badge({ value, children }: BadgeProps) {
  if (!value) return <>{children}</>

  return (
    <div className="relative">
      <div className="min-w-4 absolute right-[-5px] top-[-5px] m-auto flex h-4 items-center justify-center rounded-full bg-anakiwa-950 px-[6px] dark:bg-anakiwa-400">
        <span className="text-xs text-white dark:text-black">{value}</span>
      </div>
      {children}
    </div>
  )
}
