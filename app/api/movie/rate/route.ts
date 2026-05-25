import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { watchedMovies } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  const sessionId = session?.user?.id ?? req.cookies.get('session_id')?.value

  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, rating } = await req.json()
  if (!id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  await db
    .update(watchedMovies)
    .set({ userRating: rating })
    .where(and(eq(watchedMovies.id, id), eq(watchedMovies.sessionId, sessionId)))

  return NextResponse.json({ success: true })
}
