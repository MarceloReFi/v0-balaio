"use client"

import { useTranslations, type Language } from "@/lib/translations"
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
        return <span className="bg-[#99FF99] text-[#111111] px-2 py-0.5 text-xs font-bold border-2 border-[#111111] rounded-lg">Active</span>
      case "claimed":
        return (
          <span className="bg-white text-[#666666] px-2 py-0.5 text-xs font-bold border-2 border-[#666666] rounded-lg">Claimed</span>
        )
      case "submitted":
        return (
          <span className="bg-[#FFFF66] text-[#111111] px-2 py-0.5 text-xs font-bold border-2 border-[#111111] rounded-lg">Pending</span>
        )
      case "approved":
        return (
          <span className="bg-[#99FF99] text-[#111111] px-2 py-0.5 text-xs font-bold border-2 border-[#111111] rounded-lg">Approved</span>
        )
      case "completed":
        return (
          <span className="bg-[#666666] text-white px-2 py-0.5 text-xs font-bold border-2 border-[#111111] rounded-lg">Completed</span>
        )
      default:
        return (
          <span className="bg-gray-200 text-[#666666] px-2 py-0.5 text-xs font-bold border-2 border-[#666666] rounded-lg">
            {status}
          </span>
        )
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

  const getSlotStatusColor = (task: Task) => {
    const available = Number(task.availableSlots)
    const total = Number(task.totalSlots)

    if (!task.active || available === 0) return "bg-red-500"
    if (available === total) return "bg-[#99FF99]"
    return "bg-[#FFFF66]"
  }

  const getDeadlineInfo = (deadline: Date | null | undefined) => {
    if (!deadline) return null

    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffMs = deadlineDate.getTime() - now.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffMs < 0) return { color: "text-red-600", text: language === "en" ? "Expired" : "Expirado" }
    if (diffDays <= 1) return { color: "text-[#FFFF66]", text: language === "en" ? "1 day" : "1 dia" }
    return { color: "text-[#99FF99]", text: `${Math.ceil(diffDays)}d` }
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
    <div className="p-5 pb-24">
      {/* Latest Tasks Section */}
      {latestTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="text-[#666666]">📋</span> {language === "en" ? "Latest Tasks" : "Últimas Tarefas"}
            </h3>
            {onNavigateToTasks && (
              <button
                onClick={onNavigateToTasks}
                className="bg-white border-2 border-[#111111] rounded-xl px-3 py-1.5 text-sm font-bold hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow"
              >
                + More
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {latestTasks.map((task) => {
              const deadlineInfo = getDeadlineInfo(task.deadline)
              return (
                <div key={task.id} className="bg-white border-2 border-[#111111] rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${getSlotStatusColor(task)}`}></span>
                        <h4 className="font-bold text-sm">{task.title}</h4>
                      </div>
                      <p className="text-xs text-[#666666] mb-2 line-clamp-2">{task.description}</p>

                      <div className="text-xs text-[#666666] mb-1">
                        {language === "en" ? "By:" : "Por:"} {shortenAddress(task.creator)}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                        <span className="flex items-center gap-1">
                          💰 {task.reward} {task.token || "cUSD"}
                        </span>
                        <span className="flex items-center gap-1">👥 {task.availableSlots || task.totalSlots || 1} slots</span>
                        <span className="flex items-center gap-1">⏰ {getTimeAgo(task.createdAt)}</span>
                        {deadlineInfo && (
                          <span className={`flex items-center gap-1 ${deadlineInfo.color}`}>
                            📅 {deadlineInfo.text}
                          </span>
                        )}
                        {getStatusBadge(task.status || "open")}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      {onViewTask && (
                        <button
                          onClick={() => onViewTask(task)}
                          className="bg-[#111111] text-white px-3 py-1.5 text-xs font-bold border-2 border-[#111111] rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow"
                        >
                          View
                        </button>
                      )}
                      {(task.status === "open" || (!task.status && task.active && Number(task.availableSlots) > 0)) &&
                        account &&
                        task.creator?.toLowerCase() !== account?.toLowerCase() &&
                        onClaimTask && (
                          <button
                            onClick={() => onClaimTask(task)}
                            className="bg-[#FF99CC] text-[#111111] px-3 py-1.5 text-xs font-bold border-2 border-[#111111] rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow"
                          >
                            Claim
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Opportunities Section */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">

          <button className="bg-white border-2 border-[#111111] rounded-xl px-3 py-1.5 text-sm font-bold hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow">
            + More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {opportunities.map((opp, index) => (
            <div key={index} className="bg-white border-2 border-[#111111] rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-sm flex-1">{opp.title}</h4>
                <a
                  href={opp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF99CC] text-[#111111] px-3 py-1.5 text-xs font-bold border-2 border-[#111111] rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow"
                >
                  Apply
                </a>
              </div>

              <div className="mb-2">
                <span
                  className={`px-2 py-0.5 text-xs font-bold border-2 border-[#111111] rounded-lg ${
                    opp.type.includes("Grant") || opp.type.includes("Subsídio")
                      ? "bg-[#FF99CC] text-[#111111]"
                      : opp.type.includes("Rewards") || opp.type.includes("Recompensas")
                        ? "bg-[#99FF99] text-[#111111]"
                        : opp.type.includes("Accelerator") || opp.type.includes("Aceleradora")
                          ? "bg-[#FFFF66] text-[#111111]"
                          : "bg-[#111111] text-white"
                  }`}
                >
                  {opp.type}
                </span>
              </div>

              <p className="text-xs text-[#666666] mb-3">{opp.description}</p>

              <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                <span className="flex items-center gap-1">🏢 {opp.provider}</span>
                <span className="flex items-center gap-1">💰 {opp.amount}</span>
              </div>

              <div className="flex items-center gap-1 text-xs mb-3">
                <span>📅 {opp.deadline}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {opp.tags.map((tag) => (
                  <span key={tag} className="bg-white border-2 border-[#111111] rounded-lg px-2 py-0.5 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discover Features Section */}
      <div className="bg-[#99FF99] border-2 border-[#111111] rounded-xl p-6 relative overflow-hidden shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
          <img src="/logo.png" alt="Balaio" className="w-32 h-32 object-contain" />
        </div>

        <div className="text-center relative z-10">

          <h3 className="text-[#111111] font-bold text-lg mb-2">
            {language === "en" ? "Discover All Features" : "Descubra Todas as Funcionalidades"}
          </h3>
          <p className="text-[#111111]/80 text-sm mb-4">
            {language === "en"
              ? "Smart task creation, mobile-first design, and comprehensive tools for every user type"
              : "Criação inteligente de tarefas, design mobile-first e ferramentas completas para todos os tipos de usuário"}
          </p>
          <button
            onClick={onNavigateToFeatures}
            className="bg-[#111111] text-white px-4 py-2 text-sm font-bold border-2 border-[#111111] rounded-xl hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow"
          >
            📋 {language === "en" ? "Explore Features →" : "Explorar Funcionalidades →"}
          </button>
        </div>
      </div>
    </div>
  )
}
