"use client"
import { useState, useEffect } from "react"
import { RefreshCw, TrendingUp, Users, CheckCircle, ListChecks } from "lucide-react"
import type { StatsData } from "./blockchain-stats"

interface StatsPageProps {
  language: "en" | "pt-BR"
}

export function StatsPage({ language }: StatsPageProps) {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const t = {
    en: {
      title: "Platform Stats",
      lastUpdated: "Last updated",
      refresh: "Refresh",
      wallets: "Unique Wallets",
      tasksCreated: "Tasks Created",
      tasksClaimed: "Tasks Claimed",
      tasksApproved: "Tasks Approved",
      growthSinceLaunch: "Growth Since Launch",
      date: "Date",
      created: "Created",
      claimed: "Claimed",
      approved: "Approved",
      loading: "Loading stats...",
      error: "Failed to load stats",
      ago: "ago",
    },
    "pt-BR": {
      title: "Estatísticas da Plataforma",
      lastUpdated: "Atualizado",
      refresh: "Atualizar",
      wallets: "Carteiras Únicas",
      tasksCreated: "Tarefas Criadas",
      tasksClaimed: "Tarefas Reivindicadas",
      tasksApproved: "Tarefas Aprovadas",
      growthSinceLaunch: "Crescimento Desde o Lançamento",
      date: "Data",
      created: "Criadas",
      claimed: "Reivindicadas",
      approved: "Aprovadas",
      loading: "Carregando estatísticas...",
      error: "Falha ao carregar estatísticas",
      ago: "atrás",
    },
  }

  const strings = t[language]

  const fetchStats = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true)
      else setLoading(true)

      setError(null)

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

  useEffect(() => {
    fetchStats()
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
          <h1 className="text-3xl font-bold">{strings.title}</h1>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="balaio-chip green flex items-center gap-2"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {strings.refresh}
          </button>
        </div>

        {/* Last Updated */}
        <div className="mb-8 text-sm text-gray-600">
          {strings.lastUpdated}: {formatTimeAgo(stats.lastUpdated)}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
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

        {/* Growth Table */}
        <div className="balaio-card">
          <h2 className="text-xl font-bold mb-4">{strings.growthSinceLaunch}</h2>
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
