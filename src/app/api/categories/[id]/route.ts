import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { categoryInputSchema } from '@/lib/validations';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const methodError = methodGuard(req, ['PUT']);
  if (methodError) return methodError;

  try {
    const { id } = await params;
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const validation = await validateBody(req, categoryInputSchema);
    if (!validation.success) return validation.response;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const { name, description, parentId } = validation.data;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    return handleServerError(error, 'Failed to update category');
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

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleServerError(error, 'Failed to delete category');
  }
}
