/**
 * OUTLIER DETECTION LOGIC
 * Identifies unusual market activity
 */

import type { PolymarketMarket } from '@core/types'

export interface OutlierSignal {
  type: 'volume_spike' | 'odds_shift' | 'high_conviction' | 'whale_activity'
  confidence: 'high' | 'medium' | 'low'
  reason: string
  severity: number // 0-100
}

export interface MarketWithOutliers extends PolymarketMarket {
  outliers?: OutlierSignal[]
  isOutlier: boolean
}

/**
 * Detect if market has unusual volume
 */
function detectVolumeSpike(market: PolymarketMarket): OutlierSignal | null {
  // If 24h volume is significantly higher than would be expected
  // Simple heuristic: if 24h volume > 20% of total volume
  const ratio = market.volume24h / market.volume
  
  if (ratio > 0.2) {
    return {
      type: 'volume_spike',
      confidence: 'high',
      reason: `Unusual volume surge - ${(ratio * 100).toFixed(0)}% of total volume in 24h`,
      severity: Math.min(100, ratio * 100),
    }
  }
  
  return null
}

/**
 * Detect significant odds changes
 */
function detectOddsShift(market: PolymarketMarket): OutlierSignal | null {
  // Check for large price movements in outcomes
  if (!market.outcomes || !Array.isArray(market.outcomes) || market.outcomes.length === 0) {
    return null
  }
  
  const maxPriceChange = Math.max(
    ...market.outcomes.map(o => Math.abs(o.priceChange24h || 0))
  )
  
  if (maxPriceChange > 0.15) {
    return {
      type: 'odds_shift',
      confidence: 'high',
      reason: `Major odds movement - ${(maxPriceChange * 100).toFixed(0)}% change in 24h`,
      severity: maxPriceChange * 100,
    }
  }
  
  return null
}

/**
 * Detect high conviction bets (one side heavily favored)
 */
function detectHighConviction(market: PolymarketMarket): OutlierSignal | null {
  // If one outcome has very high probability and high volume
  const topOutcome = market.outcomes
    .sort((a, b) => b.probability - a.probability)[0]
  
  if (topOutcome && topOutcome.probability > 0.85 && market.volume24h > 50000) {
    return {
      type: 'high_conviction',
      confidence: 'medium',
      reason: `Strong market consensus - ${(topOutcome.probability * 100).toFixed(0)}% probability`,
      severity: topOutcome.probability * 100,
    }
  }
  
  return null
}

/**
 * Detect whale activity (large volume markets)
 */
function detectWhaleActivity(market: PolymarketMarket): OutlierSignal | null {
  // Markets with very high 24h volume might indicate whale activity
  if (market.volume24h > 100000) {
    return {
      type: 'whale_activity',
      confidence: 'medium',
      reason: `High activity - $${(market.volume24h / 1000).toFixed(0)}K in 24h`,
      severity: Math.min(100, market.volume24h / 10000),
    }
  }
  
  return null
}

/**
 * Analyze market for all outlier signals
 */
export function analyzeMarket(market: PolymarketMarket): MarketWithOutliers {
  const signals: OutlierSignal[] = []
  
  // Run all detection algorithms
  const volumeSpike = detectVolumeSpike(market)
  const oddsShift = detectOddsShift(market)
  const highConviction = detectHighConviction(market)
  const whaleActivity = detectWhaleActivity(market)
  
  // Collect detected signals
  if (volumeSpike) signals.push(volumeSpike)
  if (oddsShift) signals.push(oddsShift)
  if (highConviction) signals.push(highConviction)
  if (whaleActivity) signals.push(whaleActivity)
  
  return {
    ...market,
    outliers: signals.length > 0 ? signals : undefined,
    isOutlier: signals.length > 0,
  }
}

/**
 * Analyze multiple markets and return only outliers
 */
export function detectOutliers(markets: PolymarketMarket[]): MarketWithOutliers[] {
  return markets
    .map(analyzeMarket)
    .filter(m => m.isOutlier)
    .sort((a, b) => {
      // Sort by highest severity
      const aSeverity = Math.max(...(a.outliers?.map(o => o.severity) || [0]))
      const bSeverity = Math.max(...(b.outliers?.map(o => o.severity) || [0]))
      return bSeverity - aSeverity
    })
}

/**
 * Get severity score for a market (0-100)
 */
export function getMarketSeverity(market: MarketWithOutliers): number {
  if (!market.outliers || market.outliers.length === 0) return 0
  return Math.max(...market.outliers.map(o => o.severity))
}

