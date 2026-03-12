import { NextResponse } from "next/server"
import { fetchBlockchainStats } from "@/components/pages/stats/blockchain-stats"
import { getCachedStats, setCachedStats } from "@/components/pages/stats/stats-cache"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  console.log("[Stats API] GET request started")

  try {
    console.log("[Stats API] Checking cache...")
    const cached = getCachedStats()

    if (cached) {
      console.log("[Stats API] Cache hit, returning cached data")
      return NextResponse.json({ ...cached, cached: true })
    }

    console.log("[Stats API] Cache miss, fetching blockchain data...")
    const stats = await fetchBlockchainStats()

    console.log("[Stats API] Data fetched successfully:", {
      wallets: stats.wallets,
      tasksCreated: stats.tasksCreated,
      tasksClaimed: stats.tasksClaimed,
      tasksApproved: stats.tasksApproved,
      growthDays: stats.growth.length,
    })

    setCachedStats(stats)
    console.log("[Stats API] Cache updated")

    return NextResponse.json({ ...stats, cached: false })
  } catch (error) {
    console.error("[Stats API] ERROR:", error)
    console.error("[Stats API] Error type:", typeof error)
    console.error("[Stats API] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[Stats API] Error stack:", error instanceof Error ? error.stack : "No stack")

    return NextResponse.json(
      {
        error: "Failed to fetch stats",
        message: error instanceof Error ? error.message : String(error),
        type: typeof error,
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  console.log("[Stats API] POST request started (force refresh)")

  try {
    console.log("[Stats API] Fetching fresh blockchain data...")
    const stats = await fetchBlockchainStats()

    console.log("[Stats API] Data fetched successfully")
    setCachedStats(stats)

    return NextResponse.json({ ...stats, cached: false })
  } catch (error) {
    console.error("[Stats API] POST ERROR:", error)
    console.error("[Stats API] Error message:", error instanceof Error ? error.message : String(error))

    return NextResponse.json(
      {
        error: "Failed to refresh stats",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
