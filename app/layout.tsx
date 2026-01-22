import type { Metadata } from 'next'
import '../styles/globals.css'
import { CommandPaletteProvider } from '@/components/CommandPalette/CommandPaletteProvider'
import { SearchButton } from '@/components/CommandPalette/SearchButton'
import TelemetryProvider from '@/components/TelemetryProvider'

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
      <body className="grid-overlay">
        <CommandPaletteProvider>
          <TelemetryProvider>
            {/* Mobile search button - fixed position */}
            <SearchButton />

            {children}

            {/* Footer with keyboard hint */}
            <footer className="fixed bottom-0 left-0 right-0 p-2 text-center text-[#6c7086] text-xs bg-gradient-to-t from-black to-transparent pointer-events-none">
              <span className="hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 bg-[#1a1a1a] rounded border border-[#252525] mx-1">⌘K</kbd> to search
              </span>
            </footer>
          </TelemetryProvider>
        </CommandPaletteProvider>
      </body>
    </html>
  )
}
