"""
Trade model - represents a single trade/transaction on Polymarket
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum


class TradeType(str, Enum):
    BUY = "buy"
    SELL = "sell"


class Trade(BaseModel):
    """Trade data model"""
    id: str = Field(..., description="Unique trade ID")
    market_id: str = Field(..., description="Polymarket ID")
    market_question: str = Field(..., description="Market question")
    trader_address: str = Field(..., description="Trader wallet address")
    trade_type: TradeType = Field(..., description="Buy or Sell")
    amount: float = Field(..., description="USDC amount")
    price: float = Field(..., description="Share price")
    shares: float = Field(..., description="Number of shares")
    timestamp: datetime = Field(..., description="Trade execution time")
    block_number: int = Field(..., description="Blockchain block number")
    tx_hash: str = Field(..., description="Transaction hash")
    is_large_trade: bool = Field(default=False, description="Flagged as large/whale trade")
    conviction_score: Optional[float] = Field(None, description="Conviction metric (0-100)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "trade_123",
                "market_id": "market_456",
                "market_question": "Will BTC reach $50k by end of Q4?",
                "trader_address": "0x1234...5678",
                "trade_type": "buy",
                "amount": 5000.0,
                "price": 0.65,
                "shares": 7692.0,
                "timestamp": "2025-10-24T10:30:00Z",
                "block_number": 19000000,
                "tx_hash": "0xabcd...efgh",
                "is_large_trade": True,
                "conviction_score": 85.5
            }
        }


class TradeCreate(BaseModel):
    """Schema for creating a new trade"""
    market_id: str
    market_question: str
    trader_address: str
    trade_type: TradeType
    amount: float
    price: float
    shares: float
    timestamp: datetime
    block_number: int
    tx_hash: str
