"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { listXrplTasks, type XrplTaskSummary } from "@/lib/xrpl/tasks"
import { useTranslations, type Language } from "@/lib/translations"

interface XrplTasksPageProps {
  account: string
  language: Language
}

export function XrplTasksPage({ account, language }: XrplTasksPageProps) {
  const t = useTranslations(language)
  const router = useRouter()
  const [tasks, setTasks] = useState<XrplTaskSummary[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listXrplTasks()
      .then(setTasks)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load tasks"))
  }, [])

  const getStatusBadge = (status: XrplTaskSummary["statusLabel"]) => {
    if (status === "completed") return { text: t.completed, className: "bg-surface-container-high text-on-surface-variant" }
    if (status === "submitted") return { text: t.submitted, className: "bg-marigold/20 text-on-tertiary-fixed" }
    if (status === "claimed") return { text: t.claimed, className: "bg-surface-container-high text-on-surface-variant" }
    return { text: t.open, className: "bg-secondary-fixed text-on-secondary-fixed-dim" }
  }

  return (
    <div className="max-w-3xl mx-auto px-[22px] py-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant">XRPL</p>
          <h2 className="font-headline text-2xl text-on-surface">{t.tasks}</h2>
        </div>
        <button
          onClick={() => router.push("/xrpl/create")}
          className="bg-marigold text-on-tertiary-fixed px-4 py-2 font-semibold rounded-full text-sm hover:opacity-90 transition-opacity"
        >
          + {t.createTask}
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

      {/* Count label */}
      <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-3">
        {tasks.length} {language === "en" ? "tasks" : "tarefas"}
      </p>

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="bg-surface-container-low rounded-2xl p-10 text-center">
          <p className="font-semibold text-on-surface mb-1">{t.noTasks}</p>
          <p className="text-xs text-on-surface-variant">{t.noTasksDesc}</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {tasks.map((task) => {
            const status = getStatusBadge(task.statusLabel)
            return (
              <div
                key={task.id}
                onClick={() => router.push(`/xrpl/${task.id}`)}
                className="py-4 border-b border-outline-variant/20 cursor-pointer hover:bg-surface-container-low/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-on-surface truncate">{task.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">{task.reward} XRP</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${status.className}`}>
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
