import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Fetch the Matomo script from the correct CDN
    const response = await fetch("https://psedev.matomo.cloud/matomo.js", {
      headers: {
        "User-Agent": request.headers.get("user-agent") || "",
      },
    })

    if (!response.ok) {
      return new Response("Failed to fetch Matomo script", { status: 500 })
    }

    const script = await response.text()

    return new Response(script, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    })
  } catch (error) {
    console.error("Error proxying Matomo script:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
