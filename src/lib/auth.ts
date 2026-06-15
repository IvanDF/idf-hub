import { cookies } from 'next/headers'

const SESSION_COOKIE = 'idf_session'

export async function getUser() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  if (session?.value === 'authenticated') {
    return { email: 'admin@idf.dev' }
  }
  return null
}

export async function setSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || 'wubbalubbadubdub'
  return password === expected
}
