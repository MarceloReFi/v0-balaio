import type { TokenSymbol } from "./constants"

export interface TaskSlot {
  claimed: boolean
  submitted: boolean
  approved: boolean
  withdrawn: boolean
}

export type TaskCategory = "development" | "design" | "content" | "research" | "community" | "other"
export type TaskComplexity = "easy" | "medium" | "hard"
export type TaskVisibility = "public" | "private"
export type PaymentMethod = "crypto" | "pix"
export type PixKeyType = "cpf" | "email" | "phone" | "random"

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
  visibility?: TaskVisibility
  // Pix payment fields
  paymentMethod?: PaymentMethod
  fiatAmount?: number
  workerPixKey?: string
  workerPixKeyType?: PixKeyType
  pixPaymentConfirmed?: boolean
  pixPaymentConfirmedAt?: Date | null
  claimedAt?: Date
  submittedAt?: Date
  approvedAt?: Date
  workerAddress?: string
}
