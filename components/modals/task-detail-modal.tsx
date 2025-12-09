"use client"

import { useState } from "react"
import { X } from "lucide-react"
import type { Task } from "@/lib/types"

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
}: TaskDetailModalProps) {
  const [proofUrl, setProofUrl] = useState("")
  const [approveAddress, setApproveAddress] = useState("")

  if (!open || !task) return null

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

        <div className="bg-gray-50 border-2 border-gray-300 p-3 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs">Reward:</span>
            <span className="font-bold">{task.reward} cUSD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs">Available Slots:</span>
            <span className="font-bold">
              {task.availableSlots}/{task.totalSlots}
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
              {loading ? "CLAIMING..." : "CLAIM TASK"}
            </button>
          )}

          {canSubmit && (
            <div className="flex flex-col gap-2">
              <input
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="Proof URL (IPFS, Google Drive, etc.)"
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
                {loading ? "SUBMITTING..." : "SUBMIT WORK"}
              </button>
            </div>
          )}

          {isPending && (
            <div className="bg-[#F2E885] border-2 border-black p-3 text-center font-bold">
              ⏳ Waiting for approval...
            </div>
          )}

          {canClaimReward && (
            <button
              onClick={() => onClaimReward(task.id)}
              disabled={loading}
              className="bg-[#7A8770] text-white px-6 py-3 font-bold border-2 border-black w-full disabled:opacity-70"
            >
              {loading ? "CLAIMING..." : "CLAIM REWARD"}
            </button>
          )}

          {isCompleted && (
            <div className="bg-[#7A8770] border-2 border-black p-3 text-center font-bold text-white">
              ✓ Reward claimed!
            </div>
          )}

          {isCreator && (
            <div className="mt-4 p-3 bg-gray-50 border-2 border-gray-300">
              <div className="font-bold mb-2 text-xs">TASK CREATOR ACTIONS</div>
              <input
                value={approveAddress}
                onChange={(e) => setApproveAddress(e.target.value)}
                placeholder="Claimant address (0x...)"
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
                APPROVE SUBMISSION
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
