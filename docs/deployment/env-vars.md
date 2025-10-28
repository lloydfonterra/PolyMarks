# Environment Variables

## Required Variables

### `NEXT_PUBLIC_HELIUS_API_KEY`
**Description:** Helius RPC API key for Solana blockchain access

**Where to get it:** [https://helius.dev](https://helius.dev) (free tier available)

**Example:**
```env
NEXT_PUBLIC_HELIUS_API_KEY=abc123-def456-ghi789
```

**Used For:**
- Future Solana wallet tracking features
- Currently optional, but recommended for full functionality

---

## Optional Variables

### `NEXT_PUBLIC_POLYMARKET_API_URL`
**Description:** Polymarket Gamma API base URL

**Default:** `https://gamma-api.polymarket.com`

**Example:**
```env
NEXT_PUBLIC_POLYMARKET_API_URL=https://gamma-api.polymarket.com
```

**When to change:** If Polymarket changes their API endpoint

---

## Example `.env.local`

```env
# Helius RPC
NEXT_PUBLIC_HELIUS_API_KEY=your_helius_api_key_here

# Polymarket API (optional, uses default)
NEXT_PUBLIC_POLYMARKET_API_URL=https://gamma-api.polymarket.com
```

---

## Security Notes

1. **`NEXT_PUBLIC_` prefix:**
   - Exposes variable to browser
   - Safe for public APIs (Helius key is public-facing)

2. **Never commit `.env.local`:**
   - Already in `.gitignore`
   - Use `.env.example` for templates

3. **Production:**
   - Set environment variables in Vercel/Railway dashboard
   - Never hardcode sensitive keys in code

