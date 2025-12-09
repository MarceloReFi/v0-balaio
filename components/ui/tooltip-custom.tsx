"use client"

import { useState, type ReactNode } from "react"

interface TooltipProps {
  children: ReactNode
  text: string
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ children, text }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="bg-transparent border-none cursor-help p-1"
      >
        {children}
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-700 text-white px-3 py-2 rounded text-xs whitespace-nowrap z-50 mb-2">
          {text}
        </div>
      )}
    </div>
  )
}
