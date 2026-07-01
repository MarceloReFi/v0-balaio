"use client"

import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary mb-2">{children}</p>
}

export function ScreenHeader({ title, onBack, right }: { title: string; onBack: () => void; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="text-on-surface-variant hover:text-on-surface">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-display text-2xl text-on-surface border-l-2 border-secondary pl-3">{title}</h2>
      </div>
      {right}
    </div>
  )
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface-variant text-xs font-semibold">
      {children}
    </span>
  )
}

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  const classes = ["bg-surface-container rounded-xl p-4", className].filter(Boolean).join(" ")

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${classes} text-left w-full`}>
        {children}
      </button>
    )
  }

  return <div className={classes}>{children}</div>
}
