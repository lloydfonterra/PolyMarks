"""
Leaderboard models - trader rankings and performance metrics
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class TraderStats(BaseModel):
    """Performance statistics for a trader"""
    trader_address: str = Field(..., description="Wallet address")
    win_rate: float = Field(..., ge=0, le=100, description="Win rate percentage")
    total_trades: int = Field(..., ge=0)
    total_volume: float = Field(..., ge=0, description="Total USDC traded")
    total_profit: float = Field(..., description="Total profit/loss")
    roi: float = Field(..., description="Return on investment percentage")
    sharpe_ratio: Optional[float] = Field(None, description="Risk-adjusted return")
    max_drawdown: Optional[float] = Field(None, description="Maximum decline from peak")
    avg_trade_size: float = Field(..., ge=0)
    consecutive_wins: int = Field(default=0)
    best_market: Optional[str] = Field(None, description="Most profitable market")
    avg_hold_time_hours: float = Field(description="Average position hold time")


class LeaderboardEntry(BaseModel):
    """Single entry in the leaderboard"""
    rank: int = Field(..., ge=1, description="Position in leaderboard")
    trader_address: str
    display_name: Optional[str] = Field(None, description="Optional display name")
    score: float = Field(..., description="Composite score (0-100)")
    
    # Key metrics
    win_rate: float
    total_trades: int
    total_volume: float
    total_profit: float
    roi: float
    
    # Ranking breakdown
    win_rate_rank: int
    volume_rank: int
    profit_rank: int
    roi_rank: int
    
    # Status
    is_whale: bool = Field(description="Flagged as whale/smart money")
    trend: str = Field(description="up/down/stable")
    days_active: int = Field(description="Days since first trade")
    
    last_updated: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "rank": 1,
                "trader_address": "0xwhale123",
                "display_name": "Smart Whale",
                "score": 98.5,
                "win_rate": 78.5,
                "total_trades": 250,
                "total_volume": 2500000.0,
                "total_profit": 425000.0,
                "roi": 17.0,
                "win_rate_rank": 3,
                "volume_rank": 1,
                "profit_rank": 2,
                "roi_rank": 1,
                "is_whale": True,
                "trend": "up",
                "days_active": 145,
                "last_updated": "2025-10-24T15:30:00Z"
            }
        }
