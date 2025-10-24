# Getting Started with Conviction

## Prerequisites

- **Python 3.11+** - For backend development
- **Node.js 18+** - For frontend development
- **Docker & Docker Compose** - For containerized development
- **PostgreSQL 15+** - Database (optional if using Docker)
- **Redis 7+** - Cache (optional if using Docker)
- **Git** - Version control

## Quick Start (Docker - Recommended)

### 1. Clone and Navigate

```bash
cd conviction
```

### 2. Start All Services

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database
- Start Redis cache
- Build and run FastAPI backend
- Build and run Next.js frontend

### 3. Access the Application

- **Frontend Dashboard:** http://localhost:3000
- **API Documentation:** http://localhost:8000/docs
- **API Status:** http://localhost:8000/api/health/status

### 4. Verify Everything Works

```bash
# Check API health
curl http://localhost:8000/api/health/ping

# You should see:
# {"status":"ok","message":"🎯 Conviction API is running",...}
```

---

## Local Development Setup (Without Docker)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env with your settings

# Run database migrations (when ready)
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

API will be available at: http://localhost:8000

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local
echo 'NEXT_PUBLIC_API_URL=http://localhost:8000' > .env.local

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:3000

---

## Configuration

### Backend Environment Variables

Create `backend/.env`:

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/conviction
DATABASE_ECHO=False

# Redis
REDIS_URL=redis://localhost:6379/0

# Polymarket
POLYMARKET_API_URL=https://clob.polymarket.com

# API
CORS_ORIGINS=http://localhost:3000
API_PORT=8000

# Data Pipeline
TRADE_INGESTION_INTERVAL_SECONDS=5
WHALE_THRESHOLD_USDC=10000.0
CONVICTION_SCORE_THRESHOLD=75.0
```

### Frontend Environment Variables

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## API Endpoints Overview

### Health Check
- `GET /api/health/ping` - Quick health check
- `GET /api/health/status` - Detailed status

### Trades
- `GET /api/trades/recent` - Recent large trades
- `GET /api/trades/large` - Whale trades (last N hours)
- `GET /api/trades/{market_id}` - Trades for specific market
- `WS /api/trades/ws/live` - WebSocket for real-time trades

### Wallets
- `GET /api/wallets/profile/{address}` - Wallet profile
- `GET /api/wallets/whales` - Top whale wallets
- `GET /api/wallets/clusters` - Wallet clusters
- `GET /api/wallets/similar/{address}` - Similar traders

### Leaderboard
- `GET /api/leaderboard/top` - Top traders
- `GET /api/leaderboard/whales` - Whale leaderboard
- `GET /api/leaderboard/trader/{address}` - Single trader stats
- `POST /api/leaderboard/follow/{address}` - Follow a trader

### Alerts
- `GET /api/alerts/rules` - User's alert rules
- `POST /api/alerts/rule/create` - Create new rule
- `GET /api/alerts/recent` - Recent alerts

**Full docs:** http://localhost:8000/docs

---

## Common Development Tasks

### Add a New API Endpoint

1. Create/edit route in `backend/app/api/routes/`
2. Add Pydantic model in `backend/app/models/`
3. Implement service in `backend/app/services/`
4. Test with FastAPI `/docs` at http://localhost:8000/docs

### Run Tests

```bash
cd backend
pytest
```

### Database Migrations

```bash
cd backend

# Create a new migration
alembic revision --autogenerate -m "Add new table"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1
```

### Check Logs

```bash
# Backend logs
docker logs conviction-backend -f

# Frontend logs
docker logs conviction-frontend -f

# Database logs
docker logs conviction-postgres -f
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000
# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check database credentials in .env
# Default: postgresql://conviction_user:conviction_pass@localhost:5432/conviction
```

### Redis Connection Error

```bash
# Verify Redis is running
docker ps | grep redis

# Check Redis connection
redis-cli ping
```

### Frontend Can't Connect to API

```bash
# Verify API is running
curl http://localhost:8000/api/health/ping

# Check CORS settings in backend
# Should allow http://localhost:3000
```

---

## Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/whale-detection
   ```

2. **Make changes**
   - Backend: Edit files in `backend/app/`
   - Frontend: Edit files in `frontend/`

3. **Test locally**
   ```bash
   # Backend tests
   cd backend && pytest

   # Frontend: Use http://localhost:3000 browser
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add whale detection feature"
   git push origin feature/whale-detection
   ```

5. **Create Pull Request**

---

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Check out API endpoints at http://localhost:8000/docs
- Explore frontend components in `frontend/`
- Read Polymarket API docs: https://docs.polymarket.com

---

## Getting Help

- **API Questions:** Check `/docs` endpoint
- **Polymarket Questions:** https://docs.polymarket.com
- **FastAPI Questions:** https://fastapi.tiangolo.com
- **Next.js Questions:** https://nextjs.org/docs

Happy coding! 🎯
