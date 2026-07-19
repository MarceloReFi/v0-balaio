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
  "event TaskSubmitted(string indexed taskId, address indexed claimant, string proofHash)",
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
    counts[isoDate] = { created: 0, claimed: 0, submitted: 0, approved: 0, rewardClaimed: 0 }
  }
  counts[isoDate][type]++
}

async function retryQuery(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      console.warn(`  retry ${i + 1}/${maxRetries} after error: ${error.message}`)
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)))
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = process.env
  if (!NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local")
  if (!NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local")

  const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

  let grandTotalCreated = 0
  let grandTotalInteractions = 0

  for (const { source, contractAddress, deploymentBlock, rpc, blocksPerDay } of SOURCES) {
    console.log(`\n[${source}] connecting to ${rpc}...`)

    const provider = new ethers.JsonRpcProvider(rpc)
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)
    const currentBlock = await provider.getBlockNumber()

    const totalBlocks = Math.max(1, currentBlock - deploymentBlock)
    console.log(`[${source}] scanning blocks ${deploymentBlock} to ${currentBlock}`)

    const counts = {}

    for (let start = deploymentBlock; start <= currentBlock; start += MAX_LOG_BLOCK_RANGE) {
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
      ]) {
        for (const e of events) {
          bumpDay(counts, isoDateFromBlock(e.blockNumber, currentBlock, blocksPerDay), type)
        }
      }

      const pct = Math.min(100, Math.round(((end - deploymentBlock + 1) / totalBlocks) * 100))
      console.log(`[${source}] blocks ${start}-${end} — ${pct}% done`)
    }

    const dates = Object.keys(counts)

    const { data: existingRows, error: fetchError } = await supabase
      .from("stats_daily")
      .select("date, created, claimed, submitted, approved, reward_claimed")
      .in("date", dates)

    if (fetchError) throw new Error(`[${source}] Failed to read existing stats_daily rows: ${fetchError.message}`)

    const existingMap = Object.fromEntries((existingRows ?? []).map((row) => [row.date, row]))

    const dailyRows = dates.map((date) => {
      const existing = existingMap[date]
      const created = (existing?.created ?? 0) + counts[date].created
      const claimed = (existing?.claimed ?? 0) + counts[date].claimed
      const submitted = (existing?.submitted ?? 0) + counts[date].submitted
      const approved = (existing?.approved ?? 0) + counts[date].approved
      const rewardClaimed = (existing?.reward_claimed ?? 0) + counts[date].rewardClaimed

      return {
        date,
        created,
        claimed,
        submitted,
        approved,
        reward_claimed: rewardClaimed,
        interactions: created + claimed + submitted + approved + rewardClaimed,
        updated_at: new Date().toISOString(),
      }
    })

    if (dailyRows.length > 0) {
      const { error: upsertError } = await supabase.from("stats_daily").upsert(dailyRows, { onConflict: "date" })
      if (upsertError) throw new Error(`[${source}] Failed to upsert stats_daily: ${upsertError.message}`)
    }

    const { error: syncError } = await supabase
      .from("stats_sync_state")
      .upsert(
        { source, last_synced_block: currentBlock, updated_at: new Date().toISOString() },
        { onConflict: "source" }
      )
    if (syncError) throw new Error(`[${source}] Failed to upsert stats_sync_state: ${syncError.message}`)

    const sourceCreated = dates.reduce((sum, date) => sum + counts[date].created, 0)
    const sourceInteractions = dates.reduce(
      (sum, date) =>
        sum +
        counts[date].created +
        counts[date].claimed +
        counts[date].submitted +
        counts[date].approved +
        counts[date].rewardClaimed,
      0
    )

    grandTotalCreated += sourceCreated
    grandTotalInteractions += sourceInteractions

    console.log(
      `[${source}] wrote ${dates.length} days, ${sourceInteractions} events. last_synced_block=${currentBlock}`
    )
  }

  console.log(`\nDone. ${grandTotalCreated} tasks created, ${grandTotalInteractions} total interactions recorded.`)
}

main().catch((err) => {
  console.error("\nFatal:", err.message)
  process.exit(1)
})
