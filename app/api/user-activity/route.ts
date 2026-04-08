import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/web3"
import { getProvider, retryQuery } from "@/lib/blockchain-provider"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { BLOCKS_PER_DAY, CONTRACT_DEPLOYMENT_BLOCK } from "@/lib/config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  console.log("[User Activity API] Starting request")

  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:activity`, 10, 60000)) {
    console.log("[User Activity API] Rate limit exceeded")
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const { userAddress } = await request.json()
    console.log("[User Activity API] User:", userAddress)

    if (!userAddress) {
      return NextResponse.json({ error: "Missing userAddress" }, { status: 400 })
    }

    console.log("[User Activity API] Getting provider...")
    const provider = await getProvider()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

    // Query only last 180 days to avoid timeout
    const currentBlock = await provider.getBlockNumber()
    const startBlock = Math.max(
      CONTRACT_DEPLOYMENT_BLOCK,
      currentBlock - 180 * BLOCKS_PER_DAY
    )

    console.log("[User Activity API] Querying from block:", startBlock, "to", currentBlock)

    const [created, claimed, submitted, approved] = await Promise.all([
      retryQuery(() =>
        contract.queryFilter(contract.filters.TaskCreated(null, userAddress), startBlock, currentBlock)
      ),
      retryQuery(() =>
        contract.queryFilter(contract.filters.TaskClaimed(null, userAddress), startBlock, currentBlock)
      ),
      retryQuery(() =>
        contract.queryFilter(contract.filters.TaskSubmitted(null, userAddress), startBlock, currentBlock)
      ),
      retryQuery(() =>
        contract.queryFilter(contract.filters.TaskApproved(null, userAddress), startBlock, currentBlock)
      ),
    ])

    console.log("[User Activity API] Events:", {
      created: created.length,
      claimed: claimed.length,
      submitted: submitted.length,
      approved: approved.length
    })

    return NextResponse.json({
      created: created.map(e => ({ taskId: e.args?.[0], blockNumber: e.blockNumber })),
      claimed: claimed.map(e => ({ taskId: e.args?.[0], blockNumber: e.blockNumber })),
      submitted: submitted.map(e => ({ taskId: e.args?.[0], blockNumber: e.blockNumber })),
      approved: approved.map(e => ({ taskId: e.args?.[0], blockNumber: e.blockNumber })),
      success: true,
    })
  } catch (error) {
    console.error("[User Activity API] ERROR:", error)
    console.error("[User Activity API] Message:", error instanceof Error ? error.message : String(error))
    console.error("[User Activity API] Stack:", error instanceof Error ? error.stack : "No stack")

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
