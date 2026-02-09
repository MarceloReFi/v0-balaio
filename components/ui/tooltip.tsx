"use client"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import type { ReactNode } from "react"

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <TooltipPrimitive.Provider delayDuration={200}>{children}</TooltipPrimitive.Provider>
}

export function Tooltip({ children, text }: { children: ReactNode; text: string }) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="top"
          sideOffset={8}
          className="bg-[#111111] text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap z-50 border-2 border-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
        >
          {text}
          <TooltipPrimitive.Arrow className="fill-[#111111]" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
