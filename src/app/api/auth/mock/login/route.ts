import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { setSessionCookie } from '@/lib/auth/session';
import { methodGuard, guardMockRoute, handleServerError } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  const methodError = methodGuard(req, ['POST']);
  if (methodError) return methodError;

  const mockError = guardMockRoute();
  if (mockError) return mockError;

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user in SQLite database
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Auto-create default administrator account on first login attempt
    if (!user && email.toLowerCase() === 'admin@trycode.com' && password === 'admin123') {
      user = await prisma.user.create({
        data: {
          email: 'admin@trycode.com',
          name: 'Administrator',
          role: 'Admin',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found. Please register.' }, { status: 401 });
    }

    // Mock validation: admin must use admin123, others must use 'password' or any password for mock purposes
    if (user.email === 'admin@trycode.com' && password !== 'admin123') {
      return NextResponse.json({ error: 'Invalid password for Admin' }, { status: 401 });
    }

    const session = {
      access_token: `mock-token-${user.id}-${Date.now()}`,
      token_type: 'bearer',
      expires_in: 3600 * 24 * 7, // 7 days
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        user_metadata: {
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
        },
      },
    };

    await setSessionCookie(session);

    return NextResponse.json(session);
  } catch (error: any) {
    return handleServerError(error, 'Login failed');
  }
}
