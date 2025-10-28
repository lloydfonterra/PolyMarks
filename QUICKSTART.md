# ⚡ Quick Start Guide

Get plymrkt running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Helius API key (get free at [helius.dev](https://helius.dev))

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.local.example .env.local

# 3. Edit .env.local - add your Helius API key
# HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
```

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## What You'll See

### Home Page (`/`)
- All Polymarket markets
- Search & filters
- Smart money alerts

### Outliers Page (`/outliers`)
- Markets with unusual activity
- Whale alerts
- Odds movements

### About Page (`/about`)
- How plymrkt works
- Revenue model
- Technology stack

## Project Structure

```
plymrkt/
├── core/              # Shared utilities
│   ├── api/          # Polymarket + Helius clients
│   ├── config/       # App configuration
│   └── types/        # TypeScript types
│
├── features/         # Feature modules (ISOLATED)
│   ├── markets/      # Market display
│   ├── outliers/     # Smart money detection
│   ├── wallet-tracker/ # Solana wallet tracking
│   └── referral/     # Polymarket referrals
│
└── app/              # Next.js routes
    ├── page.tsx      # Home (markets)
    ├── outliers/     # Smart money page
    └── about/        # About page
```

## Key Features

### 🎯 Market Discovery
- Browse 100+ Polymarket markets
- Filter by category, closing time
- Sort by volume, liquidity, trending

### 🔥 Smart Money Detection
- Volume spikes (unusual trading)
- Whale activity (large bets)
- Odds shifts (price movements)
- High conviction (strong consensus)

### 🐋 Wallet Tracking (Solana)
- Track wallet balances via Helius
- Reputation scoring (whale/insider/degen)
- Cross-chain intelligence

### 💰 Referral Revenue
- Every "Trade on Polymarket" link has tracking
- Earn 10-20% of trading fees
- Zero cost to run

## Customization

### Add New Categories

```typescript
// features/markets/components/MarketFilters.tsx
<option value="new-category">New Category</option>
```

### Adjust Outlier Detection

```typescript
// features/outliers/lib/detection.ts
// Change thresholds:
if (ratio > 0.2) // Make this stricter (0.3) or looser (0.1)
```

### Add Your Branding

```typescript
// app/layout.tsx
<h1>🎯 plymrkt</h1> // Change name/emoji
```

## Environment Variables

```bash
# Required
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing

```bash
# Run tests (when added)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## Building for Production

```bash
# Build
npm run build

# Start production server
npm start

# Open http://localhost:3000
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Vercel deployment (recommended)
- Custom domain setup
- Environment configuration
- Monitoring

## Troubleshooting

### Markets not loading?

1. Check Polymarket API is accessible:
   ```bash
   curl https://gamma-api.polymarket.com/markets?limit=1
   ```

2. Check browser console for errors

### Wallet tracking not working?

1. Verify Helius API key in `.env.local`
2. Check Helius dashboard for API limits
3. Wallet feature will gracefully degrade if unavailable

### Build errors?

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

1. ✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand modular structure
2. ✅ Read [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy to Vercel
3. ✅ Add your own features to `features/`
4. ✅ Customize design in `app/globals.css`

## Support

- 📖 Read documentation in project root
- 🐛 Check browser console for errors
- 🔧 Verify environment variables are set

---

**You're ready to build!** 🚀

Total setup time: **5 minutes**

Total cost: **$0-12/year**

Let's go! 💪

