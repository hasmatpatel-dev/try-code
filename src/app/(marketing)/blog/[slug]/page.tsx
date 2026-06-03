import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import PostContent from './postContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { seo: true },
    });

    if (!post) return {};

    const fallbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog/${post.slug}`;

    return {
      title: post.seo?.title || `${post.title} | TryCode Blog`,
      description: post.seo?.description || post.excerpt || '',
      alternates: {
        canonical: post.seo?.canonicalUrl || fallbackUrl,
      },
      openGraph: {
        title: post.seo?.title || post.title,
        description: post.seo?.description || post.excerpt || '',
        images: post.seo?.ogImage
          ? [{ url: post.seo.ogImage }]
          : post.coverImage
          ? [{ url: post.coverImage }]
          : [],
      },
      twitter: {
        card: (post.seo?.twitterCard as any) || 'summary_large_image',
        title: post.seo?.title || post.title,
        description: post.seo?.description || post.excerpt || '',
        images: post.seo?.ogImage
          ? [post.seo.ogImage]
          : post.coverImage
          ? [post.coverImage]
          : [],
      },
    };
  } catch (error) {
    return {};
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    // Fetch article and increment views count automatically on request
    post = await prisma.post.update({
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
  } catch (error) {
    notFound();
  }

  if (!post) {
    notFound();
  }

  // Retrieve related posts (latest published articles, excluding current one)
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

  return <PostContent post={post} relatedPosts={relatedPosts} />;
}
