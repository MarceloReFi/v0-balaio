"use client"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { TokenBadge } from "@/components/ui/token-badge"
import type { Task } from "@/lib/types"
import { useTranslations, type Language } from "@/lib/translations"

interface TasksPageProps {
  tasks: Task[]
  account: string
  searchTask: (query: string) => void
  loadMyTasks: () => void
  setSelectedTask: (task: Task) => void
  setShowTaskModal: (show: boolean) => void
  setShowCreateModal: (show: boolean) => void
  language: Language
}

export function TasksPage({
  tasks,
  account,
  searchTask,
  loadMyTasks,
  setSelectedTask,
  setShowTaskModal,
  setShowCreateModal,
  language,
}: TasksPageProps) {
  const t = useTranslations(language)
  const [searchQuery, setSearchQuery] = useState("")
  const [taskFilter, setTaskFilter] = useState<"all" | "open" | "created" | "claimed">("all")
  const [loading, setLoading] = useState(false)

  const getStatusBadge = (task: Task) => {
    if (!task.mySlot) return { text: t.open, className: "bg-balaio-open-bg text-balaio-open-text" }
    if (task.mySlot.withdrawn) return { text: t.completed, className: "bg-balaio-claimed-bg text-balaio-claimed-text" }
    if (task.mySlot.approved) return { text: t.approved, className: "bg-balaio-open-bg text-balaio-open-text" }
    if (task.mySlot.submitted) return { text: t.submitted, className: "bg-balaio-pending-bg text-balaio-pending-text" }
    if (task.mySlot.claimed) return { text: t.claimed, className: "bg-balaio-claimed-bg text-balaio-claimed-text" }
    return { text: t.open, className: "bg-balaio-open-bg text-balaio-open-text" }
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
    if (diffDays <= 1) return { color: "text-balaio-ink", text: language === "en" ? "1 day left" : "1 dia restante" }
    if (diffDays <= 7) return { color: "text-balaio-ink", text: `${Math.ceil(diffDays)} ${language === "en" ? "days left" : "dias restantes"}` }
    return { color: "text-balaio-muted", text: deadlineDate.toLocaleDateString() }
  }

  const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    const days = Math.floor(seconds / 86400)
    if (days > 0) return `${days}d ${language === "en" ? "ago" : "atrás"}`
    const hours = Math.floor(seconds / 3600)
    if (hours > 0) return `${hours}h ${language === "en" ? "ago" : "atrás"}`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ${language === "en" ? "ago" : "atrás"}`
  }

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === "all") return true
    if (taskFilter === "open") return task.active && Number(task.availableSlots) > 0
    if (taskFilter === "created") return task.creator.toLowerCase() === account.toLowerCase()
    if (taskFilter === "claimed") return task.mySlot && task.mySlot.claimed
    return true
  })

  const searchTasks = async () => {
    if (!searchQuery) return
    setLoading(true)
    await searchTask(searchQuery)
    setLoading(false)
  }

  const refreshTasks = async () => {
    setLoading(true)
    await loadMyTasks()
    setLoading(false)
  }

  const filterLabels = {
    all: t.allTasks,
    open: t.openTasks,
    created: t.createdTasks,
    claimed: t.claimedTasks,
  }

  return (
    <div className="px-[22px] py-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted">
            {language === "en" ? "Browse" : "Explorar"}
          </p>
          <h2 className="font-display text-2xl text-balaio-ink">
            {t.tasks}
          </h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-balaio-sage text-white px-4 py-2 font-semibold rounded-balaio-pill text-sm hover:opacity-90 transition-opacity"
        >
          + {t.create}
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchTasks()}
          placeholder={t.searchTask}
          className="flex-1 px-4 py-2.5 bg-balaio-surface rounded-balaio-lg text-sm outline-none focus:ring-1 focus:ring-balaio-sage"
        />
        <button
          onClick={searchTasks}
          disabled={loading}
          className="bg-balaio-surface text-balaio-ink px-4 py-2.5 rounded-balaio-lg hover:bg-balaio-rule transition-colors"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", "open", "created", "claimed"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setTaskFilter(filter)}
            className={`px-4 py-1.5 font-semibold text-xs rounded-balaio-pill transition-colors ${
              taskFilter === filter
                ? "bg-balaio-ink text-white"
                : "bg-balaio-surface text-balaio-muted hover:bg-balaio-rule"
            }`}
          >
            {filterLabels[filter]}
          </button>
        ))}
        <button
          onClick={refreshTasks}
          disabled={loading}
          className="bg-balaio-surface text-balaio-muted px-4 py-1.5 font-semibold text-xs rounded-balaio-pill hover:bg-balaio-rule transition-colors disabled:opacity-50"
        >
          {language === "en" ? "Refresh" : "Atualizar"}
        </button>
      </div>

      {/* Count label */}
      <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted mb-3">
        {filteredTasks.length} {language === "en" ? "tasks" : "tarefas"}
      </p>

      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <div className="bg-balaio-surface rounded-balaio-xl p-10 text-center">
          <p className="font-semibold text-balaio-ink mb-1">{t.noTasks}</p>
          <p className="text-xs text-balaio-muted">{t.noTasksDesc}</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {filteredTasks.map((task, idx) => {
            const status = getStatusBadge(task)
            const deadlineInfo = getDeadlineInfo(task.deadline)
            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedTask(task)
                  setShowTaskModal(true)
                }}
                className="py-4 border-b border-balaio-rule cursor-pointer hover:bg-balaio-surface/50 transition-colors -mx-[22px] px-[22px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getSlotDotColor(task)}`} />
                      <h3 className="font-semibold text-sm text-balaio-ink truncate">{task.title}</h3>
                    </div>
                    <p className="text-xs text-balaio-muted mb-2 line-clamp-1">{task.description}</p>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-balaio-muted">
                      <span>{shortenAddress(task.creator)}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        {task.reward} <TokenBadge symbol={task.token || "cUSD"} />
                      </span>
                      <span>·</span>
                      <span>{task.availableSlots}/{task.totalSlots} {language === "en" ? "slots" : "vagas"}</span>
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

                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-balaio-pill ${status.className}`}>
                      {status.text}
                    </span>
                    {task.validationMethod && task.validationMethod.startsWith('http') && (
                      <a
                        href={task.validationMethod}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-balaio-sage hover:underline"
                      >
                        {language === "en" ? "Details" : "Detalhes"}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
