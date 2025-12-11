"use client"

import { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { SUPPORTED_TOKENS, type TokenSymbol } from "@/lib/constants"
import { useTranslations, type Language } from "@/lib/translations"
import type { TaskCategory, TaskComplexity, TaskValidationMethod } from "@/lib/types"

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
    validationMethod: TaskValidationMethod,
    deadline: string,
    tags: string[],
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
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [rewardPerSlot, setRewardPerSlot] = useState("")
  const [totalSlots, setTotalSlots] = useState("")
  const [selectedToken, setSelectedToken] = useState<TokenSymbol>("cUSD")
  const [showTokenDropdown, setShowTokenDropdown] = useState(false)
  const [category, setCategory] = useState<TaskCategory>("Education")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [complexity, setComplexity] = useState<TaskComplexity>("Low")
  const [showComplexityDropdown, setShowComplexityDropdown] = useState(false)
  const [validationMethod, setValidationMethod] = useState<TaskValidationMethod>("Manual Review")
  const [showValidationDropdown, setShowValidationDropdown] = useState(false)
  const [deadline, setDeadline] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])

  if (!open) return null

  // Generate a unique task ID
  const generateTaskId = () => {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 7)
    return `task_${timestamp}_${randomStr}`
  }

  const handleCreate = () => {
    // Auto-generate task ID
    const taskId = generateTaskId()

    onCreateTask(
      taskId,
      taskTitle,
      taskDescription,
      rewardPerSlot,
      totalSlots,
      selectedToken,
      category,
      complexity,
      validationMethod,
      deadline,
      tags,
    )
    // Reset form
    setTaskTitle("")
    setTaskDescription("")
    setRewardPerSlot("")
    setTotalSlots("")
    setSelectedToken("cUSD")
    setCategory("Education")
    setComplexity("Low")
    setValidationMethod("Manual Review")
    setDeadline("")
    setTags([])
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const totalCost =
    rewardPerSlot && totalSlots ? (Number.parseFloat(rewardPerSlot) * Number.parseInt(totalSlots)).toFixed(2) : null

  const tokenOptions = Object.values(SUPPORTED_TOKENS)
  const categoryOptions: TaskCategory[] = ["Education", "Research", "Event", "Partner Task"]
  const complexityOptions: TaskComplexity[] = ["Low", "Medium", "High"]
  const validationOptions: TaskValidationMethod[] = ["Manual Review", "Automatic", "Peer Review"]

  const getCategoryEmoji = (cat: TaskCategory) => {
    switch (cat) {
      case "Education":
        return "📚"
      case "Research":
        return "🔬"
      case "Event":
        return "🎉"
      case "Partner Task":
        return "🤝"
    }
  }

  const getComplexityColor = (comp: TaskComplexity) => {
    switch (comp) {
      case "Low":
        return "bg-green-500"
      case "Medium":
        return "bg-yellow-500"
      case "High":
        return "bg-red-500"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-black p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            🔥 {t.createNewTask}
          </h2>
          <button onClick={onClose} className="bg-[#FFB3C1] hover:bg-[#ff9bb0] px-3 py-2 border-2 border-black">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Task Title */}
          <div>
            <label className="block font-bold mb-2 text-sm flex items-center gap-1">
              📝 {t.title} <span className="text-red-500">*</span>
            </label>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Enter a clear, descriptive task title"
              className="w-full p-3 border-2 border-black"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-bold mb-2 text-sm flex items-center gap-1">
              🏷️ Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full p-3 border-2 border-black flex items-center justify-between bg-white"
              >
                <span className="flex items-center gap-2">
                  {getCategoryEmoji(category)} {category}
                </span>
                <ChevronDown size={18} className={`transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-black border-t-0 z-20 max-h-48 overflow-y-auto">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat)
                        setShowCategoryDropdown(false)
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-100 flex items-center gap-2 ${
                        category === cat ? "bg-[#F2E885]" : ""
                      }`}
                    >
                      {getCategoryEmoji(cat)} {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Complexity */}
          <div>
            <label className="block font-bold mb-2 text-sm flex items-center gap-1">
              ⚡ Complexity <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowComplexityDropdown(!showComplexityDropdown)}
                className="w-full p-3 border-2 border-black flex items-center justify-between bg-white"
              >
                <span className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${getComplexityColor(complexity)}`} />
                  {complexity}
                </span>
                <ChevronDown size={18} className={`transition-transform ${showComplexityDropdown ? "rotate-180" : ""}`} />
              </button>
              {showComplexityDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-black border-t-0 z-20">
                  {complexityOptions.map((comp) => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => {
                        setComplexity(comp)
                        setShowComplexityDropdown(false)
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-100 flex items-center gap-2 ${
                        complexity === comp ? "bg-[#F2E885]" : ""
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${getComplexityColor(comp)}`} />
                      {comp}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reward and Token */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-2 text-sm flex items-center gap-1">
                💰 Reward ({selectedToken}) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={rewardPerSlot}
                onChange={(e) => setRewardPerSlot(e.target.value)}
                placeholder="10"
                className="w-full p-3 border-2 border-black"
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-sm">Select Token</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                  className="w-full p-3 border-2 border-black flex items-center justify-between bg-white"
                >
                  <span className="font-bold">{selectedToken}</span>
                  <ChevronDown size={18} className={`transition-transform ${showTokenDropdown ? "rotate-180" : ""}`} />
                </button>
                {showTokenDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border-2 border-black border-t-0 z-20 max-h-48 overflow-y-auto">
                    {tokenOptions.map((token) => (
                      <button
                        key={token.symbol}
                        type="button"
                        onClick={() => {
                          setSelectedToken(token.symbol)
                          setShowTokenDropdown(false)
                        }}
                        className={`w-full p-2.5 text-left hover:bg-gray-100 ${
                          selectedToken === token.symbol ? "bg-[#F2E885]" : ""
                        }`}
                      >
                        <span className="font-bold text-sm">{token.symbol}</span>
                        <span className="text-gray-500 text-xs ml-2">({tokenBalances[token.symbol]})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Available Slots */}
          <div>
            <label className="block font-bold mb-2 text-sm flex items-center gap-1">
              👥 Available Slots <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={totalSlots}
              onChange={(e) => setTotalSlots(e.target.value)}
              placeholder="1"
              className="w-full p-3 border-2 border-black"
            />
          </div>

          {/* Validation Method */}
          <div>
            <label className="block font-bold mb-2 text-sm flex items-center gap-1">
              ✅ Validation Method <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowValidationDropdown(!showValidationDropdown)}
                className="w-full p-3 border-2 border-black flex items-center justify-between bg-white"
              >
                <span className="flex items-center gap-2">📝 {validationMethod}</span>
                <ChevronDown size={18} className={`transition-transform ${showValidationDropdown ? "rotate-180" : ""}`} />
              </button>
              {showValidationDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-black border-t-0 z-20">
                  {validationOptions.map((validation) => (
                    <button
                      key={validation}
                      type="button"
                      onClick={() => {
                        setValidationMethod(validation)
                        setShowValidationDropdown(false)
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-100 ${
                        validationMethod === validation ? "bg-[#F2E885]" : ""
                      }`}
                    >
                      📝 {validation}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block font-bold mb-2 text-sm flex items-center gap-1">
              📅 Deadline (Optional)
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-3 border-2 border-black"
            />
          </div>

          {/* Task Instructions */}
          <div>
            <label className="block font-bold mb-2 text-sm flex items-center gap-1">
              📄 Task Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Provide clear, detailed instructions for completing this task..."
              rows={4}
              className="w-full p-3 border-2 border-black"
            />
            <p className="text-xs text-gray-600 mt-1">
              Be specific about requirements, deliverables, and success criteria.
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold mb-2 text-sm">🏷️ Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag"
                className="flex-1 p-3 border-2 border-black"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-[#7A8770] text-white px-4 py-2 font-bold border-2 border-black hover:bg-[#6a7760]"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 px-3 py-1 border-2 border-black text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-red-500 font-bold">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Task Preview */}
          <div className="border-2 border-black p-4 bg-gray-50">
            <h3 className="font-bold mb-2 flex items-center gap-2">📋 Task Preview:</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Title:</strong> {taskTitle || "Task title will appear here"}
              </p>
              <p>
                <strong>Category:</strong> {getCategoryEmoji(category)} {category} | <strong>Complexity:</strong>{" "}
                {complexity}
              </p>
              <p>
                <strong>Reward:</strong> {rewardPerSlot || "0"} {selectedToken} | <strong>Slots:</strong>{" "}
                {totalSlots || "0"}
              </p>
              <p>
                <strong>Validation:</strong> {validationMethod}
              </p>
              {deadline && (
                <p>
                  <strong>Deadline:</strong> {new Date(deadline).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {totalCost && (
            <div className="bg-[#F2E885] border-2 border-black p-3">
              <div className="font-bold text-xs">Total Cost:</div>
              <div className="text-lg font-bold">
                {totalCost} {selectedToken}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="bg-white text-black px-6 py-3 font-bold border-2 border-black hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading || !taskTitle || !rewardPerSlot || !totalSlots || !taskDescription}
              className="bg-[#7A8770] text-white px-6 py-3 font-bold border-2 border-black hover:bg-[#6a7760] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "🚀 Creating..." : "🚀 Create Task"}
            </button>
          </div>

          {/* Creation Tips */}
          <div className="bg-blue-50 border-2 border-blue-300 p-3 text-xs">
            <p className="font-bold mb-1">💡 Task Creation Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Write clear, specific instructions to avoid confusion</li>
              <li>Set appropriate rewards based on task complexity and time required</li>
              <li>Use tags to help users find relevant tasks</li>
              <li>Consider the validation method that best fits your task type</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
