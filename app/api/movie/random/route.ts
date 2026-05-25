import { NextRequest, NextResponse } from 'next/server'
import { getRandomMovie } from '@/lib/tmdb'

export async function GET(req: NextRequest) {
  const genre = req.nextUrl.searchParams.get('genre')
  const maxRuntime = req.nextUrl.searchParams.get('max_runtime')

  const movie = await getRandomMovie(
    genre ? Number(genre) : undefined,
    maxRuntime ? Number(maxRuntime) : 180
  )

  if (!movie) {
    return NextResponse.json({ error: 'Brak wyników dla tych filtrów' }, { status: 404 })
  }

  return NextResponse.json(movie)
}
