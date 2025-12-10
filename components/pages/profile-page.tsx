"use client"

import { Settings } from "lucide-react"
import type { Task } from "@/lib/types"

interface ProfilePageProps {
  account: string
  balance: string
  usdcBalance: string
  tasks: Task[]
  onNavigateToBlog: () => void
}

export function ProfilePage({ account, balance, usdcBalance, tasks, onNavigateToBlog }: ProfilePageProps) {
  const completedTasks = tasks.filter((t) => t.mySlot?.approved)
  const totalEarned = completedTasks.reduce((sum, task) => {
    const reward = Number.parseFloat(task.reward) || 0
    return sum + reward
  }, 0)

  return (
    <div className="p-5 pb-24">
      <div className="bg-[#C36DF0] border-2 border-black p-5 mb-5 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-15 h-15 bg-[#D96E5F] border-2 border-black flex items-center justify-center text-xl font-bold">
            TO
          </div>
          <div>
            <div className="text-xs opacity-80">WALLET ADDRESS</div>
            <div className="font-bold text-sm">
              {account?.slice(0, 8)}...{account?.slice(-6)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white border-2 border-black text-center p-3">
            <div className="text-xl font-bold text-[#2B325C]">{completedTasks.length}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="bg-white border-2 border-black text-center p-3">
            <div className="text-xl font-bold text-[#636D4F]">{totalEarned.toFixed(2)}</div>
            <div className="text-xs text-gray-600">Earned (cUSD)</div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-black p-4 mb-5">
        <h3 className="font-bold mb-3 flex items-center gap-2">📊 Recent Activity</h3>
        <div className="space-y-2">
          {tasks
            .filter((t) => t.mySlot)
            .slice(0, 3)
            .map((task) => (
              <div key={task.id} className="flex items-center justify-between text-sm border-b border-gray-200 pb-2">
                <span className="text-xs">{task.title}</span>
                <span
                  className={`text-xs font-bold ${
                    task.mySlot?.approved
                      ? "text-[#636D4F]"
                      : task.mySlot?.submitted
                        ? "text-[#FFF244]"
                        : "text-gray-600"
                  }`}
                >
                  {task.mySlot?.approved ? "Approved" : task.mySlot?.submitted ? "Submitted" : "In Progress"}
                </span>
              </div>
            ))}
          {tasks.filter((t) => t.mySlot).length === 0 && <p className="text-xs text-gray-500">No recent activity</p>}
        </div>
      </div>

      <div className="bg-white border-2 border-black p-4 mb-5">
        <h3 className="font-bold mb-3 flex items-center gap-2">💡 Level Up Your Skills</h3>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-20 h-20 bg-gray-200 border-2 border-black flex items-center justify-center text-2xl">
            🎓
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-1">The Future of Learn2Earn in Web3</h4>
            <p className="text-xs text-gray-600 mb-2">
              Exploring how blockchain technology is revolutionizing education...
            </p>
            <button
              onClick={onNavigateToBlog}
              className="bg-[#636D4F] text-white px-4 py-2 text-xs font-bold border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow inline-flex items-center gap-1"
            >
              📖 Read More
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-black p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Settings size={18} />
          Settings
        </h3>
        <div className="space-y-2">
          <button className="w-full text-left p-3 border border-gray-200 hover:bg-gray-50 text-sm flex items-center justify-between">
            <span>Notification Settings</span>
            <span className="text-xs text-gray-500">soon</span>
          </button>
          <button className="w-full text-left p-3 border border-gray-200 hover:bg-gray-50 text-sm flex items-center justify-between">
            <span>Security Settings</span>
            <span className="text-xs text-gray-500">soon</span>
          </button>
          <button className="w-full text-left p-3 border border-gray-200 hover:bg-gray-50 text-sm">Export Data</button>
          <button className="w-full text-left p-3 border border-gray-200 hover:bg-gray-50 text-sm flex items-center justify-between">
            <span>Admin Settings</span>
            <span className="text-xs text-gray-500">soon</span>
          </button>
        </div>
      </div>
    </div>
  )
}
