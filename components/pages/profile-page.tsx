"use client"

import { useState } from "react"
import { Settings, X, ChevronRight } from "lucide-react"
import { TokenBadge } from "@/components/ui/token-badge"
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
  onRefreshClaims: () => void
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

export function ProfilePage({ account, balance, tasks, userActivity, onNavigateToBlog, onApproveTask, onWithdrawClaim, onAuthorizeWithdraw, onWithdraw, onClaimTokens, onRefreshClaims, language }: ProfilePageProps) {
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
    <div className="max-w-3xl mx-auto px-[22px] py-5 pb-24">
      {/* Identity card */}
      <div className="bg-balaio-surface rounded-balaio-xl p-5 mb-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 bg-white rounded-balaio-lg flex items-center justify-center shadow-balaio-card flex-shrink-0">
            <img src="/logo.png" alt="Balaio" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted">
              {language === "en" ? "Wallet" : "Carteira"}
            </p>
            <div className="font-semibold text-sm text-balaio-ink">
              {account.slice(0, 8)}...{account.slice(-6)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-balaio-md text-center p-3 shadow-balaio-card">
            <div className="text-xl font-semibold text-balaio-ink">{completedTasks.length}</div>
            <div className="text-xs text-balaio-muted mt-0.5">{t.tasksCompleted}</div>
          </div>
          <div className="bg-white rounded-balaio-md text-center p-3 shadow-balaio-card">
            <div className="text-xl font-semibold text-balaio-sage">{totalEarned.toFixed(2)}</div>
            <div className="text-xs text-balaio-muted mt-0.5">{t.totalEarned}</div>
          </div>
          <div className="bg-white rounded-balaio-md text-center p-3 shadow-balaio-card">
            <div className="text-xl font-semibold text-balaio-ink">{userActivity.created.length}</div>
            <div className="text-xs text-balaio-muted mt-0.5">{language === "en" ? "Created" : "Criadas"}</div>
          </div>
        </div>
      </div>

      {/* DB update notice */}
      {!noticeDismissed && (
        <div className="bg-balaio-pending-bg border border-balaio-rule rounded-balaio-xl p-4 mb-5 relative">
          <button
            onClick={dismissNotice}
            className="absolute top-3 right-3 p-0.5 hover:opacity-70 text-balaio-muted"
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
          <h4 className="font-semibold text-sm text-balaio-ink mb-1 pr-6">{t.dbUpdateNoticeTitle}</h4>
          <p className="text-xs text-balaio-muted leading-relaxed">{t.dbUpdateNoticeBody}</p>
          <button
            onClick={dismissNotice}
            className="mt-3 bg-balaio-ink text-white px-4 py-1.5 text-xs font-semibold rounded-balaio-pill hover:opacity-90 transition-opacity"
          >
            {t.dbUpdateNoticeDismiss}
          </button>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white border border-balaio-rule rounded-balaio-xl p-4 mb-5 shadow-balaio-card">
        <h3 className="font-semibold text-sm text-balaio-ink mb-4 flex items-center gap-2">
          {t.recentActivity}
        </h3>

        {userActivity.created.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted">
                {t.tasksYouCreated}
              </p>
              <button
                onClick={onRefreshClaims}
                className="text-xs font-semibold text-balaio-sage hover:opacity-70 transition-opacity"
              >
                {language === "en" ? "Refresh" : "Atualizar"}
              </button>
            </div>
            <div className="space-y-3">
              {userActivity.created.map((task) => {
                const claims = task.claims || []
                const hasClaims = claims.length > 0
                return (
                  <div key={`created-${task.id}`} className="border border-balaio-rule rounded-balaio-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-balaio-ink truncate max-w-[60%]">{task.title}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${task.active ? "bg-balaio-open-bg text-balaio-open-text" : "bg-balaio-claimed-bg text-balaio-claimed-text"}`}>
                        {task.active ? t.open : t.completed}
                      </span>
                    </div>
                    <div className="text-xs text-balaio-muted mb-2 flex items-center gap-1">
                      {task.claimedSlots}/{task.totalSlots} {language === "en" ? "slots claimed" : "vagas ocupadas"}
                      {" · "}{task.reward} <TokenBadge symbol={task.token || "cUSD"} />
                    </div>

                    {hasClaims ? (
                      <div className="space-y-2 mt-2">
                        {claims.map((claim) => (
                          <div key={claim.id} className="bg-balaio-surface rounded-balaio-md p-2.5">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-xs font-semibold text-balaio-ink">
                                {t.workerAddressLabel}: {claim.workerAddress.slice(0, 6)}...{claim.workerAddress.slice(-4)}
                              </div>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                claim.approvedAt
                                  ? "bg-balaio-open-bg text-balaio-open-text"
                                  : claim.submittedAt
                                    ? "bg-balaio-pending-bg text-balaio-pending-text"
                                    : "bg-balaio-claimed-bg text-balaio-claimed-text"
                              }`}>
                                {claim.approvedAt ? t.approved : claim.submittedAt ? t.pendingReview : t.claimed}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-balaio-muted">
                              <span>{t.claimedAtLabel}: {formatTimestamp(claim.claimedAt)}</span>
                              {claim.submittedAt && <span>{t.submittedAtLabel}: {formatTimestamp(claim.submittedAt)}</span>}
                              {claim.approvedAt && <span>{t.approvedAtLabel}: {formatTimestamp(claim.approvedAt)}</span>}
                            </div>
                            {claim.submissionLink && (
                              <div className="text-xs mt-1">
                                <span className="text-balaio-muted">{t.submissionLinkLabel}: </span>
                                <a
                                  href={claim.submissionLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-balaio-sage underline break-all"
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
                                  className="bg-balaio-sage text-white px-3 py-1 text-xs font-semibold rounded-balaio-pill hover:opacity-90 transition-opacity"
                                >
                                  {t.approveSubmission}
                                </button>
                                <button className="bg-red-500 text-white px-3 py-1 text-xs font-semibold rounded-balaio-pill hover:opacity-90 transition-opacity">
                                  {t.rejectSubmission}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-balaio-muted italic mt-1">{t.noClaimsYet}</div>
                    )}
                    {(() => {
                      const step = getWithdrawStep(task.id)
                      if (step === "done") return (
                        <div className="mt-2 pt-2 border-t border-balaio-rule text-xs font-semibold text-balaio-sage">
                          {t.tokensWithdrawn}
                        </div>
                      )
                      const stepConfig = {
                        cancel: {
                          label: t.cancelTask,
                          className: "bg-balaio-surface text-balaio-ink",
                          action: () => onWithdrawClaim(task.id),
                        },
                        authorize: {
                          label: t.authorizeWithdraw,
                          className: "bg-balaio-ink text-white",
                          action: () => onAuthorizeWithdraw(task.id),
                        },
                        withdraw: {
                          label: t.withdrawFunds,
                          className: "bg-balaio-ink text-white",
                          action: () => onWithdraw(task.id, account),
                        },
                        claim: {
                          label: t.claimTokens,
                          className: "bg-balaio-sage text-white",
                          action: () => onClaimTokens(task.id),
                        },
                      }[step]
                      return (
                        <div className="mt-2 pt-2 border-t border-balaio-rule">
                          {step !== "cancel" && (
                            <div className="text-xs text-balaio-muted mb-1">
                              {t.withdrawInProgress}
                            </div>
                          )}
                          <button
                            onClick={stepConfig.action}
                            className={`${stepConfig.className} px-3 py-1.5 text-xs font-semibold rounded-balaio-pill hover:opacity-90 transition-opacity`}
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
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted mb-3">
              {t.tasksYouWorkedOn}
            </p>
            <div className="space-y-0">
              {userActivity.worked.map((task) => (
                <div key={`worked-${task.id}`} className="flex items-center justify-between py-3 border-b border-balaio-rule">
                  <span className="text-sm text-balaio-ink truncate max-w-[50%]">{task.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-balaio-ink flex items-center gap-1">
                      {task.reward} <TokenBadge symbol={task.token || "cUSD"} />
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      task.approvedAt
                        ? "bg-balaio-open-bg text-balaio-open-text"
                        : task.submittedAt
                          ? "bg-balaio-pending-bg text-balaio-pending-text"
                          : task.claimedAt
                            ? "bg-balaio-claimed-bg text-balaio-claimed-text"
                            : "bg-balaio-claimed-bg text-balaio-claimed-text"
                    }`}>
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
          <div className="space-y-0">
            {tasks
              .filter((t) => t.mySlot)
              .slice(0, 3)
              .map((task) => (
                <div key={task.id} className="flex items-center justify-between py-3 border-b border-balaio-rule">
                  <span className="text-sm text-balaio-ink">{task.title}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    task.mySlot?.approved
                      ? "bg-balaio-open-bg text-balaio-open-text"
                      : task.mySlot?.submitted
                        ? "bg-balaio-pending-bg text-balaio-pending-text"
                        : "bg-balaio-claimed-bg text-balaio-claimed-text"
                  }`}>
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
              <p className="text-xs text-balaio-muted">
                {language === "en" ? "No recent activity" : "Nenhuma atividade recente"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Level Up / Blog */}
      <div className="bg-white border border-balaio-rule rounded-balaio-xl p-4 mb-5 shadow-balaio-card">
        <h3 className="font-semibold text-sm text-balaio-ink mb-3">{t.levelUpSkills}</h3>
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 bg-balaio-surface rounded-balaio-lg flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🎓</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-balaio-ink mb-1">
              {language === "en" ? "The Future of Learn2Earn in Web3" : "O Futuro do Learn2Earn na Web3"}
            </h4>
            <p className="text-xs text-balaio-muted mb-3">{t.visitBlogDesc}</p>
            <button
              onClick={onNavigateToBlog}
              className="bg-balaio-ink text-white px-4 py-2 text-xs font-semibold rounded-balaio-pill hover:opacity-90 transition-opacity inline-flex items-center gap-1"
            >
              {t.readMore} →
            </button>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white border border-balaio-rule rounded-balaio-xl p-4 shadow-balaio-card">
        <h3 className="font-semibold text-sm text-balaio-ink mb-3 flex items-center gap-2">
          <Settings size={15} className="text-balaio-muted" />
          {t.settings}
        </h3>
        <div className="space-y-0">
          {[
            t.notificationSettings,
            t.securitySettings,
            t.exportData,
            t.adminSettings,
          ].map((label, i) => (
            <button key={i} className="w-full text-left py-3 border-b border-balaio-rule last:border-0 text-sm text-balaio-ink flex items-center justify-between hover:text-balaio-sage transition-colors">
              <span>{label}</span>
              <ChevronRight size={15} className="text-balaio-muted" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
