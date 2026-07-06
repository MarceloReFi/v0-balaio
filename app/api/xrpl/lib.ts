import * as xrpl from "xrpl"
import * as crypto from "crypto"

const RIPPLE_EPOCH_OFFSET_SECONDS = 946684800 // seconds between 1970-01-01 and 2000-01-01

export function generateEscrowPair(): { condition: string; fulfillment: string } {
  const preimage = crypto.randomBytes(32)
  const condition = crypto.createHash("sha256").update(preimage).digest("hex").toUpperCase()
  const fulfillment = preimage.toString("hex").toUpperCase()

  return { condition, fulfillment }
}

export function buildEscrowCreate(params: {
  ownerAddress: string
  destinationAddress: string
  amountDrops: string
  condition: string
  cancelAfterRippleEpoch: number
}): xrpl.EscrowCreate {
  return {
    TransactionType: "EscrowCreate",
    Account: params.ownerAddress,
    Destination: params.destinationAddress,
    Amount: params.amountDrops,
    Condition: params.condition,
    CancelAfter: params.cancelAfterRippleEpoch,
  }
}

export function buildEscrowFinish(params: {
  ownerAddress: string
  escrowOwner: string
  escrowSequence: number
  condition: string
  fulfillment: string
}): xrpl.EscrowFinish {
  return {
    TransactionType: "EscrowFinish",
    Account: params.ownerAddress,
    Owner: params.escrowOwner,
    OfferSequence: params.escrowSequence,
    Condition: params.condition,
    Fulfillment: params.fulfillment,
  }
}

export function rippleTimeFromDate(date: Date): number {
  return Math.floor(date.getTime() / 1000) - RIPPLE_EPOCH_OFFSET_SECONDS
}
