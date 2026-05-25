const BASE = 'https://api.themoviedb.org/3'
const TOKEN = process.env.TMDB_READ_TOKEN!

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  }
}

export interface Genre {
  id: number
  name: string
}

export interface Movie {
  tmdbId: number
  title: string
  posterUrl: string | null
  genres: string[]
  runtime: number | null
  overview: string
  voteAverage: number
  year: string
}

export async function getGenres(): Promise<Genre[]> {
  const res = await fetch(`${BASE}/genre/movie/list?language=pl`, {
    headers: headers(),
    next: { revalidate: 86400 },
  })
  const data = await res.json()
  return data.genres ?? []
}

export async function getRandomMovie(genreId?: number, maxRuntime = 180): Promise<Movie | null> {
  const page = Math.floor(Math.random() * 20) + 1
  const params = new URLSearchParams({
    language: 'pl',
    sort_by: 'vote_count.desc',
    'vote_average.gte': '6',
    'vote_count.gte': '200',
    page: String(page),
    ...(genreId ? { with_genres: String(genreId) } : {}),
    'with_runtime.lte': String(maxRuntime),
    'with_runtime.gte': '60',
  })

  const res = await fetch(`${BASE}/discover/movie?${params}`, {
    headers: headers(),
    cache: 'no-store',
  })
  const data = await res.json()
  const results: any[] = data.results ?? []
  if (!results.length) return null

  const pick = results[Math.floor(Math.random() * results.length)]

  const detailRes = await fetch(`${BASE}/movie/${pick.id}?language=pl`, {
    headers: headers(),
    cache: 'no-store',
  })
  const detail = await detailRes.json()

  return {
    tmdbId: detail.id,
    title: detail.title,
    posterUrl: detail.poster_path ? `https://image.tmdb.org/t/p/w500${detail.poster_path}` : null,
    genres: (detail.genres ?? []).map((g: Genre) => g.name),
    runtime: detail.runtime ?? null,
    overview: detail.overview ?? '',
    voteAverage: detail.vote_average ?? 0,
    year: (detail.release_date ?? '').slice(0, 4),
  }
}
