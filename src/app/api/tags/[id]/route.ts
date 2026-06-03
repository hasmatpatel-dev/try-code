import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionCookie();
    if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();

    const tag = await prisma.tag.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(tag);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update tag' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionCookie();
    if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete tag' }, { status: 500 });
  }
}
