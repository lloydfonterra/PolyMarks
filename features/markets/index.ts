/**
 * MARKETS FEATURE MODULE - PUBLIC API
 * This is what other parts of the app can import
 * 
 * USAGE:
 * import { MarketGrid, MarketFilters, applyFilters } from '@features/markets'
 * 
 * INTERNAL:
 * Everything in /lib, /components is private unless exported here
 */

// Components
export { MarketCard, MarketGrid, MarketFilters } from './components'

// Utilities
export { applyFilters, sortMarkets } from './lib'

