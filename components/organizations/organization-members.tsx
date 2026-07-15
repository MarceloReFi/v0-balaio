"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Organization, OrganizationMember } from "@/lib/types"
import { listOrganizationMembers, addOrganizationMember, removeOrganizationMember } from "@/lib/organizations"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { SectionLabel, Card } from "./org-ui"

interface OrganizationMembersProps {
  organization: Organization
  account: string
  language: Language
}

function initialsFromAddress(address: string): string {
  const stripped = address.startsWith("0x") ? address.slice(2) : address
  return stripped.slice(0, 2).toUpperCase()
}

function truncateAddress(address: string): string {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function OrganizationMembers({ organization, account, language }: OrganizationMembersProps) {
  const t = useTranslations(language)

  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteAddress, setInviteAddress] = useState("")
  const [inviting, setInviting] = useState(false)
  const [removing, setRemoving] = useState<OrganizationMember | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setMembers(await listOrganizationMembers(organization.id))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [organization.id])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleInvite = async () => {
    const address = inviteAddress.trim()
    if (!address) return
    setInviting(true)
    try {
      await addOrganizationMember(organization.id, address, "admin")
      setInviteAddress("")
      await refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveConfirm = async () => {
    if (!removing) return
    try {
      await removeOrganizationMember(organization.id, removing.walletAddress)
      await refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setRemoving(null)
    }
  }

  return (
    <Card>
      <SectionLabel>{t.orgMembers}</SectionLabel>

      {loading ? (
        <p className="text-sm text-on-surface-variant">{t.loading}</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-on-surface-variant">{t.orgMembersEmpty}</p>
      ) : (
        <div className="flex flex-col">
          {members.map((member, i) => {
            const isOwner = member.role === "owner"
            return (
              <div
                key={member.id}
                className={`flex items-center gap-3 py-3 ${
                  i < members.length - 1 ? "border-b border-outline-variant/40" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {initialsFromAddress(member.walletAddress)}
                </div>
                <p className="flex-1 min-w-0 text-sm font-medium text-on-surface truncate">
                  {truncateAddress(member.walletAddress)}
                </p>
                <span
                  className={`text-xs font-bold rounded-full px-3 py-1 flex-shrink-0 ${
                    isOwner ? "bg-secondary text-on-secondary" : "bg-secondary/10 text-secondary"
                  }`}
                >
                  {isOwner ? t.orgMembersRoleOwner : t.orgMembersRoleAdmin}
                </span>
                {!isOwner && (
                  <button
                    type="button"
                    onClick={() => setRemoving(member)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface flex-shrink-0"
                  >
                    ×
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-outline-variant/40">
        <input
          value={inviteAddress}
          onChange={(e) => setInviteAddress(e.target.value)}
          placeholder={t.orgMembersInvitePlaceholder}
          className="flex-1 min-w-[200px] px-4 py-2.5 bg-surface-container-low rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary text-on-surface"
        />
        <button
          type="button"
          onClick={handleInvite}
          disabled={inviting || !inviteAddress.trim()}
          className="px-5 py-2.5 font-semibold rounded-lg bg-secondary text-on-secondary disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {t.orgMembersInviteButton}
        </button>
      </div>

      <ConfirmDialog
        open={removing !== null}
        title={t.confirmDeleteTitle}
        message={t.orgMembersRemoveConfirm}
        confirmLabel={t.orgDelete}
        cancelLabel={t.orgCancel}
        onConfirm={handleRemoveConfirm}
        onCancel={() => setRemoving(null)}
      />
    </Card>
  )
}
