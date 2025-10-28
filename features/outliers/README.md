# Outliers Feature Module

**Detect unusual trading activity and smart money movements**

## What This Module Does

- Identifies markets with unusual volume spikes
- Detects large bet sizes (whale activity)
- Flags significant odds changes
- Provides "smart money" insights

## Files Structure

```
outliers/
├── lib/
│   └── detection.ts      # Outlier detection algorithms
├── components/
│   └── OutlierBadge.tsx  # UI badge for outlier markets
└── index.ts              # Public API
```

## Detection Criteria

1. **Volume Spike**: 24h volume > 3x average
2. **Big Bet**: Last bet > 10x average bet size
3. **Odds Shift**: Price change > 10% in 24h
4. **Whale Activity**: Bets > $10K

## Usage

```typescript
import { detectOutliers, OutlierBadge } from '@features/outliers'

const outliers = detectOutliers(markets)
```

This is your unique value prop - what makes you different from Polymarket!

