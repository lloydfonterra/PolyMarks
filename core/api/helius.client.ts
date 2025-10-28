/**
 * HELIUS API CLIENT
 * Self-contained module for Solana wallet tracking
 * 
 * USAGE:
 * import { heliusClient } from '@core/api'
 * const balance = await heliusClient.getWalletBalance(address)
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { config } from '@core/config'
import type { SolanaWallet } from '@core/types'

class HeliusClient {
  private connection: Connection | null = null

  constructor() {
    // Lazy initialization - only create connection when needed
    if (config.heliusRpcUrl) {
      this.connection = new Connection(config.heliusRpcUrl, 'confirmed')
    }
  }

  /**
   * Check if Helius is configured
   */
  isAvailable(): boolean {
    return this.connection !== null
  }

  /**
   * Get wallet balance in SOL
   */
  async getWalletBalance(address: string): Promise<number> {
    if (!this.connection) {
      console.warn('Helius RPC not configured')
      return 0
    }

    try {
      const publicKey = new PublicKey(address)
      const balance = await this.connection.getBalance(publicKey)
      return balance / LAMPORTS_PER_SOL
    } catch (error) {
      console.error(`Error fetching balance for ${address}:`, error)
      return 0
    }
  }

  /**
   * Get wallet info with reputation scoring
   */
  async getWalletInfo(address: string): Promise<SolanaWallet> {
    const balance = await this.getWalletBalance(address)

    // Simple reputation logic based on balance
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
  }

  /**
   * Batch fetch multiple wallet balances
   * More efficient than calling getWalletBalance multiple times
   */
  async getMultipleBalances(addresses: string[]): Promise<Map<string, number>> {
    if (!this.connection) {
      console.warn('Helius RPC not configured')
      return new Map()
    }

    const results = new Map<string, number>()

    try {
      const publicKeys = addresses.map(addr => new PublicKey(addr))
      const balances = await Promise.all(
        publicKeys.map(pk => this.connection!.getBalance(pk))
      )

      addresses.forEach((address, index) => {
        results.set(address, balances[index] / LAMPORTS_PER_SOL)
      })
    } catch (error) {
      console.error('Error fetching multiple balances:', error)
    }

    return results
  }

  /**
   * Check if address is valid Solana address
   */
  isValidAddress(address: string): boolean {
    try {
      new PublicKey(address)
      return true
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const heliusClient = new HeliusClient()

