import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import slugify from 'slugify';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { categoryInputSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    return handleServerError(error, 'Failed to fetch categories');
  }
}

export async function POST(req: NextRequest) {
  const methodError = methodGuard(req, ['POST']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const validation = await validateBody(req, categoryInputSchema);
    if (!validation.success) return validation.response;

    const { name, description, parentId } = validation.data;

    let slug = slugify(name, { lower: true, strict: true });
    const existing = await prisma.category.findUnique({
      where: { slug },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    return handleServerError(error, 'Failed to create category');
  }
}
