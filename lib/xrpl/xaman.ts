"use client"

import * as xrpl from "xrpl"
import { XRPL_RPC } from "@/lib/config"

const POLL_INTERVAL_MS = 2000
const POLL_TIMEOUT_MS = 5 * 60 * 1000

interface PayloadStatus {
  resolved: boolean
  signed: boolean
  account: string | null
  txid: string | null
}

function requireApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_XAMAN_API_KEY
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_XAMAN_API_KEY configuration")
  }
  return apiKey
}

async function createPayload(txjson: object): Promise<{ uuid: string; deepLink: string }> {
  const response = await fetch("/api/xaman/payload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ txjson }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || "Failed to create Xaman payload")
  }

  return data
}

async function waitForPayload(uuid: string): Promise<PayloadStatus> {
  const deadline = Date.now() + POLL_TIMEOUT_MS

  while (Date.now() < deadline) {
    const response = await fetch(`/api/xaman/payload/${uuid}`)
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch Xaman payload status")
    }

    if (data.resolved) {
      return data
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }

  throw new Error("Timed out waiting for Xaman confirmation")
}

async function withXrplClient<T>(fn: (client: xrpl.Client) => Promise<T>): Promise<T> {
  const client = new xrpl.Client(XRPL_RPC)
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.disconnect()
  }
}

export async function connectXaman(): Promise<string> {
  requireApiKey()

  const { uuid, deepLink } = await createPayload({ TransactionType: "SignIn" })
  window.open(deepLink, "_blank")

  const status = await waitForPayload(uuid)
  if (!status.signed || !status.account) {
    throw new Error("Xaman sign-in was not completed")
  }

  return status.account
}

export async function signAndSubmit(tx: object): Promise<{ hash: string; sequence: number }> {
  requireApiKey()

  const { uuid, deepLink } = await createPayload(tx)
  window.open(deepLink, "_blank")

  const status = await waitForPayload(uuid)
  if (!status.signed || !status.txid) {
    throw new Error("Xaman transaction was not signed")
  }

  const hash = status.txid
  const sequence = await withXrplClient(async (client) => {
    const result = await client.request({ command: "tx", transaction: hash })
    const resultData = result.result as { Sequence?: number; tx_json?: { Sequence?: number } }
    const txSequence = resultData.Sequence ?? resultData.tx_json?.Sequence
    if (txSequence === undefined) {
      throw new Error("Confirmed transaction is missing a Sequence number")
    }
    return txSequence
  })

  return { hash, sequence }
}

export async function getXrpBalance(address: string): Promise<string> {
  return withXrplClient(async (client) => {
    const response = await client.request({ command: "account_info", account: address })
    return String(xrpl.dropsToXrp(response.result.account_data.Balance))
  })
}
