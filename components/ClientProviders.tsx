/**
 * CLIENT PROVIDERS
 * Wraps client-side providers (toast, etc.)
 */

'use client'

import { Toaster } from 'react-hot-toast'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 6000,
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
      />
      {children}
    </>
  )
}

