'use client'

import { useEffect, useState } from 'react'
import { Trophy, TrendingUp, Users } from 'lucide-react'

interface Trader {
  rank: number
  address: string
  name: string
  winRate: number
  roi: number
  volume: number
  trades: number
  trend: 'UP' | 'DOWN' | 'STABLE'
  conviction: number
  totalConviction: number
}

interface LeaderboardLiveProps {
  apiUrl?: string
}

export default function LeaderboardLive({ apiUrl = 'https://polymarks-production.up.railway.app/api/leaderboard/top' }: LeaderboardLiveProps) {
  const [traders, setTraders] = useState<Trader[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('24h')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${apiUrl}?limit=10`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const apiData = await response.json()
        const rawTraders = Array.isArray(apiData) ? apiData : apiData.traders || []
        
        const traders = rawTraders
          .filter((t: any) => t?.name && typeof t.volume === 'number')
          .map((r: any) => ({
            rank: r.rank || 0,
            address: r.address || r.name || 'Unknown',
            name: r.name || 'Trader',
            winRate: r.winRate || 0.6,
            roi: r.roi || 0,
            volume: r.volume || 0,
            trades: r.trades || 50,
            trend: (r.trend || 'UP') as 'UP' | 'DOWN' | 'STABLE',
            conviction: r.conviction || 50,
            totalConviction: Math.min(100, Math.max(0, r.conviction || 50)),
          }))
        
        if (traders.length === 0) throw new Error('Empty response')
        setTraders(traders)
        setLoading(false)
      } catch (error) {
        console.warn('Falling back to demo traders:', error)
        setTraders([
          { rank: 1, address: '0x1ff26...DBBD', name: 'Whale Trader #1', winRate: 0.78, roi: 0.114, volume: 12916390, trades: 156, trend: 'UP', conviction: 92, totalConviction: 92 },
          { rank: 2, address: '0xsetsu...2027', name: 'setsukoworldchampion2027', winRate: 0.73, roi: 0.120, volume: 10819700, trades: 142, trend: 'UP', conviction: 87, totalConviction: 87 },
          { rank: 3, address: '0xprimm...xxxx', name: 'primm', winRate: 0.70, roi: 0.140, volume: 8774627, trades: 128, trend: 'UP', conviction: 82, totalConviction: 82 },
          { rank: 4, address: '0xDill...ilius', name: 'Dillius', winRate: 0.68, roi: 0.021, volume: 57860067, trades: 115, trend: 'STABLE', conviction: 78, totalConviction: 78 },
          { rank: 5, address: '0xMay...varma', name: 'Mayuravarma', winRate: 0.65, roi: 0.179, volume: 6214495, trades: 98, trend: 'UP', conviction: 72, totalConviction: 72 },
        ])
        setLoading(false)
      }
    }

    fetchLeaderboard()
    // Re-fetch every 60 seconds
    const interval = setInterval(fetchLeaderboard, 60000)
    return () => clearInterval(interval)
  }, [apiUrl, period])

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'UP':
        return 'text-accent-green'
      case 'DOWN':
        return 'text-accent-red'
      case 'STABLE':
        return 'text-accent-yellow'
      default:
        return 'text-conviction-400'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP':
        return '📈'
      case 'DOWN':
        return '📉'
      case 'STABLE':
        return '➡️'
      default:
        return '•'
    }
  }

  if (loading) {
    return (
      <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 p-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-whale-500" />
          <h2 className="font-bold text-conviction-100">Loading leaderboard...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-conviction-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-whale-500" />
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Traders
            </h2>
            <p className="text-conviction-400 text-sm mt-1">Leaderboard by conviction & ROI</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-conviction-800/50 rounded-lg p-1">
          {['1h', '24h', '7d', '30d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                period === p
                  ? 'bg-whale-500 text-white'
                  : 'text-conviction-400 hover:text-conviction-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 ml-4">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
          <span className="text-xs text-accent-green font-semibold">Live</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-conviction-800/30 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Trader</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Win Rate</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">ROI</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Volume</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Trades</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Trend</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Conviction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-conviction-800">
            {traders.map((trader, idx) => (
              <tr
                key={trader.address}
                className={`hover:bg-conviction-800/30 transition ${
                  trader.rank <= 3 ? 'bg-conviction-800/20' : ''
                }`}
              >
                <td className="px-6 py-4 font-bold text-lg">{getRankMedal(trader.rank)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-whale-500 to-accent-purple flex items-center justify-center text-xs font-bold">
                      {trader.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-conviction-100">{trader.name}</p>
                      <p className="text-xs text-conviction-500 font-mono">
                        {trader.address.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-conviction-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          trader.winRate > 0.7
                            ? 'bg-accent-green'
                            : trader.winRate > 0.6
                            ? 'bg-accent-yellow'
                            : 'bg-accent-red'
                        }`}
                        style={{ width: `${trader.winRate * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold w-10">{(trader.winRate * 100).toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${trader.roi > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {trader.roi > 0 ? '+' : ''}{(trader.roi * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  ${(trader.volume / 1000000).toFixed(2)}M
                </td>
                <td className="px-6 py-4 text-sm font-medium">{trader.trades}</td>
                <td className="px-6 py-4">
                  <span className={`text-lg ${getTrendColor(trader.trend)}`}>
                    {getTrendIcon(trader.trend)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="w-16 bg-conviction-800 rounded-full h-2">
                        <div
                          className="bg-whale-500 h-2 rounded-full transition-all"
                          style={{ width: `${trader.totalConviction}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-whale-400 w-8">
                      {trader.totalConviction}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 bg-conviction-950/50 border-t border-conviction-800 grid grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-conviction-500 mb-1">Avg Win Rate</p>
          <p className="font-bold text-accent-green">
            {((traders.reduce((sum, t) => sum + t.winRate, 0) / traders.length) * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-conviction-500 mb-1">Avg ROI</p>
          <p className="font-bold text-accent-green">
            +{((traders.reduce((sum, t) => sum + t.roi, 0) / traders.length) * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-conviction-500 mb-1">Total Volume</p>
          <p className="font-bold text-whale-400">
            ${(traders.reduce((sum, t) => sum + t.volume, 0) / 1000000).toFixed(1)}M
          </p>
        </div>
        <div>
          <p className="text-xs text-conviction-500 mb-1">Total Trades</p>
          <p className="font-bold text-whale-400">
            {traders.reduce((sum, t) => sum + t.trades, 0)}
          </p>
        </div>
      </div>
    </div>
  )
}
