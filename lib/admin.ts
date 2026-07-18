export const ADMIN_WALLETS: string[] = ["0xcC65A4457A1Bfc09d468FF56ECbC93a84C15e653"]

export function isAdminWallet(address: string | null | undefined): boolean {
  if (!address) return false
  return ADMIN_WALLETS.some((wallet) => wallet.toLowerCase() === address.toLowerCase())
}
