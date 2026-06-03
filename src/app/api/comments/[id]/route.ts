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

    const { status } = await req.json();

    if (!status || !['Approved', 'Pending', 'Rejected', 'Spam'].includes(status)) {
      return NextResponse.json({ error: 'Invalid comment status' }, { status: 400 });
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(comment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionCookie();
    if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete comment' }, { status: 500 });
  }
}
