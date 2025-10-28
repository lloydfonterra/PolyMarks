# Architecture

PolyMarks follows a modular, feature-based architecture for scalability and maintainability.

## Project Structure

```
polymarks/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage (3D landing)
│   ├── markets/           # Markets dashboard
│   ├── whales/            # Whale tracker
│   ├── outliers/          # Smart money signals
│   ├── market/[slug]/     # Individual market pages
│   └── api/               # API routes (proxies)
│       ├── markets/       # Polymarket markets proxy
│       └── trades/        # Polymarket trades proxy
├── core/                   # Shared utilities
│   ├── api/               # API clients
│   ├── config/            # Environment config
│   └── types/             # TypeScript types
├── features/               # Feature modules
│   ├── markets/           # Market listing & filtering
│   ├── whales/            # Whale tracking
│   ├── outliers/          # Smart money detection
│   ├── referral/          # Polymarket referral URLs
│   └── market-whale-sentiment/  # Market sentiment
├── components/            # Shared UI components
└── hooks/                 # Custom React hooks
```

## Design Principles

### 1. **Feature Modules**
Each feature is self-contained with:
- Types
- Business logic
- Components
- README documentation

Example: `features/whales/`
```
whales/
├── README.md              # Feature documentation
├── components/
│   ├── WhaleTradeCard.tsx
│   └── index.ts
├── lib/                   # Business logic (if needed)
└── index.ts               # Public API
```

### 2. **Core Module**
Shared utilities used across features:
- API clients (Polymarket, Helius)
- TypeScript types
- Environment configuration

### 3. **API Routes as Proxies**
Next.js API routes proxy external APIs to:
- Avoid CORS issues
- Hide API keys (server-side only)
- Add caching/rate limiting

Example: `/api/markets` → `gamma-api.polymarket.com/markets`

### 4. **Client vs Server Components**
- **Server Components:** Data fetching, initial render
- **Client Components:** Interactivity, real-time updates

## Data Flow

```
User Request
    ↓
Next.js Page (Server Component)
    ↓
API Route (/api/markets)
    ↓
External API (Polymarket)
    ↓
Transform Data (core/api clients)
    ↓
Feature Module (features/markets)
    ↓
UI Component
    ↓
User
```

## State Management

- **Server State:** React Server Components + `fetch` with caching
- **Client State:** React `useState` + `useEffect`
- **Real-Time:** Polling with `setInterval`

No external state library needed (keeping it simple).

## Performance Optimizations

1. **Next.js Caching:**
   - `next: { revalidate: 60 }` for markets (1 min cache)
   - `next: { revalidate: 30 }` for trades (30 sec cache)

2. **Incremental Static Regeneration (ISR):**
   - Markets dashboard pre-rendered
   - Revalidates in background

3. **API Rate Limiting:**
   - Removed market-specific whale fetching from grid
   - Only fetch on detail pages
   - Prevents 429/500 errors

4. **Lazy Loading:**
   - Three.js components lazy loaded
   - Heavy dependencies code-split

