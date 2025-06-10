import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { useAuth } from './app/hook/auth/useAuth'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  const accessToken = request.cookies.get('access-token')?.value
  if (!accessToken) {
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  let auth
  try {
    auth = await useAuth()
  } catch (err) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (!auth.authenticated) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/admin') && auth.role !== 'ADMIN') {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/user') && auth.role !== 'USER') {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/super') && auth.role !== 'SUPERADMIN') {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/super/:path*'],
}
