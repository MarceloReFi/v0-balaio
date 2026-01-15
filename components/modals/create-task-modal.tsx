"use client"

import { useState } from "react"
import { X, ChevronDown, Calendar } from "lucide-react"
import { SUPPORTED_TOKENS, type TokenSymbol } from "@/lib/constants"
import { useTranslations, type Language } from "@/lib/translations"
import type { TaskCategory, TaskComplexity, TaskVisibility } from "@/lib/types"

interface CreateTaskModalProps {
  open: boolean
  onClose: () => void
  onCreateTask: (
    taskId: string,
    taskTitle: string,
    taskDescription: string,
    rewardPerSlot: string,
    totalSlots: string,
    token: TokenSymbol,
    category: TaskCategory,
    complexity: TaskComplexity,
    validationMethod: string,
    deadline: Date | null,
    tags: string[],
    visibility: TaskVisibility,
  ) => void
  loading: boolean
  tokenBalances: Record<TokenSymbol, string>
  language: Language
}

export function CreateTaskModal({
  open,
  onClose,
  onCreateTask,
  loading,
  tokenBalances,
  language,
}: CreateTaskModalProps) {
  const t = useTranslations(language)
  const [taskId, setTaskId] = useState("")
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [rewardPerSlot, setRewardPerSlot] = useState("")
  const [totalSlots, setTotalSlots] = useState("")
  const [selectedToken, setSelectedToken] = useState<TokenSymbol>("cUSD")
  const [showTokenDropdown, setShowTokenDropdown] = useState(false)
  const [category, setCategory] = useState<TaskCategory>("other")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [complexity, setComplexity] = useState<TaskComplexity>("medium")
  const [showComplexityDropdown, setShowComplexityDropdown] = useState(false)
  const [deadline, setDeadline] = useState<string>("")
  const [tagsInput, setTagsInput] = useState("")
  const [visibility, setVisibility] = useState<TaskVisibility>("public")

  if (!open) return null

  const handleCreate = () => {
    const parsedDeadline = deadline ? new Date(deadline) : null
    const parsedTags = tagsInput
      .split(",")
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0)

    onCreateTask(
      taskId,
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
    setTaskId("")
    setTaskTitle("")
    setTaskDescription("")
    setRewardPerSlot("")
    setTotalSlots("")
    setSelectedToken("cUSD")
    setCategory("other")
    setComplexity("medium")
    setDeadline("")
    setTagsInput("")
    setVisibility("public")
  }

  const totalCost =
    rewardPerSlot && totalSlots ? (Number.parseFloat(rewardPerSlot) * Number.parseInt(totalSlots)).toFixed(2) : null

  const tokenOptions = Object.values(SUPPORTED_TOKENS)

  const categoryOptions: { value: TaskCategory; label: string }[] = [
    { value: "development", label: t.categoryDevelopment },
    { value: "design", label: t.categoryDesign },
    { value: "content", label: t.categoryContent },
    { value: "research", label: t.categoryResearch },
    { value: "community", label: t.categoryCommunity },
    { value: "other", label: t.categoryOther },
  ]

  const complexityOptions: { value: TaskComplexity; label: string }[] = [
    { value: "easy", label: t.complexityEasy },
    { value: "medium", label: t.complexityMedium },
    { value: "hard", label: t.complexityHard },
  ]

  const getCategoryLabel = (cat: TaskCategory) => {
    return categoryOptions.find((c) => c.value === cat)?.label || cat
  }

  const getComplexityLabel = (comp: TaskComplexity) => {
    return complexityOptions.find((c) => c.value === comp)?.label || comp
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-black p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">{t.createNewTask}</h2>
          <button onClick={onClose} className="hover:opacity-70">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-bold mb-2 text-xs">{t.taskId}</label>
            <input
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="unique-task-id"
              className="w-full p-2.5 border-2 border-gray-300 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">{t.title}</label>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title"
              className="w-full p-2.5 border-2 border-gray-300 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">{t.description}</label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
              className="w-full p-2.5 border-2 border-gray-300 font-mono"
            />
          </div>

          {/* Visibility Toggle */}
          <div>
            <label className="block font-bold mb-2 text-xs">
              {language === "en" ? "VISIBILITY" : "VISIBILIDADE"}
            </label>
            <div className="flex border-2 border-black">
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`flex-1 py-2.5 px-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                  visibility === "public"
                    ? "bg-[#B8D962] text-black"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                🌐 {language === "en" ? "Public" : "Publica"}
              </button>
              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`flex-1 py-2.5 px-4 font-bold text-sm flex items-center justify-center gap-2 border-l-2 border-black transition-colors ${
                  visibility === "private"
                    ? "bg-[#C36DF0] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                🔒 {language === "en" ? "Private" : "Privada"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {visibility === "public"
                ? (language === "en" ? "Anyone can see and claim this task" : "Qualquer pessoa pode ver e reivindicar esta tarefa")
                : (language === "en" ? "Only people with the task ID can access" : "Apenas pessoas com o ID da tarefa podem acessar")}
            </p>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block font-bold mb-2 text-xs">{t.category}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full p-2.5 border-2 border-gray-300 font-mono flex items-center justify-between bg-white"
              >
                <span>{getCategoryLabel(category)}</span>
                <ChevronDown size={18} className={`transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-black border-t-0 z-10">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setCategory(opt.value)
                        setShowCategoryDropdown(false)
                      }}
                      className={`w-full p-2.5 text-left hover:bg-gray-100 ${
                        category === opt.value ? "bg-[#F2E885]" : ""
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Complexity Dropdown */}
          <div>
            <label className="block font-bold mb-2 text-xs">{t.complexity}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowComplexityDropdown(!showComplexityDropdown)}
                className="w-full p-2.5 border-2 border-gray-300 font-mono flex items-center justify-between bg-white"
              >
                <span>{getComplexityLabel(complexity)}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${showComplexityDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showComplexityDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-black border-t-0 z-10">
                  {complexityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setComplexity(opt.value)
                        setShowComplexityDropdown(false)
                      }}
                      className={`w-full p-2.5 text-left hover:bg-gray-100 ${
                        complexity === opt.value ? "bg-[#F2E885]" : ""
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Validation Method (fixed to URL) */}
          <div>
            <label className="block font-bold mb-2 text-xs">{t.validationMethod}</label>
            <div className="w-full p-2.5 border-2 border-gray-300 font-mono bg-gray-50 text-gray-600">
              {t.validationUrl}
            </div>
          </div>

          {/* Deadline Calendar */}
          <div>
            <label className="block font-bold mb-2 text-xs">{t.deadline}</label>
            <div className="relative">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-2.5 border-2 border-gray-300 font-mono pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold mb-2 text-xs">{t.tags}</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder={t.tagsPlaceholder}
              className="w-full p-2.5 border-2 border-gray-300 font-mono"
            />
          </div>

          {/* Token Selection */}
          <div>
            <label className="block font-bold mb-2 text-xs">{t.selectToken}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                className="w-full p-2.5 border-2 border-gray-300 font-mono flex items-center justify-between bg-white"
              >
                <span className="flex items-center gap-2">
                  <span className="font-bold">{selectedToken}</span>
                  <span className="text-gray-500 text-sm">
                    (Balance: {tokenBalances[selectedToken]} {selectedToken})
                  </span>
                </span>
                <ChevronDown size={18} className={`transition-transform ${showTokenDropdown ? "rotate-180" : ""}`} />
              </button>

              {showTokenDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-black border-t-0 z-10 max-h-48 overflow-y-auto">
                  {tokenOptions.map((token) => (
                    <button
                      key={token.symbol}
                      type="button"
                      onClick={() => {
                        setSelectedToken(token.symbol)
                        setShowTokenDropdown(false)
                      }}
                      className={`w-full p-2.5 text-left hover:bg-gray-100 flex items-center justify-between ${
                        selectedToken === token.symbol ? "bg-[#F2E885]" : ""
                      }`}
                    >
                      <span>
                        <span className="font-bold">{token.symbol}</span>
                        <span className="text-gray-500 text-sm ml-2">({token.name})</span>
                      </span>
                      <span className="text-sm text-gray-600">
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
              className="w-full p-2.5 border-2 border-gray-300 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">{language === "en" ? "SLOTS" : "VAGAS"}</label>
            <input
              type="number"
              value={totalSlots}
              onChange={(e) => setTotalSlots(e.target.value)}
              placeholder="5"
              className="w-full p-2.5 border-2 border-gray-300 font-mono"
            />
          </div>

          {/* Total Cost */}
          {totalCost && (
            <div className="bg-[#F2E885] border-2 border-black p-3">
              <div className="font-bold text-xs">{t.totalCostBrl}</div>
              <div className="text-lg font-bold">
                {totalCost} {selectedToken}
              </div>
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={loading || !taskId || !taskTitle || !totalSlots || !rewardPerSlot}
            className="bg-[#3A4571] text-white px-6 py-3 font-bold border-2 border-black w-full disabled:opacity-50"
          >
            {loading ? (language === "en" ? "CREATING..." : "CRIANDO...") : t.createTaskButton}
          </button>
        </div>
      </div>
    </div>
  )
}
