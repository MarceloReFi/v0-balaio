import { NextResponse } from "next/server"
import * as xrpl from "xrpl"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { generateEscrowPair, buildEscrowCreate, rippleTimeFromDate } from "@/app/api/xrpl/lib"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:xrpl-create`, 20, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { taskId, ownerAddress, amountDrops } = body as Record<string, unknown>

  if (!taskId || typeof taskId !== "string") {
    return NextResponse.json({ error: "Missing required field: taskId" }, { status: 400 })
  }
  if (!ownerAddress || typeof ownerAddress !== "string") {
    return NextResponse.json({ error: "Missing required field: ownerAddress" }, { status: 400 })
  }
  if (!amountDrops || typeof amountDrops !== "string") {
    return NextResponse.json({ error: "Missing required field: amountDrops" }, { status: 400 })
  }

  const oracleSeed = process.env.XRPL_ORACLE_SEED
  if (!oracleSeed) {
    return NextResponse.json({ error: "Missing XRPL_ORACLE_SEED configuration" }, { status: 500 })
  }

  const oracleWallet = xrpl.Wallet.fromSeed(oracleSeed)
  const { condition, fulfillment } = generateEscrowPair()
  const cancelAfter = rippleTimeFromDate(new Date(Date.now() + THIRTY_DAYS_MS))

  const escrowCreateTx = buildEscrowCreate({
    ownerAddress,
    destinationAddress: oracleWallet.classicAddress,
    amountDrops,
    condition,
    cancelAfterRippleEpoch: cancelAfter,
  })

  const supabase = await createClient()

  const { error } = await supabase.from("xrpl_escrows").insert({
    task_id: taskId,
    condition,
    fulfillment,
    cancel_after: cancelAfter,
    owner_account: ownerAddress,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ condition, escrowCreateTx })
}
