# Market Whale Sentiment Feature Module

## Purpose
Analyzes and displays whale activity (large trades) for individual markets, showing smart money sentiment and divergence from retail.

## Features
- **Whale Activity Tracking**: Counts unique whales per market
- **Sentiment Analysis**: Calculates bullish/bearish sentiment based on buy/sell ratio
- **Volume Metrics**: Shows total whale volume and average trade size
- **Divergence Detection**: Compares whale sentiment vs retail (market price)
- **Real-time Updates**: Tracks last 24h activity

## Components

### `WhaleActivityBadge`
Displays whale sentiment for a market in a compact badge format.

**Props:**
- `eventSlug` (string): Market identifier (e.g., "trump-2024")
- `marketPrice?` (number): Current market probability (0-1) for divergence calculation
- `compact?` (boolean): Show compact view (default: false)

**Example:**
```tsx
<WhaleActivityBadge 
  eventSlug="trump-2024" 
  marketPrice={0.65} 
  compact={false}
/>
```

## Utilities

### `calculateMarketWhaleActivity()`
Fetches and analyzes whale trades for a specific market.

**Returns:** `MarketWhaleActivity | null`
```typescript
{
  uniqueWhales: 8,
  totalTrades: 23,
  totalVolume: 185000,
  avgTradeSize: 8043,
  buyVolume: 142000,
  sellVolume: 43000,
  buyRatio: 0.768, // 76.8% buying
  sentiment: 'BULLISH',
  sentimentStrength: 'STRONG',
  divergence: +11.8, // Whales are 11.8% more bullish than retail
  last24hVolume: 58000,
  last24hTrades: 7,
  isActive: true
}
```

### `formatSentiment()`
Formats sentiment data for display (emoji, color, label).

## Sentiment Logic

- **STRONG BULLISH**: buyRatio ≥ 85% (🔥 green)
- **BULLISH**: buyRatio ≥ 70% (📈 light green)
- **NEUTRAL**: buyRatio 30-70% (⚖️ gray)
- **BEARISH**: buyRatio ≤ 30% (📉 light red)
- **STRONG BEARISH**: buyRatio ≤ 15% (🧊 red)

## Integration

### In Market Cards
```tsx
import { WhaleActivityBadge } from '@features/market-whale-sentiment'

<MarketCard market={market}>
  <WhaleActivityBadge 
    eventSlug={market.id} 
    marketPrice={market.outcomes[0]?.probability}
    compact={true}
  />
</MarketCard>
```

### In Market Detail Pages
```tsx
<WhaleActivityBadge 
  eventSlug={marketId} 
  marketPrice={currentPrice}
  compact={false} // Full stats view
/>
```

## Data Source
- Uses `tradesClient` from `@core/api`
- Fetches trades via `/api/trades?eventId={slug}`
- Minimum trade size: $1,000+
- Time range: Last 7 days
- Limit: 200 trades per market

## Performance
- Async loading with loading state
- Caches via Next.js fetch (30s revalidation)
- Only renders if whale activity exists (no badge if no whales)
- Compact mode for performance on large lists

## Future Enhancements
- Historical sentiment charts
- Whale vs retail comparison graphs
- Alert when sentiment changes dramatically
- Individual whale profiles linked from badge

