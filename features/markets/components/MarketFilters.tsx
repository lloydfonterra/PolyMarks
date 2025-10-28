/**
 * MARKET FILTERS COMPONENT
 * Search and filter controls
 */

'use client'

import { useState } from 'react'
import type { MarketFilters as Filters } from '@core/types'

interface MarketFiltersProps {
  onFiltersChange: (filters: Filters) => void
  initialFilters?: Filters
}

export function MarketFilters({ 
  onFiltersChange, 
  initialFilters = {} 
}: MarketFiltersProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters)

  const updateFilter = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  return (
    <div className="filters-container">
      {/* Search */}
      <div className="filter-group">
        <input
          type="text"
          placeholder="Search markets..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="search-input"
        />
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <select
          value={filters.category || ''}
          onChange={(e) => updateFilter('category', e.target.value || undefined)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="politics">Politics</option>
          <option value="sports">Sports</option>
          <option value="crypto">Crypto</option>
          <option value="business">Business</option>
          <option value="technology">Technology</option>
        </select>
      </div>

      {/* Closing Time Filter */}
          <div className="filter-group">
            <select
              value={filters.closingTime || 'all'}
              onChange={(e) => updateFilter('closingTime', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="soon">Closing Soon (30 days)</option>
              <option value="week">Next 2 Months</option>
              <option value="month">Next 6 Months</option>
            </select>
          </div>

      {/* Sort */}
      <div className="filter-group">
        <select
          value={filters.sortBy || 'volume'}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="filter-select"
        >
          <option value="volume">Sort by Volume</option>
          <option value="liquidity">Sort by Liquidity</option>
          <option value="trending">Sort by Trending</option>
          <option value="closing">Sort by Closing Date</option>
        </select>
      </div>

      <style jsx>{`
        .filters-container {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 32px;
          padding: 24px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%);
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }

        .filter-group {
          flex: 1;
          min-width: 200px;
        }

        .search-input,
        .filter-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          font-size: 14px;
          background: rgba(10, 10, 10, 0.5);
          color: #e5e7eb;
          transition: all 0.2s ease;
        }

        .search-input::placeholder {
          color: #6b7280;
        }

        .filter-select {
          cursor: pointer;
        }

        .filter-select option {
          background: #1a1a1a;
          color: #e5e7eb;
        }

        .search-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(10, 10, 10, 0.7);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-input:hover,
        .filter-select:hover {
          border-color: rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 768px) {
          .filters-container {
            padding: 16px;
          }
          
          .filter-group {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

