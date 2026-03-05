import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"

// Font class for monospace styling - using system fonts for reliability
const fontClass = "font-mono"

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
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * wss: ws:; img-src * data: blob:; style-src * 'unsafe-inline'; frame-src *;"
        />
      </head>
      <body className={`${fontClass} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
