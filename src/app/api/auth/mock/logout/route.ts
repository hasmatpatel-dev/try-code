import { NextRequest, NextResponse } from 'next/server';
import { deleteSessionCookie } from '@/lib/auth/session';
import { methodGuard, guardMockRoute, handleServerError } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  const methodError = methodGuard(req, ['POST']);
  if (methodError) return methodError;

  const mockError = guardMockRoute();
  if (mockError) return mockError;

  try {
    await deleteSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleServerError(error, 'Logout failed');
  }
}
