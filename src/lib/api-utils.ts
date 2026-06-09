import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export function methodGuard(req: NextRequest, allowedMethods: string[]) {
  if (!allowedMethods.includes(req.method)) {
    return NextResponse.json(
      { error: `Method ${req.method} Not Allowed. Supported methods: ${allowedMethods.join(', ')}` },
      {
        status: 405,
        headers: {
          Allow: allowedMethods.join(', '),
        },
      }
    );
  }
  return null;
}

export async function validateBody<T>(req: NextRequest, schema: z.Schema<T>): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Validation failed',
            details: result.error.issues.map((e: any) => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        ),
      };
    }
    return { success: true, data: result.data };
  } catch (err: any) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      ),
    };
  }
}

export function handleServerError(error: any, defaultMessage: string = 'Internal server error') {
  console.error('API Error:', error);
  const isDev = process.env.NODE_ENV === 'development';
  const errorMessage = isDev ? error?.message || defaultMessage : defaultMessage;
  return NextResponse.json(
    { error: errorMessage },
    { status: 500 }
  );
}

export function requireAuthRole(session: any, allowedRoles: string[]) {
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    !!url &&
    !!key &&
    url !== 'https://your-supabase-project.supabase.co' &&
    key !== 'your-anon-key-here'
  );
}

export function guardMockRoute() {
  if (isSupabaseConfigured() || process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Mock authentication is disabled when Supabase is configured or in production' },
      { status: 403 }
    );
  }
  return null;
}
