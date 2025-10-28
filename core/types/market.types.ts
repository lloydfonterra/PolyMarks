/**
 * CORE TYPE DEFINITIONS
 * Shared across all feature modules
 * DO NOT add feature-specific types here
 */

export interface PolymarketOutcome {
  id: string
  name: string
  price: number
  probability: number
  volume24h: number
  priceChange24h: number
}

export interface PolymarketCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
}

export interface PolymarketMarket {
  id: string
  question: string
  description: string
  category: PolymarketCategory
  outcomes: PolymarketOutcome[]
  volume: number
  liquidity: number
  volume24h: number
  endDate: string
  image?: string
  active: boolean
}

export interface MarketFilters {
  category?: string
  search?: string
  minLiquidity?: number
  closingTime?: 'soon' | 'week' | 'month' | 'all'
  sortBy?: 'volume' | 'liquidity' | 'closing' | 'trending'
}

