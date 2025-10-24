# 🚀 Railway Deployment - Quick Start (5 Minutes)

## Prerequisites
- ✅ GitHub account (repo already there? Go to step 1)
- ✅ Railway account (create free at https://railway.app)

---

## 🎯 Step-by-Step Deployment

### Step 1: Push Code to GitHub
```bash
cd conviction
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### Step 2: Create Railway Project
1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize and select your `conviction` repository

### Step 3: Deploy Backend Service
1. Click **"+ Add Service"**
2. Select **"GitHub Repo"**
3. Choose your repo
4. Set **Root Directory** to: `conviction/backend`
5. Click **"Deploy"**
6. Wait for build to complete ✅

### Step 4: Deploy Frontend Service
1. Click **"+ Add Service"** 
2. Select **"GitHub Repo"**
3. Choose your repo
4. Set **Root Directory** to: `conviction/frontend`
5. Click **"Deploy"**
6. Wait for build to complete ✅

### Step 5: Add PostgreSQL Database
1. Click **"+ Add Service"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway auto-creates it
4. Environment variable injected automatically: `DATABASE_URL`

### Step 6: Add Redis Cache
1. Click **"+ Add Service"**
2. Select **"Database"** → **"Redis"**
3. Railway auto-creates it
4. Environment variable injected automatically: `REDIS_URL`

### Step 7: Set Frontend Environment Variable
1. Go to **Frontend Service** → **"Settings"**
2. Click **"Variables"**
3. Add new variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Copy backend service URL (e.g., `https://conviction-backend-prod-123.up.railway.app`)
4. Click **"Save"**

### Step 8: Verify Deployment
- **Backend health check**: 
  ```bash
  curl https://your-backend-url.up.railway.app/api/health/ping
  ```
  Should return: `{"status": "ok"}`

- **Frontend**: Visit the provided Railway URL ✅

---

## 🔧 Common Environment Variables

### Backend (`conviction/backend`)
```
DATABASE_URL=auto-injected from PostgreSQL
REDIS_URL=auto-injected from Redis
ENVIRONMENT=production
LOG_LEVEL=info
```

### Frontend (`conviction/frontend`)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app
```

---

## 📊 View Logs & Monitor

1. Click any service in Railway dashboard
2. Click **"Logs"** tab
3. See real-time output

---

## 🔄 Auto-Redeploy

Simply push to GitHub:
```bash
git push origin main
```

Railway automatically rebuilds and deploys! 🎉

---

## 🌐 Custom Domain (Optional)

1. Frontend service → **"Settings"**
2. Scroll to **"Domains"**
3. Click **"Add Custom Domain"**
4. Update your DNS records
5. Railway handles SSL automatically!

---

## 💡 Troubleshooting

### Build fails?
- Check Railway logs
- Ensure `requirements.txt` and `package.json` exist
- Look for error messages in build output

### Frontend blank page?
- Wait 2-3 minutes (still building)
- Check `NEXT_PUBLIC_API_URL` is set
- Check browser console for errors

### API calls fail?
- Verify `NEXT_PUBLIC_API_URL` matches backend URL
- Check CORS in backend `main.py`
- Verify backend service is running

### Database not connecting?
- PostgreSQL service must be running
- `DATABASE_URL` must be set
- Check backend logs for connection errors

---

## ✨ You're Done!

Your Conviction app is now live on Railway! 🎉

- **Backend**: Active and receiving requests
- **Frontend**: Live and connected
- **Database**: PostgreSQL running
- **Cache**: Redis ready
- **Auto-deploys**: Set and forget

---

## 📚 Next Steps

1. Connect your database and run migrations
2. Add WebSocket support for real-time updates
3. Set up monitoring (Sentry, LogRocket)
4. Add custom domain
5. Configure automated backups

---

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Check logs in Railway dashboard
- Join Railway community: https://railway.app/support
