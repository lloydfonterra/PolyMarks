/**
 * WHALE ALERTS HOOK
 * Real-time whale trade notifications
 */

import { useState, useEffect, useRef } from 'react'
import { tradesClient } from '@core/api'
import type { WhaleTrade } from '@core/types'
import toast from 'react-hot-toast'

interface UseWhaleAlertsOptions {
  minAmount?: number
  enableNotifications?: boolean
  pollInterval?: number // milliseconds
  enableSound?: boolean
}

export function useWhaleAlerts(options: UseWhaleAlertsOptions = {}) {
  const {
    minAmount = 10000, // $10k+ trades only for notifications
    enableNotifications = true,
    pollInterval = 20000, // 20 seconds - faster updates
    enableSound = false,
  } = options

  const [latestTrades, setLatestTrades] = useState<WhaleTrade[]>([])
  const [isLive, setIsLive] = useState(false)
  const [newTradeCount, setNewTradeCount] = useState(0)
  const previousTradesRef = useRef<Set<string>>(new Set())
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio for notifications
  useEffect(() => {
    if (enableSound && typeof window !== 'undefined') {
      // Simple notification sound (you can replace with a custom sound file)
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBg==')
    }
  }, [enableSound])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const fetchTrades = async () => {
      try {
        setIsLive(true)
        const trades = await tradesClient.getWhaleTrades({
          minAmount,
          timeRange: '1h', // Only check last hour for notifications
        })

        setLatestTrades(trades)

        // Check for new trades
        if (enableNotifications && previousTradesRef.current.size > 0) {
          const newTrades = trades.filter(
            trade => !previousTradesRef.current.has(trade.transactionHash)
          )

          // Show notification for new trades
          newTrades.forEach(trade => {
            if (trade.totalValue >= minAmount) {
              showWhaleAlert(trade)
              setNewTradeCount(prev => prev + 1)
              
              // Play sound if enabled
              if (enableSound && audioRef.current) {
                audioRef.current.play().catch(err => {
                  console.log('Could not play notification sound:', err)
                })
              }
            }
          })
        }

        // Update previous trades set
        previousTradesRef.current = new Set(trades.map(t => t.transactionHash))
        setIsLive(false)
      } catch (error) {
        console.error('Error fetching whale trades:', error)
        setIsLive(false)
      }
    }

    // Initial fetch
    fetchTrades()

    // Set up polling
    intervalId = setInterval(fetchTrades, pollInterval)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [minAmount, enableNotifications, pollInterval, enableSound])

  return {
    latestTrades,
    isLive,
    newTradeCount,
    clearNewTradeCount: () => setNewTradeCount(0),
  }
}

function showWhaleAlert(trade: WhaleTrade) {
  const formatMoney = (amount: number) => {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`
    return `$${amount.toFixed(0)}`
  }

  toast.custom(
    (t) => (
      <div
        className={`whale-toast ${t.visible ? 'whale-toast-enter' : 'whale-toast-exit'}`}
        onClick={() => toast.dismiss(t.id)}
      >
        <div className="whale-toast-header">
          <span className="whale-toast-icon">🐋</span>
          <div className="whale-toast-title">
            <strong>New Whale Alert!</strong>
            <span className={`whale-toast-side ${trade.side.toLowerCase()}`}>
              {trade.side}
            </span>
          </div>
        </div>
        <div className="whale-toast-body">
          <div className="whale-toast-trader">{trade.name || trade.pseudonym}</div>
          <div className="whale-toast-amount">{formatMoney(trade.totalValue)}</div>
          <div className="whale-toast-market">{trade.title}</div>
        </div>
        <style jsx>{`
          .whale-toast {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            min-width: 320px;
            max-width: 400px;
            backdrop-filter: blur(10px);
          }

          .whale-toast-enter {
            animation: slideIn 0.3s ease-out;
          }

          .whale-toast-exit {
            animation: slideOut 0.3s ease-in;
          }

          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(400px);
              opacity: 0;
            }
          }

          .whale-toast-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }

          .whale-toast-icon {
            font-size: 28px;
            animation: bounce 1s infinite;
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }

          .whale-toast-title {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .whale-toast-title strong {
            color: white;
            font-size: 16px;
            font-weight: 700;
          }

          .whale-toast-side {
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
            color: white;
          }

          .whale-toast-side.buy {
            background: #22C55E;
          }

          .whale-toast-side.sell {
            background: #EF4444;
          }

          .whale-toast-body {
            color: white;
          }

          .whale-toast-trader {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
            opacity: 0.9;
          }

          .whale-toast-amount {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 8px;
          }

          .whale-toast-market {
            font-size: 13px;
            opacity: 0.8;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        `}</style>
      </div>
    ),
    {
      duration: 6000,
      position: 'top-right',
    }
  )
}

