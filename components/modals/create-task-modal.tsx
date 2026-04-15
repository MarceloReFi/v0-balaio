"use client"

import { useState } from "react"
import { X, ChevronDown, Calendar, Plus } from "lucide-react"
import { SUPPORTED_TOKENS, type TokenSymbol } from "@/lib/web3"
import { useTranslations, type Language } from "@/lib/translations"
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-[#111111] rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">{t.createNewTask}</h2>
          <button onClick={onClose} className="hover:opacity-70">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-bold mb-2 text-xs">{t.taskId}</label>
            <div className="flex flex-col gap-2">
              {taskIds.map((id, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={id}
                    onChange={(e) => updateTaskId(index, e.target.value)}
                    placeholder="unique-task-id"
                    className="flex-1 p-2.5 border-2 border-[#111111] rounded-xl font-mono"
                  />
                  {getStatusIcon(id)}
                  <button
                    type="button"
                    onClick={() => removeTaskId(index)}
                    className="p-1 hover:opacity-70 text-[#666666] flex-shrink-0"
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
              className="mt-2 flex items-center gap-1 text-sm font-bold text-[#111111] hover:opacity-70 disabled:opacity-40"
            >
              <Plus size={16} />
              {t.addTaskId}
            </button>
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">{t.title}</label>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title"
              className="w-full p-2.5 border-2 border-[#111111] rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">{t.description}</label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
              className="w-full p-2.5 border-2 border-[#111111] rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">
              {language === "en" ? "VISIBILITY" : "VISIBILIDADE"}
            </label>
            <div className="grid grid-cols-3 gap-0 border-2 border-[#111111] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`py-2.5 px-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                  visibility === "public"
                    ? "bg-[#99FF99] text-[#111111]"
                    : "bg-white text-[#666666] hover:bg-gray-100"
                }`}
              >
                🌐 {language === "en" ? "Public" : "Publica"}
              </button>
              <button
                type="button"
                onClick={() => setVisibility("verified_humans")}
                className={`py-2.5 px-3 font-bold text-sm flex items-center justify-center gap-1 border-x-2 border-[#111111] transition-colors ${
                  visibility === "verified_humans"
                    ? "bg-[#FFFF66] text-[#111111]"
                    : "bg-white text-[#666666] hover:bg-gray-100"
                }`}
              >
                ✓ {language === "en" ? "Verified" : "Verificado"}
              </button>
              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`py-2.5 px-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                  visibility === "private"
                    ? "bg-[#FF99CC] text-[#111111]"
                    : "bg-white text-[#666666] hover:bg-gray-100"
                }`}
              >
                🔒 {language === "en" ? "Private" : "Privada"}
              </button>
            </div>
            <p className="text-xs text-[#666666] mt-2">
              {visibility === "public"
                ? (language === "en" ? "Everyone can see and claim this task" : "Todos podem ver e reivindicar esta tarefa")
                : visibility === "verified_humans"
                ? (language === "en" ? "Only GoodDollar verified humans can see and claim" : "Apenas humanos verificados pelo GoodDollar podem ver e reivindicar")
                : (language === "en" ? "Only people with the task ID can access" : "Apenas pessoas com o ID da tarefa podem acessar")}
            </p>
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">{t.category}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full p-2.5 border-2 border-[#111111] rounded-xl font-mono flex items-center justify-between bg-white"
              >
                <span>{getCategoryLabel(category)}</span>
                <ChevronDown size={18} className={`transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-[#111111] border-t-0 rounded-b-xl z-10 overflow-hidden">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setCategory(opt.value)
                        setShowCategoryDropdown(false)
                      }}
                      className={`w-full p-2.5 text-left hover:bg-gray-100 ${
                        category === opt.value ? "bg-[#FFFF66]" : ""
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">{t.complexity}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowComplexityDropdown(!showComplexityDropdown)}
                className="w-full p-2.5 border-2 border-[#111111] rounded-xl font-mono flex items-center justify-between bg-white"
              >
                <span>{getComplexityLabel(complexity)}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${showComplexityDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showComplexityDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-[#111111] border-t-0 rounded-b-xl z-10 overflow-hidden">
                  {complexityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setComplexity(opt.value)
                        setShowComplexityDropdown(false)
                      }}
                      className={`w-full p-2.5 text-left hover:bg-gray-100 ${
                        complexity === opt.value ? "bg-[#FFFF66]" : ""
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">{t.validationMethod}</label>
            <div className="w-full p-2.5 border-2 border-[#111111] rounded-xl font-mono bg-gray-50 text-[#666666]">
              {t.validationUrl}
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">{t.deadline}</label>
            <div className="relative">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-2.5 border-2 border-[#111111] rounded-xl font-mono pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666666] pointer-events-none" size={18} />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">{t.tags}</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder={t.tagsPlaceholder}
              className="w-full p-2.5 border-2 border-[#111111] rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">{t.selectToken}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                className="w-full p-2.5 border-2 border-[#111111] rounded-xl font-mono flex items-center justify-between bg-white"
              >
                <span className="flex items-center gap-2">
                  <span className="font-bold">{selectedToken}</span>
                  <span className="text-[#666666] text-sm">
                    (Balance: {tokenBalances[selectedToken]} {selectedToken})
                  </span>
                </span>
                <ChevronDown size={18} className={`transition-transform ${showTokenDropdown ? "rotate-180" : ""}`} />
              </button>

              {showTokenDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-[#111111] border-t-0 rounded-b-xl z-10 max-h-48 overflow-y-auto">
                  {tokenOptions.map((token) => (
                    <button
                      key={token.symbol}
                      type="button"
                      onClick={() => {
                        setSelectedToken(token.symbol)
                        setShowTokenDropdown(false)
                      }}
                      className={`w-full p-2.5 text-left hover:bg-gray-100 flex items-center justify-between ${
                        selectedToken === token.symbol ? "bg-[#FFFF66]" : ""
                      }`}
                    >
                      <span>
                        <span className="font-bold">{token.symbol}</span>
                        <span className="text-[#666666] text-sm ml-2">({token.name})</span>
                      </span>
                      <span className="text-sm text-[#666666]">
                        {tokenBalances[token.symbol]} {token.symbol}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">
              {t.reward} ({selectedToken})
            </label>
            <input
              type="number"
              value={rewardPerSlot}
              onChange={(e) => setRewardPerSlot(e.target.value)}
              placeholder="10"
              className="w-full p-2.5 border-2 border-[#111111] rounded-xl font-mono"
            />
          </div>

          {/* TEMPORARY: Slots field removed - hardcoded to 1 until contract multi-slot approval is fixed */}

          {totalCost && (
            <div className="bg-[#FFFF66] border-2 border-[#111111] rounded-xl p-3">
              <div className="font-bold text-xs text-[#111111]">{t.totalCostBrl}</div>
              <div className="text-lg font-bold text-[#111111]">
                {totalCost} {selectedToken}
              </div>
            </div>
          )}

          <button
            onClick={submitTaskForm}
            disabled={loading || validTaskIds.length === 0 || !taskTitle || !totalSlots || !rewardPerSlot}
            className="bg-[#111111] text-white px-6 py-3 font-bold border-2 border-[#111111] rounded-xl w-full disabled:opacity-50 hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow"
          >
            {loading ? (language === "en" ? "CREATING..." : "CRIANDO...") : t.createTaskButton}
          </button>
        </div>
      </div>
    </div>
  )
}
