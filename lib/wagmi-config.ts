import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { celo } from '@reown/appkit/networks'
import { cookieStorage, createStorage } from 'wagmi'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID não definido')
}

export const networks = [celo]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: celo,
  metadata: {
    name: 'Balaio',
    description: 'Web3 Task Management on Celo',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.usebalaio.com',
    icons: ['https://www.usebalaio.com/icon-light-32x32.png']
  },
  features: {
    analytics: false,
    email: true,
    socials: ['google'],
    showWallets: true,
  }
})
