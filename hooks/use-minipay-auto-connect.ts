"use client"

import { useEffect, useState } from "react"
import { useConnect, useConnectors } from "wagmi"
import { isMiniPay } from "@/lib/minipay"

export function useMiniPayAutoConnect() {
  const connectors = useConnectors()
  const { connect } = useConnect()
  const [attempted, setAttempted] = useState(false)

  useEffect(() => {
    if (attempted || connectors.length === 0) return
    const injected = connectors.find(c => c.id === 'injected')
    if (!injected || !isMiniPay()) return
    connect({ connector: injected })
    setAttempted(true)
  }, [connectors, connect, attempted])
}
