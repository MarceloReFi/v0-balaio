"use client"

import { useEffect, useState } from "react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Task } from "@/lib/types"
import type { XrplTaskSummary } from "@/lib/xrpl/tasks"

interface XrplPageProps {
  xamanAccount: string | null
  onConnect: (address: string) => void
  language: Language
  onCreateTask: () => void
}

function getStatusBadge(status: XrplTaskSummary["statusLabel"], t: ReturnType<typeof useTranslations>) {
  if (status === "completed") return { text: t.completed, className: "bg-surface-container-high text-on-surface-variant" }
  if (status === "submitted") return { text: t.submitted, className: "bg-marigold/20 text-on-tertiary-fixed" }
  if (status === "claimed") return { text: t.claimed, className: "bg-surface-container-high text-on-surface-variant" }
  return { text: t.open, className: "bg-secondary-fixed text-on-secondary-fixed-dim" }
}

export function XrplPage({ xamanAccount, onConnect, language, onCreateTask }: XrplPageProps) {
  const t = useTranslations(language)
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [tasks, setTasks] = useState<XrplTaskSummary[]>([])
  const [error, setError] = useState<string | null>(null)
  const [myCreated, setMyCreated] = useState<Task[]>([])
  const [myClaimed, setMyClaimed] = useState<Task[]>([])

  useEffect(() => {
    if (!xamanAccount) return

    let cancelled = false

    const load = async () => {
      try {
        const { listXrplTasks, getXrplTask } = await import("@/lib/xrpl/tasks")
        const summaries = await listXrplTasks()
        if (cancelled) return
        setTasks(summaries)

        const details = await Promise.all(summaries.map((summary) => getXrplTask(summary.id)))
        if (cancelled) return

        const created: Task[] = []
        const claimed: Task[] = []
        for (const detail of details) {
          if (!detail) continue
          if (detail.task.creator.toLowerCase() === xamanAccount.toLowerCase()) {
            created.push(detail.task)
          }
          if (detail.task.claims?.some((claim) => claim.workerAddress.toLowerCase() === xamanAccount.toLowerCase())) {
            claimed.push(detail.task)
          }
        }
        setMyCreated(created)
        setMyClaimed(claimed)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load Ripple tasks")
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [xamanAccount])

  const handleConnect = async () => {
    setConnecting(true)
    setConnectError(null)
    try {
      const { connectXaman } = await import("@/lib/xrpl/xaman")
      const address = await connectXaman()
      onConnect(address)
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : "Failed to connect Xaman")
    } finally {
      setConnecting(false)
    }
  }

  if (!xamanAccount) {
    return (
      <div className="max-w-3xl mx-auto px-[22px] py-5">
        <div className="bg-surface-container-low rounded-2xl p-10 text-center">
          <p className="font-semibold text-on-surface mb-4">
            {language === "en" ? "Connect Xaman to use Ripple tasks" : "Conecte a Xaman para usar tarefas Ripple"}
          </p>
          <button
            type="button"
            onClick={handleConnect}
            disabled={connecting}
            className="bg-primary-container text-on-primary px-4 py-2 text-sm font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {connecting ? "..." : "Connect Xaman"}
          </button>
          {connectError && <p className="text-xs text-red-500 mt-2">{connectError}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-[22px] py-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant">Ripple</p>
          <h2 className="font-headline text-2xl text-on-surface">{t.tasks}</h2>
        </div>
        <button
          onClick={onCreateTask}
          className="bg-marigold text-on-tertiary-fixed px-4 py-2 font-semibold rounded-full text-sm hover:opacity-90 transition-opacity"
        >
          + {t.createTask}
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="bg-surface-container-low rounded-2xl p-10 text-center">
          <p className="font-semibold text-on-surface mb-1">{t.noTasks}</p>
          <p className="text-xs text-on-surface-variant">{t.noTasksDesc}</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {tasks.map((task) => {
            const status = getStatusBadge(task.statusLabel, t)
            return (
              <div
                key={task.id}
                onClick={() => { window.location.href = `/xrpl/${task.id}` }}
                className="py-4 border-b border-outline-variant/20 cursor-pointer hover:bg-surface-container-low/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-on-surface truncate">{task.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">{task.reward} XRP</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${status.className}`}>
                    {status.text}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* My XRPL Activity */}
      <div className="mt-8">
        <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-3">
          {language === "en" ? "My Ripple Activity" : "Minha Atividade Ripple"}
        </p>

        <div className="mb-4">
          <p className="text-xs text-on-surface-variant mb-2">
            {language === "en" ? "Created" : "Criadas"} ({myCreated.length})
          </p>
          {myCreated.length === 0 ? (
            <p className="text-xs text-on-surface-variant">
              {language === "en" ? "No tasks created yet." : "Nenhuma tarefa criada ainda."}
            </p>
          ) : (
            <div className="flex flex-col">
              {myCreated.map((task) => (
                <div
                  key={task.id}
                  onClick={() => { window.location.href = `/xrpl/${task.id}` }}
                  className="py-4 border-b border-outline-variant/20 cursor-pointer hover:bg-surface-container-low/50 transition-colors"
                >
                  <h3 className="font-semibold text-sm text-on-surface truncate">{task.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">{task.reward} XRP</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-on-surface-variant mb-2">
            {language === "en" ? "Claimed" : "Reivindicadas"} ({myClaimed.length})
          </p>
          {myClaimed.length === 0 ? (
            <p className="text-xs text-on-surface-variant">
              {language === "en" ? "No tasks claimed yet." : "Nenhuma tarefa reivindicada ainda."}
            </p>
          ) : (
            <div className="flex flex-col">
              {myClaimed.map((task) => (
                <div
                  key={task.id}
                  onClick={() => { window.location.href = `/xrpl/${task.id}` }}
                  className="py-4 border-b border-outline-variant/20 cursor-pointer hover:bg-surface-container-low/50 transition-colors"
                >
                  <h3 className="font-semibold text-sm text-on-surface truncate">{task.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">{task.reward} XRP</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
