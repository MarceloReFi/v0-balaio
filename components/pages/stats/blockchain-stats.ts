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

// Celo produces ~1 block every 5 seconds = ~17,280 blocks/day
// 6 months = ~3,110,400 blocks
const BLOCKS_TO_QUERY = 3_110_400

export async function fetchBlockchainStats(): Promise<StatsData> {
  console.log("[fetchBlockchainStats] Starting...")

  const provider = new ethers.JsonRpcProvider(CELO_RPC)
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

  // Get current block
  const currentBlock = await provider.getBlockNumber()
  const startBlock = Math.max(0, currentBlock - BLOCKS_TO_QUERY)

  console.log(`[fetchBlockchainStats] Querying blocks ${startBlock} to ${currentBlock}`)

  // Query events in parallel for speed
  const [createdEvents, claimedEvents, approvedEvents] = await Promise.all([
    contract.queryFilter(contract.filters.TaskCreated(), startBlock, currentBlock),
    contract.queryFilter(contract.filters.TaskClaimed(), startBlock, currentBlock),
    contract.queryFilter(contract.filters.TaskApproved(), startBlock, currentBlock),
  ])

  console.log(`[fetchBlockchainStats] Found ${createdEvents.length} created, ${claimedEvents.length} claimed, ${approvedEvents.length} approved`)

  // Extract unique wallet addresses
  const walletSet = new Set<string>()

  createdEvents.forEach((event: any) => {
    const creator = event.args?.[1]
    if (creator) walletSet.add(creator.toLowerCase())
  })

  claimedEvents.forEach((event: any) => {
    const claimant = event.args?.[1]
    if (claimant) walletSet.add(claimant.toLowerCase())
  })

  // Calculate growth (simplified - use block numbers instead of timestamps to avoid extra RPC calls)
  const growth = await calculateGrowthSimplified(createdEvents, claimedEvents, approvedEvents)

  const result = {
    wallets: walletSet.size,
    tasksCreated: createdEvents.length,
    tasksClaimed: claimedEvents.length,
    tasksApproved: approvedEvents.length,
    growth,
    lastUpdated: Date.now(),
  }

  console.log("[fetchBlockchainStats] Success:", result)
  return result
}

// Simplified growth calculation - group by week instead of day to reduce data
// Celo: ~17,280 blocks/day = ~120,960 blocks/week
async function calculateGrowthSimplified(
  createdEvents: any[],
  claimedEvents: any[],
  approvedEvents: any[]
): Promise<GrowthData[]> {
  const weeklyStats: Record<string, { created: number; claimed: number; approved: number }> = {}

  const BLOCKS_PER_WEEK = 120_960

  const processEvent = (event: any, type: "created" | "claimed" | "approved") => {
    const weekNumber = Math.floor(event.blockNumber / BLOCKS_PER_WEEK)
    const weekKey = `week_${weekNumber}`

    if (!weeklyStats[weekKey]) {
      weeklyStats[weekKey] = { created: 0, claimed: 0, approved: 0 }
    }
    weeklyStats[weekKey][type]++
  }

  createdEvents.forEach((e) => processEvent(e, "created"))
  claimedEvents.forEach((e) => processEvent(e, "claimed"))
  approvedEvents.forEach((e) => processEvent(e, "approved"))

  // Convert to array and sort
  return Object.entries(weeklyStats)
    .map(([week, stats]) => ({
      date: week, // Will show as "week_12345" - simplified
      created: stats.created,
      claimed: stats.claimed,
      approved: stats.approved,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
