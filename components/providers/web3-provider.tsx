'use client'

// Safari iOS WebSocket fix
if (typeof window !== 'undefined' && typeof window.WebSocket !== 'undefined') {
  const OriginalWebSocket = window.WebSocket
  window.WebSocket = function(...args) {
    return new OriginalWebSocket(...args)
  } as any
  window.WebSocket.prototype = OriginalWebSocket.prototype
  window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING
  window.WebSocket.OPEN = OriginalWebSocket.OPEN
  window.WebSocket.CLOSING = OriginalWebSocket.CLOSING
  window.WebSocket.CLOSED = OriginalWebSocket.CLOSED
}

import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient } from '@/lib/wagmi-config'

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
