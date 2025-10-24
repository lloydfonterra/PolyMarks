'use client'

import { useEffect, useState, useRef } from 'react'

interface PriceUpdate {
  market_id: string
  market_name: string
  price: number
  timestamp: string
}

export function useWebSocketPrices(backendUrl: string) {
  const [prices, setPrices] = useState<Map<string, number>>(new Map())
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Convert HTTP URL to WebSocket URL
    const wsUrl = backendUrl
      .replace('https://', 'wss://')
      .replace('http://', 'ws://')
      .replace(/\/$/, '') + '/ws/prices'

    console.log(`Connecting to WebSocket: ${wsUrl}`)

    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('WebSocket connected')
      setConnected(true)
      // Send ping to keep connection alive
      ws.send('ping')
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        
        if (message.type === 'price_update' && message.data) {
          const newPrices = new Map(prices)
          
          // Update prices from WebSocket data
          message.data.forEach((update: PriceUpdate) => {
            newPrices.set(update.market_id, update.price)
          })
          
          setPrices(newPrices)
          console.log(`Updated ${message.data.length} prices via WebSocket`)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnected(false)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setConnected(false)
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...')
      }, 3000)
    }

    wsRef.current = ws

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [backendUrl])

  return { prices, connected }
}
