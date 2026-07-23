"use client"

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, type CSSProperties } from "react"
import "xrpl-connect"
import { rippleWalletManager } from "@/lib/xrpl/wallet-manager"

const SUPPORTED_WALLETS = "xaman,crossmark,gemwallet,walletconnect,ledger,xyra,otsu"

const CONNECTOR_STYLE = {
  "--xc-primary-color": "var(--secondary)",
  "--xc-focus-color": "var(--secondary)",
  "--xc-primary-button-background": "var(--primary-container)",
  "--xc-primary-button-color": "var(--on-primary)",
  "--xc-background-color": "var(--surface)",
  "--xc-background-secondary": "var(--surface-container-low)",
  "--xc-background-tertiary": "var(--surface-container)",
  "--xc-modal-background": "var(--surface-container)",
  "--xc-text-color": "var(--on-surface)",
  "--xc-text-muted-color": "var(--on-surface-variant)",
  "--xc-border-radius": "var(--radius-lg)",
  "--xc-modal-border-radius": "var(--radius-xl)",
  "--xc-danger-color": "var(--error)",
  "--xc-font-family": "var(--font-body)",
} as CSSProperties

export interface RippleWalletConnectorHandle {
  open: () => void
}

interface RippleWalletConnectorProps {
  onConnected?: (account: string) => void
  onDisconnected?: () => void
  onError?: (error: unknown) => void
  /**
   * next/dynamic's ssr:false wrapper consumes the forwarded ref for its own
   * retry API, so a ref passed through it never reaches this component.
   * Callers rendering RippleWalletConnector via next/dynamic should use this
   * callback instead of `ref` to obtain the imperative handle.
   */
  onReady?: (handle: RippleWalletConnectorHandle) => void
}

type XrplWalletConnectorElement = HTMLElement & {
  setWalletManager: (manager: typeof rippleWalletManager) => void
  open: () => void
}

export const RippleWalletConnector = forwardRef<RippleWalletConnectorHandle, RippleWalletConnectorProps>(
  function RippleWalletConnector({ onConnected, onDisconnected, onError, onReady }, ref) {
    const elementRef = useRef<XrplWalletConnectorElement | null>(null)

    const handle = useMemo<RippleWalletConnectorHandle>(
      () => ({ open: () => elementRef.current?.open() }),
      [],
    )

    useImperativeHandle(ref, () => handle, [handle])

    useEffect(() => {
      onReady?.(handle)
    }, [handle, onReady])

    useEffect(() => {
      elementRef.current?.setWalletManager(rippleWalletManager)
    }, [])

    useEffect(() => {
      const handleConnect = (account: { address: string }) => onConnected?.(account.address)
      const handleDisconnect = () => onDisconnected?.()
      const handleError = (error: unknown) => onError?.(error)

      rippleWalletManager.on("connect", handleConnect)
      rippleWalletManager.on("disconnect", handleDisconnect)
      rippleWalletManager.on("error", handleError)

      return () => {
        rippleWalletManager.off("connect", handleConnect)
        rippleWalletManager.off("disconnect", handleDisconnect)
        rippleWalletManager.off("error", handleError)
      }
    }, [onConnected, onDisconnected, onError])

    return <xrpl-wallet-connector ref={elementRef} wallets={SUPPORTED_WALLETS} style={CONNECTOR_STYLE} />
  },
)

export default RippleWalletConnector
