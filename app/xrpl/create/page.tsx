"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import * as xrpl from "xrpl"
import { connectXaman, signAndSubmit } from "@/lib/xrpl/xaman"
import { saveXrplTask, updateEscrowSequence } from "@/lib/xrpl/tasks"

const inputClass =
  "w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
const labelClass = "block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2"

export default function CreateXrplTaskPage() {
  const router = useRouter()
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amountXrp, setAmountXrp] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setError(null)
    try {
      const address = await connectXaman()
      setOwnerAddress(address)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect Xaman")
    }
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

      const { sequence } = await signAndSubmit(createData.escrowCreateTx)

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
    <main className="max-w-2xl mx-auto px-[22px] py-8">
      <h1 className="font-display text-2xl text-on-surface mb-6">Create XRPL Task</h1>

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

        {error && <p className="text-sm text-red-500">{error}</p>}

        {!ownerAddress ? (
          <button
            type="button"
            onClick={handleConnect}
            className="w-full py-3 rounded-lg font-semibold text-sm bg-primary-container text-on-primary hover:opacity-90 transition-opacity"
          >
            Connect Xaman
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !title || !description || !amountXrp}
            className="w-full py-3 rounded-lg font-semibold text-sm bg-primary-container text-on-primary hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {submitting ? "Creating..." : "Create Task"}
          </button>
        )}
      </div>
    </main>
  )
}
