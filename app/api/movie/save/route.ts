import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { watchedMovies } from '@/drizzle/schema'
import { auth } from '@/lib/auth'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { tmdbId, title, posterUrl, genres, runtime, overview, voteAverage } = body

  if (!tmdbId || !title) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Try Better Auth session first, fall back to cookie session
  const session = await auth.api.getSession({ headers: req.headers })
  let sessionId: string
  let isNew = false

  if (session?.user?.id) {
    sessionId = session.user.id
  } else {
    sessionId = req.cookies.get('session_id')?.value ?? ''
    if (!sessionId) {
      sessionId = nanoid()
      isNew = true
    }
  }

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
        subject: `Tonight's pick: ${title}`,
        html: `<p>Enjoy the movie! <strong>${title}</strong>${runtime ? ` — ${runtime} min` : ''}</p>`,
      })
    } catch {
      // email is optional
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
