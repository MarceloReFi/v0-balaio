import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:xrpl-approve`, 20, 60 * 1000)) {
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

  const { taskId } = body as Record<string, unknown>

  if (!taskId || typeof taskId !== "string") {
    return NextResponse.json({ error: "Missing required field: taskId" }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("xrpl_escrows")
    .select("condition, fulfillment, sequence")
    .eq("task_id", taskId)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: `No escrow found for taskId ${taskId}` }, { status: 404 })
  }

  return NextResponse.json({
    fulfillment: data.fulfillment,
    condition: data.condition,
    sequence: data.sequence,
  })
}
