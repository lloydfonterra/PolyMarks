import re

with open('backend/main.py', 'r') as f:
    content = f.read()

old_section = '''            trades.append({
                "id": f"trade_{i}",
                "wallet": f"0x{i:040x}",
                "market": market_display,  # Full market name with smart truncation
                "amount": int(volume) if volume > 0 else 100000,  # Use real volume directly
                "type": "buy" if i % 2 == 0 else "sell",
                "price": price,  # Real price already rounded
                "conviction": 50 + (i * 5) % 45,
                "time": f"{i * 5} minutes ago"
            })'''

new_section = '''            # Calculate REAL conviction score based on market conditions
            conviction = polymarket_client._calculate_conviction_score(market)
            
            trades.append({
                "id": f"trade_{i}",
                "wallet": f"0x{i:040x}",
                "market": market_display,  # Full market name with smart truncation
                "amount": int(volume) if volume > 0 else 100000,  # Use real volume directly
                "type": "buy" if i % 2 == 0 else "sell",
                "price": price,  # Real price already rounded
                "conviction": conviction,  # REAL conviction from market analysis
                "time": f"{i * 5} minutes ago"
            })'''

if old_section in content:
    content = content.replace(old_section, new_section)
    with open('backend/main.py', 'w') as f:
        f.write(content)
    print("Successfully updated conviction scoring in main.py")
else:
    print("Could not find the section to replace")
