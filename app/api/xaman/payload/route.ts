import { NextResponse } from "next/server"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const XAMAN_PAYLOAD_URL = "https://xumm.app/api/v1/platform/payload"

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:xaman-payload-create`, 20, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body || typeof body !== "object" || !("txjson" in body)) {
    return NextResponse.json({ error: "Missing required field: txjson" }, { status: 400 })
  }

  const apiKey = process.env.XAMAN_API_KEY
  const apiSecret = process.env.XAMAN_API_SECRET
  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: "Missing Xaman API configuration" }, { status: 500 })
  }

  const xamanResponse = await fetch(XAMAN_PAYLOAD_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      "X-API-Secret": apiSecret,
    },
    body: JSON.stringify({ txjson: (body as { txjson: unknown }).txjson }),
  })

  if (!xamanResponse.ok) {
    return NextResponse.json({ error: "Failed to create Xaman payload" }, { status: xamanResponse.status })
  }

  const data = await xamanResponse.json()

  if (!data.uuid || !data.next?.always) {
    return NextResponse.json({ error: "Xaman response missing uuid or deep link" }, { status: 502 })
  }

  return NextResponse.json({ uuid: data.uuid as string, deepLink: data.next.always as string })
}
