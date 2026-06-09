import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { commentStatusSchema } from '@/lib/validations';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const methodError = methodGuard(req, ['PUT']);
  if (methodError) return methodError;

  try {
    const { id } = await params;
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const validation = await validateBody(req, commentStatusSchema);
    if (!validation.success) return validation.response;

    const { status } = validation.data;

    // Verify comment exists
    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(comment);
  } catch (error: any) {
    return handleServerError(error, 'Failed to update comment');
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const methodError = methodGuard(req, ['DELETE']);
  if (methodError) return methodError;

  try {
    const { id } = await params;
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    // Verify comment exists
    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleServerError(error, 'Failed to delete comment');
  }
}
