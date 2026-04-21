"use client"

import { useTranslations, type Language } from "@/lib/translations"
import { TokenBadge } from "@/components/ui/token-badge"
import type { Task } from "@/lib/types"
import { Leaf, GraduationCap, Building2, Users, Bot } from "lucide-react"

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
    const base = "px-3 py-1 text-xs font-semibold rounded-full"
    switch (status) {
      case "open":
        return <span className={`${base} bg-[#EAF4EE] text-[#4A7B5E]`}>Open</span>
      case "claimed":
        return <span className={`${base} bg-surface-container-high text-on-surface-variant`}>Claimed</span>
      case "submitted":
        return <span className={`${base} bg-[#FEF9E7] text-[#8A6D00]`}>Pending</span>
      case "approved":
        return <span className={`${base} bg-[#EAF4EE] text-[#4A7B5E]`}>Approved</span>
      case "completed":
        return <span className={`${base} bg-surface-container-high text-on-surface-variant`}>Completed</span>
      default:
        return <span className={`${base} bg-surface-container-high text-on-surface-variant`}>{status}</span>
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
    if (available === total) return "bg-[#4A7B5E]"
    return "bg-yellow-400"
  }

  const getDeadlineInfo = (deadline: Date | null | undefined) => {
    if (!deadline) return null
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffMs = deadlineDate.getTime() - now.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    if (diffMs < 0) return { color: "text-red-500", text: language === "en" ? "Expired" : "Expirado" }
    if (diffDays <= 1) return { color: "text-[#8A6D00]", text: language === "en" ? "1 day" : "1 dia" }
    return { color: "text-[#4A7B5E]", text: `${Math.ceil(diffDays)}d` }
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

  const steps = [
    {
      num: "01",
      title: language === "en" ? "Define & Budget" : "Definição & Orçamento",
      desc: language === "en"
        ? "Set tasks, approval criteria and allocate your project budget."
        : "Parametrize tarefas, critérios de aprovação e aloque o orçamento.",
    },
    {
      num: "02",
      title: language === "en" ? "Work Assignment" : "Atribuição de Trabalho",
      desc: language === "en"
        ? "Talents or AI agents take execution based on qualifications."
        : "Talentos ou agentes de IA assumem com base em suas qualificações.",
    },
    {
      num: "03",
      title: language === "en" ? "Delivery Review" : "Aprovação de Entregas",
      desc: language === "en"
        ? "Validate completed work against the established requirements."
        : "Valide o trabalho concluído conforme os requisitos estabelecidos.",
    },
    {
      num: "04",
      title: language === "en" ? "Automatic Payment" : "Pagamento Automático",
      desc: language === "en"
        ? "Funds released instantly upon approval, no admin overhead."
        : "Fundos liberados imediatamente após aprovação, sem burocracia.",
    },
  ]

  const audienceCards = [
    {
      icon: <Building2 size={28} className="text-[#f6be2f]" />,
      title: language === "en" ? "Companies & Projects" : "Empresas e Projetos",
      desc: language === "en"
        ? "Convert budget into execution. Allocate capital directly into tasks and pay only for approved results."
        : "Converta orçamento em execução. Aloque capital diretamente em tarefas e pague apenas por resultados aprovados.",
      cta: language === "en" ? "Learn more" : "Saiba mais",
      dark: true,
    },
    {
      icon: <Users size={28} className="text-secondary" />,
      title: language === "en" ? "Contributors" : "Contribuidores",
      desc: language === "en"
        ? "Execute clearly scoped tasks and receive automatic payment after your work is approved."
        : "Execute tarefas com escopo claro e receba pagamento automático após aprovação.",
      cta: language === "en" ? "Explore" : "Explorar",
      dark: false,
    },
    {
      icon: <Bot size={28} className="text-primary-container" />,
      title: language === "en" ? "AI Teams" : "Equipes de IA",
      desc: language === "en"
        ? "Integrate autonomous agents into human workflows, automating micro-tasks with direct settlement."
        : "Integre agentes autônomos a fluxos humanos, automatizando micro-tarefas com liquidação direta.",
      cta: language === "en" ? "Docs" : "Documentação",
      dark: false,
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-[22px] py-5 pb-24">

      {/* Partnerships strip */}
      <section className="bg-surface-container-low rounded-2xl p-5 mb-8">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary text-center mb-4">
          {language === "en" ? "Partnerships" : "Parcerias"}
        </p>
        <div className="flex justify-center items-center gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <Leaf size={16} className="text-green-600" />
            <span className="font-bold text-sm text-on-surface">Green Pill Brasil</span>
          </div>
          <div className="opacity-60 hover:opacity-100 transition-opacity">
            <span className="font-black text-sm" style={{ color: "#00DAE4" }}>GoodDollar</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <GraduationCap size={16} className="text-on-surface" />
            <span className="font-bold text-sm text-on-surface">Blockchain na Escola</span>
          </div>
        </div>
      </section>

      {/* Latest Tasks */}
      {latestTasks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-secondary">
                {language === "en" ? "Recent" : "Recentes"}
              </p>
              <h3 className="text-xl font-bold text-primary-container" style={{ fontFamily: "'Noto Serif', serif" }}>
                {language === "en" ? "Latest Tasks" : "Últimas Tarefas"}
              </h3>
            </div>
            {onNavigateToTasks && (
              <button
                onClick={onNavigateToTasks}
                className="bg-surface-container-high text-on-surface-variant px-4 py-1.5 text-xs font-semibold rounded-full hover:bg-surface-container-highest transition-colors"
              >
                {language === "en" ? "See all" : "Ver todas"}
              </button>
            )}
          </div>

          <div className="flex flex-col">
            {latestTasks.map((task) => {
              const deadlineInfo = getDeadlineInfo(task.deadline)
              return (
                <div key={task.id} className="py-4 border-b border-outline-variant/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getSlotDotColor(task)}`} />
                        <h4 className="font-semibold text-sm text-on-surface truncate">{task.title}</h4>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-2 line-clamp-2">{task.description}</p>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
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
                            className="bg-primary-container text-white px-3 py-1 text-xs font-semibold rounded-full hover:opacity-90 transition-opacity"
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
                              className="bg-secondary text-white px-3 py-1 text-xs font-semibold rounded-full hover:opacity-90 transition-opacity"
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

      {/* Execução sem fricção — 4 steps */}
      <section className="mb-8">
        <p className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-secondary mb-1">
          {language === "en" ? "How it works" : "Como funciona"}
        </p>
        <h3 className="text-xl font-bold text-primary-container mb-1" style={{ fontFamily: "'Noto Serif', serif" }}>
          {language === "en" ? "Frictionless execution" : "Execução sem fricção"}
        </h3>
        <p className="text-sm text-on-surface-variant mb-5 leading-relaxed">
          {language === "en"
            ? "Replace bureaucracy with a lean coordination flow focused on results."
            : "Substitua a burocracia por um fluxo de coordenação ágil focado em resultados."}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {steps.map((step) => (
            <div key={step.num} className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
              <span className="text-secondary font-bold text-[10px] tracking-widest uppercase">
                {language === "en" ? "Step" : "Passo"} {step.num}
              </span>
              <h4 className="font-bold text-on-surface text-sm mt-2 mb-1" style={{ fontFamily: "'Noto Serif', serif" }}>
                {step.title}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Audience cards */}
      <section className="mb-8">
        <p className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-secondary mb-4">
          {language === "en" ? "For every team" : "Para cada equipe"}
        </p>
        <div className="flex flex-col gap-3">
          {audienceCards.map((card, i) => (
            <div
              key={i}
              className={`rounded-xl p-5 flex items-start gap-4 border border-outline-variant/20 ${
                card.dark
                  ? "bg-primary-container text-surface"
                  : "bg-surface-container-low text-on-surface"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">{card.icon}</div>
              <div>
                <h4 className={`font-bold text-sm mb-1 ${card.dark ? "text-surface" : "text-primary-container"}`} style={{ fontFamily: "'Noto Serif', serif" }}>
                  {card.title}
                </h4>
                <p className={`text-xs leading-relaxed ${card.dark ? "text-on-primary-container" : "text-on-surface-variant"}`}>
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Opportunities */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-secondary">
              {language === "en" ? "Ecosystem" : "Ecossistema"}
            </p>
            <h3 className="text-xl font-bold text-primary-container" style={{ fontFamily: "'Noto Serif', serif" }}>
              {language === "en" ? "Funding Opportunities" : "Oportunidades de Financiamento"}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {opportunities.map((opp, index) => (
            <div key={index} className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm text-on-surface flex-1 mr-2">{opp.title}</h4>
                <a
                  href={opp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary text-white px-3 py-1 text-xs font-semibold rounded-full hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  {language === "en" ? "Apply" : "Aplicar"}
                </a>
              </div>

              <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 text-xs font-semibold rounded-full inline-block mb-2">
                {opp.type}
              </span>

              <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">{opp.description}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mb-3">
                <span>{opp.provider}</span>
                <span>·</span>
                <span>{opp.amount}</span>
                <span>·</span>
                <span>{opp.deadline}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {opp.tags.map((tag) => (
                  <span key={tag} className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Features Banner */}
      <div className="bg-primary-container rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
          <img src="/logo.png" alt="Balaio" className="w-24 h-24 object-contain" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-surface mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
            {language === "en" ? "Discover All Features" : "Descubra as Funcionalidades"}
          </h3>
          <p className="text-xs text-on-primary-container mb-4 leading-relaxed">
            {language === "en"
              ? "Smart task creation, mobile-first design, and comprehensive tools for every user type"
              : "Criação inteligente de tarefas, design mobile-first e ferramentas completas para todos os tipos de usuário"}
          </p>
          <button
            onClick={onNavigateToFeatures}
            className="bg-[#f6be2f] text-on-surface px-5 py-2.5 text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            {language === "en" ? "Explore Features →" : "Explorar Funcionalidades →"}
          </button>
        </div>
      </div>
    </div>
  )
}
