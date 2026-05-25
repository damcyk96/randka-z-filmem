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
          className="flex gap-4 items-center p-4 rounded-xl transition-colors"
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
          </div>

          <div className="text-right shrink-0">
            {m.voteAverage && (
              <p className="text-sm font-semibold" style={{ color: '#f5c518' }}>
                ★ {Number(m.voteAverage).toFixed(1)}
              </p>
            )}
            {m.watchedAt && (
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {new Date(m.watchedAt).toLocaleDateString('en-GB')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
