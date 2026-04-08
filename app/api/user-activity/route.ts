import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/web3"
import { getProvider, retryQuery } from "@/lib/blockchain-provider"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const CONTRACT_DEPLOYMENT_BLOCK = 51778358

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:activity`, 10, 60000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const { userAddress } = await request.json()
    if (!userAddress) {
      return NextResponse.json({ error: "Missing userAddress" }, { status: 400 })
    }

    const provider = await getProvider()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

    const [created, claimed, submitted, approved] = await Promise.all([
      retryQuery(() => contract.queryFilter(contract.filters.TaskCreated(null, userAddress), CONTRACT_DEPLOYMENT_BLOCK)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskClaimed(null, userAddress), CONTRACT_DEPLOYMENT_BLOCK)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskSubmitted(null, userAddress), CONTRACT_DEPLOYMENT_BLOCK)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskApproved(null, userAddress), CONTRACT_DEPLOYMENT_BLOCK)),
    ])

    return NextResponse.json({
      created: created.map(e => ({ taskId: e.args?.[0], blockNumber: e.blockNumber })),
      claimed: claimed.map(e => ({ taskId: e.args?.[0], blockNumber: e.blockNumber })),
      submitted: submitted.map(e => ({ taskId: e.args?.[0], blockNumber: e.blockNumber })),
      approved: approved.map(e => ({ taskId: e.args?.[0], blockNumber: e.blockNumber })),
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
