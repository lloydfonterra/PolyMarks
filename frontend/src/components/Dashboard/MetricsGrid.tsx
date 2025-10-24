'use client'

import { useEffect, useState } from 'react'
import { Activity, TrendingUp, Zap, BarChart3, Loader } from 'lucide-react'
import { fetchMetrics, Metrics } from '../../lib/api'

export default function MetricsGrid() {
  const [metrics, setMetrics] = useState<Metrics>({
    whale_trades: 0,
    whale_trades_change: 0,
    avg_win_rate: 0,
    avg_win_rate_change: 0,
    active_wallets: 0,
    active_wallets_change: 0,
    market_volume: 0,
    market_volume_change: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        console.log('Starting to fetch metrics...')
        const API_URL = 'https://polymarks-production.up.railway.app/api/health/status'
        console.log('Fetching from:', API_URL)
        
        const response = await fetch(API_URL)
        console.log('Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('API Response:', data)
          setMetrics({
            whale_trades: data.whale_trades || 0,
            whale_trades_change: data.whale_trades_change || 0,
            avg_win_rate: data.avg_win_rate || 0,
            avg_win_rate_change: data.avg_win_rate_change || 0,
            active_wallets: data.active_wallets || 0,
            active_wallets_change: data.active_wallets_change || 0,
            market_volume: data.market_volume || 0,
            market_volume_change: data.market_volume_change || 0,
          })
        } else {
          console.error('API returned status:', response.status)
        }
      } catch (error) {
        console.error('Error fetching metrics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
    // Refresh every 30 seconds
    const interval = setInterval(loadMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const metricConfigs = [
    {
      icon: Zap,
      label: 'Whale Trades',
      key: 'whale_trades' as const,
      changeKey: 'whale_trades_change' as const,
      color: 'text-whale-500',
      format: (v: number) => v.toString(),
    },
    {
      icon: TrendingUp,
      label: 'Avg Win Rate',
      key: 'avg_win_rate' as const,
      changeKey: 'avg_win_rate_change' as const,
      color: 'text-accent-green',
      format: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      icon: Activity,
      label: 'Active Wallets',
      key: 'active_wallets' as const,
      changeKey: 'active_wallets_change' as const,
      color: 'text-conviction-400',
      format: (v: number) => v.toLocaleString(),
    },
    {
      icon: BarChart3,
      label: 'Market Volume',
      key: 'market_volume' as const,
      changeKey: 'market_volume_change' as const,
      color: 'text-conviction-300',
      format: (v: number) => `$${(v / 1000000).toFixed(1)}M`,
    },
  ]

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricConfigs.map((_, idx) => (
          <div
            key={idx}
            className="bg-conviction-900/50 rounded-xl border border-conviction-800 p-6 animate-pulse"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-6 h-6 bg-conviction-800 rounded" />
              <div className="w-12 h-4 bg-conviction-800 rounded" />
            </div>
            <div className="w-20 h-3 bg-conviction-800 rounded mb-2" />
            <div className="w-16 h-6 bg-conviction-800 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricConfigs.map((config, idx) => {
        const Icon = config.icon
        const value = metrics[config.key] || 0
        const change = metrics[config.changeKey] || 0
        const isPositive = change >= 0

        return (
          <div
            key={idx}
            className="bg-conviction-900/50 rounded-xl border border-conviction-800 p-6 hover:border-conviction-700 transition"
          >
            <div className="flex justify-between items-start mb-4">
              <Icon className={`w-6 h-6 ${config.color}`} />
              <span
                className={`text-xs font-semibold ${
                  isPositive ? 'text-accent-green' : 'text-accent-red'
                }`}
              >
                {isPositive ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
            <p className="text-conviction-400 text-sm mb-1">{config.label}</p>
            <p className="text-2xl font-bold">{config.format(value)}</p>
          </div>
        )
      })}
    </div>
  )
}
