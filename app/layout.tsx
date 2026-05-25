import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Randka z filmem',
  description: 'Nie wiesz co oglądać? My wybierzemy za Ciebie.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  )
}
