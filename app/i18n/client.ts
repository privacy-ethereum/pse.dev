'use client'

import { useEffect, useState } from 'react'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import { useCookies } from 'react-cookie'
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from 'react-i18next'

import { LocaleTypes, cookieName, getOptions, languages } from './settings'

const runsOnServerSide = typeof window === 'undefined'

//
export const i18n = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getOptions(),
    debug: false,
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? languages : [],
  })

export function useTranslation(
  lng: LocaleTypes | string,
  ns: string,
  options = {}
) {
  const [cookies, setCookie] = useCookies([cookieName ?? 'i18next'])
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng)
  } else {
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return
      setActiveLng(i18n.resolvedLanguage)
    }, [activeLng, i18n.resolvedLanguage])
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) return
      i18n.changeLanguage(lng)
    }, [lng, i18n])
    useEffect(() => {
      if (cookies.i18next === lng) return
      if (!lng) return
      setCookie(cookieName, lng, { path: '/' })
    }, [lng, cookies.i18next]) // tofix: set cookies.i18next as deps and fix issue with re-rendering
  }
  return ret
}
