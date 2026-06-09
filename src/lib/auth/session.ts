import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    !!url &&
    !!key &&
    url !== 'https://your-supabase-project.supabase.co' &&
    key !== 'your-anon-key-here'
  );
};

export async function getSessionCookie() {
  try {
    const cookieStore = await cookies();

    if (isSupabaseConfigured()) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                );
              } catch {
                // Ignore if called from Server Component
              }
            },
          },
        }
      );

      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;

      return {
        access_token: '',
        user: {
          id: user.id,
          email: user.email,
          role: user.user_metadata?.role || 'Student',
          user_metadata: {
            name: user.user_metadata?.name || user.email?.split('@')[0],
            avatarUrl: user.user_metadata?.avatarUrl || user.user_metadata?.avatar_url || null,
            role: user.user_metadata?.role || 'Student',
          },
        },
      };
    }

    const sessionData = cookieStore.get('trycode-session')?.value;
    if (!sessionData) return null;
    return JSON.parse(sessionData);
  } catch (error) {
    return null;
  }
}

export async function setSessionCookie(session: any) {
  const cookieStore = await cookies();
  cookieStore.set('trycode-session', JSON.stringify(session), {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('trycode-session');
}
