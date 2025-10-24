with open('backend/main.py', 'r') as f:
    lines = f.readlines()

# Find the line where we append trades
new_trade_append = '''            # Detect volume spike
            volume_spike = polymarket_client._detect_volume_spike(market, baseline_volume=100000)
            
            # Generate trader history (simulate for now)
            trader_history = {
                "trade_count": 5 + (i % 15),
                "win_rate": 0.55 + (i * 0.03) % 0.35,
                "market_count": 3 + (i % 8)
            }
            wallet_conviction = polymarket_client._calculate_wallet_conviction(f"0x{i:040x}", trader_history)
            
            trades.append({
                "id": f"trade_{i}",
                "wallet": f"0x{i:040x}",
                "market": market_display,
                "amount": int(volume) if volume > 0 else 100000,
                "type": "buy" if i % 2 == 0 else "sell",
                "price": price,
                "conviction": conviction,
                "wallet_conviction": wallet_conviction,
                "volume_spike": volume_spike,
                "time": f"{i * 5} minutes ago"
            })'''

# Find and replace the trades append section
old_section = '''            trades.append({
                "id": f"trade_{i}",
                "wallet": f"0x{i:040x}",
                "market": market_display,  # Full market name with smart truncation
                "amount": int(volume) if volume > 0 else 100000,  # Use real volume directly
                "type": "buy" if i % 2 == 0 else "sell",
                "price": price,  # Real price already rounded
                "conviction": conviction,  # REAL conviction from market analysis
                "time": f"{i * 5} minutes ago"
            })'''

with open('backend/main.py', 'r') as f:
    content = f.read()

if old_section in content:
    content = content.replace(old_section, new_trade_append)
    with open('backend/main.py', 'w') as f:
        f.write(content)
    print("Updated trades append with spike detection and wallet conviction")
else:
    print("Could not find old section")
