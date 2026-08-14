import type { Task } from "@/lib/types"

export type TaskStatusLabel = "open" | "claimed" | "submitted" | "completed"

export function taskStatusLabel(status: number): TaskStatusLabel {
  return status === 0 ? "open" : status === 1 ? "claimed" : status === 2 ? "submitted" : "completed"
}

export type TaskListStatus = "open" | "claimed" | "submitted" | "approved" | "withdrawn" | "closed"

export function getMySlotStatus(mySlot: Task["mySlot"]): TaskListStatus | null {
  if (!mySlot) return null
  if (mySlot.withdrawn) return "withdrawn"
  if (mySlot.approved) return "approved"
  if (mySlot.submitted) return "submitted"
  if (mySlot.claimed) return "claimed"
  return null
}

export function getTaskListStatus(task: Task): TaskListStatus {
  const slotStatus = getMySlotStatus(task.mySlot)
  if (slotStatus) return slotStatus
  const hasOpenSlots = task.active && Number(task.availableSlots) > 0
  return hasOpenSlots ? "open" : "closed"
}
