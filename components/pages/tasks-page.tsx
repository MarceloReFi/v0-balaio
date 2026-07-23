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
  onViewTask: (task: Task) => void
  setShowCreateModal: (show: boolean) => void
  language: Language
}

export function TasksPage({
  tasks,
  account,
  searchTask,
  loadMyTasks,
  onViewTask,
  setShowCreateModal,
  language,
}: TasksPageProps) {
  const t = useTranslations(language)
  const [searchQuery, setSearchQuery] = useState("")
  const [taskFilter, setTaskFilter] = useState<"all" | "open" | "created" | "claimed">("all")
  const [loading, setLoading] = useState(false)

  const getStatusBadge = (task: Task) => {
    if (task.mySlot) {
      if (task.mySlot.withdrawn) return { text: t.completed, className: "bg-surface-container-high text-on-surface-variant" }
      if (task.mySlot.approved) return { text: t.approved, className: "bg-secondary-fixed text-on-secondary-fixed-dim" }
      if (task.mySlot.submitted) return { text: t.submitted, className: "bg-marigold/20 text-on-tertiary-fixed" }
      if (task.mySlot.claimed) return { text: t.claimed, className: "bg-surface-container-high text-on-surface-variant" }
    }
    const hasOpenSlots = task.active && Number(task.availableSlots) > 0
    if (hasOpenSlots) return { text: t.open, className: "bg-secondary-fixed text-on-secondary-fixed-dim" }
    return { text: t.claimed, className: "bg-surface-container-high text-on-surface-variant" }
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

  const getStatusGroup = (task: Task): "open" | "progress" | "completed" => {
    if (task.mySlot) {
      if (task.mySlot.approved || task.mySlot.withdrawn) return "completed"
      return "progress"
    }
    const hasOpenSlots = task.active && Number(task.availableSlots) > 0
    return hasOpenSlots ? "open" : "progress"
  }

  const statusGroups = [
    { key: "open" as const, label: language === "en" ? "Open" : "Abertas" },
    { key: "progress" as const, label: language === "en" ? "In Progress" : "Em Andamento" },
    { key: "completed" as const, label: language === "en" ? "Completed" : "Concluídas" },
  ]

  const groupedTasks = statusGroups
    .map((group) => ({ ...group, tasks: filteredTasks.filter((task) => getStatusGroup(task) === group.key) }))
    .filter((group) => group.tasks.length > 0)

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
    <div className="max-w-3xl mx-auto px-[22px] py-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant">
            {language === "en" ? "Browse" : "Explorar"}
          </p>
          <h2 className="font-headline text-2xl text-on-surface">
            {t.tasks}
          </h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-marigold text-on-tertiary-fixed px-4 py-2 font-semibold rounded-full text-sm hover:opacity-90 transition-opacity"
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
          className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-1 focus:ring-secondary"
        />
        <button
          onClick={searchTasks}
          disabled={loading}
          className="bg-surface-container-low text-on-surface px-4 py-2.5 rounded-xl hover:bg-surface-container-high transition-colors"
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
            className={`px-4 py-1.5 font-semibold text-xs rounded-full transition-colors ${
              taskFilter === filter
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {filterLabels[filter]}
          </button>
        ))}
        <button
          onClick={refreshTasks}
          disabled={loading}
          className="bg-surface-container-low text-on-surface-variant px-4 py-1.5 font-semibold text-xs rounded-full hover:bg-surface-container-high transition-colors disabled:opacity-50"
        >
          {language === "en" ? "Refresh" : "Atualizar"}
        </button>
      </div>

      {/* Count label */}
      <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-3">
        {filteredTasks.length} {language === "en" ? "tasks" : "tarefas"}
      </p>

      {/* Task groups */}
      {filteredTasks.length === 0 ? (
        <div className="bg-surface-container-low rounded-2xl p-10 text-center">
          <p className="font-semibold text-on-surface mb-1">{t.noTasks}</p>
          <p className="text-xs text-on-surface-variant">{t.noTasksDesc}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-7">
          {groupedTasks.map((group) => (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant">
                  {group.label}
                </h3>
                <span className="text-xs text-on-surface-variant/60">{group.tasks.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {group.tasks.map((task, idx) => {
                  const status = getStatusBadge(task)
                  return (
                    <div
                      key={idx}
                      onClick={() => onViewTask(task)}
                      className="bg-surface-container-low/60 hover:bg-surface-container-low rounded-2xl p-4 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h4 className="font-headline text-lg text-on-surface leading-snug">{task.title}</h4>
                        <span
                          className={`flex-shrink-0 px-2.5 py-1 text-[11px] font-semibold rounded-full ${status.className}`}
                        >
                          {status.text}
                        </span>
                      </div>

                      <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">{task.description}</p>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-semibold text-on-surface">{task.reward}</span>
                          <TokenBadge symbol={task.token || "cUSD"} />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                          <span>{shortenAddress(task.creator)}</span>
                          <span>·</span>
                          <span>{getTimeAgo(task.createdAt)}</span>
                          {task.validationMethod && task.validationMethod.startsWith('http') && (
                            <>
                              <span>·</span>
                              <a
                                href={task.validationMethod}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-secondary hover:underline"
                              >
                                {language === "en" ? "Details" : "Detalhes"}
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
