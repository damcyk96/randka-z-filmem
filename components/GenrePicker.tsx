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
      {[{ id: null, name: 'All' }, ...genres].map((g) => {
        const isActive = selected === g.id
        return (
          <button
            key={g.id ?? 'all'}
            onClick={() => onChange(isActive && g.id !== null ? null : g.id)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
            style={
              isActive
                ? { background: 'rgba(99,102,241,0.85)', color: '#fff', border: '1px solid rgba(99,102,241,0.6)' }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {g.name}
          </button>
        )
      })}
    </div>
  )
}
