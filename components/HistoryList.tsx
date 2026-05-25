'use client'

import Image from 'next/image'
import { useState } from 'react'

interface WatchedMovie {
  id: string
  tmdbId: number
  title: string
  posterUrl: string | null
  genres: string[] | null
  runtime: number | null
  voteAverage: string | null
  watchedAt: string | null
  userRating: number | null
}

interface Props {
  movies: WatchedMovie[]
}

export function HistoryList({ movies: initial }: Props) {
  const [movies, setMovies] = useState(initial)

  const handleDelete = async (id: string) => {
    await fetch('/api/history', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setMovies((prev) => prev.filter((m) => m.id !== id))
  }

  const handleRate = async (id: string, rating: number) => {
    await fetch('/api/movie/rate', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, rating }),
    })
    setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, userRating: rating } : m)))
  }

  if (!movies.length) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🎬</p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          No movies saved yet. Go roll one.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {movies.map((m) => (
        <div
          key={m.id}
          className="flex gap-4 items-center p-4 rounded-xl group transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="relative w-10 h-14 shrink-0 rounded overflow-hidden">
            {m.posterUrl ? (
              <Image src={m.posterUrl} alt={m.title} fill className="object-cover" sizes="40px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>?</div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate" style={{ color: '#fff' }}>{m.title}</p>
            <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {m.genres?.slice(0, 2).join(', ')}
              {m.runtime ? ` · ${m.runtime} min` : ''}
            </p>
            {/* Star rating */}
            <div className="flex gap-0.5 mt-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(m.id, star)}
                  className="text-base transition-transform hover:scale-110"
                  style={{ color: (m.userRating ?? 0) >= star ? '#f5c518' : 'rgba(255,255,255,0.15)' }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-2">
              {m.voteAverage && (
                <p className="text-sm font-semibold" style={{ color: '#f5c518' }}>
                  ★ {Number(m.voteAverage).toFixed(1)}
                </p>
              )}
              <button
                onClick={() => handleDelete(m.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.15)', color: 'rgba(239,68,68,0.8)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                Remove
              </button>
            </div>
            {m.watchedAt && (
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {new Date(m.watchedAt).toLocaleDateString('en-GB')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
