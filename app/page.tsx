'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { MovieCard } from '@/components/MovieCard'
import { GenrePicker } from '@/components/GenrePicker'
import { RuntimeSlider } from '@/components/RuntimeSlider'
import { Genre, Movie } from '@/lib/tmdb'

export default function Home() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [maxRuntime, setMaxRuntime] = useState(180)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      fetch('/api/genres').then(r => r.json()).then(setGenres).catch(() => {}),
      fetch('/api/movie/random').then(r => r.json()).then(setMovie).catch(() => setError('Failed to load a movie')),
    ]).finally(() => setIsLoading(false))
  }, [])

  const rollMovie = useCallback(async () => {
    setIsLoading(true)
    setIsSaved(false)
    setError(null)
    const params = new URLSearchParams()
    if (selectedGenre) params.set('genre', String(selectedGenre))
    params.set('max_runtime', String(maxRuntime))

    try {
      const res = await fetch(`/api/movie/random?${params}`)
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'No results for these filters')
        return
      }
      setMovie(await res.json())
    } catch {
      setError('Connection error')
    } finally {
      setIsLoading(false)
    }
  }, [selectedGenre, maxRuntime])

  const saveMovie = async () => {
    if (!movie) return
    setIsSaving(true)
    try {
      await fetch('/api/movie/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
      })
      setIsSaved(true)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen px-4 py-10" style={{ background: '#0a0a0f' }}>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#fff' }}>
              Movie Night
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Can't decide what to watch? Let us pick.
            </p>
          </div>
          <Link
            href="/history"
            className="text-sm font-medium transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            History →
          </Link>
        </div>

        {/* Filters */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Genre
            </p>
            <GenrePicker genres={genres} selected={selectedGenre} onChange={setSelectedGenre} />
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
            <RuntimeSlider value={maxRuntime} onChange={setMaxRuntime} />
          </div>
          <button
            onClick={rollMovie}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: isLoading ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.9)',
              color: '#fff',
              border: '1px solid rgba(99,102,241,0.4)',
            }}
          >
            {isLoading ? 'Finding a movie...' : 'Roll'}
          </button>
        </div>

        {error && (
          <p className="text-center text-sm" style={{ color: 'rgba(248,113,113,0.8)' }}>{error}</p>
        )}

        {/* Movie card */}
        {isLoading && (
          <div
            className="rounded-2xl h-64 flex items-center justify-center text-sm animate-pulse"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}
          >
            Finding the perfect movie...
          </div>
        )}

        {movie && !isLoading && (
          <MovieCard
            movie={movie}
            onRoll={rollMovie}
            onSave={saveMovie}
            isSaving={isSaving}
            isSaved={isSaved}
          />
        )}
      </div>
    </main>
  )
}
