with open('backend/app/services/polymarket_client.py', 'r') as f:
    content = f.read()

# New methods to add
new_methods = '''    def _detect_volume_spike(self, market: Dict[str, Any], baseline_volume: float = 100000) -> Dict[str, Any]:
        """Detect volume spikes compared to baseline"""
        volume = float(market.get("volume24hr", 0)) if market.get("volume24hr") else 0
        multiplier = volume / baseline_volume if baseline_volume > 0 else 1
        
        if multiplier >= 10:
            return {"spike_level": "mega", "spike_multiplier": round(multiplier, 1), "alert": True, "severity": "critical"}
        elif multiplier >= 5:
            return {"spike_level": "5x+", "spike_multiplier": round(multiplier, 1), "alert": True, "severity": "high"}
        elif multiplier >= 2:
            return {"spike_level": "2x", "spike_multiplier": round(multiplier, 1), "alert": True, "severity": "medium"}
        else:
            return {"spike_level": "normal", "spike_multiplier": round(multiplier, 1), "alert": False}
    
    def _calculate_wallet_conviction(self, wallet_id: str, trade_history: Dict[str, Any] = None) -> float:
        """Calculate trader conviction based on history (0-100)"""
        if not trade_history:
            return 40.0
        
        score = 40.0
        trade_count = trade_history.get("trade_count", 0)
        if trade_count >= 20:
            score += 25
        elif trade_count >= 10:
            score += 18
        elif trade_count >= 5:
            score += 12
        
        win_rate = trade_history.get("win_rate", 0.5)
        if win_rate > 0.75:
            score += 25
        elif win_rate > 0.65:
            score += 18
        elif win_rate > 0.55:
            score += 10
        
        market_count = trade_history.get("market_count", 1)
        if market_count >= 10:
            score += 15
        elif market_count >= 5:
            score += 8
        
        return round(min(100, max(0, score)), 1)
    
'''

# Find insertion point
insertion_marker = '    def _calculate_conviction_score(self, market: Dict[str, Any]) -> float:'

if insertion_marker in content:
    content = content.replace(insertion_marker, new_methods + insertion_marker)
    with open('backend/app/services/polymarket_client.py', 'w') as f:
        f.write(content)
    print("Successfully added methods")
else:
    print("Marker not found")
