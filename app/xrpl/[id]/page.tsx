"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { Task } from "@/lib/types"
import { getXrplTask, claimXrplTask, submitXrplTask, approveXrplTask, type XrplTaskDetail } from "@/lib/xrpl/tasks"
import { connectXaman, signAndSubmit } from "@/lib/xrpl/xaman"

const inputClass =
  "w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
const labelClass = "block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2"
const sectionLabelClass = "text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1"
const primaryButtonClass =
  "px-4 py-2 text-sm font-semibold rounded-full bg-primary-container text-on-primary hover:opacity-90 transition-opacity disabled:opacity-40"
const secondaryButtonClass =
  "px-4 py-2 text-sm font-semibold rounded-full bg-secondary text-on-secondary hover:opacity-90 transition-opacity disabled:opacity-40"

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
    if (!address) return
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

      if (!detail?.escrow) {
        setError("No escrow found for this task")
        return
      }

      const escrowFinishTx = {
        TransactionType: "EscrowFinish",
        Account: address,
        Owner: detail.escrow.ownerAccount,
        OfferSequence: data.sequence,
        Condition: data.condition,
        Fulfillment: data.fulfillment,
        Fee: data.fee,
      }

      const { hash } = await signAndSubmit(escrowFinishTx)
      setTxHash(hash)

      await approveXrplTask(taskId, workerAddress)

      const payoutResponse = await fetch("/api/xrpl/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, workerAddress }),
      })
      if (!payoutResponse.ok) {
        const payoutData = await payoutResponse.json().catch(() => ({}))
        setError("Approved, but payout failed: " + (payoutData.error ?? "Unknown error"))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve task")
    } finally {
      await load()
      setBusy(false)
    }
  }

  if (!detail) {
    return (
      <main className="max-w-3xl mx-auto px-[22px] py-5">
        {error ? <p className="text-xs text-red-500">{error}</p> : <p className="text-sm text-on-surface-variant">Loading...</p>}
      </main>
    )
  }

  const { task } = detail
  const isCreator = Boolean(address && address.toLowerCase() === task.creator.toLowerCase())
  const myClaim = address ? task.claims?.find((c) => c.workerAddress.toLowerCase() === address.toLowerCase()) : undefined
  const pendingClaims = task.claims?.filter((c) => c.submittedAt && !c.approvedAt) ?? []

  return (
    <main className="max-w-3xl mx-auto px-[22px] py-5">
      <h1 className="text-2xl font-bold text-on-surface mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
        {task.title}
      </h1>
      <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">{task.description}</p>

      <div className="flex flex-col gap-3 mb-6">
        <div>
          <p className={sectionLabelClass}>Amount</p>
          <p className="text-sm text-on-surface">{task.reward} XRP</p>
        </div>
        <div>
          <p className={sectionLabelClass}>Status</p>
          <p className="text-sm text-on-surface">{deriveStatus(task)}</p>
        </div>
        <div>
          <p className={sectionLabelClass}>Creator</p>
          <p className="text-sm text-on-surface break-all">{task.creator}</p>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
      {txHash && <p className="text-xs text-on-surface-variant mb-4 break-all">Transaction confirmed: {txHash}</p>}

      {!address ? (
        <button type="button" onClick={handleConnect} className={`w-full ${primaryButtonClass}`}>
          Connect Xaman
        </button>
      ) : isCreator ? (
        <div className="flex flex-col">
          {pendingClaims.length === 0 && (
            <div className="bg-surface-container-low rounded-2xl p-10 text-center">
              <p className="text-sm text-on-surface-variant">No submissions to approve yet.</p>
            </div>
          )}
          {pendingClaims.map((claim) => (
            <div
              key={claim.id}
              className="flex items-center justify-between gap-3 py-4 border-b border-outline-variant/20"
            >
              <div className="text-sm text-on-surface min-w-0">
                <p className="font-semibold truncate">{claim.workerAddress}</p>
                {claim.submissionLink && <p className="text-xs text-on-surface-variant truncate">{claim.submissionLink}</p>}
              </div>
              <button
                type="button"
                onClick={() => handleApprove(claim.workerAddress)}
                disabled={busy}
                className={`${primaryButtonClass} flex-shrink-0`}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      ) : !myClaim ? (
        <button type="button" onClick={handleClaim} disabled={busy} className={`w-full ${primaryButtonClass}`}>
          Claim
        </button>
      ) : myClaim.approvedAt ? (
        <p className="text-sm text-on-surface-variant">Payment released to your wallet.</p>
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
          <button
            type="button"
            onClick={handleSubmitProof}
            disabled={busy || !proofLink}
            className={`w-full ${secondaryButtonClass}`}
          >
            Submit
          </button>
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant">Waiting for approval.</p>
      )}
    </main>
  )
}
