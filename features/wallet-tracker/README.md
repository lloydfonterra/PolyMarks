# Wallet Tracker Feature Module

**Track Solana wallet activity using Helius**

## What This Module Does

- Fetches wallet balances via Helius RPC
- Assigns reputation scores (whale, insider, degen, holder)
- Displays wallet info badges
- Future: Track wallet prediction history

## Files Structure

```
wallet-tracker/
├── lib/
│   └── tracker.ts        # Wallet tracking logic
├── components/
│   └── WalletBadge.tsx   # UI for wallet reputation
└── index.ts              # Public API
```

## Reputation Scoring

- **Whale**: > 10,000 SOL
- **Insider**: 1,000-10,000 SOL
- **Holder**: 10-1,000 SOL  
- **Degen**: < 10 SOL

## Usage

```typescript
import { trackWallet, WalletBadge } from '@features/wallet-tracker'

const wallet = await trackWallet('7xKXtg2CW...')
```

This adds cross-chain intelligence - unique value!

