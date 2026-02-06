"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  completion: number
  color: string
  className?: string
}

export function ProgressBar({ completion, color, className }: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="h-2 rounded-full bg-tuatara-100 dark:bg-tuatara-700 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${completion}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
