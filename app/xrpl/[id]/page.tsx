"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { Task } from "@/lib/types"
import { getXrplTask, claimXrplTask, submitXrplTask, approveXrplTask, type XrplTaskDetail } from "@/lib/xrpl/tasks"
import { connectXaman, signAndSubmit } from "@/lib/xrpl/xaman"

const inputClass =
  "w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
const labelClass = "block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2"
const buttonClass =
  "px-4 py-2.5 rounded-lg font-semibold text-sm bg-primary-container text-on-primary hover:opacity-90 transition-opacity disabled:opacity-40"

function deriveStatus(task: Task): string {
  const claim = task.claims?.[0]
  if (!claim) return "Open"
  if (claim.approvedAt) return "Approved"
  if (claim.submittedAt) return "Submitted"
  return "Claimed"
}

export default function XrplTaskDetailPage() {
  const params = useParams<{ id: string }>()
  const taskId = params.id

  const [detail, setDetail] = useState<XrplTaskDetail | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [proofLink, setProofLink] = useState("")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const result = await getXrplTask(taskId)
      setDetail(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load task")
    }
  }, [taskId])

  useEffect(() => {
    load()
  }, [load])

  const handleConnect = async () => {
    setError(null)
    try {
      const connectedAddress = await connectXaman()
      setAddress(connectedAddress)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect Xaman")
    }
  }

  const handleClaim = async () => {
    if (!address) return
    setBusy(true)
    setError(null)
    try {
      await claimXrplTask(taskId, address)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim task")
    } finally {
      setBusy(false)
    }
  }

  const handleSubmitProof = async () => {
    if (!address) return
    setBusy(true)
    setError(null)
    try {
      await submitXrplTask(taskId, address, proofLink)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit proof")
    } finally {
      setBusy(false)
    }
  }

  const handleApprove = async (workerAddress: string) => {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch("/api/xrpl/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to approve task")
      }

      await approveXrplTask(taskId, workerAddress)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve task")
    } finally {
      setBusy(false)
    }
  }

  const handleWithdraw = async () => {
    if (!address || !detail) return
    setBusy(true)
    setError(null)
    try {
      const response = await fetch("/api/xrpl/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch escrow release data")
      }

      const escrowFinishTx = {
        TransactionType: "EscrowFinish",
        Account: address,
        Owner: detail.task.creator,
        OfferSequence: data.sequence,
        Condition: data.condition,
        Fulfillment: data.fulfillment,
      }

      const { hash } = await signAndSubmit(escrowFinishTx)
      setTxHash(hash)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to withdraw")
    } finally {
      setBusy(false)
    }
  }

  if (!detail) {
    return (
      <main className="max-w-2xl mx-auto px-[22px] py-8">
        {error ? <p className="text-sm text-red-500">{error}</p> : <p className="text-sm text-on-surface-variant">Loading...</p>}
      </main>
    )
  }

  const { task } = detail
  const isCreator = Boolean(address && address.toLowerCase() === task.creator.toLowerCase())
  const myClaim = address ? task.claims?.find((c) => c.workerAddress.toLowerCase() === address.toLowerCase()) : undefined
  const pendingClaims = task.claims?.filter((c) => c.submittedAt && !c.approvedAt) ?? []

  return (
    <main className="max-w-2xl mx-auto px-[22px] py-8">
      <h1 className="font-display text-2xl text-on-surface mb-2">{task.title}</h1>
      <p className="text-sm text-on-surface-variant mb-4">{task.description}</p>

      <div className="flex flex-col gap-1 mb-6 text-sm text-on-surface-variant">
        <p>Amount: {task.reward} XRP</p>
        <p>Status: {deriveStatus(task)}</p>
        <p>Creator: {task.creator}</p>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {txHash && <p className="text-sm text-on-surface-variant mb-4">Transaction confirmed: {txHash}</p>}

      {!address ? (
        <button type="button" onClick={handleConnect} className={buttonClass}>
          Connect Xaman
        </button>
      ) : isCreator ? (
        <div className="flex flex-col gap-3">
          {pendingClaims.length === 0 && <p className="text-sm text-on-surface-variant">No submissions to approve yet.</p>}
          {pendingClaims.map((claim) => (
            <div key={claim.id} className="flex items-center justify-between px-4 py-3 bg-surface-container-low rounded-lg">
              <div className="text-sm text-on-surface">
                <p className="font-semibold">{claim.workerAddress}</p>
                {claim.submissionLink && <p className="text-on-surface-variant">{claim.submissionLink}</p>}
              </div>
              <button type="button" onClick={() => handleApprove(claim.workerAddress)} disabled={busy} className={buttonClass}>
                Approve
              </button>
            </div>
          ))}
        </div>
      ) : !myClaim ? (
        <button type="button" onClick={handleClaim} disabled={busy} className={buttonClass}>
          Claim
        </button>
      ) : myClaim.approvedAt ? (
        <button type="button" onClick={handleWithdraw} disabled={busy} className={buttonClass}>
          Withdraw
        </button>
      ) : !myClaim.submittedAt ? (
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelClass}>Proof link</label>
            <input
              value={proofLink}
              onChange={(e) => setProofLink(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <button type="button" onClick={handleSubmitProof} disabled={busy || !proofLink} className={buttonClass}>
            Submit
          </button>
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant">Waiting for approval.</p>
      )}
    </main>
  )
}
