export const ADMIN_WALLETS: string[] = ["0xcC65A4457A1Bfc09d468FF56ECbC93a84C15e653", "0x1b260D1E949919383eaC882101Ebb9d7DDcB4a6D", "0x86d8849f0385431ea09a75fda8499f7ecbc3c1dc"]

export function isAdminWallet(address: string | null | undefined): boolean {
  if (!address) return false
  return ADMIN_WALLETS.some((wallet) => wallet.toLowerCase() === address.toLowerCase())
}
