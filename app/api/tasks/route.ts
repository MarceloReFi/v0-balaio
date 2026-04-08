import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/web3"
import { getProvider, retryQuery } from "@/lib/blockchain-provider"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const CONTRACT_DEPLOYMENT_BLOCK = 51778358
const BLOCKS_PER_DAY = 17280
const BATCH_SIZE = 50000

export async function GET(request: Request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:tasks`, 10, 60000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const provider = await getProvider()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

    const currentBlock = await provider.getBlockNumber()
    const startBlock = Math.max(CONTRACT_DEPLOYMENT_BLOCK, currentBlock - 60 * BLOCKS_PER_DAY)
    const numBatches = Math.ceil((currentBlock - startBlock) / BATCH_SIZE)

    let allCreatedEvents: any[] = []
    for (let i = 0; i < numBatches; i++) {
      const batchStart = startBlock + i * BATCH_SIZE
      const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, currentBlock)
      try {
        const events = await retryQuery(() =>
          contract.queryFilter(contract.filters.TaskCreated(), batchStart, batchEnd)
        )
        allCreatedEvents = allCreatedEvents.concat(events)
      } catch (err) {
        console.error(`Batch ${i + 1}/${numBatches} failed:`, err)
      }
    }

    const taskIds = [...new Set(allCreatedEvents.map(e => e.args?.[0]).filter(Boolean))]

    return NextResponse.json({ taskIds, success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
