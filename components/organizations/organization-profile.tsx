"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft } from "lucide-react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Organization, Project } from "@/lib/types"
import { listProjectsByOrganization } from "@/lib/organizations"
import { SOCIAL_FIELDS } from "./organization-options"
import { SectionLabel, Chip, Card } from "./org-ui"
import { ProjectDetail } from "./project-detail"

interface OrganizationProfileProps {
  organization: Organization
  language: Language
  onBack: () => void
}

export function OrganizationProfile({ organization, language, onBack }: OrganizationProfileProps) {
  const t = useTranslations(language)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setProjects(await listProjectsByOrganization(organization.id))
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

  const socials = SOCIAL_FIELDS.filter((f) => organization.socialLinks[f.key])

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-on-surface mb-4"
      >
        <ArrowLeft size={16} />
      </button>

      <div className="flex items-center gap-3 mb-6">
        {organization.logoUrl && (
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-low">
            <img src={organization.logoUrl} alt={organization.name} className="w-full h-full object-cover" />
          </div>
        )}
        <h2 className="font-display text-2xl text-on-surface border-l-2 border-secondary pl-3">{organization.name}</h2>
      </div>

      <div className="flex flex-col gap-6">
        {organization.description && (
          <p className="text-sm text-on-surface-variant leading-relaxed">{organization.description}</p>
        )}

        {organization.nature && (
          <div>
            <SectionLabel>{t.orgNature}</SectionLabel>
            <p className="text-sm text-on-surface">{organization.nature}</p>
          </div>
        )}

        {organization.niches.length > 0 && (
          <div>
            <SectionLabel>{t.orgNiches}</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {organization.niches.map((niche) => (
                <Chip key={niche}>{niche}</Chip>
              ))}
            </div>
          </div>
        )}

        {organization.region && (
          <div>
            <SectionLabel>{t.orgRegion}</SectionLabel>
            <p className="text-sm text-on-surface">{organization.region}</p>
          </div>
        )}

        {organization.contactEmail && (
          <div>
            <SectionLabel>{t.orgContactEmail}</SectionLabel>
            <a href={`mailto:${organization.contactEmail}`} className="text-sm text-secondary hover:opacity-70">
              {organization.contactEmail}
            </a>
          </div>
        )}

        {socials.length > 0 && (
          <div>
            <SectionLabel>{t.orgSocialLinks}</SectionLabel>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {socials.map((field) => (
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
          <SectionLabel>{t.projects}</SectionLabel>
          {loading ? (
            <p className="text-sm text-on-surface-variant">{t.loading}</p>
          ) : projects.length === 0 ? (
            <p className="text-sm text-on-surface-variant">{t.noProjects}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map((project) => (
                <Card key={project.id} onClick={() => setSelectedProject(project)}>
                  <p className="font-semibold text-on-surface">{project.title}</p>
                  {project.description && (
                    <p className="text-sm text-on-surface-variant mt-1">{project.description}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
