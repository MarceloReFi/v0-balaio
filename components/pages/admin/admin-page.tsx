"use client"

import { StatsPage } from "@/components/pages/stats/stats-page"

interface AdminPageProps {
  language: "en" | "pt-BR"
  isAdmin: boolean
}

export function AdminPage({ language, isAdmin }: AdminPageProps) {
  return <StatsPage language={language} isAdmin={isAdmin} />
}
