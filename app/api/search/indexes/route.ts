import { NextResponse } from "next/server"

// These should be the same indexes used in the search route
// to ensure consistency
const allIndexes = ["blog", "projects", "research"]

export async function GET() {
  try {
    return NextResponse.json({
      indexes: allIndexes,
      status: "success",
    })
  } catch (error) {
    console.error("Error fetching search indexes:", error)
    return NextResponse.json(
      { error: "Failed to fetch search indexes" },
      { status: 500 }
    )
  }
}
