"use client"

import { useState } from "react"
import { ChevronDown, Calendar, Plus, X } from "lucide-react"
import { SUPPORTED_TOKENS, type TokenSymbol } from "@/lib/web3"
import { useTranslations, type Language } from "@/lib/translations"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import type { Task } from "@/lib/types"

interface CreateTaskModalProps {
  open: boolean
  onClose: () => void
  onCreateTask: (
    taskIds: string[],
    taskTitle: string,
    taskDescription: string,
    rewardPerSlot: string,
    totalSlots: string,
    token: TokenSymbol,
    category: Task["category"],
    complexity: Task["complexity"],
    validationMethod: string,
    deadline: Date | null,
    tags: string[],
    visibility: Task["visibility"],
  ) => void
  loading: boolean
  tokenBalances: Record<TokenSymbol, string>
  language: Language
  taskStatuses: Record<string, "idle" | "pending" | "success" | "error">
}

export function CreateTaskModal({
  open,
  onClose,
  onCreateTask,
  loading,
  tokenBalances,
  language,
  taskStatuses,
}: CreateTaskModalProps) {
  const t = useTranslations(language)
  const [taskIds, setTaskIds] = useState<string[]>([""])
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [rewardPerSlot, setRewardPerSlot] = useState("")
  const [totalSlots, setTotalSlots] = useState("1") // TEMPORARY: Hardcoded to 1 - multi-slot approval requires contract fix
  const [selectedToken, setSelectedToken] = useState<TokenSymbol>("cUSD")
  const [showTokenDropdown, setShowTokenDropdown] = useState(false)
  const [category, setCategory] = useState<NonNullable<Task["category"]>>("other")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [complexity, setComplexity] = useState<NonNullable<Task["complexity"]>>("medium")
  const [showComplexityDropdown, setShowComplexityDropdown] = useState(false)
  const [deadline, setDeadline] = useState<string>("")
  const [tagsInput, setTagsInput] = useState("")
  const [visibility, setVisibility] = useState<NonNullable<Task["visibility"]>>("public")

  if (!open) return null

  const validTaskIds = taskIds.map((id) => id.trim()).filter(Boolean)

  const submitTaskForm = () => {
    const parsedDeadline = deadline ? new Date(deadline) : null
    const parsedTags = tagsInput
      .split(",")
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0)

    onCreateTask(
      taskIds.map((id) => id.trim()).filter(Boolean),
      taskTitle,
      taskDescription,
      rewardPerSlot,
      totalSlots,
      selectedToken,
      category,
      complexity,
      "url",
      parsedDeadline,
      parsedTags,
      visibility,
    )
  }

  const addTaskId = () => {
    if (taskIds.length < 10) {
      setTaskIds([...taskIds, ""])
    }
  }

  const removeTaskId = (index: number) => {
    setTaskIds(taskIds.filter((_, i) => i !== index))
  }

  const updateTaskId = (index: number, value: string) => {
    const updated = [...taskIds]
    updated[index] = value
    setTaskIds(updated)
  }

  const getStatusIcon = (taskId: string) => {
    const trimmed = taskId.trim()
    if (!trimmed) return null
    const status = taskStatuses[trimmed]
    if (status === "pending") return <span className="text-base leading-none">⏳</span>
    if (status === "success") return <span className="text-base leading-none">✅</span>
    if (status === "error") return <span className="text-base leading-none">❌</span>
    return null
  }

  const totalCost =
    rewardPerSlot && totalSlots ? (Number.parseFloat(rewardPerSlot) * Number.parseInt(totalSlots)).toFixed(2) : null

  const tokenOptions = Object.values(SUPPORTED_TOKENS)

  const categoryOptions: { value: NonNullable<Task["category"]>; label: string }[] = [
    { value: "development", label: t.categoryDevelopment },
    { value: "design", label: t.categoryDesign },
    { value: "content", label: t.categoryContent },
    { value: "research", label: t.categoryResearch },
    { value: "community", label: t.categoryCommunity },
    { value: "other", label: t.categoryOther },
  ]

  const complexityOptions: { value: NonNullable<Task["complexity"]>; label: string }[] = [
    { value: "easy", label: t.complexityEasy },
    { value: "medium", label: t.complexityMedium },
    { value: "hard", label: t.complexityHard },
  ]

  const getCategoryLabel = (cat: NonNullable<Task["category"]>) => {
    return categoryOptions.find((c) => c.value === cat)?.label || cat
  }

  const getComplexityLabel = (comp: NonNullable<Task["complexity"]>) => {
    return complexityOptions.find((c) => c.value === comp)?.label || comp
  }

  const inputClass = "w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"

  return (
    <BottomSheet onClose={onClose}>
      <div className="px-[22px] pb-8">
        <div className="mb-5">
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1">
            {language === "en" ? "New task" : "Nova tarefa"}
          </p>
          <h2 className="font-display text-2xl text-on-surface">{t.createNewTask}</h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* Task IDs */}
          <div>
            <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">{t.taskId}</label>
            <div className="flex flex-col gap-2">
              {taskIds.map((id, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={id}
                    onChange={(e) => updateTaskId(index, e.target.value)}
                    placeholder="unique-task-id"
                    className={`flex-1 ${inputClass}`}
                  />
                  {getStatusIcon(id)}
                  <button
                    type="button"
                    onClick={() => removeTaskId(index)}
                    className="p-1 hover:opacity-70 text-on-surface-variant flex-shrink-0"
                    aria-label="Remove task ID"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addTaskId}
              disabled={taskIds.length >= 10}
              className="mt-2 flex items-center gap-1 text-sm font-semibold text-secondary hover:opacity-70 disabled:opacity-40"
            >
              <Plus size={16} />
              {t.addTaskId}
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">{t.title}</label>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">{t.description}</label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">
              {language === "en" ? "Visibility" : "Visibilidade"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "public" as const, label: language === "en" ? "Public" : "Publica" },
                { value: "verified_humans" as const, label: language === "en" ? "Verified" : "Verificado" },
                { value: "private" as const, label: language === "en" ? "Private" : "Privada" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setVisibility(opt.value)}
                  className={`py-2.5 px-3 font-semibold text-sm rounded-lg transition-colors ${
                    visibility === opt.value
                      ? "bg-primary-container text-on-primary"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-outline-variant"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              {visibility === "public"
                ? (language === "en" ? "Everyone can see and claim this task" : "Todos podem ver e reivindicar esta tarefa")
                : visibility === "verified_humans"
                ? (language === "en" ? "Only GoodDollar verified humans can see and claim" : "Apenas humanos verificados pelo GoodDollar podem ver e reivindicar")
                : (language === "en" ? "Only people with the task ID can access" : "Apenas pessoas com o ID da tarefa podem acessar")}
            </p>
          </div>

          {/* Category + Complexity side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">{t.category}</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm flex items-center justify-between outline-none"
                >
                  <span>{getCategoryLabel(category)}</span>
                  <ChevronDown size={16} className={`transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-outline-variant rounded-lg z-10 overflow-hidden shadow-md mt-1">
                    {categoryOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setCategory(opt.value); setShowCategoryDropdown(false) }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-surface-container-low transition-colors ${category === opt.value ? "font-semibold text-secondary" : "text-on-surface"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">{t.complexity}</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowComplexityDropdown(!showComplexityDropdown)}
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm flex items-center justify-between outline-none"
                >
                  <span>{getComplexityLabel(complexity)}</span>
                  <ChevronDown size={16} className={`transition-transform ${showComplexityDropdown ? "rotate-180" : ""}`} />
                </button>
                {showComplexityDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-outline-variant rounded-lg z-10 overflow-hidden shadow-md mt-1">
                    {complexityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setComplexity(opt.value); setShowComplexityDropdown(false) }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-surface-container-low transition-colors ${complexity === opt.value ? "font-semibold text-secondary" : "text-on-surface"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Validation method (fixed) */}
          <div>
            <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">{t.validationMethod}</label>
            <div className="px-4 py-2.5 bg-surface-container-low rounded-lg text-sm text-on-surface-variant">
              {t.validationUrl}
            </div>
          </div>

          {/* Reward + Deadline side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">
                {t.reward} ({selectedToken})
              </label>
              <input
                type="number"
                value={rewardPerSlot}
                onChange={(e) => setRewardPerSlot(e.target.value)}
                placeholder="10"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">{t.deadline}</label>
              <div className="relative">
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={`${inputClass} pr-10`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">{t.tags}</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder={t.tagsPlaceholder}
              className={inputClass}
            />
          </div>

          {/* Token selector */}
          <div>
            <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">{t.selectToken}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm flex items-center justify-between outline-none"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-on-surface">{selectedToken}</span>
                  <span className="text-on-surface-variant text-xs">
                    ({language === "en" ? "Balance" : "Saldo"}: {tokenBalances[selectedToken]})
                  </span>
                </span>
                <ChevronDown size={16} className={`transition-transform ${showTokenDropdown ? "rotate-180" : ""}`} />
              </button>
              {showTokenDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border border-outline-variant rounded-lg z-10 max-h-48 overflow-y-auto shadow-md mt-1">
                  {tokenOptions.map((token) => (
                    <button
                      key={token.symbol}
                      type="button"
                      onClick={() => { setSelectedToken(token.symbol); setShowTokenDropdown(false) }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-surface-container-low transition-colors flex items-center justify-between ${selectedToken === token.symbol ? "font-semibold text-secondary" : "text-on-surface"}`}
                    >
                      <span>{token.symbol} <span className="text-on-surface-variant font-normal">({token.name})</span></span>
                      <span className="text-on-surface-variant text-xs">{tokenBalances[token.symbol]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cost summary */}
          {totalCost && (
            <div className="bg-surface-container-low rounded-lg p-4 flex items-center justify-between">
              <div className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant">{t.totalCostBrl}</div>
              <div className="text-lg font-semibold text-on-surface">
                {totalCost} {selectedToken}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submitTaskForm}
            disabled={loading || validTaskIds.length === 0 || !taskTitle || !totalSlots || !rewardPerSlot}
            className="bg-primary-container text-on-primary px-6 py-3.5 font-semibold rounded-lg w-full disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {loading ? (language === "en" ? "Creating..." : "Criando...") : t.createTaskButton}
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
