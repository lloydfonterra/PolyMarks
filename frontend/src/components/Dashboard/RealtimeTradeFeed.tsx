'use client'

import { useEffect, useState, useRef } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Trade } from '../../lib/api'
import { useWebSocketPrices } from '../../hooks/useWebSocketPrices'

interface RealtimeTradeFeedProps {
  apiUrl: string
  backendUrl: string
  refreshIntervalMs?: number
}

export default function RealtimeTradeFeed({ apiUrl, backendUrl, refreshIntervalMs = 2000 }: RealtimeTradeFeedProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [animatingIndices, setAnimatingIndices] = useState<Set<number>>(new Set())
  const [priceDirection, setPriceDirection] = useState<Map<string, 'up' | 'down'>>(new Map())
  const [wsConnected, setWsConnected] = useState(false)
  const prevTradesRef = useRef<Trade[]>([])
  
  // Use WebSocket for real-time prices
  const { prices: wsPrices, connected: wsConnected_ } = useWebSocketPrices(backendUrl)

  useEffect(() => {
    setWsConnected(wsConnected_)
  }, [wsConnected_])

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch(`${apiUrl}?limit=10`)
        if (!response.ok) return
        
        const data = await response.json()
        const newTrades = data.trades || []
        
        // Find indices that changed (new prices) and track direction
        const changedIndices = new Set<number>()
        const newDirections = new Map<string, 'up' | 'down'>(priceDirection)
        newTrades.forEach((trade: Trade, index: number) => {
          const prevTrade = prevTradesRef.current[index]
          if (prevTrade && prevTrade.price !== trade.price) {
            changedIndices.add(index)
            // Track price direction: up if new price > old price, down otherwise
            newDirections.set(trade.market, trade.price > prevTrade.price ? 'up' : 'down')
          }
        })
        
        if (changedIndices.size > 0) {
          setAnimatingIndices(changedIndices)
          setPriceDirection(newDirections)
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
      {wsConnected && (
        <div className="px-6 py-2 bg-accent-green/10 border-b border-accent-green/30 flex items-center gap-2">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
          <span className="text-xs text-accent-green font-semibold">WebSocket Connected - Live Streaming Active</span>
        </div>
      )}
      
      <table className="w-full text-sm">
        <thead className="bg-conviction-800/50 sticky top-0">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold text-conviction-400 uppercase">Wallet</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-conviction-400 uppercase">Market</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-conviction-400 uppercase">Type</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-conviction-400 uppercase">Size</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-conviction-400 uppercase">Price</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-conviction-400 uppercase">Conviction</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-conviction-400 uppercase">Time</th>
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
              <td className="px-3 py-2 font-mono text-xs text-conviction-300 w-24">{trade.wallet.substring(0, 10)}...</td>
              <td className="px-3 py-2 text-sm font-medium text-conviction-100 min-w-64">
                <a href={`https://polymarket.com/search?q=${trade.market}`} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-whale-400 transition">
                  {trade.market}
                </a>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  trade.type === 'buy' ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'
                }`}>
                  {trade.type}
                </span>
              </td>
              <td className={`px-3 py-2 whitespace-nowrap text-sm font-medium transition-all w-20 ${
                animatingIndices.has(index) ? 'volume-updated' : ''
              }`}>
                ${!isNaN(trade.size) ? (trade.size / 1000).toFixed(1) : '0.0'}k
              </td>
              <td className={`px-3 py-2 whitespace-nowrap text-sm font-bold transition-all w-24 ${
                animatingIndices.has(index) ? 'price-updated' : ''
              } ${
                !isNaN(trade.price) ? (
                  trade.price < 0.3 ? 'text-accent-green' : 
                  trade.price > 0.7 ? 'text-accent-red' : 
                  'text-accent-yellow'
                ) : 'text-conviction-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span>{!isNaN(trade.price) ? trade.price.toFixed(2) : '0.00'}¢</span>
                  {priceDirection.get(trade.market) === 'up' && (
                    <TrendingUp className="w-4 h-4 text-accent-green animate-bounce" />
                  )}
                  {priceDirection.get(trade.market) === 'down' && (
                    <TrendingDown className="w-4 h-4 text-accent-red animate-bounce" />
                  )}
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2 min-w-32">
                  <div className="w-16 bg-conviction-800 rounded-full h-2">
                    <div
                      className="bg-whale-500 h-2 rounded-full transition-all"
                      style={{ width: `${trade.conviction}%` }}
                    />
                  </div>
                  <span className="text-xs text-whale-400 w-12">{trade.conviction.toFixed(0)}%</span>
                </div>
              </td>
              <td className="px-3 py-2 text-xs text-conviction-500 w-24">{trade.time}</td>
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
