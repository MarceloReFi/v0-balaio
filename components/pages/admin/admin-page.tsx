"use client"

import { StatsPage } from "@/components/pages/stats/stats-page"

interface AdminPageProps {
  language: "en" | "pt-BR"
}

export function AdminPage({ language }: AdminPageProps) {
  return <StatsPage language={language} />
}
