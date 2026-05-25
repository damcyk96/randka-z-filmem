import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { watchedMovies } from '@/drizzle/schema'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })

  const sessionId = session?.user?.id ?? req.cookies.get('session_id')?.value

  if (!sessionId) {
    return NextResponse.json([])
  }

  const movies = await db
    .select()
    .from(watchedMovies)
    .where(eq(watchedMovies.sessionId, sessionId))
    .orderBy(desc(watchedMovies.watchedAt))

  return NextResponse.json(movies)
}

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  const sessionId = session?.user?.id ?? req.cookies.get('session_id')?.value

  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { eq: eqId, and } = await import('drizzle-orm')
  await db
    .delete(watchedMovies)
    .where(
      and(
        eqId(watchedMovies.id, id),
        eqId(watchedMovies.sessionId, sessionId),
      )
    )

  return NextResponse.json({ success: true })
}
