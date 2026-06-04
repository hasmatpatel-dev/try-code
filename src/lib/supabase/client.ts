import { createBrowserClient } from '@supabase/ssr';

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

class MockSupabaseClient {
  auth = {
    getSession: async () => {
      try {
        const res = await fetch('/api/auth/mock/session');
        if (!res.ok) return { data: { session: null }, error: null };
        const session = await res.json();
        return { data: { session }, error: null };
      } catch (err) {
        return { data: { session: null }, error: null };
      }
    },
    signInWithPassword: async ({ email, password }: any) => {
      try {
        const res = await fetch('/api/auth/mock/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { data: { session: null, user: null }, error: new Error(data.error || 'Login failed') };
        }
        return { data: { session: data, user: data.user }, error: null };
      } catch (err: any) {
        return { data: { session: null, user: null }, error: err };
      }
    },
    signUp: async ({ email, password, options }: any) => {
      try {
        const res = await fetch('/api/auth/mock/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name: options?.data?.name || email.split('@')[0],
            role: options?.data?.role || 'Student',
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { data: { session: null, user: null }, error: new Error(data.error || 'Signup failed') };
        }
        return { data: { session: data, user: data.user }, error: null };
      } catch (err: any) {
        return { data: { session: null, user: null }, error: err };
      }
    },
    signOut: async () => {
      try {
        await fetch('/api/auth/mock/logout', { method: 'POST' });
        return { error: null };
      } catch (err: any) {
        return { error: err };
      }
    },
    onAuthStateChange: (callback: any) => {
      // Dummy subscription
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      };
    },
    resend: async (options: any) => {
      return { data: null, error: null };
    },
    signInWithOAuth: async (options: any) => {
      return { data: null, error: null };
    },
    verifyOtp: async (options: any) => {
      return { data: { user: {} as any, session: {} as any }, error: null };
    },
    resetPasswordForEmail: async (email: string, options?: any) => {
      return { data: null, error: null };
    },
  };

  storage = {
    from: (bucket: string) => {
      return {
        upload: async (path: string, file: File, options?: any) => {
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('path', path);
            formData.append('bucket', bucket);

            const res = await fetch('/api/media/upload', {
              method: 'POST',
              body: formData,
            });
            const data = await res.json();
            if (!res.ok) {
              return { data: null, error: new Error(data.error || 'Upload failed') };
            }
            return { data: { path: data.path }, error: null };
          } catch (err: any) {
            return { data: null, error: err };
          }
        },
        getPublicUrl: (path: string) => {
          return {
            data: {
              publicUrl: `/uploads/${bucket}/${path}`,
            },
          };
        },
        list: async (path?: string, options?: any) => {
          try {
            const res = await fetch(`/api/media/list?bucket=${bucket}&path=${path || ''}`);
            const data = await res.json();
            if (!res.ok) {
              return { data: null, error: new Error(data.error || 'List failed') };
            }
            return { data, error: null };
          } catch (err: any) {
            return { data: null, error: err };
          }
        },
        remove: async (paths: string[]) => {
          try {
            const res = await fetch('/api/media/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bucket, paths }),
            });
            const data = await res.json();
            if (!res.ok) {
              return { data: null, error: new Error(data.error || 'Delete failed') };
            }
            return { data, error: null };
          } catch (err: any) {
            return { data: null, error: err };
          }
        },
      };
    },
  };
}

let supabaseInstance: any = null;

export const createClient = (): ReturnType<typeof createBrowserClient> => {
  if (supabaseInstance) return supabaseInstance;

  if (isSupabaseConfigured()) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  } else {
    supabaseInstance = new MockSupabaseClient() as unknown as ReturnType<typeof createBrowserClient>;
  }

  return supabaseInstance;
};

export const supabase = createClient();
