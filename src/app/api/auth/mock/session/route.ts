import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionCookie();
    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get session' }, { status: 500 });
  }
}
