/**
 * TOP MARKETS SECTION
 * Shows top 10 markets by volume with whale sentiment
 */

'use client'

import { useState, useEffect } from 'react'
import { polymarketClient } from '@core/api'
import { generateReferralUrl } from '@features/referral'
import { WhaleActivityBadge } from '@features/market-whale-sentiment'
import type { PolymarketMarket } from '@core/types'

export function TopMarketsSection() {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTopMarkets() {
      setLoading(true)
      try {
        const allMarkets = await polymarketClient.getMarkets(100)
        // Sort by volume and take top 10
        const topMarkets = [...allMarkets]
          .sort((a, b) => b.volume - a.volume)
          .slice(0, 10)
        setMarkets(topMarkets)
      } catch (error) {
        console.error('Error fetching top markets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopMarkets()
  }, [])

  if (loading) {
    return (
      <section className="top-markets">
        <div className="container">
          <div className="loading">Loading top markets...</div>
        </div>
        <style jsx>{`
          .top-markets {
            padding: 80px 20px;
            background: #0a0a0a;
          }
          .loading {
            text-align: center;
            color: #9ca3af;
            font-size: 16px;
          }
        `}</style>
      </section>
    )
  }

  const formatVolume = (vol: number) => {
    const num = Number(vol) || 0
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`
    return `$${num.toFixed(0)}`
  }

  return (
    <section className="top-markets">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">🔥 Hottest Markets</h2>
            <p className="section-subtitle">
              Top 10 markets by volume with live whale activity tracking
            </p>
          </div>
          <a href="/markets" className="view-all-link">
            View All Markets →
          </a>
        </div>

        <div className="markets-grid">
          {markets.map((market) => (
            <div key={market.id} className="market-card">
              <a href={`/market/${market.id}`} className="market-link">
                <div 
                  className="category-badge" 
                  style={{ backgroundColor: market.category.color }}
                >
                  {market.category.name}
                </div>
                
                <h3 className="market-question">{market.question}</h3>
                
                <div className="market-stats">
                  <div className="stat">
                    <span className="stat-label">Volume</span>
                    <span className="stat-value">{formatVolume(market.volume)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">24h Volume</span>
                    <span className="stat-value">{formatVolume(market.volume24h)}</span>
                  </div>
                </div>
              </a>

              {/* Whale Activity Badge */}
              <WhaleActivityBadge 
                eventSlug={market.id} 
                marketPrice={market.outcomes[0]?.probability}
                compact={true}
              />

              <div className="cta-section">
                <a 
                  href={generateReferralUrl(market.id)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-trade"
                  onClick={(e) => e.stopPropagation()}
                >
                  Trade on Polymarket →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .top-markets {
          padding: 80px 20px;
          background: linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
        }

        .section-title {
          font-size: 42px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
        }

        .section-subtitle {
          font-size: 16px;
          color: #9ca3af;
          max-width: 600px;
        }

        .view-all-link {
          font-size: 16px;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .view-all-link:hover {
          color: #2563eb;
        }

        .markets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
        }

        .market-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%);
          border: 1px solid rgba(59, 130, 246, 0.1);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .market-card:hover {
          transform: translateY(-5px);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 15px 30px rgba(59, 130, 246, 0.1);
        }

        .market-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .market-card:hover::before {
          opacity: 1;
        }

        .market-link {
          display: block;
          padding: 24px;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }

        .category-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .market-question {
          font-size: 18px;
          font-weight: 600;
          color: #e5e7eb;
          margin-bottom: 20px;
          line-height: 1.4;
          min-height: 50px;
        }

        .market-stats {
          display: flex;
          gap: 24px;
          padding-top: 16px;
          border-top: 1px solid rgba(59, 130, 246, 0.08);
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 11px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #e5e7eb;
        }

        .cta-section {
          padding: 0 24px 24px 24px;
        }

        .btn-trade {
          display: block;
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          color: white;
          text-align: center;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-trade:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2);
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .section-title {
            font-size: 32px;
          }

          .markets-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}

