'use client'

interface Props {
  value: number
  onChange: (v: number) => void
}

export function RuntimeSlider({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 w-24 shrink-0">Maks. czas</span>
      <input
        type="range"
        min={60}
        max={240}
        step={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-indigo-600"
      />
      <span className="text-sm font-medium text-gray-700 w-16 text-right">{value} min</span>
    </div>
  )
}
