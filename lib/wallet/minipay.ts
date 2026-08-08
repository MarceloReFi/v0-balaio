export function isMiniPay(): boolean {
  if (typeof window === "undefined") return false
  return (window.ethereum as { isMiniPay?: boolean } | undefined)?.isMiniPay === true
}
