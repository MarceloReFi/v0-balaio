"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface CreateTaskModalProps {
  open: boolean
  onClose: () => void
  onCreateTask: (
    taskId: string,
    taskTitle: string,
    taskDescription: string,
    rewardPerSlot: string,
    totalSlots: string,
  ) => void
  loading: boolean
}

export function CreateTaskModal({ open, onClose, onCreateTask, loading }: CreateTaskModalProps) {
  const [taskId, setTaskId] = useState("")
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [rewardPerSlot, setRewardPerSlot] = useState("")
  const [totalSlots, setTotalSlots] = useState("")

  if (!open) return null

  const handleCreate = () => {
    onCreateTask(taskId, taskTitle, taskDescription, rewardPerSlot, totalSlots)
    setTaskId("")
    setTaskTitle("")
    setTaskDescription("")
    setRewardPerSlot("")
    setTotalSlots("")
  }

  const totalCost =
    rewardPerSlot && totalSlots ? (Number.parseFloat(rewardPerSlot) * Number.parseInt(totalSlots)).toFixed(2) : null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-black p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Create New Task</h2>
          <button onClick={onClose} className="hover:opacity-70">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-bold mb-2 text-xs">TASK ID</label>
            <input
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="unique-task-id"
              className="w-full p-2.5 border-2 border-gray-300 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">TITLE</label>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title"
              className="w-full p-2.5 border-2 border-gray-300 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">DESCRIPTION</label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
              className="w-full p-2.5 border-2 border-gray-300 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">REWARD (cUSD)</label>
            <input
              type="number"
              value={rewardPerSlot}
              onChange={(e) => setRewardPerSlot(e.target.value)}
              placeholder="10"
              className="w-full p-2.5 border-2 border-gray-300 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 text-xs">SLOTS</label>
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
              <div className="font-bold text-xs">Total Cost:</div>
              <div className="text-lg font-bold">{totalCost} cUSD</div>
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={loading || !taskId || !rewardPerSlot || !totalSlots}
            className="bg-[#3A4571] text-white px-6 py-3 font-bold border-2 border-black w-full disabled:opacity-50"
          >
            {loading ? "CREATING..." : "CREATE TASK"}
          </button>
        </div>
      </div>
    </div>
  )
}
