"use client"

import { useTranslations, type Language } from "@/lib/translations"
import { TokenBadge } from "@/components/ui/token-badge"
import type { Task } from "@/lib/types"

interface HomePageProps {
  onConnect: () => void
  language: Language
  tasks?: Task[]
  onViewTask?: (task: Task) => void
  onClaimTask?: (task: Task) => void
  onNavigateToTasks?: () => void
  onNavigateToFeatures?: () => void
  account?: string | null
}

export function HomePage({
  onConnect,
  language,
  tasks = [],
  onViewTask,
  onClaimTask,
  onNavigateToTasks,
  onNavigateToFeatures,
  account,
}: HomePageProps) {
  const t = useTranslations(language)

  const latestTasks = tasks.slice(0, 4)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <span className="bg-balaio-open-bg text-balaio-open-text px-3 py-1 text-xs font-semibold rounded-balaio-pill">Open</span>
      case "claimed":
        return <span className="bg-balaio-claimed-bg text-balaio-claimed-text px-3 py-1 text-xs font-semibold rounded-balaio-pill">Claimed</span>
      case "submitted":
        return <span className="bg-balaio-pending-bg text-balaio-pending-text px-3 py-1 text-xs font-semibold rounded-balaio-pill">Pending</span>
      case "approved":
        return <span className="bg-balaio-open-bg text-balaio-open-text px-3 py-1 text-xs font-semibold rounded-balaio-pill">Approved</span>
      case "completed":
        return <span className="bg-balaio-claimed-bg text-balaio-claimed-text px-3 py-1 text-xs font-semibold rounded-balaio-pill">Completed</span>
      default:
        return <span className="bg-balaio-claimed-bg text-balaio-claimed-text px-3 py-1 text-xs font-semibold rounded-balaio-pill">{status}</span>
    }
  }

  const getTimeAgo = (timestamp?: number | Date) => {
    if (!timestamp) return ""
    const time = timestamp instanceof Date ? timestamp.getTime() : timestamp
    const now = Date.now()
    const diff = now - time
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days}d ago`
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours > 0) return `${hours}h ago`
    return "Just now"
  }

  const getSlotDotColor = (task: Task) => {
    const available = Number(task.availableSlots)
    const total = Number(task.totalSlots)
    if (!task.active || available === 0) return "bg-red-400"
    if (available === total) return "bg-balaio-sage"
    return "bg-yellow-400"
  }

  const getDeadlineInfo = (deadline: Date | null | undefined) => {
    if (!deadline) return null
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffMs = deadlineDate.getTime() - now.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    if (diffMs < 0) return { color: "text-red-500", text: language === "en" ? "Expired" : "Expirado" }
    if (diffDays <= 1) return { color: "text-balaio-pending-text", text: language === "en" ? "1 day" : "1 dia" }
    return { color: "text-balaio-sage", text: `${Math.ceil(diffDays)}d` }
  }

  const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

  const opportunities = [
    {
      title: t.celoPublicGoods,
      type: "Grant",
      description: t.celoPublicGoodsDesc,
      provider: "Celo Foundation",
      amount: language === "en" ? "Bi-weekly CELO" : "CELO quinzenal",
      deadline: language === "en" ? "Rolling" : "Contínuo",
      tags: language === "en" ? ["Grant", "Support", "Celo"] : ["Subsídio", "Suporte", "Celo"],
      link: "https://www.celopg.eco/",
    },
    {
      title: t.celoBuilderFund,
      type: language === "en" ? "Rewards" : "Recompensas",
      description: t.celoBuilderFundDesc,
      provider: "Celo PG",
      amount: language === "en" ? "10,000 CELO/month" : "10.000 CELO/mês",
      deadline: language === "en" ? "Monthly" : "Mensal",
      tags: language === "en" ? ["Rewards", "Builder", "Monthly"] : ["Recompensas", "Construtor", "Mensal"],
      link: "https://www.celopg.eco/programs/celo-builder-fund",
    },
    {
      title: t.prezentiGrants,
      type: language === "en" ? "Grant" : "Subsídio",
      description: t.prezentiGrantsDesc,
      provider: "Prezenti",
      amount: language === "en" ? "Up to $50,000" : "Até $50.000",
      deadline: language === "en" ? "Rolling" : "Contínuo",
      tags: language === "en" ? ["Grant", "Funding", "Celo"] : ["Subsídio", "Financiamento", "Celo"],
      link: "http://prezenti.xyz/",
    },
    {
      title: t.celoCamp,
      type: language === "en" ? "Accelerator" : "Aceleradora",
      description: t.celoCampDesc,
      provider: "Celo Foundation",
      amount: language === "en" ? "Varies" : "Varia",
      deadline: language === "en" ? "Cohort-based" : "Por turma",
      tags: language === "en" ? ["Accelerator", "Mentorship", "Ecosystem"] : ["Aceleradora", "Mentoria", "Ecossistema"],
      link: "https://www.celocamp.com/",
    },
  ]

  return (
    <div className="px-[22px] py-5 pb-24">
      {/* Latest Tasks */}
      {latestTasks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted">
                {language === "en" ? "Recent" : "Recentes"}
              </p>
              <h3 className="font-display text-xl text-balaio-ink">
                {language === "en" ? <><em>Latest</em> Tasks</> : <>Últimas <em>Tarefas</em></>}
              </h3>
            </div>
            {onNavigateToTasks && (
              <button
                onClick={onNavigateToTasks}
                className="bg-balaio-surface text-balaio-muted px-4 py-1.5 text-xs font-semibold rounded-balaio-pill hover:bg-balaio-rule transition-colors"
              >
                {language === "en" ? "See all" : "Ver todas"}
              </button>
            )}
          </div>

          <div className="flex flex-col">
            {latestTasks.map((task) => {
              const deadlineInfo = getDeadlineInfo(task.deadline)
              return (
                <div
                  key={task.id}
                  className="py-4 border-b border-balaio-rule -mx-[22px] px-[22px]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getSlotDotColor(task)}`} />
                        <h4 className="font-semibold text-sm text-balaio-ink truncate">{task.title}</h4>
                      </div>
                      <p className="text-xs text-balaio-muted mb-2 line-clamp-2">{task.description}</p>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-balaio-muted">
                        <span>{shortenAddress(task.creator)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          {task.reward} <TokenBadge symbol={task.token || "cUSD"} />
                        </span>
                        <span>·</span>
                        <span>{task.availableSlots || task.totalSlots || 1} {language === "en" ? "slots" : "vagas"}</span>
                        <span>·</span>
                        <span>{getTimeAgo(task.createdAt)}</span>
                        {deadlineInfo && (
                          <>
                            <span>·</span>
                            <span className={deadlineInfo.color}>{deadlineInfo.text}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {getStatusBadge(task.status || "open")}
                      <div className="flex gap-1">
                        {onViewTask && (
                          <button
                            onClick={() => onViewTask(task)}
                            className="bg-balaio-ink text-white px-3 py-1 text-xs font-semibold rounded-balaio-pill hover:opacity-90 transition-opacity"
                          >
                            {language === "en" ? "View" : "Ver"}
                          </button>
                        )}
                        {(task.status === "open" || (!task.status && task.active && Number(task.availableSlots) > 0)) &&
                          account &&
                          task.creator?.toLowerCase() !== account?.toLowerCase() &&
                          onClaimTask && (
                            <button
                              onClick={() => onClaimTask(task)}
                              className="bg-balaio-sage text-white px-3 py-1 text-xs font-semibold rounded-balaio-pill hover:opacity-90 transition-opacity"
                            >
                              {language === "en" ? "Claim" : "Reivindicar"}
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Opportunities */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted">
              {language === "en" ? "Ecosystem" : "Ecossistema"}
            </p>
            <h3 className="font-display text-xl text-balaio-ink">
              {language === "en" ? <><em>Funding</em> Opportunities</> : <>Oportunidades de <em>Financiamento</em></>}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {opportunities.map((opp, index) => (
            <div key={index} className="bg-white border border-balaio-rule rounded-balaio-xl p-4 shadow-balaio-card">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm text-balaio-ink flex-1 mr-2">{opp.title}</h4>
                <a
                  href={opp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-balaio-sage text-white px-3 py-1 text-xs font-semibold rounded-balaio-pill hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  Apply
                </a>
              </div>

              <span className="bg-balaio-surface text-balaio-muted px-2 py-0.5 text-xs font-semibold rounded-full inline-block mb-2">
                {opp.type}
              </span>

              <p className="text-xs text-balaio-muted mb-3" style={{ lineHeight: 1.6 }}>{opp.description}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-balaio-muted mb-3">
                <span>{opp.provider}</span>
                <span>·</span>
                <span>{opp.amount}</span>
                <span>·</span>
                <span>{opp.deadline}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {opp.tags.map((tag) => (
                  <span key={tag} className="bg-balaio-surface text-balaio-muted px-2 py-0.5 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Features Banner */}
      <div className="bg-balaio-surface rounded-balaio-xl p-6 relative overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
          <img src="/logo.png" alt="Balaio" className="w-24 h-24 object-contain" />
        </div>
        <div className="relative z-10">
          <h3 className="font-display text-xl text-balaio-ink mb-2">
            {language === "en" ? <>Discover All <em>Features</em></> : <>Descubra as <em>Funcionalidades</em></>}
          </h3>
          <p className="text-xs text-balaio-muted mb-4" style={{ lineHeight: 1.6 }}>
            {language === "en"
              ? "Smart task creation, mobile-first design, and comprehensive tools for every user type"
              : "Criação inteligente de tarefas, design mobile-first e ferramentas completas para todos os tipos de usuário"}
          </p>
          <button
            onClick={onNavigateToFeatures}
            className="bg-balaio-ink text-white px-5 py-2.5 text-sm font-semibold rounded-balaio-lg hover:opacity-90 transition-opacity"
          >
            {language === "en" ? "Explore Features →" : "Explorar Funcionalidades →"}
          </button>
        </div>
      </div>
    </div>
  )
}
