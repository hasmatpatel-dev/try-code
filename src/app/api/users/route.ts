import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole, handleServerError } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin']);
    if (authError) return authError;

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    return handleServerError(error, 'Failed to list users');
  }
}
