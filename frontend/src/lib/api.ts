// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

// Types
export interface Trade {
  id: string
  wallet: string
  market: string
  size: number
  type: 'buy' | 'sell'
  price: number
  time: string
  conviction: number
}

export interface Trader {
  rank: number
  address: string
  name: string
  winRate: number
  roi: number
  volume: number
  trades: number
  trend: 'up' | 'down' | 'stable'
}

export interface Metrics {
  whale_trades: number
  whale_trades_change: number
  avg_win_rate: number
  avg_win_rate_change: number
  active_wallets: number
  active_wallets_change: number
  market_volume: number
  market_volume_change: number
}

// API Calls
export const fetchRecentTrades = async (limit?: number): Promise<Trade[]> => {
  try {
    const url = new URL(`${API_BASE_URL}/api/trades/recent`)
    if (limit) url.searchParams.append('limit', limit.toString())
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch trades')
    const data = await response.json()
    // Handle different response formats
    const trades = data.trades || data
    if (!Array.isArray(trades)) {
      return []
    }
    // Transform backend format to frontend format
    return trades.map((t: any) => ({
      id: t.id || `trade_${Math.random()}`,
      wallet: t.wallet || '',
      market: t.market || '',
      size: t.amount || t.size || 0,
      type: (t.type || 'buy').toLowerCase() as 'buy' | 'sell',
      price: t.price || 0,
      time: t.time || 'just now',
      conviction: t.conviction || 0,
    }))
  } catch (error) {
    console.error('Error fetching trades:', error)
    return []
  }
}

export const fetchTopLeaderboard = async (limit?: number): Promise<Trader[]> => {
  try {
    const url = new URL(`${API_BASE_URL}/api/leaderboard/top`)
    if (limit) url.searchParams.append('limit', limit.toString())
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch leaderboard')
    const data = await response.json()
    // Handle the backend response format with 'leaderboard' key
    let traders = data.leaderboard || data.traders || data
    if (!Array.isArray(traders)) {
      traders = []
    }
    // Transform snake_case to camelCase and ensure required fields exist
    return traders.map((t: any) => ({
      rank: t.rank || 0,
      address: t.trader || t.address || '',
      name: t.name || t.trader || '',
      winRate: t.win_rate || t.winRate || 0,
      roi: t.roi || 0,
      volume: t.volume || 0,
      trades: t.trades || 0,
      trend: t.trend || 'stable',
    }))
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
}

export const fetchMetrics = async (period?: string): Promise<Metrics> => {
  try {
    const url = new URL(`${API_BASE_URL}/api/health/status`)
    if (period) url.searchParams.append('period', period)
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch metrics')
    const data = await response.json()
    // Return metrics with default values if fields don't exist
    return {
      whale_trades: data.whale_trades || 0,
      whale_trades_change: data.whale_trades_change || 0,
      avg_win_rate: data.avg_win_rate || 0,
      avg_win_rate_change: data.avg_win_rate_change || 0,
      active_wallets: data.active_wallets || 0,
      active_wallets_change: data.active_wallets_change || 0,
      market_volume: data.market_volume || 0,
      market_volume_change: data.market_volume_change || 0,
    }
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return {
      whale_trades: 0,
      whale_trades_change: 0,
      avg_win_rate: 0,
      avg_win_rate_change: 0,
      active_wallets: 0,
      active_wallets_change: 0,
      market_volume: 0,
      market_volume_change: 0,
    }
  }
}

export const fetchWalletProfile = async (address: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wallets/profile/${address}`)
    if (!response.ok) throw new Error('Failed to fetch wallet profile')
    return await response.json()
  } catch (error) {
    console.error('Error fetching wallet profile:', error)
    return null
  }
}

export const fetchRecentAlerts = async (limit?: number) => {
  try {
    const url = new URL(`${API_BASE_URL}/api/alerts/recent`)
    if (limit) url.searchParams.append('limit', limit.toString())
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch alerts')
    return await response.json()
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return []
  }
}
