/**
 * MARKET FILTERING LOGIC
 * Pure functions - easy to test and maintain
 * No side effects, no external dependencies
 */

import type { PolymarketMarket, MarketFilters } from '@core/types'

/**
 * Filter markets based on search query
 */
export function filterBySearch(
  markets: PolymarketMarket[],
  search: string
): PolymarketMarket[] {
  if (!search.trim()) return markets

  const query = search.toLowerCase()
  return markets.filter(
    market =>
      market.question.toLowerCase().includes(query) ||
      market.description.toLowerCase().includes(query) ||
      market.category.name.toLowerCase().includes(query)
  )
}

/**
 * Filter markets by category
 * Since Polymarket API doesn't provide categories, we filter by keyword matching
 */
export function filterByCategory(
  markets: PolymarketMarket[],
  category?: string
): PolymarketMarket[] {
  if (!category || category === 'all') return markets
  
  const categoryKeywords: Record<string, string[]> = {
    'politics': ['election', 'president', 'congress', 'senate', 'government', 'political', 'vote', 'democrat', 'republican', 'party', 'biden', 'trump', 'nato', 'supreme leader', 'prime minister', 'parliament', 'governor', 'mayor'],
    'sports': ['nba', 'nfl', 'mlb', 'nhl', 'soccer', 'football', 'basketball', 'baseball', 'hockey', 'world series', 'super bowl', 'mvp award', 'playoff', 'world cup', 'olympics', 'formula 1', 'f1', 'champions league', 'premier league', 'la liga', 'serie a', 'bundesliga', 'uefa', 'fifa', 'tennis', 'golf', 'masters', 'wimbledon', 'grand slam', 'nascar', 'quarterback', 'pitcher', 'striker', 'goalie'],
    'crypto': ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'usdt', 'usdc', 'solana', 'sol', 'tether', 'defi', 'nft', 'blockchain', 'coinbase', 'binance', 'kraken', 'depeg', 'stablecoin'],
    'business': ['stock price', 'market cap', 'ipo', 'earnings', 'revenue', 'ceo', 'cfo', 'layoffs', 'merger', 'acquisition', 'bankruptcy', 'profit', 'loss', 'quarterly', 'shareholders'],
    'technology': ['artificial intelligence', 'chatgpt', 'openai', 'deepmind', 'machine learning', 'neural network', 'gpt-5', 'gpt-4', 'claude', 'gemini', 'llm', 'robotics', 'autonomous', 'self-driving', 'quantum computing']
  }
  
  const keywords = categoryKeywords[category.toLowerCase()] || []
  if (keywords.length === 0) return markets
  
  return markets.filter(m => {
    const text = (m.question + ' ' + m.description).toLowerCase()
    
    // Check for whole word matches using word boundaries
    const matchedKeyword = keywords.find(keyword => {
      // Create regex with word boundaries for better matching
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      return regex.test(text)
    })
    
    return !!matchedKeyword
  })
}

/**
 * Filter markets by minimum liquidity
 */
export function filterByLiquidity(
  markets: PolymarketMarket[],
  minLiquidity?: number
): PolymarketMarket[] {
  if (!minLiquidity) return markets
  return markets.filter(m => m.liquidity >= minLiquidity)
}

/**
 * Filter markets by closing time
 */
export function filterByClosingTime(
  markets: PolymarketMarket[],
  closingTime?: 'soon' | 'week' | 'month' | 'all'
): PolymarketMarket[] {
  if (!closingTime || closingTime === 'all') return markets

  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  
  return markets.filter(market => {
    const endTime = new Date(market.endDate).getTime()
    const daysUntil = (endTime - now) / day

    switch (closingTime) {
      case 'soon':
        return daysUntil > 0 && daysUntil <= 30 // Closing within 30 days
      case 'week':
        return daysUntil > 0 && daysUntil <= 60 // Closing within 2 months
      case 'month':
        return daysUntil > 0 && daysUntil <= 180 // Closing within 6 months
      default:
        return true
    }
  })
}

/**
 * Apply all filters at once
 */
export function applyFilters(
  markets: PolymarketMarket[],
  filters: MarketFilters
): PolymarketMarket[] {
  let filtered = markets

  if (filters.search) {
    filtered = filterBySearch(filtered, filters.search)
  }

  if (filters.category) {
    filtered = filterByCategory(filtered, filters.category)
  }

  if (filters.minLiquidity) {
    filtered = filterByLiquidity(filtered, filters.minLiquidity)
  }

  if (filters.closingTime) {
    filtered = filterByClosingTime(filtered, filters.closingTime)
  }

  return filtered
}

