"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { Home, Clipboard, User, LogOut, ArrowLeft, Languages, TrendingUp } from "lucide-react"
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  ERC20_ABI,
  CUSTOM_ERRORS,
  SUPPORTED_TOKENS,
  type TokenSymbol,
} from "@/lib/web3"
import { CELO_CHAIN_ID, CELO_RPC, VALORA_DEEP_LINK_BASE } from "@/lib/config"
import type { Task, TaskClaim } from "@/lib/types"
import { Toast } from "@/components/ui/toast"
import { CreateTaskModal } from "@/components/modals/create-task-modal"
import { TaskDetailModal } from "@/components/modals/task-detail-modal"
import { HomePage } from "@/components/pages/home-page"
import { LandingPage } from "@/components/pages/landing-page"
import { TasksPage } from "@/components/pages/tasks-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { BlogPage } from "@/components/pages/blog-page"
import { ExploreFeaturesPage } from "@/components/pages/explore-features-page"
import { StatsPage } from "@/components/pages/stats/stats-page"
import { useTranslations, type Language } from "@/lib/translations"
import { createClient } from "@/lib/supabase/client"
import { useAccount, useDisconnect } from 'wagmi'
import { useGoodID } from '@/lib/use-goodid'
import { useAppKit } from '@reown/appkit/react'
import { useEthersSigner } from '@/lib/ethers-adapter'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, callback: (...args: unknown[]) => void) => void
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void
    }
  }
}

interface WalletProvider {
  isValora?: boolean
  isMetaMask?: boolean
  isMiniPay?: boolean
  isCelo?: boolean
}

interface WalletError {
  code?: number
  message?: string
  reason?: string
  data?: string
}

function isWalletError(error: unknown): error is WalletError {
  return typeof error === "object" && error !== null
}

const isMobileDevice = () => {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const isInMobileWalletBrowser = () => {
  if (typeof window === "undefined" || !window.ethereum) return false
  const ethereum = window.ethereum as WalletProvider
  return !!(ethereum.isValora || ethereum.isMiniPay || (ethereum.isMetaMask && isMobileDevice()) || ethereum.isCelo)
}

const hasEthereumProvider = () => {
  if (typeof window === "undefined") return false
  return !!window.ethereum
}

function mapDatabaseRowToTask(row: any, mySlot: Task["mySlot"], claims?: TaskClaim[]): Task {
  return {
    id: row.id,
    title: row.title || `Task ${row.id.substring(0, 8)}...`,
    description: row.description || "",
    reward: row.reward || "0",
    totalSlots: String(row.slots || 1),
    claimedSlots: String(row.claimed_slots || 0),
    availableSlots: String((row.slots || 1) - (row.claimed_slots || 0)),
    active: row.status === 0,
    creator: row.creator_address,
    createdAt: new Date(row.created_at),
    token: row.token as TokenSymbol | undefined,
    tokenAddress: row.token_address || undefined,
    mySlot,
    visibility: (row.visibility || "public") as Task["visibility"],
    status: row.status === 0 ? "open" : row.status === 1 ? "claimed" : row.status === 2 ? "submitted" : "completed",
    category: row.category || undefined,
    complexity: row.complexity || undefined,
    validationMethod: row.validation_method || undefined,
    deadline: row.deadline ? new Date(row.deadline) : null,
    tags: row.tags || [],
    workerAddress: row.worker_address || undefined,
    claimedAt: row.claimed_at ? new Date(row.claimed_at) : null,
    submittedAt: row.submitted_at ? new Date(row.submitted_at) : null,
    approvedAt: row.approved_at ? new Date(row.approved_at) : null,
    paymentMethod: (row.payment_method || "crypto") as "crypto" | "pix",
    fiatAmount: row.fiat_amount ? parseFloat(row.fiat_amount) : undefined,
    workerPixKey: row.worker_pix_key || undefined,
    workerPixKeyType: row.worker_pix_key_type as "cpf" | "email" | "phone" | "random" | undefined,
    pixPaymentConfirmed: row.pix_payment_confirmed || false,
    pixPaymentConfirmedAt: row.pix_payment_confirmed_at ? new Date(row.pix_payment_confirmed_at) : undefined,
    claims: claims || undefined,
  }
}

function resolveTokenSymbol(tokenAddress: string): TokenSymbol {
  const normalized = tokenAddress.toLowerCase()
  for (const [symbol, config] of Object.entries(SUPPORTED_TOKENS)) {
    if (config.address.toLowerCase() === normalized) {
      return symbol as TokenSymbol
    }
  }
  return "cUSD"
}

const WALLET_ERROR_MAP: [((e: WalletError) => boolean), string][] = [
  [(e) => e.code === 4001 || !!e.message?.includes("cancelled"), "Connection cancelled by user"],
  [(e) => !!e.message?.includes("User rejected"), "Connection rejected"],
  [(e) => !!e.reason, ""],
  [(e) => !!e.message, ""],
]

function resolveWalletError(error: unknown): string {
  if (!isWalletError(error)) return "Failed to connect wallet"

  for (const [matcher, message] of WALLET_ERROR_MAP) {
    if (matcher(error)) {
      if (!message && error.reason) return "Error: " + error.reason
      if (!message && error.message) return "Error: " + error.message
      return message
    }
  }
  return "Failed to connect wallet"
}

export function TheOfficeApp() {
  const [account, setAccount] = useState<string>("")
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [tokenContracts, setTokenContracts] = useState<Record<TokenSymbol, ethers.Contract | null>>({
    CELO: null,
    cUSD: null,
    USDC: null,
  })
  const [currentPage, setCurrentPage] = useState<"home" | "tasks" | "profile" | "blog" | "features" | "stats">("home")
  const [toastMessage, setToastMessage] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)
  const [tokenBalances, setTokenBalances] = useState<Record<TokenSymbol, string>>({
    CELO: "0.00",
    cUSD: "0.00",
    USDC: "0.00",
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const { isVerified } = useGoodID(account)
  const [userActivity, setUserActivity] = useState<{ created: Task[]; worked: Task[] }>({ created: [], worked: [] })
  const [language, setLanguage] = useState<Language>("en")
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount()
  const { disconnect: wagmiDisconnect } = useDisconnect()
  const { open } = useAppKit()
  const signer = useEthersSigner()
  const t = useTranslations(language)
  const supabase = createClient()


  const toast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3000)
  }, [])

  const loadAllTasksFromSupabase = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        toast("Error loading tasks from database")
        setLoading(false)
        return
      }

      if (data && data.length > 0) {
        const loadedTasks: Task[] = []

        for (const row of data) {
          // Filter verified_humans tasks
          if (row.visibility === 'verified_humans' && !isVerified) {
            continue
          }

          // Filter private tasks - only show to creator
          if (row.visibility === 'private' && row.creator_address !== account?.toLowerCase()) {
            continue
          }

          let mySlot = null
          if (contract && account) {
            try {
              const slotData = await contract.getTaskSlot(row.id, account)
              mySlot = {
                claimed: slotData.claimed,
                submitted: slotData.submitted,
                approved: slotData.approved,
                withdrawn: slotData.withdrawn,
              }
            } catch {
              // User has no slot for this task
            }
          }

          loadedTasks.push(mapDatabaseRowToTask(row, mySlot))
        }

        setTasks(loadedTasks)
      } else {
        setTasks([])
      }

      setLoading(false)
    } catch {
      toast("Error loading tasks")
      setLoading(false)
    }
  }, [supabase, toast, contract, account])

  const loadUserActivity = useCallback(
    async (userAddress: string) => {
      if (!userAddress) return

      try {
        const normalizedAddress = userAddress.toLowerCase()

        const { data: createdTasks, error: createdError } = await supabase
          .from("tasks")
          .select("*")
          .ilike("creator_address", normalizedAddress)
          .order("created_at", { ascending: false })
          .limit(10)

        if (createdError) {
          console.error("Error fetching created tasks:", createdError.message)
        }

        const createdTaskIds = (createdTasks || []).map((t: any) => t.id)
        let claimsMap: Record<string, TaskClaim[]> = {}

        if (createdTaskIds.length > 0) {
          const { data: claimsData, error: claimsError } = await supabase
            .from("task_claims")
            .select("*")
            .in("task_id", createdTaskIds)
            .order("claimed_at", { ascending: false })

          if (claimsError) {
            console.error("Error fetching task claims:", claimsError.message)
          }

          if (claimsData) {
            for (const claim of claimsData) {
              const taskId = claim.task_id
              if (!claimsMap[taskId]) claimsMap[taskId] = []
              claimsMap[taskId].push({
                id: claim.id,
                taskId: claim.task_id,
                workerAddress: claim.worker_address,
                claimedAt: new Date(claim.claimed_at),
                submittedAt: claim.submitted_at ? new Date(claim.submitted_at) : null,
                approvedAt: claim.approved_at ? new Date(claim.approved_at) : null,
                submissionLink: claim.submission_link || null,
              })
            }
          }
        }

        const { data: workedClaims, error: workedClaimsError } = await supabase
          .from("task_claims")
          .select("*")
          .ilike("worker_address", normalizedAddress)
          .order("claimed_at", { ascending: false })
          .limit(10)

        if (workedClaimsError) {
          console.error("Error fetching worked claims:", workedClaimsError.message)
        }

        const workedTaskIds = (workedClaims || []).map((c: any) => c.task_id)
        let workedTasksData: any[] = []

        if (workedTaskIds.length > 0) {
          const { data: wtData } = await supabase
            .from("tasks")
            .select("*")
            .in("id", workedTaskIds)

          workedTasksData = wtData || []
        }

        // Legacy fallback for tasks.worker_address
        const { data: legacyWorkedTasks, error: legacyError } = await supabase
          .from("tasks")
          .select("*")
          .ilike("worker_address", normalizedAddress)
          .order("updated_at", { ascending: false })
          .limit(10)

        if (legacyError) {
          console.error("Error fetching legacy worked tasks:", legacyError.message)
        }

        const workedTaskMap = new Map<string, any>()
        for (const row of workedTasksData) {
          workedTaskMap.set(row.id, row)
        }

        const workedTasksList: Task[] = []
        const seenWorkedIds = new Set<string>()

        for (const claim of (workedClaims || [])) {
          const taskRow = workedTaskMap.get(claim.task_id)
          if (taskRow && !seenWorkedIds.has(taskRow.id)) {
            seenWorkedIds.add(taskRow.id)
            workedTasksList.push({
              ...mapDatabaseRowToTask(taskRow, null),
              claimedAt: claim.claimed_at ? new Date(claim.claimed_at) : null,
              submittedAt: claim.submitted_at ? new Date(claim.submitted_at) : null,
              approvedAt: claim.approved_at ? new Date(claim.approved_at) : null,
            })
          }
        }

        for (const row of (legacyWorkedTasks || [])) {
          if (!seenWorkedIds.has(row.id)) {
            seenWorkedIds.add(row.id)
            workedTasksList.push(mapDatabaseRowToTask(row, null))
          }
        }

        setUserActivity({
          created: (createdTasks || []).map((row: any) => mapDatabaseRowToTask(row, null, claimsMap[row.id] || [])),
          worked: workedTasksList,
        })
      } catch (error) {
        console.error("Error loading user activity:", error)
      }
    },
    [supabase],
  )

  const saveTaskToSupabase = useCallback(
    async (task: Task): Promise<{ success: boolean; error?: string }> => {
      try {
        const { error } = await supabase.from("tasks").upsert(
          {
            id: task.id,
            title: task.title,
            description: task.description,
            reward: task.reward,
            token: task.token || null,
            token_address: task.tokenAddress || null,
            creator_address: task.creator,
            worker_address: task.workerAddress || null,
            status: 0,
            slots: parseInt(task.totalSlots) || 1,
            claimed_slots: parseInt(task.claimedSlots) || 0,
            submission_link: null,
            updated_at: new Date().toISOString(),
            category: task.category || null,
            complexity: task.complexity || null,
            validation_method: task.validationMethod || null,
            deadline: task.deadline ? task.deadline.toISOString() : null,
            tags: task.tags || [],
            visibility: task.visibility || "public",
          },
          { onConflict: "id" },
        )

        if (error) {
          return { success: false, error: error.message }
        }
        return { success: true }
      } catch (error) {
        const message = isWalletError(error) ? error.message || "Unknown error" : String(error)
        return { success: false, error: message }
      }
    },
    [supabase],
  )

  const loadAllTasksFromBlockchain = useCallback(async () => {
    if (!contract || !account) return

    try {
      setLoading(true)

      const storedTaskIds = localStorage.getItem("taskIds")
      const taskIds = new Set<string>()

      if (storedTaskIds) {
        JSON.parse(storedTaskIds).forEach((id: string) => taskIds.add(id))
      }

      const taskIdsArray = Array.from(taskIds)
      let metadataMap: Record<string, any> = {}

      if (taskIdsArray.length > 0) {
        const { data: metadataRows } = await supabase
          .from("tasks")
          .select("*")
          .in("id", taskIdsArray)

        if (metadataRows) {
          metadataMap = metadataRows.reduce(
            (acc: Record<string, any>, row: any) => { acc[row.id] = row; return acc },
            {},
          )
        }
      }

      const loadedTasks: Task[] = []
      for (const taskId of taskIds) {
        try {
          const taskData = await contract.getTask(taskId)
          const tokenAddress = taskData[3].toLowerCase()
          const tokenSymbol = resolveTokenSymbol(tokenAddress)
          const tokenConfig = SUPPORTED_TOKENS[tokenSymbol]

          let mySlot = null
          try {
            const slotData = await contract.getTaskSlot(taskId, account)
            mySlot = {
              claimed: slotData.claimed,
              submitted: slotData.submitted,
              approved: slotData.approved,
              withdrawn: slotData.withdrawn,
            }
          } catch {
          }

          const metadata = metadataMap[taskId]

          loadedTasks.push({
            id: taskData[0],
            title: metadata?.title || `Task ${taskData[0].substring(0, 8)}...`,
            description: metadata?.description || "",
            reward: Number(ethers.formatUnits(taskData[4], tokenConfig.decimals)),
            totalSlots: Number(taskData[6]),
            claimedSlots: Number(taskData[6]),
            availableSlots: Number(taskData[5]) - Number(taskData[6]),
            token: tokenSymbol,
            tokenAddress: tokenAddress,
            creator: taskData[1],
            status: taskData[7] ? "open" : "closed",
            createdAt: new Date(Number(taskData[8]) * 1000),
            mySlot,
            category: metadata?.category || undefined,
            complexity: metadata?.complexity || undefined,
            validationMethod: metadata?.validation_method || undefined,
            deadline: metadata?.deadline ? new Date(metadata.deadline) : null,
            tags: metadata?.tags || [],
            visibility: metadata?.visibility || "public",
          })
        } catch (err) {
          console.error("Error loading task", taskId, ":", err)
        }
      }

      setTasks(loadedTasks)
      setLoading(false)
    } catch (error) {
      console.error("Error loading tasks:", error)
      setLoading(false)
    }
  }, [contract, account, supabase])

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return

    const syncAccounts = async (accounts: unknown) => {
      const accountsArray = accounts as string[]
      if (accountsArray.length === 0) {
        setAccount("")
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

    const onChainChanged = () => {
      toast("Network changed - reloading...")
      setTimeout(() => window.location.reload(), 500)
    }

    window.ethereum.on("accountsChanged", syncAccounts)
    window.ethereum.on("chainChanged", onChainChanged)

    return () => {
      window.ethereum?.removeListener("accountsChanged", syncAccounts)
      window.ethereum?.removeListener("chainChanged", onChainChanged)
    }
  }, [toast])

  useEffect(() => {
    if (contract && account) {
      loadAllTasksFromBlockchain()
    }
  }, [contract, account, loadAllTasksFromBlockchain])

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

  const openInValora = () => {
    const currentUrl = window.location.href
    const dappName = encodeURIComponent("Balaio")
    const encodedUrl = encodeURIComponent(currentUrl)
    const deepLink = `${VALORA_DEEP_LINK_BASE}?dappName=${dappName}&url=${encodedUrl}`

    toast("Opening Valora...")
    window.location.href = deepLink
  }

  const connectWallet = async () => {
    try {
      const isMobile = isMobileDevice()
      const inMobileWallet = isInMobileWalletBrowser()
      const hasProvider = hasEthereumProvider()
      if (isMobile && !inMobileWallet) {
        openInValora()
        return
      }
      if (!isMobile && !hasProvider) {
        toast("Please install MetaMask or use Valora on mobile")
        return
      }
      toast("Connecting to wallet...")
      const accounts = (await window.ethereum!.request({ method: "eth_requestAccounts" })) as string[]
      try {
        await window.ethereum!.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: CELO_CHAIN_ID }],
        })
      } catch (switchError: unknown) {
        if (!isWalletError(switchError)) throw switchError
        if (switchError.code === 4902) {
          await window.ethereum!.request({
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
        } else if (switchError.code === 4001) {
          toast("Network switch cancelled by user")
          return
        } else {
          throw switchError
        }
      }
      const provider = new ethers.BrowserProvider(window.ethereum!)
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
    } catch (error: unknown) {
      console.error("Connect wallet error:", error)
      toast(resolveWalletError(error))
    }
  }

  const parseContractError = (error: unknown): string => {
    if (!isWalletError(error)) return String(error).slice(0, 100)

    if (error.data && CUSTOM_ERRORS[error.data]) {
      return CUSTOM_ERRORS[error.data]
    }

    if (error.reason) {
      return error.reason
    }

    const message = error.message || String(error)

    const CONTRACT_ERROR_PATTERNS: [string, string][] = [
      ["insufficient funds", "Insufficient token balance"],
      ["user rejected", "Transaction rejected by user"],
    ]

    for (const [pattern, msg] of CONTRACT_ERROR_PATTERNS) {
      if (message.includes(pattern)) return msg
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

  const getTask = useCallback(
    async (id: string): Promise<Task | null> => {
      if (!contract || !account) return null

      try {
        const task = await contract.getTask(id)
        const availableSlots = await contract.getAvailableSlots(id)
        const mySlot = await contract.getTaskSlot(id, account)

        const tokenSymbol = resolveTokenSymbol(task.token)
        const tokenConfig = SUPPORTED_TOKENS[tokenSymbol]

        return {
          id: task.taskId,
          title: task.taskId,
          description: "",
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
    category: Task["category"],
    complexity: Task["complexity"],
    validationMethod: string,
    deadline: Date | null,
    tags: string[],
    visibility: Task["visibility"],
  ) => {
    if (!account || !contract) return

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

      toast("Blockchain transaction confirmed, saving to database...")

      const newTask: Task = {
        id: taskId,
        title: taskTitle || taskId,
        description: taskDescription,
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
        category: category,
        complexity: complexity,
        validationMethod: validationMethod,
        deadline: deadline,
        tags: tags,
        visibility: visibility,
        paymentMethod: "crypto",
      }

      const saveResult = await saveTaskToSupabase(newTask)
      if (!saveResult.success) {
        toast(`Task created on blockchain but failed to save to database: ${saveResult.error}. Please try searching for task ID "${taskId}" to sync it.`)
      } else {
        toast("Task created successfully!")
      }

      setTasks([newTask, ...tasks])
      setShowCreateModal(false)

      await loadAllTasksFromSupabase()
      await loadUserActivity(account)
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
        await saveTaskToSupabase(updated)
        await supabase.from("task_claims").upsert(
          {
            task_id: id,
            worker_address: account.toLowerCase(),
            claimed_at: new Date().toISOString(),
          },
          { onConflict: "task_id,worker_address" },
        )
        await supabase
          .from("tasks")
          .update({
            worker_address: account.toLowerCase(),
            claimed_at: new Date().toISOString(),
          })
          .eq("id", id)
      }
      if (account) await loadUserActivity(account)
    } catch (error) {
      console.error(error)
      toast("Error: " + parseContractError(error))
    } finally {
      setLoading(false)
    }
  }

  const submitTask = async (id: string, proof: string) => {
    if (!proof || !contract) return

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
        const now = new Date().toISOString()
        await supabase
          .from("task_claims")
          .update({
            submission_link: proof,
            submitted_at: now,
          })
          .eq("task_id", id)
          .eq("worker_address", account.toLowerCase())
        await supabase
          .from("tasks")
          .update({
            submission_link: proof,
            submitted_at: now,
            updated_at: now,
          })
          .eq("id", id)
      }
      if (account) await loadUserActivity(account)
    } catch (error) {
      console.error(error)
      toast("Error: " + parseContractError(error))
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
        await saveTaskToSupabase(updated)
        const now = new Date().toISOString()
        await supabase
          .from("task_claims")
          .update({ approved_at: now })
          .eq("task_id", id)
          .eq("worker_address", claimant.toLowerCase())
        await supabase
          .from("tasks")
          .update({ approved_at: now })
          .eq("id", id)
      }
      if (account) await loadUserActivity(account)
    } catch (error) {
      console.error(error)
      toast("Error: " + parseContractError(error))
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
        await saveTaskToSupabase(updated)
      }

      setShowTaskModal(false)
    } catch (error) {
      console.error(error)
      toast("Error: " + parseContractError(error))
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setAccount("")
    setContract(null)
    setTokenContracts({ cUSD: null, USDC: null })
    setTasks([])
    setCurrentPage("home")
    toast("Logged out")
  }

  const handleDisconnect = () => {
    if (wagmiConnected) {
      wagmiDisconnect()
    }
    setAccount("")
    setContract(null)
    setTokenContracts({ cUSD: null, USDC: null })
    setCurrentPage("landing")
    setTasks([])
    setUserActivity({ created: [], worked: [] })
    toast("Disconnected")
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "pt-BR" : "en"))
  }

  const displayBalance = `${tokenBalances.CELO} CELO | ${tokenBalances.cUSD} cUSD | ${tokenBalances.USDC} USDC`

  useEffect(() => {
    loadAllTasksFromSupabase()
  }, [loadAllTasksFromSupabase])

  useEffect(() => {
    if (contract && account) {
      loadAllTasksFromSupabase()
    }
  }, [contract, account, loadAllTasksFromSupabase])

  useEffect(() => {
    if (account) {
      loadUserActivity(account)
    }
  }, [account, loadUserActivity])

  useEffect(() => {
    async function initializeWagmiContracts() {
      if (wagmiConnected && wagmiAddress && signer && !account) {
        try {
          const taskContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
          const contracts: Record<TokenSymbol, ethers.Contract | null> = {
            cUSD: null,
            USDC: null,
          }
          for (const [symbol, config] of Object.entries(SUPPORTED_TOKENS)) {
            contracts[symbol as TokenSymbol] = new ethers.Contract(config.address, ERC20_ABI, signer)
          }
          setAccount(wagmiAddress)
          setContract(taskContract)
          setTokenContracts(contracts)
          toast("Wallet connected via WalletConnect!")
        } catch (error) {
          console.error("Wagmi contract init error:", error)
        }
      }
    }
    initializeWagmiContracts()
  }, [wagmiConnected, wagmiAddress, signer, account])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 bg-[#111111] px-4 py-3 border-b-2 border-[#111111] z-40">
        <div className="flex items-center justify-between">
          {account && currentPage !== "home" && (
            <button onClick={() => setCurrentPage("home")} className="text-white p-1 hover:opacity-80">
              <ArrowLeft size={20} />
            </button>
          )}

          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 border-2 border-[#111111] rounded-xl flex items-center justify-center bg-white">
              <img src="/logo.png" alt="Balaio Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <span className="font-bold text-white text-lg">{t.appName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="bg-[#FF99CC] px-2 py-1.5 text-xs border-2 border-[#111111] rounded-lg text-[#111111] font-bold hover:opacity-90 flex items-center gap-1"
              title={language === "en" ? "Português" : "English"}
            >
              <Languages size={14} />
              {language === "en" ? "PT" : "EN"}
            </button>
            {account && (
              <>
                <div className="bg-[#99FF99] px-3 py-1.5 text-xs border-2 border-[#111111] rounded-lg text-[#111111] font-bold">
                  {displayBalance}
                </div>
                <button onClick={logout} className="text-white hover:opacity-80">
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {account && (
        <div className="bg-[#111111] border-2 border-[#111111] p-8 mb-5 text-center">
          <h2 className="text-2xl font-bold mb-2 text-white text-left">{t.welcome}</h2>
          <p className="text-sm mb-4 text-white/90 text-left">{t.subtitle}</p>
          <button
            onClick={connectWallet}
            className="bg-[#FFFF66] text-[#111111] px-6 py-3 font-bold border-2 border-[#111111] rounded-xl hover:shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] transition-shadow"
          >
            {t.walletConnected}
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-16">
        {!account && <LandingPage onConnect={connectWallet} onOpenWallet={open} language={language} />}
        {account && currentPage === "home" && (
          <HomePage
            onConnect={connectWallet}
            language={language}
            tasks={tasks}
            account={account}
            onViewTask={(task) => {
              setSelectedTask(task)
              setShowTaskModal(true)
            }}
            onClaimTask={(task) => claimTask(task.id)}
            onNavigateToTasks={() => setCurrentPage("tasks")}
            onNavigateToFeatures={() => setCurrentPage("features")}
          />
        )}
        {account && currentPage === "features" && (
          <ExploreFeaturesPage onBack={() => setCurrentPage("home")} language={language} />
        )}
        {account && currentPage === "tasks" && (
          <TasksPage
            tasks={tasks}
            account={account}
            searchTask={searchTask}
            loadMyTasks={loadMyTasks}
            setSelectedTask={setSelectedTask}
            setShowTaskModal={setShowTaskModal}
            setShowCreateModal={setShowCreateModal}
            language={language}
          />
        )}
        {account && currentPage === "profile" && (
          <ProfilePage
            account={account}
            balance={displayBalance}
            tasks={tasks}
            userActivity={userActivity}
            onNavigateToBlog={() => setCurrentPage("blog")}
            onApproveTask={approveTaskSubmission}
            onWithdrawClaim={claimTask}
            onAuthorizeWithdraw={(id) => submitTask(id, "Withdraw Funds")}
            onWithdraw={approveTaskSubmission}
            onClaimTokens={claimReward}
            language={language}
          />
        )}
        {account && currentPage === "blog" && <BlogPage onBack={() => setCurrentPage("profile")} language={language} />}
        {account && currentPage === "stats" && <StatsPage language={language} />}
      </main>

      {account && (
        <div className="bg-white border-2 border-[#111111] p-6 text-center">
          <h3 className="text-xl font-bold mb-2">{t.getStarted}</h3>
          <p className="text-sm text-[#666666] mb-4">{t.getStartedDesc}</p>
          <button
            onClick={connectWallet}
            className="bg-[#111111] text-white px-6 py-3 font-bold border-2 border-[#111111] rounded-xl hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow"
          >
            {t.walletConnected}
          </button>
        </div>
      )}

      {account && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t-2 border-[#111111] flex z-40">
          {[
            { id: "home" as const, icon: Home, label: t.home },
            { id: "tasks" as const, icon: Clipboard, label: t.tasks },
            { id: "profile" as const, icon: User, label: t.profile },
            { id: "stats" as const, icon: TrendingUp, label: "STATS" },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentPage(tab.id)}
                className={`flex-1 py-3.5 flex flex-col items-center gap-1 ${
                  currentPage === tab.id ? "bg-[#FF99CC]" : ""
                }`}
              >
                {Icon && <Icon size={22} className={currentPage === tab.id ? "text-[#111111]" : "text-white"} />}
                <span className={`text-xs ${currentPage === tab.id ? "text-[#111111]" : "text-white"}`}>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      )}

      <CreateTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={createTask}
        loading={loading}
        tokenBalances={tokenBalances}
        language={language}
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
        language={language}
      />

      <Toast message={toastMessage} />
    </div>
  )
}

export default TheOfficeApp
