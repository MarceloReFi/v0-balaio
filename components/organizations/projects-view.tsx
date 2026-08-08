"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Organization, Project } from "@/lib/types"
import { ProjectForm, type ProjectFormValues } from "./project-form"
import { ProjectDetail } from "./project-detail"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { ScreenHeader, SectionLabel, Card } from "./org-ui"
import { listProjectsByOrganization, createProject, updateProject, deleteProject } from "@/lib/organizations/organizations"

interface ProjectsViewProps {
  organization: Organization
  account: string
  language: Language
  onBack: () => void
}

type Mode = "list" | "create" | "edit"

export function ProjectsView({ organization, account, language, onBack }: ProjectsViewProps) {
  const t = useTranslations(language)

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [mode, setMode] = useState<Mode>("list")
  const [selected, setSelected] = useState<Project | null>(null)
  const [viewing, setViewing] = useState<Project | null>(null)
  const [confirming, setConfirming] = useState<Project | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const result = await listProjectsByOrganization(organization.id)
      setProjects(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [organization.id])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleCreate = async (values: ProjectFormValues) => {
    setSubmitting(true)
    try {
      await createProject({ organizationId: organization.id, ...values })
      await refresh()
      setMode("list")
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (values: ProjectFormValues) => {
    if (!selected) return
    setSubmitting(true)
    try {
      await updateProject(selected.id, values)
      await refresh()
      setMode("list")
      setSelected(null)
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!confirming) return
    try {
      await deleteProject(confirming.id)
      await refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setConfirming(null)
    }
  }

  const handleCancel = () => {
    setMode("list")
    setSelected(null)
  }

  if (viewing) return <ProjectDetail project={viewing} language={language} onBack={() => setViewing(null)} />

  if (mode === "create") {
    return (
      <div>
        <h2 className="font-display text-2xl text-on-surface mb-5">{t.createProjectTitle}</h2>
        <ProjectForm submitting={submitting} language={language} onSubmit={handleCreate} onCancel={handleCancel} />
      </div>
    )
  }

  if (mode === "edit") {
    return (
      <div>
        <h2 className="font-display text-2xl text-on-surface mb-5">{t.editProjectTitle}</h2>
        <ProjectForm
          initialValue={selected}
          submitting={submitting}
          language={language}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
        />
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader
        title={organization.name}
        onBack={onBack}
        right={
          <button
            type="button"
            onClick={() => setMode("create")}
            className="bg-secondary text-on-secondary px-4 py-2 font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            {t.newProject}
          </button>
        }
      />

      <div className="mt-5 mb-3">
        <SectionLabel>{t.projects}</SectionLabel>
      </div>

      {loading ? (
        <p className="text-sm text-on-surface-variant">{t.loading}</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-on-surface-variant">{t.noProjects}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex items-center justify-between">
              <p className="font-semibold text-on-surface">{project.title}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewing(project)}
                  className="text-xs font-semibold text-secondary hover:opacity-70"
                >
                  {t.viewProject}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(project)
                    setMode("edit")
                  }}
                  className="text-xs font-semibold text-secondary hover:opacity-70"
                >
                  {t.editProjectTitle}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(project)}
                  className="text-xs font-semibold text-red-500 hover:opacity-70"
                >
                  {t.orgDelete}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirming !== null}
        title={t.confirmDeleteTitle}
        message={t.projectConfirmDelete}
        confirmLabel={t.orgDelete}
        cancelLabel={t.orgCancel}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirming(null)}
      />
    </div>
  )
}
