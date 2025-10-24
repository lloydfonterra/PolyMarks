"""
Add background task to broadcast prices to WebSocket clients
"""

with open('backend/main.py', 'r') as f:
    lines = f.readlines()

# Find the lifespan section or add it
content = ''.join(lines)

# Add background broadcasting function before trades_recent endpoint
trades_endpoint = '@app.get("/api/trades/recent")'

broadcast_function = '''async def broadcast_prices():
    """Background task to broadcast live prices every 1 second"""
    while True:
        try:
            await asyncio.sleep(1)
            
            # Get latest prices
            markets = await polymarket_client.get_markets(limit=20)
            real_prices = await polymarket_client.get_real_prices(
                [m.get("id", "") for m in markets if m.get("id")]
            )
            
            # Build message with price updates
            price_updates = []
            for market in markets[:10]:
                market_id = market.get("id", "")
                price = real_prices.get(market_id)
                
                if price is None:
                    best_bid = float(market.get("bestBid", 0)) if market.get("bestBid") else 0
                    best_ask = float(market.get("bestAsk", 0)) if market.get("bestAsk") else 0
                    if best_bid > 0 and best_ask > 0:
                        price = (best_bid + best_ask) / 2
                
                if price:
                    price_updates.append({
                        "market_id": market_id,
                        "market_name": market.get("question", ""),
                        "price": round(max(0.01, min(0.99, price)), 4),
                        "timestamp": datetime.utcnow().isoformat()
                    })
            
            if price_updates:
                await manager.broadcast({
                    "type": "price_update",
                    "data": price_updates
                })
        except Exception as e:
            logger.error(f"Error in broadcast_prices: {e}")
            await asyncio.sleep(1)

@app.on_event("startup")
async def startup_broadcast():
    """Start background price broadcaster"""
    asyncio.create_task(broadcast_prices())

'''

content = content.replace(
    trades_endpoint,
    broadcast_function + trades_endpoint
)

# Add List import if not present
if 'from typing import' in content:
    if 'List' not in content:
        old_import = 'from typing import'
        new_import = 'from typing import List,'
        content = content.replace(old_import, new_import)

# Add datetime if not present
if 'from datetime import' not in content:
    insert_pos = content.find('import logging')
    if insert_pos >= 0:
        end_of_line = content.find('\n', insert_pos)
        content = content[:end_of_line] + '\nfrom datetime import datetime' + content[end_of_line:]

with open('backend/main.py', 'w') as f:
    f.write(content)

print("Added price broadcasting to main.py")
