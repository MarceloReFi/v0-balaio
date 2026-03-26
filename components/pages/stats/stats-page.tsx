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
      fullHistoryNote: "This may take 3-5 minutes",
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
      fullHistoryNote: "Isso pode levar 3-5 minutos",
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

      // Quick progress animation
      let progress = 0
      const progressInterval = setInterval(() => {
        progress = Math.min(90, progress + 15)
        setFullHistoryProgress(progress)
      }, 200)

      progressIntervalRef.current = progressInterval

      const response = await fetch("/api/stats/full-history", {
        method: "GET",
      })

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message || strings.error)
        setFullHistoryProgress(0)
        return
      }

      const data = await response.json()
      setStats(data)
      setFullHistoryProgress(100)
      setIsFullHistory(true)
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
                {strings.fullHistoryNote}
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
