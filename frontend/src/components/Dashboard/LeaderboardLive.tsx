'use client'

import { useEffect, useState } from 'react'
import { Trophy, TrendingUp, TrendingDown, Loader, Zap } from 'lucide-react'
import { fetchTopLeaderboard, Trader } from '../../lib/api'

export default function LeaderboardLive() {
  const [traders, setTraders] = useState<Trader[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [animatingIndices, setAnimatingIndices] = useState<Set<number>>(new Set())

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchTopLeaderboard(10)
        
        // Detect which rows changed for animation
        const changedIndices = new Set<number>()
        data.forEach((trader, index) => {
          const prevTrader = traders[index]
          if (prevTrader && (prevTrader.roi !== trader.roi || prevTrader.rank !== trader.rank)) {
            changedIndices.add(index)
          }
        })
        
        if (changedIndices.size > 0) {
          setAnimatingIndices(changedIndices)
          setTimeout(() => setAnimatingIndices(new Set()), 600)
        }
        
        setTraders(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()
    
    // Refresh leaderboard every 5 seconds for LIVE updates
    const interval = setInterval(loadLeaderboard, 5000)
    return () => clearInterval(interval)
  }, [traders])

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
        <span className="ml-2 text-conviction-400">Loading top traders...</span>
      </div>
    )
  }

  return (
    <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-conviction-800 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-accent-yellow" />
        <h2 className="text-xl font-bold">Top Traders</h2>
        <Zap className="w-4 h-4 text-cyan-400 ml-auto animate-pulse" />
        <p className="text-conviction-400 text-xs">Live</p>
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
            {traders.map((trader, index) => (
              <tr
                key={trader.address}
                className={`transition-all ${
                  animatingIndices.has(index) ? 'bg-whale-500/10 animate-pulse' : 'hover:bg-conviction-800/30'
                } ${
                  trader.rank === 1 ? 'border-l-4 border-accent-yellow' : 
                  trader.rank === 2 ? 'border-l-4 border-gray-400' :
                  trader.rank === 3 ? 'border-l-4 border-orange-500' :
                  'border-l-4 border-transparent'
                }`}
              >
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
                        className="h-full bg-accent-green rounded-full transition-all"
                        style={{ width: `${Math.min(trader.winRate, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{trader.winRate.toFixed(1)}%</span>
                  </div>
                </td>
                <td className={`px-6 py-4 font-bold transition-all ${
                  animatingIndices.has(index) ? 'text-accent-yellow scale-110' : ''
                } ${trader.roi > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  {trader.roi > 0 ? '+' : ''}{trader.roi.toFixed(1)}%
                </td>
                <td className="px-6 py-4 text-white font-semibold">
                  ${(trader.volume / 1000000).toFixed(2)}M
                </td>
                <td className="px-6 py-4 text-conviction-300">{trader.trades}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {trader.trend === 'up' ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-accent-green animate-bounce" />
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
