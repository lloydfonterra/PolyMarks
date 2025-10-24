with open('backend/main.py', 'r') as f:
    content = f.read()

# Find the return statement for trades
old_return = '''        # If we got real markets, return them as trades
        if trades:
            logger.info(f"Returning {len(trades)} real markets as trades")
            return {
                "trades": trades,
                "count": len(trades)
            }'''

new_return = '''        # If we got real markets, apply filters and sorting
        if trades:
            # Apply conviction filter
            if conviction_filter == "high":
                trades = [t for t in trades if t.get("conviction", 0) > 70]
            elif conviction_filter == "medium":
                trades = [t for t in trades if 40 <= t.get("conviction", 0) <= 70]
            elif conviction_filter == "low":
                trades = [t for t in trades if t.get("conviction", 0) < 40]
            
            # Apply conviction range filter
            trades = [t for t in trades if min_conviction <= t.get("conviction", 0) <= max_conviction]
            
            # Apply volume spike alert filter
            if spike_alert:
                trades = [t for t in trades if t.get("volume_spike", {}).get("alert", False)]
            
            # Apply sorting
            if sort_by == "conviction":
                trades = sorted(trades, key=lambda x: x.get("conviction", 0), reverse=True)
            elif sort_by == "volume":
                trades = sorted(trades, key=lambda x: x.get("amount", 0), reverse=True)
            elif sort_by == "price":
                trades = sorted(trades, key=lambda x: x.get("price", 0.5), reverse=True)
            
            # Apply pagination
            filtered_trades = trades[offset:offset+limit]
            
            logger.info(f"Returning {len(filtered_trades)} filtered trades")
            return {
                "trades": filtered_trades,
                "count": len(filtered_trades),
                "total": len(trades),
                "filters": {
                    "conviction_filter": conviction_filter,
                    "min_conviction": min_conviction,
                    "max_conviction": max_conviction,
                    "spike_alert": spike_alert,
                    "sort_by": sort_by
                }
            }'''

if old_return in content:
    content = content.replace(old_return, new_return)
    with open('backend/main.py', 'w') as f:
        f.write(content)
    print("Successfully added filtering and sorting logic")
else:
    print("Could not find return statement")
