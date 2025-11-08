# Referral Feature Module

**Generate Polymarket referral links with tracking**

## What This Module Does

- Generates Polymarket URLs with UTM parameters
- Tracks referral performance (future)
- Manages referral IDs

## Files Structure

```
referral/
├── lib/
│   └── url-generator.ts   # Pure function for URL generation
└── index.ts               # Public API
```

## Usage

```typescript
import { generateReferralUrl } from '@features/referral'

const url = generateReferralUrl('event-12345')
// https://polymarket.com/event/event-12345?utm_source=polymarks&utm_medium=referral
```

## Revenue

Every click through these links earns us 10-20% of trading fees!

