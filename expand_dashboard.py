with open('frontend/src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Replace 3-column grid with full width for trades
old_grid = '''        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Trades */}
          <div className="lg:col-span-2">'''

new_grid = '''        {/* Main Grid - Full Width for Better Display */}
        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* Full Width - Trades Section */}
          <div className="w-full">'''

content = content.replace(old_grid, new_grid)

# Move metrics to bottom
old_layout = '''          </div>

          {/* Right Column - Metrics */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 p-6">
              <h3 className="font-bold mb-4">Market Overview</h3>'''

new_layout = '''          </div>
        </div>

        {/* Bottom Section - Metrics & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Quick Stats */}
          <div className="bg-conviction-900/50 rounded-xl border border-conviction-800 p-6">
            <h3 className="font-bold mb-4">Market Overview</h3>'''

content = content.replace(old_layout, new_layout)

# Fix the closing divs
old_close = '''            </div>

            {/* Alerts */}
            <AlertsLive />
          </div>
        </div>

        {/* Bottom Section - Leaderboard */}'''

new_close = '''            </div>

          {/* Alerts */}
          <AlertsLive />

          {/* Spacer */}
          <div></div>
        </div>

        {/* Bottom Section - Leaderboard */}'''

content = content.replace(old_close, new_close)

with open('frontend/src/app/dashboard/page.tsx', 'w') as f:
    f.write(content)

print("Layout expanded successfully")
