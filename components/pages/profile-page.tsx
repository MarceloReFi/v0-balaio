"use client"

import { useState } from "react"
import { Settings, X } from "lucide-react"
import type { Task, TaskClaim } from "@/lib/types"
import { useTranslations, type Language } from "@/lib/translations"

const DB_NOTICE_KEY = "balaio_db_update_notice_dismissed"

interface ProfilePageProps {
  account: string
  balance: string
  tasks: Task[]
  userActivity: { created: Task[]; worked: Task[] }
  onNavigateToBlog: () => void
  onApproveTask: (taskId: string, claimant: string) => Promise<void>
  onWithdrawClaim: (taskId: string) => Promise<void>
  onAuthorizeWithdraw: (taskId: string) => Promise<void>
  onWithdraw: (taskId: string, creatorAddress: string) => Promise<void>
  onClaimTokens: (taskId: string) => Promise<void>
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

export function ProfilePage({ account, balance, tasks, userActivity, onNavigateToBlog, onApproveTask, onWithdrawClaim, onAuthorizeWithdraw, onWithdraw, onClaimTokens, language }: ProfilePageProps) {
  const t = useTranslations(language)
  const [noticeDismissed, setNoticeDismissed] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(DB_NOTICE_KEY) === "true"
  })
  const completedTasks = tasks.filter((t) => t.mySlot?.approved)
  const totalEarned = completedTasks.reduce((sum, task) => {
    const reward = Number.parseFloat(task.reward) || 0
    return sum + reward
  }, 0)

  const dismissNotice = () => {
    localStorage.setItem(DB_NOTICE_KEY, "true")
    setNoticeDismissed(true)
  }

  const getCreatorSlot = (taskId: string) =>
    tasks.find((t) => t.id === taskId)?.mySlot ?? null

  const getWithdrawStep = (taskId: string) => {
    const slot = getCreatorSlot(taskId)
    if (!slot || !slot.claimed) return "cancel"
    if (slot.claimed && !slot.submitted) return "authorize"
    if (slot.submitted && !slot.approved) return "withdraw"
    if (slot.approved && !slot.withdrawn) return "claim"
    return "done"
  }

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
              {account.slice(0, 8)}...{account.slice(-6)}
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

      {!noticeDismissed && (
        <div className="bg-[#FFFF66] border-2 border-[#111111] rounded-xl p-4 mb-5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] relative">
          <button
            onClick={dismissNotice}
            className="absolute top-2 right-2 p-1 hover:opacity-70"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
          <h4 className="font-bold text-sm mb-1 pr-6">{t.dbUpdateNoticeTitle}</h4>
          <p className="text-xs text-[#333333] leading-relaxed">{t.dbUpdateNoticeBody}</p>
          <button
            onClick={dismissNotice}
            className="mt-3 bg-[#111111] text-white px-4 py-1.5 text-xs font-bold border-2 border-[#111111] rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow"
          >
            {t.dbUpdateNoticeDismiss}
          </button>
        </div>
      )}

      <div className="bg-white border-2 border-[#111111] rounded-xl p-4 mb-5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
        <h3 className="font-bold mb-3 flex items-center gap-2">📊 {t.recentActivity}</h3>

        {userActivity.created.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold text-[#111111] mb-2 flex items-center gap-1">
              ✨ {t.tasksYouCreated}
            </div>
            <div className="space-y-3">
              {userActivity.created.map((task) => {
                const claims = task.claims || []
                const hasClaims = claims.length > 0
                return (
                  <div key={`created-${task.id}`} className="border-2 border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold truncate max-w-[60%]">{task.title}</span>
                      <span className={`text-xs font-bold px-1.5 py-0.5 border-2 rounded-lg ${task.active ? "bg-[#99FF99] border-[#111111]" : "bg-gray-200 border-[#666666]"}`}>
                        {task.active ? t.open : t.completed}
                      </span>
                    </div>
                    <div className="text-xs text-[#666666] mb-2">
                      {task.claimedSlots}/{task.totalSlots} {language === "en" ? "slots claimed" : "vagas ocupadas"}
                      {" · "}{task.reward} {task.token || "cUSD"}
                    </div>

                    {hasClaims ? (
                      <div className="space-y-2 mt-2">
                        {claims.map((claim) => (
                          <div key={claim.id} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-xs font-mono font-bold text-[#111111]">
                                {t.workerAddressLabel}: {claim.workerAddress.slice(0, 6)}...{claim.workerAddress.slice(-4)}
                              </div>
                              <span
                                className={`text-xs font-bold px-1.5 py-0.5 border-2 rounded-lg ${
                                  claim.approvedAt
                                    ? "bg-[#99FF99] border-[#111111]"
                                    : claim.submittedAt
                                      ? "bg-[#FFFF66] border-[#111111]"
                                      : "bg-white border-[#666666]"
                                }`}
                              >
                                {claim.approvedAt ? t.approved : claim.submittedAt ? t.pendingReview : t.claimed}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#666666]">
                              <span>{t.claimedAtLabel}: {formatTimestamp(claim.claimedAt)}</span>
                              {claim.submittedAt && <span>{t.submittedAtLabel}: {formatTimestamp(claim.submittedAt)}</span>}
                              {claim.approvedAt && <span>{t.approvedAtLabel}: {formatTimestamp(claim.approvedAt)}</span>}
                            </div>
                            {claim.submissionLink && (
                              <div className="text-xs mt-1">
                                <span className="text-[#666666]">{t.submissionLinkLabel}: </span>
                                <a
                                  href={claim.submissionLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline break-all"
                                >
                                  {claim.submissionLink.length > 50
                                    ? claim.submissionLink.slice(0, 50) + "..."
                                    : claim.submissionLink}
                                </a>
                              </div>
                            )}
                            {claim.submittedAt && !claim.approvedAt && (
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => onApproveTask(task.id, claim.workerAddress)}
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
                    ) : (
                      <div className="text-xs text-[#666666] italic mt-1">{t.noClaimsYet}</div>
                    )}
                    {(() => {
                      const step = getWithdrawStep(task.id)
                      if (step === "done") return (
                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs font-bold text-[#666666]">
                          ✅ {t.tokensWithdrawn}
                        </div>
                      )
                      const stepConfig = {
                        cancel: {
                          label: t.cancelTask,
                          style: "bg-[#FFFF66] text-[#111111]",
                          action: () => onWithdrawClaim(task.id),
                        },
                        authorize: {
                          label: t.authorizeWithdraw,
                          style: "bg-[#FF99CC] text-[#111111]",
                          action: () => onAuthorizeWithdraw(task.id),
                        },
                        withdraw: {
                          label: t.withdrawFunds,
                          style: "bg-[#FF99CC] text-[#111111]",
                          action: () => onWithdraw(task.id, account),
                        },
                        claim: {
                          label: t.claimTokens,
                          style: "bg-[#99FF99] text-[#111111]",
                          action: () => onClaimTokens(task.id),
                        },
                      }[step]
                      return (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          {step !== "cancel" && (
                            <div className="text-xs text-[#666666] mb-1">
                              🔄 {t.withdrawInProgress}
                            </div>
                          )}
                          <button
                            onClick={stepConfig.action}
                            className={`${stepConfig.style} px-3 py-1 text-xs font-bold border-2 border-[#111111] rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow`}
                          >
                            {stepConfig.label}
                          </button>
                        </div>
                      )
                    })()}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {userActivity.worked.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold text-[#99FF99] mb-2 flex items-center gap-1">
              💼 {t.tasksYouWorkedOn}
            </div>
            <div className="space-y-2">
              {userActivity.worked.map((task) => (
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
