// Signed admin session tokens, safe for both the Edge middleware and Node
// route handlers (Web Crypto only, no node:crypto).
//
// Token format: "<expiry-epoch-seconds>.<hmac-sha256-hex>". A bare static
// cookie value would let anyone forge a session from devtools; the HMAC
// binds the token to a server-side secret and an expiry.

const SESSION_COOKIE = 'idf_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24

/** Secret for signing sessions. No secret configured -> auth is disabled. */
function getSecret(): string | null {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || null
}

async function hmacHex(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken(): Promise<string | null> {
  const secret = getSecret()
  if (!secret) return null
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS)
  return `${expires}.${await hmacHex(expires, secret)}`
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const secret = getSecret()
  if (!secret) return false

  const dot = token.indexOf('.')
  if (dot < 1) return false
  const expires = token.slice(0, dot)
  const signature = token.slice(dot + 1)

  if (!/^\d+$/.test(expires)) return false
  if (Number(expires) * 1000 < Date.now()) return false

  return timingSafeEqual(signature, await hmacHex(expires, secret))
}

export { SESSION_COOKIE, SESSION_TTL_SECONDS }
