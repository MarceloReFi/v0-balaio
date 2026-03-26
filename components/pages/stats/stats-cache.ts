import type { StatsData } from "./blockchain-stats"

interface CachedStats {
  data: StatsData
  timestamp: number
}

let quickStatsCache: CachedStats | null = null
let fullHistoryCache: CachedStats | null = null

const QUICK_CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 hours
const FULL_HISTORY_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Quick stats (90 days) cache
export function getCachedStats(): StatsData | null {
  if (!quickStatsCache) return null

  const now = Date.now()
  const isExpired = now - quickStatsCache.timestamp > QUICK_CACHE_DURATION

  if (isExpired) {
    quickStatsCache = null
    return null
  }

  return quickStatsCache.data
}

export function setCachedStats(data: StatsData): void {
  quickStatsCache = {
    data,
    timestamp: Date.now(),
  }
}

// Full history cache (separate, longer duration)
export function getCachedFullHistory(): StatsData | null {
  if (!fullHistoryCache) return null

  const now = Date.now()
  const isExpired = now - fullHistoryCache.timestamp > FULL_HISTORY_CACHE_DURATION

  if (isExpired) {
    fullHistoryCache = null
    return null
  }

  return fullHistoryCache.data
}

export function setCachedFullHistory(data: StatsData): void {
  fullHistoryCache = {
    data,
    timestamp: Date.now(),
  }
}

export function clearCache(): void {
  quickStatsCache = null
  fullHistoryCache = null
}
