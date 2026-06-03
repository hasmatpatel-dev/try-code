import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionCookie();
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { role } = await req.json();

    if (!role || !['Admin', 'Editor', 'Author', 'Student'].includes(role)) {
      return NextResponse.json({ error: 'Invalid user role' }, { status: 400 });
    }

    // Safety check: Prevent Admin from demoting themselves
    if (session.user.id === id && role !== 'Admin') {
      return NextResponse.json({ error: 'Administrators cannot demote themselves' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionCookie();
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Safety check: Prevent Admin from deleting themselves
    if (session.user.id === id) {
      return NextResponse.json({ error: 'Administrators cannot delete themselves' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
