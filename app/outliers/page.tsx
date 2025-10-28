/**
 * OUTLIERS PAGE
 * Shows only markets with unusual activity
 * Uses outliers feature module
 */

'use client'

import { useState, useEffect } from 'react'
import { polymarketClient, tradesClient } from '@core/api'
import { MarketGrid } from '@features/markets'
import { detectOutliers, OutlierBadge } from '@features/outliers'
import { WhaleTradeCard } from '@features/whales'
import type { MarketWithOutliers } from '@features/outliers'
import type { WhaleTrade } from '@core/types'

export default function OutliersPage() {
  const [outliers, setOutliers] = useState<MarketWithOutliers[]>([])
  const [whaleTrades, setWhaleTrades] = useState<WhaleTrade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [markets, trades] = await Promise.all([
          polymarketClient.getMarkets(500),
          tradesClient.getWhaleTrades({ minAmount: 5000, timeRange: '24h' })
        ])
        const detected = detectOutliers(markets)
        setOutliers(detected)
        setWhaleTrades(trades.slice(0, 6)) // Top 6 whale trades
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container">
      {/* Hero */}
      <section className="hero">
        <h1>🔥 Smart Money Alerts</h1>
        <p>
          Markets with unusual activity, large bets, and significant odds movements. 
          This is where smart money is moving.
        </p>
      </section>

      {/* Stats */}
      <div className="outlier-stats">
        <div className="stat">
          <span className="stat-value">{outliers.length}</span>
          <span className="stat-label">Active Signals</span>
        </div>
      </div>

      {loading && (
        <div className="loading">
          <p>Analyzing markets for outliers...</p>
        </div>
      )}

      {!loading && outliers.length === 0 && (
        <div className="empty">
          <p>No outlier signals detected right now. Check back later!</p>
        </div>
      )}

      {!loading && (
        <>
          {whaleTrades.length > 0 && (
            <section className="whale-alerts">
              <div className="section-header">
                <h2>🐋 Recent Whale Trades</h2>
                <a href="/whales" className="view-all-link">View All →</a>
              </div>
              <div className="whale-trades-grid">
                {whaleTrades.map((trade, i) => (
                  <WhaleTradeCard key={`${trade.transactionHash}-${i}`} trade={trade} />
                ))}
              </div>
            </section>
          )}

          {outliers.length > 0 && (
            <>
              <div className="outlier-list">
                {outliers.slice(0, 5).map((market) => (
                  <div key={market.id} className="outlier-item">
                    <h3>{market.question}</h3>
                    {market.outliers && <OutlierBadge signals={market.outliers} />}
                  </div>
                ))}
              </div>

              <MarketGrid markets={outliers} />
            </>
          )}
        </>
      )}

      <style jsx>{`
        .hero {
          text-align: center;
          margin: 40px 0 60px;
        }

        .hero h1 {
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 16px;
          color: #111827;
        }

        .hero p {
          font-size: 18px;
          color: #6b7280;
          max-width: 700px;
          margin: 0 auto;
        }

        .outlier-stats {
          background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%);
          padding: 32px;
          border-radius: 16px;
          text-align: center;
          margin: 32px 0;
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 48px;
          font-weight: 800;
          color: white;
        }

        .stat-label {
          font-size: 16px;
          color: white;
          opacity: 0.9;
        }

        .outlier-list {
          margin: 32px 0;
        }

        .outlier-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 2px solid #fecaca;
          margin-bottom: 16px;
        }

        .outlier-item h3 {
          font-size: 18px;
          margin-bottom: 12px;
        }

          .loading,
          .empty {
            text-align: center;
            padding: 60px 20px;
            color: #6b7280;
          }

          .whale-alerts {
            margin: 40px 0;
          }

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }

          .section-header h2 {
            font-size: 32px;
            font-weight: 700;
            color: #e5e7eb;
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

          .whale-trades-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            gap: 20px;
            margin-bottom: 60px;
          }

          @media (max-width: 768px) {
            .whale-trades-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
    </div>
  )
}

