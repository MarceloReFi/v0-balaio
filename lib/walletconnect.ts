import EthereumProvider from "@walletconnect/ethereum-provider"
import { WALLETCONNECT_PROJECT_ID, APP_URL } from "@/lib/config"
export async function initWalletConnect() {
  if (!WALLETCONNECT_PROJECT_ID) {
    throw new Error("WalletConnect Project ID not configured. Please add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to your .env.local file")
  }
  const provider = await EthereumProvider.init({
    projectId: WALLETCONNECT_PROJECT_ID,
    chains: [42220],
    showQrModal: true,
    metadata: {
      name: "Balaio",
      description: "Web3 Tasks on Celo",
      url: APP_URL,
      icons: [`${APP_URL}/icon.png`],
    },
  })
  return provider
}
