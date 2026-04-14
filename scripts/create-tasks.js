#!/usr/bin/env node
/**
 * Balaio — Bulk Task Creator
 * Usage: node scripts/create-tasks.js tasks.csv
 *
 * Required .env:
 *   CREATOR_PRIVATE_KEY=0x...
 *   NEXT_PUBLIC_SUPABASE_URL=https://...
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
 */

require("dotenv").config({ path: ".env.local" })
const { ethers } = require("ethers")
const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

// ─── Config ──────────────────────────────────────────────────────────────────

const RPC_URL = "https://forno.celo.org"
const CONTRACT_ADDRESS = "0xf7317849bd10a41fbebd9edcd56f05e1d0b7ab2e"

const CONTRACT_ABI = [
  "function createTask(string _taskId, address _token, uint256 _rewardPerSlot, uint256 _totalSlots, address _approver) external",
]

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
]

const TOKENS = {
  cUSD:  { address: "0x765DE816845861e75A25fCA122bb6898B8B1282a", decimals: 18 },
  cREAL: { address: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787", decimals: 18 },
  USDC:  { address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C", decimals: 6  },
  "G$":  { address: "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A", decimals: 18 },
  CELO:  { address: "0x471EcE3750Da237f93B8E339c536989b8978a438", decimals: 18 },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseCSV(filePath) {
  const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim())
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]))
  })
}

function log(i, total, taskId, msg) {
  console.log(`[${i}/${total}] ${taskId} — ${msg}`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const csvPath = process.argv[2]
  if (!csvPath) {
    console.error("Usage: node scripts/create-tasks.js tasks.csv")
    process.exit(1)
  }

  const { CREATOR_PRIVATE_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = process.env
  if (!CREATOR_PRIVATE_KEY) throw new Error("Missing CREATOR_PRIVATE_KEY in .env.local")
  if (!NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local")
  if (!NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local")

  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const wallet = new ethers.Wallet(CREATOR_PRIVATE_KEY, provider)
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet)
  const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const tasks = parseCSV(path.resolve(csvPath))
  console.log(`\nLoaded ${tasks.length} tasks from ${csvPath}`)
  console.log(`Creator wallet: ${wallet.address}\n`)

  // Pre-approve each token once (max allowance)
  const tokensNeeded = [...new Set(tasks.map((t) => t.token))]
  for (const symbol of tokensNeeded) {
    const token = TOKENS[symbol]
    if (!token) throw new Error(`Unknown token: ${symbol}. Supported: ${Object.keys(TOKENS).join(", ")}`)

    const tokenContract = new ethers.Contract(token.address, ERC20_ABI, wallet)

    // Compute total deposit needed for this token
    const total = tasks
      .filter((t) => t.token === symbol)
      .reduce((sum, t) => sum + ethers.parseUnits(t.reward, token.decimals) * BigInt(t.slots || 1), 0n)

    const balance = await tokenContract.balanceOf(wallet.address)
    if (balance < total) {
      const needed = ethers.formatUnits(total, token.decimals)
      const have = ethers.formatUnits(balance, token.decimals)
      throw new Error(`Insufficient ${symbol}: need ${needed}, have ${have}`)
    }

    const allowance = await tokenContract.allowance(wallet.address, CONTRACT_ADDRESS)
    if (allowance < total) {
      console.log(`Approving ${symbol}...`)
      const tx = await tokenContract.approve(CONTRACT_ADDRESS, ethers.MaxUint256)
      await tx.wait()
      console.log(`${symbol} approved ✓\n`)
    } else {
      console.log(`${symbol} already approved ✓\n`)
    }
  }

  // Create tasks sequentially
  let success = 0
  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i]
    const n = i + 1
    const token = TOKENS[t.token]

    try {
      const rewardWei = ethers.parseUnits(t.reward, token.decimals)
      const slots = t.slots || "1"
      const approver = t.approver || wallet.address

      log(n, tasks.length, t.id, "creating on-chain...")
      const tx = await contract.createTask(t.id, token.address, rewardWei, slots, approver)
      const receipt = await tx.wait()
      log(n, tasks.length, t.id, `tx ${receipt.hash}`)

      log(n, tasks.length, t.id, "saving to Supabase...")
      const { error } = await supabase.from("tasks").upsert(
        {
          id: t.id,
          title: t.title,
          description: t.description || null,
          reward: t.reward,
          token: t.token,
          token_address: token.address,
          creator_address: wallet.address.toLowerCase(),
          status: 0,
          slots: parseInt(slots),
          claimed_slots: 0,
          category: t.category || "other",
          complexity: t.complexity || "medium",
          visibility: t.visibility || "public",
          deadline: t.deadline || null,
          tags: t.tags ? t.tags.split("|") : [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )

      if (error) {
        log(n, tasks.length, t.id, `⚠ on-chain OK but Supabase failed: ${error.message}`)
      } else {
        log(n, tasks.length, t.id, "✓ done")
        success++
      }
    } catch (err) {
      log(n, tasks.length, t.id, `✗ ERROR: ${err.message}`)
    }
  }

  console.log(`\nDone. ${success}/${tasks.length} tasks created successfully.`)
}

main().catch((err) => {
  console.error("\nFatal:", err.message)
  process.exit(1)
})
