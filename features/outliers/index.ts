/**
 * OUTLIERS FEATURE MODULE - PUBLIC API
 */

export { analyzeMarket, detectOutliers, getMarketSeverity } from './lib/detection'
export { OutlierBadge } from './components/OutlierBadge'
export type { OutlierSignal, MarketWithOutliers } from './lib/detection'

