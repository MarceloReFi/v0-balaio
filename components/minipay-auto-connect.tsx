"use client"

import { useEffect, useState } from "react"
import { isMiniPay } from "@/lib/minipay"
import { useMiniPayAutoConnect } from "@/hooks/use-minipay-auto-connect"

function MiniPayConnector() {
  useMiniPayAutoConnect()
  return null
}

export function MiniPayAutoConnect() {
  const [inMiniPay, setInMiniPay] = useState(false)

  useEffect(() => {
    setInMiniPay(isMiniPay())
  }, [])

  if (!inMiniPay) return null
  return <MiniPayConnector />
}
