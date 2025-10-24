import asyncio
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

with open('backend/app/services/polymarket_client.py', 'r') as f:
    content = f.read()

# Find the position after get_whale_trades method
insert_pos = content.find('    # Data normalization methods')

new_methods = '''    async def get_real_prices(self, market_ids: List[str]) -> Dict[str, float]:
        """Fetch REAL last-traded prices from CLOB API for multiple markets
        
        Args:
            market_ids: List of market IDs to fetch prices for
            
        Returns:
            Dictionary mapping market_id to price
        """
        try:
            if not market_ids:
                return {}
            
            # CLOB API endpoint for last-trades-prices (batch request)
            url = "https://clob.polymarket.com/last-trades-prices"
            
            # Send market IDs as POST request body
            payload = {"token_ids": market_ids}
            
            prices_data = await self._async_post(url, json=payload)
            
            logger.info(f"Fetched real prices for {len(prices_data)} markets from CLOB API")
            return prices_data
        except Exception as e:
            logger.error(f"Error fetching real prices: {e}")
            return {}
    
    async def _async_post(self, url: str, json=None, **kwargs) -> Dict[str, Any]:
        """Run sync POST in thread - compatible with asyncio"""
        def _sync_post():
            try:
                response = self.session.post(url, json=json, timeout=self.timeout, **kwargs)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                logger.error(f"POST request error: {e}")
                raise
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _sync_post)
    
'''

if insert_pos != -1:
    content = content[:insert_pos] + new_methods + content[insert_pos:]
    with open('backend/app/services/polymarket_client.py', 'w') as f:
        f.write(content)
    print("Added real prices API methods")
else:
    print("Could not find insertion point")
