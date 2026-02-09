import type { TokenSymbol } from "./constants"

export interface TaskSlot {
  claimed: boolean
  submitted: boolean
  approved: boolean
  withdrawn: boolean
}

export type PaymentMethod = "crypto" | "pix"
export type PixKeyType = "cpf" | "email" | "phone" | "random"

export interface TaskClaim {
  id: string
  taskId: string
  workerAddress: string
  claimedAt: Date
  submittedAt?: Date | null
  approvedAt?: Date | null
  submissionLink?: string | null
}

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
  category?: "development" | "design" | "content" | "research" | "community" | "other"
  complexity?: "easy" | "medium" | "hard"
  validationMethod?: string
  deadline?: Date | null
  tags?: string[]
  visibility?: "public" | "private"
  workerAddress?: string
  claimedAt?: Date | null
  submittedAt?: Date | null
  approvedAt?: Date | null
  claims?: TaskClaim[]
  paymentMethod?: PaymentMethod
  fiatAmount?: number
  workerPixKey?: string
  workerPixKeyType?: PixKeyType
  pixPaymentConfirmed?: boolean
  pixPaymentConfirmedAt?: Date | null
}
