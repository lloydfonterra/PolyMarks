/**
 * WHALE ACTIVITY BADGE COMPONENT
 * Displays whale sentiment for a specific market
 */

'use client'

import { useState, useEffect } from 'react'
import { calculateMarketWhaleActivity, formatSentiment } from '../lib/calculator'
import type { MarketWhaleActivity } from '../types'

interface WhaleActivityBadgeProps {
  eventSlug: string
  marketPrice?: number // Current market probability (0-1)
  compact?: boolean // Compact view for cards
}

export function WhaleActivityBadge({ 
  eventSlug, 
  marketPrice,
  compact = false 
}: WhaleActivityBadgeProps) {
  const [activity, setActivity] = useState<MarketWhaleActivity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivity() {
      setLoading(true)
      const data = await calculateMarketWhaleActivity(eventSlug, marketPrice)
      setActivity(data)
      setLoading(false)
    }

    fetchActivity()
  }, [eventSlug, marketPrice])

  if (loading) {
    return (
      <div className="whale-activity-badge loading">
        <div className="loading-spinner"></div>
        {!compact && <span className="loading-text">Analyzing whales...</span>}
        <style jsx>{`
          .whale-activity-badge.loading {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: ${compact ? '6px 10px' : '12px 16px'};
            background: rgba(59, 130, 246, 0.05);
            border: 1px solid rgba(59, 130, 246, 0.1);
            border-radius: 8px;
            font-size: ${compact ? '11px' : '13px'};
            color: #9ca3af;
          }
          .loading-spinner {
            width: 12px;
            height: 12px;
            border: 2px solid rgba(59, 130, 246, 0.2);
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loading-text {
            font-size: 11px;
          }
        `}</style>
      </div>
    )
  }

  if (!activity || activity.totalTrades === 0) {
    return null // No whale activity, don't show badge
  }

  const sentiment = formatSentiment(activity)
  const formatVolume = (vol: number) => {
    if (vol >= 1_000_000) return `$${(vol / 1_000_000).toFixed(1)}M`
    if (vol >= 1_000) return `$${(vol / 1_000).toFixed(0)}K`
    return `$${vol.toFixed(0)}`
  }

  return (
    <div className="whale-activity-badge">
      <div className="badge-header">
        <span className="emoji">{sentiment.emoji}</span>
        <span className="sentiment-label" style={{ color: sentiment.color }}>
          {sentiment.label}
        </span>
        {!compact && activity.isActive && (
          <span className="live-indicator">● LIVE</span>
        )}
      </div>

      {!compact && (
        <div className="badge-stats">
          <div className="stat">
            <span className="stat-label">🐋 Whales</span>
            <span className="stat-value">{activity.uniqueWhales}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Buy/Sell</span>
            <span className="stat-value" style={{ 
              color: activity.buyRatio >= 0.6 ? '#22C55E' : activity.buyRatio <= 0.4 ? '#EF4444' : '#9CA3AF' 
            }}>
              {(activity.buyRatio * 100).toFixed(0)}% / {((1 - activity.buyRatio) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Volume</span>
            <span className="stat-value">{formatVolume(activity.totalVolume)}</span>
          </div>
          {activity.divergence !== undefined && Math.abs(activity.divergence) > 10 && (
            <div className="stat divergence">
              <span className="stat-label">vs Retail</span>
              <span className="stat-value" style={{ 
                color: activity.divergence > 0 ? '#22C55E' : '#EF4444' 
              }}>
                {activity.divergence > 0 ? '+' : ''}{activity.divergence.toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      )}

      {compact && (
        <div className="badge-compact">
          <span className="compact-stat">
            🐋 {activity.uniqueWhales}
          </span>
          <span className="compact-stat">
            {formatVolume(activity.totalVolume)}
          </span>
          <span className="compact-stat" style={{ 
            color: activity.buyRatio >= 0.6 ? '#22C55E' : activity.buyRatio <= 0.4 ? '#EF4444' : '#9CA3AF' 
          }}>
            {(activity.buyRatio * 100).toFixed(0)}% buy
          </span>
        </div>
      )}

      <style jsx>{`
        .whale-activity-badge {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: ${compact ? '8px' : '12px'};
          padding: ${compact ? '8px 12px' : '16px'};
          margin-top: ${compact ? '12px' : '16px'};
          transition: all 0.3s ease;
        }

        .whale-activity-badge:hover {
          border-color: rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%);
        }

        .badge-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: ${compact ? '0' : '12px'};
        }

        .emoji {
          font-size: ${compact ? '14px' : '18px'};
        }

        .sentiment-label {
          font-size: ${compact ? '11px' : '13px'};
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .live-indicator {
          margin-left: auto;
          font-size: 10px;
          color: #22C55E;
          font-weight: 600;
          letter-spacing: 0.5px;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .badge-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 12px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 14px;
          font-weight: 700;
          color: #e5e7eb;
        }

        .divergence {
          background: rgba(59, 130, 246, 0.05);
          padding: 6px 8px;
          border-radius: 6px;
        }

        .badge-compact {
          display: flex;
          gap: 12px;
          font-size: 11px;
          color: #9ca3af;
        }

        .compact-stat {
          display: flex;
          align-items: center;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .badge-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }
      `}</style>
    </div>
  )
}

