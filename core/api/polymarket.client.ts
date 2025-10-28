/**
 * POLYMARKET API CLIENT
 * Self-contained module for fetching Polymarket data
 * 
 * USAGE:
 * import { polymarketClient } from '@core/api'
 * const markets = await polymarketClient.getMarkets()
 */

import { config } from '@core/config'
import type { PolymarketMarket } from '@core/types'

/**
 * Detect category based on market content
 */
function detectCategory(question: string, description: string): { id: string; name: string; color: string } {
  const text = (question + ' ' + description).toLowerCase()
  
  const categoryKeywords: Record<string, { keywords: string[]; color: string }> = {
    'politics': {
      keywords: ['election', 'president', 'congress', 'senate', 'government', 'political', 'vote', 'democrat', 'republican', 'party', 'biden', 'trump', 'nato', 'supreme leader', 'prime minister', 'parliament', 'governor', 'mayor'],
      color: '#EF4444'
    },
    'sports': {
      keywords: ['nba', 'nfl', 'mlb', 'nhl', 'soccer', 'football', 'basketball', 'baseball', 'hockey', 'world series', 'super bowl', 'mvp award', 'playoff', 'world cup', 'olympics', 'formula 1', 'f1', 'champions league', 'premier league', 'la liga', 'serie a', 'bundesliga', 'uefa', 'fifa', 'tennis', 'golf', 'masters', 'wimbledon', 'grand slam', 'nascar', 'quarterback', 'pitcher', 'striker', 'goalie'],
      color: '#10B981'
    },
    'crypto': {
      keywords: ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'usdt', 'usdc', 'solana', 'sol', 'tether', 'defi', 'nft', 'blockchain', 'coinbase', 'binance', 'kraken', 'depeg', 'stablecoin'],
      color: '#F59E0B'
    },
    'business': {
      keywords: ['stock price', 'market cap', 'ipo', 'earnings', 'revenue', 'ceo', 'cfo', 'layoffs', 'merger', 'acquisition', 'bankruptcy', 'profit', 'loss', 'quarterly', 'shareholders'],
      color: '#3B82F6'
    },
    'technology': {
      keywords: ['artificial intelligence', 'chatgpt', 'openai', 'deepmind', 'machine learning', 'neural network', 'gpt-5', 'gpt-4', 'claude', 'gemini', 'llm', 'robotics', 'autonomous', 'self-driving', 'quantum computing'],
      color: '#8B5CF6'
    }
  }
  
  // Check each category
  for (const [categoryId, { keywords, color }] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      // Use word boundaries for whole word matching
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      if (regex.test(text)) {
        return {
          id: categoryId,
          name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
          color
        }
      }
    }
  }
  
  // Default to Other
  return { id: 'other', name: 'Other', color: '#6B7280' }
}

class PolymarketClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Fetch all markets from Polymarket
   * @param limit - Number of markets to fetch (default: 100)
   */
  async getMarkets(limit: number = 100): Promise<PolymarketMarket[]> {
    try {
      // Use our Next.js API route to avoid CORS issues
      const response = await fetch(
        `/api/markets?limit=${limit}`,
        {
          next: { revalidate: 60 }, // Cache for 60 seconds
        }
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return this.transformMarkets({ data })
    } catch (error) {
      console.error('Error fetching markets:', error)
      return []
    }
  }

  /**
   * Fetch featured/trending markets
   */
  async getFeaturedMarkets(): Promise<PolymarketMarket[]> {
    try {
      const response = await fetch(`/api/markets?type=featured`, {
        next: { revalidate: 120 },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return this.transformMarkets({ data })
    } catch (error) {
      console.error('Error fetching featured markets:', error)
      return []
    }
  }

  /**
   * Fetch single market by ID
   */
  async getMarketById(id: string): Promise<PolymarketMarket | null> {
    try {
      // For single market, we'll fetch all and filter (since we cache)
      const markets = await this.getMarkets(100)
      return markets.find(m => m.id === id) || null
    } catch (error) {
      console.error(`Error fetching market ${id}:`, error)
      return null
    }
  }

  /**
   * Transform raw API response to our Market type
   * PRIVATE - only used internally
   */
  private transformMarkets(data: any): PolymarketMarket[] {
    if (!data?.data) return []
    
    return data.data
      .map((market: any) => this.transformMarket(market))
      .filter(Boolean) as PolymarketMarket[]
  }

  private transformMarket(market: any): PolymarketMarket | null {
    if (!market) return null

    try {
      // Handle Polymarket API structure
      const outcomes = market.outcomes || market.tokens || []
      const outcomesArray = Array.isArray(outcomes) ? outcomes : []
      
      // Use slug for URL, fallback to id if slug not available
      const marketId = market.slug || market.market_slug || market.id || market.condition_id
      const question = market.question || market.title || 'Unknown Market'
      const description = market.description || ''
      
      // Auto-detect category based on content
      const detectedCategory = detectCategory(question, description)
      
      return {
        id: marketId,
        question,
        description,
        category: {
          id: detectedCategory.id,
          name: detectedCategory.name,
          slug: detectedCategory.id,
          description: '',
          color: detectedCategory.color,
          icon: 'Help',
        },
        outcomes: outcomesArray.map((outcome: any) => ({
          id: outcome.id || outcome.token_id || '',
          name: outcome.name || outcome.outcome || 'Unknown',
          price: Number(outcome.price) || 0,
          probability: Number(outcome.price) || 0,
          volume24h: Number(outcome.volume) || 0,
          priceChange24h: 0, // Not provided by API
        })),
        volume: Number(market.volume) || 0,
        liquidity: Number(market.liquidity) || 0,
        volume24h: Number(market.volume24h || market.volume) || 0,
        endDate: market.end_date || market.endDate || new Date().toISOString(),
        image: market.image || market.icon,
        active: market.active !== false && market.closed !== true,
      }
    } catch (error) {
      console.error('Error transforming market:', error, market)
      return null
    }
  }
}

// Export singleton instance
export const polymarketClient = new PolymarketClient(config.polymarketApiUrl)

