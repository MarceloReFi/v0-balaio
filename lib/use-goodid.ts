import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { IdentitySDK } from '@goodsdks/citizen-sdk'
export function useGoodID(address: string | undefined) {
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  const publicClient = usePublicClient()
  useEffect(() => {
    if (!address || !publicClient) {
      setIsVerified(false)
      setLoading(false)
      return
    }
    const checkVerification = async () => {
      try {
        const identitySDK = new IdentitySDK(publicClient, null, 'production')
        const { isWhitelisted } = await identitySDK.getWhitelistedRoot(address)
        setIsVerified(isWhitelisted)
      } catch (error) {
        console.error('GoodID verification check failed:', error)
        setIsVerified(false)
      } finally {
        setLoading(false)
      }
    }
    checkVerification()
  }, [address, publicClient])
  return { isVerified, loading }
}
