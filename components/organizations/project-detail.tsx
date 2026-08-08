"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Project } from "@/lib/types"
import { listTasksByProject, type ProjectTaskSummary } from "@/lib/organizations/organizations"
import { ScreenHeader, SectionLabel, Card, StatusChip } from "./org-ui"
import { useOrgNav } from "./org-nav-context"

interface ProjectDetailProps {
  project: Project
  language: Language
  onBack: () => void
}

export function ProjectDetail({ project, language, onBack }: ProjectDetailProps) {
  const t = useTranslations(language)

  const [tasks, setTasks] = useState<ProjectTaskSummary[]>([])
  const [loading, setLoading] = useState(false)
  const { openTask } = useOrgNav()

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const result = await listTasksByProject(project.id)
      setTasks(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [project.id])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <div>
      <ScreenHeader title={project.title} onBack={onBack} />

      <div className="flex flex-col gap-4 mt-5">
        {project.description && <p className="text-sm text-on-surface-variant">{project.description}</p>}

        {project.goals && (
          <div>
            <SectionLabel>{t.projectGoals}</SectionLabel>
            <p className="text-sm text-on-surface-variant">{project.goals}</p>
          </div>
        )}

        {project.website && (
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-secondary hover:opacity-70"
          >
            {project.website}
          </a>
        )}

        <div>
          <SectionLabel>{t.projectTasks}</SectionLabel>
          {loading ? (
            <p className="text-sm text-on-surface-variant">{t.loading}</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-on-surface-variant">{t.orgDashboardNoTasks}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <Card key={task.id} onClick={openTask ? () => openTask(task.id) : undefined} className="flex items-center justify-between">
                  <p className="text-sm text-on-surface">{task.title}</p>
                  <StatusChip status={task.status} language={language} />
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
