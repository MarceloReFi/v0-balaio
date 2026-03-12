import type { StatsData } from "./blockchain-stats"

interface CachedStats {
  data: StatsData
  timestamp: number
}

let cache: CachedStats | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export function getCachedStats(): StatsData | null {
  if (!cache) return null

  const now = Date.now()
  const isExpired = now - cache.timestamp > CACHE_DURATION

  if (isExpired) {
    cache = null
    return null
  }

  return cache.data
}

export function setCachedStats(data: StatsData): void {
  cache = {
    data,
    timestamp: Date.now(),
  }
}

export function clearCache(): void {
  cache = null
}
