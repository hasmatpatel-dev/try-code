import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import slugify from 'slugify';

export async function GET(req: NextRequest) {
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
    return NextResponse.json({ error: error.message || 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionCookie();
    if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

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
    return NextResponse.json({ error: error.message || 'Failed to create tag' }, { status: 500 });
  }
}
