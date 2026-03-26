import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/web3"
import { CELO_RPC } from "@/lib/config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  console.log("[Stats Batch API] Starting batch request")

  try {
    const { startBlock, endBlock } = await request.json()

    if (!startBlock || !endBlock) {
      return NextResponse.json(
        { error: "Missing startBlock or endBlock" },
        { status: 400 }
      )
    }

    console.log(`[Stats Batch API] Querying blocks ${startBlock} to ${endBlock}`)

    const provider = new ethers.JsonRpcProvider(CELO_RPC)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

    // Query events in parallel
    const [createdEvents, claimedEvents, approvedEvents] = await Promise.all([
      contract.queryFilter(contract.filters.TaskCreated(), startBlock, endBlock),
      contract.queryFilter(contract.filters.TaskClaimed(), startBlock, endBlock),
      contract.queryFilter(contract.filters.TaskApproved(), startBlock, endBlock),
    ])

    console.log(
      `[Stats Batch API] Found ${createdEvents.length} created, ${claimedEvents.length} claimed, ${approvedEvents.length} approved`
    )

    const result = {
      startBlock,
      endBlock,
      events: {
        created: createdEvents.map((e: any) => ({
          blockNumber: e.blockNumber,
          creator: e.args?.[1] || null,
          taskId: e.args?.[0] || null,
        })),
        claimed: claimedEvents.map((e: any) => ({
          blockNumber: e.blockNumber,
          claimant: e.args?.[1] || null,
          taskId: e.args?.[0] || null,
        })),
        approved: approvedEvents.map((e: any) => ({
          blockNumber: e.blockNumber,
          claimant: e.args?.[1] || null,
          taskId: e.args?.[0] || null,
        })),
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[Stats Batch API] ERROR:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch batch",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
