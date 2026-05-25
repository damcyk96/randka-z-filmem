'use client'

import Image from 'next/image'

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

export function HistoryList({ movies }: Props) {
  if (!movies.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🎬</p>
        <p>Nie masz jeszcze żadnych filmów w historii.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {movies.map((m) => (
        <div key={m.id} className="bg-white rounded-xl shadow-sm flex gap-4 p-4 items-center">
          <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden">
            {m.posterUrl ? (
              <Image src={m.posterUrl} alt={m.title} fill className="object-cover" sizes="48px" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg">?</div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{m.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {m.genres?.slice(0, 2).join(', ')}
              {m.runtime ? ` · ${m.runtime} min` : ''}
            </p>
          </div>

          <div className="text-right shrink-0">
            {m.voteAverage && (
              <p className="text-sm font-medium text-gray-700">
                ★ {Number(m.voteAverage).toFixed(1)}
              </p>
            )}
            {m.watchedAt && (
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(m.watchedAt).toLocaleDateString('pl-PL')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
