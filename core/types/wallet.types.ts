/**
 * WALLET TYPE DEFINITIONS
 * For Solana wallet tracking via Helius
 */

export interface SolanaWallet {
  address: string
  balance: number
  nftCount?: number
  isWhale?: boolean
  reputation?: 'insider' | 'whale' | 'degen' | 'holder'
}

export interface WalletActivity {
  wallet: string
  marketId: string
  action: 'bet' | 'view'
  amount?: number
  outcome?: string
  timestamp: number
}

