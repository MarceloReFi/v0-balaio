import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:tasks-get`, 60, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const visibility = searchParams.get("visibility") ?? "public"
  const status = searchParams.get("status") ?? "open"

  const supabase = createClient()

  let query = supabase
    .from("tasks")
    .select(
      "id, title, description, reward, token, token_address, slots, claimed_slots, category, complexity, deadline, tags, visibility, creator_address"
    )
    .eq("visibility", visibility)

  if (status === "open") {
    query = query.filter("claimed_slots", "lt", "slots")
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:tasks-post`, 10, 60 * 1000)) {
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

  const b = body as Record<string, unknown>
  const { id, title, reward, token, tokenAddress, creatorAddress, slots } = b

  if (!id || !title || !reward || !token || !tokenAddress || !creatorAddress || !slots) {
    return NextResponse.json(
      { error: "Missing required fields: id, title, reward, token, tokenAddress, creatorAddress, slots" },
      { status: 400 }
    )
  }

  const supabase = createClient()

  const { error } = await supabase.from("tasks").upsert(
    {
      id,
      title,
      reward,
      token,
      token_address: tokenAddress,
      creator_address: creatorAddress,
      slots,
      description: b.description ?? null,
      visibility: b.visibility ?? "public",
      category: b.category ?? null,
      tags: b.tags ?? [],
      deadline: b.deadline ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
