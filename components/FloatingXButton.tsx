/**
 * FLOATING X (TWITTER) BUTTON
 * Always visible social link
 */

'use client'

export function FloatingXButton() {
  return (
    <>
      <a
        href="https://x.com/polymarksBSC"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-x-link"
        aria-label="Follow us on X"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      <style jsx>{`
        .floating-x-link {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          transition: all 0.3s ease;
          z-index: 1000;
          cursor: pointer;
          text-decoration: none;
        }

        .floating-x-link:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.6);
        }

        .floating-x-link svg {
          width: 24px;
          height: 24px;
        }

        @media (max-width: 768px) {
          .floating-x-link {
            width: 48px;
            height: 48px;
            bottom: 20px;
            right: 20px;
          }

          .floating-x-link svg {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </>
  )
}

