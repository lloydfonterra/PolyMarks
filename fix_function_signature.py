with open('backend/main.py', 'r') as f:
    content = f.read()

old_sig = '''@app.get("/api/trades/recent")
async def trades_recent(limit: int = 10, offset: int = 0):
    """Get recent large (whale) trades from Polymarket"""'''

new_sig = '''@app.get("/api/trades/recent")
async def trades_recent(
    limit: int = 10,
    offset: int = 0,
    min_conviction: float = 0,
    max_conviction: float = 100,
    conviction_filter: str = "all",
    spike_alert: bool = False,
    sort_by: str = "conviction"
):
    """Get recent large (whale) trades from Polymarket with advanced filtering"""'''

if old_sig in content:
    content = content.replace(old_sig, new_sig)
    with open('backend/main.py', 'w') as f:
        f.write(content)
    print("✅ Fixed function signature!")
else:
    print("❌ Could not find signature")
