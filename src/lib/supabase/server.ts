import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSessionCookie } from '../auth/session';

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

export async function createClient() {
  const cookieStore = await cookies();

  if (isSupabaseConfigured()) {
    return createServerClient(
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
              // The setAll method was called from a Server Component.
              // This can be ignored if there is middleware.
            }
          },
        },
      }
    );
  }

  // Return Mock Server Client
  return {
    auth: {
      getUser: async () => {
        const session = await getSessionCookie();
        if (!session || !session.user) {
          return { data: { user: null }, error: new Error('No session') };
        }
        return { data: { user: session.user }, error: null };
      },
      getSession: async () => {
        const session = await getSessionCookie();
        return { data: { session }, error: null };
      },
      exchangeCodeForSession: async (code: string) => {
        const session = await getSessionCookie();
        if (!session || !session.user) {
          return { data: { user: null, session: null }, error: new Error('No session') };
        }
        return { data: { user: session.user, session }, error: null };
      },
    },
  } as unknown as ReturnType<typeof createServerClient>;
}
