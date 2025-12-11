import type { TokenSymbol } from "./constants"

export interface TaskSlot {
  claimed: boolean
  submitted: boolean
  approved: boolean
  withdrawn: boolean
}

export type TaskCategory = "Education" | "Research" | "Event" | "Partner Task"
export type TaskComplexity = "Low" | "Medium" | "High"
export type TaskValidationMethod = "Manual Review" | "Automatic" | "Peer Review"

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
  // Extended metadata fields
  category?: TaskCategory
  complexity?: TaskComplexity
  validationMethod?: TaskValidationMethod
  deadline?: Date
  tags?: string[]
}
