"use client"

import { useEffect, useState } from "react"
import { useConnect, useConnectors } from "wagmi"

export function useMiniPayAutoConnect() {
  const connectors = useConnectors()
  const { connect } = useConnect()
  const [attempted, setAttempted] = useState(false)

  useEffect(() => {
    if (attempted || connectors.length === 0) return
    connect({ connector: connectors[0] })
    setAttempted(true)
  }, [connectors, connect, attempted])
}
