import { createClient } from "@/lib/supabase/client"
import type { Task } from "@/lib/types"
import { taskStatusLabel, type TaskStatusLabel } from "@/lib/task-status"

const XRPL_CHAIN_ID = 0

function rowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    reward: row.reward,
    totalSlots: String(row.slots ?? 1),
    claimedSlots: String(row.claimed_slots ?? 0),
    availableSlots: String((row.slots ?? 1) - (row.claimed_slots ?? 0)),
    active: row.status === 0,
    creator: row.creator_address,
    createdAt: new Date(row.created_at),
    mySlot: null,
  }
}

export async function saveXrplTask(task: {
  id: string
  title: string
  description: string
  amountXrp: string
  ownerAddress: string
}): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("tasks").insert({
    id: task.id,
    title: task.title,
    description: task.description,
    reward: task.amountXrp,
    token: "XRP",
    token_address: "native",
    creator_address: task.ownerAddress,
    status: 0,
    slots: 1,
    claimed_slots: 0,
    chain_id: XRPL_CHAIN_ID,
  })

  if (error) throw error
}

export async function updateEscrowSequence(taskId: string, sequence: number): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("xrpl_escrows").update({ sequence }).eq("task_id", taskId)

  if (error) throw error
}

export interface XrplTaskSummary {
  id: string
  title: string
  reward: string
  statusLabel: TaskStatusLabel
  createdAt: Date
}

export async function listXrplTasks(): Promise<XrplTaskSummary[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, reward, status, created_at")
    .eq("chain_id", XRPL_CHAIN_ID)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    reward: row.reward,
    statusLabel: taskStatusLabel(row.status),
    createdAt: new Date(row.created_at),
  }))
}

export interface XrplEscrow {
  condition: string
  sequence: number | null
  cancelAfter: number
  ownerAccount: string
}

export interface XrplTaskDetail {
  task: Task
  escrow: XrplEscrow | null
}

export async function getXrplTask(taskId: string): Promise<XrplTaskDetail | null> {
  const supabase = createClient()

  const { data: taskRow, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("chain_id", XRPL_CHAIN_ID)
    .maybeSingle()

  if (taskError) throw taskError
  if (!taskRow) return null

  const { data: escrowRow, error: escrowError } = await supabase
    .from("xrpl_escrows")
    .select("condition, sequence, cancel_after, owner_account")
    .eq("task_id", taskId)
    .maybeSingle()

  if (escrowError) throw escrowError

  return {
    task: rowToTask(taskRow),
    escrow: escrowRow
      ? {
          condition: escrowRow.condition,
          sequence: escrowRow.sequence,
          cancelAfter: escrowRow.cancel_after,
          ownerAccount: escrowRow.owner_account,
        }
      : null,
  }
}
