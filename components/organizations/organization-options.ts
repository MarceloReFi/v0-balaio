import { Mail, Globe, Instagram, Twitter, Send } from "lucide-react"

export interface SocialField {
  key: string
  label: string
  placeholder: string
}

export const NATURE_OPTIONS = [
  "Coletivo informal",
  "Associação",
  "Cooperativa",
  "ONG/OSC",
  "Empresa",
  "Autarquia",
  "Órgão Público",
  "Outro",
] as const

export const NICHE_OPTIONS = [
  "Sociedade",
  "Finanças",
  "Educação",
  "Meio ambiente",
  "Impacto social",
  "Deep Tech",
  "Tecnologias Emergentes",
  "Transição Energética",
  "Cultura",
  "Esporte",
  "Saúde",
  "Outro",
] as const

export const SOCIAL_FIELDS: SocialField[] = [
  { key: "website", label: "Website", placeholder: "https://..." },
  { key: "instagram", label: "Instagram", placeholder: "@handle" },
  { key: "x", label: "X", placeholder: "@handle" },
  { key: "telegram", label: "Telegram", placeholder: "@handle or t.me/..." },
]

export function getSocialIcon(key: string) {
  switch (key) {
    case "website": return Globe
    case "instagram": return Instagram
    case "x": return Twitter
    case "telegram": return Send
    default: return Mail
  }
}

export function socialHref(key: string, value: string): string {
  const raw = value.trim()
  const handle = raw.replace(/^@/, "")
  switch (key) {
    case "instagram": return `https://instagram.com/${handle}`
    case "x": return `https://x.com/${handle}`
    case "telegram": return `https://t.me/${handle}`
    default: return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  }
}
