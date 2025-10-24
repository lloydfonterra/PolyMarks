'use client'

import { useState } from 'react'
import { Filter, TrendingUp, Zap } from 'lucide-react'

interface FilterOptions {
  convictionLevel: 'all' | 'high' | 'medium' | 'low'
  minConviction: number
  maxConviction: number
  volumeSpike: boolean
  sortBy: 'conviction' | 'volume' | 'price'
}

interface DashboardFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void
  currentFilters: FilterOptions
}

export default function DashboardFilters({ onFiltersChange, currentFilters }: DashboardFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleConvictionChange = (level: 'all' | 'high' | 'medium' | 'low') => {
    onFiltersChange({ ...currentFilters, convictionLevel: level })
  }

  const handleVolumeSpike = () => {
    onFiltersChange({ ...currentFilters, volumeSpike: !currentFilters.volumeSpike })
  }

  const handleSort = (sortBy: 'conviction' | 'volume' | 'price') => {
    onFiltersChange({ ...currentFilters, sortBy })
  }

  const getConvictionColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-accent-green/20 text-accent-green'
      case 'medium':
        return 'bg-accent-yellow/20 text-accent-yellow'
      case 'low':
        return 'bg-accent-red/20 text-accent-red'
      default:
        return 'bg-conviction-700 text-conviction-200'
    }
  }

  return (
    <div className="bg-conviction-900/50 border border-conviction-800 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-whale-500" />
          <h3 className="font-bold text-conviction-100">Dashboard Filters & Views</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-conviction-400 hover:text-conviction-200 transition text-sm"
        >
          {isOpen ? 'Hide' : 'Show'} Options
        </button>
      </div>

      {/* Filter Options */}
      {isOpen && (
        <div className="space-y-4 pt-4 border-t border-conviction-800">
          {/* Conviction Level Filter */}
          <div>
            <label className="text-sm font-semibold text-conviction-300 mb-2 block">
              Conviction Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { label: 'All', value: 'all' },
                { label: 'High (70+)', value: 'high' },
                { label: 'Medium (40-70)', value: 'medium' },
                { label: 'Low (0-40)', value: 'low' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleConvictionChange(option.value as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentFilters.convictionLevel === option.value
                      ? `${getConvictionColor(option.value)} bg-opacity-40 border border-current`
                      : 'bg-conviction-800 text-conviction-300 hover:bg-conviction-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Spike Alert */}
          <div>
            <label className="text-sm font-semibold text-conviction-300 mb-2 block flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Volume Spike Alerts
            </label>
            <button
              onClick={handleVolumeSpike}
              className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                currentFilters.volumeSpike
                  ? 'bg-accent-red/20 text-accent-red border border-accent-red'
                  : 'bg-conviction-800 text-conviction-300 hover:bg-conviction-700'
              }`}
            >
              {currentFilters.volumeSpike ? '🔴 Showing Spike Alerts Only' : '⚪ Show All Markets'}
            </button>
          </div>

          {/* Sort Options */}
          <div>
            <label className="text-sm font-semibold text-conviction-300 mb-2 block flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sort By
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Conviction', value: 'conviction' },
                { label: 'Volume', value: 'volume' },
                { label: 'Price', value: 'price' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSort(option.value as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentFilters.sortBy === option.value
                      ? 'bg-whale-500/30 text-whale-200 border border-whale-400'
                      : 'bg-conviction-800 text-conviction-300 hover:bg-conviction-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="bg-conviction-950 rounded-lg p-3 text-xs text-conviction-400">
            <p className="font-semibold mb-1">Active Filters:</p>
            <ul className="space-y-1">
              <li>• Conviction: {currentFilters.convictionLevel === 'all' ? 'All levels' : currentFilters.convictionLevel.toUpperCase()}</li>
              <li>• Volume Alerts: {currentFilters.volumeSpike ? 'ON' : 'OFF'}</li>
              <li>• Sorting: {currentFilters.sortBy.toUpperCase()}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
