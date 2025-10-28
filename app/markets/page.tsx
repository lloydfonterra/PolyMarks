/**
 * MARKETS PAGE (moved from home)
 * Shows all markets with filters
 */

'use client'

import { useState, useEffect } from 'react'
import { polymarketClient } from '@core/api'
import { MarketGrid, MarketFilters, applyFilters, sortMarkets } from '@features/markets'
import { analyzeMarket } from '@features/outliers'
import type { PolymarketMarket, MarketFilters as Filters } from '@core/types'

export default function MarketsPage() {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([])
  const [filteredMarkets, setFilteredMarkets] = useState<PolymarketMarket[]>([])
  const [filters, setFilters] = useState<Filters>({})
  const [loading, setLoading] = useState(true)

  // Fetch markets on mount
  useEffect(() => {
    async function fetchMarkets() {
      setLoading(true)
      try {
        const data = await polymarketClient.getMarkets(500)
        
        // Analyze each market for outliers
        const analyzed = data.map(analyzeMarket)
        
        setMarkets(analyzed)
        setFilteredMarkets(analyzed)
      } catch (error) {
        console.error('Error fetching markets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMarkets()
  }, [])

  // Apply filters when they change
  useEffect(() => {
    let filtered = applyFilters(markets, filters)
    
    if (filters.sortBy) {
      filtered = sortMarkets(filtered, filters.sortBy)
    }
    
    setFilteredMarkets(filtered)
  }, [filters, markets])

  return (
    <div className="container">
      {/* Page Header */}
      <section className="page-header">
        <h1>Prediction Markets</h1>
        <p>
          Browse and analyze 100+ live Polymarket events. Filter, sort, and track smart money movements.
        </p>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stat-card">
          <div className="stat-value">{markets.length}</div>
          <div className="stat-label">Live Markets</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {markets.filter((m: any) => m.isOutlier).length}
          </div>
          <div className="stat-label">Smart Money Alerts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">$0</div>
          <div className="stat-label">Cost to Use</div>
        </div>
      </section>

      {/* Filters */}
      <MarketFilters 
        onFiltersChange={setFilters}
        initialFilters={filters}
      />

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <p>Loading markets...</p>
        </div>
      )}

      {/* Markets Grid */}
      {!loading && (
        <MarketGrid 
          markets={filteredMarkets}
          emptyMessage="No markets match your filters"
        />
      )}

      <style jsx>{`
        .page-header {
          text-align: center;
          margin: 20px 0 40px;
        }

        .page-header h1 {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-header p {
          font-size: 16px;
          color: #9ca3af;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 32px 0;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
          backdrop-filter: blur(10px);
          padding: 28px 24px;
          border-radius: 20px;
          text-align: center;
          border: 1px solid rgba(59, 130, 246, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
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

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.15);
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-value {
          font-size: 44px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          line-height: 1;
        }

        .stat-label {
          font-size: 13px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .loading {
          text-align: center;
          padding: 80px 20px;
          color: #9ca3af;
          font-size: 16px;
        }

        .loading::after {
          content: '...';
          animation: dots 1.5s steps(4, end) infinite;
        }

        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }

        @media (max-width: 768px) {
          .stats {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .page-header h1 {
            font-size: 36px;
          }

          .page-header p {
            font-size: 14px;
          }

          .stat-value {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  )
}

