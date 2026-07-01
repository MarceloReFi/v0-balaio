"use client"

import { createContext, useContext, type ReactNode } from "react"

interface OrgNav {
  openTask?: (taskId: string) => void
}

const OrgNavContext = createContext<OrgNav>({})

export function OrgNavProvider({ openTask, children }: OrgNav & { children: ReactNode }) {
  return <OrgNavContext.Provider value={{ openTask }}>{children}</OrgNavContext.Provider>
}

export function useOrgNav() {
  return useContext(OrgNavContext)
}
