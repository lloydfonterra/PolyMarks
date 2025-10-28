/**
 * MARKETS API ROUTE
 * Proxy for Polymarket API (avoids CORS issues)
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = searchParams.get('limit') || '100'
  const type = searchParams.get('type')
  
  try {
    // Fetch from Polymarket API - filter for active markets only
    const url = `https://gamma-api.polymarket.com/markets?limit=500&closed=false&active=true`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Filter out closed markets (double check)
    const activeMarkets = Array.isArray(data) 
      ? data.filter((m: any) => {
          const endDate = new Date(m.end_date_iso || m.end_date || m.endDate)
          const isFuture = endDate > new Date()
          const notClosed = m.closed !== true
          return isFuture && notClosed
        })
      : []
    
    // If featured, sort by volume and return top 6
    if (type === 'featured') {
      const sorted = activeMarkets.sort((a: any, b: any) => (Number(b.volume) || 0) - (Number(a.volume) || 0))
      return NextResponse.json(sorted.slice(0, 6))
    }
    
    return NextResponse.json(activeMarkets)
  } catch (error) {
    console.error('Error fetching markets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch markets' },
      { status: 500 }
    )
  }
}

