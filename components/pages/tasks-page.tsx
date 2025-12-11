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
  const [taskFilter, setTaskFilter] = useState<"all" | "open" | "my">("all")
  const [loading, setLoading] = useState(false)

  const getStatusBadge = (task: Task) => {
    if (!task.mySlot) return { text: t.open.toUpperCase(), color: "bg-[#7A8770]" }
    if (task.mySlot.withdrawn) return { text: t.completed.toUpperCase(), color: "bg-gray-700" }
    if (task.mySlot.approved) return { text: t.approved.toUpperCase(), color: "bg-[#7A8770]" }
    if (task.mySlot.submitted) return { text: t.submitted.toUpperCase(), color: "bg-[#F2E885] text-black" }
    if (task.mySlot.claimed) return { text: t.claimed.toUpperCase(), color: "bg-[#B88FD8]" }
    return { text: t.open.toUpperCase(), color: "bg-[#7A8770]" }
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
    if (taskFilter === "my") return task.mySlot && task.mySlot.claimed
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
              <HelpCircle size={16} className="text-gray-600" />
            </Tooltip>
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#B88FD8] text-white px-4 py-2 font-bold border-2 border-black hover:shadow-md text-sm"
          >
            + {t.create}
          </button>
        </div>
      </TooltipProvider>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", "open", "my"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setTaskFilter(filter)}
            className={`px-4 py-2 font-bold border-2 text-xs ${
              taskFilter === filter
                ? "bg-[#3A4571] text-white border-[#3A4571]"
                : "bg-white text-[#3A4571] border-[#3A4571]"
            }`}
          >
            {filter === "all" ? t.allTasks : filter === "open" ? t.openTasks : t.myTasks}
          </button>
        ))}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-white text-[#3A4571] px-4 py-2 font-bold border-2 border-[#3A4571] text-xs disabled:opacity-70"
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
          className="flex-1 px-3 py-2.5 border-2 border-gray-300 bg-white font-mono text-sm"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-white text-[#3A4571] px-5 py-2.5 font-bold border-2 border-[#3A4571] hover:bg-gray-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white border-2 border-black p-10 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-bold mb-1">{t.noTasks}</p>
          <p className="text-xs text-gray-600">{t.noTasksDesc}</p>
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
                className="bg-white border-2 border-black p-5 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-base mb-1">{task.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">{task.description}</p>

                    <div className="flex gap-3 text-xs mb-2">
                      <span>
                        💰 {task.reward} {task.token}
                      </span>
                      <span>
                        👥 {task.availableSlots}/{task.totalSlots} {language === "en" ? "slots" : "vagas"}
                      </span>
                      <span>⏰ {getTimeAgo(task.createdAt)}</span>
                    </div>

                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full text-white ${status.color}`}
                    >
                      {status.text}
                    </span>
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
