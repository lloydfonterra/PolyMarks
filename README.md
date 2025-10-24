# 🎯 Conviction - Smart Money Intelligence Platform

**Decode prediction markets by tracking where smart money flows.**

Conviction is a real-time analytics platform that identifies high-conviction traders on Polymarket, analyzes their behavior patterns, and reveals when institutional capital is making moves.

## Features

### 🐋 Whale Detection & Tracking
- **Real-time trade monitoring** - Catch large positions the moment they execute
- **Wallet clustering** - Group related addresses using behavioral analysis
- **Fund flow analysis** - Track capital movements across wallets

### 🧠 Smart Money Intelligence
- **Conviction Meter** - Quantifies when traders are actually committed vs. testing liquidity
- **Pattern Recognition** - Identifies trading signatures that precede price moves
- **Insider Detection** - Flags coordinated group behavior and potential front-running

### 📊 Trader Leaderboards
- **Win Rate Tracking** - See who's actually making money
- **Capital Efficiency** - ROI per dollar deployed
- **Trading Volume** - Total positions and frequency
- **Follow Top Traders** - Auto-mirror successful strategies

### 🔄 Cross-Market Arbitrage
- **Multi-Market Tracking** - Compare prices across Polymarket, Kalshi, Manifold
- **Misprice Detection** - Spot discrepancies and arbitrage opportunities
- **Correlation Analysis** - Find related markets moving together

### ⚡ Real-Time Alerts
- **Customizable Alerts** - Whale trades, sentiment spikes, conviction changes
- **Multi-Channel** - Email, SMS, in-app notifications
- **Smart Grouping** - Get notified about coordinated movement

## Tech Stack

**Frontend**: Next.js 14, TailwindCSS, shadcn/ui, Recharts
**Backend**: FastAPI (Python), async WebSockets
**Data**: PostgreSQL, Redis, The Graph, Polymarket API
**ML**: scikit-learn, pandas
**Deployment**: Docker, Railway/Vercel

## Project Structure

```
conviction/
├── backend/           # FastAPI services
├── frontend/          # Next.js dashboard
├── data-pipeline/     # Data ingestion & processing
├── docs/              # Architecture & guides
└── docker-compose.yml # Local development
```

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Quick Start

```bash
# Clone and setup
git clone <repo>
cd conviction

# Backend setup
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# Visit http://localhost:3000
```

## Development Roadmap

### Phase 1: MVP (4-6 weeks)
- [x] Project initialization
- [ ] Polymarket API integration
- [ ] Real-time trade streaming
- [ ] Wallet clustering engine
- [ ] Basic dashboard
- [ ] Leaderboard system

### Phase 2: Advanced Analytics (6-8 weeks)
- [ ] ML predictive models
- [ ] Cross-market arbitrage detection
- [ ] Advanced conviction metrics
- [ ] Custom alerts & notifications

### Phase 3: Social Features (4-6 weeks)
- [ ] Follow-the-trader system
- [ ] Strategy replication
- [ ] Community features
- [ ] API for external integrations

## Architecture

```
┌─────────────────────┐
│  Next.js Dashboard  │
│   (Real-time UI)    │
└────────┬────────────┘
         │ WebSocket
┌────────▼──────────────────┐
│    FastAPI Backend        │
│  ✓ Wallet Clustering      │
│  ✓ Signal Detection       │
│  ✓ Conviction Metrics     │
└────────┬──────────────────┘
         │
    ┌────┴──────┐
    ▼           ▼
┌────────┐ ┌──────────────┐
│ Redis  │ │ PostgreSQL   │
│ Cache  │ │ (Historical) │
└────────┘ └──────────────┘
    ▲              ▲
    └──────┬───────┘
           │ Data Ingestion
    ┌──────┴────────────────┬─────────┐
    ▼                       ▼         ▼
┌────────┐        ┌──────────────┐ ┌─────────┐
│The Graph│       │Polymarket API│ │Economic │
│Subgraph │       │ Real-time    │ │ Feeds   │
└────────┘       └──────────────┘ └─────────┘
```

## Contributing

This is a solo project. Contributions welcome via PR!

## License

MIT

---

**Built with ❤️ to make smarter predictions**
