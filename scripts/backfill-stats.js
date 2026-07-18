#!/usr/bin/env node
/**
 * Balaio — Stats Backfill
 * Usage: node scripts/backfill-stats.js
 *
 * Walks the full on-chain history of every EVM source, buckets the events
 * into daily counts, and seeds stats_daily / stats_sync_state so the daily
 * /api/cron/stats-checkpoint cron can continue from where this leaves off.
 *
 * Required .env:
 *   NEXT_PUBLIC_SUPABASE_URL=https://...
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
 */

require("dotenv").config({ path: ".env.local" })
const { ethers } = require("ethers")
const { createClient } = require("@supabase/supabase-js")

// ─── Config ──────────────────────────────────────────────────────────────────

const MAX_LOG_BLOCK_RANGE = 5000

const CELO_RPC = "https://forno.celo.org"
const GNOSIS_RPC = "https://rpc.gnosischain.com"

// Celo L2 ~1s/block; Gnosis ~5s/block (matches BLOCKS_PER_DAY in lib/config.ts)
const CELO_BLOCKS_PER_DAY = 86400
const GNOSIS_BLOCKS_PER_DAY = 17280

const CONTRACT_ABI = [
  "event TaskCreated(string indexed taskId, address indexed creator, address token, uint256 rewardPerSlot, uint256 totalSlots)",
  "event TaskClaimed(string indexed taskId, address indexed claimant)",
  "event TaskApproved(string indexed taskId, address indexed claimant, uint256 reward)",
  "event RewardClaimed(string indexed taskId, address indexed claimant, uint256 amount)",
]

const SOURCES = [
  {
    source: "celo_v1",
    contractAddress: "0xf7317849bd10a41fbebd9edcd56f05e1d0b7ab2e",
    deploymentBlock: 51778358,
    rpc: CELO_RPC,
    blocksPerDay: CELO_BLOCKS_PER_DAY,
  },
  {
    source: "celo_v2",
    contractAddress: "0xe60aa33E8Dee3Bb1B2218bF025AcB624312D519E",
    deploymentBlock: 67475023,
    rpc: CELO_RPC,
    blocksPerDay: CELO_BLOCKS_PER_DAY,
  },
  {
    source: "gnosis",
    contractAddress: "0x7Ac98D973C45E84780e314Ef745f11db85ad8cf2",
    deploymentBlock: 45818592,
    rpc: GNOSIS_RPC,
    blocksPerDay: GNOSIS_BLOCKS_PER_DAY,
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isoDateFromBlock(blockNumber, currentBlock, blocksPerDay) {
  const daysAgo = Math.floor((currentBlock - blockNumber) / blocksPerDay)
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
  return date.toISOString().slice(0, 10)
}

function bumpDay(counts, isoDate, type) {
  if (!counts[isoDate]) {
    counts[isoDate] = { created: 0, claimed: 0, approved: 0, rewardClaimed: 0 }
  }
  counts[isoDate][type]++
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = process.env
  if (!NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local")
  if (!NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local")

  const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const counts = {}
  const syncStateRows = []

  for (const { source, contractAddress, deploymentBlock, rpc, blocksPerDay } of SOURCES) {
    console.log(`\n[${source}] connecting to ${rpc}...`)

    const provider = new ethers.JsonRpcProvider(rpc)
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)
    const currentBlock = await provider.getBlockNumber()

    const totalBlocks = Math.max(1, currentBlock - deploymentBlock)
    console.log(`[${source}] scanning blocks ${deploymentBlock} to ${currentBlock}`)

    for (let start = deploymentBlock; start <= currentBlock; start += MAX_LOG_BLOCK_RANGE) {
      const end = Math.min(start + MAX_LOG_BLOCK_RANGE - 1, currentBlock)

      const [created, claimed, approved, rewardClaimed] = await Promise.all([
        contract.queryFilter(contract.filters.TaskCreated(), start, end),
        contract.queryFilter(contract.filters.TaskClaimed(), start, end),
        contract.queryFilter(contract.filters.TaskApproved(), start, end),
        contract.queryFilter(contract.filters.RewardClaimed(), start, end),
      ])

      for (const [events, type] of [
        [created, "created"],
        [claimed, "claimed"],
        [approved, "approved"],
        [rewardClaimed, "rewardClaimed"],
      ]) {
        for (const e of events) {
          bumpDay(counts, isoDateFromBlock(e.blockNumber, currentBlock, blocksPerDay), type)
        }
      }

      const pct = Math.min(100, Math.round(((end - deploymentBlock + 1) / totalBlocks) * 100))
      console.log(`[${source}] blocks ${start}-${end} — ${pct}% done`)
    }

    syncStateRows.push({ source, last_synced_block: currentBlock, updated_at: new Date().toISOString() })
    console.log(`[${source}] done. last_synced_block=${currentBlock}`)
  }

  const dates = Object.keys(counts)
  console.log(`\nAccumulated ${dates.length} distinct days. Upserting into stats_daily...`)

  const { data: existingRows, error: fetchError } = await supabase
    .from("stats_daily")
    .select("date, created, claimed, approved, reward_claimed")
    .in("date", dates)

  if (fetchError) throw new Error(`Failed to read existing stats_daily rows: ${fetchError.message}`)

  const existingMap = Object.fromEntries((existingRows ?? []).map((row) => [row.date, row]))

  const dailyRows = dates.map((date) => {
    const existing = existingMap[date]
    const created = (existing?.created ?? 0) + counts[date].created
    const claimed = (existing?.claimed ?? 0) + counts[date].claimed
    const approved = (existing?.approved ?? 0) + counts[date].approved
    const rewardClaimed = (existing?.reward_claimed ?? 0) + counts[date].rewardClaimed

    return {
      date,
      created,
      claimed,
      approved,
      reward_claimed: rewardClaimed,
      interactions: created + claimed + approved + rewardClaimed,
      updated_at: new Date().toISOString(),
    }
  })

  const { error: upsertError } = await supabase.from("stats_daily").upsert(dailyRows, { onConflict: "date" })
  if (upsertError) throw new Error(`Failed to upsert stats_daily: ${upsertError.message}`)

  console.log("Recording sync checkpoints in stats_sync_state...")
  const { error: syncError } = await supabase
    .from("stats_sync_state")
    .upsert(syncStateRows, { onConflict: "source" })
  if (syncError) throw new Error(`Failed to upsert stats_sync_state: ${syncError.message}`)

  const totalInteractions = dailyRows.reduce((sum, row) => sum + row.interactions, 0)
  const totalCreated = dailyRows.reduce((sum, row) => sum + row.created, 0)
  console.log(
    `\nDone. ${dailyRows.length} days written, ${totalCreated} tasks created, ${totalInteractions} total interactions recorded.`
  )
}

main().catch((err) => {
  console.error("\nFatal:", err.message)
  process.exit(1)
})
