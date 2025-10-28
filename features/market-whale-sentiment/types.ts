/**
 * MARKET WHALE SENTIMENT TYPES
 * Types for whale activity analysis per market
 */

export interface MarketWhaleActivity {
  // Basic stats
  uniqueWhales: number
  totalTrades: number
  totalVolume: number
  avgTradeSize: number

  // Sentiment analysis
  buyVolume: number
  sellVolume: number
  buyRatio: number // 0-1 (0.8 = 80% buying)
  
  // Smart money signals
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
  sentimentStrength: 'STRONG' | 'MODERATE' | 'WEAK'
  divergence?: number // % difference from market price (if available)
  
  // Recent activity
  last24hVolume: number
  last24hTrades: number
  isActive: boolean // Has trades in last 24h
}

export interface CalculateWhaleActivityParams {
  eventSlug: string
  marketPrice?: number // Current market probability (0-1)
  timeRange?: '1h' | '24h' | '7d' | 'all'
}

