import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { CONTRACT_ABI } from "@/lib/web3"
import { retryQuery } from "@/lib/blockchain-provider"
import {
  CELO_CONTRACT_ADDRESS_V1,
  CELO_DEPLOYMENT_BLOCK_V1,
  CELO_CONTRACT_ADDRESS_V2,
  CELO_DEPLOYMENT_BLOCK_V2,
  CELO_RPC,
  GNOSIS_CONTRACT_ADDRESS,
  GNOSIS_DEPLOYMENT_BLOCK,
  GNOSIS_RPC,
} from "@/lib/config"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const MAX_LOG_BLOCK_RANGE = 5000

const SOURCES = [
  { source: "celo_v1", contractAddress: CELO_CONTRACT_ADDRESS_V1, deploymentBlock: CELO_DEPLOYMENT_BLOCK_V1, rpc: CELO_RPC },
  { source: "celo_v2", contractAddress: CELO_CONTRACT_ADDRESS_V2, deploymentBlock: CELO_DEPLOYMENT_BLOCK_V2, rpc: CELO_RPC },
  { source: "gnosis", contractAddress: GNOSIS_CONTRACT_ADDRESS, deploymentBlock: GNOSIS_DEPLOYMENT_BLOCK, rpc: GNOSIS_RPC },
]

async function countEventsInRange(contract: ethers.Contract, fromBlock: number, currentBlock: number) {
  const totals = { created: 0, claimed: 0, submitted: 0, approved: 0, rewardClaimed: 0 }

  for (let start = fromBlock; start <= currentBlock; start += MAX_LOG_BLOCK_RANGE) {
    const end = Math.min(start + MAX_LOG_BLOCK_RANGE - 1, currentBlock)

    const [created, claimed, submitted, approved, rewardClaimed] = await Promise.all([
      retryQuery(() => contract.queryFilter(contract.filters.TaskCreated(), start, end)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskClaimed(), start, end)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskSubmitted(), start, end)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskApproved(), start, end)),
      retryQuery(() => contract.queryFilter(contract.filters.RewardClaimed(), start, end)),
    ])

    totals.created += created.length
    totals.claimed += claimed.length
    totals.submitted += submitted.length
    totals.approved += approved.length
    totals.rewardClaimed += rewardClaimed.length
  }

  return totals
}

async function runStatsCheckpoint() {
  try {
    const supabase = await createClient()

    const totals = { created: 0, claimed: 0, submitted: 0, approved: 0, rewardClaimed: 0 }
    const perSource: Record<string, typeof totals> = {}

    for (const { source, contractAddress, deploymentBlock, rpc } of SOURCES) {
      const provider = new ethers.JsonRpcProvider(rpc)
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)

      const { data: syncState } = await supabase
        .from("stats_sync_state")
        .select("last_synced_block")
        .eq("source", source)
        .maybeSingle()

      const fromBlock = syncState?.last_synced_block ? syncState.last_synced_block + 1 : deploymentBlock
      const currentBlock = await provider.getBlockNumber()

      let sourceEvents = { created: 0, claimed: 0, submitted: 0, approved: 0, rewardClaimed: 0 }
      if (fromBlock <= currentBlock) {
        sourceEvents = await countEventsInRange(contract, fromBlock, currentBlock)
      }

      perSource[source] = sourceEvents
      totals.created += sourceEvents.created
      totals.claimed += sourceEvents.claimed
      totals.submitted += sourceEvents.submitted
      totals.approved += sourceEvents.approved
      totals.rewardClaimed += sourceEvents.rewardClaimed

      const { error: syncError } = await supabase
        .from("stats_sync_state")
        .upsert(
          { source, last_synced_block: currentBlock, updated_at: new Date().toISOString() },
          { onConflict: "source" }
        )

      if (syncError) {
        return NextResponse.json({ error: syncError.message }, { status: 500 })
      }
    }

    const today = new Date().toISOString().slice(0, 10)

    const { data: existingRow } = await supabase
      .from("stats_daily")
      .select("created, claimed, submitted, approved, reward_claimed")
      .eq("date", today)
      .maybeSingle()

    const created = (existingRow?.created ?? 0) + totals.created
    const claimed = (existingRow?.claimed ?? 0) + totals.claimed
    const submitted = (existingRow?.submitted ?? 0) + totals.submitted
    const approved = (existingRow?.approved ?? 0) + totals.approved
    const rewardClaimed = (existingRow?.reward_claimed ?? 0) + totals.rewardClaimed
    const interactions = created + claimed + submitted + approved + rewardClaimed

    const { error: dailyError } = await supabase
      .from("stats_daily")
      .upsert(
        {
          date: today,
          created,
          claimed,
          submitted,
          approved,
          reward_claimed: rewardClaimed,
          interactions,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "date" }
      )

    if (dailyError) {
      return NextResponse.json({ error: dailyError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, date: today, totals, perSource })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return runStatsCheckpoint()
}

export async function POST() {
  return runStatsCheckpoint()
}
