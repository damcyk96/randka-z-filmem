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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historia</h1>
            <p className="text-gray-500 text-sm mt-1">Filmy które postanowiłeś obejrzeć</p>
          </div>
          <Link href="/" className="text-sm text-indigo-600 hover:underline font-medium">
            ← Losuj
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-gray-400 animate-pulse">Ładuję...</div>
        ) : (
          <HistoryList movies={movies} />
        )}
      </div>
    </main>
  )
}
