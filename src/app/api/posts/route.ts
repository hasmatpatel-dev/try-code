import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import slugify from 'slugify';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { postInputSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const session = await getSessionCookie();
    const isAuthenticated = !!(session && session.user);
    const hasModeratorRole = isAuthenticated && ['Admin', 'Editor'].includes(session.user.role);
    const hasAuthorRole = isAuthenticated && session.user.role === 'Author';

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    if (!isAuthenticated) {
      // Unauthenticated users can only see published posts
      where.published = true;
    } else if (hasModeratorRole) {
      // Admins/Editors can view status based on query parameter
      if (status === 'published') {
        where.published = true;
      } else if (status === 'draft') {
        where.published = false;
      }
    } else if (hasAuthorRole) {
      // Authors can view status based on query parameter, but only for their own posts if draft is included
      if (status === 'published') {
        where.published = true;
      } else if (status === 'draft') {
        where.published = false;
        where.authorId = session.user.id;
      } else {
        // 'all': they see all published posts, plus their own drafts
        where.OR = [
          { published: true },
          { authorId: session.user.id }
        ];
        if (search) {
          where.AND = [
            { OR: where.OR },
            { OR: [ { title: { contains: search } }, { content: { contains: search } } ] }
          ];
          delete where.OR;
        }
      }
    } else {
      // Students or other roles can only see published posts
      where.published = true;
    }

    if (category) {
      where.categories = {
        some: { id: category },
      };
    }

    if (tag) {
      where.tags = {
        some: { id: tag },
      };
    }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true, role: true, avatarUrl: true },
          },
          categories: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true } },
          seo: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({ items: posts, totalCount });
  } catch (error: any) {
    return handleServerError(error, 'Failed to fetch posts');
  }
}

export async function POST(req: NextRequest) {
  const methodError = methodGuard(req, ['POST']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor', 'Author']);
    if (authError) return authError;

    const validation = await validateBody(req, postInputSchema);
    if (!validation.success) return validation.response;

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

    // Slugify
    let slug = slugify(title, { lower: true, strict: true });
    const existing = await prisma.post.findUnique({
      where: { slug },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        slug,
        published: published || false,
        publishedAt: published ? new Date() : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        featured: featured || false,
        coverImage,
        authorId: session!.user.id,
        categories:
          categories && categories.length > 0
            ? {
                connect: categories.map((id: string) => ({ id })),
              }
            : undefined,
        tags:
          tags && tags.length > 0
            ? {
                connect: tags.map((id: string) => ({ id })),
              }
            : undefined,
        seo: {
          create: {
            title: seo?.title || title,
            description: seo?.description || excerpt || '',
            canonicalUrl:
              seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog/${slug}`,
            ogImage: seo?.ogImage || coverImage || '',
            twitterCard: seo?.twitterCard || 'summary_large_image',
          },
        },
      },
      include: {
        categories: true,
        tags: true,
        seo: true,
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    return handleServerError(error, 'Failed to create post');
  }
}
