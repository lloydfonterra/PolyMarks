'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Zap, AlertCircle, Users } from 'lucide-react'
import DashboardHeader from '@/components/Dashboard/DashboardHeader'
import TradeFeed from '@/components/Dashboard/TradeFeed'
import Leaderboard from '@/components/Dashboard/Leaderboard'
import MetricsGrid from '@/components/Dashboard/MetricsGrid'

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('24h')
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-conviction-950 text-white">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Metrics */}
        <MetricsGrid period={selectedPeriod} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Trades */}
          <div className="lg:col-span-2">
            <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-conviction-800 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-whale-500" />
                    Live Whale Trades
                  </h2>
                  <p className="text-conviction-400 text-sm mt-1">Real-time large positions</p>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-conviction-800 border border-conviction-700 text-sm hover:bg-conviction-700 transition"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24h</option>
                  <option value="7d">Last 7d</option>
                </select>
              </div>

              {/* Trades List */}
              <TradeFeed />
            </div>
          </div>

          {/* Right Column - Metrics */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 p-6">
              <h3 className="font-bold mb-4">Market Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-conviction-400 text-sm">Whale Activity</span>
                    <span className="text-whale-500 font-semibold">↑ 23%</span>
                  </div>
                  <div className="w-full bg-conviction-800 rounded-full h-2">
                    <div className="bg-whale-500 h-2 rounded-full" style={{ width: '73%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-conviction-400 text-sm">Market Volume</span>
                    <span className="text-accent-green font-semibold">$2.4M</span>
                  </div>
                  <div className="w-full bg-conviction-800 rounded-full h-2">
                    <div className="bg-accent-green h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-conviction-400 text-sm">Avg Win Rate</span>
                    <span className="text-conviction-400 font-semibold">68.2%</span>
                  </div>
                  <div className="w-full bg-conviction-800 rounded-full h-2">
                    <div className="bg-conviction-400 h-2 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-accent-yellow" />
                Active Alerts
              </h3>
              <div className="space-y-3">
                {[
                  { emoji: '🐋', text: 'Whale detected in BTC market', time: '2m ago' },
                  { emoji: '📈', text: 'High conviction position opening', time: '5m ago' },
                  { emoji: '🔔', text: 'New cluster identified', time: '12m ago' },
                ].map((alert, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-conviction-800/50 hover:bg-conviction-800 transition text-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{alert.emoji}</span>
                      <div className="flex-1">
                        <div className="text-white">{alert.text}</div>
                        <div className="text-conviction-500 text-xs mt-1">{alert.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Leaderboard */}
        <div className="mt-8">
          <Leaderboard />
        </div>
      </main>
    </div>
  )
}
