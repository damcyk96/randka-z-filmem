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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col sm:flex-row gap-0">
      <div className="relative w-full sm:w-56 shrink-0 h-64 sm:h-auto">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 224px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">
            ?
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between p-6 flex-1">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{movie.title}</h2>
            {movie.year && (
              <span className="text-sm text-gray-400 shrink-0">{movie.year}</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="font-medium text-gray-700">{Number(movie.voteAverage).toFixed(1)}</span>
            </span>
            {movie.runtime && <span>{movie.runtime} min</span>}
            {movie.genres.slice(0, 3).map((g) => (
              <span key={g} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
                {g}
              </span>
            ))}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{movie.overview}</p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onRoll}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Losuj jeszcze
          </button>
          <button
            onClick={onSave}
            disabled={isSaving || isSaved}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
              isSaved
                ? 'bg-green-100 text-green-700 cursor-default'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60'
            }`}
          >
            {isSaved ? 'Zapisano!' : isSaving ? 'Zapisuję...' : 'Oglądam to'}
          </button>
        </div>
      </div>
    </div>
  )
}
