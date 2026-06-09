import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { postInputSchema } from '@/lib/validations';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        categories: true,
        tags: true,
        seo: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Secure draft view
    if (!post.published) {
      const session = await getSessionCookie();
      const isAuthenticated = !!(session && session.user);
      const isAuthorOwner = isAuthenticated && post.authorId === session.user.id;
      const isModerator = isAuthenticated && ['Admin', 'Editor'].includes(session.user.role);

      if (!isAuthorOwner && !isModerator) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 }); // Return 404 to avoid leaking post existence
      }
    }

    return NextResponse.json(post);
  } catch (error: any) {
    return handleServerError(error, 'Failed to fetch post');
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const methodError = methodGuard(req, ['PUT']);
  if (methodError) return methodError;

  try {
    const { id } = await params;
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor', 'Author']);
    if (authError) return authError;

    const validation = await validateBody(req, postInputSchema);
    if (!validation.success) return validation.response;

    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Role check: Author can only edit their own posts
    if (session!.user.role === 'Author' && post.authorId !== session!.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      title,
      content,
      excerpt,
      published,
      coverImage,
      categories,
      tags,
      featured,
      scheduledAt,
      seo,
    } = validation.data;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        published,
        publishedAt: published && !post.published ? new Date() : !published ? null : post.publishedAt,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        featured,
        coverImage,
        categories: categories
          ? {
              set: [],
              connect: categories.map((catId: string) => ({ id: catId })),
            }
          : undefined,
        tags: tags
          ? {
              set: [],
              connect: tags.map((tagId: string) => ({ id: tagId })),
            }
          : undefined,
        seo: seo
          ? {
              upsert: {
                create: {
                  title: seo.title || title,
                  description: seo.description || excerpt || '',
                  canonicalUrl:
                    seo.canonicalUrl ||
                    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog/${post.slug}`,
                  ogImage: seo.ogImage || coverImage || '',
                  twitterCard: seo.twitterCard || 'summary_large_image',
                },
                update: {
                  title: seo.title,
                  description: seo.description,
                  canonicalUrl: seo.canonicalUrl,
                  ogImage: seo.ogImage,
                  twitterCard: seo.twitterCard,
                },
              },
            }
          : undefined,
      },
      include: {
        categories: true,
        tags: true,
        seo: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return handleServerError(error, 'Failed to update post');
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const methodError = methodGuard(req, ['DELETE']);
  if (methodError) return methodError;

  try {
    const { id } = await params;
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor', 'Author']);
    if (authError) return authError;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Role check: Author can only delete their own posts
    if (session!.user.role === 'Author' && post.authorId !== session!.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleServerError(error, 'Failed to delete post');
  }
}
