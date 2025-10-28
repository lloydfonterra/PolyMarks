'use client'

import { useState, useEffect } from 'react'
import { tradesClient } from '@core/api'
import { WhaleTradeCard } from '@features/whales'
import { useWhaleAlerts } from '../../hooks/useWhaleAlerts'
import type { WhaleTrade, WhaleTradeFilters } from '@core/types'

export default function WhalesPage() {
  const [trades, setTrades] = useState<WhaleTrade[]>([])
  const [filters, setFilters] = useState<WhaleTradeFilters>({
    minAmount: 1000,
    side: 'ALL',
    timeRange: '24h',
  })
  const [loading, setLoading] = useState(true)
  const [enableAlerts, setEnableAlerts] = useState(true)

  // Real-time whale alerts
  const { isLive, newTradeCount, clearNewTradeCount } = useWhaleAlerts({
    minAmount: 10000, // Alert for $10k+ trades
    enableNotifications: enableAlerts,
    pollInterval: 20000, // Check every 20 seconds for faster notifications
    enableSound: false, // Can be toggled by user
  })

  useEffect(() => {
    async function fetchTrades() {
      setLoading(true)
      try {
        const data = await tradesClient.getWhaleTrades(filters)
        setTrades(data)
      } catch (error) {
        console.error('Error fetching whale trades:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTrades, 30000)
    return () => clearInterval(interval)
  }, [filters])

  const totalVolume = trades.reduce((sum, t) => sum + t.totalValue, 0)

  // Test notification function
  const showTestNotification = async () => {
    const toast = (await import('react-hot-toast')).default
    toast.success('🐋 $32.5K Whale Trade! WhaleKing bought "Trump wins 2024?" - Click to view more trades above', {
      duration: 6000,
      position: 'top-right',
      style: {
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        color: 'white',
        fontWeight: '600',
        padding: '16px',
        borderRadius: '12px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
      },
    })
  }

  return (
    <div className="container">
      <section className="page-header">
        <div className="header-top">
          <h1>🐋 Whale Tracker</h1>
          <div className="header-controls">
            {isLive && (
              <span className="live-indicator">
                <span className="live-dot"></span>
                UPDATING...
              </span>
            )}
            {newTradeCount > 0 && (
              <span className="new-trades-badge" onClick={clearNewTradeCount}>
                {newTradeCount} New Trade{newTradeCount !== 1 ? 's' : ''}
              </span>
            )}
            <button
              className={`alert-toggle ${enableAlerts ? 'active' : ''}`}
              onClick={() => setEnableAlerts(!enableAlerts)}
              title={enableAlerts ? 'Disable alerts' : 'Enable alerts'}
            >
              {enableAlerts ? '🔔' : '🔕'}
            </button>
            <button
              className="test-notification-btn"
              onClick={showTestNotification}
              title="Test notification"
            >
              🧪 Test
            </button>
          </div>
        </div>
        <p>
          Track large trades and smart money movements on Polymarket in real-time.
          See what the whales are betting on before the crowd.
        </p>
      </section>

      <section className="stats">
        <div className="stat-card">
          <div className="stat-value">{trades.length}</div>
          <div className="stat-label">Whale Trades (24h)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${(totalVolume / 1000000).toFixed(2)}M</div>
          <div className="stat-label">Total Volume</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${(totalVolume / trades.length || 0).toFixed(0)}</div>
          <div className="stat-label">Avg Trade Size</div>
        </div>
      </section>

      <section className="filters">
        <div className="filter-group">
          <label>Minimum Trade Size</label>
          <select
            value={filters.minAmount}
            onChange={(e) => setFilters({ ...filters, minAmount: Number(e.target.value) })}
          >
            <option value="500">$500+</option>
            <option value="1000">$1,000+</option>
            <option value="5000">$5,000+</option>
            <option value="10000">$10,000+</option>
            <option value="50000">$50,000+</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Trade Type</label>
          <select
            value={filters.side}
            onChange={(e) => setFilters({ ...filters, side: e.target.value as any })}
          >
            <option value="ALL">All Trades</option>
            <option value="BUY">Buys Only</option>
            <option value="SELL">Sells Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Time Range</label>
          <select
            value={filters.timeRange}
            onChange={(e) => setFilters({ ...filters, timeRange: e.target.value as any })}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </section>

      {loading && (
        <div className="loading">
          <p>Loading whale trades...</p>
        </div>
      )}

      {!loading && trades.length === 0 && (
        <div className="empty">
          <p>No whale trades found with current filters.</p>
        </div>
      )}

      {!loading && trades.length > 0 && (
        <div className="trades-grid">
          {trades.map((trade, i) => (
            <WhaleTradeCard key={`${trade.transactionHash}-${i}`} trade={trade} />
          ))}
        </div>
      )}

      <style jsx>{`
        .page-header {
          text-align: center;
          margin: 40px 0;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .page-header h1 {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          color: #22C55E;
          letter-spacing: 0.5px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #22C55E;
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .new-trades-badge {
          padding: 8px 16px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: bounce 1s ease-in-out infinite;
        }

        .new-trades-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .alert-toggle {
          padding: 10px 16px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .alert-toggle:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.4);
          transform: scale(1.05);
        }

        .alert-toggle.active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-color: transparent;
        }

        .test-notification-btn {
          padding: 10px 16px;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #a78bfa;
          cursor: pointer;
          transition: all 0.2s;
        }

        .test-notification-btn:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.4);
          transform: scale(1.05);
        }

        .page-header p {
          font-size: 16px;
          color: #9ca3af;
          max-width: 600px;
          margin: 12px auto 0;
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
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.15);
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

        .filters {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin: 32px 0;
          padding: 24px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%);
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }

        .filter-group {
          flex: 1;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group label {
          font-size: 12px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .filter-group select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          font-size: 14px;
          background: rgba(10, 10, 10, 0.5);
          color: #e5e7eb;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-group select option {
          background: #1a1a1a;
          color: #e5e7eb;
        }

        .filter-group select:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(10, 10, 10, 0.7);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-group select:hover {
          border-color: rgba(59, 130, 246, 0.3);
        }

        .loading,
        .empty {
          text-align: center;
          padding: 80px 20px;
          color: #9ca3af;
          font-size: 16px;
        }

        .trades-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .filters {
            flex-direction: column;
          }

          .filter-group {
            min-width: 100%;
          }

          .trades-grid {
            grid-template-columns: 1fr;
          }

          .page-header h1 {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  )
}

