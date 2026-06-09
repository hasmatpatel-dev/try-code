import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { userRoleSchema } from '@/lib/validations';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const methodError = methodGuard(req, ['PUT']);
  if (methodError) return methodError;

  try {
    const { id } = await params;
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin']);
    if (authError) return authError;

    const validation = await validateBody(req, userRoleSchema);
    if (!validation.success) return validation.response;

    const { role } = validation.data;

    // Safety check: Prevent Admin from demoting themselves
    if (session!.user.id === id && role !== 'Admin') {
      return NextResponse.json({ error: 'Administrators cannot demote themselves' }, { status: 400 });
    }

    // Verify user exists
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    return handleServerError(error, 'Failed to update user');
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const methodError = methodGuard(req, ['DELETE']);
  if (methodError) return methodError;

  try {
    const { id } = await params;
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin']);
    if (authError) return authError;

    // Safety check: Prevent Admin from deleting themselves
    if (session!.user.id === id) {
      return NextResponse.json({ error: 'Administrators cannot delete themselves' }, { status: 400 });
    }

    // Verify user exists
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleServerError(error, 'Failed to delete user');
  }
}
