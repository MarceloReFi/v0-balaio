"use client"
import { useState, useEffect } from "react"
import { RefreshCw, TrendingUp, Users, Building2, Clock, History } from "lucide-react"
import { ethers } from "ethers"
import { CONTRACT_ABI } from "@/lib/web3"
import { createClient } from "@/lib/supabase/client"
import {
  CELO_CONTRACT_ADDRESS_V1,
  CELO_CONTRACT_ADDRESS_V2,
  CELO_DEPLOYMENT_BLOCK_V1,
  CELO_DEPLOYMENT_BLOCK_V2,
  CELO_RPC,
  GNOSIS_CONTRACT_ADDRESS,
  GNOSIS_DEPLOYMENT_BLOCK,
  GNOSIS_RPC,
  BLOCKS_PER_DAY,
} from "@/lib/config"

interface StatsPageProps {
  language: "en" | "pt-BR"
}

type StatsData = {
  users: number
  interactions: number
  organizationsCreated: number
  growth: { date: string; interactions: number }[]
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
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

// Celo L2 ~1s/block; Gnosis ~5s/block (matches BLOCKS_PER_DAY in lib/config.ts)
const CELO_BLOCKS_PER_DAY = 86400

const EVM_SOURCES = [
  { contractAddress: CELO_CONTRACT_ADDRESS_V1, deploymentBlock: CELO_DEPLOYMENT_BLOCK_V1, rpc: CELO_RPC },
  { contractAddress: CELO_CONTRACT_ADDRESS_V2, deploymentBlock: CELO_DEPLOYMENT_BLOCK_V2, rpc: CELO_RPC },
  { contractAddress: GNOSIS_CONTRACT_ADDRESS, deploymentBlock: GNOSIS_DEPLOYMENT_BLOCK, rpc: GNOSIS_RPC },
]

function blocksPerDayFor(rpc: string): number {
  return rpc === GNOSIS_RPC ? BLOCKS_PER_DAY : CELO_BLOCKS_PER_DAY
}

type WeeklyMap = Record<number, number>

function bumpWeek(map: WeeklyMap, weeksAgo: number) {
  map[weeksAgo] = (map[weeksAgo] ?? 0) + 1
}

function weeksAgoFromDate(date: Date): number {
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / WEEK_MS))
}

function buildGrowthRows(map: WeeklyMap) {
  const weeksAgoValues = Object.keys(map).map(Number)
  if (weeksAgoValues.length === 0) return []
  const maxWeeksAgo = Math.max(...weeksAgoValues)
  return weeksAgoValues
    .sort((a, b) => b - a)
    .map((weeksAgo) => ({ date: `Week ${maxWeeksAgo - weeksAgo + 1}`, interactions: map[weeksAgo] }))
}

type RippleStats = {
  created: number
  claimed: number
  submitted: number
  approved: number
  withdrawn: number
  createdAt: Date[]
  claimedAt: Date[]
  submittedAt: Date[]
  approvedAt: Date[]
  withdrawnAt: Date[]
}

async function fetchRippleStats(windowStart: Date | null): Promise<RippleStats> {
  const supabase = createClient()

  let taskQuery = supabase.from("tasks").select("id, created_at").eq("chain_id", 0)
  if (windowStart) taskQuery = taskQuery.gte("created_at", windowStart.toISOString())
  const { data: taskRows } = await taskQuery

  const rows = taskRows ?? []
  const taskIds = rows.map((row: any) => row.id)

  let claimRows: any[] = []
  if (taskIds.length > 0) {
    const { data } = await supabase
      .from("task_claims")
      .select("claimed_at, submitted_at, approved_at, withdrawn_at")
      .in("task_id", taskIds)
    claimRows = data ?? []
  }

  const claimedRows = claimRows.filter((row: any) => row.claimed_at)
  const submittedRows = claimRows.filter((row: any) => row.submitted_at)
  const approvedRows = claimRows.filter((row: any) => row.approved_at)
  const withdrawnRows = claimRows.filter((row: any) => row.withdrawn_at)

  return {
    created: rows.length,
    claimed: claimedRows.length,
    submitted: submittedRows.length,
    approved: approvedRows.length,
    withdrawn: withdrawnRows.length,
    createdAt: rows.map((row: any) => new Date(row.created_at)),
    claimedAt: claimedRows.map((row: any) => new Date(row.claimed_at)),
    submittedAt: submittedRows.map((row: any) => new Date(row.submitted_at)),
    approvedAt: approvedRows.map((row: any) => new Date(row.approved_at)),
    withdrawnAt: withdrawnRows.map((row: any) => new Date(row.withdrawn_at)),
  }
}

async function fetchUsersCount(): Promise<number> {
  const supabase = createClient()
  const { count } = await supabase.from("wallet_connections").select("*", { count: "exact", head: true })
  return count ?? 0
}

async function fetchOrganizationsCount(): Promise<number> {
  const supabase = createClient()
  const { count } = await supabase.from("organizations").select("*", { count: "exact", head: true })
  return count ?? 0
}

export function StatsPage({ language }: StatsPageProps) {
  const [stats, setStats] = useState<PanelState>(INITIAL_PANEL)

  const strings = {
    en: {
      title: "Platform Stats",
      panelLabel: "All Networks",
      lastUpdated: "Last updated",
      refresh: "Refresh",
      viewFullHistory: "View Full History",
      loadingFullHistory: "Loading full history...",
      fullHistoryNote: "~1-2 minutes",
      last60Days: "Last 60 Days",
      fullHistory: "Full History",
      users: "Users",
      interactions: "Interactions",
      organizationsCreated: "Organizations Created",
      growthSinceLaunch: "Growth Since Launch",
      growth60Days: "Growth (Last 60 Days)",
      date: "Date",
      loading: "Loading...",
      error: "Failed to load stats",
      ago: "ago",
    },
    "pt-BR": {
      title: "Estatísticas da Plataforma",
      panelLabel: "Todas as Redes",
      lastUpdated: "Atualizado",
      refresh: "Atualizar",
      viewFullHistory: "Ver Histórico Completo",
      loadingFullHistory: "Carregando histórico...",
      fullHistoryNote: "~1-2 minutos",
      last60Days: "Últimos 60 Dias",
      fullHistory: "Histórico Completo",
      users: "Usuários",
      interactions: "Interações",
      organizationsCreated: "Organizações Criadas",
      growthSinceLaunch: "Crescimento Desde o Lançamento",
      growth60Days: "Crescimento (Últimos 60 Dias)",
      date: "Data",
      loading: "Carregando...",
      error: "Falha ao carregar",
      ago: "atrás",
    },
  }[language]

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ${strings.ago}`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ${strings.ago}`
    return `${Math.floor(minutes / 60)}h ${strings.ago}`
  }

  async function loadRecent(setter: React.Dispatch<React.SetStateAction<PanelState>>) {
    setter(p => ({ ...p, loading: true, error: null }))
    try {
      const evmResults = await Promise.all(
        EVM_SOURCES.map(async (source) => {
          const provider = new ethers.JsonRpcProvider(source.rpc)
          const currentBlock = await provider.getBlockNumber()
          const blocksPerDay = blocksPerDayFor(source.rpc)
          const startBlock = Math.max(source.deploymentBlock, currentBlock - blocksPerDay * DEFAULT_DAYS)
          const contract = new ethers.Contract(source.contractAddress, CONTRACT_ABI, provider)

          const [created, claimed, submitted, approved, rewardClaimed] = await Promise.all([
            contract.queryFilter(contract.filters.TaskCreated(), startBlock, currentBlock),
            contract.queryFilter(contract.filters.TaskClaimed(), startBlock, currentBlock),
            contract.queryFilter(contract.filters.TaskSubmitted(), startBlock, currentBlock),
            contract.queryFilter(contract.filters.TaskApproved(), startBlock, currentBlock),
            contract.queryFilter(contract.filters.RewardClaimed(), startBlock, currentBlock),
          ])

          return { currentBlock, blocksPerDay, created, claimed, submitted, approved, rewardClaimed }
        })
      )

      const windowStart = new Date(Date.now() - DEFAULT_DAYS * 24 * 60 * 60 * 1000)
      const [ripple, users, organizationsCreated] = await Promise.all([
        fetchRippleStats(windowStart),
        fetchUsersCount(),
        fetchOrganizationsCount(),
      ])

      let interactions = 0
      const weeklyMap: WeeklyMap = {}

      evmResults.forEach(({ currentBlock, blocksPerDay, created, claimed, submitted, approved, rewardClaimed }) => {
        const blocksPerWeek = blocksPerDay * 7
        const weekKey = (blockNumber: number) => Math.floor((currentBlock - blockNumber) / blocksPerWeek)

        ;[created, claimed, submitted, approved, rewardClaimed].forEach((events) => {
          events.forEach((e: any) => bumpWeek(weeklyMap, weekKey(e.blockNumber)))
        })

        interactions += created.length + claimed.length + submitted.length + approved.length + rewardClaimed.length
      })

      ripple.createdAt.forEach((d) => bumpWeek(weeklyMap, weeksAgoFromDate(d)))
      ripple.claimedAt.forEach((d) => bumpWeek(weeklyMap, weeksAgoFromDate(d)))
      ripple.submittedAt.forEach((d) => bumpWeek(weeklyMap, weeksAgoFromDate(d)))
      ripple.approvedAt.forEach((d) => bumpWeek(weeklyMap, weeksAgoFromDate(d)))
      ripple.withdrawnAt.forEach((d) => bumpWeek(weeklyMap, weeksAgoFromDate(d)))

      interactions +=
        ripple.created + ripple.claimed + ripple.submitted + ripple.approved + ripple.withdrawn

      setter({
        loading: false,
        isFullHistory: false,
        loadingFullHistory: false,
        progress: 0,
        error: null,
        stats: {
          users,
          interactions,
          organizationsCreated,
          growth: buildGrowthRows(weeklyMap),
          lastUpdated: Date.now(),
        },
      })
    } catch (err) {
      console.error("loadRecent error:", err)
      setter(p => ({ ...p, loading: false, error: strings.error }))
    }
  }

  async function loadFullHistory(setter: React.Dispatch<React.SetStateAction<PanelState>>) {
    setter(p => ({ ...p, loadingFullHistory: true, progress: 0, error: null }))
    try {
      const evmMeta = await Promise.all(
        EVM_SOURCES.map(async (source) => {
          const provider = new ethers.JsonRpcProvider(source.rpc)
          const currentBlock = await provider.getBlockNumber()
          const numBatches = Math.max(1, Math.ceil((currentBlock - source.deploymentBlock) / BATCH_SIZE))
          return { source, currentBlock, numBatches, blocksPerDay: blocksPerDayFor(source.rpc) }
        })
      )

      const totalBatches = evmMeta.reduce((sum, m) => sum + m.numBatches, 0)
      let completedBatches = 0

      let interactions = 0
      const weeklyMap: WeeklyMap = {}

      await Promise.all(
        evmMeta.map(async ({ source, currentBlock, numBatches, blocksPerDay }) => {
          const blocksPerWeek = blocksPerDay * 7
          const weekKey = (blockNumber: number) => Math.floor((currentBlock - blockNumber) / blocksPerWeek)

          for (let i = 0; i < numBatches; i++) {
            const startBlock = source.deploymentBlock + i * BATCH_SIZE
            const endBlock = Math.min(startBlock + BATCH_SIZE - 1, currentBlock)

            const res = await fetch("/api/stats/batch", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ startBlock, endBlock, contractAddress: source.contractAddress, rpc: source.rpc }),
            })

            if (res.ok) {
              const batch = await res.json()

              ;[batch.events.created, batch.events.claimed, batch.events.submitted, batch.events.approved, batch.events.rewardClaimed].forEach(
                (events: any[]) => {
                  events.forEach((e: any) => {
                    interactions++
                    bumpWeek(weeklyMap, weekKey(e.blockNumber))
                  })
                }
              )
            }

            completedBatches++
            setter(p => ({ ...p, progress: Math.round((completedBatches / totalBatches) * 100) }))
          }
        })
      )

      const [ripple, users, organizationsCreated] = await Promise.all([
        fetchRippleStats(null),
        fetchUsersCount(),
        fetchOrganizationsCount(),
      ])

      ripple.createdAt.forEach((d) => bumpWeek(weeklyMap, weeksAgoFromDate(d)))
      ripple.claimedAt.forEach((d) => bumpWeek(weeklyMap, weeksAgoFromDate(d)))
      ripple.submittedAt.forEach((d) => bumpWeek(weeklyMap, weeksAgoFromDate(d)))
      ripple.approvedAt.forEach((d) => bumpWeek(weeklyMap, weeksAgoFromDate(d)))
      ripple.withdrawnAt.forEach((d) => bumpWeek(weeklyMap, weeksAgoFromDate(d)))

      interactions +=
        ripple.created + ripple.claimed + ripple.submitted + ripple.approved + ripple.withdrawn

      setter({
        loading: false,
        isFullHistory: true,
        loadingFullHistory: false,
        progress: 100,
        error: null,
        stats: {
          users,
          interactions,
          organizationsCreated,
          growth: buildGrowthRows(weeklyMap),
          lastUpdated: Date.now(),
        },
      })
    } catch (err) {
      console.error("loadFullHistory error:", err)
      setter(p => ({ ...p, loadingFullHistory: false, error: strings.error }))
    }
  }

  useEffect(() => {
    loadRecent(setStats)
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            { icon: Users, label: strings.users, value: panel.stats.users },
            { icon: TrendingUp, label: strings.interactions, value: panel.stats.interactions },
            { icon: Building2, label: strings.organizationsCreated, value: panel.stats.organizationsCreated },
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
                <th className="text-left py-2 px-3">{strings.interactions}</th>
              </tr>
            </thead>
            <tbody>
              {panel.stats.growth.length > 0 ? panel.stats.growth.map(row => (
                <tr key={row.date} className="border-b border-gray-100">
                  <td className="py-1.5 px-3">{row.date}</td>
                  <td className="py-1.5 px-3">{row.interactions}</td>
                </tr>
              )) : (
                <tr><td colSpan={2} className="py-4 px-3 text-center text-gray-400">No data yet</td></tr>
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
          panel={stats}
          label={strings.panelLabel}
          onRefresh={() => loadRecent(setStats)}
          onFullHistory={() => loadFullHistory(setStats)}
        />
      </div>
    </div>
  )
}
