/**
 * MARKET SORTING LOGIC
 * Pure functions for sorting markets
 */

import type { PolymarketMarket } from '@core/types'

type SortOption = 'volume' | 'liquidity' | 'closing' | 'trending'

/**
 * Sort markets by volume (highest first)
 */
export function sortByVolume(markets: PolymarketMarket[]): PolymarketMarket[] {
  return [...markets].sort((a, b) => b.volume - a.volume)
}

/**
 * Sort markets by liquidity (highest first)
 */
export function sortByLiquidity(markets: PolymarketMarket[]): PolymarketMarket[] {
  return [...markets].sort((a, b) => b.liquidity - a.liquidity)
}

/**
 * Sort markets by closing time (soonest first)
 */
export function sortByClosing(markets: PolymarketMarket[]): PolymarketMarket[] {
  return [...markets].sort((a, b) => {
    const aTime = new Date(a.endDate).getTime()
    const bTime = new Date(b.endDate).getTime()
    return aTime - bTime
  })
}

/**
 * Sort by trending (24h volume)
 */
export function sortByTrending(markets: PolymarketMarket[]): PolymarketMarket[] {
  return [...markets].sort((a, b) => b.volume24h - a.volume24h)
}

/**
 * Apply sorting based on option
 */
export function sortMarkets(
  markets: PolymarketMarket[],
  sortBy: SortOption = 'volume'
): PolymarketMarket[] {
  switch (sortBy) {
    case 'volume':
      return sortByVolume(markets)
    case 'liquidity':
      return sortByLiquidity(markets)
    case 'closing':
      return sortByClosing(markets)
    case 'trending':
      return sortByTrending(markets)
    default:
      return markets
  }
}

