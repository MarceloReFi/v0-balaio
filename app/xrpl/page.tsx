"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { listXrplTasks, type XrplTaskSummary } from "@/lib/xrpl/tasks"

export default function XrplTasksPage() {
  const [tasks, setTasks] = useState<XrplTaskSummary[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listXrplTasks()
      .then(setTasks)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load tasks"))
  }, [])

  return (
    <main className="max-w-3xl mx-auto px-[22px] py-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-on-surface" style={{ fontFamily: "'Noto Serif', serif" }}>
          XRPL Tasks
        </h1>
        <Link
          href="/xrpl/create"
          className="bg-primary-container text-on-primary px-4 py-2 text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
        >
          New Task
        </Link>
      </div>

      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

      {tasks.length === 0 && !error ? (
        <div className="bg-surface-container-low rounded-2xl p-10 text-center">
          <p className="text-sm text-on-surface-variant">No XRPL tasks yet.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/xrpl/${task.id}`}
              className="flex items-center justify-between gap-3 py-4 border-b border-outline-variant/20 cursor-pointer hover:bg-surface-container-low/50 transition-colors"
            >
              <span className="text-sm font-semibold text-on-surface truncate">{task.title}</span>
              <span className="text-xs text-on-surface-variant flex-shrink-0">
                {task.reward} XRP · {task.statusLabel}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
