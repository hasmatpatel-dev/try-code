import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import slugify from 'slugify';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    if (status === 'published') {
      where.published = true;
    } else if (status === 'draft') {
      where.published = false;
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
    console.error('Fetch posts API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
      categories, // Array of Category IDs
      tags, // Array of Tag IDs
      featured,
      scheduledAt,
      seo,
    } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

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
        authorId: session.user.id,
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
    console.error('Create post API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create post' }, { status: 500 });
  }
}
