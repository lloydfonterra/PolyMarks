import { NextRequest, NextResponse } from 'next/server'

/**
 * TRADES API ROUTE
 * Proxies requests to Polymarket's trades API for whale tracking
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const eventId = searchParams.get('eventId')
  const limit = searchParams.get('limit') || '20'
  const offset = searchParams.get('offset') || '0'
  const filterType = searchParams.get('filterType') || 'CASH'
  const filterAmount = searchParams.get('filterAmount') || '1000'

  try {
    let url = `https://data-api.polymarket.com/trades?limit=${limit}&offset=${offset}&filterType=${filterType}&filterAmount=${filterAmount}`
    
    // Add eventId if provided (for specific market)
    if (eventId) {
      url += `&eventId=${eventId}`
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 30 }, // Cache for 30 seconds (trades are real-time)
    })

    if (!response.ok) {
      throw new Error(`Polymarket Trades API error: ${response.status}`)
    }

    const trades = await response.json()

    // Transform trades to add calculated fields
    const transformedTrades = trades.map((trade: any) => ({
      ...trade,
      totalValue: trade.size * trade.price,
    }))

    return NextResponse.json(transformedTrades)
  } catch (error) {
    console.error('Error fetching trades:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    )
  }
}

