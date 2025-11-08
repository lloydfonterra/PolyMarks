/**
 * ENVIRONMENT CONFIGURATION
 * Centralized config - change once, updates everywhere
 */

export const config = {
  // Helius RPC for Solana
  heliusRpcUrl: process.env.HELIUS_RPC_URL || '',
  
  // Polymarket API
  polymarketApiUrl: 'https://gamma-api.polymarket.com',
  
  // App settings
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Referral settings
  referralSource: 'polymarks',
  
  // Feature flags (turn features on/off easily)
  features: {
    walletTracking: true,
    outlierDetection: true,
    analytics: true,
  },
} as const

// Validate required env vars
export function validateEnv() {
  const required = ['HELIUS_RPC_URL']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing env vars: ${missing.join(', ')}`)
    console.warn('Some features may not work properly')
  }
}

