'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight, TrendingUp, Zap, Lock, BarChart3 } from 'lucide-react'

const WhaleNetworkVisualization = dynamic(
  () => import('@/components/ThreeD/WhaleNetworkVisualization'),
  { ssr: false }
)

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-conviction-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-conviction-950/80 backdrop-blur-md border-b border-conviction-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-conviction-400 to-whale-500 bg-clip-text text-transparent">
            🎯 Conviction
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/dashboard" className="text-conviction-300 hover:text-white transition">
              Dashboard
            </Link>
            <button className="px-4 py-2 rounded-lg bg-conviction-600 hover:bg-conviction-500 transition">
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* 3D Background */}
        <div className="absolute inset-0 w-full h-full">
          <WhaleNetworkVisualization />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-conviction-950/0 via-conviction-950/50 to-conviction-950" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div
              className={`transform transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-conviction-900/50 border border-conviction-700 text-sm text-conviction-300">
                  <Zap className="w-4 h-4 mr-2 text-whale-500" />
                  Real-time Smart Money Intelligence
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Track Where
                  <span className="block bg-gradient-to-r from-conviction-400 via-whale-500 to-conviction-300 bg-clip-text text-transparent">
                    Smart Money
                  </span>
                  Flows
                </h1>

                {/* Subheading */}
                <p className="text-lg text-conviction-300 leading-relaxed max-w-lg">
                  Detect whale traders, analyze conviction patterns, and follow high-conviction positions in real-time.
                  Gain the edge you need in prediction markets.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gradient-to-r from-conviction-500 to-conviction-600 hover:from-conviction-400 hover:to-conviction-500 transition transform hover:scale-105 font-semibold"
                  >
                    Launch Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
                  </Link>
                  <button className="px-8 py-3 rounded-lg border border-conviction-700 hover:bg-conviction-900 transition font-semibold">
                    View Docs
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-conviction-800">
                  <div>
                    <div className="text-2xl font-bold text-whale-500">35+</div>
                    <div className="text-sm text-conviction-400">API Endpoints</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-conviction-400">Real-time</div>
                    <div className="text-sm text-conviction-400">WebSocket Feeds</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-conviction-400">100ms</div>
                    <div className="text-sm text-conviction-400">Avg Latency</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Accent */}
            <div
              className={`hidden lg:flex items-center justify-center transform transition-all duration-1000 delay-300 ${
                isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-conviction-600/20 to-whale-500/20 rounded-2xl blur-3xl" />
                <div className="absolute inset-0 rounded-2xl border border-conviction-700/50 backdrop-blur-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-conviction-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-conviction-300 text-lg max-w-2xl mx-auto">
              Everything you need to understand smart money behavior in prediction markets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: '🐋 Whale Detection',
                description: 'Detect and track large positions in real-time',
              },
              {
                icon: BarChart3,
                title: '📊 Smart Analytics',
                description: 'Conviction scoring and trader profiling',
              },
              {
                icon: Zap,
                title: '⚡ Real-time Alerts',
                description: 'Get notified of high-conviction moves instantly',
              },
              {
                icon: Lock,
                title: '🔐 Secure & Private',
                description: 'Read-only analysis, no private keys required',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-conviction-800 bg-conviction-900/50 hover:bg-conviction-900 hover:border-conviction-600 transition group"
                >
                  <Icon className="w-8 h-8 text-whale-500 mb-4 group-hover:scale-110 transition" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-conviction-400 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Edge?</h2>
          <p className="text-conviction-300 text-lg mb-8 max-w-2xl mx-auto">
            Join traders who are making smarter predictions with real-time smart money intelligence.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-conviction-500 to-conviction-600 hover:from-conviction-400 hover:to-conviction-500 transition transform hover:scale-105 font-semibold text-lg"
          >
            Launch Dashboard Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-conviction-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-lg font-bold text-conviction-400 mb-4">Conviction</div>
              <p className="text-conviction-400 text-sm">
                Smart Money Intelligence for Prediction Markets
              </p>
            </div>
            {[
              { title: 'Product', links: ['Dashboard', 'API', 'Docs'] },
              { title: 'Resources', links: ['Guide', 'Blog', 'Support'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Disclaimer'] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-conviction-400 hover:text-white text-sm transition">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-conviction-800 pt-8 flex justify-between items-center">
            <p className="text-conviction-400 text-sm">
              © 2025 Conviction. All rights reserved.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Discord', 'GitHub'].map((social) => (
                <a key={social} href="#" className="text-conviction-400 hover:text-white text-sm transition">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
