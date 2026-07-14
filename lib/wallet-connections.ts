import { createClient } from "@/lib/supabase/client"

export async function recordWalletConnection(walletAddress: string): Promise<void> {
  if (!walletAddress) return
  const supabase = createClient()
  const normalized = walletAddress.toLowerCase()
  const now = new Date().toISOString()

  await supabase
    .from("wallet_connections")
    .upsert(
      { wallet_address: normalized, last_connected_at: now },
      { onConflict: "wallet_address", ignoreDuplicates: false }
    )
    .then(({ error }) => {
      if (error) console.error("[recordWalletConnection] error:", error)
    })
}
