export interface TaskSlot {
  claimed: boolean
  submitted: boolean
  approved: boolean
  withdrawn: boolean
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
}
