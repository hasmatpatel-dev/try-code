import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
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

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionCookie();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    } = await req.json();

    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Role check: Author can only edit their own posts
    if (session.user.role === 'Author' && post.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
    console.error('Update post API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionCookie();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Role check: Author can only delete their own posts
    if (session.user.role === 'Author' && post.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete post API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete post' }, { status: 500 });
  }
}
