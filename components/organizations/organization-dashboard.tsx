"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Organization, Project } from "@/lib/types"
import { listProjectsByOrganization, listTasksByProject, type ProjectTaskSummary } from "@/lib/organizations/organizations"
import { ScreenHeader, SectionLabel, Card, StatusChip } from "./org-ui"
import { ProjectDetail } from "./project-detail"

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

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

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} language={language} onBack={() => setSelectedProject(null)} />
  }

  return (
    <div>
      <ScreenHeader title={organization.name} onBack={onBack} />
      <div className="mt-5">
        <SectionLabel>{t.orgDashboard}</SectionLabel>
        {loading ? (
          <p className="text-sm text-on-surface-variant">{t.loading}</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-on-surface-variant">{t.noProjects}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map((project) => {
              const tasks = tasksByProject[project.id] ?? []
              return (
                <Card key={project.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="font-semibold text-on-surface mb-2 text-left hover:text-secondary"
                  >
                    {project.title}
                  </button>
                  {tasks.length === 0 ? (
                    <p className="text-sm text-on-surface-variant">{t.orgDashboardNoTasks}</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between">
                          <p className="text-sm text-on-surface">{task.title}</p>
                          <StatusChip status={task.status} language={language} />
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
