import { NextResponse } from "next/server"
import { fetchBlockchainStats } from "@/components/pages/stats/blockchain-stats"
import { getCachedStats, setCachedStats } from "@/components/pages/stats/stats-cache"

export async function GET() {
  try {
    // Check cache first
    const cached = getCachedStats()
    if (cached) {
      return NextResponse.json({ ...cached, cached: true })
    }

    // Fetch fresh data from blockchain
    const stats = await fetchBlockchainStats()

    // Update cache
    setCachedStats(stats)

    return NextResponse.json({ ...stats, cached: false })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    // Force refresh - bypass cache
    const stats = await fetchBlockchainStats()
    setCachedStats(stats)
    return NextResponse.json({ ...stats, cached: false })
  } catch (error) {
    console.error("Error refreshing stats:", error)
    return NextResponse.json(
      { error: "Failed to refresh stats" },
      { status: 500 }
    )
  }
}
