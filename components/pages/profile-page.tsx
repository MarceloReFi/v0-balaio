"use client"

import { Settings } from "lucide-react"
import type { Task } from "@/lib/types"
import { useTranslations, type Language } from "@/lib/translations"

interface ProfilePageProps {
  account: string
  balance: string
  tasks: Task[]
  userActivity: { created: Task[]; worked: Task[] }
  onNavigateToBlog: () => void
  onApproveTask: (taskId: string, claimant: string) => Promise<void>
  language: Language
}

const formatTimestamp = (date: Date | null | undefined): string => {
  if (!date) return "-"
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ProfilePage({ account, balance, tasks, userActivity, onNavigateToBlog, onApproveTask, language }: ProfilePageProps) {
  const t = useTranslations(language)
  const completedTasks = tasks.filter((t) => t.mySlot?.approved)
  const totalEarned = completedTasks.reduce((sum, task) => {
    const reward = Number.parseFloat(task.reward) || 0
    return sum + reward
  }, 0)

  return (
    <div className="p-5 pb-24">
      <div className="bg-[#FF99CC] border-2 border-[#111111] rounded-xl p-5 mb-5 text-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-15 h-15 bg-[#FFFF66] border-2 border-[#111111] rounded-xl flex items-center justify-center text-xl font-bold">
            🧺
          </div>
          <div>
            <div className="text-xs opacity-80">{language === "en" ? "WALLET ADDRESS" : "ENDEREÇO DA CARTEIRA"}</div>
            <div className="font-bold text-sm font-mono">
              {account?.slice(0, 8)}...{account?.slice(-6)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white border-2 border-[#111111] rounded-xl text-center p-3">
            <div className="text-xl font-bold text-[#111111]">{completedTasks.length}</div>
            <div className="text-xs text-[#666666]">{t.tasksCompleted}</div>
          </div>
          <div className="bg-white border-2 border-[#111111] rounded-xl text-center p-3">
            <div className="text-xl font-bold text-[#99FF99]">{totalEarned.toFixed(2)}</div>
            <div className="text-xs text-[#666666]">{t.totalEarned}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-[#111111] rounded-xl p-4 mb-5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
        <h3 className="font-bold mb-3 flex items-center gap-2">📊 {t.recentActivity}</h3>

        {/* Tasks Created by User */}
        {userActivity.created.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold text-[#111111] mb-2 flex items-center gap-1">
              ✨ {t.tasksYouCreated}
            </div>
            <div className="space-y-3">
              {userActivity.created.slice(0, 5).map((task) => (
                <div key={`created-${task.id}`} className="border-2 border-gray-200 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold truncate max-w-[60%]">{task.title}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 border-2 rounded-lg ${task.active ? "bg-[#99FF99] border-[#111111]" : "bg-gray-200 border-[#666666]"}`}>
                      {task.active ? t.open : t.completed}
                    </span>
                  </div>
                  {task.workerAddress && (
                    <div className="text-xs text-[#666666] mb-1">
                      {t.workerAddressLabel}: <span className="font-mono">{task.workerAddress.slice(0, 6)}...{task.workerAddress.slice(-4)}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#666666]">
                    {task.claimedAt && <span>{t.claimedAtLabel}: {formatTimestamp(task.claimedAt)}</span>}
                    {task.submittedAt && <span>{t.submittedAtLabel}: {formatTimestamp(task.submittedAt)}</span>}
                    {task.approvedAt && <span>{t.approvedAtLabel}: {formatTimestamp(task.approvedAt)}</span>}
                  </div>
                  {task.submittedAt && !task.approvedAt && task.workerAddress && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => onApproveTask(task.id, task.workerAddress!)}
                        className="bg-[#99FF99] text-[#111111] px-3 py-1 text-xs font-bold border-2 border-[#111111] rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow"
                      >
                        {t.approveSubmission}
                      </button>
                      <button
                        className="bg-[#FF6666] text-white px-3 py-1 text-xs font-bold border-2 border-[#111111] rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow"
                      >
                        {t.rejectSubmission}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks User Worked On */}
        {userActivity.worked.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold text-[#99FF99] mb-2 flex items-center gap-1">
              💼 {t.tasksYouWorkedOn}
            </div>
            <div className="space-y-2">
              {userActivity.worked.slice(0, 5).map((task) => (
                <div key={`worked-${task.id}`} className="flex items-center justify-between text-sm border-b border-gray-200 pb-2">
                  <span className="text-xs truncate max-w-[50%]">{task.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">
                      {task.reward} {task.token || "cUSD"}
                    </span>
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 border-2 rounded-lg ${
                        task.approvedAt
                          ? "bg-[#99FF99] border-[#111111]"
                          : task.submittedAt
                            ? "bg-[#FFFF66] border-[#111111]"
                            : task.claimedAt
                              ? "bg-white border-[#666666]"
                              : "bg-gray-100 border-[#666666]"
                      }`}
                    >
                      {task.approvedAt
                        ? t.approved
                        : task.submittedAt
                          ? t.submitted
                          : task.claimedAt
                            ? t.claimed
                            : t.open}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legacy fallback from local tasks */}
        {userActivity.created.length === 0 && userActivity.worked.length === 0 && (
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
                        ? "text-[#99FF99]"
                        : task.mySlot?.submitted
                          ? "text-[#FFFF66]"
                          : "text-[#666666]"
                    }`}
                  >
                    {task.mySlot?.approved
                      ? t.approved
                      : task.mySlot?.submitted
                        ? t.submitted
                        : language === "en"
                          ? "In Progress"
                          : "Em Progresso"}
                  </span>
                </div>
              ))}
            {tasks.filter((t) => t.mySlot).length === 0 && (
              <p className="text-xs text-[#666666]">
                {language === "en" ? "No recent activity" : "Nenhuma atividade recente"}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white border-2 border-[#111111] rounded-xl p-4 mb-5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
        <h3 className="font-bold mb-3 flex items-center gap-2">💡 {t.levelUpSkills}</h3>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-20 h-20 bg-[#FFFF66] border-2 border-[#111111] rounded-xl flex items-center justify-center text-2xl">
            🎓
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-1">
              {language === "en" ? "The Future of Learn2Earn in Web3" : "O Futuro do Learn2Earn na Web3"}
            </h4>
            <p className="text-xs text-[#666666] mb-2">{t.visitBlogDesc}</p>
            <button
              onClick={onNavigateToBlog}
              className="bg-[#111111] text-white px-4 py-2 text-xs font-bold border-2 border-[#111111] rounded-xl hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow inline-flex items-center gap-1"
            >
              📖 {t.readMore} →
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-[#111111] rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Settings size={18} />
          {t.settings}
        </h3>
        <div className="space-y-2">
          <button className="w-full text-left p-3 border-2 border-[#111111] rounded-xl hover:bg-gray-50 text-sm flex items-center justify-between">
            <span>{t.notificationSettings}</span>
          </button>
          <button className="w-full text-left p-3 border-2 border-[#111111] rounded-xl hover:bg-gray-50 text-sm flex items-center justify-between">
            <span>{t.securitySettings}</span>
          </button>
          <button className="w-full text-left p-3 border-2 border-[#111111] rounded-xl hover:bg-gray-50 text-sm">
            {t.exportData}
          </button>
          <button className="w-full text-left p-3 border-2 border-[#111111] rounded-xl hover:bg-gray-50 text-sm flex items-center justify-between">
            <span>{t.adminSettings}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
