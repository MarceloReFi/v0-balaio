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

// Contract deployment block on Celo Mainnet
const CONTRACT_DEPLOYMENT_BLOCK = 51778358

// Query in batches to avoid timeout
const BATCH_SIZE = 50000 // 50K blocks per batch (~3 days on Celo)

export async function fetchBlockchainStats(): Promise<StatsData> {
  console.log("[fetchBlockchainStats] Starting...")

  const provider = new ethers.JsonRpcProvider(CELO_RPC)
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

  const currentBlock = await provider.getBlockNumber()
  const totalBlocks = currentBlock - CONTRACT_DEPLOYMENT_BLOCK

  console.log(`[fetchBlockchainStats] Total blocks to query: ${totalBlocks}`)

  // Calculate number of batches needed
  const numBatches = Math.ceil(totalBlocks / BATCH_SIZE)
  console.log(`[fetchBlockchainStats] Will query in ${numBatches} batches`)

  // Aggregate results from all batches
  let allCreatedEvents: any[] = []
  let allClaimedEvents: any[] = []
  let allApprovedEvents: any[] = []

  // Query in batches
  for (let i = 0; i < numBatches; i++) {
    const batchStart = CONTRACT_DEPLOYMENT_BLOCK + i * BATCH_SIZE
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

  // Calculate growth by week
  const growth = calculateGrowthByWeek(allCreatedEvents, allClaimedEvents, allApprovedEvents)

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
  approvedEvents: any[]
): GrowthData[] {
  const weeklyStats: Record<string, { created: number; claimed: number; approved: number }> = {}

  // Celo: ~17,280 blocks/day = ~120,960 blocks/week
  const BLOCKS_PER_WEEK = 120960

  const processEvent = (event: any, type: "created" | "claimed" | "approved") => {
    const weeksSinceDeployment = Math.floor((event.blockNumber - CONTRACT_DEPLOYMENT_BLOCK) / BLOCKS_PER_WEEK)
    const weekKey = `Week ${weeksSinceDeployment + 1}`

    if (!weeklyStats[weekKey]) {
      weeklyStats[weekKey] = { created: 0, claimed: 0, approved: 0 }
    }
    weeklyStats[weekKey][type]++
  }

  createdEvents.forEach((e) => processEvent(e, "created"))
  claimedEvents.forEach((e) => processEvent(e, "claimed"))
  approvedEvents.forEach((e) => processEvent(e, "approved"))

  return Object.entries(weeklyStats)
    .map(([week, stats]) => ({
      date: week,
      created: stats.created,
      claimed: stats.claimed,
      approved: stats.approved,
    }))
    .sort((a, b) => {
      const aNum = parseInt(a.date.replace("Week ", ""))
      const bNum = parseInt(b.date.replace("Week ", ""))
      return aNum - bNum
    })
}
