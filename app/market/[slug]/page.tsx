/**
 * INDIVIDUAL MARKET DETAIL PAGE
 * Shows full details for a single market with whale sentiment
 */

'use client'

import { useState, useEffect } from 'react'
import { polymarketClient, tradesClient } from '@core/api'
import { generateReferralUrl } from '@features/referral'
import { WhaleActivityBadge } from '@features/market-whale-sentiment'
import type { PolymarketMarket, WhaleTrade } from '@core/types'

export default function MarketDetailPage({ params }: { params: { slug: string } }) {
  const [market, setMarket] = useState<PolymarketMarket | null>(null)
  const [whaleTrades, setWhaleTrades] = useState<WhaleTrade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMarketData() {
      setLoading(true)
      try {
        const marketData = await polymarketClient.getMarketById(params.slug)
        setMarket(marketData)
        
        // Fetch whale trades specifically for this market
        if (marketData) {
          try {
            const trades = await tradesClient.getMarketTrades(params.slug, 1000, 10)
            setWhaleTrades(trades)
          } catch (error) {
            console.error('Error fetching whale trades:', error)
            // Continue even if whale trades fail
          }
        }
      } catch (error) {
        console.error('Error fetching market data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading market details...</div>
        <style jsx>{`
          .loading {
            text-align: center;
            padding: 80px 20px;
            font-size: 18px;
            color: #9ca3af;
          }
        `}</style>
      </div>
    )
  }

  if (!market) {
    return (
      <div className="container">
        <div className="error">
          <h1>Market Not Found</h1>
          <p>The market you're looking for doesn't exist or has been removed.</p>
          <a href="/markets" className="btn-back">← Back to Markets</a>
        </div>
        <style jsx>{`
          .error {
            text-align: center;
            padding: 80px 20px;
          }
          .error h1 {
            font-size: 36px;
            color: #e5e7eb;
            margin-bottom: 16px;
          }
          .error p {
            font-size: 16px;
            color: #9ca3af;
            margin-bottom: 32px;
          }
          .btn-back {
            display: inline-block;
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.2s;
          }
          .btn-back:hover {
            background: #2563eb;
          }
        `}</style>
      </div>
    )
  }

  const referralUrl = generateReferralUrl(market.id)
  const formatVolume = (vol: number) => {
    const num = Number(vol) || 0
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`
    return `$${num.toFixed(0)}`
  }

  const daysUntil = Math.ceil(
    (new Date(market.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  // Helper function for time ago
  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() / 1000) - timestamp)
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + "y"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + "mo"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + "d"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + "h"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + "m"
    return Math.floor(seconds) + "s"
  }

  return (
    <div className="container">
      <div className="market-detail">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/markets">← Back to Markets</a>
        </div>

        {/* Header */}
        <div className="market-header">
          <div 
            className="category-badge" 
            style={{ backgroundColor: market.category.color }}
          >
            {market.category.name}
          </div>
          <h1 className="market-question">{market.question}</h1>
          {market.description && (
            <p className="market-description">{market.description}</p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Liquidity</div>
            <div className="stat-value">{formatVolume(market.liquidity)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Volume</div>
            <div className="stat-value">{formatVolume(market.volume)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">24h Volume</div>
            <div className="stat-value">{formatVolume(market.volume24h)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Closes In</div>
            <div className="stat-value">
              {daysUntil > 0 ? `${daysUntil} day${daysUntil !== 1 ? 's' : ''}` : 'Closed'}
            </div>
          </div>
        </div>

        {/* Whale Sentiment - Full Detail View */}
        <div className="whale-sentiment-section">
          <h2>🐋 Whale Activity Analysis</h2>
          <WhaleActivityBadge 
            eventSlug={market.id} 
            marketPrice={market.outcomes[0]?.probability}
            compact={false}
          />

          {/* Whale Transactions */}
          {whaleTrades.length > 0 && (
            <div className="whale-transactions">
              <h3 className="transactions-title">Recent Whale Transactions</h3>
              <div className="transactions-list">
                {whaleTrades.map((trade, i) => {
                  const timeAgo = getTimeAgo(trade.timestamp)
                  const walletShort = `${trade.proxyWallet.slice(0, 6)}...${trade.proxyWallet.slice(-4)}`
                  
                  return (
                    <div key={`${trade.transactionHash}-${i}`} className="transaction-item">
                      <div className="transaction-header">
                        <div className="trader-info">
                          {trade.profileImage ? (
                            <img src={trade.profileImage} alt={trade.name} className="trader-avatar" />
                          ) : (
                            <div className="trader-avatar-placeholder">
                              {trade.name[0]?.toUpperCase() || '?'}
                            </div>
                          )}
                          <div>
                            <div className="trader-name">{trade.name || trade.pseudonym}</div>
                            <a
                              href={`https://polygonscan.com/address/${trade.proxyWallet}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="wallet-link"
                            >
                              {walletShort}
                            </a>
                          </div>
                        </div>
                        <div className={`trade-side ${trade.side.toLowerCase()}`}>
                          {trade.side}
                        </div>
                      </div>

                      <div className="transaction-details">
                        <div className="detail-item">
                          <span className="detail-label">Shares</span>
                          <span className="detail-value">{trade.size.toFixed(0)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Price</span>
                          <span className="detail-value">${trade.price.toFixed(2)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Value</span>
                          <span className="detail-value">${trade.totalValue.toLocaleString()}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Time</span>
                          <span className="detail-value">{timeAgo} ago</span>
                        </div>
                      </div>

                      <div className="transaction-footer">
                        <a
                          href={`https://polygonscan.com/tx/${trade.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-tx-link"
                        >
                          View Transaction on Polygonscan →
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Outcomes */}
        {market.outcomes && market.outcomes.length > 0 && (
          <div className="outcomes-section">
            <h2>Market Outcomes</h2>
            <div className="outcomes-grid">
              {market.outcomes.map((outcome, i) => (
                <div key={i} className="outcome-card">
                  <div className="outcome-name">{outcome.name}</div>
                  <div className="outcome-price">{(outcome.probability * 100).toFixed(1)}%</div>
                  <div className="outcome-label">Probability</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="cta-section">
          <a 
            href={referralUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-trade"
          >
            Trade on Polymarket →
          </a>
        </div>
      </div>

      <style jsx>{`
        .market-detail {
          max-width: 900px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .breadcrumb {
          margin-bottom: 32px;
        }

        .breadcrumb a {
          color: #3b82f6;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: color 0.2s;
        }

        .breadcrumb a:hover {
          color: #2563eb;
        }

        .market-header {
          margin-bottom: 40px;
        }

        .category-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .market-question {
          font-size: 42px;
          font-weight: 800;
          color: #e5e7eb;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .market-description {
          font-size: 18px;
          color: #9ca3af;
          line-height: 1.6;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
          padding: 24px;
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          text-align: center;
        }

        .stat-label {
          font-size: 12px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .whale-sentiment-section {
          margin-bottom: 40px;
        }

        .whale-sentiment-section h2 {
          font-size: 28px;
          font-weight: 700;
          color: #e5e7eb;
          margin-bottom: 20px;
        }

        .whale-transactions {
          margin-top: 32px;
        }

        .transactions-title {
          font-size: 22px;
          font-weight: 700;
          color: #e5e7eb;
          margin-bottom: 20px;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .transaction-item {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%);
          border: 1px solid rgba(59, 130, 246, 0.1);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .transaction-item:hover {
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.08);
        }

        .transaction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .trader-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .trader-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .trader-avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 18px;
        }

        .trader-name {
          font-size: 15px;
          font-weight: 600;
          color: #e5e7eb;
          margin-bottom: 4px;
        }

        .wallet-link {
          font-size: 13px;
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.2s;
        }

        .wallet-link:hover {
          color: #3b82f6;
        }

        .trade-side {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          color: white;
        }

        .trade-side.buy {
          background: #22C55E;
        }

        .trade-side.sell {
          background: #EF4444;
        }

        .transaction-details {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          padding: 16px 0;
          border-top: 1px solid rgba(59, 130, 246, 0.08);
          border-bottom: 1px solid rgba(59, 130, 246, 0.08);
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 11px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          font-weight: 600;
        }

        .detail-value {
          font-size: 16px;
          font-weight: 600;
          color: #e5e7eb;
        }

        .transaction-footer {
          margin-top: 16px;
        }

        .view-tx-link {
          display: inline-flex;
          align-items: center;
          padding: 10px 18px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .view-tx-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
        }

        .outcomes-section {
          margin-bottom: 40px;
        }

        .outcomes-section h2 {
          font-size: 28px;
          font-weight: 700;
          color: #e5e7eb;
          margin-bottom: 20px;
        }

        .outcomes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .outcome-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          text-align: center;
          transition: all 0.3s ease;
        }

        .outcome-card:hover {
          border-color: rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }

        .outcome-name {
          font-size: 16px;
          font-weight: 600;
          color: #e5e7eb;
          margin-bottom: 12px;
        }

        .outcome-price {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .outcome-label {
          font-size: 12px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cta-section {
          text-align: center;
          margin: 60px 0;
        }

        .btn-trade {
          display: inline-block;
          padding: 18px 48px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-trade:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 768px) {
          .market-question {
            font-size: 32px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .stat-value {
            font-size: 24px;
          }

          .outcomes-grid {
            grid-template-columns: 1fr;
          }

          .transaction-details {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .detail-label {
            font-size: 10px;
          }

          .detail-value {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}

