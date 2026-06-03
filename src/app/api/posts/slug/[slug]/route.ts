import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Fetch the post and increment view count
    const post = await prisma.post.update({
      where: { slug },
      data: {
        views: { increment: 1 },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true, avatarUrl: true },
        },
        categories: true,
        tags: true,
        seo: true,
        comments: {
          where: { status: 'Approved' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Fetch related posts (latest published posts, excluding current)
    const relatedPosts = await prisma.post.findMany({
      where: {
        published: true,
        id: { not: post.id },
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ post, relatedPosts });
  } catch (error: any) {
    console.error('Fetch post by slug error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch article' }, { status: 404 });
  }
}
