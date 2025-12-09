"use client"

interface HomePageProps {
  setCurrentPage: (page: "home" | "tasks" | "profile") => void
  setShowCreateModal: (show: boolean) => void
}

export function HomePage({ setCurrentPage, setShowCreateModal }: HomePageProps) {
  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-5">Olá! 👋</h2>

      <div className="bg-[#F2E885] border-2 border-black p-5 mb-5">
        <h3 className="text-xl font-bold mb-2">Welcome to TheOffice</h3>
        <p className="text-sm mb-4 text-gray-700">Complete tasks, earn cUSD, build your Web3 portfolio</p>
        <button
          onClick={() => setCurrentPage("tasks")}
          className="bg-[#3A4571] text-white px-6 py-3 font-bold border-2 border-black hover:opacity-90"
        >
          Browse Tasks
        </button>
      </div>

      <div className="grid gap-3 mb-5">
        <div className="bg-white border-2 border-black p-5">
          <div className="text-2xl mb-2">💰</div>
          <h4 className="font-bold text-base mb-1">Earn cUSD</h4>
          <p className="text-xs text-gray-600">Get paid instantly for completed work</p>
        </div>
        <div className="bg-white border-2 border-black p-5">
          <div className="text-2xl mb-2">🚀</div>
          <h4 className="font-bold text-base mb-1">Multi-Slot Tasks</h4>
          <p className="text-xs text-gray-600">Multiple people can work together</p>
        </div>
        <div className="bg-white border-2 border-black p-5">
          <div className="text-2xl mb-2">🔒</div>
          <h4 className="font-bold text-base mb-1">Safe Escrow</h4>
          <p className="text-xs text-gray-600">Payments secured by smart contract</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => setCurrentPage("tasks")}
          className="bg-white text-[#3A4571] px-6 py-3 font-bold border-2 border-[#3A4571] text-left w-full hover:bg-gray-50"
        >
          → View Available Tasks
        </button>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-white text-[#3A4571] px-6 py-3 font-bold border-2 border-[#3A4571] text-left w-full hover:bg-gray-50"
        >
          → Create New Task
        </button>
      </div>
    </div>
  )
}
