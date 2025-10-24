'use client'

import { useEffect, useState } from 'react'
import { Bell, AlertTriangle, TrendingUp, Users, Loader } from 'lucide-react'

interface Alert {
  id: string
  type: 'whale_detected' | 'extreme_conviction' | 'cluster_formed' | string
  title: string
  message: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  market?: string
  value?: string
  timestamp: string
}

export default function AlertsLive() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('https://polymarks-production.up.railway.app/api/alerts/recent?limit=8')
        if (!response.ok) return
        
        const data = await response.json()
        setAlerts(data.alerts || [])
      } catch (error) {
        console.error('Error fetching alerts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 3000) // Update every 3 seconds
    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'whale_detected':
        return '🐋'
      case 'extreme_conviction':
        return '📈'
      case 'cluster_formed':
        return '🤝'
      default:
        return '🔔'
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-4 border-red-500 bg-red-500/5'
      case 'high':
        return 'border-l-4 border-orange-500 bg-orange-500/5'
      case 'medium':
        return 'border-l-4 border-yellow-500 bg-yellow-500/5'
      case 'low':
        return 'border-l-4 border-blue-500 bg-blue-500/5'
      default:
        return 'border-l-4 border-gray-500 bg-gray-500/5'
    }
  }

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400'
      case 'high':
        return 'text-orange-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  const visibleAlerts = alerts.filter(a => !dismissedIds.has(a.id))

  if (isLoading) {
    return (
      <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 overflow-hidden p-8 flex items-center justify-center">
        <Loader className="w-5 h-5 text-whale-500 animate-spin mr-2" />
        <span className="text-conviction-400 text-sm">Loading alerts...</span>
      </div>
    )
  }

  return (
    <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-conviction-800 flex items-center gap-2">
        <Bell className="w-5 h-5 text-accent-yellow animate-bounce" />
        <h3 className="text-lg font-bold">Active Alerts</h3>
        {visibleAlerts.length > 0 && (
          <span className="ml-auto px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
            {visibleAlerts.length} active
          </span>
        )}
      </div>

      {/* Alerts List */}
      <div className="max-h-96 overflow-y-auto">
        {visibleAlerts.length === 0 ? (
          <div className="px-6 py-8 text-center text-conviction-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {visibleAlerts.map((alert, idx) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg transition-all ${getAlertColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl animate-pulse">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-sm ${getSeverityTextColor(alert.severity)}`}>
                          {alert.title}
                        </h4>
                        <span className={`text-xs font-semibold ${getSeverityTextColor(alert.severity)} uppercase`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-conviction-300 text-sm mt-1 line-clamp-2">{alert.message}</p>
                      {alert.value && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-conviction-500">Value:</span>
                          <span className="text-sm font-semibold text-white">{alert.value}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setDismissedIds(new Set([...dismissedIds, alert.id]))}
                    className="text-conviction-500 hover:text-conviction-300 transition text-lg leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
