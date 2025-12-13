import type { TokenSymbol } from "./constants"

export interface TaskSlot {
  claimed: boolean
  submitted: boolean
  approved: boolean
  withdrawn: boolean
}

export type TaskCategory = "development" | "design" | "content" | "research" | "community" | "other"
export type TaskComplexity = "easy" | "medium" | "hard"

export interface Task {
  id: string
  title: string
  description: string
  reward: string
  totalSlots: string
  claimedSlots: string
  availableSlots: string
  active: boolean
  creator: string
  createdAt: Date
  mySlot: TaskSlot | null
  token?: TokenSymbol
  tokenAddress?: string
  category?: TaskCategory
  complexity?: TaskComplexity
  validationMethod?: string
  deadline?: Date | null
  tags?: string[]
}
