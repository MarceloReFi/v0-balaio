import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:tasks-submit`, 20, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const { workerAddress, submissionLink } = body as Record<string, unknown>

  if (!workerAddress || !submissionLink) {
    return NextResponse.json({ error: "Missing required fields: workerAddress, submissionLink" }, { status: 400 })
  }

  const supabase = createClient()

  const { error } = await supabase.from("task_claims").upsert(
    {
      task_id: params.id,
      worker_address: String(workerAddress).toLowerCase(),
      submission_link: submissionLink,
      submitted_at: new Date().toISOString(),
    },
    { onConflict: "task_id,worker_address" }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
