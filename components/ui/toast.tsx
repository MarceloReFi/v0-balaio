"use client"

import * as ToastPrimitive from "@radix-ui/react-toast"

interface ToastProps {
  message: string
}

export function Toast({ message }: ToastProps) {
  return (
    <ToastPrimitive.Provider duration={3000}>
      <ToastPrimitive.Root
        open={!!message}
        className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#FFFF66] border-2 border-[#111111] rounded-xl px-6 py-3 font-bold z-50 text-sm text-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
      >
        <ToastPrimitive.Description>{message}</ToastPrimitive.Description>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  )
}
