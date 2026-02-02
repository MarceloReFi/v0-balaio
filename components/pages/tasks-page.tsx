"use client"

import { useState } from "react"
import { Search, HelpCircle, Loader2 } from "lucide-react"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip-custom"
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
    if (!task.mySlot) return { text: t.open.toUpperCase(), color: "bg-[#99FF99] text-[#111111]" }
    if (task.mySlot.withdrawn) return { text: t.completed.toUpperCase(), color: "bg-[#666666] text-white" }
    if (task.mySlot.approved) return { text: t.approved.toUpperCase(), color: "bg-[#99FF99] text-[#111111]" }
    if (task.mySlot.submitted) return { text: t.submitted.toUpperCase(), color: "bg-[#FFFF66] text-[#111111]" }
    if (task.mySlot.claimed) return { text: t.claimed.toUpperCase(), color: "bg-[#FF99CC] text-[#111111]" }
    return { text: t.open.toUpperCase(), color: "bg-[#99FF99] text-[#111111]" }
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
    if (diffDays <= 1) return { color: "text-[#111111]", text: language === "en" ? "1 day left" : "1 dia restante" }
    if (diffDays <= 7) return { color: "text-[#111111]", text: `${Math.ceil(diffDays)} ${language === "en" ? "days left" : "dias restantes"}` }
    return { color: "text-[#111111]", text: deadlineDate.toLocaleDateString() }
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    const days = Math.floor(seconds / 86400)
    if (days > 0) return `${days}${language === "en" ? "d" : "d"} ${language === "en" ? "ago" : "atrás"}`
    const hours = Math.floor(seconds / 3600)
    if (hours > 0) return `${hours}${language === "en" ? "h" : "h"} ${language === "en" ? "ago" : "atrás"}`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}${language === "en" ? "m" : "m"} ${language === "en" ? "ago" : "atrás"}`
  }

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === "all") return true
    if (taskFilter === "open") return task.active && Number(task.availableSlots) > 0
    if (taskFilter === "created") return task.creator.toLowerCase() === account.toLowerCase()
    if (taskFilter === "claimed") return task.mySlot && task.mySlot.claimed
    return true
  })

  const handleSearch = async () => {
    if (!searchQuery) return
    setLoading(true)
    await searchTask(searchQuery)
    setLoading(false)
  }

  const handleRefresh = async () => {
    setLoading(true)
    await loadMyTasks()
    setLoading(false)
  }

  return (
    <div className="p-4">
      <TooltipProvider>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl flex items-center gap-2">
            📋 {t.tasks}
            <Tooltip
              text={
                language === "en"
                  ? "Search for task IDs to view and claim available work"
                  : "Busque IDs de tarefas para visualizar e reivindicar trabalho disponível"
              }
            >
              <HelpCircle size={16} className="text-[#666666]" />
            </Tooltip>
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#FF99CC] text-[#111111] px-4 py-2 font-bold border-2 border-[#111111] rounded-xl hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow text-sm"
          >
            + {t.create}
          </button>
        </div>
      </TooltipProvider>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", "open", "created", "claimed"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setTaskFilter(filter)}
            className={`px-4 py-2 font-bold border-2 text-xs rounded-xl ${
              taskFilter === filter
                ? "bg-[#111111] text-white border-[#111111]"
                : "bg-white text-[#111111] border-[#111111]"
            }`}
          >
            {filter === "all" ? t.allTasks : filter === "open" ? t.openTasks : filter === "created" ? t.createdTasks : t.claimedTasks}
          </button>
        ))}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-white text-[#111111] px-4 py-2 font-bold border-2 border-[#111111] rounded-xl text-xs disabled:opacity-70"
        >
          🔄 {language === "en" ? "Refresh" : "Atualizar"}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t.searchTask}
          className="flex-1 px-3 py-2.5 border-2 border-[#111111] rounded-xl bg-white font-mono text-sm"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-white text-[#111111] px-5 py-2.5 font-bold border-2 border-[#111111] rounded-xl hover:bg-gray-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white border-2 border-[#111111] rounded-xl p-10 text-center shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-bold mb-1">{t.noTasks}</p>
          <p className="text-xs text-[#666666]">{t.noTasksDesc}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredTasks.map((task, idx) => {
            const status = getStatusBadge(task)
            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedTask(task)
                  setShowTaskModal(true)
                }}
                className="bg-white border-2 border-[#111111] rounded-xl p-5 cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-3 h-3 rounded-full ${getSlotStatusColor(task)}`} title={
                        !task.active || Number(task.availableSlots) === 0
                          ? (language === "en" ? "No slots available" : "Sem vagas")
                          : Number(task.availableSlots) === Number(task.totalSlots)
                            ? (language === "en" ? "Open" : "Aberto")
                            : (language === "en" ? "Slots available" : "Vagas disponíveis")
                      }></span>
                      <h3 className="font-bold text-base">{task.title}</h3>
                    </div>
                    <p className="text-xs text-[#666666] mb-2">{task.description}</p>

                    <div className="text-xs text-[#666666] mb-2">
                      {language === "en" ? "Creator:" : "Criador:"} {shortenAddress(task.creator)}
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs mb-2">
                      <span>
                        💰 {task.reward} {task.token}
                      </span>
                      <span>
                        👥 {task.availableSlots}/{task.totalSlots} {language === "en" ? "slots" : "vagas"}
                      </span>
                      <span>⏰ {getTimeAgo(task.createdAt)}</span>
                      {task.deadline && (() => {
                        const deadlineInfo = getDeadlineInfo(task.deadline)
                        return deadlineInfo ? (
                          <span className={deadlineInfo.color}>
                            📅 {deadlineInfo.text}
                          </span>
                        ) : null
                      })()}
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border-2 border-[#111111] ${status.color}`}
                      >
                        {status.text}
                      </span>
                      {task.validationMethod && (
                        <a
                          href={task.validationMethod.startsWith('http') ? task.validationMethod : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`text-xs ${task.validationMethod.startsWith('http') ? 'text-[#111111] hover:underline' : 'text-[#666666]'}`}
                        >
                          🔗 {language === "en" ? "Details" : "Detalhes"}
                        </a>
                      )}
                    </div>
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
