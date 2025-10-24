'use client'

import { useEffect, useState } from 'react'
import { Trophy, TrendingUp, TrendingDown, Loader } from 'lucide-react'
import { fetchTopLeaderboard, Trader } from '../../lib/api'

export default function Leaderboard() {
  const [traders, setTraders] = useState<Trader[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchTopLeaderboard(10)
        setTraders(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()
    
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(loadLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [])

  const getMedalEmoji = (rank: number) => {
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

  if (isLoading && traders.length === 0) {
    return (
      <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 overflow-hidden p-12 flex items-center justify-center">
        <Loader className="w-6 h-6 text-whale-500 animate-spin" />
        <span className="ml-2 text-conviction-400">Loading leaderboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 overflow-hidden p-6 text-accent-red text-sm">
        Error loading leaderboard: {error}
      </div>
    )
  }

  return (
    <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-conviction-800 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-accent-yellow" />
        <h2 className="text-xl font-bold">Top Traders</h2>
        <p className="text-conviction-400 text-sm ml-auto">This week</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-conviction-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Trader</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Win Rate</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">ROI</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Volume</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Trades</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Trend</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-conviction-800">
            {traders.map((trader) => (
              <tr key={trader.address} className="hover:bg-conviction-800/30 transition">
                <td className="px-6 py-4">
                  <div className="text-lg font-bold">{getMedalEmoji(trader.rank)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{trader.name}</span>
                    <span className="text-xs font-mono text-conviction-400">{trader.address}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-conviction-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-green rounded-full"
                        style={{ width: `${Math.min(trader.winRate, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{trader.winRate.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={trader.roi > 0 ? 'text-accent-green font-semibold' : 'text-accent-red font-semibold'}>
                    {trader.roi > 0 ? '+' : ''}{trader.roi.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-white font-semibold">
                  ${(trader.volume / 1000000).toFixed(2)}M
                </td>
                <td className="px-6 py-4 text-conviction-300">{trader.trades}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {trader.trend === 'up' ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-accent-green" />
                        <span className="text-xs text-accent-green font-semibold">UP</span>
                      </>
                    ) : trader.trend === 'down' ? (
                      <>
                        <TrendingDown className="w-4 h-4 text-accent-red" />
                        <span className="text-xs text-accent-red font-semibold">DOWN</span>
                      </>
                    ) : (
                      <span className="text-xs text-conviction-400 font-semibold">→</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1 rounded-lg bg-whale-600/20 border border-whale-500 text-whale-400 hover:bg-whale-600/40 transition text-xs font-semibold">
                    Follow
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {traders.length === 0 && !isLoading && (
          <div className="px-6 py-8 text-center text-conviction-400">
            No traders found
          </div>
        )}
      </div>
    </div>
  )
}
