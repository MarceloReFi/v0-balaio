import * as xrpl from "xrpl"
import * as crypto from "crypto"
import { XRPL_SOURCE_TAG } from "@/lib/chain/config"

const RIPPLE_EPOCH_OFFSET_SECONDS = 946684800 // seconds between 1970-01-01 and 2000-01-01

export function generateEscrowPair(): { condition: string; fulfillment: string } {
  const preimage = crypto.randomBytes(32)
  const hash = crypto.createHash("sha256").update(preimage).digest()

  // PREIMAGE-SHA-256 fulfillment: A0 22 80 20 <32 bytes preimage>
  const fulfillment = ("A0228020" + preimage.toString("hex")).toUpperCase()

  // PREIMAGE-SHA-256 condition: A0 25 80 20 <32 bytes hash> 81 01 20
  const condition = ("A0258020" + hash.toString("hex") + "810120").toUpperCase()

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
    SourceTag: XRPL_SOURCE_TAG,
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
    SourceTag: XRPL_SOURCE_TAG,
  }
}

export function calculateEscrowFinishFee(fulfillmentHex: string): string {
  const fulfillmentBytes = Math.ceil(fulfillmentHex.length / 2)
  const blocks = Math.ceil(fulfillmentBytes / 16)
  return String(330 + blocks * 10)
}

export function rippleTimeFromDate(date: Date): number {
  return Math.floor(date.getTime() / 1000) - RIPPLE_EPOCH_OFFSET_SECONDS
}
