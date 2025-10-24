"""
Whale Tracker Service - Monitor Etherscan for real Polymarket whale transactions
Detects large transactions and trader activity on-chain
"""

import httpx
import logging
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# Polymarket contract addresses (mainnet)
POLYMARKET_CONTRACTS = {
    "main": "0xC7eA1C41fBd82f3Af916eaf922Eef4b90Fed63e8",  # AMM contract
    "clob": "0x4bFa3f3d9e6Dc9bD899bDD2120bE41e2D1267fbD",  # CLOB contract
}

# Whale detection thresholds
WHALE_THRESHOLDS = {
    "mega": 100000,      # > $100k
    "large": 50000,      # > $50k
    "medium": 25000,     # > $25k
    "notable": 10000,    # > $10k (main detection threshold)
}


class WhaleTracker:
    """Monitor blockchain for whale activity on Polymarket"""

    def __init__(self, etherscan_api_key: str):
        self.etherscan_api_key = etherscan_api_key
        self.base_url = "https://api.etherscan.io/api"
        self.client = httpx.AsyncClient(timeout=30.0)
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes

    async def get_whale_transactions(
        self, 
        contract_address: str = POLYMARKET_CONTRACTS["main"],
        min_amount: float = WHALE_THRESHOLDS["notable"],
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Get recent large transactions for a contract"""
        try:
            # Get internal transactions (token transfers)
            params = {
                "module": "account",
                "action": "txlistinternal",
                "address": contract_address,
                "startblock": 0,
                "endblock": 99999999,
                "sort": "desc",
                "apikey": self.etherscan_api_key,
            }

            response = await self.client.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()

            if data.get("status") != "1":
                logger.warning(f"Etherscan API returned no results: {data}")
                return []

            transactions = data.get("result", [])
            
            # Filter for whale transactions (large value transfers)
            whale_txs = []
            for tx in transactions:
                try:
                    value_wei = int(tx.get("value", 0))
                    # Convert wei to USD equivalent (simplified)
                    # In reality, you'd need current ETH price
                    value_usd = value_wei / 1e18 * 2000  # Assume $2k per ETH
                    
                    if value_usd >= min_amount:
                        whale_txs.append({
                            "hash": tx.get("hash"),
                            "from": tx.get("from"),
                            "to": tx.get("to"),
                            "value_wei": value_wei,
                            "value_usd": value_usd,
                            "timestamp": int(tx.get("timeStamp", 0)),
                            "blockNumber": tx.get("blockNumber"),
                            "isError": tx.get("isError") == "0",
                        })
                except (ValueError, KeyError) as e:
                    logger.debug(f"Error parsing transaction: {e}")
                    continue
            
            return whale_txs[:limit]

        except Exception as e:
            logger.error(f"Error fetching whale transactions: {e}")
            return []

    async def get_wallet_history(
        self, 
        wallet_address: str,
        min_tx_value: float = WHALE_THRESHOLDS["notable"]
    ) -> Dict[str, Any]:
        """Get transaction history for a specific wallet"""
        try:
            params = {
                "module": "account",
                "action": "txlist",
                "address": wallet_address,
                "startblock": 0,
                "endblock": 99999999,
                "sort": "desc",
                "apikey": self.etherscan_api_key,
            }

            response = await self.client.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()

            if data.get("status") != "1":
                return {
                    "wallet": wallet_address,
                    "transactions": [],
                    "total_value": 0,
                    "tx_count": 0,
                }

            transactions = data.get("result", [])
            
            # Calculate statistics
            total_value = 0
            polymarket_txs = []
            
            for tx in transactions:
                try:
                    value_wei = int(tx.get("value", 0))
                    value_usd = value_wei / 1e18 * 2000
                    total_value += value_usd
                    
                    # Check if transaction is with Polymarket contract
                    if tx.get("to", "").lower() == POLYMARKET_CONTRACTS["main"].lower():
                        polymarket_txs.append({
                            "hash": tx.get("hash"),
                            "value_usd": value_usd,
                            "timestamp": int(tx.get("timeStamp", 0)),
                        })
                except (ValueError, KeyError):
                    continue

            return {
                "wallet": wallet_address,
                "transactions": polymarket_txs,
                "total_value": total_value,
                "tx_count": len(transactions),
                "polymarket_trades": len(polymarket_txs),
                "etherscan_url": f"https://etherscan.io/address/{wallet_address}",
            }

        except Exception as e:
            logger.error(f"Error fetching wallet history: {e}")
            return {"wallet": wallet_address, "error": str(e)}

    async def calculate_trader_conviction(
        self,
        wallet_address: str,
        lookback_days: int = 30
    ) -> Dict[str, Any]:
        """Calculate trader conviction based on activity"""
        try:
            history = await self.get_wallet_history(wallet_address)
            
            if not history.get("transactions"):
                return {
                    "wallet": wallet_address,
                    "conviction_score": 0,
                    "activity_level": "inactive",
                    "reasoning": "No Polymarket transactions found",
                }

            transactions = history["transactions"]
            
            # Score based on:
            # 1. Number of trades
            # 2. Average transaction size
            # 3. Frequency
            
            trade_count = len(transactions)
            total_value = sum(tx["value_usd"] for tx in transactions)
            avg_value = total_value / trade_count if trade_count > 0 else 0
            
            # Calculate conviction score (0-100)
            score = 0
            
            # Trade frequency score (30 points max)
            if trade_count >= 20:
                score += 30
            elif trade_count >= 10:
                score += 20
            elif trade_count >= 5:
                score += 10
            
            # Average transaction size score (40 points max)
            if avg_value >= 100000:
                score += 40
            elif avg_value >= 50000:
                score += 30
            elif avg_value >= 10000:
                score += 20
            
            # Consistency score (30 points max)
            if trade_count >= 5:
                score += 30
            elif trade_count >= 3:
                score += 20
            
            # Activity level
            if score >= 80:
                activity_level = "whale"
            elif score >= 60:
                activity_level = "active_trader"
            elif score >= 40:
                activity_level = "regular"
            else:
                activity_level = "casual"

            return {
                "wallet": wallet_address,
                "conviction_score": min(100, score),
                "activity_level": activity_level,
                "trade_count": trade_count,
                "total_volume": total_value,
                "avg_transaction": avg_value,
                "etherscan_url": f"https://etherscan.io/address/{wallet_address}",
            }

        except Exception as e:
            logger.error(f"Error calculating conviction: {e}")
            return {"wallet": wallet_address, "error": str(e)}

    async def detect_whale_alerts(
        self,
        min_amount: float = WHALE_THRESHOLDS["medium"]
    ) -> List[Dict[str, Any]]:
        """Detect recent whale transactions and return as alerts"""
        try:
            whale_txs = await self.get_whale_transactions(
                min_amount=min_amount,
                limit=10
            )

            alerts = []
            for tx in whale_txs:
                # Classify whale size
                value = tx["value_usd"]
                if value >= WHALE_THRESHOLDS["mega"]:
                    severity = "critical"
                    whale_type = "MEGA WHALE"
                elif value >= WHALE_THRESHOLDS["large"]:
                    severity = "high"
                    whale_type = "LARGE WHALE"
                elif value >= WHALE_THRESHOLDS["medium"]:
                    severity = "medium"
                    whale_type = "WHALE"
                else:
                    severity = "low"
                    whale_type = "NOTABLE"

                # Create alert
                alert = {
                    "id": f"whale_{tx['hash'][:8]}",
                    "type": "whale_transaction",
                    "title": f"{whale_type} - ${value:,.0f}",
                    "description": f"Large transaction detected on Polymarket",
                    "severity": severity,
                    "wallet": tx["from"],
                    "amount": f"${value:,.0f}",
                    "timestamp": datetime.fromtimestamp(tx["timestamp"]).isoformat(),
                    "etherscan_url": f"https://etherscan.io/tx/{tx['hash']}",
                    "data": {
                        "transaction_hash": tx["hash"],
                        "from_address": tx["from"],
                        "to_address": tx["to"],
                        "value_usd": value,
                    }
                }
                alerts.append(alert)

            return alerts

        except Exception as e:
            logger.error(f"Error detecting whale alerts: {e}")
            return []

    async def close(self):
        """Clean up resources"""
        await self.client.aclose()
