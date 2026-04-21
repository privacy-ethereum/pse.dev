import { ProjectStatus } from "@/lib/types"

export type IThemeStatus = Partial<
  Record<
    ProjectStatus,
    {
      label: string
      icon: any
    }
  >
>

export type IThemesButton = Record<
  string,
  {
    label: string
    icon: any
  }
>
