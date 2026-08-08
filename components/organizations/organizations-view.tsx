"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Organization, Project } from "@/lib/types"
import { OrganizationForm, type OrgFormValues } from "./organization-form"
import { OrganizationMembers } from "./organization-members"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { ProjectsView } from "./projects-view"
import { OrganizationProfile } from "./organization-profile"
import { OrganizationDashboard } from "./organization-dashboard"
import { ProjectDetail } from "./project-detail"
import { SectionLabel, Card } from "./org-ui"
import {
  getOrganizationsByWallet,
  getPublicOrganizations,
  getOrganization,
  getProject,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "@/lib/organizations/organizations"

interface OrganizationsViewProps {
  account: string
  language: Language
  initialProfileOrgId?: string | null
  initialProjectId?: string | null
}

type Mode = "list" | "create" | "edit" | "projects" | "profile" | "dashboard" | "project-detail"

export function OrganizationsView({ account, language, initialProfileOrgId, initialProjectId }: OrganizationsViewProps) {
  const t = useTranslations(language)

  const [orgs, setOrgs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [mode, setMode] = useState<Mode>("list")
  const [selected, setSelected] = useState<Organization | null>(null)
  const [confirming, setConfirming] = useState<Organization | null>(null)
  const [projectsOrg, setProjectsOrg] = useState<Organization | null>(null)
  const [profileOrg, setProfileOrg] = useState<Organization | null>(null)
  const [dashboardOrg, setDashboardOrg] = useState<Organization | null>(null)
  const [publicOrgs, setPublicOrgs] = useState<Organization[]>([])
  const [detailProject, setDetailProject] = useState<Project | null>(null)

  const refresh = useCallback(async () => {
    if (!account) return
    setLoading(true)
    try {
      const result = await getOrganizationsByWallet(account)
      setOrgs(result)
      const publicResult = await getPublicOrganizations()
      setPublicOrgs(publicResult)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [account])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!initialProfileOrgId) return
    let active = true
    getOrganization(initialProfileOrgId)
      .then((org) => { if (active && org) { setProfileOrg(org); setMode("profile") } })
      .catch(console.error)
    return () => { active = false }
  }, [initialProfileOrgId])

  useEffect(() => {
    if (!initialProjectId) return
    let active = true
    getProject(initialProjectId)
      .then((p) => { if (active && p) { setDetailProject(p); setMode("project-detail") } })
      .catch(console.error)
    return () => { active = false }
  }, [initialProjectId])

  const handleCreate = async (values: OrgFormValues) => {
    setSubmitting(true)
    try {
      await createOrganization({ ownerAddress: account, ...values })
      await refresh()
      setMode("list")
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (values: OrgFormValues) => {
    if (!selected) return
    setSubmitting(true)
    try {
      await updateOrganization(selected.id, values)
      await refresh()
      setMode("list")
      setSelected(null)
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (org: Organization) => {
    setConfirming(org)
  }

  const handleDeleteConfirm = async () => {
    if (!confirming) return
    try {
      await deleteOrganization(confirming.id)
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
        <h2 className="font-display text-2xl text-on-surface mb-5">{t.createOrganization}</h2>
        <OrganizationForm submitting={submitting} language={language} onSubmit={handleCreate} onCancel={handleCancel} />
      </div>
    )
  }

  if (mode === "edit") {
    const canManageMembers = selected !== null && orgs.some((org) => org.id === selected.id)
    return (
      <div>
        <h2 className="font-display text-2xl text-on-surface mb-5">{t.editOrganization}</h2>
        <OrganizationForm
          initialValue={selected}
          submitting={submitting}
          language={language}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
        />
        {canManageMembers && selected && (
          <div className="mt-4">
            <OrganizationMembers organization={selected} account={account} language={language} />
          </div>
        )}
      </div>
    )
  }

  if (mode === "projects" && projectsOrg) {
    return (
      <ProjectsView
        organization={projectsOrg}
        account={account}
        language={language}
        onBack={() => {
          setMode("list")
          setProjectsOrg(null)
        }}
      />
    )
  }

  if (mode === "profile" && profileOrg) {
    return (
      <OrganizationProfile
        organization={profileOrg}
        language={language}
        onBack={() => {
          setMode("list")
          setProfileOrg(null)
        }}
      />
    )
  }

  if (mode === "dashboard" && dashboardOrg) {
    return (
      <OrganizationDashboard
        organization={dashboardOrg}
        language={language}
        onBack={() => {
          setMode("list")
          setDashboardOrg(null)
        }}
      />
    )
  }

  if (mode === "project-detail" && detailProject) {
    return <ProjectDetail project={detailProject} language={language} onBack={() => { setMode("list"); setDetailProject(null) }} />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl text-on-surface">{t.myOrganizations}</h2>
        <button
          type="button"
          onClick={() => setMode("create")}
          className="bg-secondary text-on-secondary px-4 py-2 font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          {t.newOrganization}
        </button>
      </div>

      <SectionLabel>{t.myOrganizations}</SectionLabel>

      {loading ? (
        <p className="text-sm text-on-surface-variant">{t.loading}</p>
      ) : orgs.length === 0 ? (
        <p className="text-sm text-on-surface-variant">{t.noOrganizations}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orgs.map((org) => {
            const isOwner = org.ownerAddress.toLowerCase() === account.toLowerCase()
            return (
              <Card key={org.id} className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setDashboardOrg(org)
                    setMode("dashboard")
                  }}
                  className="text-left"
                >
                  <p className="font-semibold text-on-surface">{org.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {[org.nature, org.region].filter(Boolean).join(" · ")}
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOrg(org)
                      setMode("profile")
                    }}
                    className="text-xs font-semibold text-secondary hover:opacity-70"
                  >
                    {t.viewProfile}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProjectsOrg(org)
                      setMode("projects")
                    }}
                    className="text-xs font-semibold text-secondary hover:opacity-70"
                  >
                    {t.projects}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(org)
                      setMode("edit")
                    }}
                    className="text-xs font-semibold text-secondary hover:opacity-70"
                  >
                    {t.editOrganization}
                  </button>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleDelete(org)}
                      className="text-xs font-semibold text-red-500 hover:opacity-70"
                    >
                      {t.orgDelete}
                    </button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {(() => {
        const managedIds = new Set(orgs.map((org) => org.id))
        const filteredPublicOrgs = publicOrgs.filter((org) => !managedIds.has(org.id))
        if (filteredPublicOrgs.length === 0) return null
        return (
          <div className="mt-6">
            <SectionLabel>{t.publicOrganizations}</SectionLabel>
            <div className="flex flex-col gap-3">
              {filteredPublicOrgs.map((org) => (
                <Card
                  key={org.id}
                  onClick={() => {
                    setProfileOrg(org)
                    setMode("profile")
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {org.logoUrl && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-low">
                        <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="font-semibold text-on-surface truncate">{org.name}</p>
                  </div>
                  <p className="text-xs text-on-surface-variant flex-shrink-0 ml-3">
                    {[org.nature, org.region].filter(Boolean).join(" · ")}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )
      })()}

      <ConfirmDialog
        open={confirming !== null}
        title={t.confirmDeleteTitle}
        message={t.orgConfirmDelete}
        confirmLabel={t.orgDelete}
        cancelLabel={t.orgCancel}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirming(null)}
      />
    </div>
  )
}
