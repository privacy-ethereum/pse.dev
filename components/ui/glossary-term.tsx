"use client"

import { useState } from "react"
import { findGlossaryTerm, GlossaryEntry } from "@/data/glossary"
import { cn } from "@/lib/utils"

interface GlossaryTermProps {
  /** The term to look up in the glossary */
  term: string
  /** Optional: custom text to display (defaults to the term) */
  children?: React.ReactNode
  /** Optional: custom definition (overrides glossary lookup) */
  definition?: string
  /** Optional: additional CSS classes */
  className?: string
}

export function GlossaryTerm({
  term,
  children,
  definition: customDefinition,
  className,
}: GlossaryTermProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Look up term in glossary
  const glossaryEntry = findGlossaryTerm(term)
  const definition = customDefinition || glossaryEntry?.definition
  const displayTerm = glossaryEntry?.term || term

  // If no definition found, just render the text without tooltip
  if (!definition) {
    return <span className={className}>{children || term}</span>
  }

  return (
    <span
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* The term with dotted underline to indicate it's interactive */}
      <span className="border-b border-dotted border-anakiwa-500 dark:border-anakiwa-400 cursor-help">
        {children || term}
      </span>

      {/* Tooltip popup */}
      {isVisible && (
        <span
          role="tooltip"
          className={cn(
            "absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2",
            "w-64 p-3 rounded-lg shadow-lg",
            "bg-white dark:bg-anakiwa-950",
            "border border-tuatara-200 dark:border-anakiwa-800",
            "text-sm text-tuatara-700 dark:text-tuatara-200",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          {/* Arrow */}
          <span
            className={cn(
              "absolute top-full left-1/2 -translate-x-1/2",
              "border-8 border-transparent border-t-white dark:border-t-anakiwa-950",
              "drop-shadow-sm"
            )}
          />

          {/* Term title */}
          <span className="block font-semibold text-tuatara-900 dark:text-white mb-1">
            {displayTerm}
          </span>

          {/* Category badge */}
          {glossaryEntry?.category && (
            <span className="inline-block px-2 py-0.5 mb-2 text-xs rounded-full bg-anakiwa-100 dark:bg-anakiwa-900 text-anakiwa-700 dark:text-anakiwa-300">
              {glossaryEntry.category}
            </span>
          )}

          {/* Definition */}
          <span className="block leading-relaxed">
            {definition}
          </span>
        </span>
      )}
    </span>
  )
}
