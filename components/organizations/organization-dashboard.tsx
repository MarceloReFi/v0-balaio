"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft } from "lucide-react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Organization, Project } from "@/lib/types"
import { listProjectsByOrganization, listTasksByProject, type ProjectTaskSummary } from "@/lib/organizations"

interface OrganizationDashboardProps {
  organization: Organization
  language: Language
  onBack: () => void
}

export function OrganizationDashboard({ organization, language, onBack }: OrganizationDashboardProps) {
  const t = useTranslations(language)

  const [projects, setProjects] = useState<Project[]>([])
  const [tasksByProject, setTasksByProject] = useState<Record<string, ProjectTaskSummary[]>>({})
  const [loading, setLoading] = useState(false)

  const STATUS_LABEL: Record<ProjectTaskSummary["status"], string> = {
    open: t.statusOpen,
    claimed: t.statusClaimed,
    submitted: t.statusSubmitted,
    completed: t.statusCompleted,
  }

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const projectList = await listProjectsByOrganization(organization.id)
      setProjects(projectList)
      const taskLists = await Promise.all(projectList.map((p) => listTasksByProject(p.id)))
      setTasksByProject(Object.fromEntries(projectList.map((p, i) => [p.id, taskLists[i]])))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [organization.id])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:opacity-70 mb-4"
      >
        <ArrowLeft size={16} />
        {organization.name}
      </button>

      <h2 className="font-display text-2xl text-on-surface mb-5">{t.orgDashboard}</h2>

      {loading ? (
        <p className="text-sm text-on-surface-variant">{t.loading}</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-on-surface-variant">{t.noProjects}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project) => {
            const tasks = tasksByProject[project.id] ?? []
            return (
              <div key={project.id} className="bg-surface-container-low rounded-lg p-4">
                <p className="font-semibold text-on-surface mb-2">{project.title}</p>
                {tasks.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">{t.orgDashboardNoTasks}</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between">
                        <p className="text-sm text-on-surface">{task.title}</p>
                        <span className="text-xs font-semibold rounded-full px-2.5 py-1 bg-surface-container-high text-on-surface-variant">
                          {STATUS_LABEL[task.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
