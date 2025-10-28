/**
 * FLOATING GITBOOK BUTTON
 * Always visible docs link
 */

'use client'

export function FloatingGitBookButton() {
  return (
    <>
      <a
        href="https://polymarks.gitbook.io/polymarks-docs/"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-gitbook-link"
        aria-label="Read documentation"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.82v8c0 4.51-3.08 8.71-8 9.92V4.18z"/>
          <path d="M7 9h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>
        </svg>
      </a>

      <style jsx>{`
        .floating-gitbook-link {
          position: fixed;
          bottom: 92px; /* Above the Twitter button */
          right: 24px;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #10B981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          transition: all 0.3s ease;
          z-index: 1000;
          cursor: pointer;
          text-decoration: none;
        }

        .floating-gitbook-link:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.6);
        }

        .floating-gitbook-link svg {
          width: 24px;
          height: 24px;
        }

        @media (max-width: 768px) {
          .floating-gitbook-link {
            width: 48px;
            height: 48px;
            bottom: 80px; /* Above the Twitter button on mobile */
            right: 20px;
          }

          .floating-gitbook-link svg {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </>
  )
}

