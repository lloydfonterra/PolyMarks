/**
 * MARKET CARD COMPONENT
 * Displays a single market in card format
 * Self-contained, reusable
 */

import type { PolymarketMarket } from '@core/types'
import { generateReferralUrl } from '@features/referral'

interface MarketCardProps {
  market: PolymarketMarket
}

export function MarketCard({ market }: MarketCardProps) {
  const referralUrl = generateReferralUrl(market.id)
  
  // Format large numbers
  const formatVolume = (vol: number) => {
    const num = Number(vol) || 0
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`
    return `$${num.toFixed(0)}`
  }

  // Calculate days until close
  const daysUntil = Math.ceil(
    (new Date(market.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="market-card-wrapper">
      {/* Clickable area for market details */}
      <a href={`/market/${market.id}`} className="market-card-link">
        {/* Category Badge */}
        <div 
          className="category-badge" 
          style={{ backgroundColor: market.category.color }}
        >
          {market.category.name}
        </div>

        {/* Question */}
        <h3 className="market-question">{market.question}</h3>

      {/* Stats */}
      <div className="market-stats">
        <div className="stat">
          <span className="stat-label">Liquidity</span>
          <span className="stat-value">{formatVolume(market.liquidity)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Volume</span>
          <span className="stat-value">{formatVolume(market.volume)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">24h Volume</span>
          <span className="stat-value">{formatVolume(market.volume24h)}</span>
        </div>
      </div>

        {/* Closing Time */}
        <div className="closing-time">
          {daysUntil > 0 
            ? `Closes in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`
            : 'Closed'}
        </div>
      </a>

      {/* CTA Button - Outside link to prevent nested links */}
      <div className="cta-buttons">
        <a 
          href={referralUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary"
          onClick={(e) => e.stopPropagation()}
        >
          Trade on Polymarket →
        </a>
      </div>

      <style jsx>{`
        .market-card-wrapper {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          transition: transform 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }

        .market-card-wrapper:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .market-card-link {
          display: block;
          padding: 20px;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }

        .category-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          margin-bottom: 12px;
        }

        .market-question {
          font-size: 18px;
          font-weight: 600;
          margin: 12px 0;
          color: #111827;
          line-height: 1.4;
          min-height: 50px;
        }

        .market-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 16px 0;
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .closing-time {
          font-size: 14px;
          color: #6b7280;
          margin: 12px 0;
        }

        .cta-buttons {
          display: flex;
          gap: 8px;
          padding: 0 20px 20px 20px;
        }

        .btn-primary {
          flex: 1;
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          text-align: center;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
        }

        .btn-primary:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  )
}

