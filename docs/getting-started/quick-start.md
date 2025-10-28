# Quick Start

Get PolyMarks running locally in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Helius API key (free tier available)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/polymarks.git
cd polymarks
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Helius RPC (for Solana wallet tracking)
NEXT_PUBLIC_HELIUS_API_KEY=your_helius_key_here

# Polymarket API (no key needed, public)
NEXT_PUBLIC_POLYMARKET_API_URL=https://gamma-api.polymarket.com
```

Get your free Helius API key: [https://helius.dev](https://helius.dev)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What's Next?

- Explore the [Features Overview](features.md)
- Learn about the [Architecture](../technical/architecture.md)
- Deploy to [Production](../deployment/production.md)

