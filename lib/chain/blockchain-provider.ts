import { ethers } from "ethers"

const RPC_ENDPOINTS = [
  "https://forno.celo.org",
  "https://rpc.ankr.com/celo",
]

export async function getProvider(): Promise<ethers.JsonRpcProvider> {
  for (const rpc of RPC_ENDPOINTS) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc)
      await provider.getBlockNumber()
      return provider
    } catch {
      continue
    }
  }
  throw new Error("All RPC endpoints failed")
}

export async function retryQuery<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
  throw new Error("Max retries exceeded")
}
