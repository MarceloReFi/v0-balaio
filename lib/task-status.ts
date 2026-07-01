export type TaskStatusLabel = "open" | "claimed" | "submitted" | "completed"

export function taskStatusLabel(status: number): TaskStatusLabel {
  return status === 0 ? "open" : status === 1 ? "claimed" : status === 2 ? "submitted" : "completed"
}
