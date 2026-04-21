"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import {
  useGlobalSearch,
  useIndexSearch,
  filterSearchHitsByTerm,
  useSearchConfig,
} from "@/hooks/useGlobalSearch"
import { CategoryTag } from "../ui/categoryTag"
import { Markdown } from "../ui/markdown"
import React from "react"

interface SearchModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

interface SearchHit {
  objectID: string
  title?: string
  name?: string
  content?: string
  description?: string
  excerpt?: string
  url?: string
  locale?: string
  section?: string
  category?: string
  type?: string
  path?: string
  hierarchy?: {
    lvl0?: string
    [key: string]: string | undefined
  }
  [key: string]: any
}

interface IndexResult {
  indexName: string
  hits: SearchHit[]
}

function Hit({
  hit,
  setOpen,
  indexName,
}: {
  hit: SearchHit
  setOpen: (open: boolean) => void
  indexName?: string
}) {
  const url = hit.url || `/${hit.locale || "en"}/blog/${hit.objectID}`

  const title =
    hit.title || hit.name || hit.hierarchy?.lvl0 || "Untitled Result"

  const section =
    hit.section ||
    hit.category ||
    hit.type ||
    hit.hierarchy?.lvl0 ||
    (hit.path && hit.path.split("/")[0]) ||
    indexName ||
    "General"

  const content = hit.content || hit.description || hit.excerpt || ""

  const snippet =
    content.length > 200
      ? content.substring(0, 200).replace(/\S+$/, "") + "..."
      : content

  return (
    <Link
      href={url}
      className="block p-4 mb-2 bg-background hover:bg-gray-100 rounded-md shadow-sm border border-gray-200 text-black dark:border-anakiwa-800 dark:hover:bg-anakiwa-400/10"
      onClick={() => setOpen(false)}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <CategoryTag variant="blue">{section}</CategoryTag>
      </div>
      {snippet && (
        <Markdown
          components={{
            h1: ({ children }) => null,
            h2: ({ children }) => null,
            h3: ({ children }) => null,
            h4: ({ children }) => null,
            h5: ({ children }) => null,
            h6: ({ children }) => null,
            img: ({ src, alt }) => null,
            a: ({ href, children }) => {
              let textContent = ""

              React.Children.forEach(children, (child) => {
                if (typeof child === "string") {
                  textContent += child
                } else if (React.isValidElement(child)) {
                  const childText = child.props?.children
                  if (typeof childText === "string") {
                    textContent += childText
                  }
                }
              })

              return (
                <span className="text-secondary font-sans text-lg font-normal">
                  {textContent}
                </span>
              )
            },
          }}
        >
          {snippet}
        </Markdown>
      )}
    </Link>
  )
}

function NoResults() {
  return (
    <div className="text-center p-8 text-gray-500 dark:text-white">
      No results found. Try a different search term.
    </div>
  )
}

const LoadingIndicator = () => {
  return (
    <div className="h-12 w-full rounded-md bg-skeleton animate-pulse border border-gray-300 dark:bg-anakiwa-800 dark:border-anakiwa-700"></div>
  )
}

function DirectSearchResults({
  query,
  setOpen,
}: {
  query: string
  setOpen: (open: boolean) => void
}) {
  const { data, isLoading, isError, error } = useGlobalSearch({ query })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <LoadingIndicator />
        <LoadingIndicator />
        <LoadingIndicator />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-red-500">
        Error: {error.message || "Search failed"}
      </div>
    )
  }

  if (!data || data.results.length === 0) {
    return <NoResults />
  }

  return (
    <div>
      {data.results.map((indexResult: IndexResult) => (
        <div key={indexResult.indexName}>
          {indexResult.hits.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 dark:text-white">
                {indexResult.indexName}
              </div>
              {indexResult.hits.map((hit: SearchHit) => (
                <Hit
                  key={hit.objectID}
                  hit={hit}
                  setOpen={setOpen}
                  indexName={indexResult.indexName}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function IndexSearchResults({
  query,
  indexName,
  setOpen,
}: {
  query: string
  indexName: string
  setOpen: (open: boolean) => void
}) {
  const { data, isLoading, isError, error, refetch } = useIndexSearch({
    query,
    indexName,
  })

  if (query.trim() === "") {
    return (
      <div className="text-center p-2 text-gray-400">
        Enter a search term to begin
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <LoadingIndicator />
        <LoadingIndicator />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center text-sm text-red-500">
        Error searching {indexName}
        <button
          onClick={() => refetch()}
          className="block mx-auto mt-2 text-sm text-blue-500 hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!data || data.hits.length === 0) {
    return (
      <div className="text-center text-sm text-gray-400">
        No results in {indexName}
      </div>
    )
  }

  // Apply special filtering for certain terms
  const hits = query.toLowerCase().includes("intmax")
    ? filterSearchHitsByTerm(data.hits, "intmax")
    : data.hits

  if (hits.length === 0) {
    return (
      <div className="text-center text-sm text-gray-400">
        No matches for &quot;{query}&quot; in {indexName}
      </div>
    )
  }

  return (
    <div>
      {hits.map((hit: SearchHit) => (
        <Hit
          key={hit.objectID}
          hit={hit}
          setOpen={setOpen}
          indexName={indexName}
        />
      ))}
    </div>
  )
}

const CustomSearchResult = ({
  results,
  setOpen,
}: {
  results: IndexResult[]
  setOpen: (open: boolean) => void
}) => (
  <div>
    {results.map((indexResult: IndexResult) => (
      <div key={indexResult.indexName} className="mb-6">
        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 dark:text-white">
          {indexResult.indexName.replace(/-/g, " ")}
        </div>
        <div>
          {indexResult.hits.map((hit: SearchHit) => (
            <Hit
              key={hit.objectID}
              hit={hit}
              setOpen={setOpen}
              indexName={indexResult.indexName}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
)

const MultiIndexSearchView = ({
  searchQuery,
  setOpen,
}: {
  searchQuery: string
  setOpen: (open: boolean) => void
}) => {
  const { allIndexes } = useSearchConfig()

  if (searchQuery.trim() === "") {
    return (
      <div className="text-center p-8 text-gray-500 dark:text-white">
        Enter a search term to begin
      </div>
    )
  }

  // Filter out empty indexes to prevent rendering issues
  const visibleIndexes = allIndexes.filter(
    (index: string) => index && index.trim() !== ""
  )

  if (visibleIndexes.length === 0) {
    return <DirectSearchResults query={searchQuery} setOpen={setOpen} />
  }

  // Sort indexes to ensure projects appear first, followed by blog
  const sortedIndexes = [...visibleIndexes].sort((a, b) => {
    if (a.toLowerCase().includes("project")) return -1
    if (b.toLowerCase().includes("project")) return 1

    if (a.toLowerCase().includes("blog")) return 1
    if (b.toLowerCase().includes("blog")) return -1

    return a.localeCompare(b)
  })

  return (
    <div>
      {sortedIndexes.map((indexName: string) => (
        <div key={indexName} className="mb-6">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 dark:text-white">
            {indexName.replace(/-/g, " ")}
          </div>
          <IndexSearchResults
            query={searchQuery}
            indexName={indexName}
            setOpen={setOpen}
          />
        </div>
      ))}
    </div>
  )
}

export const SearchModal = ({ open, setOpen }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [directSearchMode, setDirectSearchMode] = useState(false)
  const { allIndexes } = useSearchConfig()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault()
        setOpen(!open)
      }
      if (event.key === "Escape" && open) {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, setOpen])

  useEffect(() => {
    if (!open) {
      setSearchQuery("")
    }
  }, [open])

  if (allIndexes.length === 0) {
    return null
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      className="bg-page-header-gradient dark:bg-transparent-gradient"
    >
      <div className="pt-8">
        <Input
          type="text"
          placeholder="Search projects, blog posts, research papers..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="w-full p-2 text-black"
          disabled={directSearchMode}
          autoFocus
        />
      </div>
      <div className="max-h-[80vh] lg:max-h-[60vh] overflow-y-auto mt-4">
        {directSearchMode ? (
          <DirectSearchResults query={searchQuery} setOpen={setOpen} />
        ) : (
          <MultiIndexSearchView searchQuery={searchQuery} setOpen={setOpen} />
        )}
      </div>
    </Modal>
  )
}
