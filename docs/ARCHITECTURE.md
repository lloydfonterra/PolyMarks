# Conviction Architecture Guide

## System Overview

Conviction is a real-time Smart Money Intelligence Platform for Polymarket prediction markets. It detects whale activity, clusters related wallets, analyzes trader behavior, and identifies high-conviction trading positions.

```
┌─────────────────────────────────────────────────────────────┐
│                    CONVICTION PLATFORM                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐          ┌──────────────────┐         │
│  │  Next.js Frontend│          │  FastAPI Backend │         │
│  │  (Port 3000)     │◄────────►│  (Port 8000)     │         │
│  └──────────────────┘          └─────────┬────────┘         │
│         │                                  │                 │
│         │ WebSocket (Real-time updates)    │                │
│         │                                  │                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               Core Services                          │   │
│  │  • Trade Ingestion                                   │   │
│  │  • Wallet Clustering & Analysis                      │   │
│  │  • Conviction Scoring                                │   │
│  │  • Alert Management                                  │   │
│  └───────────┬──────────────────────────┬───────────────┘   │
│              │                          │                    │
│   ┌──────────▼──────┐        ┌──────────▼──────────┐        │
│   │  PostgreSQL     │        │   Redis Cache       │        │
│   │  (Historical)   │        │   (Real-time)       │        │
│   └─────────────────┘        └─────────────────────┘        │
│              │                          │                    │
│   ┌──────────▼─────────────────────────▼──────────┐        │
│   │         Data Ingestion Layer                   │        │
│   │  • Polymarket CLOB API                         │        │
│   │  • The Graph (on-chain events)                 │        │
│   │  • Economic data feeds                         │        │
│   └────────────────────────────────────────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Frontend (Next.js)
- **Real-time Dashboard** - Live trade feed, whale detection, market data
- **Leaderboard** - Top traders ranked by conviction, ROI, win rate
- **Wallet Profiles** - Detailed analysis of trader behavior
- **Alert Management** - Create and manage custom alerts
- **Charts** - TradingView integration for price analysis
- **Follow UI** - Auto-mirror positions from top traders

**Key Pages:**
- `/` - Dashboard overview
- `/trades` - Real-time trade feed
- `/leaderboard` - Trader rankings
- `/wallets/{address}` - Wallet detail page
- `/alerts` - Alert configuration
- `/compare` - Multi-trader comparison

### 2. Backend (FastAPI)
**Core Modules:**

#### `app/api/routes/`
- **trades.py** - Trade data and WebSocket streaming
- **wallets.py** - Wallet analysis and clustering
- **leaderboard.py** - Trader rankings and metrics
- **alerts.py** - Alert rules and notifications
- **health.py** - System health checks

#### `app/services/`
- **trade_service.py** - Trade processing and storage
- **wallet_service.py** - Wallet clustering and profiling
- **conviction_service.py** - Conviction score calculation
- **alert_service.py** - Alert triggering and delivery
- **polymarket_client.py** - Polymarket API integration

#### `app/utils/`
- **clustering.py** - Wallet clustering algorithms
- **ml_models.py** - Predictive models
- **metrics.py** - Performance calculations
- **cache.py** - Redis utilities

### 3. Data Pipeline

**Real-time Ingestion:**
1. Poll Polymarket CLOB API every 5 seconds
2. Track trades, order book changes, market status
3. Store in PostgreSQL with Redis cache layer
4. Trigger WebSocket updates to connected clients

**Batch Processing (Every 10 minutes):**
1. Wallet behavior analysis
2. Wallet clustering analysis
3. Conviction score recalculation
4. Performance metrics update
5. Leaderboard recalculation

### 4. Database Schema

**Key Tables:**

```sql
-- Trades table
trades (
  id, market_id, trader_address, amount, price, shares,
  timestamp, is_large_trade, conviction_score
)

-- Wallets table
wallets (
  address, wallet_type, total_volume, win_rate, num_trades,
  first_trade_date, last_trade_date, conviction_score
)

-- Wallet clusters
wallet_clusters (
  cluster_id, primary_wallet, related_wallets, confidence_score,
  created_at, last_updated
)

-- Leaderboard entries
leaderboard_entries (
  rank, trader_address, score, win_rate, total_volume,
  total_profit, roi, is_whale, last_updated
)

-- Alert rules
alert_rules (
  rule_id, user_id, alert_type, min_trade_size,
  conviction_threshold, is_active, created_at
)

-- Alerts
alerts (
  alert_id, rule_id, alert_type, title, message,
  status, created_at, sent_at
)
```

## Key Features

### 1. Whale Detection
- Tracks trades > $10,000 USDC
- Calculates conviction score based on:
  - Trade size relative to market
  - Order timing patterns
  - Wallet history and win rate
  - Market concentration
- **Conviction Score = f(size, timing, history, accuracy)**

### 2. Wallet Clustering
- **Heuristics used:**
  - Same deposit addresses
  - Synchronized trade timing
  - Correlated market selections
  - Fund flows between wallets
- **Output:** Confidence score (0-100) for cluster likelihood

### 3. Smart Money Signals
- **Buy Signals:** Whale accumulation, high-conviction positions
- **Confidence Metrics:** Size, timing, wallet history
- **Predictive Component:** ML model trained on historical wins

### 4. Real-Time Alerts
- **Large Trade Alerts** - Immediately on whale transaction
- **Conviction Changes** - When key wallet shifts conviction
- **Price Thresholds** - Custom price level monitoring
- **Wallet Activity** - Track specific wallets
- **Delivery:** Email, SMS, in-app, webhooks

### 5. Trader Leaderboard
**Ranking Algorithm:**
```
Score = 0.4 * win_rate + 0.3 * roi + 0.2 * volume_norm + 0.1 * consistency
```

**Metrics:**
- Win Rate (% of profitable trades)
- ROI (Return on Investment)
- Volume (Total USDC traded)
- Consistency (Sharpe ratio-like metric)
- Consecutive wins
- Recent performance trend

### 6. Follow-the-Trader
- Clone top traders' positions
- Configurable trade sizes
- Risk management settings
- Performance tracking

## Data Flow

```
┌─────────────────────┐
│ Polymarket API      │
│ (Real-time events)  │
└──────────┬──────────┘
           │
      ┌────▼─────┐
      │ Normalize │
      │  & Filter  │
      └────┬──────┘
           │
    ┌──────▼──────────────────┐
    │ Multi-threaded Processor │
    │ • Validate transaction   │
    │ • Flag large trades      │
    │ • Update wallet stats    │
    └──────┬────────────────────┘
           │
    ┌──────▼──────────────┐
    │ Redis Cache         │
    │ (Real-time lookup)  │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │ PostgreSQL Storage  │
    │ (Historical data)   │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │ Analysis Engine     │
    │ • Clustering        │
    │ • Conviction calc   │
    │ • Leaderboard       │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │ WebSocket Broadcast │
    │ (to frontend)       │
    └─────────────────────┘
```

## Performance Targets

- **Trade Ingestion Latency:** < 2 seconds end-to-end
- **WebSocket Update Latency:** < 500ms
- **API Response Time:** < 500ms (p95)
- **Wallet Clustering:** 10+ minutes (batch)
- **Max Concurrent Connections:** 1,000+

## Security Considerations

1. **No private keys** - Read-only analysis
2. **Rate limiting** - Per-IP and per-user
3. **API authentication** - JWT tokens for protected endpoints
4. **Data sanitization** - All user inputs validated
5. **CORS** - Strict origin whitelist

## Scaling Strategy

**Phase 1 (MVP):**
- Single FastAPI instance
- PostgreSQL + Redis
- Polling-based data ingestion

**Phase 2 (Scale):**
- Load balancer (API Gateway)
- Database read replicas
- Event-driven architecture (Kafka/RabbitMQ)
- Distributed task queue (Celery)

**Phase 3 (Advanced):**
- Multi-region deployment
- Real-time data streaming (WebSocket + gRPC)
- Machine learning pipeline (TensorFlow/PyTorch)
- Advanced caching (CDN, edge computing)

## Development Setup

```bash
# Start all services
docker-compose up -d

# Access services
API:       http://localhost:8000
Frontend:  http://localhost:3000
Postgres:  localhost:5432
Redis:     localhost:6379
```

## API Documentation

**Auto-generated Swagger UI:** http://localhost:8000/docs
