import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null

export function createClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables")
  }

  supabaseInstance = createSupabaseClient(url, key)
  return supabaseInstance
}
