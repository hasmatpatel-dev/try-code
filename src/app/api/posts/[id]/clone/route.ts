import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole, handleServerError } from '@/lib/api-utils';
import slugify from 'slugify';

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteParams) {
  const methodError = methodGuard(req, ['POST']);
  if (methodError) return methodError;

  try {
    const { id } = await params;
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor', 'Author']);
    if (authError) return authError;

    // Fetch post to clone
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

    // Authors can only clone their own posts
    if (session!.user.role === 'Author' && post.authorId !== session!.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Set cloned properties
    const baseTitle = `${post.title} (Copy)`;
    let slug = slugify(baseTitle, { lower: true, strict: true });
    
    // Ensure slug uniqueness
    const existing = await prisma.post.findUnique({
      where: { slug },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Create cloned post
    const clonedPost = await prisma.post.create({
      data: {
        title: baseTitle,
        slug,
        content: post.content,
        excerpt: post.excerpt,
        published: false, // Default to draft
        publishedAt: null,
        featured: false,
        coverImage: post.coverImage,
        authorId: session!.user.id, // Assigned to the user doing the cloning
        categories: {
          connect: post.categories.map((c) => ({ id: c.id })),
        },
        tags: {
          connect: post.tags.map((t) => ({ id: t.id })),
        },
        seo: post.seo
          ? {
              create: {
                title: post.seo.title ? `${post.seo.title} (Copy)` : undefined,
                description: post.seo.description,
                canonicalUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog/${slug}`,
                ogImage: post.seo.ogImage,
                twitterCard: post.seo.twitterCard,
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

    return NextResponse.json(clonedPost);
  } catch (error: any) {
    return handleServerError(error, 'Failed to clone post');
  }
}
