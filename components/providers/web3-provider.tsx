'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient } from '@/lib/wagmi-config'
import { MiniPayAutoConnect } from '@/components/minipay-auto-connect'

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MiniPayAutoConnect />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
