"use client"

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, busy, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-primary-container/40 z-50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-[18px] p-5 max-w-sm w-full shadow-lg pointer-events-auto">
          <h2 className="font-display text-lg text-on-surface">{title}</h2>
          <p className="text-sm text-on-surface-variant mt-2">{message}</p>
          <div className="flex items-center gap-3 mt-5">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 font-semibold rounded-lg bg-surface-container-low text-on-surface-variant hover:opacity-80 transition-opacity"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="flex-1 py-2.5 font-semibold rounded-lg bg-red-500 text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
