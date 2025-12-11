"use client"

import { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { SUPPORTED_TOKENS, type TokenSymbol } from "@/lib/constants"
import { useTranslations, type Language } from "@/lib/translations"

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

  if (!open) return null

  const handleCreate = () => {
    onCreateTask(taskId, taskTitle, taskDescription, rewardPerSlot, totalSlots, selectedToken)
    setTaskId("")
    setTaskTitle("")
    setTaskDescription("")
    setRewardPerSlot("")
    setTotalSlots("")
    setSelectedToken("cUSD")
  }

  const totalCost =
    rewardPerSlot && totalSlots ? (Number.parseFloat(rewardPerSlot) * Number.parseInt(totalSlots)).toFixed(2) : null

  const tokenOptions = Object.values(SUPPORTED_TOKENS)

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
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-black border-t-0 z-10">
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

          {totalCost && (
            <div className="bg-[#F2E885] border-2 border-black p-3">
              <div className="font-bold text-xs">{language === "en" ? "Total Cost:" : "Custo Total:"}</div>
              <div className="text-lg font-bold">
                {totalCost} {selectedToken}
              </div>
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={loading || !taskId || !rewardPerSlot || !totalSlots}
            className="bg-[#3A4571] text-white px-6 py-3 font-bold border-2 border-black w-full disabled:opacity-50"
          >
            {loading ? (language === "en" ? "CREATING..." : "CRIANDO...") : t.createTaskButton}
          </button>
        </div>
      </div>
    </div>
  )
}
