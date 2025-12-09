"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { Home, Clipboard, User, LogOut, ArrowLeft } from "lucide-react"
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  ERC20_ABI,
  CELO_CHAIN_ID,
  CELO_RPC,
  CUSTOM_ERRORS,
  SUPPORTED_TOKENS,
  type TokenSymbol,
} from "@/lib/constants"
import type { Task } from "@/lib/types"
import { Toast } from "@/components/ui/toast-custom"
import { CreateTaskModal } from "@/components/modals/create-task-modal"
import { TaskDetailModal } from "@/components/modals/task-detail-modal"
import { HomePage } from "@/components/pages/home-page"
import { TasksPage } from "@/components/pages/tasks-page"
import { ProfilePage } from "@/components/pages/profile-page"

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, callback: (...args: unknown[]) => void) => void
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void
    }
  }
}

export default function TheOfficeApp() {
  const [account, setAccount] = useState<string | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [tokenContracts, setTokenContracts] = useState<Record<TokenSymbol, ethers.Contract | null>>({
    cUSD: null,
    USDC: null,
  })
  const [currentPage, setCurrentPage] = useState<"home" | "tasks" | "profile">("home")
  const [toastMessage, setToastMessage] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)
  const [tokenBalances, setTokenBalances] = useState<Record<TokenSymbol, string>>({
    cUSD: "0.00",
    USDC: "0.00",
  })
  const [tasks, setTasks] = useState<Task[]>([])

  const toast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3000)
  }, [])

  // Setup wallet listeners
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return

    const handleAccountsChanged = async (accounts: unknown) => {
      const accountsArray = accounts as string[]
      if (accountsArray.length === 0) {
        setAccount(null)
        setContract(null)
        setTokenContracts({ cUSD: null, USDC: null })
        setTasks([])
        setCurrentPage("home")
        toast("Wallet disconnected")
      } else {
        toast("Account changed - reloading...")
        setTimeout(() => window.location.reload(), 500)
      }
    }

    const handleChainChanged = () => {
      toast("Network changed - reloading...")
      setTimeout(() => window.location.reload(), 500)
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum?.removeListener("chainChanged", handleChainChanged)
    }
  }, [toast])

  // Load tasks from localStorage
  useEffect(() => {
    if (account) {
      const savedTasks = localStorage.getItem(`theoffice_tasks_${account}`)
      if (savedTasks) {
        try {
          const parsed = JSON.parse(savedTasks)
          setTasks(
            parsed.map((t: Task) => ({
              ...t,
              createdAt: new Date(t.createdAt),
            })),
          )
        } catch (error) {
          console.error("Error loading tasks:", error)
        }
      }
    }
  }, [account])

  // Save tasks to localStorage
  useEffect(() => {
    if (account && tasks.length > 0) {
      localStorage.setItem(`theoffice_tasks_${account}`, JSON.stringify(tasks))
    }
  }, [tasks, account])

  useEffect(() => {
    const fetchBalances = async () => {
      if (!account) return

      const newBalances: Record<TokenSymbol, string> = { cUSD: "0.00", USDC: "0.00" }

      for (const [symbol, tokenContract] of Object.entries(tokenContracts)) {
        if (tokenContract) {
          try {
            const bal = await tokenContract.balanceOf(account)
            const tokenConfig = SUPPORTED_TOKENS[symbol as TokenSymbol]
            newBalances[symbol as TokenSymbol] = Number.parseFloat(
              ethers.formatUnits(bal, tokenConfig.decimals),
            ).toFixed(2)
          } catch (error) {
            console.error(`Error fetching ${symbol} balance:`, error)
          }
        }
      }

      setTokenBalances(newBalances)
    }
    fetchBalances()
  }, [account, tokenContracts])

  const connectWallet = async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        toast("Please install MetaMask, Valora, or MiniPay")
        return
      }

      const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[]

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: CELO_CHAIN_ID }],
        })
      } catch (switchError: unknown) {
        const error = switchError as { code?: number }
        if (error.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: CELO_CHAIN_ID,
                chainName: "Celo Mainnet",
                nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
                rpcUrls: [CELO_RPC],
                blockExplorerUrls: ["https://celoscan.io"],
              },
            ],
          })
        }
      }

      toast("Connecting to Web3...")
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const taskContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      const contracts: Record<TokenSymbol, ethers.Contract | null> = {
        cUSD: null,
        USDC: null,
      }
      for (const [symbol, config] of Object.entries(SUPPORTED_TOKENS)) {
        contracts[symbol as TokenSymbol] = new ethers.Contract(config.address, ERC20_ABI, signer)
      }

      setAccount(accounts[0])
      setContract(taskContract)
      setTokenContracts(contracts)

      toast("Wallet connected!")
    } catch (error) {
      console.error(error)
      toast("Error: " + (error as Error).message)
    }
  }

  const parseContractError = (error: unknown): string => {
    const err = error as { data?: string; message?: string; reason?: string }

    if (err.data && CUSTOM_ERRORS[err.data]) {
      return CUSTOM_ERRORS[err.data]
    }

    if (err.reason) {
      return err.reason
    }

    const message = err.message || String(error)

    if (message.includes("insufficient funds")) {
      return "Insufficient token balance"
    }
    if (message.includes("user rejected")) {
      return "Transaction rejected by user"
    }
    if (message.includes("execution reverted")) {
      const dataMatch = message.match(/data="(0x[a-fA-F0-9]+)"/)
      if (dataMatch && CUSTOM_ERRORS[dataMatch[1]]) {
        return CUSTOM_ERRORS[dataMatch[1]]
      }
      return "Contract execution failed - task ID may already exist or check your token balance"
    }

    return message.slice(0, 100)
  }

  const getTokenSymbolFromAddress = (tokenAddress: string): TokenSymbol => {
    const normalizedAddress = tokenAddress.toLowerCase()
    for (const [symbol, config] of Object.entries(SUPPORTED_TOKENS)) {
      if (config.address.toLowerCase() === normalizedAddress) {
        return symbol as TokenSymbol
      }
    }
    return "cUSD" // Default fallback
  }

  const getTask = useCallback(
    async (id: string): Promise<Task | null> => {
      if (!contract || !account) return null

      try {
        const task = await contract.getTask(id)
        const availableSlots = await contract.getAvailableSlots(id)
        const mySlot = await contract.getTaskSlot(id, account)

        const tokenSymbol = getTokenSymbolFromAddress(task.token)
        const tokenConfig = SUPPORTED_TOKENS[tokenSymbol]

        return {
          id: task.taskId,
          title: task.taskId,
          description: "Complete this task and earn rewards",
          reward: ethers.formatUnits(task.rewardPerSlot, tokenConfig.decimals),
          totalSlots: task.totalSlots.toString(),
          claimedSlots: task.claimedSlots.toString(),
          availableSlots: availableSlots.toString(),
          active: task.active,
          creator: task.creator,
          createdAt: new Date(Number(task.createdAt) * 1000),
          token: tokenSymbol,
          tokenAddress: task.token,
          mySlot: mySlot
            ? {
                claimed: mySlot.claimed,
                submitted: mySlot.submitted,
                approved: mySlot.approved,
                withdrawn: mySlot.withdrawn,
              }
            : null,
        }
      } catch (error) {
        console.error("Error getting task:", error)
        return null
      }
    },
    [contract, account],
  )

  const searchTask = async (searchQuery: string) => {
    if (!searchQuery || !contract) return

    setLoading(true)
    const task = await getTask(searchQuery)

    if (task) {
      const exists = tasks.find((t) => t.id === searchQuery)
      if (!exists) {
        setTasks([task, ...tasks])
      } else {
        setTasks(tasks.map((t) => (t.id === searchQuery ? task : t)))
      }
      toast("Task found!")
    } else {
      toast("Task not found")
    }

    setLoading(false)
  }

  const loadMyTasks = async () => {
    if (!contract || !account) return

    setLoading(true)
    toast("Loading your tasks...")

    const savedTasks = localStorage.getItem(`theoffice_tasks_${account}`)
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks)
        const refreshed: Task[] = []
        for (const t of parsed) {
          const updated = await getTask(t.id)
          if (updated) {
            refreshed.push(updated)
          }
        }
        setTasks(refreshed)
        toast(`Loaded ${refreshed.length} tasks`)
      } catch (error) {
        console.error("Error loading tasks:", error)
        toast("Error loading tasks")
      }
    } else {
      toast("No saved tasks found")
    }

    setLoading(false)
  }

  const createTask = async (
    taskId: string,
    taskTitle: string,
    taskDescription: string,
    rewardPerSlot: string,
    totalSlots: string,
    token: TokenSymbol,
  ) => {
    if (!contract || !account) return

    const tokenContract = tokenContracts[token]
    const tokenConfig = SUPPORTED_TOKENS[token]

    if (!tokenContract) {
      toast(`${token} contract not initialized`)
      return
    }

    try {
      setLoading(true)

      const rewardWei = ethers.parseUnits(rewardPerSlot, tokenConfig.decimals)
      const totalDeposit = rewardWei * BigInt(totalSlots)

      toast(`Checking ${token} balance...`)
      const balance = await tokenContract.balanceOf(account)

      if (balance < totalDeposit) {
        const needed = ethers.formatUnits(totalDeposit, tokenConfig.decimals)
        const have = ethers.formatUnits(balance, tokenConfig.decimals)
        toast(`Insufficient ${token}. Need ${needed}, have ${have}`)
        setLoading(false)
        return
      }

      toast("Checking task ID availability...")
      try {
        const existingTask = await contract.getTask(taskId)
        if (existingTask && existingTask.taskId === taskId) {
          toast("Task ID already exists. Please use a different ID.")
          setLoading(false)
          return
        }
      } catch {
        // Task doesn't exist, which is good
      }

      toast(`Checking ${token} allowance...`)
      const currentAllowance = await tokenContract.allowance(account, CONTRACT_ADDRESS)

      if (currentAllowance < totalDeposit) {
        toast(`Approving ${token}...`)
        const approveTx = await tokenContract.approve(CONTRACT_ADDRESS, totalDeposit)
        await approveTx.wait()
        toast(`${token} approved!`)
      } else {
        toast(`${token} already approved`)
      }

      toast("Creating task on blockchain...")
      const tx = await contract.createTask(taskId, tokenConfig.address, rewardWei, totalSlots, account)
      await tx.wait()

      toast("Task created successfully!")

      const newTask: Task = {
        id: taskId,
        title: taskTitle || taskId,
        description: taskDescription || "Complete this task and earn rewards",
        reward: rewardPerSlot,
        totalSlots: totalSlots,
        claimedSlots: "0",
        availableSlots: totalSlots,
        active: true,
        creator: account,
        createdAt: new Date(),
        token: token,
        tokenAddress: tokenConfig.address,
        mySlot: null,
      }

      setTasks([newTask, ...tasks])
      setShowCreateModal(false)

      setTimeout(async () => {
        const blockchainTask = await getTask(taskId)
        if (blockchainTask) {
          setTasks((prevTasks) => {
            const filtered = prevTasks.filter((t) => t.id !== taskId)
            return [blockchainTask, ...filtered]
          })
        }
      }, 2000)
    } catch (error) {
      console.error("Create task error:", error)
      toast("Error: " + parseContractError(error))
    } finally {
      setLoading(false)
    }
  }

  const claimTask = async (id: string) => {
    if (!contract) return

    try {
      setLoading(true)
      toast("Claiming task...")

      const tx = await contract.claimTask(id)
      await tx.wait()

      toast("Task claimed!")

      const updated = await getTask(id)
      if (updated) {
        setTasks(tasks.map((t) => (t.id === id ? updated : t)))
        setSelectedTask(updated)
      }
    } catch (error) {
      console.error(error)
      toast("Error: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const submitTask = async (id: string, proof: string) => {
    if (!contract || !proof) return

    try {
      setLoading(true)
      toast("Submitting proof...")

      const tx = await contract.submitTask(id, proof)
      await tx.wait()

      toast("Work submitted!")

      const updated = await getTask(id)
      if (updated) {
        setTasks(tasks.map((t) => (t.id === id ? updated : t)))
        setSelectedTask(updated)
      }
    } catch (error) {
      console.error(error)
      toast("Error: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const approveTaskSubmission = async (id: string, claimant: string) => {
    if (!contract) return

    try {
      setLoading(true)
      toast("Approving submission...")

      const tx = await contract.approveTask(id, claimant)
      await tx.wait()

      toast("Submission approved!")

      const updated = await getTask(id)
      if (updated) {
        setTasks(tasks.map((t) => (t.id === id ? updated : t)))
        setSelectedTask(updated)
      }
    } catch (error) {
      console.error(error)
      toast("Error: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const claimReward = async (id: string) => {
    if (!contract) return

    try {
      setLoading(true)
      toast("Claiming reward...")

      const tx = await contract.claimReward(id)
      await tx.wait()

      toast("Reward claimed!")

      const updated = await getTask(id)
      if (updated) {
        setTasks(tasks.map((t) => (t.id === id ? updated : t)))
        setSelectedTask(updated)
      }

      setShowTaskModal(false)
    } catch (error) {
      console.error(error)
      toast("Error: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setAccount(null)
    setContract(null)
    setTokenContracts({ cUSD: null, USDC: null })
    setTasks([])
    setCurrentPage("home")
    toast("Logged out")
  }

  const displayBalance = `${tokenBalances.cUSD} cUSD | ${tokenBalances.USDC} USDC`

  return (
    <div className="min-h-screen bg-[#F5EBE9] pb-20 font-mono">
      {/* Header */}
      <header className="sticky top-0 bg-[#3A4571] px-4 py-3 border-b-2 border-black z-40">
        <div className="flex items-center justify-between">
          {account && currentPage !== "home" && (
            <button onClick={() => setCurrentPage("home")} className="text-white p-1 hover:opacity-80">
              <ArrowLeft size={20} />
            </button>
          )}

          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-[#C4897B] border-2 border-black flex items-center justify-center font-bold text-white">
              TO
            </div>
            <span className="font-bold text-white text-lg">Balaio</span>
          </div>

          {account && (
            <div className="flex items-center gap-2">
              <div className="bg-[#7A8770] px-3 py-1.5 text-xs border-2 border-black text-white font-bold">
                {displayBalance}
              </div>
              <button onClick={logout} className="text-white hover:opacity-80">
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      {!account ? (
        <div className="p-12 text-center">
          <div className="bg-[#F2E885] border-2 border-black p-6 max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-3">Balaio</h1>
            <p className="text-base mb-5 text-gray-700">AI-powered task creation for every user type</p>
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-[#3A4571] text-white px-6 py-3 font-bold border-2 border-black hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Connecting..." : "Connect Wallet to Start"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {currentPage === "home" && (
            <HomePage setCurrentPage={setCurrentPage} setShowCreateModal={setShowCreateModal} />
          )}

          {currentPage === "tasks" && (
            <TasksPage
              tasks={tasks}
              loading={loading}
              setShowCreateModal={setShowCreateModal}
              searchTask={searchTask}
              loadMyTasks={loadMyTasks}
              setSelectedTask={setSelectedTask}
              setShowTaskModal={setShowTaskModal}
            />
          )}

          {currentPage === "profile" && <ProfilePage account={account} balance={displayBalance} tasks={tasks} />}
        </>
      )}

      {/* Bottom Navigation */}
      {account && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#3A4571] border-t-2 border-black flex z-40">
          {[
            { id: "home" as const, icon: Home, label: "Home" },
            { id: "tasks" as const, icon: Clipboard, label: "Tasks" },
            { id: "profile" as const, icon: User, label: "Profile" },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentPage(tab.id)}
                className={`flex-1 py-3.5 flex flex-col items-center gap-1 ${
                  currentPage === tab.id ? "bg-[#B88FD8]" : ""
                }`}
              >
                <Icon size={22} className="text-white" />
                <span className="text-xs text-white">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      )}

      {/* Modals */}
      <CreateTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={createTask}
        loading={loading}
        tokenBalances={tokenBalances}
      />

      <TaskDetailModal
        open={showTaskModal}
        task={selectedTask}
        account={account}
        loading={loading}
        onClose={() => setShowTaskModal(false)}
        onClaimTask={claimTask}
        onSubmitTask={submitTask}
        onApproveTask={approveTaskSubmission}
        onClaimReward={claimReward}
      />

      {/* Toast */}
      <Toast message={toastMessage} />
    </div>
  )
}
