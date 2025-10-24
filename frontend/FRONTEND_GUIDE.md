# Conviction Frontend - Complete Guide

## 🎨 Beautiful Landing Page + Dashboard with 3D Visualization

Welcome to the Conviction frontend! This guide explains the structure, components, and how to get started.

---

## 📁 Project Structure

```
frontend/
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind theming
├── next.config.js            # Next.js config
├── postcss.config.js         # PostCSS config
│
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Landing page
│   │   ├── dashboard/
│   │   │   └── page.tsx      # Dashboard page
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── ThreeD/
│   │   │   └── WhaleNetworkVisualization.tsx  # 3D scene
│   │   │
│   │   └── Dashboard/
│   │       ├── DashboardHeader.tsx     # Top nav
│   │       ├── MetricsGrid.tsx         # KPI cards
│   │       ├── TradeFeed.tsx           # Live trades table
│   │       └── Leaderboard.tsx         # Top traders table
│   │
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities & helpers
│   ├── styles/
│   │   └── globals.css      # Global styles
│   │
│   └── public/              # Static assets
│
└── FRONTEND_GUIDE.md        # This file
```

---

## 🎯 Key Features Built

### 1. **Landing Page** (`src/app/page.tsx`)
✨ **Beautiful, modern landing page with:**
- Sticky navigation bar
- Hero section with compelling headline
- **3D animated whale network visualization** (see below)
- Features showcase with 4 main benefits
- Call-to-action sections
- Professional footer
- Smooth animations and transitions

**Visual Elements:**
- Gradient text effects
- Responsive grid layout
- Hover animations on feature cards
- Smooth page transitions

### 2. **3D Whale Network Visualization** (NEW! 🌐)
**File:** `src/components/ThreeD/WhaleNetworkVisualization.tsx`

A stunning **Three.js** visualization showing:
- 🐋 **Animated whale nodes** (icosphere geometry)
- 🔗 **Dynamic connections** between wallets
- 💡 **Multi-light setup** (ambient + point lights)
- 🎬 **Smooth animations**:
  - Rotating camera around the scene
  - Pulsing whale nodes
  - Rotating individual spheres
- 🌌 **Dark theme** with glowing effects
- 📐 **Responsive** to window resize

**Technical Details:**
- Uses raw Three.js (not react-three-fiber for performance)
- Real-time rendering at 60fps
- Shadow mapping enabled
- Fog effect for depth
- Dynamic color generation for nodes

### 3. **Dashboard** (`src/app/dashboard/page.tsx`)
📊 **Professional trading dashboard with:**
- Top metrics grid (KPIs)
- Live whale trades feed (sortable table)
- Market overview panel
- Active alerts feed
- Top traders leaderboard
- Time period selector

**Dashboard Components:**

#### **DashboardHeader.tsx**
- Sticky header with logo
- Navigation links
- Notification bell (with pulse animation)
- Settings button
- User profile menu
- Mobile-responsive menu

#### **MetricsGrid.tsx**
- 4 key performance indicators:
  - 🐋 Whale Trades count
  - 📈 Avg Win Rate %
  - 👥 Active Wallets
  - 💰 Market Volume
- Color-coded metrics
- Trending indicators (↑↓)
- Hover effects

#### **TradeFeed.tsx**
- Real-time trades table
- 7 columns:
  - Wallet address (with avatar)
  - Market name
  - Trade type (BUY/SELL badge)
  - Trade size
  - Price
  - Conviction score (visual bar)
  - Time ago
- Hover highlighting
- Responsive overflow

#### **Leaderboard.tsx**
- Top 5 traders ranking
- Columns:
  - Rank (with medals 🥇🥈🥉)
  - Trader name & address
  - Win rate (progress bar)
  - ROI percentage
  - Trading volume
  - Number of trades
  - Performance trend
  - Follow button
- Footer link to full leaderboard

---

## 🎨 Design System

### Color Palette

```typescript
// Conviction Colors
conviction-50:   #f8f9ff
conviction-100:  #f0f3ff
conviction-200:  #e6edff
conviction-300:  #d0deff
conviction-400:  #a8baff  // Primary text accent
conviction-500:  #7c8fff  // Main brand
conviction-600:  #5c6fe8  // Darker brand
conviction-700:  #4a5bc1
conviction-800:  #3a449e
conviction-900:  #2d357f
conviction-950:  #1a1f4a  // Dark background

// Whale Colors (Accent)
whale-500:  #06b6d4  // Cyan
whale-600:  #0891b2
whale-700:  #0e7490

// Status Colors
accent-green:  #10b981  // Success
accent-red:    #ef4444  // Error
accent-yellow: #f59e0b  // Warning
```

### Typography

- **Font:** Inter (Google Fonts)
- **Sizes:** 12px → 60px (responsive)
- **Weights:** 400, 500, 600, 700, 800

### Animations

```css
/* Built-in animations */
animate-pulse-glow     /* Fade in/out */
animate-float          /* Up/down movement */

/* Custom transitions */
All elements: transition-all
```

---

## 🚀 Getting Started

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo 'NEXT_PUBLIC_API_URL=http://localhost:8000' > .env.local
```

### Development

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000
```

### Production Build

```bash
# Build
npm run build

# Start
npm start
```

---

## 📦 Dependencies

### Key Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 14.0.0 | React framework |
| `react` | 18.2.0 | UI library |
| `three` | r128 | 3D graphics |
| `tailwindcss` | 3.3.0 | Styling |
| `recharts` | 2.10.3 | Charts (future) |
| `framer-motion` | 10.16.4 | Animations |
| `lucide-react` | 0.292.0 | Icons |
| `zustand` | 4.4.1 | State management |
| `axios` | 1.6.2 | HTTP client |
| `ws` | 8.14.2 | WebSocket |

---

## 🌐 Page Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `page.tsx` | Landing page |
| `/dashboard` | `dashboard/page.tsx` | Main dashboard |
| `/wallets` | *To build* | Wallet profiles |
| `/leaderboard` | *To build* | Full leaderboard |
| `/alerts` | *To build* | Alert management |

---

## 🔧 Configuration Files

### `tailwind.config.ts`
- Custom color palette
- Custom animations
- Custom keyframes

### `tsconfig.json`
- Strict type checking
- Path aliases (`@/*`)
- Next.js plugins

### `next.config.js`
- React strict mode
- SWC minification
- WebAssembly support (for future ML models)

---

## 📱 Responsive Design

- **Mobile:** 320px+
- **Tablet:** 768px+
- **Desktop:** 1024px+
- **Large:** 1280px+

Grid layouts automatically stack on mobile, 2 cols on tablet, 3-4 cols on desktop.

---

## 🎬 3D Visualization Details

### Scene Setup
- **Camera:** Perspective, 75° FOV
- **Background:** Dark conviction-950 color
- **Fog:** Creates depth effect
- **Lighting:**
  - Ambient: White 0.5 intensity
  - Point 1: Conviction blue (0x7c8fff)
  - Point 2: Whale cyan (0x06b6d4)

### Whale Nodes
- **Geometry:** Icosahedron (16 subdivisions)
- **Material:** Phong (shiny, reflective)
- **Colors:** Random HSL generation
- **Sizes:** 1.5x - 3x scale

### Animations
```javascript
// Rotating camera
camera.position.x = cos(time * 0.0002) * 50
camera.position.y = sin(time * 0.0001) * 30

// Pulsing whales
scale = original + sin(time * 0.001) * 0.3

// Spinning rotations
rotation.x += 0.002
rotation.y += 0.003
```

---

## 🎨 Component Examples

### Using Conviction Colors

```jsx
// Text
<p className="text-conviction-400">Secondary text</p>

// Background
<div className="bg-conviction-900">Dark background</div>

// Gradient
<div className="bg-gradient-to-r from-conviction-400 to-whale-500">
  Gradient button
</div>
```

### Responsive Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Auto-responsive */}
</div>
```

### Animations

```jsx
<div className="animate-pulse-glow">Glowing element</div>
<div className="animate-float">Floating element</div>
```

---

## 🔗 API Integration

The frontend will eventually connect to the backend API at:
- **Base URL:** `http://localhost:8000` (dev)
- **Production:** Your deployment URL

**Endpoints to integrate:**
- `GET /api/trades/recent` - Live trades
- `GET /api/wallets/profile/{address}` - Wallet data
- `GET /api/leaderboard/top` - Top traders
- `GET /api/alerts/recent` - User alerts
- `WS /api/trades/ws/live` - WebSocket feed

---

## 📊 Future Enhancements

- [ ] WebSocket real-time updates
- [ ] Recharts integration for price charts
- [ ] User authentication
- [ ] Dark/light theme toggle
- [ ] Advanced filtering & search
- [ ] Export data to CSV
- [ ] Custom alert notifications
- [ ] More 3D visualizations

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Three.js not rendering
- Check browser WebGL support
- Verify canvas container has dimensions
- Check browser console for errors

### Tailwind styles not applying
```bash
# Rebuild
npm run build

# Or clear cache
rm -rf .next
npm run dev
```

---

## 📚 Resources

- **Next.js:** https://nextjs.org/docs
- **Three.js:** https://threejs.org/docs
- **Tailwind:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev

---

## ✨ Created With

- ⚛️ React 18
- 🎨 Next.js 14
- 🌐 Three.js
- 🎨 Tailwind CSS
- 🔷 TypeScript
- 🎬 Framer Motion

---

**Built for traders who want an edge.** 🎯

Last updated: October 24, 2025
