import { NextResponse } from "next/server"
import { getCachedFullHistory } from "@/components/pages/stats/stats-cache"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  console.log("[Full History API] GET request - checking cache")

  try {
    const cached = getCachedFullHistory()

    if (cached) {
      console.log("[Full History API] Returning cached full history")
      return NextResponse.json({
        ...cached,
        cached: true,
        fullHistory: true,
        cacheAge: Date.now() - cached.lastUpdated,
      })
    }

    return NextResponse.json(
      {
        error: "Full history not cached yet",
        message:
          "Full history data is not available yet. This feature requires pre-computation due to Vercel Hobby plan limits (10 second timeout). Please try the Last 90 Days view for recent activity.",
      },
      { status: 503 }
    )
  } catch (error) {
    console.error("[Full History API] ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch full history" },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Full history computation disabled",
      message:
        "On-demand full history computation requires Vercel Pro plan (300s timeout). Current Hobby plan limit is 10s. Please use the Last 90 Days view.",
    },
    { status: 501 }
  )
}
