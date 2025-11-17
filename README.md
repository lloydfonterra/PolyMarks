# 🎯 PolyMarks

**Don't bet blind. Bet smart.**

Track smart money movements on Polymarket. See what top traders are betting on before the crowd.

[![Twitter Follow](https://img.shields.io/twitter/follow/polymarksBSC?style=social)](https://x.com/polymarksBSC)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- 🐋 **Whale Tracker** - Real-time feed of $1K+ trades
- 🔔 **Live Alerts** - Toast notifications for $10K+ moves
- 📊 **Markets Dashboard** - 500+ active markets with smart filtering
- 🔥 **Smart Money Signals** - Markets with unusual whale activity
- 📈 **Market Analytics** - Per-market whale sentiment analysis

## 💎 $POLYMARKS Token (Coming Soon)

Hold **20,000,000+ $POLYMARKS** to receive monthly revenue distributions from platform earnings.

[Learn More →](ROADMAP.md#phase-3-token-launch--revenue-sharing)

## 🏗️ Modular Architecture

Each feature is **isolated** in its own module:

```
features/
├── markets/                 # Market listing & display
├── whales/                  # Whale tracking
├── outliers/                # Smart money detection  
├── market-whale-sentiment/  # Market sentiment
├── wallet-tracker/          # Solana wallet tracking
└── referral/                # Polymarket referral system
```

**Each feature is self-contained** - edit one without breaking others!

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/lloydfonterra/polymarks.git
cd polymarks

# Install
npm install

# Setup environment
cp .env.example .env.local
# Add your Helius API key to .env.local

# Run
npm run dev
```

Visit `http://localhost:3000`

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Three.js
- React 18
- Polymarket API
- Helius RPC

## 📚 Documentation

Full documentation available in the [docs](docs/) folder:

- [Quick Start Guide](docs/getting-started/quick-start.md)
- [Features Overview](docs/getting-started/features.md)
- [Architecture](docs/technical/architecture.md)
- [API Integration](docs/technical/api-integration.md)
- [Token & Revenue Sharing](docs/token/revenue-sharing.md)
- [Multi-Chain Expansion](docs/multichain/overview.md)

## 🗺️ Roadmap

See our [Roadmap](ROADMAP.md) for upcoming features including:
- Telegram & Discord notifications (@PolyMarksAlerts_bot)
- Multi-chain RPC expansion (BSC, Polygon, Ethereum)
- $POLYMARKS token launch with revenue sharing
- Advanced whale analytics
- Mobile apps

## 💰 Revenue Model

Pure referral play - send users to Polymarket with tracking:
- No smart contracts
- No blockchain complexity
- Referral fees from Polymarket
- **Revenue shared with $POLYMARKS holders (20M+ tokens)**

## 📦 Cost to Run

- **$12/year** - Domain
- **$0/month** - Vercel/Railway hosting (free tier)
- **$0** - All APIs are free (Polymarket, Helius free tier)

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

## 📝 License

MIT License - see [LICENSE](LICENSE)

## 🔗 Links

- **Website:** [https://www.polymarks.com]
- **Twitter:** [@PolymarksSol](https://x.com/PolymarksSol)
- **Telegram Bot:** [@PolyMarksAlerts_bot](https://t.me/PolyMarksAlerts_bot)
- **Polymarket:** [polymarket.com](https://polymarket.com)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

Built with 💙 for the Polymarket community

