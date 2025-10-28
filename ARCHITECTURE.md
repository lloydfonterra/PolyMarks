# 🏗️ Architecture Documentation

**Modular, isolated, maintainable.**

## Design Principles

### 1. Feature Isolation

Each feature is **completely self-contained**:

```
features/markets/
├── components/      # UI (private to feature)
├── lib/            # Logic (private to feature)
├── hooks/          # React hooks (private to feature)
└── index.ts        # PUBLIC API (only this is exposed)
```

**✅ Benefits:**
- Edit one feature without breaking others
- Easy to test in isolation
- Easy to add/remove features
- Clear dependencies

### 2. Core vs Features

**core/** = Shared utilities used by ALL features
- API clients (Polymarket, Helius)
- Type definitions
- Configuration

**features/** = Business logic, isolated
- markets = Display markets
- outliers = Detect smart money
- wallet-tracker = Track Solana wallets
- referral = Generate tracking URLs

**app/** = Thin routing layer
- Just connects features together
- Minimal logic
- Next.js routes

### 3. Dependency Rules

```
app/          → can import from → features/ + core/
features/     → can import from → core/ (NOT other features)
core/         → can import from → nothing (pure utilities)
```

**Example - GOOD:**
```typescript
// features/markets/components/MarketCard.tsx
import { polymarketClient } from '@core/api'          // ✅
import { generateReferralUrl } from '@features/referral' // ✅
```

**Example - BAD:**
```typescript
// core/api/polymarket.client.ts
import { MarketCard } from '@features/markets' // ❌ NEVER!
```

## Module Boundaries

### Core Module

**Purpose:** Shared utilities, no business logic

**Exports:**
```typescript
// API clients
export { polymarketClient, heliusClient }

// Types
export type { PolymarketMarket, SolanaWallet }

// Config
export { config }
```

**Rules:**
- Pure functions only
- No React components
- No feature-specific logic
- Can be extracted to npm package

### Feature Modules

**Purpose:** Self-contained business logic

**Structure:**
```
features/[feature-name]/
├── README.md         # What this feature does
├── components/       # React components (private)
├── lib/              # Pure functions (private)
├── hooks/            # React hooks (private)
└── index.ts          # Public API
```

**Rules:**
- Only `index.ts` exports are public
- No importing from other features' internals
- Can be deleted without affecting other features

### App Module

**Purpose:** Route pages that connect features

**Rules:**
- Minimal logic
- Just orchestrates features
- No business logic
- Uses Client Components for interactivity

## File Naming Conventions

```
# Components (PascalCase)
MarketCard.tsx
OutlierBadge.tsx

# Utilities (camelCase)
filters.ts
sorting.ts
detection.ts

# Types (camelCase + .types)
market.types.ts
wallet.types.ts

# Hooks (camelCase + use prefix)
useMarkets.ts
useWalletTracker.ts

# Public API (always index)
index.ts
```

## Adding New Features

### Example: Add "Analytics" Feature

```bash
# 1. Create feature directory
mkdir -p features/analytics/{components,lib}

# 2. Create README
echo "# Analytics Feature" > features/analytics/README.md

# 3. Build feature (isolated!)
# - Add components/
# - Add lib/
# - Add hooks/

# 4. Create public API
touch features/analytics/index.ts

# 5. Use in app
# app/analytics/page.tsx imports from @features/analytics
```

**That's it!** No other files need to change.

## Testing Strategy

### Unit Tests (per feature)

```typescript
// features/markets/lib/filters.test.ts
import { filterBySearch } from './filters'

test('filters markets by search query', () => {
  const markets = [
    { question: 'Will Trump win?' },
    { question: 'Will Bitcoin hit $100K?' },
  ]
  
  const result = filterBySearch(markets, 'trump')
  expect(result).toHaveLength(1)
})
```

**Benefits:**
- Test features in isolation
- No mocking needed (pure functions)
- Fast tests

### Integration Tests

```typescript
// app/page.test.tsx
import { render } from '@testing-library/react'
import HomePage from './page'

test('renders market grid', () => {
  const { getByText } = render(<HomePage />)
  expect(getByText('plymrkt')).toBeInTheDocument()
})
```

## Performance Optimizations

### 1. Code Splitting

Each page only loads features it uses:

```typescript
// app/page.tsx
import { MarketGrid } from '@features/markets'  // ✅ Only loads markets

// app/outliers/page.tsx  
import { detectOutliers } from '@features/outliers' // ✅ Only loads outliers
```

Next.js automatically code-splits!

### 2. API Caching

```typescript
// core/api/polymarket.client.ts
const response = await fetch(url, {
  next: { revalidate: 60 } // Cache for 60 seconds
})
```

### 3. Lazy Loading

```typescript
// Future: Lazy load heavy features
const WalletTracker = lazy(() => import('@features/wallet-tracker'))
```

## Maintenance Guide

### Updating a Feature

```bash
# 1. Locate feature
cd features/markets

# 2. Make changes (only affects this feature!)
# - Edit components/
# - Edit lib/
# - Edit index.ts if needed

# 3. Test in isolation
npm test features/markets

# 4. Done! No other features affected
```

### Removing a Feature

```bash
# 1. Delete feature directory
rm -rf features/analytics

# 2. Remove imports from app/
# - Search for '@features/analytics'
# - Remove from routes

# 3. Done!
```

### Refactoring

**Move logic to core:**
```bash
# If multiple features need same utility:
mv features/markets/lib/formatNumber.ts core/utils/
```

**Extract feature:**
```bash
# If feature grows too big, split it:
features/markets/ →
  features/markets-display/
  features/markets-filters/
```

## Key Takeaways

✅ **Each feature is isolated**
✅ **Edit without breaking others**
✅ **Easy to test**
✅ **Easy to add/remove**
✅ **Clear dependencies**
✅ **Maintainable long-term**

This architecture scales from MVP to production! 🚀

