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
  title: "TheOffice - Web3 Task Management",
  description: "Complete tasks, earn cUSD, build your Web3 portfolio on Celo",
  generator: "v0.app",
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
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  other: {
    "fc:miniapp": "1",
    "fc:miniapp:name": "Balaio",
    "fc:miniapp:icon": "https://v0--balaio-q9.vercel.app/apple-icon.png",
    "fc:miniapp:splash:image": "https://v0--balaio-q9.vercel.app/apple-icon.png",
    "fc:miniapp:splash:background_color": "#EBDAD8",
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
