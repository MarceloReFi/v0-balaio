import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/web3"
import { getProvider, retryQuery } from "@/lib/blockchain-provider"
import { BLOCKS_PER_DAY, CONTRACT_DEPLOYMENT_BLOCK } from "@/lib/config"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

async function runBackfill() {
  try {
    const supabase = await createClient()
    const { data: taskRows } = await supabase.from("tasks").select("id")
    const taskIds = (taskRows ?? []).map((r: any) => r.id)

    const hashToTaskId = new Map(taskIds.map((id: string) => [ethers.id(id), id]))

    const provider = await getProvider()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
    const currentBlock = await provider.getBlockNumber()
    const startBlock = Math.max(CONTRACT_DEPLOYMENT_BLOCK, currentBlock - 30 * BLOCKS_PER_DAY)

    const [claimedEvents, submittedEvents, approvedEvents] = await Promise.all([
      retryQuery(() => contract.queryFilter(contract.filters.TaskClaimed(), startBlock, currentBlock)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskSubmitted(), startBlock, currentBlock)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskApproved(), startBlock, currentBlock)),
    ])

    // submittedMap: key = "taskId:worker" → { submissionLink }
    const submittedMap: Record<string, { submissionLink: string | null }> = {}
    for (const e of submittedEvents as any[]) {
      const originalId = hashToTaskId.get(e.topics?.[1])
      const worker = e.args?.[1]?.toLowerCase()
      if (originalId && worker) {
        submittedMap[`${originalId}:${worker}`] = { submissionLink: e.args?.[2] || null }
      }
    }

    // approvedMap: key = "taskId:worker"
    const approvedMap = new Set<string>()
    for (const e of approvedEvents as any[]) {
      const originalId = hashToTaskId.get(e.topics?.[1])
      const worker = e.args?.[1]?.toLowerCase()
      if (originalId && worker) approvedMap.add(`${originalId}:${worker}`)
    }

    const rows: any[] = []
    for (const e of claimedEvents as any[]) {
      const originalId = hashToTaskId.get(e.topics?.[1])
      const worker = e.args?.[1]?.toLowerCase()
      if (!originalId || !worker) continue
      const key = `${originalId}:${worker}`
      rows.push({
        task_id: originalId,
        worker_address: worker,
        claimed_at: new Date().toISOString(),
        submitted_at: submittedMap[key] ? new Date().toISOString() : null,
        submission_link: submittedMap[key]?.submissionLink ?? null,
        approved_at: approvedMap.has(key) ? new Date().toISOString() : null,
      })
    }

    const { error } = await supabase
      .from("task_claims")
      .upsert(rows, { onConflict: "task_id,worker_address" })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      upserted: rows.length,
      taskIdsFound: taskIds.length,
      claimedEvents: claimedEvents.length,
      submittedEvents: submittedEvents.length,
      approvedEvents: approvedEvents.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return runBackfill()
}

export async function POST() {
  return runBackfill()
}
