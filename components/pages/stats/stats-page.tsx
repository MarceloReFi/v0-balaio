"use client"
import { useState, useEffect } from "react"
import { RefreshCw, TrendingUp, Users, Building2, Clock, History, ClipboardList, CheckCircle2, FolderKanban } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface StatsPageProps {
  language: "en" | "pt-BR"
}

type StatsData = {
  users: number
  interactions: number
  organizationsCreated: number
  tasksCreated: number
  tasksClaimed: number
  projectsCreated: number
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

const DEFAULT_DAYS = 60

type DailyMap = Record<string, number>

function bumpDay(map: DailyMap, isoDate: string) {
  map[isoDate] = (map[isoDate] ?? 0) + 1
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function formatDayLabel(isoDateStr: string): string {
  const [, month, day] = isoDateStr.split("-")
  return `${day}/${month}`
}

function getWeekStart(reference: Date): Date {
  const d = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), reference.getUTCDate()))
  const day = d.getUTCDay()
  const diff = (day - 2 + 7) % 7
  d.setUTCDate(d.getUTCDate() - diff)
  return d
}

function buildWeekRows(map: DailyMap, weekStart: Date) {
  const rows: { date: string; interactions: number }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setUTCDate(d.getUTCDate() + i)
    const iso = isoDate(d)
    rows.push({ date: formatDayLabel(iso), interactions: map[iso] ?? 0 })
  }
  return rows
}

type ChainStats = {
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

async function fetchChainStats(chainIds: number[], windowStart: Date | null): Promise<ChainStats> {
  const supabase = createClient()

  let taskQuery = supabase.from("tasks").select("id, created_at").in("chain_id", chainIds)
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

async function fetchDailyStats(
  windowStart: Date | null
): Promise<{ date: string; created: number; claimed: number; submitted: number; interactions: number }[]> {
  const supabase = createClient()
  let query = supabase
    .from("stats_daily")
    .select("date, created, claimed, submitted, interactions")
    .order("date", { ascending: true })
  if (windowStart) query = query.gte("date", isoDate(windowStart))
  const { data } = await query
  return data ?? []
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

async function fetchProjectsCount(): Promise<number> {
  const supabase = createClient()
  const { count } = await supabase.from("projects").select("*", { count: "exact", head: true })
  return count ?? 0
}

function WeeklyBarChart({ data }: { data: { date: string; interactions: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.interactions))
  const maxBarHeight = 140
  return (
    <div className="flex items-end gap-2 h-[180px] flex-1 min-w-[240px]">
      {data.map((d) => {
        const height = d.interactions > 0 ? Math.max(4, (d.interactions / max) * maxBarHeight) : 0
        return (
          <div key={d.date} className="flex flex-col items-center justify-end flex-1 h-full">
            <span className="text-[10px] font-bold mb-1">{d.interactions}</span>
            <div className="w-full bg-orange-300 rounded-t border border-black" style={{ height: `${height}px` }} />
            <span className="text-[10px] text-gray-500 mt-1">{d.date}</span>
          </div>
        )
      })}
    </div>
  )
}

export function StatsPage({ language }: StatsPageProps) {
  const [stats, setStats] = useState<PanelState>(INITIAL_PANEL)
  const [backfill, setBackfill] = useState<{ running: boolean; log: string[]; done: boolean | null }>({ running: false, log: [], done: null })

  const strings = {
    en: {
      title: "Platform Stats",
      panelLabel: "All Networks",
      lastUpdated: "Last updated",
      refresh: "Refresh",
      viewFullHistory: "View Full History",
      viewLast60Days: "View Last 60 Days",
      loadingFullHistory: "Loading full history...",
      last60Days: "Last 60 Days",
      fullHistory: "Full History",
      users: "Users",
      interactions: "Interactions",
      totalInteractions: "Total Interactions",
      organizationsCreated: "Organizations Created",
      tasksCreated: "Tasks Created",
      tasksClaimed: "Tasks Claimed",
      projectsCreated: "Projects Created",
      growthSinceLaunch: "Growth Since Launch",
      growth60Days: "Growth (Last 60 Days)",
      date: "Date",
      loading: "Loading...",
      error: "Failed to load stats",
      ago: "ago",
      blockchainSync: "Blockchain Sync",
      syncHistory: "Sync History",
      syncComplete: "Sync complete",
    },
    "pt-BR": {
      title: "Estatísticas da Plataforma",
      panelLabel: "Todas as Redes",
      lastUpdated: "Atualizado",
      refresh: "Atualizar",
      viewFullHistory: "Ver Histórico Completo",
      viewLast60Days: "Ver Últimos 60 Dias",
      loadingFullHistory: "Carregando histórico...",
      last60Days: "Últimos 60 Dias",
      fullHistory: "Histórico Completo",
      users: "Usuários",
      interactions: "Interações",
      totalInteractions: "Total de Interações",
      organizationsCreated: "Organizações Criadas",
      tasksCreated: "Tarefas Criadas",
      tasksClaimed: "Tarefas Reivindicadas",
      projectsCreated: "Projetos Criados",
      growthSinceLaunch: "Crescimento Desde o Lançamento",
      growth60Days: "Crescimento (Últimos 60 Dias)",
      date: "Data",
      loading: "Carregando...",
      error: "Falha ao carregar",
      ago: "atrás",
      blockchainSync: "Sincronização Blockchain",
      syncHistory: "Sincronizar Histórico",
      syncComplete: "Sincronização completa",
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
      const windowStart = new Date(Date.now() - DEFAULT_DAYS * 24 * 60 * 60 * 1000)

      const [ripple, dailyRows, users, organizationsCreated, projectsCreated] = await Promise.all([
        fetchChainStats([0], windowStart),
        fetchDailyStats(windowStart),
        fetchUsersCount(),
        fetchOrganizationsCount(),
        fetchProjectsCount(),
      ])

      const dailyMap: DailyMap = {}
      dailyRows.forEach((row) => {
        dailyMap[row.date] = (dailyMap[row.date] ?? 0) + row.interactions
      })

      ripple.createdAt.forEach((d) => bumpDay(dailyMap, isoDate(d)))
      ripple.claimedAt.forEach((d) => bumpDay(dailyMap, isoDate(d)))
      ripple.submittedAt.forEach((d) => bumpDay(dailyMap, isoDate(d)))
      ripple.approvedAt.forEach((d) => bumpDay(dailyMap, isoDate(d)))
      ripple.withdrawnAt.forEach((d) => bumpDay(dailyMap, isoDate(d)))

      const evmCreated = dailyRows.reduce((sum, row) => sum + row.created, 0)
      const tasksCreated = evmCreated + ripple.created

      const evmClaimed = dailyRows.reduce((sum, row) => sum + row.claimed, 0)
      const tasksClaimed = evmClaimed + ripple.claimed

      const interactions =
        dailyRows.reduce((sum, row) => sum + row.interactions, 0) +
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
          tasksCreated,
          tasksClaimed,
          projectsCreated,
          growth: buildWeekRows(dailyMap, getWeekStart(new Date())),
          lastUpdated: Date.now(),
        },
      })
    } catch (err) {
      console.error("loadRecent error:", err)
      setter(p => ({ ...p, loading: false, error: strings.error }))
    }
  }

  async function loadFullHistory(setter: React.Dispatch<React.SetStateAction<PanelState>>) {
    setter(p => ({ ...p, error: null }))
    try {
      const [ripple, dailyRows, users, organizationsCreated, projectsCreated] = await Promise.all([
        fetchChainStats([0], null),
        fetchDailyStats(null),
        fetchUsersCount(),
        fetchOrganizationsCount(),
        fetchProjectsCount(),
      ])

      const dailyMap: DailyMap = {}
      dailyRows.forEach((row) => {
        dailyMap[row.date] = (dailyMap[row.date] ?? 0) + row.interactions
      })

      ripple.createdAt.forEach((d) => bumpDay(dailyMap, isoDate(d)))
      ripple.claimedAt.forEach((d) => bumpDay(dailyMap, isoDate(d)))
      ripple.submittedAt.forEach((d) => bumpDay(dailyMap, isoDate(d)))
      ripple.approvedAt.forEach((d) => bumpDay(dailyMap, isoDate(d)))
      ripple.withdrawnAt.forEach((d) => bumpDay(dailyMap, isoDate(d)))

      const evmCreated = dailyRows.reduce((sum, row) => sum + row.created, 0)
      const tasksCreated = evmCreated + ripple.created

      const evmClaimed = dailyRows.reduce((sum, row) => sum + row.claimed, 0)
      const tasksClaimed = evmClaimed + ripple.claimed

      const interactions =
        dailyRows.reduce((sum, row) => sum + row.interactions, 0) +
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
          tasksCreated,
          tasksClaimed,
          projectsCreated,
          growth: buildWeekRows(dailyMap, getWeekStart(new Date())),
          lastUpdated: Date.now(),
        },
      })
    } catch (err) {
      console.error("loadFullHistory error:", err)
      setter(p => ({ ...p, loadingFullHistory: false, error: strings.error }))
    }
  }

  async function runBackfill() {
    setBackfill({ running: true, log: [], done: null })
    let done = false
    let iterations = 0
    try {
      while (!done && iterations < 3000) {
        const res = await fetch("/api/cron/stats-checkpoint", { method: "POST" })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        done = data.done
        iterations++
        const summary = Object.entries(data.perSource as Record<string, any>)
          .map(([src, s]: [string, any]) => `${src}: ${s.done ? "ok" : `${s.lastProcessedBlock}/${s.currentBlock}`}`)
          .join(" · ")
        setBackfill((p) => ({ ...p, log: [...p.log.slice(-30), `Lote ${iterations} — ${summary}`] }))
      }
      setBackfill((p) => ({ ...p, running: false, done: true }))
    } catch (err) {
      setBackfill((p) => ({
        ...p,
        running: false,
        log: [...p.log, `Erro: ${err instanceof Error ? err.message : String(err)}`],
      }))
    }
  }

  useEffect(() => {
    loadFullHistory(setStats)
  }, [])

  function StatsPanel({
    panel,
    label,
    onRefresh,
    onFullHistory,
    onLast60Days,
  }: {
    panel: PanelState
    label: string
    onRefresh: () => void
    onFullHistory: () => void
    onLast60Days: () => void
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {[
            { icon: Users, label: strings.users, value: panel.stats.users },
            { icon: ClipboardList, label: strings.tasksCreated, value: panel.stats.tasksCreated },
            { icon: CheckCircle2, label: strings.tasksClaimed, value: panel.stats.tasksClaimed },
            { icon: TrendingUp, label: strings.totalInteractions, value: panel.stats.interactions },
            { icon: Building2, label: strings.organizationsCreated, value: panel.stats.organizationsCreated },
            { icon: FolderKanban, label: strings.projectsCreated, value: panel.stats.projectsCreated },
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
        {!panel.loadingFullHistory && (
          panel.isFullHistory ? (
            <button onClick={onLast60Days} className="balaio-chip yellow flex items-center gap-1 text-xs mb-4">
              <Clock size={12} />
              {strings.viewLast60Days}
            </button>
          ) : (
            <button onClick={onFullHistory} className="balaio-chip blue flex items-center gap-1 text-xs mb-4">
              <History size={12} />
              {strings.viewFullHistory}
            </button>
          )
        )}

        {/* Growth table */}
        <div className="flex gap-6 items-start flex-wrap">
          <div className="w-full sm:w-2/5 overflow-x-auto">
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
          <WeeklyBarChart data={panel.stats.growth} />
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
          onRefresh={() => (stats.isFullHistory ? loadFullHistory(setStats) : loadRecent(setStats))}
          onFullHistory={() => loadFullHistory(setStats)}
          onLast60Days={() => loadRecent(setStats)}
        />

        <div className="balaio-card mb-8">
          <h2 className="text-xl font-bold mb-4">{strings.blockchainSync}</h2>
          <button
            onClick={runBackfill}
            disabled={backfill.running}
            className="balaio-chip green flex items-center gap-1 text-xs mb-4"
          >
            <RefreshCw size={12} className={backfill.running ? "animate-spin" : ""} />
            {strings.syncHistory}
          </button>

          {backfill.log.length > 0 && (
            <div className="max-h-40 overflow-y-auto bg-gray-50 border border-gray-200 rounded p-3 text-xs font-mono space-y-1">
              {backfill.log.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}

          {backfill.done === true && (
            <div className="text-sm text-green-600 mt-3">{strings.syncComplete}</div>
          )}
        </div>
      </div>
    </div>
  )
}
