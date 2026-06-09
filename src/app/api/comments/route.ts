import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { commentCreateSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const comments = await prisma.comment.findMany({
      include: {
        post: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error: any) {
    return handleServerError(error, 'Failed to fetch comments');
  }
}

export async function POST(req: NextRequest) {
  const methodError = methodGuard(req, ['POST']);
  if (methodError) return methodError;

  try {
    const validation = await validateBody(req, commentCreateSchema);
    if (!validation.success) return validation.response;

    const { postId, content, authorName, authorEmail } = validation.data;

    // Check if post exists and is published
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post || !post.published) {
      return NextResponse.json({ error: 'Post not found or unavailable' }, { status: 404 });
    }

    // Input sanitization: Strip HTML tags to prevent XSS
    const sanitize = (str: string) => str.replace(/<[^>]*>/g, '').trim();
    const cleanContent = sanitize(content);
    const cleanName = sanitize(authorName);
    const cleanEmail = authorEmail.toLowerCase().trim();

    if (!cleanContent) {
      return NextResponse.json({ error: 'Comment content cannot be empty after sanitization' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        content: cleanContent,
        authorName: cleanName,
        authorEmail: cleanEmail,
        authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
        status: 'Pending', // Requires moderation approval
      },
    });

    return NextResponse.json(comment);
  } catch (error: any) {
    return handleServerError(error, 'Failed to submit comment');
  }
}
