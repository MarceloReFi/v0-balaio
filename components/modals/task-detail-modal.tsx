"use client"

import { useState } from "react"
import { User, Tag, Folder, X } from "lucide-react"
import { TokenBadge } from "@/components/ui/token-badge"
import type { Task } from "@/lib/types"
import { useTranslations, type Language } from "@/lib/translations"

function truncateAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const categoryLabels: Record<string, { en: string; pt: string }> = {
  development: { en: "Development", pt: "Desenvolvimento" },
  design: { en: "Design", pt: "Design" },
  content: { en: "Content", pt: "Conteúdo" },
  research: { en: "Research", pt: "Pesquisa" },
  community: { en: "Community", pt: "Comunidade" },
  other: { en: "Other", pt: "Outro" },
}

interface TaskDetailModalProps {
  open: boolean
  task: Task | null
  account: string | null
  loading: boolean
  onClose: () => void
  onClaimTask: (id: string) => void
  onSubmitTask: (id: string, proof: string) => void
  onApproveTask: (id: string, claimant: string) => void
  onClaimReward: (id: string) => void
  onUpdateDeadline: (taskId: string, deadline: Date | null) => Promise<void>
  language: Language
}

export function TaskDetailModal({
  open,
  task,
  account,
  loading,
  onClose,
  onClaimTask,
  onSubmitTask,
  onApproveTask,
  onClaimReward,
  onUpdateDeadline,
  language,
}: TaskDetailModalProps) {
  const t = useTranslations(language)
  const [proofUrl, setProofUrl] = useState("")
  const [approveAddress, setApproveAddress] = useState("")
  const [editingDeadline, setEditingDeadline] = useState(false)
  const [newDeadline, setNewDeadline] = useState<string>(
    task?.deadline ? new Date(task.deadline).toISOString().split("T")[0] : ""
  )
  const [savingDeadline, setSavingDeadline] = useState(false)

  const handleSaveDeadline = async () => {
    setSavingDeadline(true)
    const parsed = newDeadline ? new Date(newDeadline) : null
    await onUpdateDeadline(task!.id, parsed)
    setSavingDeadline(false)
    setEditingDeadline(false)
  }

  if (!open || !task) return null

  const isCreator = task.creator.toLowerCase() === account?.toLowerCase()
  const canClaim = !task.mySlot?.claimed && task.active && Number(task.availableSlots) > 0
  const canSubmit = task.mySlot?.claimed && !task.mySlot?.submitted
  const isPending = task.mySlot?.submitted && !task.mySlot?.approved
  const canClaimReward = task.mySlot?.approved && !task.mySlot?.withdrawn
  const isCompleted = task.mySlot?.withdrawn

  const getSlotStatusLabel = () => {
    const available = Number(task.availableSlots)
    const total = Number(task.totalSlots)
    if (!task.active || available === 0) return { text: language === "en" ? "Closed" : "Fechado", className: "bg-balaio-claimed-bg text-balaio-claimed-text" }
    if (available === total) return { text: language === "en" ? `Open · ${available} of ${total} slots` : `Aberto · ${available} de ${total} vagas`, className: "bg-balaio-open-bg text-balaio-open-text" }
    return { text: language === "en" ? `${available} of ${total} slots left` : `${available} de ${total} vagas restantes`, className: "bg-balaio-pending-bg text-balaio-pending-text" }
  }

  const getDeadlineInfo = () => {
    if (!task.deadline) return null
    const now = new Date()
    const deadlineDate = new Date(task.deadline)
    const diffMs = deadlineDate.getTime() - now.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    if (diffMs < 0) return { color: "text-red-500", text: language === "en" ? "Expired" : "Expirado" }
    if (diffDays <= 1) return { color: "text-balaio-pending-text", text: language === "en" ? "1 day left" : "1 dia restante" }
    if (diffDays <= 7) return { color: "text-balaio-ink", text: `${Math.ceil(diffDays)} ${language === "en" ? "days left" : "dias restantes"}` }
    return { color: "text-balaio-muted", text: new Date(task.deadline).toLocaleDateString() }
  }

  const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`
  const deadlineInfo = getDeadlineInfo()
  const slotStatus = getSlotStatusLabel()

  const inputClass = "w-full px-4 py-2.5 bg-balaio-surface rounded-balaio-lg text-sm outline-none focus:ring-1 focus:ring-balaio-sage"

  return (
    <>
      <div className="fixed inset-0 bg-balaio-ink/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-balaio-sheet pointer-events-auto">
          <div className="flex items-center justify-between px-[22px] pt-5 pb-3 border-b border-balaio-rule sticky top-0 bg-white rounded-t-2xl z-10">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-balaio-pill ${slotStatus.className}`}>
              {slotStatus.text}
            </span>
            <button onClick={onClose} className="text-balaio-muted hover:text-balaio-ink transition-colors p-1">
              <X size={18} />
            </button>
          </div>
        <div className="px-[22px] pb-8 pt-4">
        {/* Title */}
        <div className="mb-4">
          <h2 className="font-display text-2xl text-balaio-ink leading-snug">{task.title}</h2>
        </div>

        <p className="text-sm text-balaio-muted mb-5" style={{ lineHeight: 1.65 }}>{task.description}</p>

        {task.validationMethod && task.validationMethod.startsWith('http') && (
          <a
            href={task.validationMethod}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-balaio-sage hover:underline mb-5 block"
          >
            {language === "en" ? "View full task details →" : "Ver detalhes completos da tarefa →"}
          </a>
        )}

        {/* Details grid */}
        <div className="bg-balaio-surface rounded-balaio-xl p-4 mb-5">
          <div className="flex flex-col gap-0">
            <div className="flex justify-between py-3 border-b border-balaio-rule">
              <span className="text-xs text-balaio-muted">{t.reward}</span>
              <span className="font-semibold text-sm text-balaio-ink flex items-center gap-1">
                {task.reward} <TokenBadge symbol={task.token || "cUSD"} />
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-balaio-rule">
              <span className="text-xs text-balaio-muted">{language === "en" ? "Slots" : "Vagas"}</span>
              <span className="font-semibold text-sm text-balaio-ink">{task.availableSlots}/{task.totalSlots}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-balaio-rule">
              <span className="text-xs text-balaio-muted">{language === "en" ? "Creator" : "Criador"}</span>
              <span className="font-semibold text-xs text-balaio-ink">{shortenAddress(task.creator)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-balaio-rule">
              <span className="text-xs text-balaio-muted">{language === "en" ? "Created" : "Criado"}</span>
              <span className="text-xs text-balaio-ink">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "-"}</span>
            </div>
            {task.deadline && (
              <div className="flex justify-between py-3">
                <span className="text-xs text-balaio-muted">{language === "en" ? "Deadline" : "Prazo"}</span>
                <span className={`text-xs font-semibold ${deadlineInfo?.color || 'text-balaio-ink'}`}>
                  {deadlineInfo?.text || new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Category */}
        {task.category && (
          <div className="flex items-center gap-2 text-sm mb-3">
            <Folder size={14} className="text-balaio-muted" />
            <span className="text-balaio-muted">{language === "en" ? "Category:" : "Categoria:"}</span>
            <span className="bg-balaio-surface text-balaio-muted px-2 py-0.5 text-xs font-semibold rounded-full">
              {categoryLabels[task.category]?.[language === "en" ? "en" : "pt"] || task.category}
            </span>
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex items-start gap-2 text-sm mb-5">
            <Tag size={14} className="text-balaio-muted mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-balaio-surface text-balaio-muted text-xs px-2 py-0.5 rounded-full font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {canClaim && (
            <div>
              <button
                onClick={() => onClaimTask(task.id)}
                disabled={loading}
                className="bg-balaio-ink text-white px-6 py-3.5 font-semibold rounded-balaio-lg w-full disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {loading
                  ? language === "en" ? "Claiming..." : "Reivindicando..."
                  : `${language === "en" ? "Claim this task" : "Reivindicar tarefa"} →`}
              </button>
              <p className="text-xs text-balaio-muted mt-2 text-center">
                {language === "en" ? "You will have exclusive access to complete and submit work." : "Você terá acesso exclusivo para completar e enviar o trabalho."}
              </p>
            </div>
          )}

          {canSubmit && (
            <div className="flex flex-col gap-3">
              <div className="bg-balaio-open-bg rounded-balaio-lg px-4 py-3">
                <p className="text-xs font-semibold text-balaio-sage">
                  {language === "en" ? "Task claimed — submit your proof below" : "Tarefa reivindicada — envie sua prova abaixo"}
                </p>
              </div>
              <input
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder={language === "en" ? "Proof URL (IPFS, Google Drive, etc.)" : "URL da Prova (IPFS, Google Drive, etc.)"}
                className={inputClass}
              />
              <button
                onClick={() => { onSubmitTask(task.id, proofUrl); setProofUrl("") }}
                disabled={loading || !proofUrl}
                className="bg-balaio-sage text-white px-6 py-3.5 font-semibold rounded-balaio-lg w-full disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {loading
                  ? language === "en" ? "Submitting..." : "Enviando..."
                  : language === "en" ? "Submit Work →" : "Enviar Trabalho →"}
              </button>
            </div>
          )}

          {isPending && (
            <div className="bg-balaio-pending-bg rounded-balaio-lg px-4 py-4 text-center">
              <p className="font-semibold text-sm text-balaio-pending-text">
                {language === "en" ? "Waiting for approval..." : "Aguardando aprovação..."}
              </p>
              <p className="text-xs text-balaio-muted mt-1">
                {language === "en" ? "The creator will review your submission." : "O criador irá revisar seu envio."}
              </p>
            </div>
          )}

          {canClaimReward && (
            <button
              onClick={() => onClaimReward(task.id)}
              disabled={loading}
              className="bg-balaio-sage text-white px-6 py-3.5 font-semibold rounded-balaio-lg w-full disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {loading ? (language === "en" ? "Claiming..." : "Reivindicando...") : t.claimReward}
            </button>
          )}

          {isCompleted && (
            <div className="bg-balaio-open-bg rounded-balaio-lg px-4 py-3 text-center">
              <p className="font-semibold text-sm text-balaio-open-text">
                {language === "en" ? "Reward claimed!" : "Recompensa reivindicada!"}
              </p>
            </div>
          )}

          {isCreator && (
            <div className="mt-2 p-4 bg-balaio-surface rounded-balaio-xl">
              <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted mb-3">
                {language === "en" ? "Creator Actions" : "Ações do Criador"}
              </p>
              <input
                value={approveAddress}
                onChange={(e) => setApproveAddress(e.target.value)}
                placeholder={language === "en" ? "Claimant address (0x...)" : "Endereço do reivindicante (0x...)"}
                className={`${inputClass} mb-3`}
              />
              <button
                onClick={() => {
                  if (approveAddress) {
                    onApproveTask(task.id, approveAddress)
                    setApproveAddress("")
                  }
                }}
                disabled={loading}
                className="bg-balaio-sage text-white px-4 py-2.5 font-semibold rounded-balaio-lg w-full text-sm disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {language === "en" ? "Approve Submission →" : "Aprovar Envio →"}
              </button>

              <div className="mt-3 border-t-2 border-[#111111] pt-3">
                <div className="font-bold mb-2 text-xs">{t.editDeadline}</div>
                {!editingDeadline ? (
                  <button
                    onClick={() => setEditingDeadline(true)}
                    className="text-xs font-bold underline hover:opacity-70"
                  >
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : language === "en" ? "No deadline set" : "Sem prazo definido"} ✏️
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full p-2 border-2 border-[#111111] rounded-xl text-xs font-mono"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveDeadline}
                        disabled={savingDeadline}
                        className="flex-1 bg-[#99FF99] text-[#111111] px-3 py-2 font-bold border-2 border-[#111111] rounded-xl text-xs disabled:opacity-70"
                      >
                        {savingDeadline ? t.savingDeadline : t.saveDeadline}
                      </button>
                      <button
                        onClick={() => { setNewDeadline(""); handleSaveDeadline() }}
                        disabled={savingDeadline}
                        className="text-xs font-bold underline hover:opacity-70 disabled:opacity-40"
                      >
                        {t.clearDeadline}
                      </button>
                      <button
                        onClick={() => setEditingDeadline(false)}
                        className="text-xs text-[#666666] hover:opacity-70"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </div>
        </div>
      </div>
    </>
  )
}
