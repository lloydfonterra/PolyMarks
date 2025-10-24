import re

with open('backend/app/services/polymarket_client.py', 'r') as f:
    content = f.read()

# Find and replace get_real_prices and add _fetch_market_price
old_method = '''    async def get_real_prices(self, market_ids: List[str]) -> Dict[str, float]:
        """Fetch REAL prices from CLOB API - returns empty dict to use fallback"""
        return {}'''

new_methods = '''    async def get_real_prices(self, market_ids: List[str]) -> Dict[str, float]:
        """Fetch REAL bid/ask prices from CLOB /book endpoint with parallel requests"""
        try:
            if not market_ids:
                return {}
            
            # Create tasks for all markets (limit to 20 for performance)
            tasks = []
            for market_id in market_ids[:20]:
                tasks.append(self._fetch_market_price(market_id))
            
            # Run all in parallel
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            prices_data = {}
            for market_id, price in zip(market_ids[:20], results):
                if price is not None and not isinstance(price, Exception):
                    prices_data[market_id] = price
            
            logger.info(f"Fetched real prices for {len(prices_data)}/{min(len(market_ids), 20)} markets")
            return prices_data
        except Exception as e:
            logger.error(f"Error fetching real prices: {e}")
            return {}
    
    async def _fetch_market_price(self, market_id: str) -> Optional[float]:
        """Fetch single market price from CLOB /book endpoint with timeout"""
        try:
            url = f"https://clob.polymarket.com/book/{market_id}"
            
            # Fetch with timeout
            async def _fetch():
                return await self._async_get(url)
            
            orderbook = await asyncio.wait_for(_fetch(), timeout=2.5)
            
            if orderbook and isinstance(orderbook, dict):
                bids = orderbook.get("bids", [])
                asks = orderbook.get("asks", [])
                
                if bids and asks:
                    try:
                        best_bid = float(bids[0].get("price", 0)) if isinstance(bids[0], dict) else float(bids[0])
                        best_ask = float(asks[0].get("price", 1)) if isinstance(asks[0], dict) else float(asks[0])
                        
                        if best_bid > 0 and best_ask > 0:
                            midpoint = (best_bid + best_ask) / 2
                            return round(max(0.01, min(0.99, midpoint)), 4)
                    except (ValueError, TypeError):
                        pass
            
            return None
        except asyncio.TimeoutError:
            logger.debug(f"Timeout fetching price for {market_id}")
            return None
        except Exception as e:
            logger.debug(f"Error fetching {market_id}: {e}")
            return None'''

content = content.replace(old_method, new_methods)

with open('backend/app/services/polymarket_client.py', 'w') as f:
    f.write(content)

print("Implemented real prices fetching with parallel requests")
