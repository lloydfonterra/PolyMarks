import type { WhaleTrade, WhaleTradeFilters } from '@core/types'

/**
 * TRADES CLIENT
 * Fetches whale trade data from Polymarket
 */
class TradesClient {
  async getWhaleTrades(filters: WhaleTradeFilters = {}): Promise<WhaleTrade[]> {
    try {
      const params = new URLSearchParams()
      
      params.append('limit', '50')
      params.append('offset', '0')
      params.append('filterType', 'CASH')
      params.append('filterAmount', (filters.minAmount || 1000).toString())
      
      if (filters.market) {
        // Would need to fetch market ID first, for now skip
      }

      const response = await fetch(`/api/trades?${params.toString()}`, {
        next: { revalidate: 30 },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const trades = await response.json()
      return this.transformTrades(trades, filters)
    } catch (error) {
      console.error('Error fetching whale trades:', error)
      return []
    }
  }

  async getMarketTrades(marketSlug: string, minAmount: number = 1000, limit: number = 200): Promise<WhaleTrade[]> {
    try {
      const params = new URLSearchParams()

      params.append('limit', limit.toString())
      params.append('offset', '0')
      params.append('filterType', 'CASH')
      params.append('filterAmount', minAmount.toString())
      params.append('eventId', marketSlug) // Event slug for specific market

      const response = await fetch(`/api/trades?${params.toString()}`, {
        next: { revalidate: 30 },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const trades = await response.json()

      // API should return only trades for this market, so just transform them
      // Don't filter further as the eventId param should handle it
      return this.transformTrades(trades, {})
    } catch (error) {
      console.error('Error fetching market trades:', error)
      return []
    }
  }

  private transformTrades(trades: any[], filters: WhaleTradeFilters): WhaleTrade[] {
    let filtered = trades

    // Filter by side
    if (filters.side && filters.side !== 'ALL') {
      filtered = filtered.filter(t => t.side === filters.side)
    }

    // Filter by time range
    if (filters.timeRange && filters.timeRange !== 'all') {
      const now = Date.now() / 1000
      const ranges = {
        '1h': 3600,
        '24h': 86400,
        '7d': 604800,
      }
      const cutoff = now - ranges[filters.timeRange]
      filtered = filtered.filter(t => t.timestamp >= cutoff)
    }

    return filtered.map(trade => ({
      proxyWallet: trade.proxyWallet,
      name: trade.name || 'Anonymous',
      pseudonym: trade.pseudonym || 'Unknown',
      bio: trade.bio || '',
      profileImage: trade.profileImage || '',
      side: trade.side,
      size: trade.size,
      price: trade.price,
      totalValue: trade.totalValue || (trade.size * trade.price),
      title: trade.title,
      slug: trade.slug,
      eventSlug: trade.eventSlug,
      icon: trade.icon,
      outcome: trade.outcome,
      outcomeIndex: trade.outcomeIndex,
      transactionHash: trade.transactionHash,
      timestamp: trade.timestamp,
      asset: trade.asset,
      conditionId: trade.conditionId,
    }))
  }
}

export const tradesClient = new TradesClient()

