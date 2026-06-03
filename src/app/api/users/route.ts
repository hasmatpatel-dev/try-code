import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionCookie();
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
    return NextResponse.json({ error: error.message || 'Failed to list users' }, { status: 500 });
  }
}
