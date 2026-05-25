import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { watchedMovies } from '@/drizzle/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get('session_id')?.value

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
