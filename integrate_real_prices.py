with open('backend/main.py', 'r') as f:
    content = f.read()

# Find the trades endpoint and add real prices fetching
old_code = '''        # Fetch top markets from Polymarket (these are real markets with real activity)
        markets = await polymarket_client.get_markets(limit=limit)
        
        logger.info(f"Fetched {len(markets)} markets from Polymarket API")
        
        # Transform markets into trade-like format to show active market data
        trades = []
        for i, market in enumerate(markets):'''

new_code = '''        # Fetch top markets from Polymarket (these are real markets with real activity)
        markets = await polymarket_client.get_markets(limit=limit)
        
        logger.info(f"Fetched {len(markets)} markets from Polymarket API")
        
        # Fetch REAL prices from CLOB API for all markets
        market_ids = [market.get("id") for market in markets if market.get("id")]
        real_prices = {}
        if market_ids:
            real_prices = await polymarket_client.get_real_prices(market_ids)
            logger.info(f"Fetched real prices for {len(real_prices)} markets")
        
        # Transform markets into trade-like format to show active market data
        trades = []
        for i, market in enumerate(markets):'''

content = content.replace(old_code, new_code)

# Now update the price calculation to use real prices
old_price_calc = '''            # Get REAL price from API - use best bid/ask midpoint
            best_bid = float(market.get("bestBid", 0)) if market.get("bestBid") else 0
            best_ask = float(market.get("bestAsk", 0)) if market.get("bestAsk") else 0
            
            # Calculate price
            if best_bid > 0 or best_ask > 0:
                # Use midpoint for real prices
                price = (best_bid + best_ask) / 2 if (best_bid + best_ask) > 0 else 0.5
            else:
                # Fallback if no price data available
                price = 0.5
            
            price = round(max(0.01, min(0.99, price)), 4)'''

new_price_calc = '''            # Get REAL price from CLOB API if available, otherwise use fallback
            market_id = market.get("id", "")
            if market_id in real_prices:
                price = float(real_prices[market_id])
            else:
                # Fallback: use best bid/ask midpoint from market data
                best_bid = float(market.get("bestBid", 0)) if market.get("bestBid") else 0
                best_ask = float(market.get("bestAsk", 0)) if market.get("bestAsk") else 0
                
                if best_bid > 0 or best_ask > 0:
                    price = (best_bid + best_ask) / 2 if (best_bid + best_ask) > 0 else 0.5
                else:
                    price = 0.5
            
            price = round(max(0.01, min(0.99, price)), 4)'''

content = content.replace(old_price_calc, new_price_calc)

with open('backend/main.py', 'w') as f:
    f.write(content)

print("Integrated real prices from CLOB API")
