"use client"

interface ToastProps {
  message: string
}

export function Toast({ message }: ToastProps) {
  if (!message) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#F2E885] border-2 border-black px-6 py-3 font-bold z-50 text-sm">
      {message}
    </div>
  )
}
