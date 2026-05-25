'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HistoryList } from '@/components/HistoryList'

export default function HistoryPage() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/history')
      .then((r) => r.json())
      .then(setMovies)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <main className="min-h-screen px-4 py-10" style={{ background: '#0a0a0f' }}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#fff' }}>
              Watch History
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Movies you decided to watch
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            ← Roll
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-sm animate-pulse" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Loading...
          </div>
        ) : (
          <HistoryList movies={movies} />
        )}
      </div>
    </main>
  )
}
