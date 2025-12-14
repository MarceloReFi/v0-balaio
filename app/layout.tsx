import type React from "react"
import type { Metadata, Viewport } from "next"
import { Courier_Prime } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
})

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
      <body className={`${courierPrime.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
