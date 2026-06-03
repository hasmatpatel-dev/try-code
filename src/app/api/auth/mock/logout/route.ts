import { NextRequest, NextResponse } from 'next/server';
import { deleteSessionCookie } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    await deleteSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to logout' }, { status: 500 });
  }
}
