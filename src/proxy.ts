import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isSupabaseConfigured =
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here';

  let isAuthenticated = false;

  if (isSupabaseConfigured) {
    let response = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    isAuthenticated = !!user;

    // Protect dashboard and CMS sub-routes
    const protectedPaths = ['/dashboard', '/posts', '/categories', '/tags', '/media', '/comments', '/users', '/settings'];
    const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
    if (isProtected && !isAuthenticated) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/auth/login';
      loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith('/auth') && isAuthenticated) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = '/dashboard';
      return NextResponse.redirect(dashboardUrl);
    }

    return response;
  } else {
    // Mock authentication check
    const sessionCookie = request.cookies.get('trycode-session')?.value;
    isAuthenticated = !!sessionCookie;

    // Protect dashboard and CMS sub-routes
    const protectedPaths2 = ['/dashboard', '/posts', '/categories', '/tags', '/media', '/comments', '/users', '/settings'];
    const isProtected2 = protectedPaths2.some((p) => pathname === p || pathname.startsWith(p + '/'));
    if (isProtected2 && !isAuthenticated) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/auth/login';
      loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith('/auth') && isAuthenticated) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = '/dashboard';
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/posts/:path*', '/categories/:path*', '/tags/:path*', '/media/:path*', '/comments/:path*', '/users/:path*', '/settings/:path*', '/auth/:path*'],
};
