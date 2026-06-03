import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import slugify from 'slugify';

export async function GET(req: NextRequest) {
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
    return NextResponse.json({ error: error.message || 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionCookie();
    if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, parentId } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

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
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
  }
}
