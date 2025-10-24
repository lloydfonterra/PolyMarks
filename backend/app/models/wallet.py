"""
Wallet models - represents trader wallets and wallet clusters
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum


class WalletType(str, Enum):
    WHALE = "whale"
    MARKET_MAKER = "market_maker"
    RETAIL = "retail"
    BOT = "bot"
    UNKNOWN = "unknown"


class Wallet(BaseModel):
    """Wallet data model"""
    address: str = Field(..., description="Wallet address")
    wallet_type: WalletType = Field(default=WalletType.UNKNOWN)
    total_volume: float = Field(default=0.0, description="Total USDC volume traded")
    win_rate: float = Field(default=0.0, description="Win rate (0-100)")
    num_trades: int = Field(default=0)
    num_wins: int = Field(default=0)
    avg_trade_size: float = Field(default=0.0)
    first_trade_date: Optional[datetime] = None
    last_trade_date: Optional[datetime] = None
    is_active: bool = Field(default=True)
    conviction_score: float = Field(default=0.0, description="Overall conviction metric")
    
    class Config:
        json_schema_extra = {
            "example": {
                "address": "0x1234567890abcdef",
                "wallet_type": "whale",
                "total_volume": 500000.0,
                "win_rate": 72.5,
                "num_trades": 120,
                "num_wins": 87,
                "avg_trade_size": 4166.67,
                "first_trade_date": "2024-01-15T10:00:00Z",
                "last_trade_date": "2025-10-24T15:30:00Z",
                "is_active": True,
                "conviction_score": 85.3
            }
        }


class WalletProfile(BaseModel):
    """Detailed profile of a wallet with behavioral analysis"""
    wallet_address: str
    profile_type: WalletType
    markets_traded: int = Field(description="Number of unique markets")
    avg_position_size: float
    position_hold_time_hours: float = Field(description="Average hours holding a position")
    market_concentration: float = Field(description="How concentrated in top markets (0-1)")
    order_timing_pattern: str = Field(description="Analysis of order timing")
    price_prediction_accuracy: float = Field(description="How often they pick winners")
    risk_tolerance: str = Field(description="aggressive/moderate/conservative")
    last_updated: datetime
    

class WalletCluster(BaseModel):
    """Group of related wallets (likely same entity)"""
    cluster_id: str = Field(..., description="Unique cluster ID")
    primary_wallet: str = Field(..., description="Main wallet address")
    related_wallets: List[str] = Field(..., description="Connected addresses")
    cluster_size: int = Field(description="Number of wallets in cluster")
    total_volume: float = Field(description="Combined trading volume")
    confidence_score: float = Field(description="Likelihood these are related (0-100)")
    cluster_type: WalletType
    created_at: datetime
    last_updated: datetime
    reasoning: Optional[str] = Field(None, description="Why these wallets are clustered")
    
    class Config:
        json_schema_extra = {
            "example": {
                "cluster_id": "cluster_abc123",
                "primary_wallet": "0x1111111111",
                "related_wallets": ["0x2222222222", "0x3333333333"],
                "cluster_size": 3,
                "total_volume": 1500000.0,
                "confidence_score": 92.5,
                "cluster_type": "whale",
                "reasoning": "Same deposit patterns, synchronized trades"
            }
        }
