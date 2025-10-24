'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Zap, AlertCircle, Users } from 'lucide-react'
import DashboardHeader from '@/components/Dashboard/DashboardHeader'
import LeaderboardLive from '@/components/Dashboard/LeaderboardLive'
import AlertsLive from '@/components/Dashboard/AlertsLive'
import MetricsGrid from '@/components/Dashboard/MetricsGrid'
import DashboardFilters from '@/components/Dashboard/DashboardFilters'

interface Market {
  id: string
  question: string
  volume: number
  price: number
  status: string
  description: string
}

interface TrendingData {
  trending: {
    [key: string]: any[]
  }
  count: number
  timestamp: string
}

interface NewMarketsData {
  new_markets: Market[]
  count: number
  timestamp: string
}

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
  const [trendingData, setTrendingData] = useState<TrendingData | null>(null)
  const [newMarketsData, setNewMarketsData] = useState<NewMarketsData | null>(null)

  // Fetch trending and new markets
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Use hardcoded mock data directly (no API calls for now)
        const trendingMockData = {
          trending: {
            "Politics Markets": [
              {"id": "pol1", "question": "Will Trump win 2024?", "volume_24h": 1500000, "price": 0.65},
              {"id": "pol2", "question": "Who will win UK election?", "volume_24h": 1200000, "price": 0.55}
            ],
            "Sports Events": [
              {"id": "sport1", "question": "Will Chiefs win Super Bowl?", "volume_24h": 2000000, "price": 0.72},
              {"id": "sport2", "question": "Will Mahomes throw 300+ yards?", "volume_24h": 800000, "price": 0.58}
            ],
            "Finance Markets": [
              {"id": "fin1", "question": "Will Fed raise rates?", "volume_24h": 950000, "price": 0.42},
              {"id": "fin2", "question": "Will inflation hit 4%?", "volume_24h": 750000, "price": 0.35}
            ],
            "Tech & Crypto": [
              {"id": "tech1", "question": "Will BTC reach $100k?", "volume_24h": 3500000, "price": 0.68},
              {"id": "tech2", "question": "Will ETH reach $5k?", "volume_24h": 2800000, "price": 0.52}
            ],
            "Other": []
          },
          count: 8,
          data_source: "mock",
          real_data: false,
          timestamp: new Date().toISOString()
        }
        
        const newMarketsMockData = {
          new_markets: [
            {"id": "new1", "question": "Ireland Election 2025", "volume": 450000, "price": 0.94, "status": "NEW", "description": "Ireland Election 2025"},
            {"id": "new2", "question": "Netherlands Parliament 2025", "volume": 380000, "price": 0.77, "status": "NEW", "description": "Netherlands Parliament 2025"},
            {"id": "new3", "question": "Trump Malaysia Visit", "volume": 290000, "price": 0.66, "status": "NEW", "description": "Trump Malaysia Visit"},
            {"id": "new4", "question": "Gaza Humanitarian Crisis", "volume": 580000, "price": 0.45, "status": "HOT", "description": "Gaza Humanitarian Crisis"}
          ],
          count: 4,
          data_source: "mock",
          real_data: false,
          timestamp: new Date().toISOString()
        }
        
        setTrendingData(trendingMockData)
        setNewMarketsData(newMarketsMockData)
      } catch (error) {
        console.error('Error setting market data:', error)
      }
    }

    // Initial fetch
    fetchMarketData()

    // Set up auto-refresh every 2 seconds
    const interval = setInterval(fetchMarketData, 2000)

    return () => clearInterval(interval)
  }, [])

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
            </div>
          </div>
        </div>

        {/* Market Trending & New Markets Section - Real-Time */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Market Trending */}
          <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 overflow-hidden animate-pulse-slow">
            <div className="px-6 py-4 border-b border-conviction-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-green" />
                Market Trending
              </h3>
              <p className="text-conviction-400 text-sm mt-1">Most volume in last 24h (Updates every 2s)</p>
            </div>
            <div className="px-6 py-4 space-y-3 max-h-80 overflow-y-auto">
              {trendingData?.trending ? (
                Object.entries(trendingData.trending).map(([category, markets]: [string, any]) => 
                  markets.length > 0 && (
                    <div key={category} className="flex items-center justify-between p-3 bg-conviction-800/30 rounded-lg hover:bg-conviction-800/50 transition cursor-pointer">
                      <div className="flex-1">
                        <p className="font-semibold text-conviction-100 text-sm">{category}</p>
                        <p className="text-conviction-400 text-xs mt-1">${(markets[0]?.volume_24h / 1000000).toFixed(2)}M volume</p>
                      </div>
                      <span className="text-accent-green font-bold">📈</span>
                    </div>
                  )
                )
              ) : (
                <div className="text-center py-8 text-conviction-400">
                  Loading trending markets...
                </div>
              )}
              <div className="pt-2">
                <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-whale-500/20 hover:bg-whale-500/30 text-whale-400 transition text-sm font-medium">
                  View All Trending →
                </a>
              </div>
            </div>
          </div>

          {/* New Markets */}
          <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 overflow-hidden animate-pulse-slow">
            <div className="px-6 py-4 border-b border-conviction-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-whale-500" />
                New Markets
              </h3>
              <p className="text-conviction-400 text-sm mt-1">Recently launched (Updates every 2s)</p>
            </div>
            <div className="px-6 py-4 space-y-3 max-h-80 overflow-y-auto">
              {newMarketsData?.new_markets ? (
                newMarketsData.new_markets.map((market, idx) => (
                  <div key={market.id || idx} className="flex items-center justify-between p-3 bg-conviction-800/30 rounded-lg hover:bg-conviction-800/50 transition cursor-pointer">
                    <div className="flex-1">
                      <p className="font-semibold text-conviction-100 text-sm truncate">🆕 {market.question.substring(0, 40)}</p>
                      <p className="text-conviction-400 text-xs mt-1">${(market.volume / 1000000).toFixed(2)}M volume</p>
                    </div>
                    <span className={`font-bold text-xs ${market.status === 'HOT' ? 'text-accent-red' : 'text-accent-green'}`}>
                      {market.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-conviction-400">
                  Loading new markets...
                </div>
              )}
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
