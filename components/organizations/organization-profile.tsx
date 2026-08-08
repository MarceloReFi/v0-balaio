"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Mail } from "lucide-react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Organization, Project } from "@/lib/types"
import { listProjectsByOrganization } from "@/lib/organizations/organizations"
import { SOCIAL_FIELDS, socialHref, getSocialIcon } from "./organization-options"
import { SectionLabel, Chip, Card } from "./org-ui"
import { ProjectDetail } from "./project-detail"

interface OrganizationProfileProps {
  organization: Organization
  language: Language
  onBack: () => void
}

function ContactIcon({ icon: Icon }: { icon: typeof Mail }) {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
      <Icon size={16} />
    </div>
  )
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
  const hasDetails = Boolean(organization.nature || organization.region)

  const detailRows = [
    organization.nature && { label: t.orgNature, value: organization.nature },
    organization.region && { label: t.orgRegion, value: organization.region },
  ].filter(Boolean) as { label: string; value: string }[]

  const contactRows = [
    organization.contactEmail && {
      key: "email",
      href: `mailto:${organization.contactEmail}`,
      label: organization.contactEmail,
      external: false,
      icon: Mail,
    },
    ...socials.map((field) => ({
      key: field.key,
      href: socialHref(field.key, organization.socialLinks[field.key]),
      label: organization.socialLinks[field.key],
      external: true,
      icon: getSocialIcon(field.key),
    })),
  ].filter(Boolean) as { key: string; href: string; label: string; external: boolean; icon: typeof Mail }[]

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-on-surface mb-4"
      >
        <ArrowLeft size={16} />
      </button>

      <Card className="flex items-start gap-5 mb-4">
        {organization.logoUrl && (
          <>
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-low">
              <img src={organization.logoUrl} alt={organization.name} className="w-full h-full object-cover" />
            </div>
            <div className="w-0.5 self-stretch bg-secondary rounded-full flex-shrink-0" />
          </>
        )}
        <div className="min-w-0">
          <h1 className="font-display text-3xl text-on-surface mb-2">{organization.name}</h1>
          {organization.description && (
            <p className="text-sm text-on-surface-variant leading-relaxed">{organization.description}</p>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4 min-w-0">
          {organization.niches.length > 0 && (
            <Card>
              <SectionLabel>{t.orgNiches}</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {organization.niches.map((niche) => (
                  <Chip key={niche}>{niche}</Chip>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <SectionLabel>{t.projects}</SectionLabel>
            {loading ? (
              <p className="text-sm text-on-surface-variant">{t.loading}</p>
            ) : projects.length === 0 ? (
              <div className="border border-dashed border-outline-variant rounded-xl py-7 text-center">
                <p className="text-sm text-on-surface-variant">{t.noProjects}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-surface-container-high"
                  >
                    <p className="font-semibold text-on-surface">{project.title}</p>
                    {project.description && (
                      <p className="text-sm text-on-surface-variant mt-1">{project.description}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          {hasDetails && (
            <Card>
              <SectionLabel>{t.orgDetails}</SectionLabel>
              <div className="flex flex-col">
                {detailRows.map((row, i) => (
                  <div
                    key={row.label}
                    className={i < detailRows.length - 1 ? "pb-3 mb-3 border-b border-outline-variant/40" : ""}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant mb-1">
                      {row.label}
                    </p>
                    <p className="text-sm text-on-surface font-medium">{row.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {contactRows.length > 0 && (
            <Card>
              <SectionLabel>{t.orgContact}</SectionLabel>
              <div className="flex flex-col">
                {contactRows.map((row, i) => (
                  <div
                    key={row.key}
                    className={`flex items-center gap-3 pb-3 ${
                      i < contactRows.length - 1 ? "mb-3 border-b border-outline-variant/40" : ""
                    }`}
                  >
                    <ContactIcon icon={row.icon} />
                    <a
                      href={row.href}
                      target={row.external ? "_blank" : undefined}
                      rel={row.external ? "noopener noreferrer" : undefined}
                      className="min-w-0 flex-1 text-sm font-medium text-secondary hover:opacity-70 truncate"
                    >
                      {row.label}
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
