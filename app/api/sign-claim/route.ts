import { NextResponse } from "next/server"
import { createPublicClient, createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { celo } from "viem/chains"
import { EngagementRewardsSDK } from "@goodsdks/engagement-sdk"
import {
  ENGAGEMENT_REWARDS_CONTRACT,
  ENGAGEMENT_REWARDS_APP_ADDRESS,
} from "@/lib/engagement-rewards/config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { user, validUntilBlock } = body as {
    user?: string
    validUntilBlock?: string | number
    inviter?: string
  }

  if (!user || validUntilBlock === undefined || validUntilBlock === null) {
    return NextResponse.json(
      { error: "user and validUntilBlock are required" },
      { status: 400 },
    )
  }

  try {
    const ownerPrivateKey = process.env.ENGAGEMENT_REWARDS_OWNER_PRIVATE_KEY
    if (!ownerPrivateKey) {
      throw new Error("Missing signer configuration")
    }

    const account = privateKeyToAccount(ownerPrivateKey as `0x${string}`)

    const publicClient = createPublicClient({
      chain: celo,
      transport: http(),
    })

    const walletClient = createWalletClient({
      account,
      chain: celo,
      transport: http(),
    })

    const sdk = new EngagementRewardsSDK(
      publicClient,
      walletClient,
      ENGAGEMENT_REWARDS_CONTRACT,
    )

    const { domain, types, message } = await sdk.prepareAppSignature(
      ENGAGEMENT_REWARDS_APP_ADDRESS,
      user as `0x${string}`,
      BigInt(validUntilBlock),
    )

    const signature = await walletClient.signTypedData({
      account,
      domain,
      types,
      primaryType: "AppClaim",
      message,
    })

    return NextResponse.json({ signature })
  } catch (error) {
    console.error("sign-claim: failed to produce app signature")
    return NextResponse.json({ error: "Failed to sign claim" }, { status: 500 })
  }
}
