/**
 * REFERRAL URL GENERATOR
 * Pure function - easy to test
 */

import { config } from '@core/config'

interface ReferralParams {
  eventId: string
  userId?: string
  campaign?: string
}

/**
 * Generate Polymarket referral URL with tracking
 * 
 * @param eventId - Polymarket event ID
 * @param options - Optional tracking parameters
 * @returns Full URL with UTM parameters
 */
export function generateReferralUrl(
  eventId: string,
  options?: { userId?: string; campaign?: string }
): string {
  const baseUrl = 'https://polymarket.com/event'
  
  // Build query parameters
  const params = new URLSearchParams({
    utm_source: config.referralSource,
    utm_medium: 'referral',
    utm_campaign: options?.campaign || 'market',
  })

  // Add user ID if provided (for tracking which user sent traffic)
  if (options?.userId) {
    params.set('utm_content', options.userId)
  }

  return `${baseUrl}/${eventId}?${params.toString()}`
}

/**
 * Track referral click (future implementation)
 * Could send to analytics service
 */
export async function trackReferralClick(eventId: string, userId?: string): Promise<void> {
  // TODO: Implement analytics tracking
  // Could send to Mixpanel, Plausible, etc.
  console.log('[Referral] Click tracked:', { eventId, userId })
}

/**
 * Validate if URL is a valid Polymarket URL
 */
export function isPolymarketUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.hostname === 'polymarket.com'
  } catch {
    return false
  }
}

