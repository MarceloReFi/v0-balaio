import { NextResponse } from "next/server"
import * as xrpl from "xrpl"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { XRPL_RPC, XRPL_SOURCE_TAG } from "@/lib/chain/config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:xrpl-payout`, 20, 60 * 1000)) {
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

  const { taskId, workerAddress } = body as Record<string, unknown>

  if (!taskId || typeof taskId !== "string") {
    return NextResponse.json({ error: "Missing required field: taskId" }, { status: 400 })
  }
  if (!workerAddress || typeof workerAddress !== "string") {
    return NextResponse.json({ error: "Missing required field: workerAddress" }, { status: 400 })
  }

  const oracleSeed = process.env.XRPL_ORACLE_SEED
  if (!oracleSeed) {
    return NextResponse.json({ error: "Missing XRPL_ORACLE_SEED configuration" }, { status: 500 })
  }

  const supabase = await createClient()

  const { data: claimRow, error: claimError } = await supabase
    .from("task_claims")
    .select("approved_at, withdrawn_at")
    .eq("task_id", taskId)
    .eq("worker_address", workerAddress)
    .maybeSingle()

  if (claimError) {
    return NextResponse.json({ error: claimError.message }, { status: 500 })
  }

  if (!claimRow?.approved_at) {
    return NextResponse.json({ error: "Task claim has not been approved" }, { status: 400 })
  }

  if (claimRow.withdrawn_at) {
    return NextResponse.json({ error: "Payout already sent for this claim" }, { status: 409 })
  }

  const { data: taskRow, error: taskError } = await supabase
    .from("tasks")
    .select("reward")
    .eq("id", taskId)
    .maybeSingle()

  if (taskError) {
    return NextResponse.json({ error: taskError.message }, { status: 500 })
  }

  if (!taskRow) {
    return NextResponse.json({ error: `No task found for taskId ${taskId}` }, { status: 404 })
  }

  const oracleWallet = xrpl.Wallet.fromSeed(oracleSeed)
  const amountDrops = xrpl.xrpToDrops(taskRow.reward)

  const client = new xrpl.Client(XRPL_RPC)
  let result
  try {
    await client.connect()
    result = await client.submitAndWait(
      {
        TransactionType: "Payment",
        Account: oracleWallet.classicAddress,
        Destination: workerAddress,
        Amount: amountDrops,
        SourceTag: XRPL_SOURCE_TAG,
      },
      { wallet: oracleWallet, autofill: true }
    )
  } finally {
    await client.disconnect()
  }

  const transactionResult = (result.result.meta as { TransactionResult?: string } | undefined)?.TransactionResult

  if (transactionResult !== "tesSUCCESS") {
    return NextResponse.json({ error: transactionResult }, { status: 502 })
  }

  const { error: updateError } = await supabase
    .from("task_claims")
    .update({ withdrawn_at: new Date().toISOString() })
    .eq("task_id", taskId)
    .eq("worker_address", workerAddress)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ hash: result.result.hash })
}
