/**
 * WHALE SENTIMENT CALCULATOR
 * Analyzes whale activity for a specific market
 */

import { tradesClient } from '@core/api'
import type { WhaleTrade } from '@core/types'
import type { MarketWhaleActivity } from '../types'

/**
 * Calculate whale activity and sentiment for a specific market
 */
export async function calculateMarketWhaleActivity(
  eventSlug: string,
  marketPrice?: number
): Promise<MarketWhaleActivity | null> {
  try {
    // Fetch all whale trades for this market
    const trades = await tradesClient.getMarketTrades(eventSlug, 1000, 200)

    if (!trades || trades.length === 0) {
      return null
    }

    // Calculate unique whales
    const uniqueWallets = new Set(trades.map(t => t.proxyWallet))
    const uniqueWhales = uniqueWallets.size

    // Calculate volumes
    const buyTrades = trades.filter(t => t.side === 'BUY')
    const sellTrades = trades.filter(t => t.side === 'SELL')
    
    const buyVolume = buyTrades.reduce((sum, t) => sum + t.totalValue, 0)
    const sellVolume = sellTrades.reduce((sum, t) => sum + t.totalValue, 0)
    const totalVolume = buyVolume + sellVolume
    
    const buyRatio = totalVolume > 0 ? buyVolume / totalVolume : 0.5

    // Calculate last 24h activity
    const now = Date.now() / 1000
    const oneDayAgo = now - 86400
    const recent24h = trades.filter(t => t.timestamp >= oneDayAgo)
    const last24hVolume = recent24h.reduce((sum, t) => sum + t.totalValue, 0)
    const last24hTrades = recent24h.length

    // Determine sentiment
    let sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
    let sentimentStrength: 'STRONG' | 'MODERATE' | 'WEAK'

    if (buyRatio >= 0.7) {
      sentiment = 'BULLISH'
      sentimentStrength = buyRatio >= 0.85 ? 'STRONG' : 'MODERATE'
    } else if (buyRatio <= 0.3) {
      sentiment = 'BEARISH'
      sentimentStrength = buyRatio <= 0.15 ? 'STRONG' : 'MODERATE'
    } else {
      sentiment = 'NEUTRAL'
      sentimentStrength = 'WEAK'
    }

    // Calculate divergence from market price if available
    let divergence: number | undefined
    if (marketPrice !== undefined) {
      // Market price represents retail sentiment (0-1)
      // buyRatio represents whale sentiment (0-1)
      divergence = (buyRatio - marketPrice) * 100 // Convert to percentage
    }

    return {
      uniqueWhales,
      totalTrades: trades.length,
      totalVolume,
      avgTradeSize: totalVolume / trades.length,
      buyVolume,
      sellVolume,
      buyRatio,
      sentiment,
      sentimentStrength,
      divergence,
      last24hVolume,
      last24hTrades,
      isActive: last24hTrades > 0
    }
  } catch (error) {
    console.error('Error calculating whale activity:', error)
    return null
  }
}

/**
 * Format sentiment for display
 */
export function formatSentiment(activity: MarketWhaleActivity): {
  emoji: string
  color: string
  label: string
} {
  const { sentiment, sentimentStrength } = activity

  if (sentiment === 'BULLISH') {
    return {
      emoji: sentimentStrength === 'STRONG' ? '🔥' : '📈',
      color: sentimentStrength === 'STRONG' ? '#22C55E' : '#86EFAC',
      label: sentimentStrength === 'STRONG' ? 'STRONG BUY' : 'BULLISH'
    }
  }

  if (sentiment === 'BEARISH') {
    return {
      emoji: sentimentStrength === 'STRONG' ? '🧊' : '📉',
      color: sentimentStrength === 'STRONG' ? '#EF4444' : '#FCA5A5',
      label: sentimentStrength === 'STRONG' ? 'STRONG SELL' : 'BEARISH'
    }
  }

  return {
    emoji: '⚖️',
    color: '#9CA3AF',
    label: 'NEUTRAL'
  }
}

