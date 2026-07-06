import { NextResponse } from "next/server"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request, { params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params
  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:xaman-payload-status`, 60, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const apiKey = process.env.XAMAN_API_KEY
  const apiSecret = process.env.XAMAN_API_SECRET
  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: "Missing Xaman API configuration" }, { status: 500 })
  }

  const xamanResponse = await fetch(`https://xumm.app/api/v1/platform/payload/${uuid}`, {
    headers: {
      "X-API-Key": apiKey,
      "X-API-Secret": apiSecret,
    },
  })

  if (!xamanResponse.ok) {
    return NextResponse.json({ error: "Failed to fetch Xaman payload status" }, { status: xamanResponse.status })
  }

  const data = await xamanResponse.json()

  return NextResponse.json({
    resolved: Boolean(data.meta?.resolved),
    signed: Boolean(data.meta?.signed),
    account: data.response?.account ?? null,
    txid: data.response?.txid ?? null,
  })
}
