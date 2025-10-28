/**
 * ROOT LAYOUT
 * Wraps entire app
 */

import type { Metadata } from 'next'
import './globals.css'
import { ClientProviders } from '../components/ClientProviders'
import { FloatingXButton } from '../components/FloatingXButton'

export const metadata: Metadata = {
  title: 'PolyMarks | Smart Polymarket Analytics',
  description: "Don't bet blind. Track smart money movements on Polymarket.",
  keywords: 'polymarket, prediction markets, crypto betting, smart money',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <header className="app-header">
            <div className="container">
              <a href="/" className="logo">
                <h1>🎯 PolyMarks</h1>
              </a>
          <nav>
            <a href="/markets">Markets</a>
            <a href="/whales">🐋 Whales</a>
            <a href="/outliers">Smart Money</a>
            <a href="/about">About</a>
          </nav>
            </div>
          </header>

          <main className="app-main">
            {children}
          </main>

          <footer className="app-footer">
            <div className="container">
              <p>© 2025 PolyMarks | Pure Polymarket Analytics</p>
              <p className="tagline">Referral-based revenue | No trading, no risk</p>
            </div>
          </footer>

          {/* Floating X (Twitter) Button */}
          <FloatingXButton />
        </ClientProviders>
      </body>
    </html>
  )
}

