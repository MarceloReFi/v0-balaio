'use client'
import { ReactNode } from 'react'

interface BottomSheetProps {
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({ onClose, children }: BottomSheetProps) {
  return (
    <>
      <div className="fixed inset-0 bg-primary-container/40 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[18px] max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-outline-variant" />
        </div>
        {children}
      </div>
    </>
  )
}
