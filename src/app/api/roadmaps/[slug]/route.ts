import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import slugify from 'slugify';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { roadmapInputSchema } from '@/lib/validations';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const { slug } = await params;
    const roadmap = await prisma.roadmap.findUnique({ where: { slug } });
    if (!roadmap) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }
    return NextResponse.json(roadmap);
  } catch (error: any) {
    return handleServerError(error, 'Failed to fetch roadmap');
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const methodError = methodGuard(req, ['PUT']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const { slug } = await params;
    const existing = await prisma.roadmap.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    const validation = await validateBody(req, roadmapInputSchema);
    if (!validation.success) return validation.response;

    const { title, description, icon, color, category, order, published } = validation.data;

    let newSlug = existing.slug;
    if (title && title !== existing.title) {
      newSlug = slugify(title, { lower: true, strict: true });
      const slugExists = await prisma.roadmap.findFirst({ where: { slug: newSlug, id: { not: existing.id } } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const roadmap = await prisma.roadmap.update({
      where: { id: existing.id },
      data: {
        title: title ?? existing.title,
        slug: newSlug,
        description: description ?? existing.description,
        icon: icon ?? existing.icon,
        color: color ?? existing.color,
        category: category ?? existing.category,
        order: order ?? existing.order,
        published: published ?? existing.published,
      },
    });

    return NextResponse.json(roadmap);
  } catch (error: any) {
    return handleServerError(error, 'Failed to update roadmap');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const methodError = methodGuard(req, ['DELETE']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const { slug } = await params;
    const existing = await prisma.roadmap.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    await prisma.roadmap.delete({ where: { id: existing.id } });
    return NextResponse.json({ message: 'Roadmap deleted successfully' });
  } catch (error: any) {
    return handleServerError(error, 'Failed to delete roadmap');
  }
}
