import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'idf_session'

export default function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)
  const isAuthenticated = session?.value === 'authenticated'

  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (request.nextUrl.pathname === '/admin/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
