"use client"

import { X } from "lucide-react"

interface WalletSelectorProps {
  onSelectBrowser: () => void
  onSelectWalletConnect: () => void
  onClose: () => void
}

export function WalletSelector({ onSelectBrowser, onSelectWalletConnect, onClose }: WalletSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-[#111111] rounded-xl p-6 max-w-sm w-full shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#111111]">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-[#111111]" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onSelectBrowser}
            className="bg-[#FFFF66] border-2 border-[#111111] rounded-xl p-4 font-bold text-[#111111] text-left hover:shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] transition-shadow"
          >
            Browser Wallet (MetaMask)
          </button>

          <button
            onClick={onSelectWalletConnect}
            className="bg-[#99FF99] border-2 border-[#111111] rounded-xl p-4 font-bold text-[#111111] text-left hover:shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] transition-shadow"
          >
            WalletConnect (GoodDollar, Valora...)
          </button>
        </div>
      </div>
    </div>
  )
}
