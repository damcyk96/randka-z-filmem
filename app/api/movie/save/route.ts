import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { watchedMovies } from '@/drizzle/schema'
import { getOrCreateSessionId } from '@/lib/session'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { tmdbId, title, posterUrl, genres, runtime, overview, voteAverage } = body

  if (!tmdbId || !title) {
    return NextResponse.json({ error: 'Brak wymaganych pól' }, { status: 400 })
  }

  let sessionId = req.cookies.get('session_id')?.value
  const isNew = !sessionId
  if (!sessionId) sessionId = nanoid()

  await db.insert(watchedMovies).values({
    sessionId,
    tmdbId: Number(tmdbId),
    title,
    posterUrl: posterUrl ?? null,
    genres: genres ?? [],
    runtime: runtime ? Number(runtime) : null,
    overview: overview ?? '',
    voteAverage: voteAverage ? String(voteAverage) : null,
  })

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: process.env.RESEND_FROM ?? 'randka@resend.dev',
        to: process.env.NOTIFY_EMAIL ?? '',
        subject: `Dziś oglądasz: ${title}`,
        html: `<p>Miłego seansu! <strong>${title}</strong>${runtime ? ` — ${runtime} min` : ''}</p>`,
      })
    } catch {
      // email opcjonalny, ignorujemy błędy
    }
  }

  const response = NextResponse.json({ success: true })
  if (isNew) {
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
  }
  return response
}
