import type { TaskCategory, TaskComplexity, TaskValidationMethod } from "./types"

export interface TaskMetadataPayload {
  task_id: string
  title: string
  description: string
  category: TaskCategory
  complexity: TaskComplexity
  validation_method: TaskValidationMethod
  deadline?: string
  tags: string[]
  creator_address: string
}

export interface TaskMetadataResponse {
  task_id: string
  title: string
  description: string
  category: TaskCategory
  complexity: TaskComplexity
  validation_method: TaskValidationMethod
  deadline?: string
  tags: string[]
  creator_address: string
  created_at: string
  updated_at: string
}

// Save task metadata to database
export async function saveTaskMetadata(payload: TaskMetadataPayload): Promise<TaskMetadataResponse> {
  const response = await fetch("/api/tasks/metadata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || "Failed to save task metadata")
  }

  return result.data
}

// Fetch all tasks metadata
export async function fetchAllTasksMetadata(): Promise<Record<string, TaskMetadataResponse>> {
  const response = await fetch("/api/tasks/metadata", {
    method: "GET",
    cache: "no-store",
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch tasks metadata")
  }

  // Convert array to object keyed by task_id for easy lookup
  const metadataMap: Record<string, TaskMetadataResponse> = {}
  result.data.forEach((metadata: TaskMetadataResponse) => {
    metadataMap[metadata.task_id] = metadata
  })

  return metadataMap
}

// Fetch specific task metadata
export async function fetchTaskMetadata(taskId: string): Promise<TaskMetadataResponse | null> {
  const response = await fetch(`/api/tasks/metadata/${taskId}`, {
    method: "GET",
    cache: "no-store",
  })

  if (response.status === 404) {
    return null
  }

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch task metadata")
  }

  return result.data
}
