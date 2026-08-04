"use client"

import { useState, useEffect, useRef } from "react"
import { User, Tag, Folder, X, Building2, ImagePlus, Loader2 } from "lucide-react"
import { TokenBadge } from "@/components/ui/token-badge"
import type { Task } from "@/lib/types"
import { useTranslations, type Language } from "@/lib/translations"
import { getOrganization, getProject } from "@/lib/organizations"
import { createClient } from "@/lib/supabase/client"

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
  onOpenOrganizationProfile?: (orgId: string) => void
  onOpenProject?: (projectId: string) => void
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
  onOpenOrganizationProfile,
  onOpenProject,
}: TaskDetailModalProps) {
  const t = useTranslations(language)
  const [proofUrl, setProofUrl] = useState("")
  const [proofImage, setProofImage] = useState<File | null>(null)
  const [proofImagePreview, setProofImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [approveAddress, setApproveAddress] = useState("")
  const [editingDeadline, setEditingDeadline] = useState(false)
  const [newDeadline, setNewDeadline] = useState<string>(
    task?.deadline ? new Date(task.deadline).toISOString().split("T")[0] : ""
  )
  const [savingDeadline, setSavingDeadline] = useState(false)
  const [orgName, setOrgName] = useState<string | null>(null)
  const [orgIsPublic, setOrgIsPublic] = useState(false)
  const [projectName, setProjectName] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      if (task?.organizationId) {
        try { const org = await getOrganization(task.organizationId); if (active && org) { setOrgName(org.name); setOrgIsPublic(org.isPublic) } } catch (e) { console.error(e) }
      } else { setOrgName(null); setOrgIsPublic(false) }
      if (task?.projectId) {
        try { const p = await getProject(task.projectId); if (active && p) setProjectName(p.title) } catch (e) { console.error(e) }
      } else { setProjectName(null) }
    }
    if (open) load()
    return () => { active = false }
  }, [open, task?.organizationId, task?.projectId])

  const handleSaveDeadline = async () => {
    setSavingDeadline(true)
    const parsed = newDeadline ? new Date(newDeadline) : null
    await onUpdateDeadline(task!.id, parsed)
    setSavingDeadline(false)
    setEditingDeadline(false)
  }

  const MAX_IMAGE_BYTES = 20 * 1024 * 1024

  const compressImage = (file: File, maxDimension = 1600, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        let { width, height } = img
        if (width > maxDimension || height > maxDimension) {
          const scale = maxDimension / Math.max(width, height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) { resolve(file); return }
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          if (!blob) { resolve(file); return }
          resolve(new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }))
        }, "image/jpeg", quality)
      }
      img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file) }
      img.src = objectUrl
    })
  }

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    if (!file.type.startsWith("image/")) {
      setUploadError(t.photoInvalidType)
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError(t.photoTooLarge)
      return
    }
    setCompressing(true)
    const compressed = await compressImage(file)
    setCompressing(false)
    setProofImage(compressed)
    setProofImagePreview(URL.createObjectURL(compressed))
  }

  const handleRemoveImage = () => {
    setProofImage(null)
    setProofImagePreview(null)
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmitProof = async () => {
    if (!task) return
    let proof = proofUrl
    if (proofImage) {
      setUploadingImage(true)
      setUploadError(null)
      try {
        const supabase = createClient()
        const ext = proofImage.name.split(".").pop() || "jpg"
        const path = `${task.id}/${account?.toLowerCase() || "unknown"}-${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage.from("task-proofs").upload(path, proofImage)
        if (uploadErr) throw uploadErr
        const { data } = supabase.storage.from("task-proofs").getPublicUrl(path)
        proof = data.publicUrl
      } catch (err) {
        console.error(err)
        setUploadError(language === "en" ? "Upload failed, try again" : "Falha no envio, tente novamente")
        setUploadingImage(false)
        return
      }
      setUploadingImage(false)
    }
    if (!proof) return
    onSubmitTask(task.id, proof)
    setProofUrl("")
    handleRemoveImage()
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
    if (!task.active || available === 0) return { text: language === "en" ? "Closed" : "Fechado", className: "bg-surface-dim text-on-surface-variant" }
    if (available === total) return { text: language === "en" ? `Open · ${available} of ${total} slots` : `Aberto · ${available} de ${total} vagas`, className: "bg-secondary/10 text-secondary" }
    return { text: language === "en" ? `${available} of ${total} slots left` : `${available} de ${total} vagas restantes`, className: "bg-marigold/20 text-on-tertiary-fixed" }
  }

  const getDeadlineInfo = () => {
    if (!task.deadline) return null
    const now = new Date()
    const deadlineDate = new Date(task.deadline)
    const diffMs = deadlineDate.getTime() - now.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    if (diffMs < 0) return { color: "text-red-500", text: language === "en" ? "Expired" : "Expirado" }
    if (diffDays <= 1) return { color: "text-on-tertiary-fixed", text: language === "en" ? "1 day left" : "1 dia restante" }
    if (diffDays <= 7) return { color: "text-on-surface", text: `${Math.ceil(diffDays)} ${language === "en" ? "days left" : "dias restantes"}` }
    return { color: "text-on-surface-variant", text: new Date(task.deadline).toLocaleDateString() }
  }

  const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`
  const deadlineInfo = getDeadlineInfo()
  const slotStatus = getSlotStatusLabel()

  const inputClass = "w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"

  return (
    <>
      <div className="fixed inset-0 bg-primary-container/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg pointer-events-auto">
          <div className="flex items-center justify-between px-[22px] pt-5 pb-3 border-b border-outline-variant sticky top-0 bg-white rounded-t-2xl z-10">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${slotStatus.className}`}>
              {slotStatus.text}
            </span>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
              <X size={18} />
            </button>
          </div>
        <div className="px-[22px] pb-8 pt-4">
        {/* Title */}
        <div className="mb-4">
          <h2 className="font-display text-2xl text-on-surface leading-snug">{task.title}</h2>
        </div>

        <p className="text-sm text-on-surface-variant mb-5" style={{ lineHeight: 1.65 }}>{task.description}</p>

        {task.validationMethod && task.validationMethod.startsWith('http') && (
          <a
            href={task.validationMethod}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-secondary hover:underline mb-5 block"
          >
            {language === "en" ? "View full task details →" : "Ver detalhes completos da tarefa →"}
          </a>
        )}

        {/* Details grid */}
        <div className="bg-surface-container-low rounded-xl p-4 mb-5">
          <div className="flex flex-col gap-0">
            <div className="flex justify-between py-3 border-b border-outline-variant">
              <span className="text-xs text-on-surface-variant">{t.reward}</span>
              <span className="font-semibold text-sm text-on-surface flex items-center gap-1">
                {task.reward} <TokenBadge symbol={task.token || "cUSD"} />
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-outline-variant">
              <span className="text-xs text-on-surface-variant">{language === "en" ? "Slots" : "Vagas"}</span>
              <span className="font-semibold text-sm text-on-surface">{task.availableSlots}/{task.totalSlots}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-outline-variant">
              <span className="text-xs text-on-surface-variant">{language === "en" ? "Creator" : "Criador"}</span>
              <span className="font-semibold text-xs text-on-surface">{shortenAddress(task.creator)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-outline-variant">
              <span className="text-xs text-on-surface-variant">{language === "en" ? "Created" : "Criado"}</span>
              <span className="text-xs text-on-surface">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "-"}</span>
            </div>
            {task.deadline && (
              <div className="flex justify-between py-3">
                <span className="text-xs text-on-surface-variant">{language === "en" ? "Deadline" : "Prazo"}</span>
                <span className={`text-xs font-semibold ${deadlineInfo?.color || 'text-on-surface'}`}>
                  {deadlineInfo?.text || new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {(orgName || projectName) && (
          <div className="flex items-center gap-2 text-sm mb-3 flex-wrap">
            <Building2 size={14} className="text-on-surface-variant" />
            {orgName && (orgIsPublic && onOpenOrganizationProfile && task.organizationId ? (
              <button type="button" onClick={() => onOpenOrganizationProfile(task.organizationId!)} className="text-secondary font-semibold hover:opacity-70">{orgName}</button>
            ) : (
              <span className="text-on-surface font-semibold">{orgName}</span>
            ))}
            {orgName && projectName && <span className="text-on-surface-variant">·</span>}
            {projectName && (onOpenProject && task.projectId ? (
              <button type="button" onClick={() => onOpenProject(task.projectId!)} className="text-secondary hover:opacity-70">{projectName}</button>
            ) : (
              <span className="text-on-surface-variant">{projectName}</span>
            ))}
          </div>
        )}

        {/* Category */}
        {task.category && (
          <div className="flex items-center gap-2 text-sm mb-3">
            <Folder size={14} className="text-on-surface-variant" />
            <span className="text-on-surface-variant">{language === "en" ? "Category:" : "Categoria:"}</span>
            <span className="bg-surface-container-low text-on-surface-variant px-2 py-0.5 text-xs font-semibold rounded-full">
              {categoryLabels[task.category]?.[language === "en" ? "en" : "pt"] || task.category}
            </span>
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex items-start gap-2 text-sm mb-5">
            <Tag size={14} className="text-on-surface-variant mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-surface-container-low text-on-surface-variant text-xs px-2 py-0.5 rounded-full font-semibold"
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
                className="bg-primary-container text-on-primary px-6 py-3.5 font-semibold rounded-lg w-full disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {loading
                  ? language === "en" ? "Claiming..." : "Reivindicando..."
                  : `${language === "en" ? "Claim this task" : "Reivindicar tarefa"} →`}
              </button>
              <p className="text-xs text-on-surface-variant mt-2 text-center">
                {language === "en" ? "You will have exclusive access to complete and submit work." : "Você terá acesso exclusivo para completar e enviar o trabalho."}
              </p>
            </div>
          )}

          {canSubmit && (
            <div className="flex flex-col gap-3">
              <div className="bg-secondary/10 rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-secondary">
                  {language === "en" ? "Task claimed — submit your proof below" : "Tarefa reivindicada — envie sua prova abaixo"}
                </p>
              </div>

              {task.allowPhotoProof && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSelectImage}
                    className="hidden"
                  />

                  {proofImagePreview ? (
                    <div className="relative">
                      <img src={proofImagePreview} alt="" className="w-full h-40 object-cover rounded-lg" />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={compressing}
                      className="flex items-center justify-center gap-2 border-2 border-dashed border-outline-variant rounded-lg py-4 text-sm text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors disabled:opacity-60"
                    >
                      {compressing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {t.compressingPhoto}
                        </>
                      ) : (
                        <>
                          <ImagePlus size={18} />
                          {t.addPhotoProof}
                        </>
                      )}
                    </button>
                  )}

                  {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
                </>
              )}

              <input
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder={task.allowPhotoProof ? t.proofUrlPlaceholder : (language === "en" ? "Proof URL (IPFS, Google Drive, etc.)" : "URL da Prova (IPFS, Google Drive, etc.)")}
                className={inputClass}
              />

              <button
                onClick={handleSubmitProof}
                disabled={loading || uploadingImage || compressing || (!proofUrl && !proofImage)}
                className="bg-secondary text-on-secondary px-6 py-3.5 font-semibold rounded-lg w-full disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {uploadingImage && <Loader2 size={16} className="animate-spin" />}
                {uploadingImage
                  ? t.uploadingPhoto
                  : loading
                  ? language === "en" ? "Submitting..." : "Enviando..."
                  : language === "en" ? "Submit Work →" : "Enviar Trabalho →"}
              </button>
            </div>
          )}

          {isPending && (
            <div className="bg-marigold/20 rounded-lg px-4 py-4 text-center">
              <p className="font-semibold text-sm text-on-tertiary-fixed">
                {language === "en" ? "Waiting for approval..." : "Aguardando aprovação..."}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {language === "en" ? "The creator will review your submission." : "O criador irá revisar seu envio."}
              </p>
            </div>
          )}

          {canClaimReward && (
            <button
              onClick={() => onClaimReward(task.id)}
              disabled={loading}
              className="bg-secondary text-on-secondary px-6 py-3.5 font-semibold rounded-lg w-full disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {loading ? (language === "en" ? "Claiming..." : "Reivindicando...") : t.claimReward}
            </button>
          )}

          {isCompleted && (
            <div className="bg-secondary/10 rounded-lg px-4 py-3 text-center">
              <p className="font-semibold text-sm text-secondary">
                {language === "en" ? "Reward claimed!" : "Recompensa reivindicada!"}
              </p>
            </div>
          )}

          {isCreator && (
            <div className="mt-2 p-4 bg-surface-container-low rounded-xl">
              <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-3">
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
                className="bg-secondary text-on-secondary px-4 py-2.5 font-semibold rounded-lg w-full text-sm disabled:opacity-40 hover:opacity-90 transition-opacity"
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
                        className="flex-1 bg-marigold text-on-surface px-3 py-2 font-bold border-2 border-[#111111] rounded-xl text-xs disabled:opacity-70"
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
