# 🎯 PolyMarks

**Don't bet blind. Bet smart.**

PolyMarks is a real-time whale tracking and smart money analytics platform for Polymarket prediction markets. Track large trades, analyze market sentiment, and follow the money that actually moves markets.

## Why PolyMarks?

Most Polymarket traders are betting blind. They see current odds, but they don't see **who's moving those odds**.

PolyMarks solves this by:
- 🐋 Tracking every whale trade in real-time ($1K+ customizable)
- 🔔 Sending instant alerts for major moves ($10K+)
- 📊 Analyzing smart money sentiment (STRONG BUY vs BEARISH)
- 📈 Showing market-specific whale activity
- 🎯 Filtering 500+ markets by category and closing date

## Key Features

### 1. **Whale Tracker**
- Real-time feed of large trades ($1K+ configurable)
- Trader profiles with wallet addresses
- Exact trade size, price, and timing
- Direct links to Polygonscan transactions

### 2. **Real-Time Alerts**
- Toast notifications for $10K+ trades
- Auto-refresh every 20 seconds
- "LIVE" indicator when updating
- Optional sound notifications

### 3. **Smart Money Dashboard**
- Markets with unusual activity
- Recent whale trades (top 6)
- Odds shift detection
- Liquidity spike alerts

### 4. **Market Detail Pages**
- Full whale transaction history per market
- Buy vs Sell sentiment analysis
- Unique whale count
- STRONG BUY / BEARISH signals

### 5. **Category Intelligence**
- Auto-categorization via keyword detection
- Politics, Sports, Crypto, Business, Technology
- Color-coded badges
- Smart filtering

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + styled-jsx
- **3D Graphics:** Three.js, @react-three/fiber
- **APIs:** 
  - Polymarket Gamma API (markets)
  - Polymarket Data API (trades)
  - Helius RPC (Solana)
- **Notifications:** react-hot-toast
- **Deployment:** Vercel / Railway

## Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/polymarks.git
cd polymarks

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Helius API key

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## Documentation

- [Quick Start](getting-started/quick-start.md)
- [Features Overview](getting-started/features.md)
- [Architecture](technical/architecture.md)
- [API Integration](technical/api-integration.md)
- [Deployment Guide](deployment/production.md)

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](../CONTRIBUTING.md).

## License

MIT License - see [LICENSE](../LICENSE) for details.

## Links

- **Website:** [your-domain.com]
- **Twitter:** [@polymarksBSC](https://x.com/polymarksBSC)
- **Telegram Bot:** [@PolyMarksAlerts_bot](https://t.me/PolyMarksAlerts_bot)
- **Polymarket:** [polymarket.com](https://polymarket.com)

---

Built with 💙 for the Polymarket community

