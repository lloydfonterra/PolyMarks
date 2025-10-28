import type { WhaleTrade } from '@core/types'
import { generateReferralUrl } from '@features/referral'

interface WhaleTradeCardProps {
  trade: WhaleTrade
}

export function WhaleTradeCard({ trade }: WhaleTradeCardProps) {
  const referralUrl = generateReferralUrl(trade.eventSlug || trade.slug)
  const timeAgo = getTimeAgo(trade.timestamp)
  const formattedValue = formatMoney(trade.totalValue)
  const walletShort = `${trade.proxyWallet.slice(0, 6)}...${trade.proxyWallet.slice(-4)}`

  return (
    <div className="whale-card">
      <div className="whale-header">
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
              className="trader-wallet"
            >
              {walletShort}
            </a>
          </div>
        </div>
        <div className="trade-time">{timeAgo}</div>
      </div>

      <div className="trade-action">
        <span className={`trade-side ${trade.side.toLowerCase()}`}>
          {trade.side === 'BUY' ? '🟢 BOUGHT' : '🔴 SOLD'}
        </span>
        <span className="trade-outcome">{trade.outcome}</span>
      </div>

      <a href={referralUrl} target="_blank" rel="noopener noreferrer" className="market-link">
        <div className="market-info">
          {trade.icon && <img src={trade.icon} alt={trade.title} className="market-icon" />}
          <div className="market-title">{trade.title}</div>
        </div>
      </a>

      <div className="trade-stats">
        <div className="stat">
          <span className="stat-label">Shares</span>
          <span className="stat-value">{formatNumber(trade.size)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Price</span>
          <span className="stat-value">${trade.price.toFixed(3)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Value</span>
          <span className="stat-value highlight">{formattedValue}</span>
        </div>
      </div>

      <div className="trade-footer">
        <a
          href={`https://polygonscan.com/tx/${trade.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="tx-link"
        >
          View Transaction →
        </a>
      </div>

      <style jsx>{`
        .whale-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .whale-card:hover {
          transform: translateY(-2px);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1);
        }

        .whale-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .trader-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .trader-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(59, 130, 246, 0.3);
        }

        .trader-avatar-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          color: white;
        }

        .trader-name {
          font-size: 16px;
          font-weight: 600;
          color: #e5e7eb;
          margin-bottom: 4px;
        }

        .trader-wallet {
          font-size: 12px;
          color: #9ca3af;
          text-decoration: none;
          font-family: monospace;
          transition: color 0.2s;
        }

        .trader-wallet:hover {
          color: #3b82f6;
        }

        .trade-time {
          font-size: 12px;
          color: #6b7280;
        }

        .trade-action {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
        }

        .trade-side {
          font-size: 14px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
        }

        .trade-side.buy {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .trade-side.sell {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .trade-outcome {
          font-size: 14px;
          color: #9ca3af;
          font-weight: 500;
        }

        .market-link {
          display: block;
          text-decoration: none;
          margin-bottom: 16px;
        }

        .market-info {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          background: rgba(10, 10, 10, 0.3);
          border-radius: 12px;
          transition: background 0.2s;
        }

        .market-link:hover .market-info {
          background: rgba(10, 10, 10, 0.5);
        }

        .market-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
        }

        .market-title {
          font-size: 14px;
          color: #e5e7eb;
          font-weight: 500;
          line-height: 1.4;
        }

        .trade-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(59, 130, 246, 0.1);
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 700;
          color: #e5e7eb;
        }

        .stat-value.highlight {
          color: #3b82f6;
          font-size: 18px;
        }

        .trade-footer {
          padding-top: 12px;
          border-top: 1px solid rgba(59, 130, 246, 0.1);
        }

        .tx-link {
          font-size: 13px;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .tx-link:hover {
          color: #2563eb;
        }
      `}</style>
    </div>
  )
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - timestamp

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function formatMoney(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toFixed(0)
}

