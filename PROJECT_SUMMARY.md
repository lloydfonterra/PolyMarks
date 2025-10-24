# Conviction - Smart Money Intelligence Platform ✨
## Project Summary & Status

---

## 🎯 Project Overview

**Conviction** is a real-time analytics platform for Polymarket prediction markets that:
- 🐋 Detects whale traders and large positions
- 🧠 Analyzes smart money behavior patterns
- 📊 Ranks traders on conviction and performance
- 🔔 Provides real-time alerts for high-conviction trades
- 💰 Enables following top traders' positions

**Target Users:** Polymarket traders seeking to understand smart money activity and make more informed decisions

---

## 📁 Project Structure

```
conviction/
├── README.md                          # Main project README
├── docker-compose.yml                 # Docker configuration for local dev
├── PROJECT_SUMMARY.md                 # This file
│
├── backend/
│   ├── requirements.txt                # Python dependencies
│   ├── main.py                         # FastAPI application entry point
│   ├── .env.example                    # Environment variables template
│   │
│   ├── app/
│   │   ├── main.py                     # FastAPI initialization
│   │   ├── models/                     # Pydantic data models
│   │   │   ├── __init__.py
│   │   │   ├── trade.py                # Trade data structures
│   │   │   ├── wallet.py               # Wallet & clustering models
│   │   │   ├── leaderboard.py          # Leaderboard models
│   │   │   └── alert.py                # Alert & notification models
│   │   │
│   │   ├── api/routes/                 # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── health.py               # Health check endpoints
│   │   │   ├── trades.py               # Trade data & WebSocket
│   │   │   ├── wallets.py              # Wallet analysis endpoints
│   │   │   ├── leaderboard.py          # Leaderboard endpoints
│   │   │   └── alerts.py               # Alert management endpoints
│   │   │
│   │   ├── services/                   # Business logic (TO BUILD)
│   │   │   ├── trade_service.py        # Trade processing
│   │   │   ├── wallet_service.py       # Wallet clustering & profiling
│   │   │   ├── conviction_service.py   # Conviction score calculation
│   │   │   ├── alert_service.py        # Alert triggering
│   │   │   └── polymarket_client.py    # Polymarket API integration
│   │   │
│   │   ├── utils/                      # Helper utilities (TO BUILD)
│   │   │   ├── clustering.py           # Wallet clustering algorithms
│   │   │   ├── ml_models.py            # ML predictions
│   │   │   ├── metrics.py              # Performance calculations
│   │   │   └── cache.py                # Redis utilities
│   │   │
│   │   └── db/                         # Database layer (TO BUILD)
│   │       ├── models.py               # SQLAlchemy ORM models
│   │       ├── database.py             # DB connection & session
│   │       └── migrations/             # Alembic migrations
│   │
│   └── tests/                          # Test suite (TO BUILD)
│       ├── unit/
│       ├── integration/
│       └── conftest.py
│
├── frontend/                           # Next.js application (TO BUILD)
│   ├── package.json                    # NPM dependencies
│   ├── next.config.js                  # Next.js configuration
│   ├── .env.example                    # Environment variables
│   │
│   ├── src/
│   │   ├── app/                        # Next.js App Router
│   │   │   ├── layout.tsx              # Root layout
│   │   │   └── page.tsx                # Home dashboard
│   │   │
│   │   ├── components/
│   │   │   ├── TradesFeed.tsx          # Real-time trades
│   │   │   ├── Leaderboard.tsx         # Top traders
│   │   │   ├── WalletProfile.tsx       # Individual wallet view
│   │   │   ├── AlertManager.tsx        # Alert configuration
│   │   │   └── Charts.tsx              # Chart components
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAPI.ts               # API client hook
│   │   │   ├── useWebSocket.ts         # WebSocket connection
│   │   │   └── useLeaderboard.ts       # Leaderboard data
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                  # API client
│   │   │   └── utils.ts                # Utility functions
│   │   │
│   │   └── styles/
│   │       ├── globals.css             # Global styles
│   │       └── components.module.css   # Component styles
│   │
│   └── public/                         # Static assets
│
├── data-pipeline/                      # Data ingestion (TO BUILD)
│   ├── polymarket_client.py            # Polymarket API integration
│   ├── trade_ingester.py               # Trade streaming
│   ├── wallet_analyzer.py              # Wallet analysis
│   └── leaderboard_updater.py          # Leaderboard calculations
│
└── docs/
    ├── ARCHITECTURE.md                 # System design & components
    └── GETTING_STARTED.md              # Development setup guide
```

---

## ✅ Completed Components

### 1. **Project Infrastructure**
- ✅ Git repository initialized
- ✅ Directory structure created
- ✅ Docker Compose setup for local development
- ✅ Requirements.txt with all dependencies

### 2. **Backend Foundation (FastAPI)**
- ✅ Main application initialized (`app/main.py`)
- ✅ CORS middleware configured
- ✅ API route structure established

### 3. **Data Models (Pydantic)**
- ✅ **Trade Model** - Trade data structures
  - Fields: id, market_id, trader_address, amount, price, shares, timestamp, conviction_score
  - Trade types: BUY, SELL
  
- ✅ **Wallet Models**
  - Wallet: address, type, volume, win_rate, trades
  - WalletCluster: grouped wallets with confidence scores
  - WalletProfile: behavioral analysis details
  - WalletType: WHALE, MARKET_MAKER, RETAIL, BOT, UNKNOWN

- ✅ **Leaderboard Models**
  - TraderStats: win_rate, roi, volume, profit metrics
  - LeaderboardEntry: ranked trader with scores

- ✅ **Alert Models**
  - AlertRule: configurable alert triggers
  - Alert: individual notifications
  - AlertType: LARGE_TRADE, WHALE_ACTIVITY, CONVICTION_CHANGE, etc.

### 4. **API Routes (Endpoints)**
- ✅ **Health Routes** (`/api/health/`)
  - GET `/ping` - Quick health check
  - GET `/status` - Detailed system status

- ✅ **Trade Routes** (`/api/trades/`)
  - GET `/recent` - Recent large trades
  - GET `/large` - Whale trades
  - GET `/{market_id}` - Trades for market
  - GET `/wallet/{address}` - Wallet trades
  - WS `/ws/live` - Real-time WebSocket feed

- ✅ **Wallet Routes** (`/api/wallets/`)
  - GET `/profile/{address}` - Wallet profile
  - GET `/clusters` - Identified clusters
  - GET `/cluster/{id}` - Cluster details
  - GET `/whales` - Top whale wallets
  - GET `/emerging` - Rising traders
  - GET `/similar/{address}` - Similar wallets
  - POST `/watch/{address}` - Watch wallet

- ✅ **Leaderboard Routes** (`/api/leaderboard/`)
  - GET `/top` - Top traders
  - GET `/whales` - Whale leaderboard
  - GET `/rising` - Recently improving traders
  - GET `/trader/{address}` - Single trader stats
  - GET `/markets` - Market-specific leaderboard
  - GET `/comparison` - Multi-trader comparison
  - POST `/follow/{address}` - Follow trader
  - GET `/score/{address}` - Conviction score breakdown

- ✅ **Alert Routes** (`/api/alerts/`)
  - GET `/rules` - User's alert rules
  - POST `/rule/create` - Create alert
  - GET `/recent` - Recent alerts
  - GET `/{alert_id}` - Alert details
  - PUT `/rule/{id}` - Update rule
  - DELETE `/rule/{id}` - Delete rule
  - POST `/test/{rule_id}` - Test alert
  - GET `/stats` - Alert statistics

### 5. **Documentation**
- ✅ Comprehensive README.md
- ✅ ARCHITECTURE.md - System design & components
- ✅ GETTING_STARTED.md - Development setup guide
- ✅ Docker Compose configuration

---

## 🚧 To Be Built (Roadmap)

### Phase 1: Core Backend Services (Priority)
1. **Polymarket API Integration** (`data-pipeline/polymarket_client.py`)
   - Real-time trade streaming
   - Order book monitoring
   - Market data fetching
   - Price history

2. **Wallet Clustering Engine** (`app/services/wallet_service.py`)
   - Address clustering algorithm
   - Behavioral pattern analysis
   - Fund flow tracking
   - Confidence scoring

3. **Conviction Meter** (`app/services/conviction_service.py`)
   - Score calculation algorithm
   - Trade size normalization
   - Timing analysis
   - Historical accuracy factor

4. **Trade Ingestion Service** (`app/services/trade_service.py`)
   - Real-time trade processing
   - Database storage (PostgreSQL)
   - Cache updates (Redis)
   - Large trade detection

5. **Database Layer** (`app/db/`)
   - SQLAlchemy ORM models
   - Database connection pooling
   - Migration scripts (Alembic)

### Phase 2: Frontend Dashboard (Next.js)
1. **Real-time Trade Feed**
   - WebSocket connection
   - Trade filtering & sorting
   - Whale trade highlighting
   - Market-specific views

2. **Leaderboard UI**
   - Top traders ranking
   - Performance metrics display
   - Sorting & filtering options
   - Trader detail modals

3. **Wallet Analysis**
   - Behavioral profile visualization
   - Cluster visualization
   - Historical performance charts
   - Win rate analysis

4. **Alert Management**
   - Alert rule creation UI
   - Rule configuration forms
   - Alert history view
   - Notification settings

5. **Charts & Analytics**
   - TradingView integration
   - Performance graphs
   - Volume analysis
   - Win rate charts

### Phase 3: Advanced Features
1. **ML-Based Predictions** (`app/utils/ml_models.py`)
   - Trade outcome prediction
   - Pattern recognition
   - Sentiment analysis

2. **Cross-Market Arbitrage**
   - Multi-market price tracking
   - Misprice detection
   - Arbitrage opportunity identification

3. **Alert System** (`app/services/alert_service.py`)
   - Email notifications
   - SMS alerts (Twilio)
   - In-app notifications
   - Webhook support

4. **Authentication & Accounts**
   - User registration
   - JWT authentication
   - Preferences storage
   - Portfolio tracking

---

## 📊 API Documentation

### Available at: `http://localhost:8000/docs`

**Auto-generated OpenAPI/Swagger documentation** with:
- Interactive endpoint testing
- Request/response examples
- Parameter descriptions
- Schema definitions

---

## 🔧 Tech Stack

**Backend:**
- FastAPI 0.104.1 - Web framework
- Python 3.11+ - Language
- PostgreSQL 15 - Database
- Redis 7 - Cache
- SQLAlchemy 2.0 - ORM
- Pydantic 2.5 - Data validation

**Frontend:**
- Next.js 14 - React framework
- TailwindCSS - Styling
- shadcn/ui - Component library
- Recharts - Charts
- Axios - HTTP client
- WebSockets - Real-time

**Data:**
- Polymarket CLOB API
- The Graph (optional)
- Pandas - Data analysis
- Scikit-learn - ML

**DevOps:**
- Docker - Containerization
- Docker Compose - Orchestration
- PostgreSQL - Database
- Redis - Cache

---

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
cd conviction
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
# API Health: http://localhost:8000/api/health/ping
```

### Local Development

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## 📈 Performance Targets

- Trade ingestion latency: < 2 seconds
- WebSocket update latency: < 500ms
- API response time (p95): < 500ms
- Wallet clustering: Every 10 minutes
- Max concurrent connections: 1,000+

---

## 🎯 Key Metrics to Track

1. **Whale Detection Accuracy**
   - Precision: Correctly identify whales
   - Recall: Catch all major players
   
2. **Conviction Score Effectiveness**
   - Correlation with actual trade outcomes
   - Top traders' win rates
   
3. **Platform Performance**
   - API response times
   - WebSocket latency
   - Database query performance

4. **User Engagement**
   - Active users
   - Alerts created/used
   - Traders followed

---

## 📝 Next Immediate Steps

### Day 1-2: Core Backend Services
- [ ] Implement Polymarket CLOB API client
- [ ] Build real-time trade ingestion service
- [ ] Set up PostgreSQL database & Alembic migrations
- [ ] Implement Redis caching layer

### Day 3-4: Wallet Analysis
- [ ] Build wallet clustering algorithm
- [ ] Implement conviction score calculation
- [ ] Create wallet profiling service
- [ ] Set up batch processing for metrics

### Day 5: API Integration & Testing
- [ ] Connect all services to API routes
- [ ] Add database persistence
- [ ] Write unit tests for core functions
- [ ] Test WebSocket streaming

### Day 6-7: Frontend MVP
- [ ] Build Next.js project structure
- [ ] Create dashboard layout
- [ ] Implement WebSocket connection
- [ ] Build trades feed component
- [ ] Build leaderboard component

---

## 📚 Documentation

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System design & components
- **[Getting Started](./docs/GETTING_STARTED.md)** - Development setup
- **[API Docs](http://localhost:8000/docs)** - Interactive Swagger UI

---

## 💡 Key Design Decisions

1. **FastAPI** - Modern async framework, great for real-time
2. **PostgreSQL + Redis** - Durable storage + fast cache
3. **WebSocket for real-time** - Low latency updates to frontend
4. **Modular services** - Easy to test and scale independently
5. **Docker Compose** - Simplified local development

---

## 🤝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/whale-detection

# Make changes
# Test locally
# Commit
git add .
git commit -m "Add whale detection"
git push origin feature/whale-detection

# Create Pull Request
```

---

## 📞 Support

- **Polymarket Docs:** https://docs.polymarket.com
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **Next.js Docs:** https://nextjs.org/docs
- **Docker Docs:** https://docs.docker.com

---

## ⚖️ License

MIT

---

**Built with ❤️ for smarter prediction markets**

Last Updated: October 24, 2025
