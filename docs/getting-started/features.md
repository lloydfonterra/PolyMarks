# Features Overview

## 📊 Markets Dashboard

Browse 500+ active Polymarket prediction markets with advanced filtering:

- **Category Filters:** Politics, Sports, Crypto, Business, Technology
- **Closing Time:** Soon (30 days), This Month (60 days), Next 3 Months (180 days)
- **Sort Options:** Volume, Liquidity, Trending, Closing Date
- **Search:** Full-text search across market questions and descriptions

**Key Metrics per Market:**
- Current odds/probability
- 24h volume
- Total volume
- Liquidity
- Days until close

## 🐋 Whale Tracker

Track every large trade on Polymarket in real-time.

**Filter Options:**
- Minimum trade size: $500, $1K, $5K, $10K, $50K
- Trade type: All, Buys Only, Sells Only
- Time range: Last Hour, 24h, 7 Days, All Time

**Trade Information:**
- Trader name and wallet address
- Trade direction (BUY/SELL)
- Number of shares
- Price per share
- Total value
- Market details
- Polygonscan transaction link

## 🔔 Real-Time Alerts

Never miss a major whale move.

**Features:**
- Toast notifications for $10K+ trades
- Auto-refresh every 20 seconds
- "LIVE" indicator when updating
- New trade counter badge
- Enable/disable alerts button
- Optional sound notifications (coming soon)

**Alert Format:**
```
🐋 $32.5K Whale Trade!
WhaleKing bought "Trump wins 2024?"
```

## 🔥 Smart Money Dashboard

Markets with unusual activity and signals.

**What's Tracked:**
- Massive odds shifts
- High liquidity spikes
- Whale accumulation patterns
- Recent top 6 whale trades

**Signal Types:**
- STRONG BUY (85%+ whale buy ratio)
- BULLISH (70%+ whale buy ratio)
- NEUTRAL (30-70%)
- BEARISH (15-30% whale buy ratio)
- STRONG SELL (<15% whale buy ratio)

## 📈 Market Detail Pages

Deep dive into individual markets.

**Market-Specific Data:**
- Full whale transaction history
- Buy vs Sell sentiment
- Unique whale count
- Total whale volume
- Sentiment divergence from retail

**Whale Activity Badge:**
- Color-coded sentiment indicator
- Number of unique whales
- Buy ratio percentage
- Total whale volume

## 🎯 Category Intelligence

Markets are auto-categorized using smart keyword detection.

**Categories:**
- **Politics** 🔴 - Elections, Senate, Trump, Biden
- **Sports** ⚽ - NBA, NFL, World Series, MVP
- **Crypto** 🟠 - BTC, ETH, Solana, DeFi
- **Business** 🔵 - Stocks, Earnings, Recession
- **Technology** 🟣 - AI, OpenAI, Microsoft, Meta

**How It Works:**
- Keyword matching in market questions/descriptions
- Word boundary detection (no false positives)
- Fallback to "Other" category
- Color-coded badges for easy scanning

