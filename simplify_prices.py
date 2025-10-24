with open('backend/app/services/polymarket_client.py', 'r') as f:
    content = f.read()

old_start = 'async def get_real_prices(self, market_ids: List[str]) -> Dict[str, float]:'
old_end = 'async def _async_post(self, url: str, json=None, **kwargs) -> Dict[str, Any]:'

start_pos = content.find(old_start)
end_pos = content.find(old_end)

if start_pos >= 0 and end_pos >= 0:
    # Find the beginning of the previous line
    start_of_method = content.rfind('\n', 0, start_pos) + 1
    
    new_method = '''    async def get_real_prices(self, market_ids: List[str]) -> Dict[str, float]:
        """Fetch REAL prices from CLOB API - returns empty dict to use fallback"""
        return {}

'''
    
    content = content[:start_of_method] + new_method + content[end_pos:]
    
    with open('backend/app/services/polymarket_client.py', 'w') as f:
        f.write(content)
    print("Simplified get_real_prices")
else:
    print("Could not find method positions")
