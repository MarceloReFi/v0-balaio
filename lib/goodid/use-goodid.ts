import { useEffect, useState } from 'react'
import { useChainId, usePublicClient } from 'wagmi'
import { zeroAddress, type Address } from 'viem'
import { chainConfigs, identityV2ABI, SupportedChains } from '@goodsdks/citizen-sdk'
import { celo } from '@reown/appkit/networks'

const IDENTITY_CONTRACT = chainConfigs[SupportedChains.CELO].contracts.production!.identityContract

export function useGoodID(address: string | undefined) {
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  const publicClient = usePublicClient()
  const chainId = useChainId()
  const supported = chainId === celo.id
  useEffect(() => {
    if (!address || !publicClient || !supported) {
      setIsVerified(false)
      setLoading(false)
      return
    }
    const checkVerification = async () => {
      try {
        const root = await publicClient.readContract({
          address: IDENTITY_CONTRACT,
          abi: identityV2ABI,
          functionName: 'getWhitelistedRoot',
          args: [address as Address],
        })
        setIsVerified(root !== zeroAddress)
      } catch (error) {
        console.error('GoodID verification check failed:', error)
        setIsVerified(false)
      } finally {
        setLoading(false)
      }
    }
    checkVerification()
  }, [address, publicClient, supported])
  return { isVerified, loading, supported }
}
