import { createClient } from "@/lib/supabase/client"
import type { Task, TaskClaim } from "@/lib/types"
import { taskStatusLabel, type TaskStatusLabel } from "@/lib/task-status"

const XRPL_CHAIN_ID = 0

function rowToClaim(row: any): TaskClaim {
  return {
    id: row.id,
    taskId: row.task_id,
    workerAddress: row.worker_address,
    claimedAt: new Date(row.claimed_at),
    submittedAt: row.submitted_at ? new Date(row.submitted_at) : null,
    approvedAt: row.approved_at ? new Date(row.approved_at) : null,
    submissionLink: row.submission_link ?? null,
  }
}

function rowToTask(row: any, claims: TaskClaim[]): Task {
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
    claims,
    network: "ripple",
  }
}

export async function saveXrplTask(task: {
  id: string
  title: string
  description: string
  amountXrp: string
  ownerAddress: string
  category?: Task["category"] | null
  complexity?: Task["complexity"] | null
  deadline?: Date | null
  tags?: string[] | null
  visibility?: Task["visibility"] | null
  organizationId?: string | null
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
    category: task.category ?? null,
    complexity: task.complexity ?? null,
    deadline: task.deadline ? task.deadline.toISOString() : null,
    tags: task.tags ?? null,
    visibility: task.visibility ?? null,
    organization_id: task.organizationId ?? null,
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

  const { data: claimRows, error: claimsError } = await supabase
    .from("task_claims")
    .select("id, task_id, worker_address, claimed_at, submitted_at, approved_at, submission_link")
    .eq("task_id", taskId)

  if (claimsError) throw claimsError

  return {
    task: rowToTask(taskRow, (claimRows ?? []).map(rowToClaim)),
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

export async function claimXrplTask(taskId: string, workerAddress: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("task_claims")
    .upsert({ task_id: taskId, worker_address: workerAddress }, { onConflict: "task_id,worker_address" })

  if (error) throw error
}

export async function submitXrplTask(taskId: string, workerAddress: string, proofLink: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("task_claims")
    .update({ submission_link: proofLink, submitted_at: new Date().toISOString() })
    .eq("task_id", taskId)
    .eq("worker_address", workerAddress)

  if (error) throw error
}

export async function approveXrplTask(taskId: string, workerAddress: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("task_claims")
    .update({ approved_at: new Date().toISOString() })
    .eq("task_id", taskId)
    .eq("worker_address", workerAddress)

  if (error) throw error
}

export async function rejectXrplTask(taskId: string, workerAddress: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("task_claims")
    .update({ submitted_at: null, submission_link: null })
    .eq("task_id", taskId)
    .eq("worker_address", workerAddress)

  if (error) throw error
}
