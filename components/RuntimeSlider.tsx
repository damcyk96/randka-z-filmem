'use client'

interface Props {
  value: number
  onChange: (v: number) => void
}

export function RuntimeSlider({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-20 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Max runtime
      </span>
      <input
        type="range"
        min={60}
        max={240}
        step={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1"
        style={{ accentColor: '#6366f1' }}
      />
      <span className="text-sm font-medium w-16 text-right" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {value} min
      </span>
    </div>
  )
}
