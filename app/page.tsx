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
    fetch('/api/movie/random')
      .then((r) => r.json())
      .then(setMovie)
      .catch(() => setError('Nie udało się załadować filmu'))
    fetch('/api/genres')
      .then((r) => r.json())
      .then(setGenres)
      .catch(() => {})
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
        setError(data.error ?? 'Błąd pobierania filmu')
        return
      }
      setMovie(await res.json())
    } catch {
      setError('Błąd połączenia')
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
    } catch {
      // cicho, nie blokujemy UX
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Randka z filmem</h1>
            <p className="text-gray-500 text-sm mt-1">Nie wiesz co oglądać? My wybierzemy za Ciebie.</p>
          </div>
          <Link
            href="/history"
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            Historia →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Gatunek</p>
            <GenrePicker genres={genres} selected={selectedGenre} onChange={setSelectedGenre} />
          </div>
          <RuntimeSlider value={maxRuntime} onChange={setMaxRuntime} />
          <button
            onClick={rollMovie}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {isLoading ? 'Szukam...' : 'Losuj film'}
          </button>
        </div>

        {error && (
          <p className="text-center text-red-500 text-sm">{error}</p>
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

        {isLoading && (
          <div className="bg-white rounded-2xl shadow-lg h-64 flex items-center justify-center text-gray-400 animate-pulse">
            Szukam idealnego filmu...
          </div>
        )}
      </div>
    </main>
  )
}
