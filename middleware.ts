import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of previous supported language
const LANGUAGE_CODES = ["en", "it", "de", "es", "fr", "ja", "ko"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (LANGUAGE_CODES.includes(pathname.slice(1))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const languageCode = LANGUAGE_CODES.find((code) =>
    pathname.startsWith(`/${code}/`)
  )

  if (languageCode) {
    const newPathname = pathname.replace(`/${languageCode}`, "")
    const newUrl = new URL(newPathname, request.url)

    request.nextUrl.searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value)
    })

    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match exact language codes (e.g., /en, /fr)
    "/en",
    "/it",
    "/de",
    "/es",
    "/fr",
    "/ja",
    "/ko",
    // Match all paths that start with any of the language codes
    "/en/:path*",
    "/it/:path*",
    "/de/:path*",
    "/es/:path*",
    "/fr/:path*",
    "/ja/:path*",
    "/ko/:path*",
  ],
}
