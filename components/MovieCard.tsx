'use client'

import Image from 'next/image'
import { Movie } from '@/lib/tmdb'

interface Props {
  movie: Movie
  onRoll: () => void
  onSave: () => void
  isSaving: boolean
  isSaved: boolean
}

export function MovieCard({ movie, onRoll, onSave, isSaving, isSaved }: Props) {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Backdrop blur background */}
      {movie.backdropUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={movie.backdropUrl}
            alt=""
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,15,0.98) 40%, rgba(10,10,15,0.7) 100%)' }} />
        </div>
      )}

      <div className="relative z-10 flex gap-0 flex-col sm:flex-row">
        {/* Poster */}
        <div className="relative w-full sm:w-48 shrink-0 h-56 sm:h-auto">
          {movie.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover sm:rounded-l-2xl"
              sizes="(max-width: 640px) 100vw, 192px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              🎬
            </div>
          )}
          {/* Gradient overlay on poster bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 sm:hidden" style={{ background: 'linear-gradient(to top, #0a0a0f, transparent)' }} />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between p-6 flex-1 min-w-0">
          <div>
            <div className="flex items-start gap-3 justify-between mb-3">
              <h2 className="text-2xl font-bold leading-tight" style={{ color: '#fff' }}>
                {movie.title}
              </h2>
              {movie.year && (
                <span className="text-sm shrink-0 mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {movie.year}
                </span>
              )}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#f5c518' }}>
                <span>★</span>
                <span>{Number(movie.voteAverage).toFixed(1)}</span>
              </span>
              {movie.runtime && (
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {movie.runtime} min
                </span>
              )}
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              {movie.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-sm leading-relaxed line-clamp-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {movie.overview}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onRoll}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            >
              Roll again
            </button>
            <button
              onClick={onSave}
              disabled={isSaving || isSaved}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={
                isSaved
                  ? { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }
                  : { background: 'rgba(99,102,241,0.9)', border: '1px solid rgba(99,102,241,0.5)', color: '#fff' }
              }
            >
              {isSaved ? '✓ Saved' : isSaving ? 'Saving...' : "I'll watch this"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
