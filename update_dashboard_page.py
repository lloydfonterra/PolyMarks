with open('frontend/src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Add import for DashboardFilters
old_imports = '''import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Zap, AlertCircle, Users } from 'lucide-react'
import DashboardHeader from '@/components/Dashboard/DashboardHeader'
import RealtimeTradeFeed from '@/components/Dashboard/RealtimeTradeFeed'
import LeaderboardLive from '@/components/Dashboard/LeaderboardLive'
import AlertsLive from '@/components/Dashboard/AlertsLive'
import MetricsGrid from '@/components/Dashboard/MetricsGrid'

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('24h')
  const [isLoading, setIsLoading] = useState(false)'''

new_imports = '''import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Zap, AlertCircle, Users } from 'lucide-react'
import DashboardHeader from '@/components/Dashboard/DashboardHeader'
import RealtimeTradeFeed from '@/components/Dashboard/RealtimeTradeFeed'
import LeaderboardLive from '@/components/Dashboard/LeaderboardLive'
import AlertsLive from '@/components/Dashboard/AlertsLive'
import MetricsGrid from '@/components/Dashboard/MetricsGrid'
import DashboardFilters from '@/components/Dashboard/DashboardFilters'

interface FilterOptions {
  convictionLevel: 'all' | 'high' | 'medium' | 'low'
  minConviction: number
  maxConviction: number
  volumeSpike: boolean
  sortBy: 'conviction' | 'volume' | 'price'
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('24h')
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    convictionLevel: 'all',
    minConviction: 0,
    maxConviction: 100,
    volumeSpike: false,
    sortBy: 'conviction'
  })'''

content = content.replace(old_imports, new_imports)

# Add DashboardFilters component after MetricsGrid
old_section = '''        {/* Top Metrics */}
        <MetricsGrid />

        {/* Polymarket Link Button */}'''

new_section = '''        {/* Top Metrics */}
        <MetricsGrid />

        {/* Dashboard Filters & Views */}
        <DashboardFilters currentFilters={filters} onFiltersChange={setFilters} />

        {/* Polymarket Link Button */}'''

content = content.replace(old_section, new_section)

with open('frontend/src/app/dashboard/page.tsx', 'w') as f:
    f.write(content)

print("Updated dashboard page with filters")
