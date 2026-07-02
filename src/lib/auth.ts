import { cookies } from 'next/headers'
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

export async function setSession() {
  const token = await createSessionToken()
  if (!token) return
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD
  // No password configured -> admin login is disabled (no baked-in fallback).
  if (!expected) return false
  return timingSafeEqual(password, expected)
}
