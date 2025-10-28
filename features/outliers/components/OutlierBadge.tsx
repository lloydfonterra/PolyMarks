/**
 * OUTLIER BADGE COMPONENT
 * Visual indicator for unusual market activity
 */

import type { OutlierSignal } from '../lib/detection'

interface OutlierBadgeProps {
  signals: OutlierSignal[]
}

export function OutlierBadge({ signals }: OutlierBadgeProps) {
  if (signals.length === 0) return null

  // Get the most severe signal
  const topSignal = signals.sort((a, b) => b.severity - a.severity)[0]

  // Determine badge color based on confidence
  const getColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return '#ef4444' // Red
      case 'medium':
        return '#f59e0b' // Orange
      case 'low':
        return '#3b82f6' // Blue
      default:
        return '#6b7280' // Gray
    }
  }

  // Icon based on signal type
  const getIcon = (type: string) => {
    switch (type) {
      case 'volume_spike':
        return '📈'
      case 'odds_shift':
        return '⚡'
      case 'high_conviction':
        return '🎯'
      case 'whale_activity':
        return '🐋'
      default:
        return '🔥'
    }
  }

  return (
    <div className="outlier-badge-container">
      <div 
        className="outlier-badge"
        style={{ backgroundColor: getColor(topSignal.confidence) }}
        title={signals.map(s => s.reason).join('\n')}
      >
        <span className="badge-icon">{getIcon(topSignal.type)}</span>
        <span className="badge-text">Smart Money Alert</span>
      </div>
      
      {/* Show all signals */}
      <div className="signals-list">
        {signals.map((signal, index) => (
          <div key={index} className="signal-item">
            <span className="signal-icon">{getIcon(signal.type)}</span>
            <span className="signal-reason">{signal.reason}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .outlier-badge-container {
          margin: 12px 0;
        }

        .outlier-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .badge-icon {
          font-size: 16px;
        }

        .signals-list {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .signal-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6b7280;
        }

        .signal-icon {
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}

