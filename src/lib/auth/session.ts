import { cookies } from 'next/headers';

export async function getSessionCookie() {
  try {
    const cookieStore = await cookies();
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
