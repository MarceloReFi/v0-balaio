"use client"

import { useState } from "react"
import { Search, HelpCircle, Loader2 } from "lucide-react"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip-custom"
import type { Task } from "@/lib/types"

interface TasksPageProps {
  tasks: Task[]
  loading: boolean
  setShowCreateModal: (show: boolean) => void
  searchTask: (query: string) => void
  loadMyTasks: () => void
  setSelectedTask: (task: Task) => void
  setShowTaskModal: (show: boolean) => void
}

export function TasksPage({
  tasks,
  loading,
  setShowCreateModal,
  searchTask,
  loadMyTasks,
  setSelectedTask,
  setShowTaskModal,
}: TasksPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [taskFilter, setTaskFilter] = useState<"all" | "open" | "my">("all")

  const getStatusBadge = (task: Task) => {
    if (!task.mySlot) return { text: "AVAILABLE", color: "bg-[#7A8770]" }
    if (task.mySlot.withdrawn) return { text: "COMPLETED", color: "bg-gray-700" }
    if (task.mySlot.approved) return { text: "APPROVED", color: "bg-[#7A8770]" }
    if (task.mySlot.submitted) return { text: "PENDING", color: "bg-[#F2E885] text-black" }
    if (task.mySlot.claimed) return { text: "CLAIMED", color: "bg-[#B88FD8]" }
    return { text: "AVAILABLE", color: "bg-[#7A8770]" }
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    const days = Math.floor(seconds / 86400)
    if (days > 0) return `${days}d ago`
    const hours = Math.floor(seconds / 3600)
    if (hours > 0) return `${hours}h ago`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ago`
  }

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === "all") return true
    if (taskFilter === "open") return task.active && Number(task.availableSlots) > 0
    if (taskFilter === "my") return task.mySlot && task.mySlot.claimed
    return true
  })

  const handleSearch = () => {
    searchTask(searchQuery)
  }

  return (
    <div className="p-4">
      <TooltipProvider>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl flex items-center gap-2">
            📋 Tasks
            <Tooltip text="Search for task IDs to view and claim available work">
              <HelpCircle size={16} className="text-gray-600" />
            </Tooltip>
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#3A4571] text-white px-4 py-2 font-bold border-2 border-black text-sm hover:opacity-90"
          >
            + Create
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
            {filter === "all" ? "All Tasks" : filter === "open" ? "Open Tasks" : "My Tasks"}
          </button>
        ))}
        <button
          onClick={loadMyTasks}
          disabled={loading}
          className="bg-white text-[#3A4571] px-4 py-2 font-bold border-2 border-[#3A4571] text-xs disabled:opacity-70"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search task by ID..."
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
          <p className="font-bold mb-1">No tasks found</p>
          <p className="text-xs text-gray-600">Search for a task ID or create a new one</p>
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
                      <span>💰 {task.reward} cUSD</span>
                      <span>
                        👥 {task.availableSlots}/{task.totalSlots} slots
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
