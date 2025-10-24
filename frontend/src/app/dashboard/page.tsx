'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Zap, AlertCircle, Users } from 'lucide-react'
import DashboardHeader from '@/components/Dashboard/DashboardHeader'
// import RealtimeTradeFeed from '@/components/Dashboard/RealtimeTradeFeed'
import LeaderboardLive from '@/components/Dashboard/LeaderboardLive'
import AlertsLive from '@/components/Dashboard/AlertsLive'
import MetricsGrid from '@/components/Dashboard/MetricsGrid'
import DashboardFilters from '@/components/Dashboard/DashboardFilters'

interface FilterOptions {
  convictionLevel: 'all' | 'high' | 'medium' | 'low'
  minConviction: number
  maxConviction: number
  volumeSpike: boolean
  sortBy: 'conviction' | 'volume' | 'price'
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('24h')
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    convictionLevel: 'all',
    minConviction: 0,
    maxConviction: 100,
    volumeSpike: false,
    sortBy: 'conviction'
  })

  return (
    <div className="min-h-screen bg-conviction-950 text-white">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Metrics */}
        <MetricsGrid />

        {/* Dashboard Filters & Views */}
        <DashboardFilters currentFilters={filters} onFiltersChange={setFilters} />

        {/* Polymarket Link Button */}
        <div className="mt-6 flex justify-end">
          <a
            href="https://polymarket.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-whale-500 to-whale-600 hover:from-whale-600 hover:to-whale-700 text-white font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <span>🎯</span>
            Trade on Polymarket
            <span>→</span>
          </a>
        </div>

        {/* Main Grid - Full Width for Better Display */}
        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* Full Width - Trades Section */}
          <div className="w-full">
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

              {/* Trades List - Real-time updates every 2 seconds */}
              {/* <RealtimeTradeFeed 
                apiUrl="https://polymarks-production.up.railway.app/api/trades/recent" 
                backendUrl="https://polymarks-production.up.railway.app"
                refreshIntervalMs={2000} 
              /> */}
            </div>
          </div>
        </div>

        {/* Market Trending & New Markets Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Market Trending */}
          <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-conviction-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-green" />
                Market Trending
              </h3>
              <p className="text-conviction-400 text-sm mt-1">Most volume in last 24h</p>
            </div>
            <div className="px-6 py-4 space-y-3 max-h-80 overflow-y-auto">
              <div className="flex items-center justify-between p-3 bg-conviction-800/30 rounded-lg hover:bg-conviction-800/50 transition cursor-pointer">
                <div className="flex-1">
                  <p className="font-semibold text-conviction-100 text-sm">Politics Markets</p>
                  <p className="text-conviction-400 text-xs mt-1">Highest volume category</p>
                </div>
                <span className="text-accent-green font-bold">📈</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-conviction-800/30 rounded-lg hover:bg-conviction-800/50 transition cursor-pointer">
                <div className="flex-1">
                  <p className="font-semibold text-conviction-100 text-sm">Sports Events</p>
                  <p className="text-conviction-400 text-xs mt-1">Real-time odds trading</p>
                </div>
                <span className="text-accent-green font-bold">📈</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-conviction-800/30 rounded-lg hover:bg-conviction-800/50 transition cursor-pointer">
                <div className="flex-1">
                  <p className="font-semibold text-conviction-100 text-sm">Finance Markets</p>
                  <p className="text-conviction-400 text-xs mt-1">Economic predictions</p>
                </div>
                <span className="text-accent-green font-bold">📈</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-conviction-800/30 rounded-lg hover:bg-conviction-800/50 transition cursor-pointer">
                <div className="flex-1">
                  <p className="font-semibold text-conviction-100 text-sm">Tech & Crypto</p>
                  <p className="text-conviction-400 text-xs mt-1">Emerging technologies</p>
                </div>
                <span className="text-whale-400 font-bold">📊</span>
              </div>
              <div className="pt-2">
                <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-whale-500/20 hover:bg-whale-500/30 text-whale-400 transition text-sm font-medium">
                  View All Trending →
                </a>
              </div>
            </div>
          </div>

          {/* New Markets */}
          <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-conviction-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-whale-500" />
                New Markets
              </h3>
              <p className="text-conviction-400 text-sm mt-1">Recently launched</p>
            </div>
            <div className="px-6 py-4 space-y-3 max-h-80 overflow-y-auto">
              <div className="flex items-center justify-between p-3 bg-conviction-800/30 rounded-lg hover:bg-conviction-800/50 transition cursor-pointer">
                <div className="flex-1">
                  <p className="font-semibold text-conviction-100 text-sm">🆕 Ireland Election 2025</p>
                  <p className="text-conviction-400 text-xs mt-1">94% chance outcomes</p>
                </div>
                <span className="text-accent-green font-bold">NEW</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-conviction-800/30 rounded-lg hover:bg-conviction-800/50 transition cursor-pointer">
                <div className="flex-1">
                  <p className="font-semibold text-conviction-100 text-sm">🆕 Netherlands Parliament</p>
                  <p className="text-conviction-400 text-xs mt-1">77% forecast probability</p>
                </div>
                <span className="text-accent-green font-bold">NEW</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-conviction-800/30 rounded-lg hover:bg-conviction-800/50 transition cursor-pointer">
                <div className="flex-1">
                  <p className="font-semibold text-conviction-100 text-sm">🆕 Trump Malaysia Visit</p>
                  <p className="text-conviction-400 text-xs mt-1">66% prediction market</p>
                </div>
                <span className="text-accent-green font-bold">NEW</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-conviction-800/30 rounded-lg hover:bg-conviction-800/50 transition cursor-pointer">
                <div className="flex-1">
                  <p className="font-semibold text-conviction-100 text-sm">🆕 Gaza Humanitarian</p>
                  <p className="text-conviction-400 text-xs mt-1">Real-time updates</p>
                </div>
                <span className="text-whale-400 font-bold">HOT</span>
              </div>
              <div className="pt-2">
                <a href="https://polymarket.com/new" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-whale-500/20 hover:bg-whale-500/30 text-whale-400 transition text-sm font-medium">
                  Explore New Markets →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Metrics & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
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
          <AlertsLive />

          {/* Spacer */}
          <div></div>
        </div>

        {/* Bottom Section - Leaderboard */}
        <div className="mt-8">
          <LeaderboardLive />
        </div>
      </main>
    </div>
  )
}
