import { ethers } from "ethers"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/web3"
import { CELO_RPC } from "@/lib/config"

export interface StatsData {
  wallets: number
  tasksCreated: number
  tasksClaimed: number
  tasksApproved: number
  growth: GrowthData[]
  lastUpdated: number
}

export interface GrowthData {
  date: string
  created: number
  claimed: number
  approved: number
}

export async function fetchBlockchainStats(): Promise<StatsData> {
  console.log("fetchBlockchainStats: Starting")

  try {
    const provider = new ethers.JsonRpcProvider(CELO_RPC)
    console.log("fetchBlockchainStats: Provider created")

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
    console.log("fetchBlockchainStats: Contract instance created")

    // Test connection
    const network = await provider.getNetwork()
    console.log("fetchBlockchainStats: Connected to network:", network.chainId.toString())

    console.log("fetchBlockchainStats: Querying TaskCreated events")
    const createdEvents = await contract.queryFilter(
      contract.filters.TaskCreated(),
      0,
      "latest"
    )
    console.log("fetchBlockchainStats: Found", createdEvents.length, "TaskCreated events")

    console.log("fetchBlockchainStats: Querying TaskClaimed events")
    const claimedEvents = await contract.queryFilter(
      contract.filters.TaskClaimed(),
      0,
      "latest"
    )
    console.log("fetchBlockchainStats: Found", claimedEvents.length, "TaskClaimed events")

    console.log("fetchBlockchainStats: Querying TaskApproved events")
    const approvedEvents = await contract.queryFilter(
      contract.filters.TaskApproved(),
      0,
      "latest"
    )
    console.log("fetchBlockchainStats: Found", approvedEvents.length, "TaskApproved events")

    // Extract unique wallet addresses
    const walletSet = new Set<string>()

    createdEvents.forEach((event: any) => {
      try {
        const creator = event.args?.[1]
        if (creator) walletSet.add(creator.toLowerCase())
      } catch (err) {
        console.error("Error processing creator:", err)
      }
    })

    claimedEvents.forEach((event: any) => {
      try {
        const claimant = event.args?.[1]
        if (claimant) walletSet.add(claimant.toLowerCase())
      } catch (err) {
        console.error("Error processing claimant:", err)
      }
    })

    console.log("fetchBlockchainStats: Calculating growth")
    const growth = await calculateGrowth(createdEvents, claimedEvents, approvedEvents, provider)

    const result = {
      wallets: walletSet.size,
      tasksCreated: createdEvents.length,
      tasksClaimed: claimedEvents.length,
      tasksApproved: approvedEvents.length,
      growth,
      lastUpdated: Date.now(),
    }

    console.log("fetchBlockchainStats: Returning result:", result)
    return result
  } catch (error) {
    console.error("fetchBlockchainStats: Error:", error)
    throw error
  }
}

async function calculateGrowth(
  createdEvents: any[],
  claimedEvents: any[],
  approvedEvents: any[],
  provider: ethers.JsonRpcProvider
): Promise<GrowthData[]> {
  const dailyStats: Record<string, { created: number; claimed: number; approved: number }> = {}

  // Helper to process events
  const processEvents = async (events: any[], type: "created" | "claimed" | "approved") => {
    for (const event of events) {
      try {
        const block = await provider.getBlock(event.blockNumber)
        if (block && block.timestamp) {
          const date = new Date(block.timestamp * 1000).toISOString().split("T")[0]
          if (!dailyStats[date]) {
            dailyStats[date] = { created: 0, claimed: 0, approved: 0 }
          }
          dailyStats[date][type]++
        }
      } catch (err) {
        console.error(`Error processing ${type} event:`, err)
      }
    }
  }

  await processEvents(createdEvents, "created")
  await processEvents(claimedEvents, "claimed")
  await processEvents(approvedEvents, "approved")

  return Object.entries(dailyStats)
    .map(([date, stats]) => ({
      date,
      created: stats.created,
      claimed: stats.claimed,
      approved: stats.approved,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
