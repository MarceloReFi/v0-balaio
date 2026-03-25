import { NextResponse } from "next/server"
import { fetchFullHistoryStats } from "@/components/pages/stats/full-history-stats"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const maxDuration = 300 // 5 minutes (requires Vercel Pro or self-hosted)

export async function POST() {
  console.log("[Full History Stats API] POST request started")

  try {
    console.log("[Full History Stats API] Fetching full blockchain history...")
    const stats = await fetchFullHistoryStats()

    console.log("[Full History Stats API] Data fetched successfully:", {
      wallets: stats.wallets,
      tasksCreated: stats.tasksCreated,
      tasksClaimed: stats.tasksClaimed,
      tasksApproved: stats.tasksApproved,
      growthWeeks: stats.growth.length,
    })

    return NextResponse.json({ ...stats, cached: false, fullHistory: true })
  } catch (error) {
    console.error("[Full History Stats API] ERROR:", error)
    console.error("[Full History Stats API] Error message:", error instanceof Error ? error.message : String(error))

    return NextResponse.json(
      {
        error: "Failed to fetch full history stats",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
