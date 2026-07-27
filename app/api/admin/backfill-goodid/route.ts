import { NextRequest, NextResponse } from "next/server"
import { createPublicClient, http, zeroAddress, type Address } from "viem"
import { celo } from "viem/chains"
import { chainConfigs, identityV2ABI, SupportedChains } from "@goodsdks/citizen-sdk"
import { CELO_RPC } from "@/lib/config"
import { createClient } from "@/lib/supabase/server"

const IDENTITY_CONTRACT = chainConfigs[SupportedChains.CELO].contracts.production!.identityContract

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const offset = body.offset ?? 0
    const batchSize = body.batchSize ?? 8

    const supabase = await createClient()
    const { data: rows, error } = await supabase
      .from("wallet_connections")
      .select("wallet_address")
      .eq("is_goodid_verified", false)
      .order("wallet_address", { ascending: true })
      .range(offset, offset + batchSize - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ done: true, checked: 0, verified: 0 })
    }

    const publicClient = createPublicClient({ chain: celo, transport: http(CELO_RPC) })

    let verifiedCount = 0
    for (const row of rows) {
      try {
        const root = await publicClient.readContract({
          address: IDENTITY_CONTRACT,
          abi: identityV2ABI,
          functionName: "getWhitelistedRoot",
          args: [row.wallet_address as Address],
        })
        const isWhitelisted = root !== zeroAddress
        if (isWhitelisted) {
          const now = new Date().toISOString()
          const { error: updateError } = await supabase
            .from("wallet_connections")
            .update({ is_goodid_verified: true, goodid_verified_at: now })
            .eq("wallet_address", row.wallet_address)
          if (updateError) {
            console.error(`[backfill-goodid] update error for ${row.wallet_address}:`, updateError)
          } else {
            verifiedCount++
          }
        }
      } catch (err) {
        console.error(`[backfill-goodid] getWhitelistedRoot error for ${row.wallet_address}:`, err)
      }
    }

    return NextResponse.json({
      done: rows.length < batchSize,
      checked: rows.length,
      verified: verifiedCount,
      nextOffset: offset + rows.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
