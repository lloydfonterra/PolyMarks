"""
Polymarket CLOB API Client Service
Handles all communication with Polymarket's real-time market data
Uses synchronous requests in thread pool to avoid asyncio DNS issues on Windows
"""

import requests
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

# Polymarket API Endpoints
POLYMARKET_BASE_URL = "https://clob.polymarket.com"
POLYMARKET_DATA_URL = "https://data.polymarket.com"

# Thread pool for running sync requests
_thread_pool = ThreadPoolExecutor(max_workers=5)

class PolymarketClient:
    """Client for Polymarket CLOB API using synchronous requests in thread pool"""
    
    def __init__(self):
        self.base_url = POLYMARKET_BASE_URL
        self.data_url = POLYMARKET_DATA_URL
        self.timeout = 15
        self._cache = {}
        self._cache_ttl = 60
        self.session = requests.Session()
    
    def _get(self, url: str, **kwargs) -> Dict[str, Any]:
        """Synchronous GET request"""
        try:
            timeout = kwargs.pop('timeout', self.timeout)
            response = self.session.get(url, timeout=timeout, **kwargs)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Request error for {url}: {e}")
            raise
    
    async def _async_get(self, url: str, params=None) -> Dict[str, Any]:
        """Run sync GET in thread - compatible with asyncio"""
        def _sync_get():
            try:
                response = self.session.get(url, params=params, timeout=self.timeout)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                logger.error(f"Request error: {e}")
                raise
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _sync_get)
    
    async def get_markets(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Fetch TOP TRENDING markets from Gamma API sorted by 24h volume with REAL prices"""
        try:
            from datetime import datetime, timezone
            
            # Fetch trending markets sorted by volume - this is the REAL trending data!
            url = "https://gamma-api.polymarket.com/events/pagination"
            params = {
                "limit": max(limit, 20),  # Always get at least 20 to find the best
                "closed": False,
                "archived": False,
                "order": "volume",
                "ascending": False  # Highest volume first
            }
            data = await self._async_get(url, params=params)
            
            # Response format: { "data": [...events...], "count": X }
            event_list = data.get("data", []) if isinstance(data, dict) else data
            
            logger.info(f"Fetched {len(event_list)} trending events from Gamma API (sorted by volume)")
            
            # Filter for truly active markets
            now = datetime.now(timezone.utc)
            filtered_markets = []
            
            for event in event_list:
                # Must have markets
                if not isinstance(event.get("markets"), list):
                    continue
                
                # Take the first/main market from this event
                main_market = event.get("markets", [{}])[0]
                
                # Must not be closed
                if main_market.get("closed"):
                    continue
                
                # Must have a future end date
                end_date_str = main_market.get("endDateIso")
                if end_date_str:
                    try:
                        end_date = datetime.fromisoformat(end_date_str.replace("Z", "+00:00"))
                        if end_date < now:
                            continue  # Skip expired markets
                    except:
                        pass
                
                # Must have a question/title
                if not main_market.get("question"):
                    continue
                
                # Add event context to market
                main_market["event_title"] = event.get("title", "")
                filtered_markets.append(main_market)
            
            logger.info(f"Filtered to {len(filtered_markets)} active trending markets")
            
            return [self._normalize_market(m) for m in filtered_markets[:limit]]
            
        except Exception as e:
            logger.error(f"Error fetching trending markets: {e}", exc_info=True)
            return []
    
    async def get_market(self, market_id: str) -> Optional[Dict[str, Any]]:
        """Fetch details for a specific market"""
        try:
            url = f"{self.base_url}/markets/{market_id}"
            market = await self._async_get(url)
            return self._normalize_market(market)
        except Exception as e:
            logger.error(f"Error fetching market {market_id}: {e}")
            return None
    
    async def get_trades(self, market_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Fetch recent trades for a market"""
        try:
            url = f"{self.data_url}/history/events"
            params = {
                "market_id": market_id,
                "limit": limit,
                "event_type": "trade"
            }
            trades = await self._async_get(url, params=params)
            
            logger.info(f"Fetched {len(trades.get('events', []))} trades")
            return [self._normalize_trade(t) for t in trades.get("events", [])]
        except Exception as e:
            logger.error(f"Error fetching trades: {e}")
            return []
    
    async def get_orderbook(self, market_id: str) -> Optional[Dict[str, Any]]:
        """Fetch current order book for a market"""
        try:
            url = f"{self.base_url}/book/{market_id}"
            orderbook = await self._async_get(url)
            return self._normalize_orderbook(orderbook)
        except Exception as e:
            logger.error(f"Error fetching orderbook: {e}")
            return None
    
    async def get_top_markets(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Fetch top markets by volume"""
        try:
            url = f"{self.data_url}/markets/top"
            params = {"limit": limit, "sort_by": "volume"}
            markets = await self._async_get(url, params=params)
            
            market_list = markets.get("data", []) if isinstance(markets, dict) else markets.get("markets", [])
            logger.info(f"Fetched {len(market_list)} top markets")
            return [self._normalize_market(m) for m in market_list[:limit]]
        except Exception as e:
            logger.error(f"Error fetching top markets: {e}")
            return []
    
    async def get_whale_trades(self, min_size: float = 10000, limit: int = 50) -> List[Dict[str, Any]]:
        """Fetch large trades (whale trades) across all markets"""
        try:
            url = f"{self.data_url}/history/events"
            params = {
                "event_type": "trade",
                "limit": limit,
                "min_amount": min_size
            }
            trades = await self._async_get(url, params=params)
            
            normalized_trades = [self._normalize_trade(t) for t in trades.get("events", [])]
            logger.info(f"Fetched {len(normalized_trades)} potential whale trades")
            
            # Filter for large trades
            return [
                t for t in normalized_trades
                if t.get("amount", 0) >= min_size
            ]
        except Exception as e:
            logger.error(f"Error fetching whale trades: {e}")
            return []
    
    # Data normalization methods
    
    def _normalize_market(self, market: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize market data from Polymarket API"""
        # Use best bid/ask for real-time pricing if available
        best_bid = float(market.get("bestBid", 0)) if market.get("bestBid") else 0
        best_ask = float(market.get("bestAsk", 1)) if market.get("bestAsk") else 1
        
        # Calculate midpoint price - more reliable than lastTradePrice which is often 0
        if best_bid > 0 or best_ask > 0:
            midpoint_price = (best_bid + best_ask) / 2
        else:
            midpoint_price = float(market.get("lastTradePrice", 0.5)) if market.get("lastTradePrice") else 0.5
        
        return {
            "id": market.get("id", ""),
            "question": market.get("question", ""),
            "slug": market.get("slug", ""),
            "category": market.get("category", ""),
            "volume_24h": market.get("volume24hr", market.get("volume_24h", 0)),
            "last_price": midpoint_price,
            "liquidity": market.get("liquidity", 0),
            "outcomes": market.get("outcomes", []),
            "outcome_prices": market.get("outcomePrices", market.get("outcome_prices", [])),
            "market_maker_address": market.get("marketMakerAddress", market.get("market_maker_address", "")),
            "active": market.get("active", False),
            "closed": market.get("closed", False),
            "created_at": market.get("createdAt", market.get("created_at", "")),
            "updated_at": market.get("updatedAt", market.get("updated_at", "")),
            "end_date": market.get("endDate", market.get("end_date", "")),
        }
    
    def _detect_volume_spike(self, market: Dict[str, Any], baseline_volume: float = 100000) -> Dict[str, Any]:
        """Detect volume spikes compared to baseline"""
        volume = float(market.get("volume24hr", 0)) if market.get("volume24hr") else 0
        multiplier = volume / baseline_volume if baseline_volume > 0 else 1
        
        if multiplier >= 10:
            return {"spike_level": "mega", "spike_multiplier": round(multiplier, 1), "alert": True, "severity": "critical"}
        elif multiplier >= 5:
            return {"spike_level": "5x+", "spike_multiplier": round(multiplier, 1), "alert": True, "severity": "high"}
        elif multiplier >= 2:
            return {"spike_level": "2x", "spike_multiplier": round(multiplier, 1), "alert": True, "severity": "medium"}
        else:
            return {"spike_level": "normal", "spike_multiplier": round(multiplier, 1), "alert": False}
    
    def _calculate_wallet_conviction(self, wallet_id: str, trade_history: Dict[str, Any] = None) -> float:
        """Calculate trader conviction based on history (0-100)"""
        if not trade_history:
            return 40.0
        
        score = 40.0
        trade_count = trade_history.get("trade_count", 0)
        if trade_count >= 20:
            score += 25
        elif trade_count >= 10:
            score += 18
        elif trade_count >= 5:
            score += 12
        
        win_rate = trade_history.get("win_rate", 0.5)
        if win_rate > 0.75:
            score += 25
        elif win_rate > 0.65:
            score += 18
        elif win_rate > 0.55:
            score += 10
        
        market_count = trade_history.get("market_count", 1)
        if market_count >= 10:
            score += 15
        elif market_count >= 5:
            score += 8
        
        return round(min(100, max(0, score)), 1)
    
    def _calculate_conviction_score(self, market: Dict[str, Any]) -> float:
        """Calculate conviction score based on market conditions (0-100)
        
        Conviction factors:
        1. Spread Tightness (40%): Tight bid-ask spread = high conviction
        2. Liquidity (35%): High volume/liquidity = high conviction
        3. Price Positioning (25%): Price near extremes (0.1 or 0.9) = lower conviction
        """
        score = 0
        
        # Factor 1: Spread Tightness (40 points max)
        best_bid = float(market.get("bestBid", 0)) if market.get("bestBid") else 0
        best_ask = float(market.get("bestAsk", 1)) if market.get("bestAsk") else 1
        
        if best_bid > 0 and best_ask > 0:
            spread = best_ask - best_bid
            midpoint = (best_bid + best_ask) / 2
            spread_pct = (spread / midpoint * 100) if midpoint > 0 else 100
            
            # Tight spread (< 2%) = 40 points, wide spread (> 10%) = 0 points
            if spread_pct < 2:
                spread_score = 40
            elif spread_pct > 10:
                spread_score = 0
            else:
                spread_score = 40 * (1 - (spread_pct - 2) / 8)
            score += max(0, spread_score)
        
        # Factor 2: Liquidity (35 points max)
        volume = float(market.get("volume24hr", 0)) if market.get("volume24hr") else 0
        liquidity = float(market.get("liquidity", 0)) if market.get("liquidity") else 0
        
        # Normalize volume: >$1M = 35 points, <$10k = 0 points
        if volume > 1000000:
            volume_score = 35
        elif volume > 100000:
            volume_score = 35 * (volume / 1000000)
        elif volume > 10000:
            volume_score = 35 * (volume / 100000) * 0.5
        else:
            volume_score = 0
        score += max(0, min(35, volume_score))
        
        # Factor 3: Price Positioning (25 points max)
        mid_price = (best_bid + best_ask) / 2 if (best_bid + best_ask) > 0 else 0.5
        
        # Distance from extremes: 0.5 price (middle) = 25 points, 0.1 or 0.9 = 0 points
        distance_from_center = abs(mid_price - 0.5)  # 0 to 0.5
        price_score = 25 * (1 - distance_from_center / 0.5)  # 25 to 0
        score += max(0, price_score)
        
        return round(min(100, max(0, score)), 1)
    
    def _normalize_trade(self, trade: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalize trade data from Polymarket format
        
        Args:
            trade: Raw trade data from API
            
        Returns:
            Normalized trade data
        """
        return {
            "id": trade.get("id"),
            "market_id": trade.get("market_id") or trade.get("market"),
            "buyer": trade.get("buyer") or trade.get("taker"),
            "seller": trade.get("seller") or trade.get("maker"),
            "amount": float(trade.get("amount", 0)),
            "price": float(trade.get("price", 0)),
            "outcome": trade.get("outcome"),
            "timestamp": trade.get("timestamp") or datetime.utcnow().isoformat(),
            "transaction_hash": trade.get("tx") or trade.get("transaction_hash"),
        }
    
    def _normalize_orderbook(self, orderbook: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalize orderbook data from Polymarket format
        
        Args:
            orderbook: Raw orderbook data from API
            
        Returns:
            Normalized orderbook data
        """
        return {
            "market_id": orderbook.get("market_id") or orderbook.get("id"),
            "bids": [
                {
                    "price": float(b.get("price", 0)),
                    "amount": float(b.get("amount", 0)),
                    "count": b.get("count", 1)
                }
                for b in orderbook.get("bids", [])
            ],
            "asks": [
                {
                    "price": float(a.get("price", 0)),
                    "amount": float(a.get("amount", 0)),
                    "count": a.get("count", 1)
                }
                for a in orderbook.get("asks", [])
            ],
            "timestamp": datetime.utcnow().isoformat(),
        }


# Global client instance
_polymarket_client: Optional[PolymarketClient] = None

def get_polymarket_client() -> PolymarketClient:
    """Get or create the global Polymarket client"""
    global _polymarket_client
    if _polymarket_client is None:
        _polymarket_client = PolymarketClient()
    return _polymarket_client
