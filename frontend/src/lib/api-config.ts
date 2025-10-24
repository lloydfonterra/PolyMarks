// Centralized API configuration
export const API_BASE_URL = 'https://polymarks-production.up.railway.app'

export const API_ENDPOINTS = {
  trades: `${API_BASE_URL}/api/trades/recent`,
  alerts: `${API_BASE_URL}/api/alerts/recent`,
  leaderboard: `${API_BASE_URL}/api/leaderboard/top`,
  wallets: `${API_BASE_URL}/api/wallets/top`,
}
