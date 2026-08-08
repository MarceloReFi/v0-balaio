import type { TokenSymbol } from "./chain/web3"

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
  withdrawnAt?: Date | null
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
  allowPhotoProof?: boolean
  locationLat?: number | null
  locationLng?: number | null
  deadline?: Date | null
  tags?: string[]
  visibility?: "public" | "private" | "verified_humans"
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
  contractAddress?: string
  network?: "evm" | "ripple"
  organizationId?: string | null
  projectId?: string | null
}

export interface TaskTemplate {
  id: string
  creatorAddress: string
  name: string
  description?: string | null
  category?: Task["category"]
  complexity?: Task["complexity"]
  tags: string[]
  allowPhotoProof: boolean
  locationLat?: number | null
  locationLng?: number | null
  createdAt: Date
}

export type OrganizationRole = "owner" | "admin"

export interface Organization {
  id: string
  ownerAddress: string
  name: string
  description?: string | null
  logoUrl?: string | null
  nature?: string | null
  niches: string[]
  region?: string | null
  contactEmail?: string | null
  socialLinks: Record<string, string>
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface OrganizationMember {
  id: string
  organizationId: string
  walletAddress: string
  role: OrganizationRole
  createdAt: Date
}

export interface Project {
  id: string
  organizationId: string
  title: string
  description?: string | null
  goals?: string | null
  website?: string | null
  createdAt: Date
  updatedAt: Date
}
