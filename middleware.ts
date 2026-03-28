import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options as any))
        },
      },
    }
  )

  // DO NOT add any logic between createServerClient and getUser()
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Always allow public pages through — no auth logic whatsoever
  const publicPaths = ['/', '/about', '/privacy', '/terms', '/pricing', '/faq', '/how-it-works']
  if (publicPaths.some(p => pathname === p)) {
    return supabaseResponse
  }

  // Protect app routes
  const protectedPaths = ['/dashboard', '/generate', '/history', '/result', '/settings', '/onboarding', '/smo']
  if (protectedPaths.some(p => pathname.startsWith(p)) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages
  if (['/login', '/signup'].some(p => pathname.startsWith(p)) && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Protect API routes — whitelist public endpoints
  const publicApiPaths = ['/api/stripe/webhook', '/api/dodo/webhook', '/api/gsc/callback', '/api/autopilot/unsubscribe', '/api/autopilot/run']
  if (pathname.startsWith('/api/') &&
      !publicApiPaths.some(p => pathname.startsWith(p)) &&
      !user) {
    return NextResponse.json({ error: 'Giriş tələb olunur' }, { status: 401 })
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
