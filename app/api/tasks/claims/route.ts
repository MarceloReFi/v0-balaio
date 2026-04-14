import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:tasks-claims`, 30, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body || typeof body !== "object" || !Array.isArray((body as any).taskIds)) {
    return NextResponse.json({ error: "taskIds must be an array" }, { status: 400 })
  }

  const taskIds: string[] = (body as any).taskIds

  const supabase = createClient()

  const { data, error } = await supabase
    .from("task_claims")
    .select("task_id, worker_address, submission_link, submitted_at, approved_at")
    .in("task_id", taskIds)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const result: Record<string, Array<{
    workerAddress: string
    submissionLink: string | null
    hasSubmitted: boolean
    hasApproved: boolean
  }>> = {}

  for (const row of (data ?? [])) {
    const taskId = row.task_id
    if (!result[taskId]) result[taskId] = []
    result[taskId].push({
      workerAddress: row.worker_address,
      submissionLink: row.submission_link ?? null,
      hasSubmitted: !!row.submitted_at,
      hasApproved: !!row.approved_at,
    })
  }

  return NextResponse.json(result)
}
