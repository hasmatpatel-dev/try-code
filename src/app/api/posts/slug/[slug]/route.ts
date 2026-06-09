import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, handleServerError } from '@/lib/api-utils';

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const { slug } = await params;

    // Fetch the post first to inspect published status without changing views count first
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Secure draft view
    if (!existingPost.published) {
      const session = await getSessionCookie();
      const isAuthenticated = !!(session && session.user);
      const isAuthorOwner = isAuthenticated && existingPost.authorId === session.user.id;
      const isModerator = isAuthenticated && ['Admin', 'Editor'].includes(session.user.role);

      if (!isAuthorOwner && !isModerator) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
    }

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
    return handleServerError(error, 'Failed to fetch article');
  }
}
