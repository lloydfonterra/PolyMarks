"""
Script to add caching and WebSocket support to polymarket_client.py
"""

with open('backend/app/services/polymarket_client.py', 'r') as f:
    content = f.read()

# Add time import if not present
if 'import time' not in content:
    import_section = content.find('import logging')
    if import_section >= 0:
        end_of_line = content.find('\n', import_section)
        content = content[:end_of_line] + '\nimport time' + content[end_of_line:]

# Add cache dict to __init__
old_init = '''    def __init__(self):
        self.base_url = POLYMARKET_BASE_URL
        self.data_url = POLYMARKET_DATA_URL
        self.timeout = 15
        self._cache = {}
        self._cache_ttl = 60
        self.session = requests.Session()'''

new_init = '''    def __init__(self):
        self.base_url = POLYMARKET_BASE_URL
        self.data_url = POLYMARKET_DATA_URL
        self.timeout = 15
        self._cache = {}
        self._cache_ttl = 60
        self.session = requests.Session()
        # Price cache with TTL (5 seconds)
        self._price_cache = {}
        self._price_cache_ttl = 5
        self._price_cache_time = 0'''

content = content.replace(old_init, new_init)

# Add caching method
cache_method = '''
    def _get_cached_prices(self, market_ids: List[str]) -> Optional[Dict[str, float]]:
        """Get cached prices if still valid"""
        now = time.time()
        if now - self._price_cache_time < self._price_cache_ttl:
            # Cache still valid, return what we have
            result = {}
            for market_id in market_ids:
                if market_id in self._price_cache:
                    result[market_id] = self._price_cache[market_id]
            if result:
                return result
        return None
    
    def _set_cached_prices(self, prices: Dict[str, float]):
        """Update price cache"""
        self._price_cache.update(prices)
        self._price_cache_time = time.time()'''

# Find good insertion point (after _fetch_market_price method)
insertion_point = content.find('    async def _async_post(self, url: str')
if insertion_point > 0:
    content = content[:insertion_point] + cache_method + '\n' + content[insertion_point:]

# Update get_real_prices to use cache
old_get_prices = '''    async def get_real_prices(self, market_ids: List[str]) -> Dict[str, float]:
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
            return {}'''

new_get_prices = '''    async def get_real_prices(self, market_ids: List[str]) -> Dict[str, float]:
        """Fetch REAL bid/ask prices with caching (5s TTL)"""
        try:
            if not market_ids:
                return {}
            
            # Check cache first
            cached = self._get_cached_prices(market_ids)
            if cached:
                logger.debug(f"Using cached prices for {len(cached)} markets")
                return cached
            
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
            
            # Cache the results
            if prices_data:
                self._set_cached_prices(prices_data)
            
            logger.info(f"Fetched real prices for {len(prices_data)}/{min(len(market_ids), 20)} markets")
            return prices_data
        except Exception as e:
            logger.error(f"Error fetching real prices: {e}")
            return {}'''

content = content.replace(old_get_prices, new_get_prices)

with open('backend/app/services/polymarket_client.py', 'w') as f:
    f.write(content)

print("Added caching layer to polymarket_client.py")
