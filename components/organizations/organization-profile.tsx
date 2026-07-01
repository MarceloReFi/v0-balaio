"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft } from "lucide-react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Organization, Project } from "@/lib/types"
import { listProjectsByOrganization } from "@/lib/organizations"
import { SOCIAL_FIELDS } from "./organization-options"

interface OrganizationProfileProps {
  organization: Organization
  language: Language
  onBack: () => void
}

export function OrganizationProfile({ organization, language, onBack }: OrganizationProfileProps) {
  const t = useTranslations(language)

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

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

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:opacity-70 mb-4"
      >
        <ArrowLeft size={16} />
      </button>

      <div className="flex items-center gap-3 mb-5">
        {organization.logoUrl && (
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-low">
            <img src={organization.logoUrl} alt={organization.name} className="w-full h-full object-cover" />
          </div>
        )}
        <h2 className="font-display text-2xl text-on-surface">{organization.name}</h2>
      </div>

      <div className="flex flex-col gap-4">
        {organization.description && (
          <p className="text-sm text-on-surface-variant">{organization.description}</p>
        )}

        {organization.nature && (
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1">{t.orgNature}</p>
            <p className="text-sm text-on-surface">{organization.nature}</p>
          </div>
        )}

        {organization.niches.length > 0 && (
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">{t.orgNiches}</p>
            <div className="flex flex-wrap gap-2">
              {organization.niches.map((niche) => (
                <span key={niche} className="py-1.5 px-3 text-xs font-semibold rounded-full bg-surface-container-low text-on-surface-variant">
                  {niche}
                </span>
              ))}
            </div>
          </div>
        )}

        {organization.region && (
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1">{t.orgRegion}</p>
            <p className="text-sm text-on-surface">{organization.region}</p>
          </div>
        )}

        {organization.contactEmail && (
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1">{t.orgContactEmail}</p>
            <a href={`mailto:${organization.contactEmail}`} className="text-sm text-secondary hover:opacity-70">
              {organization.contactEmail}
            </a>
          </div>
        )}

        {SOCIAL_FIELDS.some((field) => organization.socialLinks[field.key]) && (
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">{t.orgSocialLinks}</p>
            <div className="flex flex-col gap-1">
              {SOCIAL_FIELDS.filter((field) => organization.socialLinks[field.key]).map((field) => (
                <a
                  key={field.key}
                  href={organization.socialLinks[field.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary hover:opacity-70"
                >
                  {field.label}
                </a>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-display text-lg text-on-surface mb-3">{t.projects}</h3>
          {loading ? (
            <p className="text-sm text-on-surface-variant">{t.loading}</p>
          ) : projects.length === 0 ? (
            <p className="text-sm text-on-surface-variant">{t.noProjects}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map((project) => (
                <div key={project.id} className="bg-surface-container-low rounded-lg p-4">
                  <p className="font-semibold text-on-surface">{project.title}</p>
                  {project.description && (
                    <p className="text-sm text-on-surface-variant mt-1">{project.description}</p>
                  )}
                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-secondary hover:opacity-70 mt-2 inline-block"
                    >
                      {project.website}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
