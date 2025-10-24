'use client'

import Link from 'next/link'
import { Menu, Bell, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-conviction-900/80 backdrop-blur-md border-b border-conviction-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-conviction-400 to-whale-500 bg-clip-text text-transparent">
            🎯 Conviction
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-white hover:text-conviction-300 transition font-medium">
              Dashboard
            </Link>
            <Link href="/wallets" className="text-conviction-300 hover:text-white transition">
              Wallets
            </Link>
            <Link href="/leaderboard" className="text-conviction-300 hover:text-white transition">
              Leaderboard
            </Link>
            <Link href="/alerts" className="text-conviction-300 hover:text-white transition">
              Alerts
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-conviction-800 rounded-lg transition">
              <Bell className="w-5 h-5 text-conviction-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full animate-pulse" />
            </button>

            {/* Settings */}
            <button className="p-2 hover:bg-conviction-800 rounded-lg transition">
              <Settings className="w-5 h-5 text-conviction-300" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-conviction-500 to-whale-500 flex items-center justify-center text-sm font-bold hover:opacity-80 transition"
              >
                U
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-conviction-900 rounded-lg border border-conviction-800 shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-conviction-800">
                    <p className="text-sm font-medium">User</p>
                    <p className="text-xs text-conviction-400">user@example.com</p>
                  </div>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-conviction-800 transition text-sm"
                  >
                    Settings
                  </Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-conviction-800 transition text-sm flex items-center gap-2 text-accent-red">
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button className="md:hidden p-2 hover:bg-conviction-800 rounded-lg transition">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
