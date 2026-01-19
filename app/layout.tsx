import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Web3 Privacy Ethereum Cypherpunks Research',
  description: 'Comprehensive research on Web3 privacy projects - real data, zero fabrication, constitutional compliance',
  openGraph: {
    title: 'Web3 Privacy Ethereum Cypherpunks Research',
    description: 'Comprehensive research on Web3 privacy projects',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="grid-overlay">{children}</body>
    </html>
  )
}
