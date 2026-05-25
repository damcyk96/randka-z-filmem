'use client'

import { Genre } from '@/lib/tmdb'

interface Props {
  genres: Genre[]
  selected: number | null
  onChange: (id: number | null) => void
}

export function GenrePicker({ genres, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Wszystkie
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => onChange(selected === g.id ? null : g.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === g.id
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  )
}
