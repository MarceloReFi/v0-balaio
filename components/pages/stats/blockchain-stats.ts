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
  const provider = new ethers.JsonRpcProvider(CELO_RPC)
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

  // Query all events from contract deployment to now
  const createdEvents = await contract.queryFilter(
    contract.filters.TaskCreated(),
    0,
    "latest"
  )
  const claimedEvents = await contract.queryFilter(
    contract.filters.TaskClaimed(),
    0,
    "latest"
  )
  const approvedEvents = await contract.queryFilter(
    contract.filters.TaskApproved(),
    0,
    "latest"
  )

  // Extract unique wallet addresses
  const walletSet = new Set<string>()

  // Add creators from TaskCreated events
  ;(createdEvents as ethers.EventLog[]).forEach((event: ethers.EventLog) => {
    const creator = event.args?.[1] // Second indexed param is creator
    if (creator) walletSet.add(creator.toLowerCase())
  })

  // Add claimants from TaskClaimed events
  ;(claimedEvents as ethers.EventLog[]).forEach((event: ethers.EventLog) => {
    const claimant = event.args?.[1] // Second indexed param is claimant
    if (claimant) walletSet.add(claimant.toLowerCase())
  })

  // Calculate growth data (group by date)
  const growth = await calculateGrowth(
    createdEvents as ethers.EventLog[],
    claimedEvents as ethers.EventLog[],
    approvedEvents as ethers.EventLog[],
    provider
  )

  return {
    wallets: walletSet.size,
    tasksCreated: createdEvents.length,
    tasksClaimed: claimedEvents.length,
    tasksApproved: approvedEvents.length,
    growth,
    lastUpdated: Date.now(),
  }
}

async function calculateGrowth(
  createdEvents: ethers.EventLog[],
  claimedEvents: ethers.EventLog[],
  approvedEvents: ethers.EventLog[],
  provider: ethers.JsonRpcProvider
): Promise<GrowthData[]> {
  const dailyStats: Record<string, { created: number; claimed: number; approved: number }> = {}

  // Process created events
  for (const event of createdEvents) {
    const block = await provider.getBlock(event.blockNumber)
    if (block) {
      const date = new Date(block.timestamp * 1000).toISOString().split("T")[0]
      if (!dailyStats[date]) dailyStats[date] = { created: 0, claimed: 0, approved: 0 }
      dailyStats[date].created++
    }
  }

  // Process claimed events
  for (const event of claimedEvents) {
    const block = await provider.getBlock(event.blockNumber)
    if (block) {
      const date = new Date(block.timestamp * 1000).toISOString().split("T")[0]
      if (!dailyStats[date]) dailyStats[date] = { created: 0, claimed: 0, approved: 0 }
      dailyStats[date].claimed++
    }
  }

  // Process approved events
  for (const event of approvedEvents) {
    const block = await provider.getBlock(event.blockNumber)
    if (block) {
      const date = new Date(block.timestamp * 1000).toISOString().split("T")[0]
      if (!dailyStats[date]) dailyStats[date] = { created: 0, claimed: 0, approved: 0 }
      dailyStats[date].approved++
    }
  }

  // Convert to array and sort by date
  return Object.entries(dailyStats)
    .map(([date, stats]) => ({
      date,
      created: stats.created,
      claimed: stats.claimed,
      approved: stats.approved,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
