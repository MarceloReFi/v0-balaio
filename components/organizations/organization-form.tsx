"use client"

import { useState } from "react"
import { useTranslations, type Language } from "@/lib/translations"
import { NATURE_OPTIONS, NICHE_OPTIONS, SOCIAL_FIELDS } from "./organization-options"
import type { Organization } from "@/lib/types"

export interface OrgFormValues {
  name: string
  description: string
  logoUrl: string
  nature: string
  niches: string[]
  region: string
  contactEmail: string
  socialLinks: Record<string, string>
}

interface OrganizationFormProps {
  initialValue?: Organization | null
  submitting: boolean
  language: Language
  onSubmit: (values: OrgFormValues) => void
  onCancel: () => void
}

const inputClass =
  "w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary text-on-surface"
const labelClass = "block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2"

export function OrganizationForm({ initialValue, submitting, language, onSubmit, onCancel }: OrganizationFormProps) {
  const t = useTranslations(language)

  const [name, setName] = useState(initialValue?.name ?? "")
  const [description, setDescription] = useState(initialValue?.description ?? "")
  const [logoUrl, setLogoUrl] = useState(initialValue?.logoUrl ?? "")
  const [nature, setNature] = useState(initialValue?.nature ?? "")
  const [niches, setNiches] = useState<string[]>(initialValue?.niches ?? [])
  const [region, setRegion] = useState(initialValue?.region ?? "")
  const [contactEmail, setContactEmail] = useState(initialValue?.contactEmail ?? "")
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(initialValue?.socialLinks ?? {})

  const toggleNiche = (niche: string) => {
    setNiches((prev) => (prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]))
  }

  const setSocialLink = (key: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onSubmit({ name, description, logoUrl, nature, niches, region, contactEmail, socialLinks })
  }

  const nameEmpty = name.trim().length === 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>{t.orgName}</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        {nameEmpty && <p className="text-xs text-red-500 mt-1">{t.orgNameRequired}</p>}
      </div>

      <div>
        <label className={labelClass}>{t.orgDescription}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>{t.orgLogoUrl}</label>
        <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>{t.orgNature}</label>
        <select value={nature} onChange={(e) => setNature(e.target.value)} className={inputClass}>
          <option value=""></option>
          {NATURE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p className="text-xs text-on-surface-variant mt-2">{t.orgNatureNote}</p>
      </div>

      <div>
        <label className={labelClass}>{t.orgNiches}</label>
        <div className="flex flex-wrap gap-2">
          {NICHE_OPTIONS.map((niche) => (
            <button
              key={niche}
              type="button"
              onClick={() => toggleNiche(niche)}
              className={`py-1.5 px-3 text-xs font-semibold rounded-full transition-colors ${
                niches.includes(niche)
                  ? "bg-secondary text-on-secondary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-outline-variant"
              }`}
            >
              {niche}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>{t.orgRegion}</label>
        <input value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>{t.orgContactEmail}</label>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{t.orgSocialLinks}</label>
        <div className="flex flex-col gap-2">
          {SOCIAL_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-xs text-on-surface-variant mb-1">{field.label}</label>
              <input
                value={socialLinks[field.key] ?? ""}
                onChange={(e) => setSocialLink(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 font-semibold rounded-lg bg-surface-container-low text-on-surface-variant hover:opacity-80 transition-opacity"
        >
          {t.orgCancel}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || nameEmpty}
          className="flex-1 py-3 font-semibold rounded-lg bg-secondary text-on-secondary disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {t.orgSave}
        </button>
      </div>
    </div>
  )
}
