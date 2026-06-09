import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import slugify from 'slugify';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { tagInputSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(tags);
  } catch (error: any) {
    return handleServerError(error, 'Failed to fetch tags');
  }
}

export async function POST(req: NextRequest) {
  const methodError = methodGuard(req, ['POST']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const validation = await validateBody(req, tagInputSchema);
    if (!validation.success) return validation.response;

    const { name } = validation.data;

    let slug = slugify(name, { lower: true, strict: true });
    const existing = await prisma.tag.findUnique({
      where: { slug },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(tag);
  } catch (error: any) {
    return handleServerError(error, 'Failed to create tag');
  }
}
