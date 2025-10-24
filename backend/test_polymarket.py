import httpx
import asyncio

async def test_polymarket():
    try:
        print("Testing Polymarket API connection...")
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get('https://clob.polymarket.com/markets')
            print(f"Status: {response.status_code}")
            print(f"Data received: {len(response.text)} characters")
            data = response.json()
            markets = data.get('data', [])
            print(f"Markets found: {len(markets)} markets")
            if markets:
                print(f"First market: {markets[0].get('question', 'N/A')[:80]}")
            return True
    except Exception as e:
        print(f"Error: {e}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    result = asyncio.run(test_polymarket())
    exit(0 if result else 1)
