# 🚀 Deployment Guide

Deploy plymrkt to Vercel in 5 minutes!

## Prerequisites

1. **Helius API Key** (Free)
   - Go to [helius.dev](https://helius.dev)
   - Sign up for free account
   - Get your API key
   - Free tier: 100K requests/day (plenty for MVP!)

2. **GitHub Account**
   - Push your code to GitHub repository

3. **Vercel Account** (Free)
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub account

## Step-by-Step Deployment

### 1. Setup Environment Variables Locally

```bash
# Copy example env file
cp .env.local.example .env.local

# Edit .env.local and add your Helius API key
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY_HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Test Locally

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
# Should see markets loading!
```

### 3. Push to GitHub

```bash
git add .
git commit -m "Initial plymrkt deployment"
git push origin main
```

### 4. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js
4. Add environment variables:
   - `HELIUS_RPC_URL` = your Helius RPC URL
   - `NEXT_PUBLIC_APP_URL` = will be provided after first deploy
5. Click "Deploy"
6. Wait 2-3 minutes ⏰
7. Done! 🎉

### 5. Update App URL

After first deployment:

1. Copy your Vercel URL (e.g., `plymrkt.vercel.app`)
2. Go to Vercel Dashboard → Settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
4. Redeploy (it will auto-redeploy on next push)

## Custom Domain (Optional)

1. Buy domain from Namecheap/GoDaddy (~$12/year)
2. Go to Vercel → Settings → Domains
3. Add your domain
4. Update DNS records (Vercel provides instructions)
5. Wait 24h for DNS propagation
6. Done! Your site is at `plymrkt.com` 🚀

## Cost Breakdown

```
Domain (optional):     $12/year
Vercel Hosting:        $0/month (free tier)
Helius RPC:            $0/month (free tier)
Polymarket API:        $0/month (free)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                 $12/year (or $0 without domain!)
```

## Monitoring

Vercel automatically provides:
- ✅ Analytics dashboard
- ✅ Error tracking
- ✅ Performance metrics
- ✅ Deployment logs

## Scaling

If you exceed free tier limits:

**Helius Pro:** $50/month
- 1M requests/day
- Still very affordable!

**Vercel Pro:** $20/month
- Better performance
- More bandwidth
- Priority support

## Troubleshooting

### Markets not loading?

Check Vercel logs for API errors:
```bash
vercel logs
```

### Wallet tracking not working?

1. Verify `HELIUS_RPC_URL` is set in Vercel env vars
2. Check Helius dashboard for API key status
3. Make sure you're on free tier limits

### Build failing?

```bash
# Clear cache and rebuild locally first
rm -rf .next node_modules
npm install
npm run build

# If local build works, push to GitHub
# Vercel will rebuild automatically
```

## Next Steps

1. ✅ Share on Twitter/Reddit
2. ✅ Add Google Analytics (optional)
3. ✅ Monitor Polymarket referral revenue
4. ✅ Add more features!

---

**Total Setup Time:** ~10 minutes

**Total Cost:** $0-12/year

**Revenue Potential:** $1K-50K/month from referrals

Let's ship it! 🚀

