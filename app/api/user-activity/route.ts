import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/web3"
import { getProvider, retryQuery } from "@/lib/blockchain-provider"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const CONTRACT_DEPLOYMENT_BLOCK = 51778358

export async function POST(request: Request) {
  console.log("[User Activity API] Starting request")

  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:activity`, 10, 60000)) {
    console.log("[User Activity API] Rate limit exceeded for IP:", ip)
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const { userAddress } = await request.json()
    console.log("[User Activity API] Request for user:", userAddress)

    if (!userAddress) {
      console.log("[User Activity API] Missing userAddress")
      return NextResponse.json({ error: "Missing userAddress" }, { status: 400 })
    }

    console.log("[User Activity API] Getting provider...")
    const provider = await getProvider()
    console.log("[User Activity API] Provider obtained successfully")

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
    console.log("[User Activity API] Contract instance created")

    console.log("[User Activity API] Querying events from block:", CONTRACT_DEPLOYMENT_BLOCK)

    const [created, claimed, submitted, approved] = await Promise.all([
      retryQuery(() => {
        console.log("[User Activity API] Querying TaskCreated...")
        return contract.queryFilter(contract.filters.TaskCreated(null, userAddress), CONTRACT_DEPLOYMENT_BLOCK)
      }),
      retryQuery(() => {
        console.log("[User Activity API] Querying TaskClaimed...")
        return contract.queryFilter(contract.filters.TaskClaimed(null, userAddress), CONTRACT_DEPLOYMENT_BLOCK)
      }),
      retryQuery(() => {
        console.log("[User Activity API] Querying TaskSubmitted...")
        return contract.queryFilter(contract.filters.TaskSubmitted(null, userAddress), CONTRACT_DEPLOYMENT_BLOCK)
      }),
      retryQuery(() => {
        console.log("[User Activity API] Querying TaskApproved...")
        return contract.queryFilter(contract.filters.TaskApproved(null, userAddress), CONTRACT_DEPLOYMENT_BLOCK)
      }),
    ])

    console.log("[User Activity API] Events fetched:", {
      created: created.length,
      claimed: claimed.length,
      submitted: submitted.length,
      approved: approved.length
    })

    const result = {
      created: created.map(e => ({ taskId: e.args?.[0], blockNumber: e.blockNumber })),
      claimed: claimed.map(e => ({ taskId: e.args?.[0], blockNumber: e.blockNumber })),
      submitted: submitted.map(e => ({ taskId: e.args?.[0], blockNumber: e.blockNumber })),
      approved: approved.map(e => ({ taskId: e.args?.[0], blockNumber: e.blockNumber })),
      success: true,
    }

    console.log("[User Activity API] Returning success")
    return NextResponse.json(result)
  } catch (error) {
    console.error("[User Activity API] ERROR:", error)
    console.error("[User Activity API] Error type:", typeof error)
    console.error("[User Activity API] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[User Activity API] Error stack:", error instanceof Error ? error.stack : "No stack")

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
