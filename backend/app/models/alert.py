"""
Alert models - real-time notifications for user-defined conditions
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum


class AlertType(str, Enum):
    LARGE_TRADE = "large_trade"
    WHALE_ACTIVITY = "whale_activity"
    CONVICTION_CHANGE = "conviction_change"
    PRICE_THRESHOLD = "price_threshold"
    VOLUME_SPIKE = "volume_spike"
    WALLET_ACTIVITY = "wallet_activity"
    CLUSTER_ACTIVITY = "cluster_activity"


class AlertStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    IGNORED = "ignored"


class AlertRule(BaseModel):
    """Rule for triggering alerts"""
    rule_id: str = Field(..., description="Unique rule ID")
    user_id: Optional[str] = Field(None)
    alert_type: AlertType
    
    # Trigger conditions
    min_trade_size: Optional[float] = Field(None, description="Minimum USDC to trigger")
    watched_wallets: Optional[List[str]] = Field(None, description="Specific wallets to watch")
    watched_clusters: Optional[List[str]] = Field(None, description="Specific clusters to watch")
    conviction_threshold: Optional[float] = Field(None, description="Conviction score threshold")
    price_threshold: Optional[float] = Field(None, description="Price level to watch")
    volume_spike_percent: Optional[float] = Field(None, description="Volume increase %")
    
    # Configuration
    is_active: bool = Field(default=True)
    notification_channels: List[str] = Field(default=["email"], description="email/sms/inapp/webhook")
    cooldown_minutes: int = Field(default=5, description="Minimum time between alerts")
    
    created_at: datetime
    last_triggered: Optional[datetime] = None


class Alert(BaseModel):
    """Individual alert notification"""
    alert_id: str = Field(..., description="Unique alert ID")
    rule_id: str = Field(..., description="Associated rule ID")
    alert_type: AlertType
    
    # Alert content
    title: str
    message: str
    severity: str = Field(description="low/medium/high/critical")
    
    # Context data
    market_id: Optional[str] = None
    market_question: Optional[str] = None
    trader_address: Optional[str] = None
    trade_size: Optional[float] = None
    conviction_score: Optional[float] = None
    
    # Status
    status: AlertStatus = Field(default=AlertStatus.PENDING)
    created_at: datetime
    sent_at: Optional[datetime] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "alert_id": "alert_xyz789",
                "rule_id": "rule_123",
                "alert_type": "large_trade",
                "title": "🐋 Whale Trade Detected",
                "message": "Large position of 50,000 USDC in 'Will BTC reach 50k?'",
                "severity": "high",
                "market_id": "market_456",
                "market_question": "Will BTC reach $50k by Q4?",
                "trader_address": "0xwhale123",
                "trade_size": 50000.0,
                "conviction_score": 92.5,
                "status": "sent",
                "created_at": "2025-10-24T15:30:00Z",
                "sent_at": "2025-10-24T15:31:00Z"
            }
        }


class AlertCreate(BaseModel):
    """Schema for creating a new alert rule"""
    alert_type: AlertType
    min_trade_size: Optional[float] = None
    watched_wallets: Optional[List[str]] = None
    watched_clusters: Optional[List[str]] = None
    conviction_threshold: Optional[float] = None
    notification_channels: List[str] = Field(default=["email"])
    cooldown_minutes: int = Field(default=5)
