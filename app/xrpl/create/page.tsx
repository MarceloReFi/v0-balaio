"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import * as xrpl from "xrpl"
import { saveXrplTask, updateEscrowSequence } from "@/lib/xrpl/tasks"
import type { RippleWalletConnectorHandle } from "@/components/ripple-wallet-connector"

const RippleWalletConnector = dynamic(() => import("@/components/ripple-wallet-connector"), { ssr: false })

const inputClass =
  "w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
const labelClass = "block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2"
const primaryButtonClass =
  "w-full px-4 py-2 text-sm font-semibold rounded-full bg-primary-container text-on-primary hover:opacity-90 transition-opacity disabled:opacity-40"

export default function CreateXrplTaskPage() {
  const router = useRouter()
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amountXrp, setAmountXrp] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const rippleConnectorRef = useRef<RippleWalletConnectorHandle | null>(null)

  const handleConnect = () => {
    setError(null)
    rippleConnectorRef.current?.open()
  }

  const handleSubmit = async () => {
    if (!ownerAddress) return

    setError(null)
    setSubmitting(true)
    try {
      const taskId = crypto.randomUUID()
      const amountDrops = xrpl.xrpToDrops(amountXrp)

      const createResponse = await fetch("/api/xrpl/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, ownerAddress, amountDrops }),
      })
      const createData = await createResponse.json()
      if (!createResponse.ok) {
        throw new Error(createData.error || "Failed to create escrow")
      }

      const { signRippleAndGetSequence } = await import("@/lib/xrpl/wallet-manager")
      const { sequence } = await signRippleAndGetSequence(createData.escrowCreateTx)

      await saveXrplTask({ id: taskId, title, description, amountXrp, ownerAddress })
      await updateEscrowSequence(taskId, sequence)

      router.push("/xrpl")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-[22px] py-5">
      <h1 className="text-2xl font-bold text-on-surface mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>
        Create XRPL Task
      </h1>

      <div className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>Amount (XRP)</label>
          <input
            type="number"
            min={1}
            value={amountXrp}
            onChange={(e) => setAmountXrp(e.target.value)}
            placeholder="1"
            className={inputClass}
          />
        </div>

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

        {!ownerAddress ? (
          <button type="button" onClick={handleConnect} className={primaryButtonClass}>
            Connect Wallet
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !title || !description || !amountXrp}
            className={primaryButtonClass}
          >
            {submitting ? "Creating..." : "Create Task"}
          </button>
        )}
      </div>

      <RippleWalletConnector
        onReady={(handle) => { rippleConnectorRef.current = handle }}
        onConnected={setOwnerAddress}
        onError={(err) => setError(err instanceof Error ? err.message : "Failed to connect wallet")}
      />
    </main>
  )
}
