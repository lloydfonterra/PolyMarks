/**
 * WALLET TRACKING LOGIC
 * Uses Helius to track Solana wallets
 */

import { heliusClient } from '@core/api'
import type { SolanaWallet } from '@core/types'

/**
 * Track a single wallet
 */
export async function trackWallet(address: string): Promise<SolanaWallet | null> {
  if (!heliusClient.isAvailable()) {
    console.warn('Helius not configured - wallet tracking disabled')
    return null
  }

  if (!heliusClient.isValidAddress(address)) {
    console.error('Invalid Solana address:', address)
    return null
  }

  try {
    return await heliusClient.getWalletInfo(address)
  } catch (error) {
    console.error('Error tracking wallet:', error)
    return null
  }
}

/**
 * Track multiple wallets efficiently
 */
export async function trackMultipleWallets(addresses: string[]): Promise<SolanaWallet[]> {
  if (!heliusClient.isAvailable()) {
    return []
  }

  // Filter valid addresses
  const validAddresses = addresses.filter(addr => 
    heliusClient.isValidAddress(addr)
  )

  if (validAddresses.length === 0) return []

  try {
    const balances = await heliusClient.getMultipleBalances(validAddresses)
    
    return validAddresses.map(address => {
      const balance = balances.get(address) || 0
      
      // Assign reputation
      let reputation: SolanaWallet['reputation'] = 'holder'
      let isWhale = false

      if (balance > 10000) {
        reputation = 'whale'
        isWhale = true
      } else if (balance > 1000) {
        reputation = 'insider'
      } else if (balance < 10) {
        reputation = 'degen'
      }

      return {
        address,
        balance,
        isWhale,
        reputation,
      }
    })
  } catch (error) {
    console.error('Error tracking multiple wallets:', error)
    return []
  }
}

/**
 * Format wallet address for display (truncate middle)
 */
export function formatWalletAddress(address: string): string {
  if (address.length <= 12) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Get reputation display info
 */
export function getReputationInfo(reputation?: SolanaWallet['reputation']) {
  switch (reputation) {
    case 'whale':
      return {
        label: '🐋 Whale',
        color: '#8b5cf6',
        description: 'Major holder (>10K SOL)',
      }
    case 'insider':
      return {
        label: '💎 Insider',
        color: '#3b82f6',
        description: 'Significant holder (>1K SOL)',
      }
    case 'degen':
      return {
        label: '🎲 Degen',
        color: '#f59e0b',
        description: 'Active trader (<10 SOL)',
      }
    case 'holder':
    default:
      return {
        label: '👤 Holder',
        color: '#10b981',
        description: 'Regular holder',
      }
  }
}

