"""
Wallet Clustering Service
Groups related wallet addresses based on trading patterns and fund flows
"""

from typing import Dict, List, Set, Tuple
from collections import defaultdict
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class WalletCluster:
    """Represents a cluster of related wallets"""
    
    def __init__(self, primary_wallet: str, cluster_id: str):
        self.cluster_id = cluster_id
        self.primary_wallet = primary_wallet
        self.wallets: Set[str] = {primary_wallet}
        self.trades: List[Dict] = []
        self.confidence_score = 0.0
        self.last_activity = None
        self.total_volume = 0.0
    
    def add_wallet(self, wallet: str, confidence: float = 0.5):
        """Add a wallet to the cluster"""
        self.wallets.add(wallet)
        self.confidence_score = max(self.confidence_score, confidence)
    
    def add_trade(self, trade: Dict):
        """Add a trade to the cluster"""
        self.trades.append(trade)
        self.total_volume += trade.get("amount", 0)
        self.last_activity = datetime.utcnow()
    
    def to_dict(self) -> Dict:
        """Convert cluster to dictionary"""
        return {
            "cluster_id": self.cluster_id,
            "primary_wallet": self.primary_wallet,
            "wallets": list(self.wallets),
            "wallet_count": len(self.wallets),
            "confidence_score": self.confidence_score,
            "total_volume": self.total_volume,
            "trade_count": len(self.trades),
            "last_activity": self.last_activity.isoformat() if self.last_activity else None,
        }


class WalletClusteringEngine:
    """Engine for clustering related wallets"""
    
    def __init__(self):
        self.clusters: Dict[str, WalletCluster] = {}
        self.wallet_to_cluster: Dict[str, str] = {}
        self._similarity_threshold = 0.6
        self._recency_weight = 0.3
        self._volume_weight = 0.4
        self._pattern_weight = 0.3
    
    def cluster_wallets(self, trades: List[Dict]) -> Dict[str, WalletCluster]:
        """
        Cluster wallets based on trading patterns
        
        Args:
            trades: List of trade data
            
        Returns:
            Dictionary of clusters keyed by cluster ID
        """
        if not trades:
            return {}
        
        # Initialize clusters from trades
        self._initialize_clusters(trades)
        
        # Merge similar clusters
        self._merge_similar_clusters(trades)
        
        return self.clusters
    
    def _initialize_clusters(self, trades: List[Dict]):
        """Initialize clusters from trades"""
        wallet_trades: Dict[str, List[Dict]] = defaultdict(list)
        
        # Group trades by wallet
        for trade in trades:
            buyer = trade.get("buyer")
            seller = trade.get("seller")
            
            if buyer:
                wallet_trades[buyer].append({"trade": trade, "role": "buyer"})
            if seller:
                wallet_trades[seller].append({"trade": trade, "role": "seller"})
        
        # Create initial clusters
        for idx, (wallet, trades_list) in enumerate(wallet_trades.items()):
            cluster_id = f"cluster_{idx}"
            cluster = WalletCluster(wallet, cluster_id)
            
            for trade_info in trades_list:
                cluster.add_trade(trade_info["trade"])
            
            self.clusters[cluster_id] = cluster
            self.wallet_to_cluster[wallet] = cluster_id
    
    def _merge_similar_clusters(self, trades: List[Dict]):
        """Merge clusters that are likely the same entity"""
        cluster_list = list(self.clusters.values())
        
        for i in range(len(cluster_list)):
            for j in range(i + 1, len(cluster_list)):
                similarity = self._calculate_similarity(
                    cluster_list[i],
                    cluster_list[j],
                    trades
                )
                
                if similarity >= self._similarity_threshold:
                    # Merge cluster j into cluster i
                    self._merge_clusters(cluster_list[i], cluster_list[j])
    
    def _calculate_similarity(
        self,
        cluster1: WalletCluster,
        cluster2: WalletCluster,
        all_trades: List[Dict]
    ) -> float:
        """
        Calculate similarity between two clusters
        
        Args:
            cluster1: First cluster
            cluster2: Second cluster
            all_trades: All trades for context
            
        Returns:
            Similarity score between 0 and 1
        """
        scores = []
        
        # Recency similarity - do they trade at similar times?
        recency_score = self._calculate_recency_similarity(cluster1, cluster2)
        scores.append(recency_score * self._recency_weight)
        
        # Volume similarity - do they trade similar amounts?
        volume_score = self._calculate_volume_similarity(cluster1, cluster2)
        scores.append(volume_score * self._volume_weight)
        
        # Pattern similarity - do they trade similar markets?
        pattern_score = self._calculate_pattern_similarity(cluster1, cluster2, all_trades)
        scores.append(pattern_score * self._pattern_weight)
        
        return sum(scores)
    
    def _calculate_recency_similarity(
        self,
        cluster1: WalletCluster,
        cluster2: WalletCluster
    ) -> float:
        """Calculate how recently they traded relative to each other"""
        if not cluster1.last_activity or not cluster2.last_activity:
            return 0.5
        
        time_diff = abs(
            (cluster1.last_activity - cluster2.last_activity).total_seconds()
        )
        
        # Decay over 7 days
        days_diff = time_diff / (7 * 24 * 3600)
        similarity = max(0, 1 - days_diff)
        
        return similarity
    
    def _calculate_volume_similarity(
        self,
        cluster1: WalletCluster,
        cluster2: WalletCluster
    ) -> float:
        """Calculate how similar their trade volumes are"""
        if cluster1.total_volume == 0 or cluster2.total_volume == 0:
            return 0.5
        
        ratio = min(cluster1.total_volume, cluster2.total_volume) / max(
            cluster1.total_volume, cluster2.total_volume
        )
        return ratio
    
    def _calculate_pattern_similarity(
        self,
        cluster1: WalletCluster,
        cluster2: WalletCluster,
        all_trades: List[Dict]
    ) -> float:
        """Calculate how similar their trading patterns are"""
        # Extract markets they trade in
        markets1 = set(t.get("market_id") for t in cluster1.trades)
        markets2 = set(t.get("market_id") for t in cluster2.trades)
        
        if not markets1 or not markets2:
            return 0.5
        
        intersection = len(markets1 & markets2)
        union = len(markets1 | markets2)
        
        # Jaccard similarity
        jaccard_similarity = intersection / union if union > 0 else 0
        
        return jaccard_similarity
    
    def _merge_clusters(self, target: WalletCluster, source: WalletCluster):
        """Merge source cluster into target cluster"""
        for wallet in source.wallets:
            target.add_wallet(wallet, source.confidence_score)
            self.wallet_to_cluster[wallet] = target.cluster_id
        
        for trade in source.trades:
            target.add_trade(trade)
        
        # Remove source cluster
        del self.clusters[source.cluster_id]
    
    def get_cluster_for_wallet(self, wallet: str) -> WalletCluster | None:
        """Get the cluster for a specific wallet"""
        cluster_id = self.wallet_to_cluster.get(wallet)
        if cluster_id:
            return self.clusters.get(cluster_id)
        return None
    
    def get_top_clusters(self, limit: int = 10) -> List[Dict]:
        """
        Get top clusters by trade volume
        
        Args:
            limit: Number of top clusters to return
            
        Returns:
            List of top clusters
        """
        sorted_clusters = sorted(
            self.clusters.values(),
            key=lambda c: c.total_volume,
            reverse=True
        )
        
        return [c.to_dict() for c in sorted_clusters[:limit]]
    
    def get_related_wallets(self, wallet: str) -> List[str]:
        """
        Get all wallets related to the given wallet
        
        Args:
            wallet: Wallet address
            
        Returns:
            List of related wallet addresses
        """
        cluster = self.get_cluster_for_wallet(wallet)
        if cluster:
            return list(cluster.wallets)
        return [wallet]
    
    def identify_smart_money(self, trades: List[Dict]) -> List[Dict]:
        """
        Identify smart money wallets (high conviction traders)
        
        Args:
            trades: List of trades
            
        Returns:
            List of smart money clusters
        """
        self.cluster_wallets(trades)
        
        smart_money = []
        for cluster in self.clusters.values():
            # Score based on: win rate, consistency, volume, recency
            score = self._calculate_conviction_score(cluster)
            
            if score > 0.6:  # High conviction threshold
                cluster_dict = cluster.to_dict()
                cluster_dict["conviction_score"] = score
                smart_money.append(cluster_dict)
        
        # Sort by conviction score
        smart_money.sort(key=lambda x: x["conviction_score"], reverse=True)
        
        return smart_money
    
    def _calculate_conviction_score(self, cluster: WalletCluster) -> float:
        """
        Calculate conviction score for a cluster
        
        High conviction = high volume + recent activity + consistent patterns
        """
        if not cluster.trades:
            return 0.0
        
        # Volume factor (0-1 normalized)
        volume_factor = min(cluster.total_volume / 100000, 1.0)
        
        # Recency factor (0-1)
        if cluster.last_activity:
            age_hours = (datetime.utcnow() - cluster.last_activity).total_seconds() / 3600
            recency_factor = max(0, 1 - (age_hours / (24 * 7)))  # Decay over 7 days
        else:
            recency_factor = 0.0
        
        # Consistency factor (0-1) - based on number of trades
        consistency_factor = min(len(cluster.trades) / 10, 1.0)
        
        # Combined score
        conviction = (
            volume_factor * 0.4 +
            recency_factor * 0.3 +
            consistency_factor * 0.3
        )
        
        return conviction
