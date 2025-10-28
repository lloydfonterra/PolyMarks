# Markets Feature Module

**Self-contained module for market listing and display**

## What This Module Does

- Fetches markets from Polymarket API
- Displays markets in grid/list format
- Filters and search functionality
- Market detail pages

## Files Structure

```
markets/
├── components/       # UI components (isolated to this feature)
│   ├── MarketCard.tsx
│   ├── MarketGrid.tsx
│   └── MarketFilters.tsx
├── lib/             # Feature-specific logic
│   ├── filters.ts
│   └── sorting.ts
├── hooks/           # Feature-specific hooks
│   └── useMarkets.ts
└── index.ts         # Public API (what other features can import)
```

## Usage

```typescript
// Other features can use this:
import { MarketGrid, useMarkets } from '@features/markets'

// But they CANNOT access internal components like:
// import { InternalHelper } from '@features/markets/components/Internal' ❌
```

## Dependencies

- `@core/api` - For polymarketClient
- `@core/types` - For type definitions

No dependencies on other features!

