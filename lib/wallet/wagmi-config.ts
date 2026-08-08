import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { celo, gnosis } from '@reown/appkit/networks'
import { createStorage } from 'wagmi'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID não definido')
}

export const networks = [celo, gnosis]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: typeof window !== 'undefined' ? localStorage : undefined }),
  ssr: false,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: celo,
  featuredWalletIds: [
    "413daa290bab7484e4f37c8e7389f3b9c3fd86eb93e95cdef6bf4ae2d3e4aff6"
  ],
  metadata: {
    name: 'Balaio',
    description: 'Onchain Task Coordination',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.usebalaio.com',
    icons: ['https://www.usebalaio.com/icon-light-32x32.png']
  },
  features: {
    analytics: false,
    email: true,
    socials: ['google', 'github', 'apple', 'discord', 'x', 'facebook'],
  }
})
