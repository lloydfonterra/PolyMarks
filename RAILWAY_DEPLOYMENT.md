# Railway Deployment Guide for Conviction

## 🚀 Quick Start (5 minutes)

### Step 1: Prepare Your Repository
Make sure your repo is on GitHub and you're logged in.

```bash
# Push your code to GitHub if not already done
git add .
git commit -m "Conviction app ready for Railway deployment"
git push origin main
```

---

## 📋 Setup Overview

Railway will run:
- **Backend**: FastAPI on port 8000
- **Frontend**: Next.js on port 3000
- **PostgreSQL**: Managed database
- **Redis**: Managed cache

---

## 🔧 Part 1: Backend Setup

### 1.1 Create `railway.json` for Backend Configuration

Create `conviction/backend/railway.json`:

```json
{
  "build": {
    "builder": "dockerfile"
  },
  "deploy": {
    "port": 8000
  }
}
```

### 1.2 Create Dockerfile for Backend

Create `conviction/backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 1.3 Create `.dockerignore` for Backend

Create `conviction/backend/.dockerignore`:

```
venv
__pycache__
*.pyc
.env.local
.git
.gitignore
.pytest_cache
*.egg-info
dist
build
```

---

## 🎨 Part 2: Frontend Setup

### 2.1 Create Dockerfile for Frontend

Create `conviction/frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### 2.2 Create `.dockerignore` for Frontend

Create `conviction/frontend/.dockerignore`:

```
node_modules
.next
.git
.gitignore
README.md
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log
.DS_Store
dist
build
```

### 2.3 Update `next.config.js` for Production

Update `conviction/frontend/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
};

module.exports = nextConfig;
```

---

## 🌐 Part 3: Deploy on Railway

### 3.1 Connect GitHub to Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway with GitHub
5. Select your `conviction` repository

### 3.2 Create Backend Service

1. In Railway dashboard, click **"+ New Service"**
2. Select **"GitHub Repo"**
3. Choose the repo, set:
   - **Root Directory**: `conviction/backend`
   - **Environment**: Python
4. Click **"Deploy"**

### 3.3 Create Frontend Service

1. Click **"+ New Service"** again
2. Select **"GitHub Repo"**
3. Choose the repo, set:
   - **Root Directory**: `conviction/frontend`
   - **Environment**: Node
4. Click **"Deploy"**

### 3.4 Add Database Services

#### PostgreSQL:
1. Click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway creates it automatically
3. Environment variables are injected: `DATABASE_URL`

#### Redis:
1. Click **"+ New"** → **"Database"** → **"Redis"**
2. Environment variables: `REDIS_URL`

---

## 🔐 Part 4: Environment Variables

### Backend Environment Variables

Go to backend service settings and add:

```
DATABASE_URL=postgres://user:pass@host:port/db
REDIS_URL=redis://host:port
ENVIRONMENT=production
LOG_LEVEL=info
```

### Frontend Environment Variables

Go to frontend service settings and add:

```
NEXT_PUBLIC_API_URL=https://your-backend-railway-url.up.railway.app
```

---

## 📱 Part 5: Configure Services

### Backend Service Configuration

In Railway dashboard for backend:

```
Port: 8000
Build Command: pip install -r requirements.txt
Start Command: python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend Service Configuration

In Railway dashboard for frontend:

```
Port: 3000
Build Command: npm ci && npm run build
Start Command: npm start
```

---

## ✅ Verify Deployment

### Check Backend Health
```bash
curl https://your-backend-url.up.railway.app/api/health/ping
```

Should return: `{"status": "ok"}`

### Check Frontend
Visit: `https://your-frontend-url.up.railway.app`

### Check Logs
In Railway dashboard, click each service to view real-time logs.

---

## 🐛 Troubleshooting

### Frontend shows "Cannot GET /"
- Make sure `npm run build` succeeded
- Check that `next.config.js` is correct
- Frontend might still be building (wait 2-3 minutes)

### API calls fail from frontend
- Make sure `NEXT_PUBLIC_API_URL` environment variable is set
- Frontend must know the backend URL
- Check CORS settings in backend `main.py`

### Database connection errors
- Verify `DATABASE_URL` is set correctly
- PostgreSQL service must be running
- Check Railway logs for the exact error

### DNS resolution issues (getaddrinfo failed)
**Good news!** Linux native networking handles this perfectly - it should work on Railway!

---

## 🚀 Deploy Custom Domain (Optional)

1. Go to frontend service → **"Settings"**
2. Under **"Domains"**, add your custom domain
3. Update DNS records as instructed
4. Railway handles SSL automatically!

---

## 📊 Monitor Your App

Railway dashboard shows:
- ✅ Deployment status
- 📈 CPU/Memory usage
- 📝 Real-time logs
- 🔄 Automatic restarts on crashes
- 📈 Request metrics

---

## 🔄 Update Your App

Simply push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Railway automatically redeploys! ✨

---

## 💡 Next Steps

1. **Database Setup**: Connect to PostgreSQL, run migrations
2. **Monitoring**: Set up error tracking (Sentry, LogRocket)
3. **Custom Domain**: Add your domain
4. **CI/CD**: Configure automated tests before deploy

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Community: https://railway.app/support
- Status: https://status.railway.app
