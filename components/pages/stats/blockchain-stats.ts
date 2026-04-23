import { ethers } from "ethers"
import { getContractAddress, CONTRACT_ABI } from "@/lib/web3"
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

// Contract deployment block on Celo Mainnet
const CONTRACT_DEPLOYMENT_BLOCK = 51778358

// Celo: ~17,280 blocks/day = ~120,960 blocks/week
const BLOCKS_PER_DAY = 17280
const BLOCKS_PER_WEEK = 120960

// Default to last 90 days for fast loading
const DEFAULT_DAYS = 90

// Query in batches to avoid timeout
const BATCH_SIZE = 50000 // 50K blocks per batch (~3 days on Celo)

export async function fetchBlockchainStats(days = DEFAULT_DAYS): Promise<StatsData> {
  console.log(`[fetchBlockchainStats] Starting... (last ${days} days)`)

  const provider = new ethers.JsonRpcProvider(CELO_RPC)
  const contract = new ethers.Contract(getContractAddress(42220), CONTRACT_ABI, provider)

  const currentBlock = await provider.getBlockNumber()
  const startBlock = Math.max(CONTRACT_DEPLOYMENT_BLOCK, currentBlock - days * BLOCKS_PER_DAY)
  const totalBlocks = currentBlock - startBlock

  console.log(`[fetchBlockchainStats] Querying blocks ${startBlock} to ${currentBlock} (${totalBlocks} blocks)`)

  // Calculate number of batches needed
  const numBatches = Math.ceil(totalBlocks / BATCH_SIZE)
  console.log(`[fetchBlockchainStats] Will query in ${numBatches} batches`)

  // Aggregate results from all batches
  let allCreatedEvents: any[] = []
  let allClaimedEvents: any[] = []
  let allApprovedEvents: any[] = []

  // Query in batches
  for (let i = 0; i < numBatches; i++) {
    const batchStart = startBlock + i * BATCH_SIZE
    const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, currentBlock)

    console.log(`[fetchBlockchainStats] Batch ${i + 1}/${numBatches}: blocks ${batchStart} to ${batchEnd}`)

    try {
      const [created, claimed, approved] = await Promise.all([
        contract.queryFilter(contract.filters.TaskCreated(), batchStart, batchEnd),
        contract.queryFilter(contract.filters.TaskClaimed(), batchStart, batchEnd),
        contract.queryFilter(contract.filters.TaskApproved(), batchStart, batchEnd),
      ])

      allCreatedEvents = allCreatedEvents.concat(created)
      allClaimedEvents = allClaimedEvents.concat(claimed)
      allApprovedEvents = allApprovedEvents.concat(approved)

      console.log(`[fetchBlockchainStats] Batch ${i + 1} done: +${created.length} created, +${claimed.length} claimed, +${approved.length} approved`)
    } catch (error) {
      console.error(`[fetchBlockchainStats] Error in batch ${i + 1}:`, error)
      // Continue with next batch even if one fails
    }
  }

  console.log(`[fetchBlockchainStats] Total: ${allCreatedEvents.length} created, ${allClaimedEvents.length} claimed, ${allApprovedEvents.length} approved`)

  // Extract unique wallet addresses
  const walletSet = new Set<string>()

  allCreatedEvents.forEach((event: any) => {
    const creator = event.args?.[1]
    if (creator) walletSet.add(creator.toLowerCase())
  })

  allClaimedEvents.forEach((event: any) => {
    const claimant = event.args?.[1]
    if (claimant) walletSet.add(claimant.toLowerCase())
  })

  // Calculate growth by week within the queried window
  const growth = calculateGrowthByWeek(allCreatedEvents, allClaimedEvents, allApprovedEvents, startBlock)

  const result = {
    wallets: walletSet.size,
    tasksCreated: allCreatedEvents.length,
    tasksClaimed: allClaimedEvents.length,
    tasksApproved: allApprovedEvents.length,
    growth,
    lastUpdated: Date.now(),
  }

  console.log("[fetchBlockchainStats] Success:", result)
  return result
}

function calculateGrowthByWeek(
  createdEvents: any[],
  claimedEvents: any[],
  approvedEvents: any[],
  startBlock: number
): GrowthData[] {
  const weeklyStats: Record<string, { created: number; claimed: number; approved: number }> = {}

  const processEvent = (event: any, type: "created" | "claimed" | "approved") => {
    const weeksFromStart = Math.floor((event.blockNumber - startBlock) / BLOCKS_PER_WEEK)

    // Compute the approximate Monday of that week as a date label
    const approxDate = new Date()
    approxDate.setDate(approxDate.getDate() - (DEFAULT_DAYS - weeksFromStart * 7))
    // Normalize to Monday
    const day = approxDate.getDay()
    const diff = approxDate.getDate() - day + (day === 0 ? -6 : 1)
    approxDate.setDate(diff)
    const weekKey = approxDate.toISOString().split("T")[0]

    if (!weeklyStats[weekKey]) {
      weeklyStats[weekKey] = { created: 0, claimed: 0, approved: 0 }
    }
    weeklyStats[weekKey][type]++
  }

  createdEvents.forEach((e) => processEvent(e, "created"))
  claimedEvents.forEach((e) => processEvent(e, "claimed"))
  approvedEvents.forEach((e) => processEvent(e, "approved"))

  return Object.entries(weeklyStats)
    .map(([date, stats]) => ({
      date,
      created: stats.created,
      claimed: stats.claimed,
      approved: stats.approved,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
