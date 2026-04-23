import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { getContractAddress, CONTRACT_ABI } from "@/lib/web3"
import { CELO_RPC } from "@/lib/config"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function GET(request: Request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:stats-test`, 5, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const logs: string[] = []

  try {
    logs.push("Test 1: Imports OK")

    logs.push(`Test 2: getContractAddress(42220) = ${getContractAddress(42220)}`)
    logs.push(`Test 3: CELO_RPC = ${CELO_RPC}`)

    logs.push("Test 4: Creating provider...")
    const provider = new ethers.JsonRpcProvider(CELO_RPC)
    logs.push("Test 5: Provider created")

    logs.push("Test 6: Getting network...")
    const network = await provider.getNetwork()
    logs.push(`Test 7: Network chainId = ${network.chainId.toString()}`)

    logs.push("Test 8: Creating contract...")
    const contract = new ethers.Contract(getContractAddress(42220), CONTRACT_ABI, provider)
    logs.push("Test 9: Contract created")

    logs.push("Test 10: Checking filters...")
    logs.push(`Test 11: TaskCreated filter exists? ${typeof contract.filters.TaskCreated}`)
    logs.push(`Test 12: TaskClaimed filter exists? ${typeof contract.filters.TaskClaimed}`)
    logs.push(`Test 13: TaskApproved filter exists? ${typeof contract.filters.TaskApproved}`)

    logs.push("Test 14: Trying to query 1 block...")
    const events = await contract.queryFilter(
      contract.filters.TaskCreated(),
      28000000,
      28000100
    )
    logs.push(`Test 15: Found ${events.length} events in block range`)

    return NextResponse.json({
      success: true,
      logs,
      message: "All tests passed",
    })
  } catch (error) {
    logs.push(`ERROR: ${error instanceof Error ? error.message : String(error)}`)
    logs.push(`ERROR STACK: ${error instanceof Error ? error.stack : "No stack"}`)

    return NextResponse.json(
      {
        success: false,
        logs,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
