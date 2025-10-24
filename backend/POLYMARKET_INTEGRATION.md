# Polymarket API Integration Guide

## Overview

The Conviction backend is now connected to **real Polymarket API data** through a comprehensive integration layer. This enables live market data, trade tracking, and smart money detection.

## Architecture

### 1. Polymarket API Client (`app/services/polymarket_client.py`)

**Purpose:** Handles all communication with Polymarket's CLOB API

**Key Features:**
- Async HTTP client using `httpx`
- Automatic data normalization
- Error handling and fallback values
- Support for multiple Polymarket endpoints

**Main Methods:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `get_markets()` | `GET /markets` | Fetch list of prediction markets |
| `get_market()` | `GET /markets/{id}` | Get specific market details |
| `get_trades()` | `GET /history/events` | Fetch trades for a market |
| `get_orderbook()` | `GET /book/{id}` | Get current order book |
| `get_top_markets()` | `GET /markets/top` | Get markets by volume |
| `get_whale_trades()` | `GET /history/events` | Fetch large trades (>$10k) |

**Usage Example:**
```python
from app.services.polymarket_client import get_polymarket_client

client = get_polymarket_client()

# Fetch whale trades
whale_trades = await client.get_whale_trades(min_size=10000, limit=50)

# Fetch market details
market = await client.get_market("market_id_xyz")

# Get order book
orderbook = await client.get_orderbook("market_id_xyz")
```

### 2. Wallet Clustering Engine (`app/services/wallet_clustering.py`)

**Purpose:** Groups related wallets and identifies smart money

**Key Components:**

#### WalletCluster Class
Represents a group of related wallets with:
- Primary wallet address
- Related wallet addresses
- Aggregated trading history
- Confidence score
- Total trading volume

#### WalletClusteringEngine Class
Algorithm for clustering wallets based on:

1. **Recency Similarity** (30% weight)
   - Do they trade at similar times?
   - Decays over 7 days

2. **Volume Similarity** (40% weight)
   - Do they trade similar amounts?
   - Uses ratio-based similarity

3. **Pattern Similarity** (30% weight)
   - Do they trade similar markets?
   - Uses Jaccard similarity

**Conviction Score Calculation:**
```
conviction = (volume_factor * 0.4) + (recency_factor * 0.3) + (consistency_factor * 0.3)

Where:
  - volume_factor = min(total_volume / 100k, 1.0)
  - recency_factor = 1 - (hours_since_trade / (24 * 7))  # Decays over 7 days
  - consistency_factor = min(trade_count / 10, 1.0)
```

**Main Methods:**

| Method | Purpose |
|--------|---------|
| `cluster_wallets()` | Cluster wallets from trade data |
| `identify_smart_money()` | Find high conviction traders |
| `get_cluster_for_wallet()` | Get cluster membership |
| `get_related_wallets()` | Get all wallets in a cluster |
| `get_top_clusters()` | Get clusters by volume |

**Usage Example:**
```python
from app.services.wallet_clustering import WalletClusteringEngine

engine = WalletClusteringEngine()

# Identify smart money from trades
smart_money = engine.identify_smart_money(trades)

# Get related wallets
related = engine.get_related_wallets("0xabc...")

# Get wallet cluster
cluster = engine.get_cluster_for_wallet("0xabc...")
```

## API Endpoints

### Health & Status
```
GET /api/health/ping
  → Quick health check
  
GET /api/health/status
  → Detailed status including Polymarket connectivity
```

### Markets
```
GET /api/markets/top?limit=20
  → Get top markets by volume
  
GET /api/markets/{market_id}
  → Get specific market details
```

### Trades
```
GET /api/trades/recent?limit=10
  → Get recent whale trades (>$5k)
  
GET /api/trades/large?min_size=10000&limit=20
  → Get trades above size threshold
  
GET /api/trades/{market_id}?limit=50
  → Get trades for specific market
```

### Wallets
```
GET /api/wallets/profile/{address}
  → Get wallet profile including:
    - Related wallets (cluster)
    - Total volume
    - Win rate
    - Confidence score
```

### Leaderboard
```
GET /api/leaderboard/top?limit=10
  → Get top traders (smart money clusters):
    - Ranked by conviction score
    - Includes volume, trade count
    - Shows wallet relationships
```

### Alerts
```
GET /api/alerts/recent?limit=10
  → Get recent trading alerts
```

## Data Flow

```
Polymarket API
    ↓
PolymarketClient (normalized data)
    ↓
Backend Endpoints
    ↓
Frontend API Client
    ↓
Dashboard Components
```

## Response Format Example

### Recent Trades Response
```json
{
  "trades": [
    {
      "id": "trade_abc123",
      "wallet": "0x7a4c...9d2b",
      "market": "Will BTC reach $50k?",
      "amount": 50000,
      "type": "buy",
      "price": 0.72,
      "conviction": 92,
      "time": "2024-01-15T10:30:00"
    }
  ],
  "count": 1
}
```

### Leaderboard Response
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "trader": "0xwhale123",
      "name": "WhaleAlpha",
      "address": "0xwhale123",
      "win_rate": 78.5,
      "roi": 24.3,
      "volume": 2500000,
      "trades": 156,
      "trend": "up",
      "conviction_score": 0.85,
      "wallet_count": 1
    }
  ],
  "count": 1
}
```

## Error Handling

All endpoints include graceful error handling:

1. **API Errors**: Log and return empty/default data
2. **Network Errors**: Automatically retry with backoff
3. **Parsing Errors**: Fall back to mock data for demo purposes
4. **Rate Limits**: Implement caching and request throttling

```python
try:
    data = await polymarket_client.get_whale_trades()
except Exception as e:
    logger.error(f"Error: {e}")
    return fallback_data  # Mock data
```

## Performance Optimizations

1. **Caching**
   - Polymarket data cached for 60 seconds
   - Reduces API calls during high traffic

2. **Async/Await**
   - Non-blocking I/O for multiple concurrent requests
   - Improves throughput

3. **Pagination**
   - Large datasets fetched in chunks
   - Reduces memory footprint

4. **Filtering**
   - Only fetch whale trades by default
   - Configurable thresholds

## Known Limitations

1. **Real Data**: Currently returns mock data when Polymarket API is unavailable
2. **Metrics**: Win rate and ROI are estimated from clustering scores
3. **Markets**: Limited to top 100 markets in test mode
4. **Rate Limits**: Subject to Polymarket API rate limits

## Future Enhancements

1. **WebSocket Integration**
   - Real-time trade streaming
   - Live order book updates

2. **ML Models**
   - Predictive signals based on whale behavior
   - Anomaly detection

3. **Cross-Market Analysis**
   - Arbitrage opportunities
   - Market correlation

4. **Historical Data**
   - Store trades in PostgreSQL
   - Analytics and reporting

5. **Alert System**
   - Real-time notifications
   - Custom alert rules

## Testing

### Manual Testing
```bash
# Test whale trades endpoint
curl http://localhost:8001/api/trades/recent?limit=10

# Test leaderboard
curl http://localhost:8001/api/leaderboard/top?limit=5

# Test wallet profile
curl http://localhost:8001/api/wallets/profile/0xexample
```

### Running Backend
```bash
cd conviction/backend
source venv/Scripts/activate  # or .\venv\Scripts\Activate.ps1 on Windows
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

## Troubleshooting

### "polymarket_client connection error"
- Check internet connectivity
- Verify Polymarket API is available: https://status.polymarket.com

### "clustering_engine no clusters found"
- Not enough trade data (need minimum trades to cluster)
- Lower the minimum confidence threshold

### "Empty leaderboard"
- Polymarket API not returning data
- Check `polymarket_status` in `/api/health/status`
- Fall back to mock data is enabled

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Polymarket CLOB API                      │
│            (https://clob.polymarket.com)                     │
└────────────────────────────┬────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         ┌──────▼──────┐         ┌───────▼──────┐
         │   Markets   │         │    Trades    │
         │   OrderBook │         │  Whale Data  │
         └──────┬──────┘         └───────┬──────┘
                │                        │
         ┌──────▼────────────────────────▼──────┐
         │   PolymarketClient Service            │
         │   - Normalization                     │
         │   - Async HTTP                        │
         │   - Error Handling                    │
         └──────┬─────────────────────────────────┘
                │
         ┌──────▼────────────────────────────────┐
         │  WalletClusteringEngine                │
         │  - Pattern Recognition                │
         │  - Smart Money Detection              │
         │  - Conviction Scoring                 │
         └──────┬─────────────────────────────────┘
                │
         ┌──────▼─────────────────────────────┐
         │     FastAPI Endpoints                │
         │  /api/trades/*                       │
         │  /api/markets/*                      │
         │  /api/leaderboard/*                  │
         │  /api/wallets/*                      │
         └──────┬──────────────────────────────┘
                │
         ┌──────▼──────────────────────────┐
         │   Frontend (React/Next.js)       │
         │   Dashboard & Components         │
         └──────────────────────────────────┘
```

## Questions?

For more information, see:
- Polymarket Docs: https://docs.polymarket.com
- Polymarket CLOB API: https://clob.polymarket.com
- Code Examples: See `app/services/`

