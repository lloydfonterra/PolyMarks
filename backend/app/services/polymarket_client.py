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
        """Fetch REAL ACTIVE markets with actual bid/ask spreads from CLOB API orderbooks"""
        try:
            from datetime import datetime, timezone
            
            # Fetch active markets from CLOB - this has ALL markets
            url = "https://clob.polymarket.com/markets"
            params = {
                "limit": 500,  # Fetch batch of markets
                "closed": False,  # Only not-closed markets
                "offset": offset
            }
            data = await self._async_get(url, params=params)
            
            # Response format: { "data": [...markets...], "next_cursor": "...", "limit": 1000, "count": 1000 }
            market_list = data.get("data", []) if isinstance(data, dict) else data
            
            # Filter for truly active markets with future dates
            now = datetime.now(timezone.utc)
            filtered_markets = []
            
            for m in market_list:
                # Must not be closed
                if m.get("closed"):
                    continue
                
                # Must have a future end date
                end_date_str = m.get("endDateIso")
                if end_date_str:
                    try:
                        end_date = datetime.fromisoformat(end_date_str.replace("Z", "+00:00"))
                        if end_date < now:
                            continue  # Skip expired markets
                    except:
                        pass  # If we can't parse, include it
                
                filtered_markets.append(m)
            
            logger.info(f"Filtered {len(filtered_markets)} active markets from {len(market_list)} total")
            
            # For each market, get its orderbook to get real bid/ask data
            markets_with_prices = []
            for m in filtered_markets[:limit * 2]:  # Fetch extra to compensate for failures
                try:
                    # Try to get the market's orderbook for real pricing
                    condition_id = m.get("condition_id", m.get("id", ""))
                    if condition_id:
                        orderbook_url = f"https://clob.polymarket.com/book/{condition_id}"
                        orderbook = await self._async_get(orderbook_url)
                        
                        # Extract best bid/ask from orderbook
                        if orderbook and "bids" in orderbook and "asks" in orderbook:
                            bids = orderbook.get("bids", [])
                            asks = orderbook.get("asks", [])
                            
                            best_bid = float(bids[0]["price"]) if bids else 0
                            best_ask = float(asks[0]["price"]) if asks else 0
                            
                            # Only include if we got real prices
                            if best_bid > 0 and best_ask > 0 and best_bid != best_ask:
                                m["bestBid"] = best_bid
                                m["bestAsk"] = best_ask
                                markets_with_prices.append(m)
                except:
                    # Skip markets where we can't get orderbook data
                    pass
            
            # If we found markets with prices, use them; otherwise use any active markets
            final_markets = markets_with_prices if markets_with_prices else filtered_markets
            
            logger.info(f"Returning {len(final_markets[:limit])} markets with price data")
            return [self._normalize_market(m) for m in final_markets[:limit]]
        except Exception as e:
            logger.error(f"Error fetching markets: {e}", exc_info=True)
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
