"use client"

import { useState } from "react"
import { useTranslations, type Language } from "@/lib/translations"
import type { Project } from "@/lib/types"

export interface ProjectFormValues {
  title: string
  description: string
  goals: string
  website: string
}

interface ProjectFormProps {
  initialValue?: Project | null
  submitting: boolean
  language: Language
  onSubmit: (values: ProjectFormValues) => void
  onCancel: () => void
}

const inputClass =
  "w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary text-on-surface"
const labelClass = "block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2"

export function ProjectForm({ initialValue, submitting, language, onSubmit, onCancel }: ProjectFormProps) {
  const t = useTranslations(language)

  const [title, setTitle] = useState(initialValue?.title ?? "")
  const [description, setDescription] = useState(initialValue?.description ?? "")
  const [goals, setGoals] = useState(initialValue?.goals ?? "")
  const [website, setWebsite] = useState(initialValue?.website ?? "")

  const handleSubmit = () => {
    onSubmit({ title, description, goals, website })
  }

  const titleEmpty = title.trim().length === 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>{t.projectTitle}</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        {titleEmpty && <p className="text-xs text-red-500 mt-1">{t.projectTitleRequired}</p>}
      </div>

      <div>
        <label className={labelClass}>{t.projectDescription}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>{t.projectGoals}</label>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>{t.projectWebsite}</label>
        <input value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} />
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
          disabled={submitting || titleEmpty}
          className="flex-1 py-3 font-semibold rounded-lg bg-secondary text-on-secondary disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {t.orgSave}
        </button>
      </div>
    </div>
  )
}
