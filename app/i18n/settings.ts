import type { InitOptions } from "i18next"

import { siteConfig } from "@/site-config"

export const fallbackLng = "en"

export const defaultNS = "translation"
export const cookieName = "i18next"

interface Language {
  key: string
  label: string
  enabled?: boolean
}

/**
 * List of languages
 * @param key - language key
 * @param label - language label
 * @param enabled - enable or disable language (when disabled, it will not be shown in the language switcher)
 */
export const languageList: Language[] = [
  {
    key: "en",
    label: "English",
    enabled: true,
  },
  {
    key: "es",
    label: "Español",
    enabled: true,
  },
  {
    key: "zh-TW",
    label: "正體中文",
    enabled: true,
  },
  {
    key: "it",
    label: "Italiano",
    enabled: true,
  },
  {
    key: "vi",
    label: "Tiếng Việt",
    enabled: true,
  },
  {
    key: "ko",
    label: "한국어",
    enabled: false,
  },
  {
    key: "fr",
    label: "Français",
    enabled: true,
  },
  {
    key: "de",
    label: "Deutsch",
    enabled: true,
  },
  {
    key: "ja",
    label: "日本語",
    enabled: true,
  },
  {
    key: "ar",
    label: "Arabic",
    enabled: false,
  },
  {
    key: "zh-CN",
    label: "中文",
    enabled: false,
  },
]

// list of language keys based on the languageList
const languageKeys = languageList
  .map((item) => item.key)
  .filter((item) => item !== fallbackLng)

export const languages = [fallbackLng, ...languageKeys] as const

export type LocaleTypes = (typeof languages)[number]

// list of only enabled languages
export const enabledLanguagesItems: { label: string; value: string }[] =
  languageList
    .filter((item) =>
      siteConfig.showOnlyEnabledLanguages ? item.enabled : true
    )
    .map(({ key: value, label }) => {
      return {
        label,
        value,
      }
    }) ?? []

export function getOptions(lng = fallbackLng, ns = defaultNS): InitOptions {
  return {
    debug: false,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}
