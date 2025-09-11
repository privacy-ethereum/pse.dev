"use client"

import { LABELS } from "@/app/labels"
import { ProjectCategory, ProjectInterface } from "@/lib/types"
import { uniq } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import Fuse from "fuse.js"
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useCallback,
} from "react"

export type ProjectSortBy = "random" | "asc" | "desc" | "relevance"
export type ProjectFilter =
  | "keywords"
  | "builtWith"
  | "themes"
  | "fundingSource"
export type FiltersProps = Record<ProjectFilter, string[]>
export const DEFAULT_PROJECT_SORT_BY: ProjectSortBy = "asc"

interface ProjectInterfaceScore extends ProjectInterface {
  score: number
}

export const SortByFnMapping: Record<
  ProjectSortBy,
  (a: ProjectInterfaceScore, b: ProjectInterfaceScore) => number
> = {
  random: () => Math.random() - 0.5,
  asc: (a, b) => a.name.localeCompare(b.name),
  desc: (a, b) => b.name.localeCompare(a.name),
  relevance: (a, b) => b?.score - a?.score,
}

export const FilterLabelMapping: Record<ProjectFilter, string> = {
  keywords: LABELS.COMMON.FILTER_LABELS.KEYWORDS,
  builtWith: LABELS.COMMON.FILTER_LABELS.BUILT_WITH,
  themes: LABELS.COMMON.FILTER_LABELS.THEMES,
  fundingSource: LABELS.COMMON.FILTER_LABELS.FUNDING_SOURCE,
}

interface ProjectsContextType {
  projects: ProjectInterface[]
  researchs: ProjectInterface[]
  graduatedProjects: ProjectInterface[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  filters: FiltersProps
  activeFilters: Partial<FiltersProps>
  queryString: string
  searchQuery: string
  sortBy: ProjectSortBy
  getProjectById: (id: string | number) => { project: ProjectInterface }
  toggleFilter: (params: {
    tag: ProjectFilter
    value: string
    searchQuery?: string
  }) => void
  setFilterFromQueryString: (filters: Partial<FiltersProps>) => void
  onFilterProject: (searchPattern: string) => void
  onSelectTheme: (theme: string, searchPattern?: string) => void
  sortProjectBy: (sortBy: ProjectSortBy) => void
  refetch: () => Promise<any>
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
)

const createURLQueryString = (params: Partial<FiltersProps>): string => {
  if (Object.keys(params)?.length === 0) return ""
  return Object.keys(params)
    .map((key: any) => `${key}=${encodeURIComponent((params as any)[key])}`)
    .join("&")
}

const filterProjects = ({
  searchPattern = "",
  activeFilters = {},
  findAnyMatch = false,
  projects: projectListItems = [],
}: {
  searchPattern?: string
  activeFilters?: Partial<FiltersProps>
  findAnyMatch?: boolean
  projects?: ProjectInterface[]
}) => {
  const projectList = projectListItems.map((project: any) => ({
    ...project,
    id: project?.id?.toLowerCase(),
  }))

  const keys = [
    "name",
    "tldr",
    "tags.themes",
    "tags.keywords",
    "tags.builtWith",
    "projectStatus",
  ]

  const tagsFiltersQuery: Record<string, string>[] = []

  Object.entries(activeFilters).forEach(([key, values]) => {
    values.forEach((value) => {
      if (!value) return
      tagsFiltersQuery.push({
        [`tags.${key}`]: value,
      })
    })
  })

  const noActiveFilters =
    tagsFiltersQuery.length === 0 && searchPattern.length === 0
  if (noActiveFilters) return projectList

  let query: any = {}

  if (findAnyMatch) {
    query = {
      $or: [...tagsFiltersQuery, { name: searchPattern }],
    }
  } else if (searchPattern?.length === 0) {
    query = {
      $and: [...tagsFiltersQuery],
    }
  } else if (tagsFiltersQuery.length === 0) {
    query = {
      name: searchPattern,
    }
  } else {
    query = {
      $and: [
        {
          $and: [...tagsFiltersQuery],
        },
        { name: searchPattern },
      ],
    }
  }

  const fuse = new Fuse(projectList, {
    threshold: 0.3,
    useExtendedSearch: true,
    includeScore: true,
    findAllMatches: true,
    distance: 200,
    keys,
  })

  const result = fuse.search(query)?.map(({ item, score }) => ({
    ...item,
    score,
  }))
  return result ?? []
}

const sortProjectByFn = ({
  projects = [],
  sortBy = DEFAULT_PROJECT_SORT_BY,
  category = null,
  ignoreCategories = [ProjectCategory.RESEARCH],
}: {
  projects: ProjectInterface[]
  sortBy?: ProjectSortBy
  category?: ProjectCategory | null
  ignoreCategories?: ProjectCategory[]
}) => {
  const sortedProjectList: ProjectInterface[] = [
    ...(projects as ProjectInterfaceScore[]),
  ]
    .sort(SortByFnMapping[sortBy])
    .filter(
      (project) =>
        !ignoreCategories
          ?.map((category) => category?.toLowerCase())
          .includes(project.category?.toLowerCase() as any)
    )

  if (category) {
    return sortedProjectList.filter(
      (project) => project.category?.toLowerCase() === category?.toLowerCase()
    )
  }

  return sortedProjectList
    .map((project: any) => ({
      id: project?.id?.toLowerCase(),
      ...project,
    }))
    .filter((project: any) => project?.graduated !== true)
}

const getProjectFilters = (projects: ProjectInterface[]): FiltersProps => {
  const filters: FiltersProps = {
    themes: ["play", "build", "research"],
    keywords: [],
    builtWith: [],
    fundingSource: [],
  }

  projects.forEach((project) => {
    if (project?.tags?.builtWith) {
      filters.builtWith.push(
        ...project.tags.builtWith.map((tag) => {
          if (typeof tag === "string") {
            return tag.toLowerCase()
          }
          return ""
        })
      )
    }

    if (project?.tags?.keywords) {
      filters.keywords.push(
        ...project.tags.keywords.map((keyword) =>
          typeof keyword === "string" ? keyword.toLowerCase() : ""
        )
      )
    }
  })

  Object.entries(filters).forEach(([key, entries]) => {
    filters[key as ProjectFilter] = uniq(entries)
  })

  return filters
}

async function fetchProjects(tag?: string) {
  try {
    const params = new URLSearchParams()
    if (tag) params.append("tag", tag)

    const response = await fetch(`/api/projects?${params.toString()}`, {
      cache: "default",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`)
    }

    const projects = await response.json()
    return projects || []
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw error
  }
}

interface ProjectsProviderProps {
  children: ReactNode
  tag?: string
}

export function ProjectsProvider({ children, tag }: ProjectsProviderProps) {
  const [sortBy, setSortBy] = useState<ProjectSortBy>(DEFAULT_PROJECT_SORT_BY)
  const [activeFilters, setActiveFilters] = useState<Partial<FiltersProps>>({})
  const [queryString, setQueryString] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const {
    data: fetchedProjects = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects", tag],
    queryFn: () => fetchProjects(tag),
  })

  const getProjectById = useCallback(
    (id: string | number) => {
      const project: ProjectInterface =
        fetchedProjects.filter(
          (project: ProjectInterface) =>
            String(project.id?.toLowerCase()) === id.toString().toLowerCase()
        )[0] ?? {}

      const content = project?.content

      return {
        project,
        content,
      }
    },
    [fetchedProjects]
  )

  const filters = useMemo(
    () => getProjectFilters(fetchedProjects),
    [fetchedProjects]
  )

  const filteredProjects = useMemo(
    () =>
      filterProjects({
        searchPattern: searchQuery,
        activeFilters,
        projects: fetchedProjects,
      }),
    [searchQuery, activeFilters, fetchedProjects]
  )

  const projects = useMemo(
    () =>
      sortProjectByFn({
        projects: filteredProjects,
        sortBy,
        ignoreCategories: [ProjectCategory.RESEARCH],
      }),
    [filteredProjects, sortBy]
  )

  const researchs = useMemo(
    () =>
      sortProjectByFn({
        projects: filteredProjects,
        sortBy,
        category: ProjectCategory.RESEARCH,
        ignoreCategories: [
          ProjectCategory.DEVTOOLS,
          ProjectCategory.APPLICATION,
        ],
      }),
    [filteredProjects, sortBy]
  )

  const graduatedProjects = useMemo(() => {
    return fetchedProjects.filter(
      (project: ProjectInterface) => project.graduated === true
    )
  }, [fetchedProjects])

  const toggleFilter = useCallback(
    ({
      tag: filterKey,
      value,
      searchQuery: search,
    }: {
      tag: ProjectFilter
      value: string
      searchQuery?: string
    }) => {
      if (!filterKey) return
      setActiveFilters((prevFilters) => {
        const values: string[] = prevFilters?.[filterKey] ?? []
        const index = values?.indexOf(value)
        const newValues = [...values]

        if (index > -1) {
          newValues.splice(index, 1)
        } else {
          newValues.push(value)
        }

        const activeFiltersNormalized = newValues.filter(Boolean)
        const newActiveFilters = {
          ...prevFilters,
          [filterKey]: activeFiltersNormalized,
        }

        setQueryString(createURLQueryString(newActiveFilters))
        if (search !== undefined) setSearchQuery(search)
        return newActiveFilters
      })
    },
    []
  )

  const onSelectTheme = useCallback((theme: string, searchPattern = "") => {
    setActiveFilters((prevFilters) => {
      const themes = prevFilters?.themes?.includes(theme) ? [] : [theme]
      const newActiveFilters = {
        ...prevFilters,
        themes,
      }
      setSearchQuery(searchPattern)
      return newActiveFilters
    })
  }, [])

  const onFilterProject = useCallback((searchPattern: string) => {
    setSearchQuery(searchPattern)
  }, [])

  const setFilterFromQueryString = useCallback(
    (filters: Partial<FiltersProps>) => {
      setActiveFilters(filters)
      setQueryString(createURLQueryString(filters))
    },
    []
  )

  const sortProjectBy = useCallback((newSortBy: ProjectSortBy) => {
    setSortBy(newSortBy)
  }, [])

  const contextValue = useMemo(
    () => ({
      projects,
      researchs,
      isLoading,
      isError,
      error: error as Error | null,
      filters,
      activeFilters,
      queryString,
      searchQuery,
      sortBy,
      getProjectById,
      toggleFilter,
      setFilterFromQueryString,
      onFilterProject,
      onSelectTheme,
      sortProjectBy,
      refetch,
      graduatedProjects,
    }),
    [
      projects,
      researchs,
      isLoading,
      isError,
      error,
      filters,
      activeFilters,
      queryString,
      searchQuery,
      sortBy,
      getProjectById,
      toggleFilter,
      setFilterFromQueryString,
      onFilterProject,
      onSelectTheme,
      sortProjectBy,
      refetch,
      graduatedProjects,
    ]
  )

  return (
    <ProjectsContext.Provider value={contextValue}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider")
  }
  return context
}
