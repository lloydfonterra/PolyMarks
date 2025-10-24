'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Zap, TrendingUp } from 'lucide-react'

interface Alert {
  id: string
  type: 'whale_trade' | 'volume_spike' | 'conviction_surge'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  market: string
  timestamp: string
  dismissed: boolean
}

interface AlertsLiveProps {
  apiUrl?: string
}

export default function AlertsLive({ apiUrl = 'https://polymarks-production.up.railway.app/api/alerts/recent' }: AlertsLiveProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Try to fetch REAL whale alerts from Etherscan
        try {
          const response = await fetch(
            'https://polymarks-production.up.railway.app/api/whales/alerts/recent?limit=5'
          );
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.alerts && data.alerts.length > 0 && data.real_data) {
              // Transform real Etherscan alerts into our format
              const realAlerts = data.alerts.map((tx: any) => ({
                id: tx.id,
                type: 'whale_trade',
                title: tx.title,
                description: `Wallet: ${tx.wallet.slice(0, 10)}... | TX: ${tx.data.transaction_hash.slice(0, 10)}...`,
                severity: tx.severity,
                market: `Polymarket Whale Activity`,
                timestamp: tx.timestamp,
                dismissed: false
              }));
              
              setAlerts(realAlerts);
              setLoading(false);
              return; // Use real data
            }
          }
        } catch (error) {
          console.debug('Could not fetch real whale alerts:', error);
        }
        
        // Only show REAL alerts - no mock data
        setAlerts([])
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch alerts:', error)
        setLoading(false)
      }
    }

    fetchAlerts()
    // Re-fetch every 30 seconds
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [apiUrl])

  const dismissAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, dismissed: true } : alert
    ))
  }

  const activateAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, dismissed: false } : alert
    ))
  }

  const activeAlerts = alerts.filter(a => !a.dismissed)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-900/30 border-red-700 text-red-100'
      case 'high':
        return 'bg-orange-900/30 border-orange-700 text-orange-100'
      case 'medium':
        return 'bg-yellow-900/30 border-yellow-700 text-yellow-100'
      case 'low':
        return 'bg-blue-900/30 border-blue-700 text-blue-100'
      default:
        return 'bg-conviction-800/50 border-conviction-700'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return '🐋'
      case 'medium':
        return '⚡'
      case 'low':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  if (loading) {
    return (
      <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-whale-500" />
          <h3 className="font-bold text-conviction-100">Loading alerts...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent-red" />
          <h3 className="font-bold text-conviction-100">Active Alerts</h3>
          {activeAlerts.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-accent-red/20 text-accent-red text-xs font-semibold rounded-full">
              {activeAlerts.length} active
            </span>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activeAlerts.length > 0 ? (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-lg ${getSeverityColor(
                alert.severity
              )}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl mt-1">{getSeverityIcon(alert.severity)}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {alert.title}
                      {alert.severity === 'high' || alert.severity === 'critical' && (
                        <TrendingUp className="w-4 h-4 animate-bounce" />
                      )}
                    </div>
                    <p className="text-xs mt-1 opacity-90">{alert.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-black/20 rounded">
                        {alert.market}
                      </span>
                      <span className="text-xs opacity-75">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-lg hover:opacity-50 transition flex-shrink-0 mt-1"
                  title="Dismiss alert"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-conviction-400">
            <p className="text-sm">No active alerts</p>
            <p className="text-xs mt-2 opacity-70">
              {alerts.length > 0 ? (
                <button
                  onClick={() => setAlerts(alerts.map(a => ({ ...a, dismissed: false })))}
                  className="text-whale-400 hover:underline"
                >
                  Restore dismissed alerts
                </button>
              ) : (
                'Waiting for market activity...'
              )}
            </p>
          </div>
        )}
      </div>

      {/* Alert Stats */}
      {alerts.length > 0 && (
        <div className="pt-3 border-t border-conviction-700 text-xs text-conviction-400">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="block font-semibold text-accent-red">
                {alerts.filter(a => a.severity === 'critical').length}
              </span>
              <span className="text-xs">Critical</span>
            </div>
            <div>
              <span className="block font-semibold text-orange-400">
                {alerts.filter(a => a.severity === 'high').length}
              </span>
              <span className="text-xs">High</span>
            </div>
            <div>
              <span className="block font-semibold text-yellow-400">
                {alerts.filter(a => a.severity === 'medium').length}
              </span>
              <span className="text-xs">Medium</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
