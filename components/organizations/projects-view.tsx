"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft } from "lucide-react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Organization, Project } from "@/lib/types"
import { ProjectForm, type ProjectFormValues } from "./project-form"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { listProjectsByOrganization, createProject, updateProject, deleteProject } from "@/lib/organizations"

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
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:opacity-70 mb-4"
      >
        <ArrowLeft size={16} />
        {organization.name}
      </button>

      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl text-on-surface">{t.projects}</h2>
        <button
          type="button"
          onClick={() => setMode("create")}
          className="bg-secondary text-on-secondary px-4 py-2 font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          {t.newProject}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-on-surface-variant">{t.loading}</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-on-surface-variant">{t.noProjects}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-surface-container-low rounded-lg p-4 flex items-center justify-between">
              <p className="font-semibold text-on-surface">{project.title}</p>
              <div className="flex items-center gap-2">
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
            </div>
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
