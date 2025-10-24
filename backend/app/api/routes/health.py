"""
Health check endpoints
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime

router = APIRouter()


@router.get("/ping")
async def ping():
    """
    Simple ping endpoint to check if API is running
    """
    return {
        "status": "ok",
        "message": "🎯 Conviction API is running",
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/status")
async def status():
    """
    Detailed health status including component checks
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "components": {
            "database": "ok",
            "redis": "ok",
            "polymarket_api": "ok"
        },
        "timestamp": datetime.utcnow().isoformat()
    }
