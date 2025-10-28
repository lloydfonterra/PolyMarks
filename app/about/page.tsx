/**
 * ABOUT PAGE
 * Explains what plymrkt does
 */

'use client'

export default function AboutPage() {
  return (
    <div className="container">
      <div className="about-content">
        <h1>About plymrkt</h1>
        
        <section>
          <h2>🎯 What We Do</h2>
          <p>
            plymrkt helps you make smarter predictions by tracking unusual market activity 
            on Polymarket. We analyze every trade, identify outliers, and show you where 
            smart money is moving.
          </p>
        </section>

        <section>
          <h2>🔥 Smart Money Detection</h2>
          <ul>
            <li><strong>Volume Spikes</strong> - Identify markets with unusual trading activity</li>
            <li><strong>Whale Activity</strong> - Track large bets from major players</li>
            <li><strong>Odds Shifts</strong> - Catch significant price movements early</li>
            <li><strong>High Conviction</strong> - See where traders have strong opinions</li>
          </ul>
        </section>

        <section>
          <h2>💰 How We Make Money</h2>
          <p>
            We don't handle trades - we send you to Polymarket with referral tracking. 
            When you trade, we earn a small commission (10-20% of trading fees). 
            This keeps us completely free for you!
          </p>
        </section>

        <section>
          <h2>🛠️ Technology</h2>
          <ul>
            <li><strong>Polymarket API</strong> - Free real-time market data</li>
            <li><strong>Helius RPC</strong> - Solana wallet tracking</li>
            <li><strong>Modular Architecture</strong> - Clean, maintainable code</li>
            <li><strong>Zero Blockchain Risk</strong> - No smart contracts, no custody</li>
          </ul>
        </section>

        <section>
          <h2>📊 Our Mission</h2>
          <p>
            Make prediction markets more transparent. Help regular traders see what 
            insiders and whales are doing. Level the playing field.
          </p>
        </section>

        <div className="cta">
          <a href="/" className="btn-primary">
            Start Tracking Smart Money →
          </a>
        </div>
      </div>

      <style jsx>{`
        .about-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        h1 {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 40px;
          text-align: center;
        }

        section {
          margin: 40px 0;
        }

        h2 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #111827;
        }

        p {
          font-size: 18px;
          line-height: 1.8;
          color: #374151;
          margin: 16px 0;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          font-size: 16px;
          line-height: 1.8;
          color: #374151;
          margin: 12px 0;
          padding-left: 24px;
          position: relative;
        }

        li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #3b82f6;
          font-weight: bold;
        }

        .cta {
          text-align: center;
          margin: 60px 0;
        }

        .btn-primary {
          display: inline-block;
          padding: 16px 32px;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 18px;
          transition: background 0.2s;
        }

        .btn-primary:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  )
}

