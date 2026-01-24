"use client"

import { useState } from "react"
import { X, User, Tag, Folder } from "lucide-react"
import type { Task } from "@/lib/types"
import { useTranslations, type Language } from "@/lib/translations"

// Helper to truncate address
function truncateAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Category display names
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
  language,
}: TaskDetailModalProps) {
  const t = useTranslations(language)
  const [proofUrl, setProofUrl] = useState("")
  const [approveAddress, setApproveAddress] = useState("")

  if (!open || !task) return null

  const isCreator = task.creator.toLowerCase() === account?.toLowerCase()
  const canClaim = !task.mySlot?.claimed && task.active && Number(task.availableSlots) > 0
  const canSubmit = task.mySlot?.claimed && !task.mySlot?.submitted
  const isPending = task.mySlot?.submitted && !task.mySlot?.approved
  const canClaimReward = task.mySlot?.approved && !task.mySlot?.withdrawn
  const isCompleted = task.mySlot?.withdrawn

  // Color-coded circle based on slot availability
  const getSlotStatusColor = () => {
    const available = Number(task.availableSlots)
    const total = Number(task.totalSlots)

    if (!task.active || available === 0) return "bg-red-500"
    if (available === total) return "bg-green-500"
    return "bg-yellow-500"
  }

  // Deadline color coding
  const getDeadlineInfo = () => {
    if (!task.deadline) return null

    const now = new Date()
    const deadlineDate = new Date(task.deadline)
    const diffMs = deadlineDate.getTime() - now.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffMs < 0) return { color: "text-red-600", text: language === "en" ? "Expired" : "Expirado" }
    if (diffDays <= 1) return { color: "text-yellow-600", text: language === "en" ? "1 day left" : "1 dia restante" }
    if (diffDays <= 7) return { color: "text-green-600", text: `${Math.ceil(diffDays)} ${language === "en" ? "days left" : "dias restantes"}` }
    return { color: "text-green-600", text: deadlineDate.toLocaleDateString() }
  }

  const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`
  const deadlineInfo = getDeadlineInfo()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-black p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${getSlotStatusColor()}`}></span>
            <h2 className="font-bold text-lg">{task.title}</h2>
          </div>
          <button onClick={onClose} className="hover:opacity-70">
            <X size={24} />
          </button>
        </div>

        <p className="text-sm mb-4 text-gray-700">{task.description}</p>

        {/* Link to full description if available */}
        {task.validationMethod && task.validationMethod.startsWith('http') && (
          <a
            href={task.validationMethod}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline mb-4 block"
          >
            🔗 {language === "en" ? "View full task details" : "Ver detalhes completos da tarefa"}
          </a>
        )}
        {/* Task metadata: Creator, Category, Tags */}
        <div className="space-y-2 mb-4">
          {/* Creator address */}
          <div className="flex items-center gap-2 text-sm">
            <User size={14} className="text-gray-500" />
            <span className="text-gray-500">{language === "en" ? "Creator:" : "Criador:"}</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
              {truncateAddress(task.creator)}
            </span>
          </div>

          {/* Category */}
          {task.category && (
            <div className="flex items-center gap-2 text-sm">
              <Folder size={14} className="text-gray-500" />
              <span className="text-gray-500">{language === "en" ? "Category:" : "Categoria:"}</span>
              <span className="bg-[#3A4571] text-white text-xs px-2 py-0.5 rounded">
                {categoryLabels[task.category]?.[language === "en" ? "en" : "pt"] || task.category}
              </span>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-start gap-2 text-sm">
              <Tag size={14} className="text-gray-500 mt-0.5" />
              <span className="text-gray-500">{language === "en" ? "Tags:" : "Tags:"}</span>
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-2 border-gray-300 p-3 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs">{t.reward}:</span>
            <span className="font-bold">
              {task.reward} {task.token}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-xs">{language === "en" ? "Available Slots:" : "Vagas Disponiveis:"}</span>
            <span className="font-bold">
              {task.availableSlots}/{task.totalSlots}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-xs">{language === "en" ? "Creator:" : "Criador:"}</span>
            <span className="font-mono text-xs" title={task.creator}>
              {shortenAddress(task.creator)}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-xs">{language === "en" ? "Created:" : "Criado:"}</span>
            <span className="text-xs">
              {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "-"}
            </span>
          </div>
          {task.deadline && (
            <div className="flex justify-between">
              <span className="text-xs">{language === "en" ? "Deadline:" : "Prazo:"}</span>
              <span className={`text-xs font-bold ${deadlineInfo?.color || ''}`}>
                {deadlineInfo?.text || new Date(task.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          {canClaim && (
            <button
              onClick={() => onClaimTask(task.id)}
              disabled={loading}
              className="bg-[#3A4571] text-white px-6 py-3 font-bold border-2 border-black w-full disabled:opacity-70"
            >
              {loading
                ? language === "en"
                  ? "CLAIMING..."
                  : "REIVINDICANDO..."
                : `${t.claim.toUpperCase()} ${language === "en" ? "TASK" : "TAREFA"}`}
            </button>
          )}

          {canSubmit && (
            <div className="flex flex-col gap-2">
              <input
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder={
                  language === "en" ? "Proof URL (IPFS, Google Drive, etc.)" : "URL da Prova (IPFS, Google Drive, etc.)"
                }
                className="w-full p-2.5 border-2 border-gray-300 font-mono"
              />
              <button
                onClick={() => {
                  onSubmitTask(task.id, proofUrl)
                  setProofUrl("")
                }}
                disabled={loading || !proofUrl}
                className="bg-[#3A4571] text-white px-6 py-3 font-bold border-2 border-black w-full disabled:opacity-70"
              >
                {loading
                  ? language === "en"
                    ? "SUBMITTING..."
                    : "ENVIANDO..."
                  : `${t.submit.toUpperCase()} ${language === "en" ? "WORK" : "TRABALHO"}`}
              </button>
            </div>
          )}

          {isPending && (
            <div className="bg-[#F2E885] border-2 border-black p-3 text-center font-bold">
              {language === "en" ? "Waiting for approval..." : "Aguardando aprovacao..."}
            </div>
          )}

          {canClaimReward && (
            <button
              onClick={() => onClaimReward(task.id)}
              disabled={loading}
              className="bg-[#7A8770] text-white px-6 py-3 font-bold border-2 border-black w-full disabled:opacity-70"
            >
              {loading ? (language === "en" ? "CLAIMING..." : "REIVINDICANDO...") : `${t.claimReward.toUpperCase()}`}
            </button>
          )}

          {isCompleted && (
            <div className="bg-[#7A8770] border-2 border-black p-3 text-center font-bold text-white">
              {language === "en" ? "Reward claimed!" : "Recompensa reivindicada!"}
            </div>
          )}

          {isCreator && (
            <div className="mt-4 p-3 bg-gray-50 border-2 border-gray-300">
              <div className="font-bold mb-2 text-xs">
                {language === "en" ? "TASK CREATOR ACTIONS" : "ACOES DO CRIADOR"}
              </div>
              <input
                value={approveAddress}
                onChange={(e) => setApproveAddress(e.target.value)}
                placeholder={language === "en" ? "Claimant address (0x...)" : "Endereco do reivindicante (0x...)"}
                className="w-full p-2 border-2 border-gray-300 mb-2 font-mono text-xs"
              />
              <button
                onClick={() => {
                  if (approveAddress) {
                    onApproveTask(task.id, approveAddress)
                    setApproveAddress("")
                  }
                }}
                disabled={loading}
                className="bg-white text-[#3A4571] px-4 py-2 font-bold border-2 border-[#3A4571] w-full text-xs disabled:opacity-70"
              >
                {t.approve.toUpperCase()} {language === "en" ? "SUBMISSION" : "ENVIO"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
