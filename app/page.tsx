/**
 * LANDING PAGE
 * Professional landing page with Three.js 3D animation
 */

'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { TopMarketsSection } from '../components/TopMarketsSection'

// Dynamically import Three.js scene (only loads on client)
const ThreeScene = dynamic(() => import('../components/ThreeScene').then(mod => ({ default: mod.ThreeScene })), {
  ssr: false,
  loading: () => <div className="scene-loader" />
})

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section with 3D Background */}
      <section className="hero">
        <Suspense fallback={<div className="scene-loader" />}>
          <ThreeScene />
        </Suspense>
        
        <div className="hero-content">
          <div className="badge">
            <span className="badge-dot"></span>
            Public Alpha - Free Forever
          </div>
          
          <h1 className="hero-title">
            Don't bet blind.
            <br />
            <span className="gradient-text">Bet smart.</span>
          </h1>
          
          <p className="hero-subtitle">
            Track smart money movements on Polymarket. Each cube represents a live prediction market,
            connected by data flows. See what top traders are betting on before the crowd.
          </p>
          
          <div className="cta-buttons">
            <a href="/markets" className="btn-primary">
              Explore Markets
              <span className="arrow">→</span>
            </a>
            <a href="/outliers" className="btn-secondary">
              🔥 Smart Money Alerts
            </a>
          </div>

          <div className="social-proof">
            <div className="stat-inline">
              <span className="stat-number">100+</span>
              <span className="stat-text">Live Markets</span>
            </div>
            <div className="stat-inline">
              <span className="stat-number">$2.5B</span>
              <span className="stat-text">Total Volume</span>
            </div>
            <div className="stat-inline">
              <span className="stat-number">$0</span>
              <span className="stat-text">Cost to Use</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Your Edge in Prediction Markets</h2>
          <p className="section-subtitle">
            Advanced analytics that help you spot opportunities before everyone else
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <h3>Smart Money Detection</h3>
              <p>
                Automatically detect unusual trading activity, whale movements, and
                significant odds shifts in real-time.
              </p>
              <ul className="feature-list">
                <li>Volume spike alerts</li>
                <li>Whale activity tracking</li>
                <li>Odds movement detection</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🐋</div>
              <h3>Solana Wallet Intelligence</h3>
              <p>
                Cross-chain intelligence via Helius. See wallet reputation scores
                and track smart money from the Solana ecosystem.
              </p>
              <ul className="feature-list">
                <li>Reputation scoring</li>
                <li>Balance tracking</li>
                <li>Insider identification</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Advanced Market Filters</h3>
              <p>
                Cut through the noise. Filter by category, closing time, liquidity,
                and trending markets to find opportunities.
              </p>
              <ul className="feature-list">
                <li>Category filtering</li>
                <li>Custom sorting</li>
                <li>Real-time updates</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Zero Infrastructure</h3>
              <p>
                No trading, no risk, no custody. We send you to Polymarket with
                referral tracking. Simple and safe.
              </p>
              <ul className="feature-list">
                <li>No wallet needed</li>
                <li>No smart contracts</li>
                <li>100% free to use</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Top 10 Markets with Whale Sentiment */}
      <TopMarketsSection />

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Browse Markets</h3>
              <p>Explore 100+ prediction markets across politics, sports, crypto, and more</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>See Smart Money</h3>
              <p>Get alerts on unusual activity, whale bets, and significant movements</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Trade with Confidence</h3>
              <p>Click to Polymarket and make informed predictions backed by data</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="container">
          <h2>Ready to spot the next big move?</h2>
          <p>Join traders using data-driven insights to make smarter predictions</p>
          <div className="cta-buttons">
            <a href="/markets" className="btn-primary-large">
              Start Tracking Smart Money
              <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          overflow: hidden;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 40px 20px;
          max-width: 900px;
          margin: 0 auto;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(59, 130, 246, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 24px;
          color: #60a5fa;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 32px;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .hero-title {
          font-size: 72px;
          font-weight: 900;
          color: white;
          margin-bottom: 24px;
          line-height: 1.1;
        }

        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 40px;
          line-height: 1.6;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 60px;
        }

        .btn-primary, .btn-primary-large {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
        }

        .btn-primary-large {
          font-size: 18px;
          padding: 20px 40px;
        }

        .btn-primary:hover, .btn-primary-large:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 50px rgba(59, 130, 246, 0.5);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: rgba(17, 24, 39, 0.8);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          border: 2px solid rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: rgba(17, 24, 39, 1);
          border-color: rgba(59, 130, 246, 0.6);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
        }

        .arrow {
          transition: transform 0.3s ease;
        }

        .btn-primary:hover .arrow,
        .btn-primary-large:hover .arrow {
          transform: translateX(4px);
        }

        .social-proof {
          display: flex;
          gap: 48px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .stat-inline {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 36px;
          font-weight: 800;
          color: white;
          line-height: 1;
        }

        .stat-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 4px;
        }

        /* Features Section */
        .features {
          padding: 100px 20px;
          background: #000000;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 48px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 16px;
          color: #ffffff;
        }

        .section-subtitle {
          font-size: 20px;
          text-align: center;
          color: #9ca3af;
          margin-bottom: 60px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .feature-card {
          background: rgba(17, 24, 39, 0.5);
          padding: 32px;
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.4);
          background: rgba(17, 24, 39, 0.8);
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #ffffff;
        }

        .feature-card p {
          font-size: 16px;
          color: #9ca3af;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .feature-list {
          list-style: none;
          padding: 0;
        }

        .feature-list li {
          font-size: 14px;
          color: #9ca3af;
          padding: 6px 0;
          padding-left: 24px;
          position: relative;
        }

        .feature-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #3b82f6;
          font-weight: bold;
        }

        /* How It Works */
        .how-it-works {
          padding: 100px 20px;
          background: #0a0a0a;
        }

        .steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .step {
          flex: 1;
          min-width: 250px;
          text-align: center;
        }

        .step-number {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 800;
          margin: 0 auto 20px;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }

        .step h3 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #ffffff;
        }

        .step p {
          font-size: 16px;
          color: #9ca3af;
          line-height: 1.6;
        }

        .step-arrow {
          font-size: 32px;
          color: #3b82f6;
          font-weight: bold;
        }

        /* Final CTA */
        .final-cta {
          padding: 100px 20px;
          background: #000000;
          text-align: center;
          color: white;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .final-cta h2 {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .final-cta p {
          font-size: 20px;
          margin-bottom: 40px;
          opacity: 0.9;
        }

        .scene-loader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #0a0a0a;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 42px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .section-title {
            font-size: 32px;
          }

          .step-arrow {
            display: none;
          }

          .final-cta h2 {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  )
}
