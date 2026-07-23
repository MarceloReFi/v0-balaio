"use client"

import * as xrpl from "xrpl"
import {
  WalletManager,
  XamanAdapter,
  CrossmarkAdapter,
  GemWalletAdapter,
  WalletConnectAdapter,
  LedgerAdapter,
  XyraAdapter,
  OtsuAdapter,
} from "xrpl-connect"
import { XRPL_RPC } from "@/lib/config"

export const rippleWalletManager = new WalletManager({
  adapters: [
    new XamanAdapter({ apiKey: process.env.NEXT_PUBLIC_XAMAN_API_KEY }),
    new CrossmarkAdapter(),
    new GemWalletAdapter(),
    new WalletConnectAdapter({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID }),
    new LedgerAdapter(),
    new XyraAdapter(),
    new OtsuAdapter(),
  ],
  network: "mainnet",
  autoConnect: true,
})

async function withXrplClient<T>(fn: (client: xrpl.Client) => Promise<T>): Promise<T> {
  const client = new xrpl.Client(XRPL_RPC)
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.disconnect()
  }
}

export async function signRipple(tx: object) {
  return rippleWalletManager.signAndSubmit(tx)
}

export async function signRippleAndGetSequence(tx: object): Promise<{ hash: string; sequence: number }> {
  const { hash } = await rippleWalletManager.signAndSubmit(tx)

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
