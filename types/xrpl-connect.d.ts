declare module "xrpl-connect" {
  export interface RippleAccount {
    address: string
    publicKey?: string
    network: string
  }

  export interface SubmittedTransaction {
    hash: string
    [key: string]: unknown
  }

  export interface WalletAdapter {
    id: string
    name: string
    icon: string
    url: string
  }

  export interface WalletManagerOptions {
    adapters: WalletAdapter[]
    network?: string
    autoConnect?: boolean
    storage?: unknown
    logger?: unknown
  }

  export type WalletManagerEvent = "connect" | "disconnect" | "error" | "accountChanged"

  export class WalletManager {
    constructor(options: WalletManagerOptions)
    readonly wallets: WalletAdapter[]
    readonly account: RippleAccount | null
    readonly connected: boolean
    connect(walletId: string, options?: Record<string, unknown>): Promise<RippleAccount>
    disconnect(): Promise<void>
    reconnect(): Promise<RippleAccount | null>
    sign(tx: object): Promise<unknown>
    signAndSubmit(tx: object): Promise<SubmittedTransaction>
    on(event: WalletManagerEvent, handler: (...args: any[]) => void): void
    off(event: WalletManagerEvent, handler: (...args: any[]) => void): void
  }

  export class XamanAdapter implements WalletAdapter {
    id: string
    name: string
    icon: string
    url: string
    constructor(options?: { apiKey?: string })
  }

  export class CrossmarkAdapter implements WalletAdapter {
    id: string
    name: string
    icon: string
    url: string
    constructor(options?: Record<string, unknown>)
  }

  export class GemWalletAdapter implements WalletAdapter {
    id: string
    name: string
    icon: string
    url: string
    constructor(options?: Record<string, unknown>)
  }

  export class WalletConnectAdapter implements WalletAdapter {
    id: string
    name: string
    icon: string
    url: string
    constructor(options?: { projectId?: string })
  }

  export class LedgerAdapter implements WalletAdapter {
    id: string
    name: string
    icon: string
    url: string
    constructor(options?: Record<string, unknown>)
  }

  export class XyraAdapter implements WalletAdapter {
    id: string
    name: string
    icon: string
    url: string
    constructor(options?: Record<string, unknown>)
  }

  export class OtsuAdapter implements WalletAdapter {
    id: string
    name: string
    icon: string
    url: string
    constructor(options?: Record<string, unknown>)
  }
}
