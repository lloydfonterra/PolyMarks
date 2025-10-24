'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Loader } from 'lucide-react'
import { fetchRecentTrades, Trade } from '../../lib/api'

export default function TradeFeed() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTrades = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchRecentTrades(10)
        setTrades(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trades')
      } finally {
        setIsLoading(false)
      }
    }

    loadTrades()
    
    // Refresh trades every 10 seconds
    const interval = setInterval(loadTrades, 10000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading && trades.length === 0) {
    return (
      <div className="px-6 py-12 flex items-center justify-center">
        <Loader className="w-6 h-6 text-whale-500 animate-spin" />
        <span className="ml-2 text-conviction-400">Loading trades...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 py-4 text-accent-red text-sm">
        Error loading trades: {error}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-conviction-800/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Wallet</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Market</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Size</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Conviction</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-conviction-400 uppercase">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-conviction-800">
          {trades.map((trade) => (
            <tr key={trade.id} className="hover:bg-conviction-800/30 transition">
              <td className="px-6 py-4 font-mono text-xs text-conviction-300">{trade.wallet}</td>
              <td className="px-6 py-4 text-conviction-200 line-clamp-1">{trade.market}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {trade.type === 'buy' ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-accent-green" />
                      <span className="text-accent-green font-semibold">BUY</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-accent-red" />
                      <span className="text-accent-red font-semibold">SELL</span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-conviction-200">${isNaN(trade.size / 1000) ? '0' : (trade.size / 1000).toFixed(1)}k</td>
              <td className="px-6 py-4 text-conviction-200">{isNaN(trade.price * 100) ? '0' : (trade.price * 100).toFixed(0)}¢</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-conviction-800 rounded-full h-2">
                    <div
                      className="bg-whale-500 h-2 rounded-full transition-all"
                      style={{ width: `${trade.conviction}%` }}
                    />
                  </div>
                  <span className="text-xs text-whale-400">{trade.conviction}%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-conviction-500">{trade.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {trades.length === 0 && !isLoading && (
        <div className="px-6 py-8 text-center text-conviction-400">
          No trades found
        </div>
      )}
    </div>
  )
}
