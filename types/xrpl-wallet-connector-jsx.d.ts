import type * as React from "react"

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "xrpl-wallet-connector": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        wallets?: string
        "primary-wallet"?: string
      }
    }
  }
}
