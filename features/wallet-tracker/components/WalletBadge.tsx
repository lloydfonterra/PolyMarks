/**
 * WALLET BADGE COMPONENT
 * Displays wallet reputation and balance
 */

import type { SolanaWallet } from '@core/types'
import { formatWalletAddress, getReputationInfo } from '../lib/tracker'

interface WalletBadgeProps {
  wallet: SolanaWallet
  showBalance?: boolean
}

export function WalletBadge({ wallet, showBalance = true }: WalletBadgeProps) {
  const reputationInfo = getReputationInfo(wallet.reputation)

  return (
    <div className="wallet-badge">
      <div 
        className="reputation-badge"
        style={{ backgroundColor: reputationInfo.color }}
        title={reputationInfo.description}
      >
        {reputationInfo.label}
      </div>
      
      <div className="wallet-info">
        <span className="wallet-address" title={wallet.address}>
          {formatWalletAddress(wallet.address)}
        </span>
        
        {showBalance && (
          <span className="wallet-balance">
            {wallet.balance.toFixed(2)} SOL
          </span>
        )}
      </div>

      <style jsx>{`
        .wallet-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 13px;
        }

        .reputation-badge {
          padding: 4px 8px;
          border-radius: 4px;
          color: white;
          font-weight: 600;
          font-size: 12px;
        }

        .wallet-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .wallet-address {
          color: #111827;
          font-weight: 500;
        }

        .wallet-balance {
          color: #6b7280;
          font-size: 11px;
        }
      `}</style>
    </div>
  )
}

