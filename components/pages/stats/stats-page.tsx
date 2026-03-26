"use client"
import { useState, useEffect, useRef } from "react"
import { RefreshCw, TrendingUp, Users, CheckCircle, ListChecks, Clock, History } from "lucide-react"
import type { StatsData } from "./blockchain-stats"

interface StatsPageProps {
  language: "en" | "pt-BR"
}

export function StatsPage({ language }: StatsPageProps) {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingFullHistory, setLoadingFullHistory] = useState(false)
  const [fullHistoryProgress, setFullHistoryProgress] = useState(0)
  const [isFullHistory, setIsFullHistory] = useState(false)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const t = {
    en: {
      title: "Platform Stats",
      lastUpdated: "Last updated",
      refresh: "Refresh",
      viewFullHistory: "View Full History",
      loadingFullHistory: "Loading full history...",
      fullHistoryNote: "This takes 1-2 minutes to load from blockchain",
      last90Days: "Last 90 Days",
      fullHistory: "Full History",
      wallets: "Unique Wallets",
      tasksCreated: "Tasks Created",
      tasksClaimed: "Tasks Claimed",
      tasksApproved: "Tasks Approved",
      growthSinceLaunch: "Growth Since Launch",
      growth90Days: "Growth (Last 90 Days)",
      date: "Date",
      created: "Created",
      claimed: "Claimed",
      approved: "Approved",
      loading: "Loading stats...",
      error: "Failed to load stats",
      ago: "ago",
      cached: "Cached",
    },
    "pt-BR": {
      title: "Estatísticas da Plataforma",
      lastUpdated: "Atualizado",
      refresh: "Atualizar",
      viewFullHistory: "Ver Histórico Completo",
      loadingFullHistory: "Carregando histórico completo...",
      fullHistoryNote: "Leva 1-2 minutos para carregar do blockchain",
      last90Days: "Últimos 90 Dias",
      fullHistory: "Histórico Completo",
      wallets: "Carteiras Únicas",
      tasksCreated: "Tarefas Criadas",
      tasksClaimed: "Tarefas Reivindicadas",
      tasksApproved: "Tarefas Aprovadas",
      growthSinceLaunch: "Crescimento Desde o Lançamento",
      growth90Days: "Crescimento (Últimos 90 Dias)",
      date: "Data",
      created: "Criadas",
      claimed: "Reivindicadas",
      approved: "Aprovadas",
      loading: "Carregando estatísticas...",
      error: "Falha ao carregar estatísticas",
      ago: "atrás",
      cached: "Cache",
    },
  }

  const strings = t[language]

  const fetchStats = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true)
      else setLoading(true)

      setError(null)
      setIsFullHistory(false)

      const response = await fetch("/api/stats", {
        method: forceRefresh ? "POST" : "GET",
      })

      if (!response.ok) throw new Error("Failed to fetch")

      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(strings.error)
      console.error("Stats fetch error:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchFullHistory = async () => {
    try {
      setLoadingFullHistory(true)
      setFullHistoryProgress(0)
      setError(null)

      const DEPLOYMENT_BLOCK = 51778358
      const BATCH_SIZE = 50000

      const provider = new (await import("ethers")).ethers.JsonRpcProvider("https://forno.celo.org")
      const currentBlock = await provider.getBlockNumber()

      const totalBlocks = currentBlock - DEPLOYMENT_BLOCK
      const numBatches = Math.ceil(totalBlocks / BATCH_SIZE)

      console.log(`Fetching ${numBatches} batches of blockchain data...`)

      const allCreators = new Set<string>()
      const allClaimants = new Set<string>()
      let totalCreated = 0
      let totalClaimed = 0
      let totalApproved = 0
      const weeklyStats: Record<string, { created: number; claimed: number; approved: number }> = {}

      for (let i = 0; i < numBatches; i++) {
        const batchStart = DEPLOYMENT_BLOCK + i * BATCH_SIZE
        const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, currentBlock)

        console.log(`Fetching batch ${i + 1}/${numBatches}: blocks ${batchStart}-${batchEnd}`)

        const response = await fetch("/api/stats/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ startBlock: batchStart, endBlock: batchEnd }),
        })

        if (!response.ok) {
          console.error(`Batch ${i + 1} failed, continuing...`)
          continue
        }

        const batch = await response.json()

        batch.events.created.forEach((e: any) => {
          if (e.creator) allCreators.add(e.creator.toLowerCase())
          totalCreated++

          const weeksSinceDeployment = Math.floor((e.blockNumber - DEPLOYMENT_BLOCK) / 120960)
          const weekKey = `Week ${weeksSinceDeployment + 1}`
          if (!weeklyStats[weekKey]) weeklyStats[weekKey] = { created: 0, claimed: 0, approved: 0 }
          weeklyStats[weekKey].created++
        })

        batch.events.claimed.forEach((e: any) => {
          if (e.claimant) allClaimants.add(e.claimant.toLowerCase())
          totalClaimed++

          const weeksSinceDeployment = Math.floor((e.blockNumber - DEPLOYMENT_BLOCK) / 120960)
          const weekKey = `Week ${weeksSinceDeployment + 1}`
          if (!weeklyStats[weekKey]) weeklyStats[weekKey] = { created: 0, claimed: 0, approved: 0 }
          weeklyStats[weekKey].claimed++
        })

        batch.events.approved.forEach((e: any) => {
          totalApproved++

          const weeksSinceDeployment = Math.floor((e.blockNumber - DEPLOYMENT_BLOCK) / 120960)
          const weekKey = `Week ${weeksSinceDeployment + 1}`
          if (!weeklyStats[weekKey]) weeklyStats[weekKey] = { created: 0, claimed: 0, approved: 0 }
          weeklyStats[weekKey].approved++
        })

        const progress = Math.round(((i + 1) / numBatches) * 100)
        setFullHistoryProgress(progress)
      }

      const uniqueWallets = new Set([...allCreators, ...allClaimants])

      const growth = Object.entries(weeklyStats)
        .map(([week, stats]) => ({
          date: week,
          created: stats.created,
          claimed: stats.claimed,
          approved: stats.approved,
        }))
        .sort((a, b) => {
          const aNum = parseInt(a.date.replace("Week ", ""))
          const bNum = parseInt(b.date.replace("Week ", ""))
          return aNum - bNum
        })

      const fullStats = {
        wallets: uniqueWallets.size,
        tasksCreated: totalCreated,
        tasksClaimed: totalClaimed,
        tasksApproved: totalApproved,
        growth,
        lastUpdated: Date.now(),
      }

      setStats(fullStats)
      setIsFullHistory(true)
      console.log("Full history loaded:", fullStats)
    } catch (err) {
      setError(strings.error)
      console.error("Full history fetch error:", err)
    } finally {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      setLoadingFullHistory(false)
    }
  }

  useEffect(() => {
    fetchStats()
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ${strings.ago}`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ${strings.ago}`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${strings.ago}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block balaio-chip pink mb-4">
              {strings.loading}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block balaio-chip pink mb-4">
              {strings.error}
            </div>
            <button
              onClick={() => fetchStats()}
              className="ml-4 balaio-chip yellow"
            >
              {strings.refresh}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">{strings.title}</h1>
            <span className={`balaio-chip ${isFullHistory ? "blue" : "yellow"} text-sm`}>
              {isFullHistory ? strings.fullHistory : strings.last90Days}
            </span>
          </div>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing || loadingFullHistory}
            className="balaio-chip green flex items-center gap-2"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {strings.refresh}
          </button>
        </div>

        {/* Last Updated */}
        <div className="mb-6 text-sm text-gray-600">
          {strings.lastUpdated}: {formatTimeAgo(stats.lastUpdated)}
          {(stats as any).cached && (
            <span className="ml-2 balaio-chip text-xs">{strings.cached}</span>
          )}
        </div>

        {/* Full History Progress Bar */}
        {loadingFullHistory && (
          <div className="mb-8 balaio-card">
            <div className="flex items-center gap-2 mb-3">
              <History size={16} />
              <span className="font-bold">{strings.loadingFullHistory}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 border-2 border-black overflow-hidden">
              <div
                className="bg-yellow-300 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${fullHistoryProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock size={13} />
                Loading blockchain data in batches... (~1-2 minutes)
              </span>
              <span>{fullHistoryProgress}%</span>
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="balaio-card">
            <div className="flex items-center gap-2 mb-2">
              <Users size={20} />
              <div className="text-sm font-bold">{strings.wallets}</div>
            </div>
            <div className="text-3xl font-bold">{stats.wallets}</div>
          </div>
          <div className="balaio-card">
            <div className="flex items-center gap-2 mb-2">
              <ListChecks size={20} />
              <div className="text-sm font-bold">{strings.tasksCreated}</div>
            </div>
            <div className="text-3xl font-bold">{stats.tasksCreated}</div>
          </div>
          <div className="balaio-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} />
              <div className="text-sm font-bold">{strings.tasksClaimed}</div>
            </div>
            <div className="text-3xl font-bold">{stats.tasksClaimed}</div>
          </div>
          <div className="balaio-card">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={20} />
              <div className="text-sm font-bold">{strings.tasksApproved}</div>
            </div>
            <div className="text-3xl font-bold">{stats.tasksApproved}</div>
          </div>
        </div>

        {/* View Full History Button */}
        {!isFullHistory && !loadingFullHistory && (
          <div className="mb-8 flex items-center gap-3 flex-wrap">
            <button
              onClick={fetchFullHistory}
              className="balaio-chip blue flex items-center gap-2"
            >
              <History size={16} />
              {strings.viewFullHistory}
            </button>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock size={13} />
              {strings.fullHistoryNote}
            </span>
          </div>
        )}

        {!isFullHistory && !loadingFullHistory && (
          <div className="mb-8 text-xs text-gray-500 max-w-2xl p-3 bg-gray-50 rounded border border-gray-200">
            <strong>About Full History:</strong> Full history shows all events since contract deployment (block 51778358).
            This data is cached and updated periodically. If currently unavailable, the Last 90 Days view provides all recent platform activity.
          </div>
        )}

        {/* Growth Table */}
        <div className="balaio-card">
          <h2 className="text-xl font-bold mb-4">
            {isFullHistory ? strings.growthSinceLaunch : strings.growth90Days}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2 px-4">{strings.date}</th>
                  <th className="text-left py-2 px-4">{strings.created}</th>
                  <th className="text-left py-2 px-4">{strings.claimed}</th>
                  <th className="text-left py-2 px-4">{strings.approved}</th>
                </tr>
              </thead>
              <tbody>
                {stats.growth.length > 0 ? (
                  stats.growth.map((row) => (
                    <tr key={row.date} className="border-b border-gray-200">
                      <td className="py-2 px-4">{row.date}</td>
                      <td className="py-2 px-4">{row.created}</td>
                      <td className="py-2 px-4">{row.claimed}</td>
                      <td className="py-2 px-4">{row.approved}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                      No growth data yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
