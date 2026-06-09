import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, guardMockRoute, handleServerError } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  const mockError = guardMockRoute();
  if (mockError) return mockError;

  try {
    const session = await getSessionCookie();
    return NextResponse.json(session);
  } catch (error: any) {
    return handleServerError(error, 'Failed to retrieve session');
  }
}
