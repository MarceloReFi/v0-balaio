"use client"
import { useState, useEffect } from "react"
import { RefreshCw, TrendingUp, Users, CheckCircle, ListChecks, Clock, History } from "lucide-react"
import { ethers } from "ethers"
import { CONTRACT_ABI } from "@/lib/web3"
import {
  CELO_CONTRACT_ADDRESS_V1,
  CELO_CONTRACT_ADDRESS_V2,
  CELO_DEPLOYMENT_BLOCK_V1,
  CELO_DEPLOYMENT_BLOCK_V2,
  CELO_RPC,
} from "@/lib/config"

interface StatsPageProps {
  language: "en" | "pt-BR"
}

type StatsData = {
  wallets: number
  tasksCreated: number
  tasksClaimed: number
  tasksApproved: number
  growth: { date: string; created: number; claimed: number; approved: number }[]
  lastUpdated: number
}

type PanelState = {
  stats: StatsData | null
  loading: boolean
  isFullHistory: boolean
  loadingFullHistory: boolean
  progress: number
  error: string | null
}

const INITIAL_PANEL: PanelState = {
  stats: null,
  loading: true,
  isFullHistory: false,
  loadingFullHistory: false,
  progress: 0,
  error: null,
}

const BATCH_SIZE = 50000
const DEFAULT_DAYS = 60

export function StatsPage({ language }: StatsPageProps) {
  const [v1, setV1] = useState<PanelState>(INITIAL_PANEL)
  const [v2, setV2] = useState<PanelState>(INITIAL_PANEL)

  const strings = {
    en: {
      title: "Platform Stats",
      v1Label: "Celo V1 — Legacy",
      v2Label: "Celo V2",
      lastUpdated: "Last updated",
      refresh: "Refresh",
      viewFullHistory: "View Full History",
      loadingFullHistory: "Loading full history...",
      fullHistoryNote: "~1-2 minutes",
      last60Days: "Last 60 Days",
      fullHistory: "Full History",
      wallets: "Unique Wallets",
      tasksCreated: "Tasks Created",
      tasksClaimed: "Tasks Claimed",
      tasksApproved: "Tasks Approved",
      growthSinceLaunch: "Growth Since Launch",
      growth60Days: "Growth (Last 60 Days)",
      date: "Date",
      created: "Created",
      claimed: "Claimed",
      approved: "Approved",
      loading: "Loading...",
      error: "Failed to load stats",
      ago: "ago",
      notDeployed: "Not yet deployed",
    },
    "pt-BR": {
      title: "Estatísticas da Plataforma",
      v1Label: "Celo V1 — Legado",
      v2Label: "Celo V2",
      lastUpdated: "Atualizado",
      refresh: "Atualizar",
      viewFullHistory: "Ver Histórico Completo",
      loadingFullHistory: "Carregando histórico...",
      fullHistoryNote: "~1-2 minutos",
      last60Days: "Últimos 60 Dias",
      fullHistory: "Histórico Completo",
      wallets: "Carteiras Únicas",
      tasksCreated: "Tarefas Criadas",
      tasksClaimed: "Tarefas Reivindicadas",
      tasksApproved: "Tarefas Aprovadas",
      growthSinceLaunch: "Crescimento Desde o Lançamento",
      growth60Days: "Crescimento (Últimos 60 Dias)",
      date: "Data",
      created: "Criadas",
      claimed: "Reivindicadas",
      approved: "Aprovadas",
      loading: "Carregando...",
      error: "Falha ao carregar",
      ago: "atrás",
      notDeployed: "Ainda não deployado",
    },
  }[language]

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ${strings.ago}`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ${strings.ago}`
    return `${Math.floor(minutes / 60)}h ${strings.ago}`
  }

  async function loadRecent(
    setter: React.Dispatch<React.SetStateAction<PanelState>>,
    contractAddress: string,
    deploymentBlock: number,
  ) {
    if (!contractAddress || deploymentBlock === 0) {
      setter(p => ({ ...p, loading: false, error: strings.notDeployed }))
      return
    }
    setter(p => ({ ...p, loading: true, error: null }))
    try {
      const provider = new ethers.JsonRpcProvider(CELO_RPC)
      const currentBlock = await provider.getBlockNumber()
      // 60 days: Celo L2 ~1s/block = 86400 blocks/day
      const startBlock = Math.max(deploymentBlock, currentBlock - 86400 * DEFAULT_DAYS)
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)

      const [created, claimed, approved] = await Promise.all([
        contract.queryFilter(contract.filters.TaskCreated(), startBlock, currentBlock),
        contract.queryFilter(contract.filters.TaskClaimed(), startBlock, currentBlock),
        contract.queryFilter(contract.filters.TaskApproved(), startBlock, currentBlock),
      ])

      const creators = new Set(created.map((e: any) => e.args?.[1]?.toLowerCase()).filter(Boolean))
      const claimants = new Set(claimed.map((e: any) => e.args?.[1]?.toLowerCase()).filter(Boolean))
      const wallets = new Set([...creators, ...claimants])

      const weeklyMap: Record<string, { created: number; claimed: number; approved: number }> = {}
      const toWeek = (blockNumber: number) => {
        const w = Math.floor((blockNumber - deploymentBlock) / (86400 * 7)) + 1
        return `Week ${w}`
      }
      ;[...created, ...claimed, ...approved].forEach((e: any) => {
        const key = toWeek(e.blockNumber)
        if (!weeklyMap[key]) weeklyMap[key] = { created: 0, claimed: 0, approved: 0 }
      })
      created.forEach((e: any) => { weeklyMap[toWeek(e.blockNumber)].created++ })
      claimed.forEach((e: any) => { weeklyMap[toWeek(e.blockNumber)].claimed++ })
      approved.forEach((e: any) => { weeklyMap[toWeek(e.blockNumber)].approved++ })

      const growth = Object.entries(weeklyMap)
        .map(([date, s]) => ({ date, ...s }))
        .sort((a, b) => parseInt(a.date.replace("Week ", "")) - parseInt(b.date.replace("Week ", "")))

      setter({
        loading: false,
        isFullHistory: false,
        loadingFullHistory: false,
        progress: 0,
        error: null,
        stats: {
          wallets: wallets.size,
          tasksCreated: created.length,
          tasksClaimed: claimed.length,
          tasksApproved: approved.length,
          growth,
          lastUpdated: Date.now(),
        },
      })
    } catch (err) {
      console.error("loadRecent error:", err)
      setter(p => ({ ...p, loading: false, error: strings.error }))
    }
  }

  async function loadFullHistory(
    setter: React.Dispatch<React.SetStateAction<PanelState>>,
    contractAddress: string,
    deploymentBlock: number,
  ) {
    if (!contractAddress || deploymentBlock === 0) return
    setter(p => ({ ...p, loadingFullHistory: true, progress: 0, error: null }))
    try {
      const provider = new ethers.JsonRpcProvider(CELO_RPC)
      const currentBlock = await provider.getBlockNumber()
      const numBatches = Math.ceil((currentBlock - deploymentBlock) / BATCH_SIZE)

      const creators = new Set<string>()
      const claimants = new Set<string>()
      let totalCreated = 0, totalClaimed = 0, totalApproved = 0
      const weeklyMap: Record<string, { created: number; claimed: number; approved: number }> = {}

      const toWeek = (blockNumber: number) => {
        const w = Math.floor((blockNumber - deploymentBlock) / (86400 * 7)) + 1
        return `Week ${w}`
      }

      for (let i = 0; i < numBatches; i++) {
        const startBlock = deploymentBlock + i * BATCH_SIZE
        const endBlock = Math.min(startBlock + BATCH_SIZE - 1, currentBlock)

        const res = await fetch("/api/stats/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ startBlock, endBlock, contractAddress }),
        })
        if (!res.ok) { continue }
        const batch = await res.json()

        batch.events.created.forEach((e: any) => {
          if (e.creator) creators.add(e.creator.toLowerCase())
          totalCreated++
          const key = toWeek(e.blockNumber)
          if (!weeklyMap[key]) weeklyMap[key] = { created: 0, claimed: 0, approved: 0 }
          weeklyMap[key].created++
        })
        batch.events.claimed.forEach((e: any) => {
          if (e.claimant) claimants.add(e.claimant.toLowerCase())
          totalClaimed++
          const key = toWeek(e.blockNumber)
          if (!weeklyMap[key]) weeklyMap[key] = { created: 0, claimed: 0, approved: 0 }
          weeklyMap[key].claimed++
        })
        batch.events.approved.forEach((e: any) => {
          totalApproved++
          const key = toWeek(e.blockNumber)
          if (!weeklyMap[key]) weeklyMap[key] = { created: 0, claimed: 0, approved: 0 }
          weeklyMap[key].approved++
        })

        setter(p => ({ ...p, progress: Math.round(((i + 1) / numBatches) * 100) }))
      }

      const wallets = new Set([...creators, ...claimants])
      const growth = Object.entries(weeklyMap)
        .map(([date, s]) => ({ date, ...s }))
        .sort((a, b) => parseInt(a.date.replace("Week ", "")) - parseInt(b.date.replace("Week ", "")))

      setter({
        loading: false,
        isFullHistory: true,
        loadingFullHistory: false,
        progress: 100,
        error: null,
        stats: {
          wallets: wallets.size,
          tasksCreated: totalCreated,
          tasksClaimed: totalClaimed,
          tasksApproved: totalApproved,
          growth,
          lastUpdated: Date.now(),
        },
      })
    } catch (err) {
      console.error("loadFullHistory error:", err)
      setter(p => ({ ...p, loadingFullHistory: false, error: strings.error }))
    }
  }

  useEffect(() => {
    loadRecent(setV1, CELO_CONTRACT_ADDRESS_V1, CELO_DEPLOYMENT_BLOCK_V1)
    loadRecent(setV2, CELO_CONTRACT_ADDRESS_V2, CELO_DEPLOYMENT_BLOCK_V2)
  }, [])

  function StatsPanel({
    panel,
    label,
    onRefresh,
    onFullHistory,
  }: {
    panel: PanelState
    label: string
    onRefresh: () => void
    onFullHistory: () => void
  }) {
    if (panel.loading) {
      return (
        <div className="balaio-card mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold">{label}</h2>
          </div>
          <div className="text-sm text-gray-500">{strings.loading}</div>
        </div>
      )
    }

    if (panel.error) {
      return (
        <div className="balaio-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{label}</h2>
          </div>
          <div className="text-sm text-red-500">{panel.error}</div>
        </div>
      )
    }

    if (!panel.stats) return null

    return (
      <div className="balaio-card mb-8">
        {/* Panel header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{label}</h2>
            <span className={`balaio-chip ${panel.isFullHistory ? "blue" : "yellow"} text-xs`}>
              {panel.isFullHistory ? strings.fullHistory : strings.last60Days}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{strings.lastUpdated}: {formatTimeAgo(panel.stats.lastUpdated)}</span>
            <button onClick={onRefresh} disabled={panel.loadingFullHistory} className="balaio-chip green flex items-center gap-1 text-xs">
              <RefreshCw size={12} />
              {strings.refresh}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {panel.loadingFullHistory && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3 border border-black overflow-hidden">
              <div className="bg-yellow-300 h-full transition-all duration-500" style={{ width: `${panel.progress}%` }} />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Clock size={11} />{strings.loadingFullHistory}</span>
              <span>{panel.progress}%</span>
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { icon: Users, label: strings.wallets, value: panel.stats.wallets },
            { icon: ListChecks, label: strings.tasksCreated, value: panel.stats.tasksCreated },
            { icon: TrendingUp, label: strings.tasksClaimed, value: panel.stats.tasksClaimed },
            { icon: CheckCircle, label: strings.tasksApproved, value: panel.stats.tasksApproved },
          ].map(({ icon: Icon, label: l, value }) => (
            <div key={l} className="bg-gray-50 rounded border border-gray-200 p-3">
              <div className="flex items-center gap-1 mb-1">
                <Icon size={14} />
                <span className="text-xs font-bold">{l}</span>
              </div>
              <div className="text-2xl font-bold">{value}</div>
            </div>
          ))}
        </div>

        {/* Full history button */}
        {!panel.isFullHistory && !panel.loadingFullHistory && (
          <button onClick={onFullHistory} className="balaio-chip blue flex items-center gap-1 text-xs mb-4">
            <History size={12} />
            {strings.viewFullHistory}
            <span className="text-gray-500 ml-1">({strings.fullHistoryNote})</span>
          </button>
        )}

        {/* Growth table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2 px-3">{strings.date}</th>
                <th className="text-left py-2 px-3">{strings.created}</th>
                <th className="text-left py-2 px-3">{strings.claimed}</th>
                <th className="text-left py-2 px-3">{strings.approved}</th>
              </tr>
            </thead>
            <tbody>
              {panel.stats.growth.length > 0 ? panel.stats.growth.map(row => (
                <tr key={row.date} className="border-b border-gray-100">
                  <td className="py-1.5 px-3">{row.date}</td>
                  <td className="py-1.5 px-3">{row.created}</td>
                  <td className="py-1.5 px-3">{row.claimed}</td>
                  <td className="py-1.5 px-3">{row.approved}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="py-4 px-3 text-center text-gray-400">No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{strings.title}</h1>

        <StatsPanel
          panel={v1}
          label={strings.v1Label}
          onRefresh={() => loadRecent(setV1, CELO_CONTRACT_ADDRESS_V1, CELO_DEPLOYMENT_BLOCK_V1)}
          onFullHistory={() => loadFullHistory(setV1, CELO_CONTRACT_ADDRESS_V1, CELO_DEPLOYMENT_BLOCK_V1)}
        />

        <StatsPanel
          panel={v2}
          label={strings.v2Label}
          onRefresh={() => loadRecent(setV2, CELO_CONTRACT_ADDRESS_V2, CELO_DEPLOYMENT_BLOCK_V2)}
          onFullHistory={() => loadFullHistory(setV2, CELO_CONTRACT_ADDRESS_V2, CELO_DEPLOYMENT_BLOCK_V2)}
        />
      </div>
    </div>
  )
}
