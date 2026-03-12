import { NextResponse } from "next/server"
import { fetchBlockchainStats } from "@/components/pages/stats/blockchain-stats"
import { getCachedStats, setCachedStats } from "@/components/pages/stats/stats-cache"

export async function GET() {
  try {
    console.log("Stats API: Starting request")

    const cached = getCachedStats()
    if (cached) {
      console.log("Stats API: Returning cached data")
      return NextResponse.json({ ...cached, cached: true })
    }

    console.log("Stats API: Fetching fresh blockchain data")
    const stats = await fetchBlockchainStats()

    console.log("Stats API: Got stats:", stats)
    setCachedStats(stats)

    return NextResponse.json({ ...stats, cached: false })
  } catch (error) {
    console.error("Stats API: Full error:", error)
    console.error("Stats API: Error message:", error instanceof Error ? error.message : String(error))
    console.error("Stats API: Error stack:", error instanceof Error ? error.stack : "No stack")

    return NextResponse.json(
      {
        error: "Failed to fetch stats",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    console.log("Stats API: Force refresh requested")

    // Force refresh - bypass cache
    const stats = await fetchBlockchainStats()
    setCachedStats(stats)

    console.log("Stats API: Refresh complete")
    return NextResponse.json({ ...stats, cached: false })
  } catch (error) {
    console.error("Stats API: Refresh error:", error)
    console.error("Stats API: Error message:", error instanceof Error ? error.message : String(error))
    console.error("Stats API: Error stack:", error instanceof Error ? error.stack : "No stack")

    return NextResponse.json(
      {
        error: "Failed to refresh stats",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
