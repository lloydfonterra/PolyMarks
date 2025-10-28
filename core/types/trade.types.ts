/**
 * WHALE TRADE TYPES
 * Types for tracking large trades on Polymarket
 */

export interface WhaleTrade {
  // Trader info
  proxyWallet: string
  name: string
  pseudonym: string
  bio: string
  profileImage: string
  
  // Trade details
  side: 'BUY' | 'SELL'
  size: number // Number of shares
  price: number // Price per share
  totalValue: number // size * price
  
  // Market info
  title: string
  slug: string
  eventSlug: string
  icon: string
  outcome: string
  outcomeIndex: number
  
  // Blockchain
  transactionHash: string
  timestamp: number
  
  // Technical
  asset: string
  conditionId: string
}

export interface WhaleTradeFilters {
  minAmount?: number // Minimum trade size in USD
  side?: 'BUY' | 'SELL' | 'ALL'
  timeRange?: '1h' | '24h' | '7d' | 'all'
  market?: string // Filter by specific market slug
}

export interface TraderProfile {
  wallet: string
  name: string
  pseudonym: string
  bio: string
  profileImage: string
  totalTrades: number
  totalVolume: number
  winRate?: number
  avgTradeSize: number
}

