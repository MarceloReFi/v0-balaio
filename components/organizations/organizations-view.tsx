"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Organization } from "@/lib/types"
import { OrganizationForm, type OrgFormValues } from "./organization-form"
import { getOrganizationsByWallet, createOrganization, updateOrganization, deleteOrganization } from "@/lib/organizations"

interface OrganizationsViewProps {
  account: string
  language: Language
}

type Mode = "list" | "create" | "edit"

export function OrganizationsView({ account, language }: OrganizationsViewProps) {
  const t = useTranslations(language)

  const [orgs, setOrgs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [mode, setMode] = useState<Mode>("list")
  const [selected, setSelected] = useState<Organization | null>(null)

  const refresh = useCallback(async () => {
    if (!account) return
    setLoading(true)
    try {
      const result = await getOrganizationsByWallet(account)
      setOrgs(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [account])

  useEffect(() => {
    refresh()
  }, [refresh])

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

  const handleDelete = async (org: Organization) => {
    if (!confirm(t.orgConfirmDelete)) return
    try {
      await deleteOrganization(org.id)
      await refresh()
    } catch (error) {
      console.error(error)
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
      </div>
    )
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

      {loading ? (
        <p className="text-sm text-on-surface-variant">{t.loading}</p>
      ) : orgs.length === 0 ? (
        <p className="text-sm text-on-surface-variant">{t.noOrganizations}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orgs.map((org) => {
            const isOwner = org.ownerAddress.toLowerCase() === account.toLowerCase()
            return (
              <div key={org.id} className="bg-surface-container-low rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-on-surface">{org.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {[org.nature, org.region].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
