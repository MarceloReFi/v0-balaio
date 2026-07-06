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
    <main className="max-w-2xl mx-auto px-[22px] py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-on-surface">XRPL Tasks</h1>
        <Link
          href="/xrpl/create"
          className="px-4 py-2 rounded-lg font-semibold text-sm bg-primary-container text-on-primary hover:opacity-90 transition-opacity"
        >
          New Task
        </Link>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={`/xrpl/${task.id}`}
            className="flex items-center justify-between px-4 py-3 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <span className="text-sm font-semibold text-on-surface">{task.title}</span>
            <span className="text-sm text-on-surface-variant">
              {task.reward} XRP · {task.statusLabel}
            </span>
          </Link>
        ))}
        {tasks.length === 0 && !error && (
          <p className="text-sm text-on-surface-variant">No XRPL tasks yet.</p>
        )}
      </div>
    </main>
  )
}
