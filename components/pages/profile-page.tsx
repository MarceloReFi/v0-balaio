"use client"

import { BookOpen } from 'lucide-react'
import type { Task } from "@/lib/types"

interface ProfilePageProps {
  account: string
  balance: string
  tasks: Task[]
  onNavigateToBlog: () => void
}

export function ProfilePage({ account, balance, tasks, onNavigateToBlog }: ProfilePageProps) {
  return (
    <div className="p-5">
      <div className="bg-[#B88FD8] border-2 border-black p-5 mb-5 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-15 h-15 bg-[#C4897B] border-2 border-black flex items-center justify-center text-xl font-bold">
            TO
          </div>
          <div>
            <div className="text-xs opacity-80">WALLET ADDRESS</div>
            <div className="font-bold text-sm">
              {account?.slice(0, 8)}...{account?.slice(-6)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white border-2 border-black text-center p-3">
            <div className="text-xl font-bold text-[#3A4571]">{tasks.filter((t) => t.mySlot?.claimed).length}</div>
            <div className="text-xs text-gray-600">Tasks</div>
          </div>
          <div className="bg-white border-2 border-black text-center p-3">
            <div className="text-xl font-bold text-[#7A8770]">{balance}</div>
            <div className="text-xs text-gray-600">cUSD</div>
          </div>
          <div className="bg-white border-2 border-black text-center p-3">
            <div className="text-xl font-bold text-[#F2E885]">★★★</div>
            <div className="text-xs text-gray-600">Rating</div>
          </div>
        </div>
      </div>

      {/* <CHANGE> Added blog access button */}
      <div className="mb-5">
        <button
          onClick={onNavigateToBlog}
          className="w-full bg-[#F2E885] border-2 border-black p-4 font-bold flex items-center justify-between hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-shadow"
        >
          <div className="flex items-center gap-3">
            <BookOpen size={24} />
            <div className="text-left">
              <div className="text-base">Balaio Blog</div>
              <div className="text-xs font-normal opacity-80">Learn about Web3 & tasks</div>
            </div>
          </div>
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  )
}
