import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/web3"
import { getProvider, retryQuery } from "@/lib/blockchain-provider"
import { BLOCKS_PER_DAY, CONTRACT_DEPLOYMENT_BLOCK } from "@/lib/config"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:tasks-claims`, 30, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body || typeof body !== "object" || !Array.isArray((body as any).taskIds)) {
    return NextResponse.json({ error: "taskIds must be an array" }, { status: 400 })
  }

  const taskIds: string[] = (body as any).taskIds

  try {
    const provider = await getProvider()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

    const currentBlock = await provider.getBlockNumber()
    const startBlock = Math.max(
      CONTRACT_DEPLOYMENT_BLOCK,
      currentBlock - 180 * BLOCKS_PER_DAY
    )

    const taskIdSet = new Set(taskIds)

    const [claimedEvents, submittedEvents, approvedEvents] = await Promise.all([
      retryQuery(() => contract.queryFilter(contract.filters.TaskClaimed(), startBlock, currentBlock)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskSubmitted(), startBlock, currentBlock)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskApproved(), startBlock, currentBlock)),
    ])

    // Build lookup maps for submitted and approved by taskId+worker
    const submittedMap: Record<string, { submissionLink: string | null }> = {}
    for (const e of submittedEvents as any[]) {
      const taskId = e.args?.[0]
      const worker = e.args?.[1]?.toLowerCase()
      if (taskId && worker && taskIdSet.has(taskId)) {
        submittedMap[`${taskId}:${worker}`] = { submissionLink: e.args?.[2] || null }
      }
    }

    const approvedSet = new Set<string>()
    for (const e of approvedEvents as any[]) {
      const taskId = e.args?.[0]
      const worker = e.args?.[1]?.toLowerCase()
      if (taskId && worker && taskIdSet.has(taskId)) {
        approvedSet.add(`${taskId}:${worker}`)
      }
    }

    const result: Record<string, Array<{
      workerAddress: string
      submissionLink: string | null
      hasSubmitted: boolean
      hasApproved: boolean
    }>> = {}

    for (const e of claimedEvents as any[]) {
      const taskId = e.args?.[0]
      const worker = e.args?.[1]?.toLowerCase()
      if (!taskId || !worker || !taskIdSet.has(taskId)) continue

      if (!result[taskId]) result[taskId] = []
      const key = `${taskId}:${worker}`
      result[taskId].push({
        workerAddress: worker,
        submissionLink: submittedMap[key]?.submissionLink ?? null,
        hasSubmitted: !!submittedMap[key],
        hasApproved: approvedSet.has(key),
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
