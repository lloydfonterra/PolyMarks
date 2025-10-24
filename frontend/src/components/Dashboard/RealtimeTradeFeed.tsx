'use client'

import { useEffect, useState, useRef } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Trade } from '../../lib/api'

interface RealtimeTradeFeedProps {
  apiUrl: string
  refreshIntervalMs?: number
}

export default function RealtimeTradeFeed({ apiUrl, refreshIntervalMs = 2000 }: RealtimeTradeFeedProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [animatingIndices, setAnimatingIndices] = useState<Set<number>>(new Set())
  const prevTradesRef = useRef<Trade[]>([])

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch(`${apiUrl}?limit=10`)
        if (!response.ok) return
        
        const data = await response.json()
        const newTrades = data.trades || []
        
        // Find indices that changed (new prices)
        const changedIndices = new Set<number>()
        newTrades.forEach((trade: Trade, index: number) => {
          const prevTrade = prevTradesRef.current[index]
          if (prevTrade && prevTrade.price !== trade.price) {
            changedIndices.add(index)
          }
        })
        
        if (changedIndices.size > 0) {
          setAnimatingIndices(changedIndices)
          setTimeout(() => setAnimatingIndices(new Set()), 600)
        }
        
        setTrades(newTrades)
        prevTradesRef.current = newTrades
      } catch (error) {
        console.error('Real-time update failed:', error)
      }
    }

    fetchTrades()
    const interval = setInterval(fetchTrades, refreshIntervalMs)
    
    return () => clearInterval(interval)
  }, [apiUrl, refreshIntervalMs])

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-conviction-800/50 sticky top-0">
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
          {trades.map((trade, index) => (
            <tr
              key={trade.id}
              className={`hover:bg-conviction-800/30 transition ${
                animatingIndices.has(index) ? 'animate-pulse' : ''
              }`}
            >
              <td className="px-6 py-4 font-mono text-xs text-conviction-300">{trade.wallet.substring(0, 10)}...</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-conviction-100 truncate max-w-xs">{trade.market}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  trade.type === 'buy' ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'
                }`}>
                  {trade.type}
                </span>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium transition-all ${
                animatingIndices.has(index) ? 'volume-updated' : ''
              }`}>
                ${!isNaN(trade.size) ? (trade.size / 1000).toFixed(1) : '0.0'}k
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold transition-all ${
                animatingIndices.has(index) ? 'price-updated' : ''
              } ${
                !isNaN(trade.price) ? (
                  trade.price < 0.3 ? 'text-accent-green' : 
                  trade.price > 0.7 ? 'text-accent-red' : 
                  'text-accent-yellow'
                ) : 'text-conviction-200'
              }`}>
                {!isNaN(trade.price) ? trade.price.toFixed(2) : '0.00'}¢
              </td>
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

      {trades.length === 0 && (
        <div className="px-6 py-8 text-center text-conviction-400">
          No trades found
        </div>
      )}
    </div>
  )
}
