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
const MAX_CHUNKS_PER_RUN = 8

type EventTotals = { created: number; claimed: number; submitted: number; approved: number; rewardClaimed: number }
type PerDate = Record<string, EventTotals>

const SOURCES = [
  { source: "celo_v1", contractAddress: CELO_CONTRACT_ADDRESS_V1, deploymentBlock: CELO_DEPLOYMENT_BLOCK_V1, rpc: CELO_RPC },
  { source: "celo_v2", contractAddress: CELO_CONTRACT_ADDRESS_V2, deploymentBlock: CELO_DEPLOYMENT_BLOCK_V2, rpc: CELO_RPC },
  { source: "gnosis", contractAddress: GNOSIS_CONTRACT_ADDRESS, deploymentBlock: GNOSIS_DEPLOYMENT_BLOCK, rpc: GNOSIS_RPC },
]

function emptyTotals(): EventTotals {
  return { created: 0, claimed: 0, submitted: 0, approved: 0, rewardClaimed: 0 }
}

function bumpDate(perDate: PerDate, date: string, type: keyof EventTotals) {
  if (!perDate[date]) perDate[date] = emptyTotals()
  perDate[date][type]++
}

async function processSource(
  provider: ethers.JsonRpcProvider,
  contract: ethers.Contract,
  fromBlock: number,
  currentBlock: number
) {
  const perDate: PerDate = {}
  const blockDateCache = new Map<number, string>()

  async function getBlockDate(blockNumber: number): Promise<string> {
    const cached = blockDateCache.get(blockNumber)
    if (cached) return cached
    const block = await retryQuery(() => provider.getBlock(blockNumber))
    const date = new Date((block?.timestamp ?? Date.now() / 1000) * 1000).toISOString().slice(0, 10)
    blockDateCache.set(blockNumber, date)
    return date
  }

  let lastProcessedBlock = fromBlock - 1
  let chunksProcessed = 0

  for (let start = fromBlock; start <= currentBlock && chunksProcessed < MAX_CHUNKS_PER_RUN; start += MAX_LOG_BLOCK_RANGE) {
    const end = Math.min(start + MAX_LOG_BLOCK_RANGE - 1, currentBlock)

    const [created, claimed, submitted, approved, rewardClaimed] = await Promise.all([
      retryQuery(() => contract.queryFilter(contract.filters.TaskCreated(), start, end)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskClaimed(), start, end)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskSubmitted(), start, end)),
      retryQuery(() => contract.queryFilter(contract.filters.TaskApproved(), start, end)),
      retryQuery(() => contract.queryFilter(contract.filters.RewardClaimed(), start, end)),
    ])

    for (const [events, type] of [
      [created, "created"],
      [claimed, "claimed"],
      [submitted, "submitted"],
      [approved, "approved"],
      [rewardClaimed, "rewardClaimed"],
    ] as const) {
      for (const e of events) {
        const date = await getBlockDate(e.blockNumber)
        bumpDate(perDate, date, type)
      }
    }

    lastProcessedBlock = end
    chunksProcessed++
  }

  return { perDate, lastProcessedBlock, done: lastProcessedBlock >= currentBlock }
}

async function runStatsCheckpoint() {
  const supabase = await createClient()

  try {
    const { data: lockRow, error: lockReadError } = await supabase
      .from("stats_sync_state")
      .select("last_synced_block, updated_at")
      .eq("source", "_lock")
      .maybeSingle()

    if (lockReadError) {
      return NextResponse.json(
        { error: `stats_sync_state lock read: ${lockReadError.message}` },
        { status: 500 }
      )
    }

    if (lockRow && Date.now() - new Date(lockRow.updated_at).getTime() < 60_000) {
      return NextResponse.json(
        { error: "Sync já em andamento (outra chamada ativa há menos de 60s). Aguarde e tente de novo." },
        { status: 429 }
      )
    }

    const { error: lockUpsertError } = await supabase
      .from("stats_sync_state")
      .upsert(
        { source: "_lock", last_synced_block: 0, updated_at: new Date().toISOString() },
        { onConflict: "source" }
      )

    if (lockUpsertError) {
      return NextResponse.json(
        { error: `stats_sync_state lock upsert: ${lockUpsertError.message}` },
        { status: 500 }
      )
    }

    let allDone = true
    const perSource: Record<string, { totals: EventTotals; done: boolean; lastProcessedBlock: number; currentBlock: number }> = {}

    for (const { source, contractAddress, deploymentBlock, rpc } of SOURCES) {
      const provider = new ethers.JsonRpcProvider(rpc)
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)

      const { data: syncState, error: syncReadError } = await supabase
        .from("stats_sync_state")
        .select("last_synced_block")
        .eq("source", source)
        .maybeSingle()

      if (syncReadError) {
        return NextResponse.json(
          { error: `stats_sync_state read (${source}): ${syncReadError.message}` },
          { status: 500 }
        )
      }

      const fromBlock = syncState?.last_synced_block ? syncState.last_synced_block + 1 : deploymentBlock
      const currentBlock = await provider.getBlockNumber()

      const sourceTotals = emptyTotals()

      if (fromBlock <= currentBlock) {
        const { perDate, lastProcessedBlock, done } = await processSource(provider, contract, fromBlock, currentBlock)
        if (!done) allDone = false

        for (const [date, counts] of Object.entries(perDate)) {
          const { data: existingRow, error: dailyReadError } = await supabase
            .from("stats_daily")
            .select("created, claimed, submitted, approved, reward_claimed")
            .eq("date", date)
            .maybeSingle()

          if (dailyReadError) {
            return NextResponse.json(
              { error: `stats_daily read (${date}): ${dailyReadError.message}` },
              { status: 500 }
            )
          }

          const created = (existingRow?.created ?? 0) + counts.created
          const claimed = (existingRow?.claimed ?? 0) + counts.claimed
          const submitted = (existingRow?.submitted ?? 0) + counts.submitted
          const approved = (existingRow?.approved ?? 0) + counts.approved
          const rewardClaimed = (existingRow?.reward_claimed ?? 0) + counts.rewardClaimed

          const { error: dailyUpsertError } = await supabase.from("stats_daily").upsert(
            {
              date,
              created,
              claimed,
              submitted,
              approved,
              reward_claimed: rewardClaimed,
              interactions: created + claimed + submitted + approved + rewardClaimed,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "date" }
          )

          if (dailyUpsertError) {
            return NextResponse.json(
              { error: `stats_daily upsert (${date}): ${dailyUpsertError.message}` },
              { status: 500 }
            )
          }

          sourceTotals.created += counts.created
          sourceTotals.claimed += counts.claimed
          sourceTotals.submitted += counts.submitted
          sourceTotals.approved += counts.approved
          sourceTotals.rewardClaimed += counts.rewardClaimed
        }

        const { error: syncUpsertError } = await supabase
          .from("stats_sync_state")
          .upsert(
            { source, last_synced_block: lastProcessedBlock, updated_at: new Date().toISOString() },
            { onConflict: "source" }
          )

        if (syncUpsertError) {
          return NextResponse.json(
            { error: `stats_sync_state upsert (${source}): ${syncUpsertError.message}` },
            { status: 500 }
          )
        }

        perSource[source] = { totals: sourceTotals, done, lastProcessedBlock, currentBlock }
      } else {
        perSource[source] = { totals: sourceTotals, done: true, lastProcessedBlock: fromBlock - 1, currentBlock }
      }
    }

    await supabase.from("stats_sync_state").delete().eq("source", "_lock")

    return NextResponse.json({ success: true, done: allDone, perSource })
  } catch (error) {
    await supabase.from("stats_sync_state").delete().eq("source", "_lock")

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
