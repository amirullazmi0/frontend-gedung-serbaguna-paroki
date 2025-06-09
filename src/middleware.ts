import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { useAuth } from './app/hook/auth/useAuth'


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access-token')?.value || ''

  if (!accessToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  useAuth(request).then((res) => {
    if (!res.authenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return NextResponse.next()
  });
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
}