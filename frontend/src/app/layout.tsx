import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Conviction - Smart Money Intelligence',
  description: 'Track whale traders, analyze conviction patterns, and follow high-conviction positions in real-time on Polymarket.',
  keywords: ['Polymarket', 'Prediction Markets', 'Whale Tracking', 'Smart Money', 'Trading Analytics'],
  openGraph: {
    title: 'Conviction',
    description: 'Smart Money Intelligence for Prediction Markets',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
