/**
 * MARKET GRID COMPONENT
 * Displays markets in responsive grid layout
 */

import type { PolymarketMarket } from '@core/types'
import { MarketCard } from './MarketCard'

interface MarketGridProps {
  markets: PolymarketMarket[]
  emptyMessage?: string
}

export function MarketGrid({ 
  markets, 
  emptyMessage = 'No markets found' 
}: MarketGridProps) {
  if (markets.length === 0) {
    return (
      <div className="empty-state">
        <p>{emptyMessage}</p>
        <style jsx>{`
          .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #6b7280;
            font-size: 16px;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="market-grid">
      {markets.map(market => (
        <MarketCard key={market.id} market={market} />
      ))}

      <style jsx>{`
        .market-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          padding: 24px 0;
        }

        @media (max-width: 768px) {
          .market-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

