# 🎯 POLYMARKET API GUIDE - REAL DATA vs OLD DATA

## 📊 WHAT WE FOUND

After analyzing Polymarket's website, here's what they're **ACTUALLY USING** for live data:

---

## ✅ CORRECT ENDPOINTS FOR REAL/CURRENT DATA

### **1. Gamma API - TOP TRENDING MARKETS (CURRENT DATA)**

```
🟢 CORRECT: https://gamma-api.polymarket.com/events/pagination

PARAMETERS:
  limit=50                    # Number of markets to fetch
  active=true                 # Only active markets
  archived=false              # Exclude archived markets
  tag_slug=sports            # Category filter (sports, politics, crypto, etc.)
  closed=false               # Only open markets
  order=volume               # Sort by volume (BEST for trending)
  ascending=false            # Highest volume first

EXAMPLE REQUEST:
https://gamma-api.polymarket.com/events/pagination?limit=50&active=true&archived=false&tag_slug=sports&closed=false&order=volume&ascending=false

RETURNS: Real trending markets with CURRENT bid/ask/volume data
✅ THIS IS WHAT POLYMARKET.COM USES!
```

---

### **2. Gamma API - ALL MARKETS BY CATEGORY**

```
🟢 CORRECT: https://gamma-api.polymarket.com/events/pagination

WITH DIFFERENT TAGS:
  tag_slug=politics          # Political markets
  tag_slug=crypto            # Cryptocurrency markets
  tag_slug=finance           # Financial markets
  tag_slug=geopolitics       # Geopolitical events
  tag_slug=elections         # Election markets

EXAMPLE: Get trending political markets
https://gamma-api.polymarket.com/events/pagination?limit=50&active=true&archived=false&tag_slug=politics&order=volume&ascending=false
```

---

### **3. CLOB API - ACTIVE MARKETS**

```
🟢 CORRECT: https://clob.polymarket.com/markets

PARAMETERS:
  None required (returns all active markets)

RETURNS: List of active markets with IDs and basic info
✅ Use this to get market IDs for other queries
```

---

### **4. CLOB API - REAL-TIME ORDER BOOKS**

```
🟢 CORRECT: https://clob.polymarket.com/book/{market_id}

Replace {market_id} with actual market ID

EXAMPLE: Get order book for a specific market
https://clob.polymarket.com/book/0x1234567890abcdef...

RETURNS:
{
  "bids": [{"price": "0.55", "size": 1000}, ...],
  "asks": [{"price": "0.56", "size": 2000}, ...],
  "timestamp": "2025-10-24T21:42:50Z"
}

✅ BEST FOR REAL PRICES & BID/ASK SPREADS
```

---

### **5. CLOB API - LATEST TRADES**

```
🟢 CORRECT: https://clob.polymarket.com/last-trades-prices

For multiple markets at once.

RETURNS: Latest trade prices across all markets
✅ Good for getting current prices quickly
```

---

## ❌ OLD/PROBLEMATIC ENDPOINTS

| Endpoint | Issue | Solution |
|----------|-------|----------|
| `https://gamma-api.polymarket.com/markets` | Returns archived/old markets | Use `/events/pagination` instead |
| `https://clob.polymarket.com/markets` | No filters, returns many old markets | Filter client-side or use Gamma API |
| Subgraph (thegraph.com) | Website offline/deprecated | Use CLOB API directly instead |

---

## 🚀 STEP-BY-STEP: GET REAL DATA NOW

### **STEP 1: Get Trending Markets**

```bash
curl "https://gamma-api.polymarket.com/events/pagination?limit=20&active=true&archived=false&order=volume&ascending=false"
```

**Response Structure:**
```json
{
  "data": [
    {
      "id": "event_123",
      "title": "Event Title",
      "markets": [
        {
          "id": "market_456",
          "question": "Will X happen?",
          "bestBid": 0.55,
          "bestAsk": 0.56,
          "volume24hr": 1500000,
          "lastTradePrice": 0.555,
          "endDateIso": "2025-12-31T23:59:59Z"
        }
      ]
    }
  ]
}
```

---

### **STEP 2: Get Real-Time Prices for Each Market**

```bash
curl "https://clob.polymarket.com/book/market_456"
```

**Response:**
```json
{
  "bids": [
    {"price": "0.550", "size": 5000},
    {"price": "0.549", "size": 3000},
    {"price": "0.548", "size": 2000}
  ],
  "asks": [
    {"price": "0.560", "size": 4000},
    {"price": "0.561", "size": 2500},
    {"price": "0.562", "size": 1500}
  ],
  "timestamp": "2025-10-24T21:42:50Z"
}
```

**Calculate Midpoint Price:**
```
midprice = (highestBid + lowestAsk) / 2
         = (0.550 + 0.560) / 2
         = 0.555
```

---

### **STEP 3: Track Whale Trades**

```bash
# Get latest trades for a market
curl "https://clob.polymarket.com/last-trades-prices"

# Response will have timestamps showing when trades occurred
# Large trades show up in real-time
```

---

## 💡 HOW TO DETECT WHALES & REAL TRADERS

### **Option 1: On-Chain Monitoring (Most Accurate)**

```
Ethereum Contract: Polymarket main contract
https://etherscan.io/address/0x[polymarket_contract]

Monitor for:
- Large position changes (whale wallets)
- High conviction bets (multiple trades same direction)
- Profitable traders (follow winners)

Example whale wallet:
https://etherscan.io/address/0x1234567890abcdef1234567890abcdef12345678
```

---

### **Option 2: Using Polymarket Subgraph (GraphQL)**

```graphql
# Query active traders
query {
  traders(
    first: 10,
    orderBy: totalVolume,
    orderDirection: desc,
    where: {
      lastTradeTime_gt: 1698134400  # Last 24h
    }
  ) {
    id
    totalVolume
    winRate
    tradeCount
    roi
  }
}
```

---

### **Option 3: Real-Time WebSocket Updates**

```
wss://clob.polymarket.com/ws  # If available

Subscribe to:
- Market price changes
- Large trades (whale activity)
- Order book updates
```

---

## 📈 BEST PRACTICES FOR REAL DATA

### **Frequency:**
- **Prices**: Update every 1-2 seconds (use WebSocket or polling)
- **Trends**: Refresh every 5-10 seconds
- **Whales**: Monitor on-chain events in real-time

### **Caching:**
- Cache trending markets for 30 seconds
- Cache order books for 2-5 seconds
- **Never** cache trade/whale data

### **Categories Available:**
```
tag_slug values:
- politics
- crypto  
- sports
- elections
- world
- finance
- geopolitics
- economics
- earnings
- tech
- culture
- mentions
```

---

## 🔗 WALLET TRACKING

### **Find Real Traders on Etherscan:**

```
1. Get wallet address from Polymarket trade
   Example: 0x1234567890abcdef...

2. Look up on Etherscan:
   https://etherscan.io/address/0x1234567890abcdef

3. See transactions:
   - Polymarket contract interactions
   - Token transfers
   - Historical trades
   - Profit/loss calculations

4. Track their activity:
   - Filter for Polymarket contract calls
   - See when they trade
   - Monitor their conviction
```

### **High-Value Whale Tracker:**

```
Filter on Etherscan:
- Transactions > $100k
- Polymarket contract address
- Last 24 hours

This will show active whales!
```

---

## ✅ REAL DATA SOURCES (VERIFIED)

| Source | Endpoint | Real Data? | Live? |
|--------|----------|-----------|-------|
| **Gamma API Events** | `/events/pagination?order=volume` | ✅ YES | ✅ YES |
| **CLOB Order Books** | `/book/{market_id}` | ✅ YES | ✅ YES |
| **Etherscan** | `/address/{wallet}` | ✅ YES | ✅ YES |
| **Polymarket Direct** | On-chain events | ✅ YES | ✅ YES |
| Gamma Markets Endpoint | `/markets` | ⚠️ MIXED | ❌ OUTDATED |
| TheGraph Subgraph | GraphQL | ❌ DOWN | ❌ NO |
| Whale Alert | External service | ✅ PARTIAL | ⚠️ DELAYED |

---

## 🎯 IMPLEMENTATION RECOMMENDATIONS

### **For Your Dashboard:**

```typescript
// 1. Get trending markets (Real-Time)
const getTrendingMarkets = async () => {
  const response = await fetch(
    'https://gamma-api.polymarket.com/events/pagination' +
    '?limit=50&active=true&archived=false&order=volume&ascending=false'
  );
  return response.json();
};

// 2. Get real prices (Real-Time)
const getMarketPrice = async (marketId) => {
  const response = await fetch(
    `https://clob.polymarket.com/book/${marketId}`
  );
  const book = await response.json();
  return (book.bids[0] + book.asks[0]) / 2;
};

// 3. Track whale wallets (Etherscan)
const getWhaleHistory = async (walletAddress) => {
  const response = await fetch(
    `https://api.etherscan.io/api?module=account&action=txlist` +
    `&address=${walletAddress}&apikey=YOUR_API_KEY`
  );
  return response.json();
};
```

---

## 📝 CURRENT API STATUS

✅ **Working Right Now:**
- Gamma API `/events/pagination` (Live trending markets)
- CLOB API `/book/{market_id}` (Live order books)
- CLOB API `/markets` (Active markets list)
- Etherscan API (Wallet history)

⚠️ **Status:**
- `/last-trades-prices` (May have payload issues)
- WebSocket endpoints (Need authentication)

❌ **Not Available:**
- TheGraph Subgraph (Offline)
- Whale Alert (External paid service)

---

## 🚀 NEXT STEPS

To implement REAL trader tracking:

1. **Fetch trending markets** → Use Gamma API `/events/pagination`
2. **Get real prices** → Use CLOB `/book/{market_id}`
3. **Detect whale trades** → Monitor large positions on Etherscan
4. **Calculate conviction** → Based on bid/ask spread and volume
5. **Track wallets** → Use Etherscan API with your wallet addresses

Ready to implement this? 💪
