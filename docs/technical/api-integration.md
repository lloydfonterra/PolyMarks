# API Integration

PolyMarks integrates with multiple external APIs.

## Polymarket Gamma API (Markets)

**Endpoint:** `https://gamma-api.polymarket.com/markets`

**Used For:** Fetching market data (questions, odds, volume, liquidity)

**Parameters:**
- `limit` - Number of markets to fetch (default: 100, max: 500)
- `closed` - Filter closed markets (default: false)
- `active` - Filter active markets (default: true)

**Sample Request:**
```bash
GET https://gamma-api.polymarket.com/markets?limit=100&closed=false&active=true
```

**Response Format:**
```json
{
  "data": [
    {
      "id": "...",
      "question": "Will Trump win 2024?",
      "description": "...",
      "outcomes": ["Yes", "No"],
      "volume": 1234567.89,
      "liquidity": 98765.43,
      "end_date": "2024-11-05T00:00:00Z",
      "slug": "trump-wins-2024",
      ...
    }
  ]
}
```

**Our Proxy:** `/api/markets`

## Polymarket Data API (Trades)

**Endpoint:** `https://data-api.polymarket.com/trades`

**Used For:** Fetching whale trades

**Parameters:**
- `limit` - Number of trades (default: 50, max: 200)
- `offset` - Pagination offset
- `filterType` - Filter by type (CASH)
- `filterAmount` - Minimum trade size (USD)
- `eventId` - Filter by market slug

**Sample Request:**
```bash
GET https://data-api.polymarket.com/trades?limit=50&filterType=CASH&filterAmount=1000
```

**Response Format:**
```json
[
  {
    "proxyWallet": "0x1ff26...",
    "name": "WhaleKing",
    "side": "BUY",
    "size": 10000,
    "price": 0.65,
    "totalValue": 6500,
    "title": "Trump wins 2024?",
    "slug": "trump-wins-2024",
    "eventSlug": "trump-wins-2024",
    "transactionHash": "0xabc123...",
    "timestamp": 1699564800,
    ...
  }
]
```

**Our Proxy:** `/api/trades`

## Helius RPC (Solana)

**Endpoint:** `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`

**Used For:** Future Solana wallet tracking features

**Sample Request:**
```bash
POST https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getBalance",
  "params": ["wallet_address"]
}
```

**Currently:** Not actively used, prepared for future features

## CORS & Proxying

All external API calls go through Next.js API routes to avoid CORS:

**Before (CORS Error):**
```typescript
// ❌ Browser → External API (blocked by CORS)
fetch('https://gamma-api.polymarket.com/markets')
```

**After (Proxy):**
```typescript
// ✅ Browser → Next.js API Route → External API
fetch('/api/markets')
```

## Rate Limiting

**Polymarket APIs:**
- No official rate limit published
- We observed 429 errors when fetching whale data for 100+ markets simultaneously
- **Solution:** Disabled parallel market-whale fetching, only fetch on detail pages

**Best Practices:**
- Cache responses (60s for markets, 30s for trades)
- Batch requests when possible
- Use pagination (limit + offset)

## Error Handling

```typescript
try {
  const response = await fetch('/api/markets?limit=100')
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  const data = await response.json()
  return transformMarkets(data)
} catch (error) {
  console.error('Error fetching markets:', error)
  return [] // Graceful fallback
}
```

Always return empty arrays/null instead of throwing to prevent UI crashes.

