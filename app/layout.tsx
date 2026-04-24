import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/components/providers/web3-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Balaio - Web3 Task Management on Celo",
  description: "A simple task-management dapp for the Celo ecosystem",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="talentapp:project_verification" content="b33bca9d6fcd4219d19ad8e41816af8871693ed9c60779b82b97ca41771dd99ca1ceb01ee777eff90f5c6d02bdb89128220a67c5dd8a67016efcbe2f2c1cf0d7" />
      </head>
      <body className="antialiased">
        <Web3Provider>
          {children}
        </Web3Provider>
        <Analytics />
      </body>
    </html>
  )
}
