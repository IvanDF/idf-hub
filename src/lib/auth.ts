import { cookies } from 'next/headers'
import { DEMO_PASSWORD } from './demo'
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  timingSafeEqual,
  verifySessionToken,
} from './session'

export async function getUser() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  if (await verifySessionToken(session?.value)) {
    return { email: 'admin@idf.dev' }
  }
  return null
}

export async function setSession(): Promise<boolean> {
  const token = await createSessionToken()
  // No signing secret configured -> report it so the login route can fail
  // loudly instead of "succeeding" without ever setting a cookie.
  if (!token) return false
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
  return true
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export function checkPassword(password: string) {
  const admin = process.env.ADMIN_PASSWORD
  if (admin && timingSafeEqual(password, admin)) return true
  // The public demo credential the login page advertises. Safe to accept:
  // the admin API is a mock, nothing a demo session does persists. Sessions
  // still need a signing secret (SESSION_SECRET or ADMIN_PASSWORD) to exist.
  const demo = process.env.DEMO_PASSWORD || DEMO_PASSWORD
  return timingSafeEqual(password, demo)
}
