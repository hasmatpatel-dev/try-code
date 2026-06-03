import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { setSessionCookie } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name || email)}`;

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        role: role || 'Student',
        avatarUrl,
      },
    });

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
    console.error('Mock signup error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
