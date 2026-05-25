import { cookies } from 'next/headers'
import { nanoid } from 'nanoid'

export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies()
  const existing = cookieStore.get('session_id')?.value
  if (existing) return existing
  return nanoid()
}
