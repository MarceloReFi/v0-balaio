interface CachedEntry {
  data: unknown
  timestamp: number
}

let quickStatsCache: CachedEntry | null = null
let fullHistoryCache: CachedEntry | null = null

const STATS_CACHE_DURATION = 60 * 60 * 1000 // 1 hour — stats_daily only advances once a day via cron

// Quick stats (60 days) cache
export function getCachedStats<T>(): T | null {
  if (!quickStatsCache) return null

  const now = Date.now()
  const isExpired = now - quickStatsCache.timestamp > STATS_CACHE_DURATION

  if (isExpired) {
    quickStatsCache = null
    return null
  }

  return quickStatsCache.data as T
}

export function setCachedStats<T>(data: T): void {
  quickStatsCache = {
    data,
    timestamp: Date.now(),
  }
}

// Full history cache (separate store, same duration)
export function getCachedFullHistory<T>(): T | null {
  if (!fullHistoryCache) return null

  const now = Date.now()
  const isExpired = now - fullHistoryCache.timestamp > STATS_CACHE_DURATION

  if (isExpired) {
    fullHistoryCache = null
    return null
  }

  return fullHistoryCache.data as T
}

export function setCachedFullHistory<T>(data: T): void {
  fullHistoryCache = {
    data,
    timestamp: Date.now(),
  }
}

export function clearCache(): void {
  quickStatsCache = null
  fullHistoryCache = null
}
