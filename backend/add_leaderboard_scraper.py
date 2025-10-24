#!/usr/bin/env python3
"""Add leaderboard scraper to backend main.py"""

# Add import
with open('main.py', 'r') as f:
    content = f.read()

# Add import if not already present
if 'polymarket_leaderboard_scraper' not in content:
    content = content.replace(
        'from app.services.whale_tracker import WhaleTracker',
        'from app.services.whale_tracker import WhaleTracker\nfrom app.services.polymarket_leaderboard_scraper import get_leaderboard_scraper'
    )
    
    # Add initialization after whale tracker
    content = content.replace(
        '''# Initialize whale tracker with API key
whale_tracker = WhaleTracker(
    etherscan_api_key=os.getenv("ETHERSCAN_API_KEY", "M7XZ8PJKIS86MD6QD6ZWFAD6ZA1PD2Y3HH")
)

# Root endpoint''',
        '''# Initialize whale tracker with API key
whale_tracker = WhaleTracker(
    etherscan_api_key=os.getenv("ETHERSCAN_API_KEY", "M7XZ8PJKIS86MD6QD6ZWFAD6ZA1PD2Y3HH")
)

# Initialize leaderboard scraper
leaderboard_scraper = get_leaderboard_scraper()

# Root endpoint'''
    )

# Add the endpoint before the last closing comment
endpoint_code = '''

# ============ Leaderboard Real Data Endpoint ============

@app.get("/api/leaderboard/real")
async def get_real_leaderboard(
    timeframe: str = "all-time",
    category: str = "overall",
    sort_by: str = "profit",
    limit: int = 10
):
    """Get REAL trader leaderboard from Polymarket website"""
    try:
        traders = await leaderboard_scraper.get_leaderboard(
            timeframe=timeframe,
            category=category,
            sort_by=sort_by,
            limit=limit
        )
        
        logger.info(f"Fetched {len(traders)} real traders from Polymarket leaderboard")
        
        return {
            "traders": traders,
            "count": len(traders),
            "source": "polymarket_scraper",
            "real_data": True,
            "timeframe": timeframe,
            "category": category,
            "sort_by": sort_by
        }
    except Exception as e:
        logger.error(f"Error fetching real leaderboard: {e}", exc_info=True)
        return {
            "traders": [],
            "count": 0,
            "error": str(e),
            "source": "polymarket_scraper"
        }
'''

# Find the last endpoint and add our endpoint before startup/shutdown
if '@app.get("/api/whales/alerts/recent")' in content:
    content = content.replace(
        '@app.get("/api/whales/alerts/recent")',
        endpoint_code + '\n\n@app.get("/api/whales/alerts/recent")',
        1  # Replace only once, putting our endpoint first
    )

with open('main.py', 'w') as f:
    f.write(content)

print('[+] Added leaderboard scraper import and endpoint to main.py')
