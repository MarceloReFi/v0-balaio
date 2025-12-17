"use client"

import { useState } from "react"
import { X, Copy, Check } from "lucide-react"
import type { Task, PixKeyType } from "@/lib/types"
import { useTranslations, type Language } from "@/lib/translations"

interface TaskDetailModalProps {
  open: boolean
  task: Task | null
  account: string | null
  loading: boolean
  onClose: () => void
  onClaimTask: (id: string) => void
  onSubmitTask: (id: string, proof: string, pixKey?: string, pixKeyType?: PixKeyType) => void
  onApproveTask: (id: string, claimant: string) => void
  onClaimReward: (id: string) => void
  onConfirmPixPayment: (id: string) => void
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
  onConfirmPixPayment,
  language,
}: TaskDetailModalProps) {
  const t = useTranslations(language)
  const [proofUrl, setProofUrl] = useState("")
  const [approveAddress, setApproveAddress] = useState("")
  const [pixKey, setPixKey] = useState("")
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>("cpf")
  const [showPixKeyTypeDropdown, setShowPixKeyTypeDropdown] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!open || !task) return null

  const isPixPayment = task.paymentMethod === "pix"

  const isCreator = task.creator.toLowerCase() === account?.toLowerCase()
  const canClaim = !task.mySlot?.claimed && task.active && Number(task.availableSlots) > 0
  const canSubmit = task.mySlot?.claimed && !task.mySlot?.submitted
  const isPending = task.mySlot?.submitted && !task.mySlot?.approved
  const canClaimReward = task.mySlot?.approved && !task.mySlot?.withdrawn
  const isCompleted = task.mySlot?.withdrawn

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-black p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">{task.title}</h2>
          <button onClick={onClose} className="hover:opacity-70">
            <X size={24} />
          </button>
        </div>

        <p className="text-sm mb-4 text-gray-700">{task.description}</p>

        <div className={`border-2 p-3 mb-4 ${isPixPayment ? "bg-[#32BCAD]/10 border-[#32BCAD]" : "bg-gray-50 border-gray-300"}`}>
          <div className="flex justify-between mb-2">
            <span className="text-xs">{t.reward}:</span>
            <span className="font-bold">
              {isPixPayment ? `R$ ${task.fiatAmount?.toFixed(2)}` : `${task.reward} ${task.token}`}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-xs">{language === "en" ? "Available Slots:" : "Vagas Disponíveis:"}</span>
            <span className="font-bold">
              {task.availableSlots}/{task.totalSlots}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs">{t.paymentMethod}:</span>
            <span className={`font-bold text-xs px-2 py-0.5 ${isPixPayment ? "bg-[#32BCAD] text-white" : "bg-[#F2E885]"}`}>
              {isPixPayment ? "PIX" : "CRYPTO"}
            </span>
          </div>
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

              {/* Pix Key Input for Pix payments */}
              {isPixPayment && (
                <div className="bg-[#32BCAD]/10 border-2 border-[#32BCAD] p-3 space-y-2">
                  <label className="block font-bold text-xs text-[#32BCAD]">{t.pixKey}</label>

                  {/* Pix Key Type Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPixKeyTypeDropdown(!showPixKeyTypeDropdown)}
                      className="w-full p-2 border-2 border-gray-300 bg-white text-left text-sm flex justify-between items-center"
                    >
                      <span>
                        {pixKeyType === "cpf" && t.pixKeyCpf}
                        {pixKeyType === "email" && t.pixKeyEmail}
                        {pixKeyType === "phone" && t.pixKeyPhone}
                        {pixKeyType === "random" && t.pixKeyRandom}
                      </span>
                      <span className="text-gray-400">▼</span>
                    </button>
                    {showPixKeyTypeDropdown && (
                      <div className="absolute top-full left-0 right-0 bg-white border-2 border-black border-t-0 z-10">
                        {(["cpf", "email", "phone", "random"] as PixKeyType[]).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setPixKeyType(type)
                              setShowPixKeyTypeDropdown(false)
                            }}
                            className={`w-full p-2 text-left text-sm hover:bg-gray-100 ${
                              pixKeyType === type ? "bg-[#32BCAD]/20" : ""
                            }`}
                          >
                            {type === "cpf" && t.pixKeyCpf}
                            {type === "email" && t.pixKeyEmail}
                            {type === "phone" && t.pixKeyPhone}
                            {type === "random" && t.pixKeyRandom}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder={t.pixKeyPlaceholder}
                    className="w-full p-2 border-2 border-gray-300 font-mono text-sm"
                  />
                </div>
              )}

              <button
                onClick={() => {
                  onSubmitTask(task.id, proofUrl, isPixPayment ? pixKey : undefined, isPixPayment ? pixKeyType : undefined)
                  setProofUrl("")
                  setPixKey("")
                }}
                disabled={loading || !proofUrl || (isPixPayment && !pixKey)}
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
              ⏳ {isPixPayment ? t.pixPaymentPending : (language === "en" ? "Waiting for approval..." : "Aguardando aprovação...")}
            </div>
          )}

          {/* For Crypto: standard claim reward flow */}
          {canClaimReward && !isPixPayment && (
            <button
              onClick={() => onClaimReward(task.id)}
              disabled={loading}
              className="bg-[#7A8770] text-white px-6 py-3 font-bold border-2 border-black w-full disabled:opacity-70"
            >
              {loading ? (language === "en" ? "CLAIMING..." : "REIVINDICANDO...") : `${t.claimReward.toUpperCase()}`}
            </button>
          )}

          {/* For Pix: worker confirms payment received */}
          {canClaimReward && isPixPayment && !task.pixPaymentConfirmed && (
            <div className="space-y-2">
              <div className="bg-[#32BCAD]/10 border-2 border-[#32BCAD] p-3 text-center">
                <p className="text-sm font-bold text-[#32BCAD] mb-1">{t.pixPaymentPending}</p>
                <p className="text-xs text-gray-600">
                  {language === "en"
                    ? "Once you receive the Pix payment, confirm below"
                    : "Assim que receber o Pix, confirme abaixo"}
                </p>
              </div>
              <button
                onClick={() => onConfirmPixPayment(task.id)}
                disabled={loading}
                className="bg-[#32BCAD] text-white px-6 py-3 font-bold border-2 border-black w-full disabled:opacity-70"
              >
                {loading ? (language === "en" ? "CONFIRMING..." : "CONFIRMANDO...") : t.pixConfirmPayment.toUpperCase()}
              </button>
            </div>
          )}

          {isCompleted && !isPixPayment && (
            <div className="bg-[#7A8770] border-2 border-black p-3 text-center font-bold text-white">
              ✓ {language === "en" ? "Reward claimed!" : "Recompensa reivindicada!"}
            </div>
          )}

          {/* Pix payment confirmed */}
          {isPixPayment && task.pixPaymentConfirmed && (
            <div className="bg-[#32BCAD] border-2 border-black p-3 text-center font-bold text-white">
              ✓ {t.pixPaymentConfirmed}
            </div>
          )}

          {isCreator && (
            <div className="mt-4 p-3 bg-gray-50 border-2 border-gray-300">
              <div className="font-bold mb-2 text-xs">
                {language === "en" ? "TASK CREATOR ACTIONS" : "AÇÕES DO CRIADOR"}
              </div>

              {/* Show worker's Pix key for Pix payments after submission */}
              {isPixPayment && task.workerPixKey && (
                <div className="bg-[#32BCAD]/10 border-2 border-[#32BCAD] p-3 mb-3">
                  <div className="font-bold text-xs text-[#32BCAD] mb-2">{t.pixWorkerKey}</div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-[#32BCAD] text-white px-2 py-0.5">
                      {task.workerPixKeyType?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white p-2 border border-gray-300 text-sm font-mono break-all">
                      {task.workerPixKey}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(task.workerPixKey || "")
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className="p-2 border-2 border-[#32BCAD] bg-white hover:bg-[#32BCAD]/10"
                    >
                      {copied ? <Check size={16} className="text-[#32BCAD]" /> : <Copy size={16} className="text-[#32BCAD]" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{t.pixInstructions}</p>
                </div>
              )}

              {/* Show message if worker hasn't provided Pix key yet */}
              {isPixPayment && !task.workerPixKey && (
                <div className="bg-yellow-50 border-2 border-yellow-400 p-3 mb-3 text-center">
                  <p className="text-xs text-yellow-700">{t.pixNoKeyYet}</p>
                </div>
              )}

              <input
                value={approveAddress}
                onChange={(e) => setApproveAddress(e.target.value)}
                placeholder={language === "en" ? "Claimant address (0x...)" : "Endereço do reivindicante (0x...)"}
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
